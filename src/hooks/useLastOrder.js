import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useLastOrder(user) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setOrder(null); return; }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const snap = await getDocs(q);
        if (cancelled) return;
        const doc = snap.docs[0];
        setOrder(doc ? { id: doc.id, ...doc.data() } : null);
      } catch (err) {
        console.error('Erro ao carregar ultimo pedido:', err);
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.uid]);

  return { order, loading };
}
