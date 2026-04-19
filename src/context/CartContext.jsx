import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductsContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartContext = createContext();

const API_URL = import.meta.env.VITE_ORDER_API_URL || '';

export function CartProvider({ children }) {
  const { user, customerProfile } = useAuth();
  const { products } = useProducts();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [authGate, setAuthGate] = useState(null); // { message, ts } quando acao bloqueada por falta de login
  const sentTimerRef = useRef(null);

  const triggerAuthGate = useCallback(() => {
    setAuthGate({ message: 'Você precisa se logar para realizar os pedidos!', ts: Date.now() });
  }, []);
  const clearAuthGate = useCallback(() => setAuthGate(null), []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    try { localStorage.setItem('cart_items', JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    if (!user) {
      triggerAuthGate();
      return false;
    }
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
    return true;
  }, [user, triggerAuthGate]);

  const removeItem = useCallback((productId) => {
    if (!user) {
      triggerAuthGate();
      return;
    }
    setItems(prev => prev.filter(item => item.id !== productId));
  }, [user, triggerAuthGate]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (!user) {
      triggerAuthGate();
      return;
    }
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [user, triggerAuthGate]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const hasItemsWithoutPrice = items.some(item => item.price == null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const generateMessage = useCallback((customerInfo, observations) => {
    if (items.length === 0) return '';

    let msg = '🛒 *Pedido - Frios Ouro Fino*\n\n';

    if (customerInfo) {
      msg += `👤 *Cliente:* ${customerInfo.name}`;
      if (customerInfo.doc) msg += ` (${customerInfo.doc})`;
      msg += '\n\n';
    }

    items.forEach(item => {
      msg += `▸ ${item.name}\n`;
      msg += `  Qtd: ${item.quantity}`;
      if (item.price != null) {
        msg += ` — R$ ${(item.price * item.quantity).toFixed(2)}`;
      }
      msg += '\n\n';
    });
    msg += `──────────────\n`;
    msg += `📋 Itens: ${totalItems}`;
    if (totalPrice > 0) {
      msg += `\n💰 *Total: R$ ${totalPrice.toFixed(2)}*`;
    }
    if (hasItemsWithoutPrice) {
      msg += `\n⚠️ Alguns itens com preço a consultar`;
    }
    if (observations && observations.trim()) {
      msg += `\n\n📝 *Observações:* ${observations.trim()}`;
    }

    return msg;
  }, [items, totalItems, totalPrice, hasItemsWithoutPrice]);

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

  const saveGuestLead = useCallback(async () => {
    if (user) return;
    try {
      let sid = localStorage.getItem('guest_sid');
      if (!sid) {
        sid = (crypto.randomUUID && crypto.randomUUID()) || `sid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('guest_sid', sid);
      }
      await addDoc(collection(db, 'leads'), {
        sessionId: sid,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price || null,
          unit: item.unit || '',
          quantity: item.quantity,
          subtotal: item.price ? item.price * item.quantity : null,
        })),
        totalPrice,
        totalItems,
        hasItemsWithoutPrice,
        status: 'enviado',
        whatsappSent: true,
        source: 'guest-cart',
        userAgent: (navigator.userAgent || '').slice(0, 200),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
    }
  }, [user, items, totalPrice, totalItems, hasItemsWithoutPrice]);

  const sendOrder = useCallback(async (observations) => {
    const customerInfo = customerProfile ? {
      name: customerProfile.nomeFantasia || customerProfile.nomeResponsavel,
      doc: customerProfile.cnpj || customerProfile.cpf,
    } : null;

    const message = generateMessage(customerInfo, observations);
    if (!message) return;

    // Salva no Firestore: orders/ para logados, leads/ para visitantes (captura de lead)
    if (user) {
      await saveOrderToFirestore();
    } else {
      await saveGuestLead();
    }

    const openWhatsApp = () => {
      const phone = '+5535998511194';
      const u = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
      const w = window.open(u, '_blank');
      if (!w) window.location.href = u;
    };

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
      } catch {
        openWhatsApp();
      } finally {
        setSending(false);
      }
    } else {
      openWhatsApp();
    }

    // Feedback de sucesso — carrinho preservado ate o usuario confirmar ou 15s passarem.
    // Evita perda de pedido no iOS se o popup do WhatsApp for bloqueado.
    setSent(true);
    if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
    sentTimerRef.current = setTimeout(() => {
      setItems([]);
      setSent(false);
      setIsOpen(false);
      sentTimerRef.current = null;
    }, 15000);
  }, [generateMessage, user, saveOrderToFirestore, saveGuestLead]);

  const confirmSent = useCallback(() => {
    if (sentTimerRef.current) {
      clearTimeout(sentTimerRef.current);
      sentTimerRef.current = null;
    }
    setItems([]);
    setSent(false);
    setIsOpen(false);
  }, []);

  const cancelSent = useCallback(() => {
    if (sentTimerRef.current) {
      clearTimeout(sentTimerRef.current);
      sentTimerRef.current = null;
    }
    setSent(false);
  }, []);

  const loadOrder = useCallback((orderItems) => {
    const newItems = [];
    const warnings = [];

    for (const orderItem of orderItems) {
      // Buscar por legacyId, firestoreId ou nome
      const currentProduct = products.find(p =>
        p.id === orderItem.productId ||
        p.legacyId === orderItem.productId ||
        p.firestoreId === orderItem.productId ||
        p.name === orderItem.name
      );
      if (currentProduct) {
        newItems.push({ ...currentProduct, quantity: orderItem.quantity });
      } else {
        warnings.push(orderItem.name);
      }
    }

    setItems(newItems);
    setIsOpen(true);
    return warnings;
  }, [products]);

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
      confirmSent,
      cancelSent,
      loadOrder,
      authGate,
      clearAuthGate,
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
