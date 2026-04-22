import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useProducts } from '../context/ProductsContext';
import ProductCard from './ProductCard';
import './TopProducts.css';

export default function TopProducts({ onAdded }) {
  const { products } = useProducts();
  const [topIds, setTopIds] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'config', 'topProducts'));
        if (!alive) return;
        const items = snap.exists() ? (snap.data().items || []) : [];
        setTopIds(items.map((it) => it.productId));
      } catch {
        if (alive) setTopIds([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (topIds.length === 0 || products.length === 0) return null;

  const topProducts = topIds
    .map((id) => products.find((p) => p.id === id || p.legacyId === id || p.firestoreId === id))
    .filter((p) => p && !p.outOfStock)
    .slice(0, 8);

  if (topProducts.length === 0) return null;

  return (
    <section className="top-products">
      <div className="top-products-header">
        <h2 className="top-products-title">
          <span className="top-products-icon" aria-hidden>🔥</span>
          Mais Pedidos
        </h2>
        <p className="top-products-sub">Os itens que nossos clientes mais compram</p>
      </div>
      <div className="top-products-grid">
        {topProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onAdded={onAdded} />
        ))}
      </div>
    </section>
  );
}
