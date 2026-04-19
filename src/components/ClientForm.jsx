import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import './ClientForm.css';

const REGISTRATION_API_URL = import.meta.env.VITE_REGISTRATION_API_URL || '';

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

const slugify = (v) =>
  (v || 'cliente')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);

// Comprime imagem no client (reduz custo de upload no 3G)
async function compressImage(file, maxDim = 1600, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality);
  });
}

export default function ClientForm({ open, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tipo, setTipo] = useState('empresa');
  const canvasRef = useRef(null);
  const fachadaInputRef = useRef(null);
  const isDrawing = useRef(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [fachadaFile, setFachadaFile] = useState(null);
  const [fachadaPreview, setFachadaPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
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

  const handleFachadaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('O arquivo da fachada deve ser uma imagem.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('A foto da fachada deve ter no máximo 15MB.');
      return;
    }
    setError('');
    setFachadaFile(file);
    setFachadaPreview(URL.createObjectURL(file));
  };

  const removeFachada = () => {
    if (fachadaPreview) URL.revokeObjectURL(fachadaPreview);
    setFachadaFile(null);
    setFachadaPreview('');
    if (fachadaInputRef.current) fachadaInputRef.current.value = '';
  };

  if (!open) return null;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const maskCpf = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    setForm(prev => ({ ...prev, cpf: v }));
  };

  const maskCnpj = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 14);
    if (v.length > 12) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
    else if (v.length > 8) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
    else if (v.length > 5) v = v.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,3})/, '$1.$2');
    setForm(prev => ({ ...prev, cnpj: v }));
  };

  const maskTelefone = (field) => (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    setForm(prev => ({ ...prev, [field]: v }));
  };

  const handleCep = async (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
    setForm(prev => ({ ...prev, cep: value }));

    const digits = value.replace(/\D/g, '');
    if (digits.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            cep: value,
            municipio: data.localidade || '',
            estado: data.uf || '',
            bairro: data.bairro || prev.bairro,
            endereco: data.logradouro || prev.endereco,
          }));
        }
      } catch {}
    }
  };

  // Gera o PDF e retorna um Blob (sem baixar automaticamente)
  const buildPdfBlob = () => {
    const doc = new jsPDF();
    const tipoLabel = isPF ? 'CONSUMIDOR FINAL' : 'EMPRESA';
    const now = new Date();
    const dataHora = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    let y = 20;

    const addTitle = (text) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 125, 45);
      doc.text(text, 105, y, { align: 'center' });
      y += 8;
    };

    const addSection = (title) => {
      y += 4;
      doc.setFillColor(240, 240, 240);
      doc.rect(14, y - 5, 182, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text(title, 16, y);
      y += 8;
    };

    const addField = (label, value) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(`${label}:`, 16, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(value || '—', 70, y);
      y += 6;
    };

    doc.setFillColor(45, 125, 45);
    doc.rect(0, 0, 210, 3, 'F');
    addTitle('FRIOS OURO FINO LTDA');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('CNPJ: 12.612.824/0001-00', 105, y, { align: 'center' });
    y += 5;
    doc.text(`Ficha Cadastral - ${tipoLabel}`, 105, y, { align: 'center' });
    y += 4;
    doc.text(`Data: ${dataHora}`, 105, y, { align: 'center' });
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, 196, y);
    y += 4;

    if (!isPF) {
      addSection('DADOS DA EMPRESA');
      addField('Razão Social', form.razaoSocial);
      addField('Nome Fantasia', form.nomeFantasia);
      addField('CNPJ', form.cnpj);
      addField('Insc. Municipal', form.inscMunicipal);
      addField('Insc. Estadual', form.inscEstadual);
    }

    addSection(isPF ? 'DADOS PESSOAIS' : 'RESPONSÁVEL');
    addField('Nome', form.nomeResponsavel);
    addField('CPF', form.cpf);
    addField('RG', form.rg);

    addSection('ENDEREÇO');
    addField('Endereço', `${form.endereco}, Nº ${form.numero}`);
    addField('Complemento', form.complemento);
    addField('Bairro', form.bairro);
    addField('Município', `${form.municipio} - ${form.estado}`);
    addField('CEP', form.cep);

    addSection('CONTATO');
    addField('Telefone', form.telefone);
    addField('Email', form.email);

    if (!isPF) {
      addSection('RESPONSÁVEL FINANCEIRO');
      addField('Nome', form.nomeFinanceiro);
      addField('Telefone', form.telefoneFinanceiro);
      addField('Email', form.emailFinanceiro);
    }

    addSection('REFERÊNCIAS COMERCIAIS');
    addField('Ref. 1', `${form.ref1Nome} - ${form.ref1Telefone}`);
    addField('Ref. 2', `${form.ref2Nome} - ${form.ref2Telefone}`);
    addField('Ref. 3', `${form.ref3Nome} - ${form.ref3Telefone}`);

    y += 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    const termo = 'Autorizo a empresa Frios Ouro Fino LTDA, CNPJ 12.612.824/0001-00, a realizar o meu cadastro, assim como fazer consultas e emitir boletos referente às minhas compras.';
    const termoLines = doc.splitTextToSize(termo, 170);
    doc.text(termoLines, 16, y);
    y += termoLines.length * 4 + 6;

    if (y > 220) { doc.addPage(); y = 20; }
    addSection('ASSINATURA DIGITAL');
    y += 2;
    const canvas = canvasRef.current;
    const sigData = canvas.toDataURL('image/png');
    doc.setDrawColor(180, 180, 180);
    doc.rect(30, y, 150, 45);
    doc.addImage(sigData, 'PNG', 32, y + 2, 146, 41);
    y += 50;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Assinado digitalmente em ${dataHora}`, 105, y, { align: 'center' });

    doc.setFillColor(45, 125, 45);
    doc.rect(0, 294, 210, 3, 'F');

    return doc.output('blob');
  };

  // Fallback: baixar PDF e abrir WhatsApp com instrucao manual (se Cloud Function falhar)
  const fallbackDownloadAndOpenWhatsApp = (pdfBlob, fileName) => {
    try {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {}
    const nome = form.nomeFantasia || form.nomeResponsavel;
    const text = encodeURIComponent(
      `📋 *FICHA CADASTRAL*\n\n` +
      `*Nome:* ${nome}\n` +
      `*CNPJ/CPF:* ${isPF ? form.cpf : form.cnpj}\n` +
      `*Telefone:* ${form.telefone}\n\n` +
      `⚠️ Envio automático falhou. Anexe manualmente o PDF (${fileName}) e a foto da fachada nesta conversa.`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=+5535998511194&text=${text}`;
    const w = window.open(waUrl, '_blank');
    if (!w) window.location.href = waUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!hasSigned) {
      setError('Por favor, assine o formulário antes de enviar.');
      return;
    }
    if (!fachadaFile) {
      setError('Envie uma foto da fachada para concluir o cadastro.');
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
    setLoadingStep('Criando conta...');

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
      delete profileData.ref1Nome; delete profileData.ref1Telefone;
      delete profileData.ref2Nome; delete profileData.ref2Telefone;
      delete profileData.ref3Nome; delete profileData.ref3Telefone;

      // 1) Cria auth + Firestore
      const userCred = await register(form.email, password, profileData);
      const uid = userCred.uid;
      const nome = form.nomeFantasia || form.nomeResponsavel;
      const slug = slugify(nome);
      const ts = Date.now();
      const fileNamePdf = `Ficha_Cadastral_${slug}.pdf`;

      // 2) Gera PDF e comprime foto
      setLoadingStep('Gerando documentos...');
      const pdfBlob = buildPdfBlob();
      let imageBlob;
      try {
        imageBlob = await compressImage(fachadaFile);
      } catch {
        imageBlob = fachadaFile;
      }

      // 3) Upload pro Firebase Storage (paralelo)
      setLoadingStep('Enviando arquivos...');
      const pdfRef = storageRef(storage, `fichas-cadastrais/${uid}-${ts}-${slug}.pdf`);
      const imgRef = storageRef(storage, `fichas-cadastrais/${uid}-${ts}-${slug}-fachada.jpg`);
      const [pdfUp, imgUp] = await Promise.all([
        uploadBytes(pdfRef, pdfBlob, { contentType: 'application/pdf' }),
        uploadBytes(imgRef, imageBlob, { contentType: 'image/jpeg' }),
      ]);
      const [pdfUrl, imageUrl] = await Promise.all([
        getDownloadURL(pdfUp.ref),
        getDownloadURL(imgUp.ref),
      ]);

      // 4) Envia pro WhatsApp via Cloud Function
      let sent = false;
      if (REGISTRATION_API_URL) {
        setLoadingStep('Enviando para o WhatsApp...');
        try {
          const res = await fetch(REGISTRATION_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pdfUrl,
              imageUrl,
              clientName: nome,
              documento: isPF ? form.cpf : form.cnpj,
              telefone: form.telefone,
              tipo,
            }),
          });
          sent = res.ok;
        } catch {
          sent = false;
        }
      }

      // 5) Limpa estado
      setForm(INITIAL);
      setPassword('');
      setConfirmPassword('');
      removeFachada();
      clearSignature();
      onClose();

      // 6) Fallback se envio automatico falhou
      if (!sent) {
        fallbackDownloadAndOpenWhatsApp(pdfBlob, fileNamePdf);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Faça login.');
      } else {
        console.error(err);
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
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
                <label>CNPJ *<input required value={form.cnpj} onChange={maskCnpj} placeholder="00.000.000/0000-00" maxLength={18} inputMode="numeric" /></label>
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
              <label className="cf-small">CPF *<input required value={form.cpf} onChange={maskCpf} placeholder="000.000.000-00" maxLength={14} inputMode="numeric" /></label>
              <label className="cf-small">RG {isPF ? '*' : ''}<input required={isPF} value={form.rg} onChange={set('rg')} /></label>
            </div>
          </fieldset>

          <fieldset className="cf-section">
            <legend>Endereço</legend>
            <div className="cf-row">
              <label className="cf-small">CEP *<input required value={form.cep} onChange={handleCep} placeholder="00000-000" maxLength={9} inputMode="numeric" /></label>
              <label>Município *<input required value={form.municipio} onChange={set('municipio')} /></label>
              <label className="cf-tiny">UF *<input required value={form.estado} onChange={set('estado')} maxLength={2} placeholder="MG" /></label>
            </div>
            <div className="cf-row">
              <label>Endereço *<input required value={form.endereco} onChange={set('endereco')} /></label>
              <label className="cf-tiny">Nº *<input required value={form.numero} onChange={set('numero')} /></label>
            </div>
            <div className="cf-row">
              <label>Bairro *<input required value={form.bairro} onChange={set('bairro')} /></label>
              <label>Complemento<input value={form.complemento} onChange={set('complemento')} /></label>
            </div>
          </fieldset>

          <fieldset className="cf-section">
            <legend>Contato e Acesso</legend>
            <div className="cf-row">
              <label>Telefone *<input required value={form.telefone} onChange={maskTelefone('telefone')} placeholder="(00) 00000-0000" maxLength={15} inputMode="numeric" /></label>
              <label>Email *<input required type="email" value={form.email} onChange={set('email')} /></label>
            </div>
            <div className="cf-row">
              <label>Senha *
                <div className="cf-password-wrap">
                  <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} />
                  <button type="button" className="cf-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </label>
              <label>Confirmar Senha *
                <div className="cf-password-wrap">
                  <input required type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" />
                  {confirmPassword && (
                    <span className={`cf-password-match ${password === confirmPassword ? 'match' : 'no-match'}`}>
                      {password === confirmPassword ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </label>
            </div>
          </fieldset>

          {!isPF && (
            <fieldset className="cf-section">
              <legend>Responsável Financeiro</legend>
              <div className="cf-row cf-row--full">
                <label>Nome *<input required value={form.nomeFinanceiro} onChange={set('nomeFinanceiro')} /></label>
              </div>
              <div className="cf-row">
                <label>Telefone *<input required value={form.telefoneFinanceiro} onChange={maskTelefone('telefoneFinanceiro')} placeholder="(00) 00000-0000" maxLength={15} inputMode="numeric" /></label>
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

          <fieldset className="cf-section">
            <legend>Foto da Fachada *</legend>
            <div className="cf-fachada">
              <p className="cf-fachada-hint">
                Envie uma foto da fachada para facilitar o cadastro e ajudar os entregadores.
              </p>
              <input
                ref={fachadaInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFachadaChange}
                className="cf-fachada-input"
                id="cf-fachada-input"
              />
              {!fachadaPreview ? (
                <label htmlFor="cf-fachada-input" className="cf-fachada-dropzone">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span className="cf-fachada-dropzone-text">Tirar foto / Escolher imagem</span>
                  <span className="cf-fachada-dropzone-sub">JPG ou PNG (até 15MB)</span>
                </label>
              ) : (
                <div className="cf-fachada-preview">
                  <img src={fachadaPreview} alt="Prévia da fachada" />
                  <button type="button" className="cf-fachada-remove" onClick={removeFachada} aria-label="Remover foto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
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
            {loading ? (loadingStep || 'Processando...') : 'Criar Conta e Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
