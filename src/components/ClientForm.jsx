import { useState, useRef, useCallback, useEffect } from 'react';
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

async function compressImage(file, maxDim = 900, quality = 0.62) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b || file), 'image/jpeg', quality);
  });
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return { blob, dataUrl, width: w, height: h };
}

export default function ClientForm({ open, onClose, onSwitchToLogin, initialTipo = 'empresa' }) {
  const { register } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // 'empresa' = cadastro PJ / 'pessoa_fisica' = cadastro PF / 'cliente' = ja sou cliente (simplificado)
  const [tipo, setTipo] = useState(initialTipo);

  useEffect(() => {
    if (open) setTipo(initialTipo);
  }, [open, initialTipo]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const isRegister = initialTipo !== 'cliente';
  const canvasRef = useRef(null);
  const fachadaInputRef = useRef(null);
  const fachadaCameraRef = useRef(null);
  const isDrawing = useRef(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [fachadaFile, setFachadaFile] = useState(null);
  const [fachadaPreview, setFachadaPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [successCode, setSuccessCode] = useState('');
  const isCliente = tipo === 'cliente';
  const isPessoaFisica = tipo === 'pessoa_fisica';
  const isEmpresa = tipo === 'empresa';

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
    if (loading) return;
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isDrawing.current = true;
  }, [loading]);

  const draw = useCallback((e) => {
    if (!isDrawing.current || !canvasRef.current) return;
    if (loading) return;
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
  }, [loading]);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
    if (fachadaCameraRef.current) fachadaCameraRef.current.value = '';
  };

  if (!open) return null;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const maskCpfCnpj = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 14);
    // ate 11 digitos -> CPF, a partir de 12 -> CNPJ
    if (v.length > 11) {
      v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})(\d{0,2})/, (_, a, b, c, d, e2) =>
        `${a}.${b}.${c}/${d}${e2 ? '-' + e2 : ''}`
      );
    } else if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setForm(prev => ({ ...prev, cpf: v }));
  };

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

  const buildPdfBlob = (photoDataUrl, photoW, photoH) => {
    const doc = new jsPDF();
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
    doc.text(`Ficha Cadastral - ${isPessoaFisica ? 'PESSOA FÍSICA' : 'EMPRESA'}`, 105, y, { align: 'center' });
    y += 4;
    doc.text(`Data: ${dataHora}`, 105, y, { align: 'center' });
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, 196, y);
    y += 4;

    if (!isPessoaFisica) {
      addSection('DADOS DA EMPRESA');
      addField('Razão Social', form.razaoSocial);
      addField('Nome Fantasia', form.nomeFantasia);
      addField('CNPJ', form.cnpj);
      addField('Insc. Municipal', form.inscMunicipal);
      addField('Insc. Estadual', form.inscEstadual);
    }

    addSection(isPessoaFisica ? 'DADOS PESSOAIS' : 'RESPONSÁVEL');
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

    if (!isPessoaFisica) {
      addSection('RESPONSÁVEL FINANCEIRO');
      addField('Nome', form.nomeFinanceiro);
      addField('Telefone', form.telefoneFinanceiro);
      addField('Email', form.emailFinanceiro);

      addSection('REFERÊNCIAS COMERCIAIS');
      addField('Ref. 1', `${form.ref1Nome} - ${form.ref1Telefone}`);
      addField('Ref. 2', `${form.ref2Nome} - ${form.ref2Telefone}`);
      addField('Ref. 3', `${form.ref3Nome} - ${form.ref3Telefone}`);
    }

    if (photoDataUrl) {
      const maxW = 150;
      const maxH = 100;
      const ratio = Math.min(maxW / (photoW || maxW), maxH / (photoH || maxH));
      const drawW = Math.max(40, (photoW || maxW) * ratio);
      const drawH = Math.max(40, (photoH || maxH) * ratio);
      if (y + drawH + 20 > 280) { doc.addPage(); y = 20; }
      addSection(isPessoaFisica ? 'FOTO DA RESIDÊNCIA' : 'FOTO DA FACHADA');
      const x = (210 - drawW) / 2;
      doc.setDrawColor(180, 180, 180);
      doc.rect(x - 1, y - 1, drawW + 2, drawH + 2);
      try {
        doc.addImage(photoDataUrl, 'JPEG', x, y, drawW, drawH);
      } catch {}
      y += drawH + 6;
    }

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
      `*CNPJ:* ${form.cnpj}\n` +
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

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    // ------------------ FLUXO: Ja sou cliente (simplificado) ------------------
    if (isCliente) {
      setLoading(true);
      setLoadingStep('Criando conta...');
      try {
        const profileData = {
          tipo: 'cliente',
          nomeResponsavel: form.nomeResponsavel,
          telefone: form.telefone,
          cpf: form.cpf, // armazena CPF ou CNPJ no mesmo campo
          email: form.email,
        };
        const { codigoCliente } = await register(form.email, password, profileData);
        setSuccessCode(codigoCliente);
        setForm(INITIAL);
        setPassword('');
        setConfirmPassword('');
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
      return;
    }

    // ------------------ FLUXO: Fazer meu Cadastro (empresa ou PF) ------------------
    if (!hasSigned) {
      setError('Por favor, assine o formulário antes de enviar.');
      return;
    }
    if (!fachadaFile) {
      setError(isPessoaFisica
        ? 'Envie uma foto da residência para concluir o cadastro.'
        : 'Envie uma foto da fachada para concluir o cadastro.');
      return;
    }

    setLoading(true);
    setLoadingStep('Criando conta...');

    try {
      const profileData = isPessoaFisica ? {
        tipo: 'pessoa_fisica',
        nomeResponsavel: form.nomeResponsavel,
        cpf: form.cpf,
        rg: form.rg,
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        municipio: form.municipio,
        estado: form.estado,
        cep: form.cep,
        telefone: form.telefone,
        email: form.email,
      } : {
        tipo: 'empresa',
        razaoSocial: form.razaoSocial,
        nomeFantasia: form.nomeFantasia,
        cnpj: form.cnpj,
        inscMunicipal: form.inscMunicipal,
        inscEstadual: form.inscEstadual,
        nomeResponsavel: form.nomeResponsavel,
        cpf: form.cpf,
        rg: form.rg,
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        municipio: form.municipio,
        estado: form.estado,
        cep: form.cep,
        telefone: form.telefone,
        email: form.email,
        nomeFinanceiro: form.nomeFinanceiro,
        telefoneFinanceiro: form.telefoneFinanceiro,
        emailFinanceiro: form.emailFinanceiro,
        referencias: [
          { nome: form.ref1Nome, telefone: form.ref1Telefone },
          { nome: form.ref2Nome, telefone: form.ref2Telefone },
          { nome: form.ref3Nome, telefone: form.ref3Telefone },
        ],
      };

      const { user: firebaseUser, codigoCliente } = await register(form.email, password, profileData);
      const uid = firebaseUser.uid;
      const nome = form.nomeFantasia || form.nomeResponsavel;
      const slug = slugify(nome);
      const ts = Date.now();
      const fileNamePdf = `Ficha_Cadastral_${slug}.pdf`;

      setLoadingStep('Processando foto...');
      let photoDataUrl = '';
      let photoW = 0;
      let photoH = 0;
      try {
        const compressed = await compressImage(fachadaFile);
        photoDataUrl = compressed.dataUrl;
        photoW = compressed.width;
        photoH = compressed.height;
      } catch (err) {
        console.error('Falha ao processar foto:', err);
      }

      setLoadingStep('Gerando PDF...');
      const pdfBlob = buildPdfBlob(photoDataUrl, photoW, photoH);

      setLoadingStep('Enviando arquivos...');
      const pdfRef = storageRef(storage, `fichas-cadastrais/${uid}-${ts}-${slug}.pdf`);
      const pdfUp = await uploadBytes(pdfRef, pdfBlob, { contentType: 'application/pdf' });
      const pdfUrl = await getDownloadURL(pdfUp.ref);

      let sent = false;
      if (REGISTRATION_API_URL) {
        setLoadingStep('Enviando para o WhatsApp...');
        try {
          const res = await fetch(REGISTRATION_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pdfUrl,
              imageUrl: '',
              clientName: nome,
              documento: isPessoaFisica ? form.cpf : form.cnpj,
              telefone: form.telefone,
              tipo: isPessoaFisica ? 'pessoa_fisica' : 'empresa',
              codigoCliente,
            }),
          });
          sent = res.ok;
        } catch {
          sent = false;
        }
      }

      setSuccessCode(codigoCliente);
      setForm(INITIAL);
      setPassword('');
      setConfirmPassword('');
      removeFachada();
      clearSignature();

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

  const closeAndReset = () => {
    setSuccessCode('');
    onClose();
  };

  // Tela de sucesso com codigo do cliente
  if (successCode) {
    return (
      <div className="cf-overlay" onClick={closeAndReset}>
        <div className="cf-modal cf-modal--success" onClick={(e) => e.stopPropagation()}>
          <div className="cf-success">
            <div className="cf-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Cadastro concluído!</h2>
            <p className="cf-success-sub">Anote seu código de cliente. Ele é necessário para fazer login.</p>
            <div className="cf-success-code">
              <span className="cf-success-code-label">Seu código de cliente</span>
              <span className="cf-success-code-value">{successCode}</span>
            </div>
            <p className="cf-success-hint">
              Guarde em local seguro. Você vai usar este código + sua senha para acessar a loja.
            </p>
            <button type="button" className="cf-submit" onClick={closeAndReset}>
              Entendi, quero começar a comprar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cf-overlay" onClick={loading ? undefined : onClose}>
      <div className="cf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cf-header">
          <h2>{isCliente ? 'Já sou cliente' : 'Quero me cadastrar'}</h2>
          <button className="cf-close" onClick={onClose} disabled={loading} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <form className={`cf-body ${loading ? 'cf-body--locked' : ''}`} onSubmit={handleSubmit} aria-busy={loading}>
          {error && <p className="cf-error">{error}</p>}

          <p className="cf-login-link">
            Já tem conta?{' '}
            <button type="button" onClick={onSwitchToLogin}>Faça login</button>
          </p>

          {/* =================== ABAS: Empresa / Pessoa Fisica =================== */}
          {isRegister && (
            <div className="cf-tipo-toggle" role="tablist">
              <button
                type="button"
                role="tab"
                className={`cf-tipo-btn ${isEmpresa ? 'cf-tipo-btn--active' : ''}`}
                onClick={() => setTipo('empresa')}
              >
                Empresa
              </button>
              <button
                type="button"
                role="tab"
                className={`cf-tipo-btn ${isPessoaFisica ? 'cf-tipo-btn--active' : ''}`}
                onClick={() => setTipo('pessoa_fisica')}
              >
                Pessoa Física
              </button>
            </div>
          )}

          {/* =================== FLUXO: Ja sou cliente (simplificado) =================== */}
          {isCliente && (
            <>
              <p className="cf-fachada-hint" style={{ marginTop: 0 }}>
                Cadastro rápido para clientes que já compram com a gente. Você receberá um código para fazer login.
              </p>
              <fieldset className="cf-section">
                <legend>Dados para acesso</legend>
                <div className="cf-row cf-row--full">
                  <label>Nome *<input required value={form.nomeResponsavel} onChange={set('nomeResponsavel')} /></label>
                </div>
                <div className="cf-row">
                  <label>Telefone *<input required value={form.telefone} onChange={maskTelefone('telefone')} placeholder="(00) 00000-0000" maxLength={15} inputMode="numeric" /></label>
                  <label>CNPJ/CPF *<input required value={form.cpf} onChange={maskCpfCnpj} placeholder="000.000.000-00" maxLength={18} inputMode="numeric" /></label>
                </div>
                <div className="cf-row cf-row--full">
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
            </>
          )}

          {/* =================== ABA: Fazer meu Cadastro (empresa / pessoa fisica) =================== */}
          {!isCliente && (
            <>
              {isEmpresa && (
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
                <legend>{isPessoaFisica ? 'Dados Pessoais' : 'Responsável'}</legend>
                <div className="cf-row cf-row--full">
                  <label>{isPessoaFisica ? 'Nome Completo *' : 'Nome do Responsável *'}<input required value={form.nomeResponsavel} onChange={set('nomeResponsavel')} /></label>
                </div>
                <div className="cf-row">
                  <label className="cf-small">CPF *<input required value={form.cpf} onChange={maskCpf} placeholder="000.000.000-00" maxLength={14} inputMode="numeric" /></label>
                  <label className="cf-small">RG<input value={form.rg} onChange={set('rg')} /></label>
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

              {isEmpresa && (
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

              {isEmpresa && (
                <fieldset className="cf-section">
                  <legend>Referências Comerciais</legend>
                  <div className="cf-row"><label>Nome<input value={form.ref1Nome} onChange={set('ref1Nome')} /></label><label className="cf-small">Telefone<input value={form.ref1Telefone} onChange={set('ref1Telefone')} /></label></div>
                  <div className="cf-row"><label>Nome<input value={form.ref2Nome} onChange={set('ref2Nome')} /></label><label className="cf-small">Telefone<input value={form.ref2Telefone} onChange={set('ref2Telefone')} /></label></div>
                  <div className="cf-row"><label>Nome<input value={form.ref3Nome} onChange={set('ref3Nome')} /></label><label className="cf-small">Telefone<input value={form.ref3Telefone} onChange={set('ref3Telefone')} /></label></div>
                </fieldset>
              )}

              <fieldset className="cf-section">
                <legend>{isPessoaFisica ? 'Foto da Residência *' : 'Foto da Fachada *'}</legend>
                <div className="cf-fachada">
                  <p className="cf-fachada-hint">
                    {isPessoaFisica
                      ? 'Envie uma foto da residência para facilitar a identificação e ajudar os entregadores.'
                      : 'Envie uma foto da fachada para facilitar o cadastro e ajudar os entregadores.'}
                  </p>
                  <input
                    ref={fachadaInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFachadaChange}
                    className="cf-fachada-input"
                    id="cf-fachada-input"
                  />
                  <input
                    ref={fachadaCameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFachadaChange}
                    className="cf-fachada-input"
                    id="cf-fachada-camera"
                  />
                  {!fachadaPreview ? (
                    <div className="cf-fachada-options">
                      <label htmlFor="cf-fachada-camera" className="cf-fachada-option">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span className="cf-fachada-option-text">Tirar foto agora</span>
                        <span className="cf-fachada-option-sub">Abrir câmera</span>
                      </label>
                      <label htmlFor="cf-fachada-input" className="cf-fachada-option">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className="cf-fachada-option-text">Escolher da galeria</span>
                        <span className="cf-fachada-option-sub">JPG ou PNG (até 15MB)</span>
                      </label>
                    </div>
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
            </>
          )}

          <button type="submit" className="cf-submit" disabled={loading}>
            {loading && <span className="cf-spinner" aria-hidden="true" />}
            {loading ? (loadingStep || 'Processando...') : (isCliente ? 'Salvar Senha e Criar Código de Cliente' : 'Criar Conta e Cadastrar')}
          </button>
        </form>
      </div>
    </div>
  );
}
