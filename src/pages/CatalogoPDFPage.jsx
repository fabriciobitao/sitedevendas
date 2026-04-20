import { useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import './CatalogoPDFPage.css';

const CATEGORY_ORDER = ['Secos', 'Resfriados', 'Congelados'];

function formatPrice(price) {
  if (price === null || price === undefined) return null;
  return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
}

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function CatalogoPDFPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const tipo = searchParams.get('tipo') === 'esgotados' ? 'esgotados' : 'estoque';

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) =>
      tipo === 'esgotados' ? p.outOfStock === true : !p.outOfStock,
    );
  }, [products, tipo]);

  // Agrupar: categoria > subcategoria > produtos (ordenados por `order`)
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((p) => {
      const cat = p.category || 'Outros';
      const sub = p.subcategory || 'Geral';
      if (!map[cat]) map[cat] = {};
      if (!map[cat][sub]) map[cat][sub] = [];
      map[cat][sub].push(p);
    });
    // ordenar cada bucket
    Object.keys(map).forEach((cat) => {
      Object.keys(map[cat]).forEach((sub) => {
        map[cat][sub].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      });
    });
    return map;
  }, [filtered]);

  const categoriasOrdenadas = useMemo(() => {
    const all = Object.keys(grouped);
    return [...CATEGORY_ORDER.filter((c) => all.includes(c)), ...all.filter((c) => !CATEGORY_ORDER.includes(c))];
  }, [grouped]);

  const total = filtered.length;
  const titulo = tipo === 'esgotados' ? 'Produtos Esgotados' : 'Catálogo de Produtos';
  const subtitulo = tipo === 'esgotados' ? 'Itens temporariamente indisponíveis' : 'Linha completa disponível';

  useEffect(() => {
    document.title = `${titulo} — Frios Ouro Fino`;
  }, [titulo]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="catpdf-loading">Carregando produtos...</div>;
  }

  return (
    <div className={`catpdf-root ${tipo === 'esgotados' ? 'is-esgotados' : 'is-estoque'}`}>
      {/* Toolbar — só aparece na tela, não no print */}
      <div className="catpdf-toolbar no-print">
        <button className="catpdf-btn-back" onClick={() => navigate('/admin')} aria-label="Voltar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>
        <div className="catpdf-toolbar-info">
          <span className="catpdf-toolbar-title">{titulo}</span>
          <span className="catpdf-toolbar-count">{total} {total === 1 ? 'produto' : 'produtos'}</span>
        </div>
        <button className="catpdf-btn-print" onClick={handlePrint}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Documento imprimível */}
      <div className="catpdf-doc">
        {/* CAPA */}
        <section className="catpdf-cover">
          <div className="catpdf-cover-ornament top">
            <span /><span /><span />
          </div>
          <img src="/logo.jpg" alt="Frios Ouro Fino" className="catpdf-cover-logo" />
          <div className="catpdf-cover-brand">Frios Ouro Fino</div>
          <div className="catpdf-cover-divider" />
          <h1 className="catpdf-cover-title">{titulo}</h1>
          <div className="catpdf-cover-subtitle">{subtitulo}</div>
          <div className="catpdf-cover-meta">
            <div className="catpdf-cover-stat">
              <span className="catpdf-cover-stat-num">{total}</span>
              <span className="catpdf-cover-stat-label">{total === 1 ? 'item' : 'itens'}</span>
            </div>
            <div className="catpdf-cover-stat">
              <span className="catpdf-cover-stat-num">{categoriasOrdenadas.length}</span>
              <span className="catpdf-cover-stat-label">{categoriasOrdenadas.length === 1 ? 'categoria' : 'categorias'}</span>
            </div>
          </div>
          <div className="catpdf-cover-date">{formatDate()}</div>
          <div className="catpdf-cover-ornament bottom">
            <span /><span /><span />
          </div>
          <div className="catpdf-cover-footer">friosof.web.app</div>
        </section>

        {/* PÁGINAS DE PRODUTOS */}
        {categoriasOrdenadas.map((cat) => {
          const subs = grouped[cat];
          const subKeys = Object.keys(subs).sort();
          return (
            <section key={cat} className="catpdf-categoria">
              <header className="catpdf-categoria-header">
                <div className="catpdf-categoria-label">Categoria</div>
                <h2 className="catpdf-categoria-name">{cat}</h2>
                <div className="catpdf-categoria-count">
                  {Object.values(subs).reduce((acc, arr) => acc + arr.length, 0)} itens
                </div>
              </header>
              {subKeys.map((sub) => (
                <div key={sub} className="catpdf-subcategoria">
                  <h3 className="catpdf-subcategoria-name">{sub}</h3>
                  <div className="catpdf-grid">
                    {subs[sub].map((p) => (
                      <article key={p.firestoreId || p.id} className={`catpdf-card ${p.outOfStock ? 'out' : ''}`}>
                        <div className="catpdf-card-img-wrap">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="catpdf-card-img"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="catpdf-card-img-placeholder" style={p.image ? { display: 'none' } : {}}>
                            {(p.name || '?').charAt(0).toUpperCase()}
                          </div>
                          {p.outOfStock && <div className="catpdf-card-badge">ESGOTADO</div>}
                        </div>
                        <div className="catpdf-card-body">
                          <h4 className="catpdf-card-name">{p.name}</h4>
                          <div className="catpdf-card-meta">
                            <span className="catpdf-card-unit">{p.unit || 'un'}</span>
                            <span className={`catpdf-card-price ${p.price === null || p.price === undefined ? 'no-price' : ''}`}>
                              {formatPrice(p.price) || 'Consultar'}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}

        {/* Contra-capa */}
        <section className="catpdf-backcover">
          <div className="catpdf-backcover-inner">
            <img src="/logo.jpg" alt="Frios Ouro Fino" className="catpdf-backcover-logo" />
            <div className="catpdf-backcover-brand">Frios Ouro Fino</div>
            <div className="catpdf-backcover-divider" />
            <p className="catpdf-backcover-text">
              Peça pelo WhatsApp ou acesse nosso catálogo online.
            </p>
            <div className="catpdf-backcover-site">friosof.web.app</div>
            <div className="catpdf-backcover-date">Documento gerado em {formatDate()}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
