import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Header.css';

function formatDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('pt-BR');
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} — ${time}`;
}

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [dateTime, setDateTime] = useState(formatDateTime);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setDateTime(formatDateTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-inner">
        <div className="header-info">
          <span className="header-datetime">{dateTime}</span>
          <span className="header-vendedor">Vendedor: Fabrício</span>
        </div>

        <button className="cart-button" onClick={toggleCart} aria-label="Abrir carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {totalItems > 0 && (
            <span className="cart-badge" key={totalItems}>{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}
