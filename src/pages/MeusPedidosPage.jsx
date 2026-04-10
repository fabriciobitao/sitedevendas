import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import OrderCard from '../components/OrderCard';
import './MeusPedidosPage.css';

export default function MeusPedidosPage() {
  const { user } = useAuth();
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

  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <h1>Meus Pedidos</h1>
        <p>Veja seus pedidos anteriores e repita com um clique</p>
      </div>

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
