import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import { validarCPF, validarCNPJ, consultarCNPJ, onlyDigits } from '../utils/docValidators';
import './ClientForm.css';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

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
    const scrollY = window.scrollY;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      document.body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
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
  const [pendingWhatsApp, setPendingWhatsApp] = useState(false);
  const [pdfReady, setPdfReady] = useState(null); // { blob, fileName, resumo }
  const [emailStatus, setEmailStatus] = useState('idle'); // idle|sending|sent|failed|not_configured
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [cpfValid, setCpfValid] = useState(null); // null|true|false
  const [cnpjValid, setCnpjValid] = useState(null);
  const [cnpjLookup, setCnpjLookup] = useState({ status: 'idle', situacao: '' }); // idle|loading|ok|notfound|inactive
  const isCliente = tipo === 'cliente';
  const isPessoaFisica = tipo === 'pessoa_fisica';
  const isEmpresa = tipo === 'empresa';

  // Valida CPF quando completo (11 digitos)
  useEffect(() => {
    const d = onlyDigits(form.cpf);
    if (d.length === 0) { setCpfValid(null); return; }
    if (d.length === 11) setCpfValid(validarCPF(d));
    else if (d.length === 14) setCpfValid(validarCNPJ(d)); // campo unificado no fluxo "ja sou cliente"
    else setCpfValid(null);
  }, [form.cpf]);

  // Valida CNPJ + consulta BrasilAPI quando completo
  useEffect(() => {
    const d = onlyDigits(form.cnpj);
    if (d.length === 0) { setCnpjValid(null); setCnpjLookup({ status: 'idle', situacao: '' }); return; }
    if (d.length !== 14) { setCnpjValid(null); setCnpjLookup({ status: 'idle', situacao: '' }); return; }
    const valid = validarCNPJ(d);
    setCnpjValid(valid);
    if (!valid) { setCnpjLookup({ status: 'idle', situacao: '' }); return; }

    let cancelled = false;
    setCnpjLookup({ status: 'loading', situacao: '' });
    consultarCNPJ(d).then(result => {
      if (cancelled) return;
      if (!result.ok) {
        if (result.reason === 'notfound') {
          setCnpjLookup({ status: 'notfound', situacao: '' });
        } else {
          setCnpjLookup({ status: 'network', situacao: '' });
        }
        return;
      }
      const info = result.data;
      const ativa = /ATIVA/i.test(info.situacao);
      setCnpjLookup({ status: ativa ? 'ok' : 'inactive', situacao: info.situacao });
      // Autopreenche apenas os campos vazios para nao sobrescrever edicoes do usuario
      setForm(prev => ({
        ...prev,
        razaoSocial: prev.razaoSocial || info.razaoSocial,
        nomeFantasia: prev.nomeFantasia || info.nomeFantasia || info.razaoSocial,
        cep: prev.cep || info.cep,
        endereco: prev.endereco || info.endereco,
        numero: prev.numero || info.numero,
        complemento: prev.complemento || info.complemento,
        bairro: prev.bairro || info.bairro,
        municipio: prev.municipio || info.municipio,
        estado: prev.estado || info.estado,
      }));
    });
    return () => { cancelled = true; };
  }, [form.cnpj]);

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

  // Dispara o envio pelo WhatsApp a partir de um clique direto do usuario (gesto).
  // Tenta Web Share API com arquivo (PDF anexado automaticamente). Fallback: baixa + abre wa.me.
  const sendPdfToWhatsApp = async () => {
    if (!pdfReady) return;
    const { blob, fileName, resumo } = pdfReady;
    const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

    // Caminho moderno: navigator.share com arquivo -> abre sheet nativo -> usuario escolhe WhatsApp
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          title: `Ficha Cadastral - ${form.nomeFantasia || form.nomeResponsavel}`,
          text: resumo,
          files: [pdfFile],
        });
        setWhatsAppSent(true);
        return;
      } catch (err) {
        // Usuario cancelou ou share falhou -> cai no fallback
        if (err && err.name === 'AbortError') return;
        console.warn('Share API falhou, usando fallback:', err);
      }
    }

    // Fallback: baixa PDF + abre WhatsApp com texto (usuario anexa manualmente)
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {}
    const waText = encodeURIComponent(
      `${resumo}\n\n📎 Ficha em PDF foi baixada no seu aparelho. Toque no clipe 📎 e anexe o arquivo "${fileName}".`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=+5535998511194&text=${waText}`;
    const w = window.open(waUrl, '_blank');
    if (!w) window.location.href = waUrl;
    setWhatsAppSent(true);
  };

  const downloadPdfOnly = () => {
    if (!pdfReady) return;
    const { blob, fileName } = pdfReady;
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {}
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

    // Validacao de documento (CPF/CNPJ)
    if (isPessoaFisica) {
      if (!validarCPF(form.cpf)) {
        setError('CPF inválido. Confira os dígitos.');
        return;
      }
    } else if (isEmpresa) {
      if (!validarCNPJ(form.cnpj)) {
        setError('CNPJ inválido. Confira os dígitos.');
        return;
      }
      if (!validarCPF(form.cpf)) {
        setError('CPF do responsável inválido. Confira os dígitos.');
        return;
      }
      if (cnpjLookup.status === 'loading') {
        setError('Aguarde a verificação do CNPJ na Receita Federal.');
        return;
      }
      if (cnpjLookup.status === 'notfound') {
        setError('CNPJ não encontrado na base da Receita Federal. Confira os dígitos.');
        return;
      }
      if (cnpjLookup.status === 'network') {
        setError('Não foi possível verificar o CNPJ na Receita (sem internet ou serviço fora do ar). Tente novamente em instantes.');
        return;
      }
      if (cnpjLookup.status === 'inactive') {
        setError(`Este CNPJ consta como "${cnpjLookup.situacao}" na Receita Federal e não pode ser cadastrado.`);
        return;
      }
      if (cnpjLookup.status !== 'ok') {
        setError('CNPJ ainda não foi verificado na Receita. Tente novamente.');
        return;
      }
    } else if (isCliente) {
      const d = onlyDigits(form.cpf);
      const okDoc = d.length === 14 ? validarCNPJ(d) : validarCPF(d);
      if (!okDoc) {
        setError('CPF ou CNPJ inválido. Confira os dígitos.');
        return;
      }
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

      const { codigoCliente } = await register(form.email, password, profileData);
      const nome = form.nomeFantasia || form.nomeResponsavel;
      const slug = slugify(nome);
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

      const docLabel = isPessoaFisica ? 'CPF' : 'CNPJ';
      const documento = isPessoaFisica ? form.cpf : form.cnpj;
      const tipoLabel = isPessoaFisica ? 'PESSOA FÍSICA' : 'EMPRESA';
      const resumoWA =
        `📋 *NOVO CADASTRO* (${tipoLabel})\n\n` +
        `*Nome:* ${nome}\n` +
        `*${docLabel}:* ${documento}\n` +
        `*Telefone:* ${form.telefone}\n` +
        `*Código Cliente:* ${codigoCliente}`;

      // Guarda PDF em state para o usuario enviar clicando no botao (gesto direto = sem bloqueio de popup)
      setPdfReady({ blob: pdfBlob, fileName: fileNamePdf, resumo: resumoWA });

      // Backup por email: aguarda resposta e reporta status
      if (WEB3FORMS_KEY) {
        setEmailStatus('sending');
        setLoadingStep('Enviando email de backup...');
        try {
          const resumoEmail = isPessoaFisica
            ? `Novo cadastro - PESSOA FÍSICA\n\n` +
              `Nome: ${form.nomeResponsavel}\n` +
              `CPF: ${form.cpf}\n` +
              `Telefone: ${form.telefone}\n` +
              `Email: ${form.email}\n` +
              `Endereço: ${form.endereco}, ${form.numero} - ${form.bairro}\n` +
              `Cidade: ${form.municipio}/${form.estado} - CEP ${form.cep}\n` +
              `Código Cliente: ${codigoCliente}\n\n` +
              `PDF completo em anexo.`
            : `Novo cadastro - EMPRESA\n\n` +
              `Razão Social: ${form.razaoSocial}\n` +
              `Nome Fantasia: ${form.nomeFantasia}\n` +
              `CNPJ: ${form.cnpj}\n` +
              `Responsável: ${form.nomeResponsavel} (CPF ${form.cpf})\n` +
              `Telefone: ${form.telefone}\n` +
              `Email: ${form.email}\n` +
              `Endereço: ${form.endereco}, ${form.numero} - ${form.bairro}\n` +
              `Cidade: ${form.municipio}/${form.estado} - CEP ${form.cep}\n` +
              `Código Cliente: ${codigoCliente}\n\n` +
              `PDF completo com foto da fachada e assinatura em anexo.`;

          const fd = new FormData();
          fd.append('access_key', WEB3FORMS_KEY);
          fd.append('subject', `Novo cadastro ${isPessoaFisica ? 'PF' : 'PJ'} - ${nome} (código ${codigoCliente})`);
          fd.append('from_name', 'Site Frios Ouro Fino');
          fd.append('message', resumoEmail);
          fd.append('attachment', pdfBlob, fileNamePdf);

          const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success !== false) {
            setEmailStatus('sent');
            console.log('[Web3Forms] email enviado:', data);
          } else {
            setEmailStatus('failed');
            console.error('[Web3Forms] falha:', res.status, data);
          }
        } catch (err) {
          setEmailStatus('failed');
          console.error('[Web3Forms] erro de rede:', err);
        }
      } else {
        setEmailStatus('not_configured');
      }

      setSuccessCode(codigoCliente);
      setForm(INITIAL);
      setPassword('');
      setConfirmPassword('');
      removeFachada();
      clearSignature();
      setPendingWhatsApp(true);
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
    setPendingWhatsApp(false);
    setPdfReady(null);
    setEmailStatus('idle');
    setWhatsAppSent(false);
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
            {pendingWhatsApp && pdfReady && (
              <div className="cf-success-wa">
                <strong>⚠️ Falta 1 passo: enviar sua ficha pro WhatsApp da loja</strong>
                <p>
                  {whatsAppSent
                    ? 'Ficha enviada ✓ Se precisar reenviar, toque no botão abaixo.'
                    : 'Toque no botão abaixo pra abrir o WhatsApp com sua ficha anexada automaticamente.'}
                </p>
                <button
                  type="button"
                  className="cf-wa-button"
                  onClick={sendPdfToWhatsApp}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
                  {whatsAppSent ? 'Reenviar pelo WhatsApp' : 'Enviar ficha pelo WhatsApp'}
                </button>
                <button
                  type="button"
                  className="cf-wa-fallback"
                  onClick={downloadPdfOnly}
                >
                  Só baixar o PDF
                </button>
                <div className="cf-email-status">
                  {emailStatus === 'sending' && <span>📧 Enviando backup por email…</span>}
                  {emailStatus === 'sent' && <span className="cf-email-ok">✓ Email de backup enviado para o admin</span>}
                  {emailStatus === 'failed' && <span className="cf-email-fail">⚠️ Email de backup falhou — WhatsApp é obrigatório</span>}
                </div>
              </div>
            )}
            <button type="button" className="cf-submit cf-submit--ghost" onClick={closeAndReset}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cf-overlay">
      <div className="cf-modal">
        <div className="cf-header">
          <h2>{isCliente ? 'Já sou cliente antigo - primeira vez no site' : 'Quero me cadastrar'}</h2>
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
                  <label>CNPJ/CPF *
                    <input
                      required
                      value={form.cpf}
                      onChange={maskCpfCnpj}
                      placeholder="000.000.000-00"
                      maxLength={18}
                      inputMode="numeric"
                      className={cpfValid === false ? 'cf-input-invalid' : cpfValid === true ? 'cf-input-valid' : ''}
                    />
                    {cpfValid === false && <span className="cf-field-hint cf-field-hint--error">Documento inválido</span>}
                    {cpfValid === true && <span className="cf-field-hint cf-field-hint--ok">✓ Documento válido</span>}
                  </label>
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
                    <label>CNPJ *
                      <input
                        required
                        value={form.cnpj}
                        onChange={maskCnpj}
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                        inputMode="numeric"
                        className={cnpjValid === false ? 'cf-input-invalid' : cnpjValid === true ? 'cf-input-valid' : ''}
                      />
                      {cnpjValid === false && <span className="cf-field-hint cf-field-hint--error">CNPJ inválido</span>}
                      {cnpjLookup.status === 'loading' && <span className="cf-field-hint">Consultando Receita Federal…</span>}
                      {cnpjLookup.status === 'ok' && <span className="cf-field-hint cf-field-hint--ok">✓ {cnpjLookup.situacao} — dados preenchidos</span>}
                      {cnpjLookup.status === 'inactive' && <span className="cf-field-hint cf-field-hint--error">⚠️ {cnpjLookup.situacao} na Receita — não pode cadastrar</span>}
                      {cnpjLookup.status === 'notfound' && <span className="cf-field-hint cf-field-hint--error">CNPJ não existe na base da Receita</span>}
                      {cnpjLookup.status === 'network' && <span className="cf-field-hint cf-field-hint--error">⚠️ Falha ao consultar Receita — tente de novo em instantes</span>}
                    </label>
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
                  <label className="cf-small">CPF *
                    <input
                      required
                      value={form.cpf}
                      onChange={maskCpf}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      inputMode="numeric"
                      className={cpfValid === false ? 'cf-input-invalid' : cpfValid === true ? 'cf-input-valid' : ''}
                    />
                    {cpfValid === false && <span className="cf-field-hint cf-field-hint--error">CPF inválido</span>}
                    {cpfValid === true && <span className="cf-field-hint cf-field-hint--ok">✓ CPF válido</span>}
                  </label>
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
