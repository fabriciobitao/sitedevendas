import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { decryptSensitiveData } from '../utils/crypto';
import './AdminAprovarPage.css';

export default function AdminAprovarPage() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [uid, setUid] = useState('');
  const [approving, setApproving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const idxSnap = await getDoc(doc(db, 'login_index', codigo));
        if (!idxSnap.exists()) {
          if (!cancelled) setError(`Código ${codigo} não encontrado.`);
          return;
        }
        const { uid: foundUid } = idxSnap.data();
        const cSnap = await getDoc(doc(db, 'customers', foundUid));
        if (!cSnap.exists()) {
          if (!cancelled) setError('Cadastro não encontrado.');
          return;
        }
        const data = cSnap.data();
        const decrypted = await decryptSensitiveData(data, foundUid).catch(() => data);
        if (!cancelled) {
          setUid(foundUid);
          setProfile({ ...decrypted, approved: data.approved, createdAt: data.createdAt });
        }
      } catch (e) {
        if (!cancelled) setError('Erro ao carregar cadastro: ' + e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [codigo]);

  const handleAprovar = async () => {
    if (!uid) return;
    setApproving(true);
    setError('');
    try {
      await setDoc(doc(db, 'customers', uid), {
        approved: true,
        approvedAt: serverTimestamp(),
        approvedBy: user?.email || 'admin',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setDone(true);
    } catch (e) {
      setError('Erro ao aprovar: ' + e.message);
    } finally {
      setApproving(false);
    }
  };

  const handleRejeitar = async () => {
    if (!uid) return;
    if (!window.confirm('Rejeitar este cadastro? O cliente não conseguirá fazer login.')) return;
    setApproving(true);
    setError('');
    try {
      await setDoc(doc(db, 'customers', uid), {
        approved: false,
        rejected: true,
        rejectedAt: serverTimestamp(),
        rejectedBy: user?.email || 'admin',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setDone(true);
    } catch (e) {
      setError('Erro ao rejeitar: ' + e.message);
    } finally {
      setApproving(false);
    }
  };

  const fmtDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="aap-page"><div className="aap-card"><p>Carregando cadastro {codigo}...</p></div></div>;
  }
  if (error) {
    return <div className="aap-page"><div className="aap-card aap-card--error"><h2>Erro</h2><p>{error}</p><button onClick={() => navigate('/admin')}>Voltar ao admin</button></div></div>;
  }
  if (done) {
    return (
      <div className="aap-page">
        <div className="aap-card aap-card--success">
          <div className="aap-icon">✓</div>
          <h2>{profile?.rejected ? 'Cadastro rejeitado' : 'Cadastro aprovado!'}</h2>
          <p>Cliente <strong>{profile?.nomeFantasia || profile?.nomeResponsavel}</strong> · Código <strong>{codigo}</strong></p>
          <button onClick={() => navigate('/admin')}>Ir para admin</button>
        </div>
      </div>
    );
  }

  const nomePrincipal = profile?.nomeFantasia || profile?.razaoSocial || profile?.nomeResponsavel || 'Sem nome';
  const docTipo = profile?.cnpj ? 'CNPJ' : 'CPF';
  const docValor = profile?.cnpj || profile?.cpf || '—';
  const isApproved = profile?.approved === true;

  return (
    <div className="aap-page">
      <div className="aap-card">
        <div className="aap-header">
          <span className="aap-codigo">Código {codigo}</span>
          {isApproved && <span className="aap-status aap-status--ok">✓ Já aprovado</span>}
          {!isApproved && <span className="aap-status aap-status--pending">⏳ Pendente</span>}
        </div>

        <h1 className="aap-nome">{nomePrincipal}</h1>
        <p className="aap-tipo">{profile?.tipo === 'empresa' ? 'Empresa' : profile?.tipo === 'pessoa_fisica' ? 'Pessoa Física' : profile?.tipo === 'cliente' ? 'Cliente Antigo' : '—'}</p>

        <div className="aap-grid">
          <div><label>{docTipo}</label><span>{docValor}</span></div>
          <div><label>Telefone</label><span>{profile?.telefone || '—'}</span></div>
          <div><label>Email</label><span>{profile?.email || '—'}</span></div>
          <div><label>Responsável</label><span>{profile?.nomeResponsavel || '—'}</span></div>
          {profile?.razaoSocial && <div><label>Razão Social</label><span>{profile.razaoSocial}</span></div>}
          {profile?.endereco && (
            <div className="aap-full">
              <label>Endereço</label>
              <span>
                {profile.endereco}{profile.numero ? `, ${profile.numero}` : ''}
                {profile.complemento ? ` - ${profile.complemento}` : ''}
                {profile.bairro ? `, ${profile.bairro}` : ''}
                {profile.municipio ? ` - ${profile.municipio}` : ''}
                {profile.estado ? `/${profile.estado}` : ''}
                {profile.cep ? ` · CEP ${profile.cep}` : ''}
              </span>
            </div>
          )}
          {profile?.createdAt && <div><label>Cadastrado em</label><span>{fmtDate(profile.createdAt)}</span></div>}
        </div>

        {!isApproved && (
          <div className="aap-actions">
            <button className="aap-btn aap-btn--reject" onClick={handleRejeitar} disabled={approving}>
              Rejeitar
            </button>
            <button className="aap-btn aap-btn--approve" onClick={handleAprovar} disabled={approving}>
              {approving ? 'Aprovando...' : 'Aprovar e liberar login'}
            </button>
          </div>
        )}
        {isApproved && (
          <div className="aap-actions">
            <button className="aap-btn aap-btn--secondary" onClick={() => navigate('/admin')}>Voltar</button>
          </div>
        )}
      </div>
    </div>
  );
}
