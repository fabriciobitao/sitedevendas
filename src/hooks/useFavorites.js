import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_PREFIX = 'favorites_';

const keyFor = (uid) => `${STORAGE_PREFIX}${uid || 'guest'}`;

const read = (k) => {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (k, list) => {
  try { localStorage.setItem(k, JSON.stringify(list)); } catch {}
};

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(() => read(keyFor(user?.uid)));

  useEffect(() => {
    setFavorites(read(keyFor(user?.uid)));
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === keyFor(user?.uid)) {
        setFavorites(read(keyFor(user?.uid)));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [user]);

  const toggle = useCallback((productId) => {
    if (productId == null) return;
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [productId, ...prev];
      write(keyFor(user?.uid), next);
      return next;
    });
  }, [user]);

  const isFavorite = useCallback((productId) => favorites.includes(productId), [favorites]);

  return { favorites, toggle, isFavorite, count: favorites.length };
}
