import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { decryptSensitiveData } from '../utils/crypto';
import './AdminAprovacoesPage.css';

const TIPO_LABEL = {
  empresa: 'Empresa',
  pessoa_fisica: 'Pessoa Física',
  cliente: 'Cliente Antigo',
};

export default function AdminAprovacoesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const snap = await getDocs(query(collection(db, 'customers'), orderBy('createdAt', 'desc')));
        const arr = await Promise.all(snap.docs.map(async (d) => {
          const data = d.data();
          let plain = data;
          try { plain = await decryptSensitiveData(data, d.id); } catch { /* keep raw */ }
          return {
            uid: d.id,
            codigo: data.codigoCliente || '—',
            tipo: data.tipo,
            approved: data.approved === true,
            rejected: data.rejected === true,
            createdAt: data.createdAt,
            fichaSalva: data.fichaSalva === true,
            nome: plain.nomeFantasia || plain.razaoSocial || plain.nomeResponsavel || plain.email || '—',
            telefone: plain.telefone || '',
            email: plain.email || '',
            cnpj: plain.cnpj || '',
            cpf: plain.cpf || '',
            municipio: plain.municipio || '',
            estado: plain.estado || '',
          };
        }));
        if (!cancelled) setItems(arr);
      } catch (e) {
        if (!cancelled) setError('Erro ao carregar cadastros: ' + e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isToday = (ts) => {
    if (!ts) return false;
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    return d.getFullYear() === now.getFullYear()
      && d.getMonth() === now.getMonth()
      && d.getDate() === now.getDate();
  };

  const counts = useMemo(() => ({
    pending: items.filter(i => !i.approved && !i.rejected).length,
    today: items.filter(i => isToday(i.createdAt)).length,
    approved: items.filter(i => i.approved).length,
    rejected: items.filter(i => i.rejected).length,
    all: items.length,
  }), [items]);

  const filtered = useMemo(() => {
    if (filter === 'pending') return items.filter(i => !i.approved && !i.rejected);
    if (filter === 'today') return items.filter(i => isToday(i.createdAt));
    if (filter === 'approved') return items.filter(i => i.approved);
    if (filter === 'rejected') return items.filter(i => i.rejected);
    return items;
  }, [items, filter]);

  const fmtDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const dia = d.toLocaleDateString('pt-BR');
    const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isToday(ts)) return `Hoje · ${hora}`;
    return `${dia} · ${hora}`;
  };

  return (
    <div className="aaprovs-page">
      <div className="aaprovs-container">
        <div className="aaprovs-head">
          <button className="aaprovs-back" onClick={() => navigate('/')}>← Voltar</button>
          <div>
            <h1>Aprovações de Cadastro</h1>
            <p>Revise e libere os cadastros enviados pelos clientes.</p>
          </div>
        </div>

        <div className="aaprovs-tabs">
          <button className={`aaprovs-tab ${filter === 'pending' ? 'is-active' : ''}`} onClick={() => setFilter('pending')}>
            Pendentes <span className="aaprovs-badge aaprovs-badge--pending">{counts.pending}</span>
          </button>
          <button className={`aaprovs-tab ${filter === 'today' ? 'is-active' : ''}`} onClick={() => setFilter('today')}>
            Hoje <span className="aaprovs-badge">{counts.today}</span>
          </button>
          <button className={`aaprovs-tab ${filter === 'approved' ? 'is-active' : ''}`} onClick={() => setFilter('approved')}>
            Aprovados <span className="aaprovs-badge aaprovs-badge--ok">{counts.approved}</span>
          </button>
          <button className={`aaprovs-tab ${filter === 'rejected' ? 'is-active' : ''}`} onClick={() => setFilter('rejected')}>
            Rejeitados <span className="aaprovs-badge aaprovs-badge--rej">{counts.rejected}</span>
          </button>
          <button className={`aaprovs-tab ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
            Todos <span className="aaprovs-badge">{counts.all}</span>
          </button>
        </div>

        {loading && <div className="aaprovs-empty">Carregando cadastros…</div>}
        {error && <div className="aaprovs-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="aaprovs-empty">
            {filter === 'pending' ? 'Nenhum cadastro pendente. Tudo em dia!' : 'Nenhum cadastro nesta lista.'}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="aaprovs-list">
            {filtered.map(item => {
              const status = item.approved ? 'ok' : item.rejected ? 'rej' : 'pending';
              const statusLabel = item.approved ? 'Aprovado' : item.rejected ? 'Rejeitado' : 'Pendente';
              const docVal = item.cnpj || item.cpf || '';
              return (
                <button
                  key={item.uid}
                  className={`aaprovs-card aaprovs-card--${status}`}
                  onClick={() => navigate(`/admin/aprovar/${item.codigo}`)}
                >
                  <div className="aaprovs-card-top">
                    <span className="aaprovs-card-codigo">#{item.codigo}</span>
                    <span className={`aaprovs-card-status aaprovs-card-status--${status}`}>{statusLabel}</span>
                    {item.fichaSalva && <span className="aaprovs-card-pdf" title="Ficha em PDF anexa">📎 PDF</span>}
                  </div>
                  <div className="aaprovs-card-name">{item.nome}</div>
                  <div className="aaprovs-card-meta">
                    <span>{TIPO_LABEL[item.tipo] || '—'}</span>
                    {docVal && <span>· {docVal}</span>}
                    {item.telefone && <span>· {item.telefone}</span>}
                    {item.municipio && <span>· {item.municipio}{item.estado ? `/${item.estado}` : ''}</span>}
                  </div>
                  <div className="aaprovs-card-bottom">
                    <span className="aaprovs-card-date">{fmtDate(item.createdAt)}</span>
                    <span className="aaprovs-card-arrow">Abrir →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
