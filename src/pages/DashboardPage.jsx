import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import './DashboardPage.css';

const COLORS = ['#D44D2D', '#E8AB1D', '#2D7DD4', '#16a34a', '#8B5E3C', '#E8664A', '#5A9BE6', '#C89A10', '#6B4530', '#F5C94A', '#3A1F10', '#25D366'];
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('todos');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => {
          const d = doc.data();
          return { ...d, id: doc.id, date: d.createdAt?.toDate() };
        }));
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Filtrar por periodo
  const filteredOrders = useMemo(() => {
    if (periodo === 'todos') return orders;
    const now = new Date();
    const months = periodo === '3m' ? 3 : periodo === '6m' ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
    return orders.filter(o => o.date && o.date >= cutoff);
  }, [orders, periodo]);

  // ==================== KPIs ====================
  const kpis = useMemo(() => {
    const totalPedidos = filteredOrders.length;
    const totalGasto = filteredOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const totalItens = filteredOrders.reduce((s, o) => s + (o.totalItems || 0), 0);
    const mediaItens = totalPedidos > 0 ? (totalItens / totalPedidos).toFixed(0) : 0;

    // Produto favorito
    const prodCount = {};
    filteredOrders.forEach(o => {
      o.items?.forEach(item => {
        prodCount[item.name] = (prodCount[item.name] || 0) + item.quantity;
      });
    });
    const favorito = Object.entries(prodCount).sort((a, b) => b[1] - a[1])[0];

    return { totalPedidos, totalGasto, totalItens, mediaItens, favorito: favorito?.[0] || '-', favoritoQty: favorito?.[1] || 0 };
  }, [filteredOrders]);

  // ==================== Top 10 Produtos ====================
  const topProdutos = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      o.items?.forEach(item => {
        if (!map[item.name]) map[item.name] = { name: item.name, quantidade: 0, pedidos: 0 };
        map[item.name].quantidade += item.quantity;
        map[item.name].pedidos += 1;
      });
    });
    return Object.values(map).sort((a, b) => b.quantidade - a.quantidade).slice(0, 10);
  }, [filteredOrders]);

  // ==================== Gastos Mensais ====================
  const gastosMensais = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (!o.date) return;
      const key = `${o.date.getFullYear()}-${String(o.date.getMonth() + 1).padStart(2, '0')}`;
      const label = `${MONTHS[o.date.getMonth()]}/${String(o.date.getFullYear()).slice(2)}`;
      if (!map[key]) map[key] = { key, label, gasto: 0, pedidos: 0, itens: 0 };
      map[key].gasto += o.totalPrice || 0;
      map[key].pedidos += 1;
      map[key].itens += o.totalItems || 0;
    });
    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  }, [filteredOrders]);

  // ==================== Sazonalidade (Meses do Ano) ====================
  const sazonalidade = useMemo(() => {
    const meses = MONTHS.map((name, i) => ({ name, pedidos: 0, itens: 0, gasto: 0 }));
    filteredOrders.forEach(o => {
      if (!o.date) return;
      const m = o.date.getMonth();
      meses[m].pedidos += 1;
      meses[m].itens += o.totalItems || 0;
      meses[m].gasto += o.totalPrice || 0;
    });
    return meses;
  }, [filteredOrders]);

  // ==================== Distribuicao por Subcategoria ====================
  const subcategorias = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      o.items?.forEach(item => {
        // Inferir subcategoria pelo nome (simplificado)
        let sub = 'Outros';
        const n = item.name.toLowerCase();
        if (n.includes('azeitona')) sub = 'Conservas';
        else if (n.includes('maionese') || n.includes('catchup') || n.includes('alho')) sub = 'Molhos e Condimentos';
        else if (n.includes('açúcar') || n.includes('acucar')) sub = 'Açúcar';
        else if (n.includes('farinha')) sub = 'Farinhas';
        else if (n.includes('leite condensado') || n.includes('atum') || n.includes('ervilha')) sub = 'Enlatados/Conservas';
        else if (n.includes('gordura') || n.includes('azeite')) sub = 'Óleos';
        else if (n.includes('leite integral')) sub = 'Laticínios';
        else if (n.includes('batata')) sub = 'Snacks';
        else if (n.includes('champignon')) sub = 'Conservas';

        if (!map[sub]) map[sub] = { name: sub, value: 0 };
        map[sub].value += item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [filteredOrders]);

  // ==================== Frequencia de Compra por Produto ====================
  const frequencia = useMemo(() => {
    const totalOrders = filteredOrders.length;
    if (totalOrders === 0) return [];
    const map = {};
    filteredOrders.forEach(o => {
      const seen = new Set();
      o.items?.forEach(item => {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          map[item.name] = (map[item.name] || 0) + 1;
        }
      });
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 20) + '...' : name, frequencia: Math.round((count / totalOrders) * 100) }))
      .sort((a, b) => b.frequencia - a.frequencia)
      .slice(0, 12);
  }, [filteredOrders]);

  // ==================== Evolucao Top 3 Produtos ao longo do tempo ====================
  const evolucaoTop3 = useMemo(() => {
    // Pegar top 3 produtos
    const prodMap = {};
    filteredOrders.forEach(o => {
      o.items?.forEach(item => {
        prodMap[item.name] = (prodMap[item.name] || 0) + item.quantity;
      });
    });
    const top3 = Object.entries(prodMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    // Agrupar por mes
    const monthMap = {};
    filteredOrders.forEach(o => {
      if (!o.date) return;
      const key = `${o.date.getFullYear()}-${String(o.date.getMonth() + 1).padStart(2, '0')}`;
      const label = `${MONTHS[o.date.getMonth()]}/${String(o.date.getFullYear()).slice(2)}`;
      if (!monthMap[key]) monthMap[key] = { key, label };
      o.items?.forEach(item => {
        if (top3.includes(item.name)) {
          const shortName = item.name.length > 18 ? item.name.slice(0, 18) + '...' : item.name;
          monthMap[key][shortName] = (monthMap[key][shortName] || 0) + item.quantity;
        }
      });
    });

    return { data: Object.values(monthMap).sort((a, b) => a.key.localeCompare(b.key)), keys: top3.map(n => n.length > 18 ? n.slice(0, 18) + '...' : n) };
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-loading"><div className="dash-spinner" /><span>Carregando dashboard...</span></div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-top">
        <div>
          <h1>Dashboard</h1>
          <p>Análise dos seus pedidos e consumo</p>
        </div>
        <div className="dash-periodo">
          {[['todos', 'Todos'], ['12m', '12 meses'], ['6m', '6 meses'], ['3m', '3 meses']].map(([val, label]) => (
            <button key={val} className={`dash-periodo-btn ${periodo === val ? 'active' : ''}`} onClick={() => setPeriodo(val)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="dash-kpis">
        <div className="dash-kpi">
          <span className="dash-kpi-value">{kpis.totalPedidos}</span>
          <span className="dash-kpi-label">Pedidos</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi-value">R$ {kpis.totalGasto.toFixed(0)}</span>
          <span className="dash-kpi-label">Total Gasto</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi-value">{kpis.totalItens}</span>
          <span className="dash-kpi-label">Itens Movimentados</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi-value">{kpis.mediaItens}</span>
          <span className="dash-kpi-label">Média itens/pedido</span>
        </div>
      </div>

      <div className="dash-favorite">
        Produto favorito: <strong>{kpis.favorito}</strong> ({kpis.favoritoQty} unidades)
      </div>

      {/* Gastos Mensais */}
      <div className="dash-card">
        <h3>Gastos Mensais</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={gastosMensais}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} />
            <Tooltip formatter={(v) => `R$ ${v.toFixed(2)}`} />
            <Area type="monotone" dataKey="gasto" stroke="#D44D2D" fill="#D44D2D" fillOpacity={0.15} strokeWidth={2.5} name="Gasto (R$)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="dash-grid-2">
        {/* Top 10 Produtos */}
        <div className="dash-card">
          <h3>Top 10 Produtos (quantidade)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topProdutos} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#E8AB1D" radius={[0, 4, 4, 0]} name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuicao por Subcategoria */}
        <div className="dash-card">
          <h3>Distribuição por Categoria</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={subcategorias} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={55} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                {subcategorias.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v} unidades`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sazonalidade */}
      <div className="dash-card">
        <h3>Sazonalidade — Pedidos por Mês do Ano</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sazonalidade}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="pedidos" fill="#2D7DD4" radius={[4, 4, 0, 0]} name="Pedidos" />
            <Bar dataKey="itens" fill="#E8AB1D" radius={[4, 4, 0, 0]} name="Itens" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dash-grid-2">
        {/* Frequencia de Compra */}
        <div className="dash-card">
          <h3>Frequência de Compra (%)</h3>
          <p className="dash-card-sub">Em quantos pedidos cada produto aparece</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={frequencia} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="frequencia" fill="#16a34a" radius={[0, 4, 4, 0]} name="Frequência" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolução Top 3 */}
        <div className="dash-card">
          <h3>Evolução dos Top 3 Produtos</h3>
          <p className="dash-card-sub">Quantidade ao longo dos meses</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={evolucaoTop3.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {evolucaoTop3.keys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} name={key} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Mensal */}
      <div className="dash-card">
        <h3>Volume de Itens por Mês</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={gastosMensais}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="itens" fill="#8B5E3C" radius={[4, 4, 0, 0]} name="Itens" />
            <Bar dataKey="pedidos" fill="#E8AB1D" radius={[4, 4, 0, 0]} name="Pedidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
