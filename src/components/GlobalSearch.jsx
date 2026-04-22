import { useEffect, useMemo, useRef, useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import './GlobalSearch.css';

const normalize = (s) => (s || '')
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const scoreMatch = (p, term) => {
  const name = normalize(p.name);
  const sub = normalize(p.subcategory);
  const desc = normalize(p.description);
  if (name.startsWith(term)) return 5;
  const words = name.split(/\s+/);
  if (words.some(w => w.startsWith(term))) return 4;
  if (name.includes(term)) return 3;
  if (sub.includes(term)) return 2;
  if (desc.includes(term)) return 1;
  return 0;
};

export default function GlobalSearch({ open, onClose }) {
  const { products } = useProducts();
  const { addItem } = useCart();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) {
      return products.slice(0, 8).map(p => ({ p, score: 0 }));
    }
    return products
      .map(p => ({ p, score: scoreMatch(p, term) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
      .slice(0, 10);
  }, [products, query]);

  useEffect(() => { setCursor(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor, open]);

  const goToProduct = (product) => {
    const catMap = { Secos: 'secos', Resfriados: 'resfriados', Congelados: 'congelados' };
    const catId = catMap[product.category] || 'all';
    window.dispatchEvent(new CustomEvent('globalsearch:select', { detail: { productId: product.id, categoryId: catId } }));
    onClose();
  };

  const quickAdd = (product, e) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = results[cursor];
      if (hit) goToProduct(hit.p);
    }
  };

  if (!open) return null;

  return (
    <div className="gs-overlay" onClick={onClose}>
      <div className="gs-panel" onClick={(e) => e.stopPropagation()}>
        <div className="gs-input-wrap">
          <svg className="gs-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref={inputRef}
            className="gs-input"
            placeholder="Buscar produto por nome, marca ou categoria..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            autoCapitalize="off"
            autoCorrect="off"
            enterKeyHint="search"
          />
          <kbd className="gs-kbd">Esc</kbd>
        </div>

        <div className="gs-results" ref={listRef}>
          {results.length === 0 ? (
            <div className="gs-empty">
              <span>Nenhum produto encontrado</span>
              <small>Tente outro termo · marcas, cortes ou subcategorias também funcionam</small>
            </div>
          ) : (
            <>
              <div className="gs-results-label">
                {query.trim() ? `${results.length} resultado${results.length !== 1 ? 's' : ''}` : 'Sugestões do catálogo'}
              </div>
              {results.map(({ p }, i) => (
                <button
                  key={p.id}
                  type="button"
                  data-idx={i}
                  className={`gs-item ${i === cursor ? 'gs-item--active' : ''}`}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => goToProduct(p)}
                >
                  <div className="gs-thumb">
                    {p.image ? <img src={p.image} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <span>{p.name.charAt(0)}</span>}
                  </div>
                  <div className="gs-meta">
                    <div className="gs-name">{p.name}</div>
                    <div className="gs-sub">
                      <span className="gs-pill">{p.category}</span>
                      {p.subcategory && <span className="gs-dot">·</span>}
                      {p.subcategory && <span>{p.subcategory}</span>}
                    </div>
                  </div>
                  {!p.outOfStock && (
                    <button
                      type="button"
                      className="gs-add"
                      onClick={(e) => quickAdd(p, e)}
                      aria-label={`Adicionar ${p.name} ao carrinho`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                    </button>
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="gs-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
          <span><kbd>Enter</kbd> abrir</span>
          <span><kbd>Esc</kbd> fechar</span>
        </div>
      </div>
    </div>
  );
}
