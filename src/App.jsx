import { useState, useMemo, useRef } from 'react';
import { products, categories } from './data/products';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SubcategoryFilter from './components/SubcategoryFilter';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import './App.css';

function App() {
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

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== 'all') {
      const catName = category === 'resfriados' ? 'Resfriados'
        : category === 'congelados' ? 'Congelados'
        : 'Secos';
      result = result.filter(p => p.category === catName);
    }

    if (subcategory !== 'all') {
      result = result.filter(p => p.subcategory === subcategory);
    }

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.subcategory.toLowerCase().includes(term)
      );
    }

    return result;
  }, [search, category, subcategory]);

  const categoryInfo = category !== 'all'
    ? categories.find(c => c.id === category)
    : null;

  return (
    <CartProvider>
      <Header />
      <Cart />

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-bg-pattern" />
          <div className="hero-content">
            <img src="/logo.jpg" alt="Frios Ouro Fino" className="hero-logo-img" />
            <p className="hero-tagline">Qualidade e tradição no atacado</p>
            <p className="hero-desc">
              Monte seu pedido com os melhores produtos e envie direto pelo WhatsApp
            </p>
            <div className="hero-stats-bar">
              <div className="hero-stat">
                <strong>{products.length}+</strong>
                <span>Produtos</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>3</strong>
                <span>Categorias</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>WhatsApp</strong>
                <span>Pedido rápido</span>
              </div>
            </div>
          </div>
          <div className="hero-cards">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                className={`hero-card hero-card--${cat.id}`}
                onClick={() => handleCategoryChange(cat.id)}
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                <span className="hero-card-icon">{cat.icon}</span>
                <div className="hero-card-text">
                  <span className="hero-card-name">{cat.name}</span>
                  <span className="hero-card-desc">{cat.description}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Gold divider */}
        <div className="section-divider" />

        {/* Filters */}
        <section className="filters-section">
          <div className="filters-row">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="filters-row">
            <CategoryFilter selected={category} onSelect={handleCategoryChange} />
          </div>
          <SubcategoryFilter
            category={category}
            selected={subcategory}
            onSelect={setSubcategory}
          />
        </section>

        {/* Results */}
        <div ref={productsRef} className="results-anchor" />
        <div className="results-info">
          <span className="results-count">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
            {categoryInfo ? ` em ${categoryInfo.name}` : ''}
            {subcategory !== 'all' ? ` · ${subcategory}` : ''}
            {search ? ` para "${search}"` : ''}
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente buscar por outro termo ou altere os filtros</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-gold-line" />
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/logo.jpg" alt="Frios Ouro Fino" className="footer-logo-img" />
          </div>
          <div className="footer-info">
            <p className="footer-tagline">Frios Ouro Fino — Comércio Atacadista</p>
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
    </CartProvider>
  );
}

export default App;
