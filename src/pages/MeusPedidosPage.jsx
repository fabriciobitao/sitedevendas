import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import OrderCard from '../components/OrderCard';
import './MeusPedidosPage.css';

export default function MeusPedidosPage() {
  const { user } = useAuth();
  const { loadOrder } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        setError('Erro ao carregar pedidos. Tente novamente em alguns instantes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleRepeatOrder = (order) => {
    const warnings = loadOrder(order.items);
    if (warnings.length > 0) {
      alert(`Atenção: os seguintes produtos não estão mais disponíveis:\n\n${warnings.join('\n')}\n\nOs demais foram adicionados ao carrinho.`);
    }
    navigate('/');
  };

  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <h1>Meus Pedidos</h1>
        <p>Veja seus pedidos anteriores e repita com um clique</p>
      </div>

      {/* Botao Repetir Ultimo Pedido */}
      {!loading && !error && orders.length > 0 && (
        <button className="pedidos-repeat-btn" onClick={() => handleRepeatOrder(orders[0])}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Repetir meu pedido
        </button>
      )}

      {error ? (
        <div className="pedidos-empty">
          <span className="pedidos-empty-icon">⚠️</span>
          <h3>{error}</h3>
          <button className="pedidos-back" onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      ) : loading ? (
        <div className="pedidos-loading">
          <div className="pedidos-spinner" />
          <span>Carregando pedidos...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="pedidos-empty">
          <span className="pedidos-empty-icon">📦</span>
          <h3>Nenhum pedido ainda</h3>
          <p>Seus pedidos aparecerão aqui depois de enviar o primeiro</p>
          <a href="/" className="pedidos-back">Ir para o catálogo</a>
        </div>
      ) : (
        <div className="pedidos-grid">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
