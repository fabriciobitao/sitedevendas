import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

// Aceita codigo de cliente (ate 6 digitos) OU telefone (com mascara)
// Se o usuario digitar poucos digitos (<=6), tratamos como codigo
// Se digitar mais, aplicamos mascara de telefone
function maskIdentifier(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 6) return digits;
  // Telefone: (XX) XXXXX-XXXX
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
      c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : `(${a}`
    );
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, (_, a, b, c) =>
    c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`
  );
}

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const { login, findEmailByIdentifier, resetPassword } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    if (open) {
      setCodigo('');
      setPassword('');
      setShowPassword(false);
      setError('');
      setSuccess('');
      setForgotMode(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) return null;

  const handleCodigoChange = (e) => {
    setCodigo(maskIdentifier(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await login(codigo, password);
      onClose();
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Código/telefone ou senha incorretos');
      } else if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este código/telefone');
      } else if (err.message?.includes('Muitas tentativas')) {
        setError(err.message);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!codigo) {
      setError('Digite seu código de cliente ou telefone');
      return;
    }
    setLoading(true);
    try {
      const email = await findEmailByIdentifier(codigo);
      await resetPassword(email);
      const maskedEmail = email.replace(/(.{2})(.*)(@)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
      setSuccess(`Link enviado para ${maskedEmail}. Verifique sua caixa de entrada.`);
      setTimeout(() => {
        setForgotMode(false);
        setSuccess('');
      }, 3000);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este código/telefone');
      } else {
        setError('Erro ao enviar recuperação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>{forgotMode ? 'Recuperar senha' : 'Entrar'}</h2>
          <button className="login-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {forgotMode ? (
          <form className="login-body" autoComplete="off" onSubmit={handleForgotPassword}>
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            <p className="login-forgot-desc">
              Digite seu código de cliente ou telefone. Enviaremos um link para redefinir sua senha no email associado à sua conta.
            </p>

            <label>
              Código de Cliente ou Telefone
              <input type="text" required value={codigo} onChange={handleCodigoChange} placeholder="0001 ou (35) 99999-9999" inputMode="tel" maxLength={16} autoComplete="off" enterKeyHint="send" />
            </label>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>

            <button type="button" className="login-back" onClick={() => { setForgotMode(false); setError(''); setSuccess(''); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Voltar ao login
            </button>
          </form>
        ) : (
          <form className="login-body" autoComplete="off" onSubmit={handleSubmit}>
            {error && <p className="login-error">{error}</p>}

            <label>
              Código de Cliente ou Telefone
              <input type="text" required value={codigo} onChange={handleCodigoChange} placeholder="0001 ou (35) 99999-9999" inputMode="tel" maxLength={16} autoComplete="off" enterKeyHint="next" />
            </label>

            <label>
              Senha
              <div className="login-password-wrap">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" minLength={6} autoComplete="new-password" enterKeyHint="go" />
                <button type="button" className="login-eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <button type="button" className="login-forgot" onClick={() => { setForgotMode(true); setError(''); setSuccess(''); }}>
              Esqueci minha senha
            </button>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="login-switch">
              Ainda não tem conta?{' '}
              <button type="button" onClick={onSwitchToRegister}>Cadastre-se</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
