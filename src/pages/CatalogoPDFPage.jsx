import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import './CatalogoPDFPage.css';

const CATEGORY_ORDER = ['Secos', 'Resfriados', 'Congelados'];
const WHATSAPP = '5535998511194';
const SITE = 'friosof.web.app';

function formatPrice(price) {
  if (price === null || price === undefined) return null;
  return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatMonthYear(d = new Date()) {
  const s = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Verifica se url é interno (local ou base64)
function isInternal(url) {
  return !!url && (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/'));
}

// Proxy via weserv — fallback para imagens externas que bloqueiam hotlinking
function proxySrc(url) {
  if (!url || isInternal(url)) return null;
  const clean = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&w=500&fit=contain&output=webp&q=85`;
}

// Detecta variantes "cx" vs "por peça" em nomes como "Acem cx - 20kg" / "Acem por Peça"
function variantInfo(name) {
  if (!name) return { base: '', isCx: false, isPeca: false };
  const n = name.toLowerCase().trim();
  const mCx = n.match(/^(.+?)\s+cx\b/);
  const mPe = n.match(/^(.+?)\s+(?:por\s+)?pe[çc]a\b/);
  if (mCx) return { base: mCx[1].trim(), isCx: true, isPeca: false };
  if (mPe) return { base: mPe[1].trim(), isCx: false, isPeca: true };
  return { base: n, isCx: false, isPeca: false };
}

// Remove duplicatas: quando existe variante "cx" e "por peça" do mesmo produto, mantém só a "cx"
function dedupCxPeca(list) {
  const byBase = new Map();
  const solo = [];
  list.forEach((p) => {
    const v = variantInfo(p.name);
    if (!v.isCx && !v.isPeca) { solo.push(p); return; }
    const existing = byBase.get(v.base);
    if (!existing) { byBase.set(v.base, p); return; }
    const ev = variantInfo(existing.name);
    // cx sempre vence sobre peça
    if (v.isCx && ev.isPeca) byBase.set(v.base, p);
  });
  return [...solo, ...byBase.values()];
}

// QR code via API pública (zero deps)
function qrUrl(data, size = 180) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&data=${encodeURIComponent(data)}&color=4D2B18&bgcolor=FFFFFF`;
}

const FleurOrnament = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
    <path d="M20 4c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6zm0 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6zm-16-4c3-1 5-3 6-6 1 3 3 5 6 6-3 1-5 3-6 6-1-3-3-5-6-6zm20 0c3-1 5-3 6-6 1 3 3 5 6 6-3 1-5 3-6 6-1-3-3-5-6-6z" />
  </svg>
);

export default function CatalogoPDFPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const tipo = searchParams.get('tipo') === 'esgotados' ? 'esgotados' : 'estoque';
  const layout = searchParams.get('layout') === 'detalhado' ? 'detalhado' : 'compacto';

  const filtered = useMemo(() => {
    if (!products) return [];
    const base = products.filter((p) => (tipo === 'esgotados' ? p.outOfStock === true : !p.outOfStock));
    // Na lista de esgotados, quando existe variante "cx" e "por peça" do mesmo item, manter apenas a "cx"
    return tipo === 'esgotados' ? dedupCxPeca(base) : base;
  }, [products, tipo]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((p) => {
      const cat = p.category || 'Outros';
      const sub = p.subcategory || 'Geral';
      if (!map[cat]) map[cat] = {};
      if (!map[cat][sub]) map[cat][sub] = [];
      map[cat][sub].push(p);
    });
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

  const totalItens = filtered.length;
  const totalSubs = useMemo(() => {
    return categoriasOrdenadas.reduce((acc, cat) => acc + Object.keys(grouped[cat]).length, 0);
  }, [categoriasOrdenadas, grouped]);

  const titulo = tipo === 'esgotados' ? 'Produtos Esgotados' : 'Catálogo de Produtos';
  const subtitulo = tipo === 'esgotados'
    ? 'Itens temporariamente indisponíveis'
    : `Edição ${formatMonthYear()}`;

  useEffect(() => {
    document.title = `${titulo} — Frios Ouro Fino`;
  }, [titulo]);

  const handlePrint = () => window.print();

  const toggleLayout = () => {
    const novo = layout === 'detalhado' ? 'compacto' : 'detalhado';
    searchParams.set('layout', novo);
    setSearchParams(searchParams, { replace: true });
  };

  if (loading) return <div className="catpdf-loading">Carregando produtos...</div>;

  return (
    <div className={`catpdf-root ${tipo === 'esgotados' ? 'is-esgotados' : 'is-estoque'} layout-${layout}`}>
      {/* Toolbar */}
      <div className="catpdf-toolbar no-print">
        <button className="catpdf-btn-back" onClick={() => navigate('/admin')} aria-label="Voltar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>
        <div className="catpdf-toolbar-info">
          <span className="catpdf-toolbar-title">{titulo}</span>
          <span className="catpdf-toolbar-count">{totalItens} {totalItens === 1 ? 'produto' : 'produtos'} • {categoriasOrdenadas.length} categorias</span>
        </div>
        <button className="catpdf-btn-layout" onClick={toggleLayout} title="Alternar layout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {layout === 'detalhado' ? (
              <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>
            ) : (
              <><rect x="3" y="3" width="18" height="7" /><rect x="3" y="14" width="18" height="7" /></>
            )}
          </svg>
          {layout === 'detalhado' ? 'Compacto' : 'Detalhado'}
        </button>
        <button className="catpdf-btn-print" onClick={handlePrint}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Documento */}
      <div className="catpdf-doc">
        {/* ====== MODO LISTA ENXUTA (ESGOTADOS) ====== */}
        {tipo === 'esgotados' ? (
          <section className="catpdf-shoplist-doc">
            <header className="catpdf-shoplist-header">
              <img src="/logo.jpg" alt="Frios Ouro Fino" className="catpdf-shoplist-logo" />
              <div className="catpdf-shoplist-head-info">
                <div className="catpdf-shoplist-head-brand">Frios Ouro Fino Ltda.</div>
                <h1 className="catpdf-shoplist-head-title">Lista de Compras · Produtos Esgotados</h1>
                <div className="catpdf-shoplist-head-meta">
                  <span><strong>{totalItens}</strong> {totalItens === 1 ? 'item a repor' : 'itens a repor'}</span>
                  <span>·</span>
                  <span>{categoriasOrdenadas.length} {categoriasOrdenadas.length === 1 ? 'categoria' : 'categorias'}</span>
                  <span>·</span>
                  <span>{formatDate()}</span>
                </div>
              </div>
              <div className="catpdf-shoplist-head-hint">
                Marque <span className="catpdf-shoplist-chk-ref" /> ao comprar<br />
                Anote qtd. e fornecedor
              </div>
            </header>

            {categoriasOrdenadas.map((cat) => {
              const subs = grouped[cat];
              const totalCat = Object.values(subs).reduce((a, arr) => a + arr.length, 0);
              const subKeys = Object.keys(subs).sort();
              return (
                <div key={cat} className="catpdf-shoplist-section">
                  <div className="catpdf-shoplist-cat-band">
                    <span className="catpdf-shoplist-cat-name">{cat}</span>
                    <span className="catpdf-shoplist-cat-count">{totalCat} {totalCat === 1 ? 'item' : 'itens'}</span>
                  </div>
                  <ShoppingList subs={subs} subKeys={subKeys} />
                </div>
              );
            })}

            <footer className="catpdf-shoplist-foot">
              <span>Frios Ouro Fino Ltda. · (35) 99851-1194 · {SITE}</span>
              <span>Gerado em {formatDate()}</span>
            </footer>
          </section>
        ) : (
        <>
        {/* ====== CAPA ====== */}
        <section className="catpdf-cover">
          <div className="catpdf-cover-corner tl"><FleurOrnament /></div>
          <div className="catpdf-cover-corner tr"><FleurOrnament /></div>
          <div className="catpdf-cover-corner bl"><FleurOrnament /></div>
          <div className="catpdf-cover-corner br"><FleurOrnament /></div>

          <div className="catpdf-cover-top">
            <div className="catpdf-cover-ornament">
              <span /><span /><span /><span /><span />
            </div>
            <div className="catpdf-cover-kicker">desde sempre · tradição · qualidade</div>
          </div>

          <div className="catpdf-cover-main">
            <img src="/logo.jpg" alt="Frios Ouro Fino" className="catpdf-cover-logo" />
            <div className="catpdf-cover-brand">Frios Ouro Fino Ltda.</div>
            <div className="catpdf-cover-divider" />
            <h1 className="catpdf-cover-title">{titulo}</h1>
            <div className="catpdf-cover-subtitle">{subtitulo}</div>
          </div>

          <div className="catpdf-cover-stats">
            <div className="catpdf-cover-stat">
              <span className="catpdf-cover-stat-num">{totalItens}</span>
              <span className="catpdf-cover-stat-label">{totalItens === 1 ? 'item' : 'itens'}</span>
            </div>
            <div className="catpdf-cover-stat-divider" />
            <div className="catpdf-cover-stat">
              <span className="catpdf-cover-stat-num">{categoriasOrdenadas.length}</span>
              <span className="catpdf-cover-stat-label">{categoriasOrdenadas.length === 1 ? 'categoria' : 'categorias'}</span>
            </div>
            <div className="catpdf-cover-stat-divider" />
            <div className="catpdf-cover-stat">
              <span className="catpdf-cover-stat-num">{totalSubs}</span>
              <span className="catpdf-cover-stat-label">{totalSubs === 1 ? 'subcategoria' : 'subcategorias'}</span>
            </div>
          </div>

          <div className="catpdf-cover-qr">
            <img src={qrUrl(`https://${SITE}`, 200)} alt="QR code" className="catpdf-cover-qr-img" />
            <div className="catpdf-cover-qr-text">
              <div className="catpdf-cover-qr-label">Catálogo online</div>
              <div className="catpdf-cover-qr-site">{SITE}</div>
            </div>
          </div>

          <div className="catpdf-cover-bottom">
            <div className="catpdf-cover-ornament">
              <span /><span /><span /><span /><span />
            </div>
            <div className="catpdf-cover-date">{formatDate()}</div>
          </div>
        </section>

        {/* ====== PÁGINAS DE CATEGORIA ====== */}
        {categoriasOrdenadas.map((cat) => {
          const subs = grouped[cat];
          const totalCat = Object.values(subs).reduce((a, arr) => a + arr.length, 0);
          const subKeys = Object.keys(subs).sort();
          return (
            <div key={cat} className="catpdf-section">
              {/* Divisor fullbleed da categoria */}
              <section className="catpdf-section-divider">
                <div className="catpdf-section-divider-inner">
                  <div className="catpdf-section-divider-kicker">Categoria</div>
                  <h2 className="catpdf-section-divider-name">{cat}</h2>
                  <div className="catpdf-section-divider-rule" />
                  <div className="catpdf-section-divider-count">
                    {totalCat} {totalCat === 1 ? 'item' : 'itens'} · {subKeys.length} {subKeys.length === 1 ? 'subcategoria' : 'subcategorias'}
                  </div>
                  <FleurOrnament className="catpdf-section-divider-fleur" />
                </div>
              </section>

              {/* Subcategorias */}
              <section className="catpdf-categoria">
                {subKeys.map((sub) => (
                  <div key={sub} className="catpdf-subcategoria">
                    <h3 className="catpdf-subcategoria-name">
                      <span className="catpdf-subcategoria-ornament">❧</span>
                      {sub}
                      <span className="catpdf-subcategoria-count">{subs[sub].length}</span>
                    </h3>
                    <div className="catpdf-grid">
                      {subs[sub].map((p) => <ProductCard key={p.firestoreId || p.id} product={p} layout={layout} />)}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          );
        })}

        {/* ====== CONTRA-CAPA ====== */}
        <section className="catpdf-backcover">
          <div className="catpdf-backcover-corner tl"><FleurOrnament /></div>
          <div className="catpdf-backcover-corner tr"><FleurOrnament /></div>
          <div className="catpdf-backcover-corner bl"><FleurOrnament /></div>
          <div className="catpdf-backcover-corner br"><FleurOrnament /></div>

          <div className="catpdf-backcover-inner">
            <img src="/logo.jpg" alt="Frios Ouro Fino" className="catpdf-backcover-logo" />
            <div className="catpdf-backcover-brand">Frios Ouro Fino Ltda.</div>
            <div className="catpdf-backcover-divider" />
            <p className="catpdf-backcover-tagline">
              Faça seu pedido pelo WhatsApp<br />ou acesse o catálogo online
            </p>

            <div className="catpdf-backcover-qrs">
              <div className="catpdf-backcover-qr-item">
                <img src={qrUrl(`https://wa.me/${WHATSAPP}`, 200)} alt="WhatsApp" />
                <div className="catpdf-backcover-qr-label">WhatsApp</div>
                <div className="catpdf-backcover-qr-value">(35) 99851-1194</div>
              </div>
              <div className="catpdf-backcover-qr-item">
                <img src={qrUrl(`https://${SITE}`, 200)} alt="Site" />
                <div className="catpdf-backcover-qr-label">Catálogo online</div>
                <div className="catpdf-backcover-qr-value">{SITE}</div>
              </div>
            </div>

            <div className="catpdf-backcover-footer">
              <div className="catpdf-backcover-date">Edição de {formatMonthYear()}</div>
              <div className="catpdf-backcover-note">Preços sujeitos a alteração sem aviso prévio</div>
            </div>
          </div>
        </section>
        </>
        )}
      </div>
    </div>
  );
}

function ShoppingList({ subs, subKeys }) {
  return (
    <div className="catpdf-shoplist">
      {subKeys.map((sub) => (
        <div key={sub} className="catpdf-shoplist-group">
          <h3 className="catpdf-shoplist-group-name">
            {sub}
            <span className="catpdf-shoplist-group-count">{subs[sub].length} {subs[sub].length === 1 ? 'item' : 'itens'}</span>
          </h3>
          <table className="catpdf-shoplist-table">
            <thead>
              <tr>
                <th className="col-chk">✓</th>
                <th className="col-num">#</th>
                <th className="col-name">Produto</th>
                <th className="col-unit">Emb.</th>
                <th className="col-qty">Qtd.</th>
                <th className="col-supplier">Fornecedor / Obs.</th>
              </tr>
            </thead>
            <tbody>
              {subs[sub].map((p, i) => (
                <tr key={p.firestoreId || p.id}>
                  <td className="col-chk"><span className="catpdf-shoplist-chk" /></td>
                  <td className="col-num">{i + 1}</td>
                  <td className="col-name">
                    <span className="catpdf-shoplist-name">{p.name}</span>
                    {p.description && <span className="catpdf-shoplist-desc">{p.description}</span>}
                  </td>
                  <td className="col-unit">{p.unit || 'un'}</td>
                  <td className="col-qty"><span className="catpdf-shoplist-qty-line" /></td>
                  <td className="col-supplier"><span className="catpdf-shoplist-supplier-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product: p, layout }) {
  // step 0: URL original | 1: proxy weserv | 2: placeholder
  const [step, setStep] = useState(0);
  const price = formatPrice(p.price);

  const proxy = proxySrc(p.image);
  let src = null;
  if (step === 0) src = p.image || null;
  else if (step === 1) src = proxy;

  const handleError = () => {
    // se não é interno e ainda não tentou proxy, tenta proxy
    if (step === 0 && proxy) setStep(1);
    else setStep(2);
  };

  return (
    <article className={`catpdf-card ${p.outOfStock ? 'out' : ''} layout-${layout}`}>
      <div className="catpdf-card-img-wrap">
        {src ? (
          <img
            src={src}
            alt={p.name}
            className="catpdf-card-img"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={handleError}
          />
        ) : (
          <div className="catpdf-card-img-placeholder">
            {(p.name || '?').charAt(0).toUpperCase()}
          </div>
        )}
        {p.outOfStock && <div className="catpdf-card-badge">ESGOTADO</div>}
      </div>
      <div className="catpdf-card-body">
        <h4 className="catpdf-card-name">{p.name}</h4>
        {layout === 'detalhado' && p.description && (
          <p className="catpdf-card-desc">{p.description}</p>
        )}
        <div className="catpdf-card-meta">
          <span className="catpdf-card-unit">{p.unit || 'un'}</span>
          <span className={`catpdf-card-price ${price ? '' : 'no-price'}`}>
            {price || 'Consultar'}
          </span>
        </div>
      </div>
    </article>
  );
}
