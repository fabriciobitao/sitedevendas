import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductsContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartContext = createContext();

const API_URL = import.meta.env.VITE_ORDER_API_URL || '';
const MAX_QTY_PER_ITEM = 999;

const toNumber = (v) => {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(',', '.'));
    return isFinite(n) ? n : null;
  }
  return null;
};

const clampQty = (q) => {
  const n = parseInt(q, 10);
  if (!isFinite(n) || n <= 0) return 0;
  return Math.min(n, MAX_QTY_PER_ITEM);
};

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
  const [sendError, setSendError] = useState(null);
  const [authGate, setAuthGate] = useState(null);
  const sentTimerRef = useRef(null);
  const lastUserRef = useRef(user?.uid || null);

  const triggerAuthGate = useCallback(() => {
    setAuthGate({ message: 'Você precisa se logar para realizar os pedidos!', ts: Date.now() });
  }, []);
  const clearAuthGate = useCallback(() => setAuthGate(null), []);

  useEffect(() => {
    try { localStorage.setItem('cart_items', JSON.stringify(items)); } catch {}
  }, [items]);

  // Limpa carrinho se o usuario mudou (logout/troca de usuario no mesmo browser)
  useEffect(() => {
    const currentUid = user?.uid || null;
    if (lastUserRef.current !== null && currentUid !== lastUserRef.current) {
      setItems([]);
    }
    lastUserRef.current = currentUid;
  }, [user]);

  // Ao hidratar ou quando catalogo atualizar, remove itens esgotados e sincroniza precos
  useEffect(() => {
    if (!products || products.length === 0) return;
    setItems(prev => {
      if (prev.length === 0) return prev;
      const next = [];
      let changed = false;
      for (const item of prev) {
        const live = products.find(p =>
          p.id === item.id || p.legacyId === item.id || p.firestoreId === item.id
        );
        if (!live) { next.push(item); continue; }
        if (live.outOfStock) { changed = true; continue; }
        const livePrice = toNumber(live.price);
        const currentPrice = toNumber(item.price);
        if (livePrice !== currentPrice) changed = true;
        next.push({ ...item, price: livePrice, unit: live.unit || item.unit, name: live.name || item.name });
      }
      return changed ? next : prev;
    });
  }, [products]);

  const addItem = useCallback((product, qty = 1) => {
    if (!user) {
      triggerAuthGate();
      return false;
    }
    if (product?.outOfStock) {
      return false;
    }
    const safeQty = clampQty(qty);
    if (safeQty === 0) return false;
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: clampQty(item.quantity + safeQty) }
            : item
        );
      }
      return [...prev, { ...product, price: toNumber(product.price), quantity: safeQty }];
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
    const safe = clampQty(quantity);
    if (safe === 0) {
      setItems(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity: safe } : item)
    );
  }, [user, triggerAuthGate]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => {
    const p = toNumber(item.price);
    return sum + (p ?? 0) * item.quantity;
  }, 0);
  const hasItemsWithoutPrice = items.some(item => toNumber(item.price) == null);

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
      const p = toNumber(item.price);
      msg += `▸ ${item.name}\n`;
      msg += `  Qtd: ${item.quantity}`;
      if (p != null) {
        msg += ` — R$ ${(p * item.quantity).toFixed(2)}`;
      }
      msg += '\n\n';
    });
    msg += `──────────────\n`;
    msg += `📋 Itens: ${totalItems}`;
    if (totalPrice > 0) {
      msg += `\n💰 *Total: R$ ${totalPrice.toFixed(2)}*`;
    }
    if (observations && observations.trim()) {
      msg += `\n\n📝 *Observações:* ${observations.trim()}`;
    }

    return msg;
  }, [items, totalItems, totalPrice, hasItemsWithoutPrice]);

  const saveWithRetry = useCallback(async (payloadBuilder, collectionName, attempts = 3) => {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        const docRef = await addDoc(collection(db, collectionName), payloadBuilder());
        return docRef.id;
      } catch (err) {
        lastErr = err;
        if (i < attempts - 1) {
          await new Promise(r => setTimeout(r, 500 * Math.pow(2, i)));
        }
      }
    }
    throw lastErr;
  }, []);

  const buildOrderPayload = useCallback(() => ({
    customerId: user.uid,
    customerName: customerProfile?.nomeFantasia || customerProfile?.nomeResponsavel || user.email,
    customerCnpj: customerProfile?.cnpj || customerProfile?.cpf || '',
    items: items.map(item => {
      const p = toNumber(item.price);
      return {
        productId: item.id,
        name: item.name,
        price: p,
        unit: item.unit || '',
        quantity: item.quantity,
        subtotal: p != null ? p * item.quantity : null,
      };
    }),
    totalPrice,
    totalItems,
    hasItemsWithoutPrice,
    status: 'enviado',
    createdAt: serverTimestamp(),
  }), [user, customerProfile, items, totalPrice, totalItems, hasItemsWithoutPrice]);

  const buildLeadPayload = useCallback(() => {
    let sid = localStorage.getItem('guest_sid');
    if (!sid) {
      sid = (crypto.randomUUID && crypto.randomUUID()) || `sid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('guest_sid', sid);
    }
    return {
      sessionId: sid,
      items: items.map(item => {
        const p = toNumber(item.price);
        return {
          productId: item.id,
          name: item.name,
          price: p,
          unit: item.unit || '',
          quantity: item.quantity,
          subtotal: p != null ? p * item.quantity : null,
        };
      }),
      totalPrice,
      totalItems,
      hasItemsWithoutPrice,
      status: 'enviado',
      source: 'guest-cart',
      userAgent: (navigator.userAgent || '').slice(0, 200),
      createdAt: serverTimestamp(),
    };
  }, [items, totalPrice, totalItems, hasItemsWithoutPrice]);

  const openWhatsApp = useCallback((message) => {
    const phone = '+5535998511194';
    const u = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    const w = window.open(u, '_blank', 'noopener,noreferrer');
    if (!w || w.closed) window.location.href = u;
  }, []);

  const sendOrder = useCallback(async (observations) => {
    if (sending || sent) return;
    if (items.length === 0) return;

    setSending(true);
    setSendError(null);

    const customerInfo = customerProfile ? {
      name: customerProfile.nomeFantasia || customerProfile.nomeResponsavel,
      doc: customerProfile.cnpj || customerProfile.cpf,
    } : null;

    const message = generateMessage(customerInfo, observations);
    if (!message) {
      setSending(false);
      return;
    }

    // Salva no Firestore com retry antes de abrir WhatsApp
    let orderId = null;
    try {
      if (user) {
        orderId = await saveWithRetry(buildOrderPayload, 'orders');
      } else {
        orderId = await saveWithRetry(buildLeadPayload, 'leads');
      }
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
      setSending(false);
      setSendError('Não foi possível salvar o pedido. Verifique sua conexão e tente novamente.');
      return;
    }

    // Abre WhatsApp
    if (API_URL) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, orderId }),
        });
        if (!res.ok) throw new Error('Falha no envio');
      } catch {
        openWhatsApp(message);
      }
    } else {
      openWhatsApp(message);
    }

    setSending(false);
    setSent(true);

    if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
    sentTimerRef.current = setTimeout(() => {
      setItems([]);
      setSent(false);
      setIsOpen(false);
      sentTimerRef.current = null;
    }, 60000);
  }, [sending, sent, items, user, customerProfile, generateMessage, buildOrderPayload, buildLeadPayload, saveWithRetry, openWhatsApp]);

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

  const clearSendError = useCallback(() => setSendError(null), []);

  const loadOrder = useCallback((orderItems) => {
    const newItems = [];
    const warnings = [];

    for (const orderItem of orderItems) {
      const currentProduct = products.find(p =>
        p.id === orderItem.productId ||
        p.legacyId === orderItem.productId ||
        p.firestoreId === orderItem.productId ||
        p.name === orderItem.name
      );
      if (!currentProduct) {
        warnings.push(`${orderItem.name} (indisponível)`);
        continue;
      }
      if (currentProduct.outOfStock) {
        warnings.push(`${orderItem.name} (esgotado)`);
        continue;
      }
      newItems.push({
        ...currentProduct,
        price: toNumber(currentProduct.price),
        quantity: clampQty(orderItem.quantity) || 1
      });
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
      sendError,
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
      clearSendError,
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
