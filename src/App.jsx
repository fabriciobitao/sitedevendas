import { useState, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { categories } from './data/products';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import useContentProtection from './hooks/useContentProtection';
import { useAutoUpdate } from './hooks/useAutoUpdate';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SubcategoryFilter from './components/SubcategoryFilter';
import ProductCard from './components/ProductCard';
import BackToTop from './components/BackToTop';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import ErrorBoundary from './components/ErrorBoundary';
import ProductsLoader from './components/ProductsLoader';
import GlobalSearch from './components/GlobalSearch';
import VoiceCartCapture from './components/VoiceCartCapture';
import { normalize, scoreMatch } from './utils/searchMatch';
import './App.css';

const ClientForm = lazy(() => import('./components/ClientForm'));
const MeusPedidosPage = lazy(() => import('./pages/MeusPedidosPage'));
const MinhaContaPage = lazy(() => import('./pages/MinhaContaPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const CatalogoPDFPage = lazy(() => import('./pages/CatalogoPDFPage'));

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
  const ADMIN_EMAILS = ['fabricio.fazer@gmail.com', 'fabiomenezes@gmail.com'];
  if (!user || !ADMIN_EMAILS.includes(user.email)) return <Navigate to="/" />;
  return children;
}

function CatalogPage({ onOpenRegister, onOpenLogin, onOpenCliente }) {
  const { user } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [filtersCompact, setFiltersCompact] = useState(false);
  const [voiceCartOpen, setVoiceCartOpen] = useState(false);
  const productsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setFiltersCompact(window.scrollY > 220);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onSelect = (e) => {
      const { productId, categoryId } = e.detail || {};
      if (!productId) return;
      setSearch('');
      setCategory(categoryId || 'all');
      setSubcategory('all');
      setTimeout(() => {
        const el = document.querySelector(`[data-product-id="${productId}"]`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 140;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        el.classList.add('product-card--focus');
        setTimeout(() => el.classList.remove('product-card--focus'), 1800);
      }, 200);
    };
    window.addEventListener('globalsearch:select', onSelect);
    return () => window.removeEventListener('globalsearch:select', onSelect);
  }, []);

  useEffect(() => {
    const header = document.querySelector('.header');
    if (!header) return;
    const update = () => {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

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

  const searchTerm = normalize(search.trim());
  const isSearching = searchTerm.length > 0;

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

  const topProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const tagged = products.filter(p => !p.outOfStock && p.image);
    return tagged.slice(0, 4);
  }, [products]);

  const handleCategoryJump = (catId) => {
    handleCategoryChange(catId);
  };

  return (
    <main className={`main ${isSearching ? 'main--searching' : ''}`}>
      <section className="hero-mf">
        <div className="hero-mf-grid">
          <div className="hero-mf-left">
            <div className="hero-brand hero-brand--inline hero-brand--round">
              <div className="hero-brand-aurora" aria-hidden />
              <div className="hero-brand-halo" aria-hidden />
              <div className="hero-brand-grain" aria-hidden />

              <div className="hero-brand-content">
                <div className="hero-brand-medallion">
                  <svg className="hero-brand-medallion-text" viewBox="0 0 440 440" aria-hidden>
                    <defs>
                      <path id="brandOrbit" d="M 220,220 m -196,0 a 196,196 0 1,1 392,0 a 196,196 0 1,1 -392,0" />
                    </defs>
                    <text>
                      <textPath href="#brandOrbit" startOffset="75%" textAnchor="middle">
                        FRIOS OURO FINO LTDA. &#160;&#160;&#10052;&#65038;&#160;&#160; DESDE 1998 &#160;&#160;&#10052;&#65038;&#160;&#160; COMÉRCIO ATACADISTA
                      </textPath>
                    </text>
                  </svg>
                  <div className="hero-brand-medallion-gold" aria-hidden />
                  <div className="hero-brand-medallion-innerline" aria-hidden />
                  <div className="hero-brand-logocard hero-brand-logocard--round">
                    <div className="hero-brand-logocard-glow" aria-hidden />
                    <img src="/logo.jpg" alt="Frios Ouro Fino — Comércio Atacadista" className="hero-brand-logo" />
                  </div>
                  <span className="hero-brand-medallion-snow" aria-hidden>&#10052;&#65038;</span>
                  <span className="hero-brand-medallion-star hero-brand-medallion-star--tl" aria-hidden>✦</span>
                  <span className="hero-brand-medallion-star hero-brand-medallion-star--tr" aria-hidden>✦</span>
                  <span className="hero-brand-medallion-star hero-brand-medallion-star--bl" aria-hidden>✦</span>
                  <span className="hero-brand-medallion-star hero-brand-medallion-star--br" aria-hidden>✦</span>
                </div>

                <p className="hero-brand-promise">
                  <em>Atendimento</em> amigo. <em>Produtos</em> de qualidade. <em>Entrega</em> rápida!
                </p>
              </div>
            </div>
            <p className="hero-mf-lead">
              Secos, resfriados e congelados — monte o carrinho e envie direto pro
              WhatsApp do vendedor. Atendimento personalizado, sem enrolação.
            </p>

            <div className="hero-mf-ctas">
              <button
                type="button"
                className="hero-mf-cta-primary"
                onClick={() => {
                  handleCategoryChange('all');
                  scrollToProducts();
                }}
              >
                Montar pedido
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <button
                type="button"
                className="hero-mf-cta-voice"
                onClick={() => setVoiceCartOpen(true)}
                title="Dite seu pedido completo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
                Ditar pedido
              </button>
              <a
                href="https://wa.me/5535998511194?text=Ol%C3%A1%20Fabr%C3%ADcio%2C%20quero%20montar%20um%20pedido."
                target="_blank"
                rel="noopener noreferrer"
                className="hero-mf-cta-secondary"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5s-.7-1.6-.9-2.2-.5-.5-.7-.5H7.8c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1 2.1 3.2 5.1 4.5c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4c-.1-.1-.3-.2-.6-.4z"/></svg>
                Atendimento direto
              </a>
            </div>

            <div className="hero-mf-seller">
              <div className="hero-mf-seller-avatar">
                <img src="/fabricio.jpg" alt="Fabrício" />
                <span className="hero-mf-seller-online" />
              </div>
              <div className="hero-mf-seller-body">
                <div className="hero-mf-seller-kicker">
                  <span className="hero-mf-seller-dot" /> Seu vendedor online agora
                </div>
                <p className="hero-mf-seller-quote">
                  "Olá, sou o <strong>Fabrício</strong>, representante de vendas da Frios OF.
                  Escolha seus produtos e envie o pedido direto pro meu WhatsApp — atendimento personalizado."
                </p>
                <div className="hero-mf-seller-meta">
                  <span>Resposta em até 15 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-mf-right">
            <div className="hero-mf-featured-tag">
              <span>◉</span> MAIS PEDIDOS · TOP 4
            </div>
            <div className="hero-mf-featured-grid">
              {topProducts.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`hero-mf-featured-card${i === 0 ? ' hero-mf-featured-card--big' : ''}`}
                  onClick={() => {
                    const catId = p.category === 'Resfriados' ? 'resfriados'
                      : p.category === 'Congelados' ? 'congelados' : 'secos';
                    handleCategoryChange(catId);
                  }}
                >
                  <div className="hero-mf-featured-img">
                    <img src={p.image} alt={p.name} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    {i === 0 && <span className="hero-mf-featured-badge">TOP 1</span>}
                  </div>
                  <div className="hero-mf-featured-meta">
                    <div className="hero-mf-featured-brand">{p.subcategory || p.category}</div>
                    <div className="hero-mf-featured-name">{p.name}</div>
                    <span className="hero-mf-featured-cta">
                      Ver produto
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-mf-showcase">
          <div className="hero-mf-showcase-label">
            <span className="hero-mf-showcase-num">01 →</span> Ir direto pra categoria
          </div>
          <div className="hero-mf-showcase-row">
            {categories.map(c => (
              <button
                key={c.id}
                type="button"
                className="hero-mf-cat-card"
                style={{ '--cat-accent': c.color }}
                onClick={() => handleCategoryJump(c.id)}
              >
                <span className="hero-mf-cat-glyph" aria-hidden>{c.icon}</span>
                <div className="hero-mf-cat-text">
                  <div className="hero-mf-cat-name">{c.name}</div>
                  <div className="hero-mf-cat-desc">{c.description}</div>
                </div>
                <span className="hero-mf-cat-arrow">→</span>
              </button>
            ))}
            <a
              href="https://wa.me/5535998511194"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-mf-whats-card"
            >
              <div className="hero-mf-whats-top">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#C6F24E"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5s-.7-1.6-.9-2.2-.5-.5-.7-.5H7.8c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1 2.1 3.2 5.1 4.5c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4c-.1-.1-.3-.2-.6-.4z"/></svg>
                <span className="hero-mf-whats-label">Via WhatsApp</span>
              </div>
              <div className="hero-mf-whats-title">Pedido conversado,<br />sem burocracia.</div>
              <div className="hero-mf-whats-sub">(35) 99851-1194</div>
            </a>
          </div>
        </div>
      </section>

      <section className={`filters-section ${filtersCompact ? 'filters-section--compact' : ''}`}>
        <div className="filters-row filters-row--search">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="filters-row">
          <CategoryFilter selected={category} onSelect={handleCategoryChange} />
        </div>
      </section>

      <div ref={productsRef} className="results-anchor" />

      {productsLoading && products.length === 0 ? (
        <ProductsLoader done={!productsLoading} />
      ) : (
        <>
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
        </>
      )}
      <BackToTop />
      <VoiceCartCapture open={voiceCartOpen} onClose={() => setVoiceCartOpen(false)} />
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
  useAutoUpdate();
  const location = useLocation();
  const isCatalogoPDF = location.pathname.startsWith('/admin/catalogo');
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [clienteOpen, setClienteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openLogin = () => { setRegisterOpen(false); setClienteOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false); setClienteOpen(false); setRegisterOpen(true); };
  const openCliente = () => { setLoginOpen(false); setRegisterOpen(false); setClienteOpen(true); };
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Header onOpenLogin={openLogin} onOpenRegister={openRegister} onOpenCliente={openCliente} onOpenSearch={openSearch} />
      <GlobalSearch open={searchOpen} onClose={closeSearch} />
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
            <Route path="/admin/catalogo" element={<AdminRoute><CatalogoPDFPage /></AdminRoute>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {!isCatalogoPDF && (
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
      )}
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
