import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-inner">
        <div className="header-brand">
          <img src="/logo.jpg" alt="Frios Ouro Fino" className="header-logo-img" />
        </div>

        <button className="cart-button" onClick={toggleCart} aria-label="Abrir carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {totalItems > 0 && (
            <span className="cart-badge" key={totalItems}>{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}
