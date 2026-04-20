import { useState, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { categories } from './data/products';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import useContentProtection from './hooks/useContentProtection';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SubcategoryFilter from './components/SubcategoryFilter';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const ClientForm = lazy(() => import('./components/ClientForm'));
const MeusPedidosPage = lazy(() => import('./pages/MeusPedidosPage'));
const MinhaContaPage = lazy(() => import('./pages/MinhaContaPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const RouteFallback = () => (
  <div style={{ textAlign: 'center', padding: '60px', color: '#8E7E6E' }}>Carregando...</div>
);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#8E7E6E' }}>Carregando...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#8E7E6E' }}>Carregando...</div>;
  if (!user || user.email !== 'fabricio.fazer@gmail.com') return <Navigate to="/" />;
  return children;
}

function CatalogPage({ onOpenRegister, onOpenLogin, onOpenCliente }) {
  const { user } = useAuth();
  const { products } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const productsRef = useRef(null);

  const scrollToProducts = () => {
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSubcategory('all');
    scrollToProducts();
  };

  const handleProductAdded = (product) => {
    if (!search.trim()) return;
    const catMap = { Secos: 'secos', Resfriados: 'resfriados', Congelados: 'congelados' };
    const targetCat = catMap[product.category] || 'all';
    setSearch('');
    setCategory(targetCat);
    setSubcategory('all');
    setTimeout(() => {
      const el = document.querySelector(`[data-product-id="${product.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 120;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 150);
  };

  const normalize = (s) => (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const searchTerm = normalize(search.trim());
  const isSearching = searchTerm.length > 0;

  const scoreMatch = (p, term) => {
    const name = normalize(p.name);
    const sub = normalize(p.subcategory);
    const desc = normalize(p.description);
    if (name.startsWith(term)) return 4;
    const words = name.split(/\s+/);
    if (words.some(w => w.startsWith(term))) return 3;
    if (name.includes(term)) return 2;
    if (sub.includes(term)) return 1;
    if (desc.includes(term)) return 0.5;
    return 0;
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (isSearching) {
      result = result
        .map(p => ({ p, score: scoreMatch(p, searchTerm) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || (a.p.name || '').localeCompare(b.p.name || ''))
        .map(x => x.p);
      return result;
    }
    if (category !== 'all') {
      const catName = category === 'resfriados' ? 'Resfriados' : category === 'congelados' ? 'Congelados' : 'Secos';
      result = result.filter(p => p.category === catName);
    }
    if (subcategory !== 'all') {
      result = result.filter(p => p.subcategory === subcategory);
    }
    return result;
  }, [products, searchTerm, isSearching, category, subcategory]);

  const categoryInfo = category !== 'all' ? categories.find(c => c.id === category) : null;

  return (
    <main className={`main ${isSearching ? 'main--searching' : ''}`}>
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <img src="/logo.jpg" alt="Frios Ouro Fino" className="hero-logo-img" />
          <p className="hero-tagline">Qualidade nas entregas e atendimento rápido!</p>
          <p className="hero-desc">
            Monte seu pedido com os melhores produtos e finalize no carrinho de compras, ele será enviado pelo WhatsApp!
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {!user && (
        <div className="auth-buttons-bar">
          <button className="auth-btn auth-btn--login" onClick={onOpenLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Fazer minhas compras
          </button>
          <button className="auth-btn auth-btn--register" onClick={onOpenRegister}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Quero me cadastrar
          </button>
          <button className="auth-btn auth-btn--cliente" onClick={onOpenCliente}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Já sou cliente antigo - primeira vez no site
          </button>
        </div>
      )}

      <section className="filters-section">
        <div className="filters-row">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="filters-row">
          <CategoryFilter selected={category} onSelect={handleCategoryChange} />
        </div>
        {category !== 'all' && (
          <div className="filters-row">
            <SubcategoryFilter
              category={category}
              selected={subcategory}
              onSelect={(sub) => { setSubcategory(sub); scrollToProducts(); }}
            />
          </div>
        )}
      </section>

      <div ref={productsRef} className="results-anchor" />
      <div className="results-info">
        <span className="results-count">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
          {categoryInfo ? ` em ${categoryInfo.name}` : ''}
          {search ? ` para "${search}"` : ''}
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        (isSearching || category === 'all') ? (
          // Quando "Todos" está selecionado, agrupar por categoria
          ['Secos', 'Resfriados', 'Congelados'].map(catName => {
            const catProducts = filteredProducts.filter(p => p.category === catName);
            if (catProducts.length === 0) return null;
            const catInfo = categories.find(c => c.name === catName);
            return (
              <div key={catName} className="category-section">
                <div className="category-section-header">
                  <span className="category-section-icon">{catInfo?.icon}</span>
                  <h2 className="category-section-title">{catName}</h2>
                  <span className="category-section-desc">{catInfo?.description}</span>
                </div>
                <div className="product-grid">
                  {catProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} onAdded={handleProductAdded} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onAdded={handleProductAdded} />
            ))}
          </div>
        )
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente buscar por outro termo ou altere os filtros</p>
        </div>
      )}
    </main>
  );
}

function AuthGateToast({ onLogin }) {
  const { authGate, clearAuthGate } = useCart();

  useEffect(() => {
    if (!authGate) return;
    const t = setTimeout(() => clearAuthGate(), 3000);
    return () => clearTimeout(t);
  }, [authGate, clearAuthGate]);

  if (!authGate) return null;
  return (
    <div className="auth-gate-toast" role="alert">
      <div className="auth-gate-toast-inner">
        <span className="auth-gate-toast-icon" aria-hidden="true">🔒</span>
        <span className="auth-gate-toast-msg">{authGate.message}</span>
        <button type="button" className="auth-gate-toast-btn" onClick={() => { clearAuthGate(); onLogin(); }}>
          Fazer login
        </button>
        <button type="button" className="auth-gate-toast-close" onClick={clearAuthGate} aria-label="Fechar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  useContentProtection();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [clienteOpen, setClienteOpen] = useState(false);

  const openLogin = () => { setRegisterOpen(false); setClienteOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false); setClienteOpen(false); setRegisterOpen(true); };
  const openCliente = () => { setLoginOpen(false); setRegisterOpen(false); setClienteOpen(true); };

  return (
    <>
      <Header onOpenLogin={openLogin} onOpenRegister={openRegister} />
      <Cart />
      <AuthGateToast onLogin={openLogin} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchToRegister={openRegister} />
      <Suspense fallback={null}>
        {(registerOpen || clienteOpen) && (
          <>
            <ClientForm open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToLogin={openLogin} initialTipo="empresa" />
            <ClientForm open={clienteOpen} onClose={() => setClienteOpen(false)} onSwitchToLogin={openLogin} initialTipo="cliente" />
          </>
        )}
      </Suspense>

      <ErrorBoundary fallbackTitle="Página indisponível" fallbackMessage="Não conseguimos carregar esta seção. Tente voltar ao início.">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<CatalogPage onOpenRegister={openRegister} onOpenLogin={openLogin} onOpenCliente={openCliente} />} />
            <Route path="/meus-pedidos" element={<ProtectedRoute><MeusPedidosPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/minha-conta" element={<ProtectedRoute><MinhaContaPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <footer className="footer">
        <div className="footer-gold-line" />
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/logo.jpg" alt="Frios Ouro Fino" className="footer-logo-img" />
          </div>
          <div className="footer-info">
            <p className="footer-tagline">Frios Ouro Fino Ltda. — Comércio Atacadista</p>
          </div>
          <div className="footer-contact">
            <a href="https://wa.me/5535998511194" className="footer-whatsapp" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              (35) 99851-1194
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
