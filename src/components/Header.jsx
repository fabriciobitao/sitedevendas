import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header({ onOpenLogin, onOpenRegister }) {
  const { totalItems, toggleCart } = useCart();
  const { user, customerProfile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Página do PDF/catálogo imprimível não deve ter header global
  // IMPORTANTE: early return DEPOIS de todos os hooks (Rules of Hooks)
  if (location.pathname.startsWith('/admin/catalogo')) return null;

  const displayName = customerProfile?.nomeFantasia || customerProfile?.nomeResponsavel || user?.email?.split('@')[0] || '';

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-inner">
        <button className="header-home" onClick={() => navigate('/')} aria-label="Voltar para a página principal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="header-home-label">Página Principal</span>
        </button>
        <div className="header-info">
          <span className="header-vendedor">Vendedor: Fabrício</span>
          <span className="header-alert-text" role="alert">
            Horário limite de envio de pedido até às 16:00
          </span>
        </div>

        <div className="header-actions">
          {!loading && user && (
            <div className="header-account">
              <button className="header-account-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="header-avatar">{displayName.charAt(0).toUpperCase()}</span>
                <span className="header-account-name">{displayName}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {menuOpen && (
                <>
                  <div className="header-menu-overlay" onClick={() => setMenuOpen(false)} />
                  <div className="header-menu">
                    <button onClick={() => { navigate('/meus-pedidos'); setMenuOpen(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                      Meus Pedidos
                    </button>
                    <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      Dashboard
                    </button>
                    <button onClick={() => { navigate('/minha-conta'); setMenuOpen(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Minha Conta
                    </button>
                    {['fabricio.fazer@gmail.com', 'fabiomenezes@gmail.com'].includes(user?.email) && (
                      <button onClick={() => { navigate('/admin'); setMenuOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                        Gerenciar Produtos
                      </button>
                    )}
                    <div className="header-menu-divider" />
                    <button className="header-menu-logout" onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button className="cart-button" onClick={toggleCart} aria-label="Abrir carrinho">
            {totalItems > 0 && (
              <span className="cart-hint">Finalize e envie seu pedido</span>
            )}
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
      </div>

    </header>
  );
}
