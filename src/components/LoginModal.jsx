import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Email ou senha incorretos');
      } else if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este email');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError('Digite seu email para recuperar a senha');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch {
      setError('Erro ao enviar email de recuperação');
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>Entrar</h2>
          <button className="login-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <form className="login-body" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}
          {resetSent && <p className="login-success">Email de recuperação enviado! Verifique sua caixa de entrada.</p>}

          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
          </label>

          <label>
            Senha
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" minLength={6} />
          </label>

          <button type="button" className="login-forgot" onClick={handleReset}>
            Esqueceu a senha?
          </button>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="login-switch">
            Ainda não tem conta?{' '}
            <button type="button" onClick={onSwitchToRegister}>Cadastre-se</button>
          </p>
        </form>
      </div>
    </div>
  );
}
