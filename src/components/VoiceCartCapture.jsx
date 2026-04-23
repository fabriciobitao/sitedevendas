import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useVoiceDictation } from '../hooks/useVoiceDictation';
import { parseShoppingList } from '../utils/parseShoppingList';
import './VoiceCartCapture.css';

export default function VoiceCartCapture({ open, onClose }) {
  const { products } = useProducts();
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [manualEdit, setManualEdit] = useState(null);
  const [added, setAdded] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null);
  const productsRef = useRef(products);
  useEffect(() => { productsRef.current = products; }, [products]);

  const appendFromSegment = useCallback((segment) => {
    const parsed = parseShoppingList(segment, productsRef.current);
    if (parsed.length === 0) return;
    const now = Date.now();
    const newItems = parsed.map((it, idx) => ({
      id: `${now}-${idx}`,
      qty: it.qty,
      unit: it.unit,
      query: it.query,
      productId: it.match?.product?.id || null,
      productName: it.match?.product?.name || null,
    }));
    setItems(prev => [...prev, ...newItems]);
    setLastAddedId(newItems[newItems.length - 1].id);
  }, []);

  const { supported, listening, transcript, interim, error, start, stop, reset } = useVoiceDictation({
    onFinalSegment: appendFromSegment,
  });

  useEffect(() => {
    if (!open) return;
    reset();
    setItems([]);
    setAdded(false);
    setLastAddedId(null);
    return () => stop();
  }, [open, reset, stop]);

  const unresolvedCount = useMemo(() => items.filter(i => !i.productId).length, [items]);
  const resolvedCount = items.length - unresolvedCount;

  const updateItem = (id, patch) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  };
  const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id));

  const addAllToCart = () => {
    items.filter(i => i.productId).forEach(i => {
      const product = products.find(p => p.id === i.productId);
      if (!product) return;
      const qty = Math.max(1, Math.round(i.qty || 1));
      for (let k = 0; k < qty; k++) addItem(product);
    });
    setAdded(true);
    setTimeout(() => { onClose?.(); }, 1200);
  };

  if (!open) return null;

  return (
    <div className="vcc-overlay" onClick={onClose}>
      <div className="vcc-modal" onClick={(e) => e.stopPropagation()}>
        <header className="vcc-header">
          <div>
            <h2>Monte seu pedido falando</h2>
            <p>Fale um item por vez e pause. Cada pausa adiciona um item na lista. Ex.: <em>"2 quilos de mussarela"</em> ... <em>"3 pacotes de peito de peru"</em> ...</p>
          </div>
          <button className="vcc-close" onClick={onClose} aria-label="Fechar">×</button>
        </header>

        <div className="vcc-mic-area">
          {!supported && (
            <p className="vcc-warn">Seu navegador não suporta ditado por voz. Use Chrome, Edge ou Safari.</p>
          )}
          {supported && (
            <button
              type="button"
              className={`vcc-mic-btn ${listening ? 'vcc-mic-btn--on' : ''}`}
              onClick={listening ? stop : start}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
              <span>{listening ? 'Parar' : 'Começar a ditar'}</span>
              {listening && <span className="vcc-mic-ring" aria-hidden />}
            </button>
          )}
          {error && <p className="vcc-error">{error}</p>}
        </div>

        {(transcript || interim) && (
          <div className="vcc-transcript">
            <span className="vcc-transcript-label">Eu entendi</span>
            <p>
              {transcript}
              {interim && <span className="vcc-interim"> {interim}</span>}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="vcc-items">
            <div className="vcc-items-head">
              <strong>{items.length} {items.length === 1 ? 'item' : 'itens'}</strong>
              {resolvedCount > 0 && <span className="vcc-badge vcc-badge--ok">{resolvedCount} reconhecido{resolvedCount > 1 ? 's' : ''}</span>}
              {unresolvedCount > 0 && <span className="vcc-badge vcc-badge--warn">{unresolvedCount} sem produto</span>}
            </div>
            <ul className="vcc-items-list">
              {items.map(it => (
                <li key={it.id} className={`vcc-item ${!it.productId ? 'vcc-item--warn' : ''} ${it.id === lastAddedId ? 'vcc-item--flash' : ''}`}>
                  <div className="vcc-item-qty">
                    <button onClick={() => updateItem(it.id, { qty: Math.max(1, (it.qty || 1) - 1) })}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => updateItem(it.id, { qty: (it.qty || 1) + 1 })}>+</button>
                  </div>
                  <div className="vcc-item-main">
                    <div className="vcc-item-name">
                      {it.productName || <span className="vcc-item-missing">Não encontrei "{it.query}"</span>}
                    </div>
                    {it.unit && <div className="vcc-item-hint">{it.qty} {it.unit}</div>}
                    {!it.productId && (
                      <button className="vcc-item-pick" onClick={() => setManualEdit(it.id)}>Escolher produto</button>
                    )}
                  </div>
                  <button className="vcc-item-remove" onClick={() => removeItem(it.id)} aria-label="Remover">×</button>
                  {manualEdit === it.id && (
                    <ManualPicker
                      products={products}
                      initialQuery={it.query}
                      onPick={(p) => { updateItem(it.id, { productId: p.id, productName: p.name }); setManualEdit(null); }}
                      onCancel={() => setManualEdit(null)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <footer className="vcc-footer">
            <button className="vcc-footer-retry" onClick={() => { reset(); setItems([]); }}>
              Limpar e recomeçar
            </button>
            <button
              className="vcc-footer-add"
              onClick={addAllToCart}
              disabled={resolvedCount === 0 || added}
            >
              {added ? '✓ Adicionado!' : `Adicionar ${resolvedCount} ao carrinho`}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

function ManualPicker({ products, initialQuery, onPick, onCancel }) {
  const [q, setQ] = useState(initialQuery || '');
  const results = useMemo(() => {
    if (!q) return products.slice(0, 8);
    const term = q.toLowerCase();
    return products
      .filter(p => (p.name || '').toLowerCase().includes(term) || (p.subcategory || '').toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, products]);

  return (
    <div className="vcc-picker">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar produto..."
      />
      <ul>
        {results.map(p => (
          <li key={p.id}>
            <button onClick={() => onPick(p)}>
              <span>{p.name}</span>
              <span className="vcc-picker-cat">{p.category}</span>
            </button>
          </li>
        ))}
        {results.length === 0 && <li className="vcc-picker-empty">Nenhum produto encontrado</li>}
      </ul>
      <button className="vcc-picker-cancel" onClick={onCancel}>Cancelar</button>
    </div>
  );
}
