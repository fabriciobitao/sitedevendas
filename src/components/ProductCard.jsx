import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const [imgError, setImgError] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const cartItem = items.find(item => item.id === product.id);
  const inCart = !!cartItem;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const handleQtyChange = (val) => {
    const n = Math.max(1, parseInt(val) || 1);
    setQty(n);
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
      className={`product-card ${catClass}`}
      style={{ animationDelay: `${(index % 8) * 50}ms` }}
    >
      <div className="product-image-wrap">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-image-fallback">
            <span>{product.name.charAt(0)}</span>
          </div>
        )}
        <div className="product-image-overlay" />
      </div>

      <div className="product-info">
        <div className="product-info-top">
          <h3 className="product-name">{product.name}</h3>
          {product.description && <p className="product-desc">{product.description}</p>}
        </div>
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

        {inCart ? (
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
              <button className="pqty-btn pqty-minus" onClick={() => handleQtyChange(qty - 1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
              </button>
              <input
                type="number"
                className="pqty-input"
                value={qty}
                onChange={(e) => handleQtyChange(e.target.value)}
                min="1"
              />
              <button className="pqty-btn pqty-plus" onClick={() => handleQtyChange(qty + 1)}>
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
    </div>
  );
}
