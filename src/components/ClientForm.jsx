import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './ClientForm.css';

const INITIAL = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  inscMunicipal: '',
  inscEstadual: '',
  nomeResponsavel: '',
  cpf: '',
  rg: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: '',
  estado: '',
  cep: '',
  telefone: '',
  email: '',
  nomeFinanceiro: '',
  telefoneFinanceiro: '',
  emailFinanceiro: '',
  ref1Nome: '',
  ref1Telefone: '',
  ref2Nome: '',
  ref2Telefone: '',
  ref3Nome: '',
  ref3Telefone: '',
};

export default function ClientForm({ open, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipo, setTipo] = useState('empresa');
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isPF = tipo === 'consumidor';

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isDrawing.current = true;
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2D2418';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSigned(true);
  }, []);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  if (!open) return null;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const sendWhatsApp = () => {
    const tipoLabel = isPF ? 'CONSUMIDOR FINAL' : 'EMPRESA';
    const lines = [`📋 *FICHA CADASTRAL - ${tipoLabel}*`, ''];
    if (!isPF) {
      lines.push(
        `*Razão Social:* ${form.razaoSocial}`,
        `*Nome Fantasia:* ${form.nomeFantasia}`,
        `*CNPJ:* ${form.cnpj}`,
        `*Insc. Municipal:* ${form.inscMunicipal}`,
        `*Insc. Estadual:* ${form.inscEstadual}`,
        '',
      );
    }
    lines.push(
      `*Nome:* ${form.nomeResponsavel}`,
      `*CPF:* ${form.cpf}`,
      `*RG:* ${form.rg}`,
      '', `*Endereço:* ${form.endereco}, Nº ${form.numero}`,
      `*Complemento:* ${form.complemento}`,
      `*Bairro:* ${form.bairro}`,
      `*Município:* ${form.municipio} - ${form.estado}`,
      `*CEP:* ${form.cep}`,
      '', `*Telefone:* ${form.telefone}`,
      `*Email:* ${form.email}`,
    );
    if (!isPF) {
      lines.push(
        '', '*--- Responsável Financeiro ---*',
        `*Nome:* ${form.nomeFinanceiro}`,
        `*Telefone:* ${form.telefoneFinanceiro}`,
        `*Email:* ${form.emailFinanceiro}`,
      );
    }
    lines.push(
      '', '*--- Referências Comerciais ---*',
      `1. ${form.ref1Nome} - ${form.ref1Telefone}`,
      `2. ${form.ref2Nome} - ${form.ref2Telefone}`,
      `3. ${form.ref3Nome} - ${form.ref3Telefone}`,
    );
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/5535998511194?text=${text}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!hasSigned) {
      setError('Por favor, assine o formulário antes de enviar.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        tipo,
        ...form,
        referencias: [
          { nome: form.ref1Nome, telefone: form.ref1Telefone },
          { nome: form.ref2Nome, telefone: form.ref2Telefone },
          { nome: form.ref3Nome, telefone: form.ref3Telefone },
        ],
      };
      // Remove ref fields duplicados
      delete profileData.ref1Nome; delete profileData.ref1Telefone;
      delete profileData.ref2Nome; delete profileData.ref2Telefone;
      delete profileData.ref3Nome; delete profileData.ref3Telefone;

      await register(form.email, password, profileData);
      sendWhatsApp();
      setForm(INITIAL);
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Faça login.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cf-overlay" onClick={onClose}>
      <div className="cf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cf-header">
          <h2>Ficha Cadastral</h2>
          <button className="cf-close" onClick={onClose} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <form className="cf-body" onSubmit={handleSubmit}>
          {error && <p className="cf-error">{error}</p>}

          <p className="cf-login-link">
            Já tem conta?{' '}
            <button type="button" onClick={onSwitchToLogin}>Faça login</button>
          </p>

          <div className="cf-tipo-toggle">
            <button type="button" className={`cf-tipo-btn ${!isPF ? 'cf-tipo-btn--active' : ''}`} onClick={() => setTipo('empresa')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              Empresa
            </button>
            <button type="button" className={`cf-tipo-btn ${isPF ? 'cf-tipo-btn--active' : ''}`} onClick={() => setTipo('consumidor')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Consumidor Final
            </button>
          </div>

          {!isPF && (
            <fieldset className="cf-section">
              <legend>Dados da Empresa</legend>
              <div className="cf-row cf-row--full">
                <label>Razão Social *<input required value={form.razaoSocial} onChange={set('razaoSocial')} /></label>
              </div>
              <div className="cf-row">
                <label>Nome Fantasia *<input required value={form.nomeFantasia} onChange={set('nomeFantasia')} /></label>
                <label>CNPJ *<input required value={form.cnpj} onChange={set('cnpj')} placeholder="00.000.000/0000-00" /></label>
              </div>
              <div className="cf-row">
                <label>Inscrição Municipal<input value={form.inscMunicipal} onChange={set('inscMunicipal')} /></label>
                <label>Inscrição Estadual<input value={form.inscEstadual} onChange={set('inscEstadual')} /></label>
              </div>
            </fieldset>
          )}

          <fieldset className="cf-section">
            <legend>{isPF ? 'Dados Pessoais' : 'Responsável'}</legend>
            <div className="cf-row cf-row--full">
              <label>{isPF ? 'Nome Completo' : 'Nome do Responsável'} *<input required value={form.nomeResponsavel} onChange={set('nomeResponsavel')} /></label>
            </div>
            <div className="cf-row">
              <label className="cf-small">CPF *<input required value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" /></label>
              <label className="cf-small">RG {isPF ? '*' : ''}<input required={isPF} value={form.rg} onChange={set('rg')} /></label>
            </div>
          </fieldset>

          <fieldset className="cf-section">
            <legend>Endereço</legend>
            <div className="cf-row">
              <label>Endereço *<input required value={form.endereco} onChange={set('endereco')} /></label>
              <label className="cf-tiny">Nº *<input required value={form.numero} onChange={set('numero')} /></label>
            </div>
            <div className="cf-row">
              <label>Complemento<input value={form.complemento} onChange={set('complemento')} /></label>
              <label>Bairro *<input required value={form.bairro} onChange={set('bairro')} /></label>
            </div>
            <div className="cf-row cf-row--3">
              <label>Município *<input required value={form.municipio} onChange={set('municipio')} /></label>
              <label className="cf-tiny">Estado *<input required value={form.estado} onChange={set('estado')} maxLength={2} placeholder="MG" /></label>
              <label className="cf-small">CEP *<input required value={form.cep} onChange={set('cep')} placeholder="00000-000" /></label>
            </div>
          </fieldset>

          <fieldset className="cf-section">
            <legend>Contato e Acesso</legend>
            <div className="cf-row">
              <label>Telefone *<input required value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" /></label>
              <label>Email *<input required type="email" value={form.email} onChange={set('email')} /></label>
            </div>
            <div className="cf-row">
              <label>Senha *<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} /></label>
              <label>Confirmar Senha *<input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" /></label>
            </div>
          </fieldset>

          {!isPF && (
            <fieldset className="cf-section">
              <legend>Responsável Financeiro</legend>
              <div className="cf-row cf-row--full">
                <label>Nome *<input required value={form.nomeFinanceiro} onChange={set('nomeFinanceiro')} /></label>
              </div>
              <div className="cf-row">
                <label>Telefone *<input required value={form.telefoneFinanceiro} onChange={set('telefoneFinanceiro')} placeholder="(00) 00000-0000" /></label>
                <label>Email *<input required type="email" value={form.emailFinanceiro} onChange={set('emailFinanceiro')} /></label>
              </div>
            </fieldset>
          )}

          <fieldset className="cf-section">
            <legend>Referências Comerciais</legend>
            <div className="cf-row"><label>Nome<input value={form.ref1Nome} onChange={set('ref1Nome')} /></label><label className="cf-small">Telefone<input value={form.ref1Telefone} onChange={set('ref1Telefone')} /></label></div>
            <div className="cf-row"><label>Nome<input value={form.ref2Nome} onChange={set('ref2Nome')} /></label><label className="cf-small">Telefone<input value={form.ref2Telefone} onChange={set('ref2Telefone')} /></label></div>
            <div className="cf-row"><label>Nome<input value={form.ref3Nome} onChange={set('ref3Nome')} /></label><label className="cf-small">Telefone<input value={form.ref3Telefone} onChange={set('ref3Telefone')} /></label></div>
          </fieldset>

          <p className="cf-legal">
            Autorizo a empresa Frios Ouro Fino LTDA, CNPJ 12.612.824/0001-00, a realizar o meu cadastro,
            assim como fazer consultas e emitir boletos referente às minhas compras.
          </p>

          <div className="cf-signature">
            <div className="cf-signature-header">
              <span className="cf-signature-label">Assinatura Digital *</span>
              {hasSigned && (<button type="button" className="cf-signature-clear" onClick={clearSignature}>Limpar</button>)}
            </div>
            <canvas ref={canvasRef} width={560} height={160} className="cf-signature-canvas"
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
            {!hasSigned && (<span className="cf-signature-hint">Desenhe sua assinatura aqui</span>)}
          </div>

          <button type="submit" className="cf-submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta e Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
