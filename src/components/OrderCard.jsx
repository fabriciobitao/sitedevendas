import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './OrderCard.css';

export default function OrderCard({ order }) {
  const { loadOrder } = useCart();
  const navigate = useNavigate();

  // Quantidades editaveis locais
  const [quantities, setQuantities] = useState(
    order.items.map(item => item.quantity)
  );

  const date = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Data não disponível';

  const updateQty = (index, delta) => {
    setQuantities(prev => {
      const next = [...prev];
      next[index] = Math.max(0, next[index] + delta);
      return next;
    });
  };

  const setQty = (index, value) => {
    const v = Math.max(0, parseInt(value) || 0);
    setQuantities(prev => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const getModifiedItems = () => {
    return order.items
      .map((item, i) => ({ ...item, quantity: quantities[i] }))
      .filter(item => item.quantity > 0);
  };

  const handleRepeat = () => {
    const items = getModifiedItems();
    if (items.length === 0) return;
    const warnings = loadOrder(items);
    if (warnings.length > 0) {
      alert(`Atenção: Os seguintes produtos foram removidos do catálogo:\n\n${warnings.join('\n')}\n\nOs demais foram adicionados ao carrinho.`);
    }
    navigate('/');
  };

  const handleAddMore = () => {
    const items = getModifiedItems();
    if (items.length === 0) {
      navigate('/');
      return;
    }
    const warnings = loadOrder(items);
    if (warnings.length > 0) {
      alert(`Atenção: Os seguintes produtos foram removidos do catálogo:\n\n${warnings.join('\n')}\n\nOs demais foram adicionados ao carrinho.`);
    }
    navigate('/');
  };

  const activeItems = order.items.filter((_, i) => quantities[i] > 0);
  const currentTotal = order.items.reduce((sum, item, i) => {
    return sum + (item.price || 0) * quantities[i];
  }, 0);
  const currentQty = quantities.reduce((sum, q) => sum + q, 0);

  return (
    <div className="order-card">
      <div className="order-card-header">
        <span className="order-card-date">{date}</span>
        <span className={`order-card-status order-card-status--${order.status}`}>
          {order.status === 'enviado' ? 'Enviado' : order.status}
        </span>
      </div>

      <div className="order-card-items">
        {order.items.map((item, i) => (
          <div key={i} className={`order-card-item ${quantities[i] === 0 ? 'order-card-item--removed' : ''}`}>
            <div className="order-card-item-info">
              <span className="order-card-item-name">{item.name}</span>
              {item.price != null && (
                <span className="order-card-item-price">R$ {item.price.toFixed(2)}/{item.unit}</span>
              )}
            </div>
            <div className="order-card-qty">
              <button className="order-qty-btn" onClick={() => updateQty(i, -1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
              </button>
              <input
                type="number"
                className="order-qty-input"
                value={quantities[i]}
                onChange={(e) => setQty(i, e.target.value)}
                min="0"
              />
              <button className="order-qty-btn" onClick={() => updateQty(i, 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <div className="order-card-total">
          <span>{currentQty} itens</span>
          {currentTotal > 0 && <strong>R$ {currentTotal.toFixed(2)}</strong>}
          {order.hasItemsWithoutPrice && <small>* preços a consultar</small>}
        </div>
        <div className="order-card-actions">
          <button className="order-card-repeat" onClick={handleRepeat} disabled={currentQty === 0}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Repetir Pedido
          </button>
          <button className="order-card-addmore" onClick={handleAddMore}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"/><path d="M5 12h14"/>
            </svg>
            Adicionar mais
          </button>
        </div>
      </div>
    </div>
  );
}
