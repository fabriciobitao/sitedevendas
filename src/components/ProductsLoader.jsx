import { useEffect, useState, useRef } from 'react';
import './ProductsLoader.css';

export default function ProductsLoader({ done }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [fading, setFading] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const tick = (now) => {
      const elapsed = (now - startRef.current) / 1000;
      const target = done ? 100 : Math.min(92, 100 * (1 - Math.exp(-elapsed / 0.9)));
      setProgress((prev) => {
        const next = prev + (target - prev) * 0.18;
        return Math.abs(next - target) < 0.05 ? target : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const t1 = setTimeout(() => setFading(true), 280);
    const t2 = setTimeout(() => setHidden(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [done]);

  if (hidden) return null;

  const pct = Math.round(progress);

  return (
    <div className={`products-loader ${fading ? 'products-loader--fade' : ''}`} role="status" aria-live="polite">
      <div className="products-loader__card">
        <div className="products-loader__ring" aria-hidden="true">
          <svg viewBox="0 0 80 80" className="products-loader__ring-svg">
            <defs>
              <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#E8AB1D" />
                <stop offset="100%" stopColor="#D44D2D" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="34" className="products-loader__ring-track" />
            <circle
              cx="40"
              cy="40"
              r="34"
              className="products-loader__ring-fill"
              strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
            />
          </svg>
          <div className="products-loader__pct">{pct}%</div>
        </div>

        <div className="products-loader__text">
          <h3 className="products-loader__title">Preparando seu catálogo</h3>
          <p className="products-loader__subtitle">Carregando os melhores produtos para você…</p>
        </div>

        <div className="products-loader__bar" aria-hidden="true">
          <div className="products-loader__bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="products-loader__skeletons" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="products-loader__skeleton" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="products-loader__skeleton-img" />
              <div className="products-loader__skeleton-line products-loader__skeleton-line--lg" />
              <div className="products-loader__skeleton-line products-loader__skeleton-line--sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
