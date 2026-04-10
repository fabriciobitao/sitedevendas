import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const { addItem, items } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const cartItem = items.find(item => item.id === product.id);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
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
        <span className="product-category-tag">
          {product.subcategory}
        </span>
        {cartItem && (
          <span className="product-in-cart">{cartItem.quantity}×</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-divider" />
        <div className="product-bottom">
          <div className="product-pricing">
            <span className="product-currency">R$</span>
            <span className="product-price">{product.price.toFixed(2)}</span>
            <span className="product-unit">/{product.unit}</span>
          </div>
          <button
            className={`product-add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            aria-label="Adicionar ao carrinho"
          >
            <span className="btn-ripple" />
            {added ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"/><path d="M5 12h14"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
