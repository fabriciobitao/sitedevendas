import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';
import './ProductDetailModal.css';

function buildWebpSrcset(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const match = imagePath.match(/^\/images\/([^/]+)\.(png|jpe?g)$/i);
  if (!match) return null;
  const base = match[1];
  return `/images/webp/${base}-400.webp 400w, /images/webp/${base}-800.webp 800w`;
}

export default function ProductDetailModal({ product, onClose }) {
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const [qty, setQty] = useState('1');
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find((i) => i.id === product?.id);
  const inCart = !!cartItem;

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current && onCloseRef.current(); };
    window.addEventListener('keydown', onKey);

    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!product) return null;

  const catClass = product.category === 'Resfriados' ? 'cat-resfriados'
    : product.category === 'Congelados' ? 'cat-congelados'
    : 'cat-secos';

  const handleAdd = () => {
    const n = parseInt(qty) || 1;
    addItem(product, n);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  const handleQtyBtn = (delta) => {
    const current = parseInt(qty) || 0;
    const n = Math.max(1, current + delta);
    setQty(String(n));
  };

  const handleCartQty = (delta) => {
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) removeItem(product.id);
    else updateQuantity(product.id, newQty);
  };

  const webpSrcset = !imgError ? buildWebpSrcset(product.image) : null;

  return createPortal(
    <div className="pdm-overlay" onClick={onClose}>
      <div className={`pdm-modal ${catClass}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="pdm-close" onClick={onClose} aria-label="Fechar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

        <div className="pdm-image-wrap">
          {product.outOfStock && <div className="pdm-out-banner">ESGOTADO</div>}
          {!imgError ? (
            webpSrcset ? (
              <picture>
                <source type="image/webp" srcSet={webpSrcset} sizes="(max-width: 640px) 100vw, 520px" />
                <img src={product.image} alt={product.name} className="pdm-image" onError={() => setImgError(true)} />
              </picture>
            ) : (
              <img src={product.image} alt={product.name} className="pdm-image" onError={() => setImgError(true)} />
            )
          ) : (
            <div className="pdm-image-fallback"><span>{product.name.charAt(0)}</span></div>
          )}
        </div>

        <div className="pdm-body">
          <div className="pdm-category">{product.category}</div>
          <h2 className="pdm-name">{product.name}</h2>

          {product.description && (
            <p className="pdm-description">{product.description}</p>
          )}

          <div className="pdm-pricing">
            {product.price != null ? (
              <>
                <span className="pdm-currency">R$</span>
                <span className="pdm-price">{product.price.toFixed(2)}</span>
                <span className="pdm-unit">/{product.unit}</span>
              </>
            ) : (
              <span className="pdm-price-consulte">Consulte preço</span>
            )}
          </div>
        </div>

        <div className="pdm-footer">
          {product.outOfStock ? (
            <div className="pdm-out-msg">Produto esgotado — avise-nos pelo WhatsApp</div>
          ) : inCart ? (
            <div className="pdm-cart-row">
              <span className="pdm-in-cart-label">No carrinho</span>
              <div className="pdm-qty-row">
                <button className="pdm-qty-btn" onClick={() => handleCartQty(-1)} aria-label="Diminuir">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
                </button>
                <input
                  type="number"
                  className="pdm-qty-input"
                  value={cartItem.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    if (v <= 0) removeItem(product.id);
                    else updateQuantity(product.id, v);
                  }}
                  min="1"
                  inputMode="numeric"
                />
                <button className="pdm-qty-btn" onClick={() => handleCartQty(1)} aria-label="Aumentar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="pdm-qty-row">
                <button className="pdm-qty-btn" onClick={() => handleQtyBtn(-1)} aria-label="Diminuir">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
                </button>
                <input
                  type="number"
                  className="pdm-qty-input"
                  value={qty}
                  onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))}
                  onFocus={(e) => e.target.select()}
                  min="1"
                  inputMode="numeric"
                />
                <button className="pdm-qty-btn" onClick={() => handleQtyBtn(1)} aria-label="Aumentar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </button>
              </div>
              <button className={`pdm-add-btn ${added ? 'added' : ''}`} onClick={handleAdd}>
                {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
