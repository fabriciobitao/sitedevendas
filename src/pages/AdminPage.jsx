import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './AdminPage.css';

const UNITS = ['un', 'kg', 'cx', 'pct', 'fardo', 'litro'];

const EMPTY_FORM = {
  name: '',
  description: '',
  category: '',
  subcategory: '',
  price: '',
  showPrice: false,
  unit: 'un',
  image: '',
  order: '',
};

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    products,
    categories,
    subcategories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
  } = useProducts();

  // State
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('secos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = novo
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Drag & drop para reordenar
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const touchStartY = useRef(null);
  const touchItemIndex = useRef(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (index) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const items = [...filteredProducts];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(index, 0, moved);

    try {
      await reorderProducts(items);
      showToast('Ordem atualizada!');
    } catch (err) {
      console.error('Erro ao reordenar:', err);
      showToast('Erro ao reordenar.', 'error');
    }

    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Touch drag para mobile
  const handleTouchStart = (e, index) => {
    if (!reorderMode) return;
    touchStartY.current = e.touches[0].clientY;
    touchItemIndex.current = index;
    setDragIndex(index);
  };

  const handleTouchMove = (e, index) => {
    if (!reorderMode || touchStartY.current === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const elements = document.querySelectorAll('.admin-product-card');
    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i].getBoundingClientRect();
      if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        setDragOverIndex(i);
        break;
      }
    }
  };

  const handleTouchEnd = () => {
    if (dragOverIndex !== null && dragIndex !== null) {
      handleDrop(dragOverIndex);
    }
    touchStartY.current = null;
    touchItemIndex.current = null;
  };

  // Pesquisa de mercado
  const [marketProduct, setMarketProduct] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [competitorModalOpen, setCompetitorModalOpen] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', site: '' });

  // Carregar concorrentes do Firestore
  useEffect(() => {
    getDoc(doc(db, 'config', 'competitors')).then(snap => {
      if (snap.exists()) {
        setCompetitors(snap.data().list || []);
      } else {
        // Lista padrao
        const defaults = [
          { name: 'Dener Alimentos', site: 'deneralimentos.com.br' },
          { name: 'Mega G', site: 'megag.com.br' },
          { name: 'Google Shopping', site: '' },
        ];
        setCompetitors(defaults);
        setDoc(doc(db, 'config', 'competitors'), { list: defaults });
      }
    });
  }, []);

  // Salvar concorrentes
  const saveCompetitors = async (list) => {
    setCompetitors(list);
    await setDoc(doc(db, 'config', 'competitors'), { list });
  };

  const addCompetitor = async () => {
    if (!newCompetitor.name.trim()) return;
    const updated = [...competitors, { name: newCompetitor.name.trim(), site: newCompetitor.site.trim() }];
    await saveCompetitors(updated);
    setNewCompetitor({ name: '', site: '' });
    showToast('Concorrente adicionado!');
  };

  const removeCompetitor = async (index) => {
    const updated = competitors.filter((_, i) => i !== index);
    await saveCompetitors(updated);
  };

  const searchCompetitor = (productName, competitor) => {
    const query = encodeURIComponent(`${productName} ${competitor.name} preço`);
    if (competitor.site) {
      window.open(`https://www.google.com/search?q=${query}+site:${competitor.site}`, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${query}&tbm=shop`, '_blank');
    }
  };

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    const catName = filterCategory === 'resfriados' ? 'Resfriados'
      : filterCategory === 'congelados' ? 'Congelados' : 'Secos';
    let result = products.filter((p) => p.category === catName);

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.subcategory?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [products, filterCategory, search]);

  // Subcategorias filtradas pela categoria selecionada no form
  const formSubcategories = useMemo(() => {
    if (!form.category) return [];
    return subcategories[form.category] || [];
  }, [form.category, subcategories]);

  // Mostrar toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Abrir modal para novo produto
  const handleAdd = () => {
    setEditingProduct(null);
    setForm({ ...EMPTY_FORM, order: products.length });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      price: product.price !== null && product.price !== undefined ? String(product.price) : '',
      showPrice: product.price !== null && product.price !== undefined,
      unit: product.unit || 'un',
      image: product.image || '',
      order: product.order !== undefined ? String(product.order) : '',
    });
    setModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
  };

  // Atualizar campo do form
  const handleFieldChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Se mudar categoria, resetar subcategoria
      if (field === 'category') {
        updated.subcategory = '';
      }
      return updated;
    });
  };

  // Upload de imagem — comprime e converte para base64 (salva no Firestore, sem Storage)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Arquivo deve ser uma imagem.', 'error');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await compressImage(file, 600, 0.75);
      handleFieldChange('image', dataUrl);
      showToast('Imagem carregada!');
    } catch (err) {
      console.error('Erro na imagem:', err);
      showToast('Erro ao processar imagem.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Comprimir imagem para base64
  const compressImage = (file, maxSize, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > h) { if (w > maxSize) { h = (h * maxSize) / w; w = maxSize; } }
          else { if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; } }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/webp', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Salvar produto (novo ou edicao)
  const handleSave = async () => {
    // Validacao basica
    if (!form.name.trim()) {
      showToast('Nome do produto e obrigatorio.', 'error');
      return;
    }
    if (!form.category) {
      showToast('Selecione uma categoria.', 'error');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        ...form,
        price: form.price !== '' ? parseFloat(form.price) : null,
        order: form.order !== '' ? parseInt(form.order, 10) : products.length,
      };

      if (editingProduct && editingProduct.firestoreId) {
        await updateProduct(editingProduct.firestoreId, productData);
        showToast('Produto atualizado com sucesso!');
      } else {
        await addProduct(productData);
        showToast('Produto adicionado com sucesso!');
      }

      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      showToast('Erro ao salvar produto. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Confirmar exclusao
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm?.firestoreId) {
      showToast('Nao e possivel excluir este produto (sem ID no Firestore).', 'error');
      setDeleteConfirm(null);
      return;
    }

    try {
      await deleteProduct(deleteConfirm.firestoreId);
      showToast('Produto excluido com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      showToast('Erro ao excluir produto. Tente novamente.', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Formatar preco
  const formatPrice = (price) => {
    if (price === null || price === undefined) return null;
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <button className="admin-back-btn" onClick={() => navigate('/')} aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="admin-title">
            Gerenciar Produtos
            <span className="admin-count">({products.length})</span>
          </h1>
        </div>
        <button
          className={`admin-reorder-btn ${reorderMode ? 'active' : ''}`}
          onClick={() => setReorderMode(!reorderMode)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          {reorderMode ? 'Concluir' : 'Reordenar'}
        </button>
        <button className="admin-add-btn" onClick={handleAdd}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Produto
        </button>
      </div>

      {/* Search & Filters */}
      <div className="admin-filters">
        <div className="admin-search">
          <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, descricao ou subcategoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`admin-tab ${filterCategory === cat.id ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            {search ? '🔍' : '📦'}
          </div>
          <h3>{search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}</h3>
          <p>{search ? 'Tente buscar por outro termo' : 'Clique em "Adicionar Produto" para comecar'}</p>
        </div>
      ) : (
        <div className="admin-list">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.firestoreId || product.id}
              className={`admin-product-card ${reorderMode ? 'reorder-mode' : ''} ${dragIndex === idx ? 'dragging' : ''} ${dragOverIndex === idx ? 'drag-over' : ''}`}
              draggable={reorderMode}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              onTouchStart={(e) => handleTouchStart(e, idx)}
              onTouchMove={(e) => handleTouchMove(e, idx)}
              onTouchEnd={handleTouchEnd}
            >
              {reorderMode && (
                <div className="admin-drag-handle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>
                  </svg>
                </div>
              )}
              <div className="admin-product-img-wrap">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="admin-product-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="admin-product-img-placeholder" style={product.image ? { position: 'absolute', zIndex: -1 } : {}}>
                  {product.name ? product.name.charAt(0) : '📷'}
                </div>
              </div>

              <div className="admin-product-info">
                <h4 className="admin-product-name">{product.name}</h4>
                <div className="admin-product-meta">
                  <span className={`admin-product-badge cat-${product.category}`}>
                    {product.category}
                  </span>
                  <span className="admin-product-sub">{product.subcategory}</span>
                </div>
              </div>

              <span className="admin-product-unit">{product.unit}</span>

              <span className={`admin-product-price ${product.price === null || product.price === undefined ? 'no-price' : ''}`}>
                {formatPrice(product.price) || 'Consulte'}
              </span>

              {product.outOfStock && <span className="admin-out-of-stock-badge">ESGOTADO</span>}

              <div className="admin-product-actions">
                <button
                  className={`admin-btn-icon stock ${product.outOfStock ? 'out' : ''}`}
                  onClick={async () => {
                    if (product.firestoreId) {
                      await updateProduct(product.firestoreId, { outOfStock: !product.outOfStock });
                      showToast(product.outOfStock ? 'Produto disponivel!' : 'Marcado como esgotado!');
                    }
                  }}
                  aria-label={product.outOfStock ? 'Marcar disponivel' : 'Marcar esgotado'}
                  title={product.outOfStock ? 'Marcar disponivel' : 'Marcar esgotado'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </button>
                <button
                  className="admin-btn-icon market"
                  onClick={() => setMarketProduct(product)}
                  aria-label="Pesquisa de mercado"
                  title="Pesquisa de mercado"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </button>
                <button
                  className="admin-btn-icon"
                  onClick={() => handleEdit(product)}
                  aria-label="Editar"
                  title="Editar produto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className="admin-btn-icon danger"
                  onClick={() => setDeleteConfirm(product)}
                  aria-label="Excluir"
                  title="Excluir produto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Nome */}
              <div className="admin-field">
                <label>Nome do Produto *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Ex: Queijo Mussarela Fatiado 1kg"
                />
              </div>

              {/* Descricao */}
              <div className="admin-field">
                <label>Descricao</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Descricao detalhada do produto..."
                />
              </div>

              {/* Categoria + Subcategoria */}
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Categoria *</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Subcategoria</label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => handleFieldChange('subcategory', e.target.value)}
                    disabled={!form.category}
                  >
                    <option value="">Selecione...</option>
                    {formSubcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preco + Unidade */}
              <div className="admin-field">
                <label className="admin-toggle-label">
                  <span>Mostrar preco</span>
                  <button
                    type="button"
                    className={`admin-toggle ${form.showPrice ? 'active' : ''}`}
                    onClick={() => {
                      const newVal = !form.showPrice;
                      handleFieldChange('showPrice', newVal);
                      if (!newVal) handleFieldChange('price', '');
                    }}
                  >
                    <span className="admin-toggle-knob" />
                  </button>
                </label>
              </div>
              {form.showPrice && (
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Preco (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    placeholder="Digite o preco"
                  />
                </div>
                <div className="admin-field">
                  <label>Unidade</label>
                  <select
                    value={form.unit}
                    onChange={(e) => handleFieldChange('unit', e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              )}

              {/* Imagem */}
              <div className="admin-field">
                <label>Imagem</label>
                <div className="admin-image-section">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="admin-image-preview" />
                  ) : (
                    <div className="admin-image-preview-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      Sem imagem
                    </div>
                  )}
                  <div className="admin-image-actions">
                    <label className="admin-upload-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {uploading ? 'Enviando...' : 'Upload'}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                    <input
                      type="text"
                      className="admin-image-url-input"
                      value={form.image}
                      onChange={(e) => handleFieldChange('image', e.target.value)}
                      placeholder="Ou cole a URL da imagem"
                      style={{ padding: '8px 12px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--gray-800)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Ordem */}
              <div className="admin-field" style={{ maxWidth: '140px' }}>
                <label>Ordem</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => handleFieldChange('order', e.target.value)}
                  placeholder="Auto"
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="admin-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : editingProduct ? 'Salvar Alteracoes' : 'Adicionar Produto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-confirm-body">
              <div className="admin-confirm-icon">🗑️</div>
              <p className="admin-confirm-text">Tem certeza que deseja excluir?</p>
              <p className="admin-confirm-name">{deleteConfirm.name}</p>
              <div className="admin-confirm-actions">
                <button className="admin-btn-cancel" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </button>
                <button className="admin-btn-delete" onClick={handleDeleteConfirm}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {/* Modal Pesquisa de Mercado */}
      {marketProduct && (
        <div className="admin-modal-overlay" onClick={() => setMarketProduct(null)}>
          <div className="admin-modal market-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Pesquisa de Mercado</h2>
              <button className="admin-modal-close" onClick={() => setMarketProduct(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="market-product-name">{marketProduct.name}</div>
              <p className="market-desc">Clique em um concorrente para pesquisar o preco deste produto:</p>

              <div className="market-list">
                {competitors.map((comp, i) => (
                  <button key={i} className="market-competitor-btn" onClick={() => searchCompetitor(marketProduct.name, comp)}>
                    <span className="market-competitor-name">{comp.name}</span>
                    <span className="market-competitor-site">{comp.site || 'Google Shopping'}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </button>
                ))}
              </div>

              <button className="market-manage-btn" onClick={() => setCompetitorModalOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Gerenciar Concorrentes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Concorrentes */}
      {competitorModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setCompetitorModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Gerenciar Concorrentes</h2>
              <button className="admin-modal-close" onClick={() => setCompetitorModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="competitor-list">
                {competitors.map((comp, i) => (
                  <div key={i} className="competitor-item">
                    <div className="competitor-info">
                      <strong>{comp.name}</strong>
                      <span>{comp.site || 'Google Shopping'}</span>
                    </div>
                    <button className="admin-btn-icon danger" onClick={() => removeCompetitor(i)} title="Remover">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="competitor-add">
                <input
                  type="text"
                  placeholder="Nome do concorrente"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Site (ex: megag.com.br)"
                  value={newCompetitor.site}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, site: e.target.value }))}
                />
                <button className="competitor-add-btn" onClick={addCompetitor}>Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.type === 'success' ? 'success' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
