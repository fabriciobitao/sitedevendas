import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';
import './ProductCard.css';

function buildWebpSrcset(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const match = imagePath.match(/^\/images\/([^/]+)\.(png|jpe?g)$/i);
  if (!match) return null;
  const base = match[1];
  return `/images/webp/${base}-400.webp 400w, /images/webp/${base}-800.webp 800w`;
}

export default function ProductCard({ product, index = 0 }) {
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const [imgError, setImgError] = useState(false);

  // Resetar erro quando a imagem do produto mudar
  useEffect(() => {
    setImgError(false);
  }, [product.image]);
  const [qty, setQty] = useState('');
  const [added, setAdded] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = () => setDetailOpen(true);

  const cartItem = items.find(item => item.id === product.id);
  const inCart = !!cartItem;

  const handleAdd = () => {
    const finalQty = parseInt(qty) || 1;
    addItem(product, finalQty);
    setAdded(true);
    setQty('');
    setTimeout(() => setAdded(false), 1000);
  };

  const handleQtyChange = (val) => {
    if (val === '') { setQty(''); return; }
    const n = parseInt(val);
    if (!isNaN(n) && n >= 0) setQty(n > 0 ? String(n) : '');
  };

  const handleQtyButton = (delta) => {
    const current = parseInt(qty) || 0;
    const n = Math.max(0, current + delta);
    setQty(n > 0 ? String(n) : '');
  };

  const handleCartQty = (delta) => {
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, newQty);
    }
  };

  const catClass = product.category === 'Resfriados' ? 'cat-resfriados'
    : product.category === 'Congelados' ? 'cat-congelados'
    : 'cat-secos';

  return (
    <div
      className={`product-card ${catClass} ${product.outOfStock ? 'out-of-stock' : ''}`}
      style={{ animationDelay: `${(index % 8) * 50}ms` }}
    >
      <button
        type="button"
        className="product-image-wrap"
        onClick={openDetail}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        {product.outOfStock && <div className="product-out-of-stock-banner">ESGOTADO</div>}
        {!imgError ? (
          (() => {
            const webpSrcset = buildWebpSrcset(product.image);
            const img = (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 280px"
                onError={() => setImgError(true)}
              />
            );
            return webpSrcset ? (
              <picture>
                <source type="image/webp" srcSet={webpSrcset} sizes="(max-width: 768px) 50vw, 280px" />
                {img}
              </picture>
            ) : img;
          })()
        ) : (
          <div className="product-image-fallback">
            <span>{product.name.charAt(0)}</span>
          </div>
        )}
        <div className="product-image-overlay" />
      </button>

      <div className="product-info">
        <button type="button" className="product-info-top product-info-top--clickable" onClick={openDetail}>
          <h3 className="product-name">{product.name}</h3>
          {product.description && <p className="product-desc">{product.description}</p>}
          <span className="product-see-more">Ver detalhes</span>
        </button>
        <div className="product-info-bottom">
        <div className="product-divider" />
        <div className="product-pricing">
          {product.price != null ? (
            <>
              <span className="product-currency">R$</span>
              <span className="product-price">{product.price.toFixed(2)}</span>
              <span className="product-unit">/{product.unit}</span>
            </>
          ) : (
            <span className="product-price-consulte">Consulte preço</span>
          )}
        </div>

        {product.outOfStock ? (
          <div className="product-out-of-stock-msg">Produto esgotado</div>
        ) : inCart ? (
          <div className="product-cart-control">
            <div className="product-qty-row">
              <button className="pqty-btn pqty-minus" onClick={() => handleCartQty(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
              </button>
              <input
                type="number"
                className="pqty-input"
                value={cartItem.quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  if (v <= 0) removeItem(product.id);
                  else updateQuantity(product.id, v);
                }}
                min="1"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <button className="pqty-btn pqty-plus" onClick={() => handleCartQty(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>
            <span className="product-in-cart-label">No carrinho</span>
          </div>
        ) : (
          <div className="product-add-row">
            <div className="product-qty-row">
              <button className="pqty-btn pqty-minus" onClick={() => handleQtyButton(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
              </button>
              <input
                type="number"
                className="pqty-input"
                value={qty}
                onChange={(e) => handleQtyChange(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                enterKeyHint="done"
              />
              <button className="pqty-btn pqty-plus" onClick={() => handleQtyButton(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>
            <button
              className={`product-add-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
            >
              {added ? 'Adicionado!' : 'Adicionar'}
            </button>
          </div>
        )}
        </div>
      </div>
      {detailOpen && (
        <ProductDetailModal product={product} onClose={() => setDetailOpen(false)} />
      )}
    </div>
  );
}
