import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { products } from '../data/products';

const CartContext = createContext();

const API_URL = import.meta.env.VITE_ORDER_API_URL || '';

export function CartProvider({ children }) {
  const { user, customerProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const hasItemsWithoutPrice = items.some(item => item.price == null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const generateMessage = useCallback((customerInfo) => {
    if (items.length === 0) return '';

    let msg = '🛒 *Pedido - Frios Ouro Fino*\n\n';

    if (customerInfo) {
      msg += `👤 *Cliente:* ${customerInfo.name}`;
      if (customerInfo.doc) msg += ` (${customerInfo.doc})`;
      msg += '\n\n';
    }

    items.forEach(item => {
      msg += `▸ ${item.name}\n`;
      if (item.price != null) {
        msg += `  Qtd: ${item.quantity} × R$ ${item.price.toFixed(2)} = R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
      } else {
        msg += `  Qtd: ${item.quantity} (preço a consultar)\n\n`;
      }
    });
    msg += `──────────────\n`;
    if (hasItemsWithoutPrice) {
      msg += `*Subtotal itens com preço: R$ ${totalPrice.toFixed(2)}*\n`;
      msg += `⚠️ Alguns itens precisam de consulta de preço\n\n`;
    } else {
      msg += `*Total: R$ ${totalPrice.toFixed(2)}*\n\n`;
    }
    msg += `📋 Itens: ${totalItems}`;

    return msg;
  }, [items, totalPrice, totalItems, hasItemsWithoutPrice]);

  const saveOrderToFirestore = useCallback(async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'orders'), {
        customerId: user.uid,
        customerName: customerProfile?.nomeFantasia || customerProfile?.nomeResponsavel || user.email,
        customerCnpj: customerProfile?.cnpj || customerProfile?.cpf || '',
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          subtotal: item.price ? item.price * item.quantity : null,
        })),
        totalPrice,
        totalItems,
        hasItemsWithoutPrice,
        status: 'enviado',
        whatsappSent: true,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
    }
  }, [user, customerProfile, items, totalPrice, totalItems, hasItemsWithoutPrice]);

  const sendOrder = useCallback(async () => {
    const customerInfo = customerProfile ? {
      name: customerProfile.nomeFantasia || customerProfile.nomeResponsavel,
      doc: customerProfile.cnpj || customerProfile.cpf,
    } : null;

    const message = generateMessage(customerInfo);
    if (!message) return;

    // Salva no Firestore se logado
    if (user) {
      await saveOrderToFirestore();
    }

    // Envia via WhatsApp
    if (API_URL) {
      setSending(true);
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        if (!res.ok) throw new Error('Falha no envio');
        setSent(true);
        setItems([]);
        setTimeout(() => {
          setSent(false);
          setIsOpen(false);
        }, 3000);
      } catch {
        const phone = '5535998511194';
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        setItems([]);
        setIsOpen(false);
      } finally {
        setSending(false);
      }
    } else {
      const phone = '5535998511194';
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
      setItems([]);
      setIsOpen(false);
    }
  }, [generateMessage, user, saveOrderToFirestore]);

  const loadOrder = useCallback((orderItems) => {
    const newItems = [];
    const warnings = [];

    for (const orderItem of orderItems) {
      const currentProduct = products.find(p => p.id === orderItem.productId);
      if (currentProduct) {
        newItems.push({ ...currentProduct, quantity: orderItem.quantity });
      } else {
        warnings.push(orderItem.name);
      }
    }

    setItems(newItems);
    setIsOpen(true);
    return warnings;
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      totalItems,
      totalPrice,
      hasItemsWithoutPrice,
      sending,
      sent,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      sendOrder,
      loadOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
