import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { maskCPF, maskCNPJ, maskTelefone } from '../utils/mask';
import './MinhaContaPage.css';

function SensitiveField({ label, value, mask }) {
  const [show, setShow] = useState(false);
  if (!value) return null;
  return (
    <div className="conta-field">
      <span>{label}</span>
      <strong className="conta-sensitive">
        {show ? value : mask(value)}
        <button
          type="button"
          className="conta-reveal-btn"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Ocultar' : 'Mostrar'}
        >
          {show ? 'ocultar' : 'mostrar'}
        </button>
      </strong>
    </div>
  );
}

export default function MinhaContaPage() {
  const { customerProfile, user, logout, resetPassword } = useAuth();
  const [resetMsg, setResetMsg] = useState('');
  const [resetErr, setResetErr] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  if (!customerProfile) {
    return (
      <div className="conta-page">
        <div className="conta-loading">Carregando perfil...</div>
      </div>
    );
  }

  const p = customerProfile;
  const isEmpresa = p.tipo === 'empresa';

  const handleResetPassword = async () => {
    setResetMsg('');
    setResetErr('');
    const email = p.email || user?.email;
    if (!email) {
      setResetErr('Email não encontrado no seu cadastro.');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email);
      const masked = email.replace(/(.{2})(.*)(@)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
      setResetMsg(`Enviamos um link para ${masked}. Verifique sua caixa de entrada para alterar sua senha.`);
    } catch {
      setResetErr('Não conseguimos enviar o email agora. Tente novamente em instantes.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="conta-page">
      <div className="conta-header">
        <h1>Minha Conta</h1>
        <p>{user?.email}</p>
      </div>

      <div className="conta-sections">
        {p.codigoCliente && (
          <div className="conta-section conta-section--codigo">
            <h3>Código de Cliente</h3>
            <div className="conta-codigo-box">
              <span className="conta-codigo-value">{p.codigoCliente}</span>
              <span className="conta-codigo-hint">Use este código + sua senha para entrar na sua conta.</span>
            </div>
          </div>
        )}

        {isEmpresa && (
          <div className="conta-section">
            <h3>Dados da Empresa</h3>
            <div className="conta-grid">
              {p.razaoSocial && (
                <div className="conta-field">
                  <span>Razão Social</span>
                  <strong>{p.razaoSocial}</strong>
                </div>
              )}
              {p.nomeFantasia && (
                <div className="conta-field">
                  <span>Nome Fantasia</span>
                  <strong>{p.nomeFantasia}</strong>
                </div>
              )}
              <SensitiveField label="CNPJ" value={p.cnpj} mask={maskCNPJ} />
              {p.inscMunicipal && (
                <div className="conta-field">
                  <span>Insc. Municipal</span>
                  <strong>{p.inscMunicipal}</strong>
                </div>
              )}
              {p.inscEstadual && (
                <div className="conta-field">
                  <span>Insc. Estadual</span>
                  <strong>{p.inscEstadual}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="conta-section">
          <h3>{isEmpresa ? 'Responsável' : 'Dados Pessoais'}</h3>
          <div className="conta-grid">
            {(p.nomeResponsavel || p.nome) && (
              <div className="conta-field">
                <span>Nome</span>
                <strong>{p.nomeResponsavel || p.nome}</strong>
              </div>
            )}
            <SensitiveField label="CPF" value={p.cpf} mask={maskCPF} />
            {!p.cpf && p.cnpj && !isEmpresa && (
              <SensitiveField label="CNPJ" value={p.cnpj} mask={maskCNPJ} />
            )}
          </div>
        </div>

        {(p.endereco || p.bairro || p.municipio || p.cep) && (
          <div className="conta-section">
            <h3>Endereço</h3>
            <div className="conta-grid">
              {p.endereco && (
                <div className="conta-field conta-field--full">
                  <span>Endereço</span>
                  <strong>{p.endereco}{p.numero ? `, Nº ${p.numero}` : ''}{p.complemento ? ` - ${p.complemento}` : ''}</strong>
                </div>
              )}
              {p.bairro && (
                <div className="conta-field">
                  <span>Bairro</span>
                  <strong>{p.bairro}</strong>
                </div>
              )}
              {(p.municipio || p.estado) && (
                <div className="conta-field">
                  <span>Cidade/Estado</span>
                  <strong>{p.municipio}{p.estado ? ` - ${p.estado}` : ''}</strong>
                </div>
              )}
              {p.cep && (
                <div className="conta-field">
                  <span>CEP</span>
                  <strong>{p.cep}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="conta-section">
          <h3>Contato</h3>
          <div className="conta-grid">
            <SensitiveField label="Telefone" value={p.telefone} mask={maskTelefone} />
            {(p.email || user?.email) && (
              <div className="conta-field">
                <span>Email</span>
                <strong>{p.email || user?.email}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="conta-section">
          <h3>Segurança</h3>
          <div className="conta-security">
            <p className="conta-security-desc">
              Para trocar sua senha, enviaremos um link de redefinição para o email do seu cadastro.
            </p>
            {resetMsg && <p className="conta-security-msg">{resetMsg}</p>}
            {resetErr && <p className="conta-security-err">{resetErr}</p>}
            <button
              type="button"
              className="conta-security-btn"
              onClick={handleResetPassword}
              disabled={resetLoading}
            >
              {resetLoading ? 'Enviando...' : 'Alterar senha por email'}
            </button>
          </div>
        </div>

        <button className="conta-logout" onClick={logout}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
