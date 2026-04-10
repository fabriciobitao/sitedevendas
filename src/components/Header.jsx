import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const { totalItems, toggleCart } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <div className="logo-squares">
              <div className="logo-sq brown"></div>
              <div className="logo-sq orange"></div>
              <div className="logo-sq yellow"></div>
            </div>
            <div className="logo-text">
              <span className="logo-title">Frios <span className="logo-of">OF</span></span>
              <span className="logo-subtitle">Comércio Atacadista</span>
            </div>
          </div>
        </div>

        <button className="cart-button" onClick={toggleCart} aria-label="Abrir carrinho">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}
