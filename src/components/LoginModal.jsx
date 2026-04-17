import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const { login, findEmailByPhone, resetPassword } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  if (!open) return null;

  const handlePhoneChange = (e) => {
    setPhone(maskPhone(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await login(phone, password);
      onClose();
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Telefone ou senha incorretos');
      } else if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este telefone');
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
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Digite seu telefone cadastrado');
      return;
    }
    setLoading(true);
    try {
      const email = await findEmailByPhone(phone);
      await resetPassword(email);
      const maskedEmail = email.replace(/(.{2})(.*)(@)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
      setSuccess(`Link enviado para ${maskedEmail}. Verifique sua caixa de entrada.`);
      setTimeout(() => {
        setForgotMode(false);
        setSuccess('');
      }, 3000);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este telefone');
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
          <form className="login-body" onSubmit={handleForgotPassword}>
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            <p className="login-forgot-desc">
              Digite seu telefone cadastrado. Enviaremos um link para redefinir sua senha no email associado à sua conta.
            </p>

            <label>
              Telefone cadastrado
              <input type="tel" required value={phone} onChange={handlePhoneChange} placeholder="(00) 00000-0000" inputMode="numeric" maxLength={15} autoComplete="tel" enterKeyHint="send" />
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
          <form className="login-body" onSubmit={handleSubmit}>
            {error && <p className="login-error">{error}</p>}

            <label>
              Telefone
              <input type="tel" required value={phone} onChange={handlePhoneChange} placeholder="(00) 00000-0000" inputMode="numeric" maxLength={15} autoComplete="tel" enterKeyHint="next" />
            </label>

            <label>
              Senha
              <div className="login-password-wrap">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" minLength={6} autoComplete="current-password" enterKeyHint="go" />
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
