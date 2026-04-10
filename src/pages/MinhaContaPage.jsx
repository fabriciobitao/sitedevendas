import { useAuth } from '../context/AuthContext';
import './MinhaContaPage.css';

export default function MinhaContaPage() {
  const { customerProfile, user, logout } = useAuth();

  if (!customerProfile) {
    return (
      <div className="conta-page">
        <div className="conta-loading">Carregando perfil...</div>
      </div>
    );
  }

  const p = customerProfile;
  const isEmpresa = p.tipo === 'empresa';

  return (
    <div className="conta-page">
      <div className="conta-header">
        <h1>Minha Conta</h1>
        <p>{user?.email}</p>
      </div>

      <div className="conta-sections">
        {isEmpresa && (
          <div className="conta-section">
            <h3>Dados da Empresa</h3>
            <div className="conta-grid">
              <div className="conta-field">
                <span>Razão Social</span>
                <strong>{p.razaoSocial}</strong>
              </div>
              <div className="conta-field">
                <span>Nome Fantasia</span>
                <strong>{p.nomeFantasia}</strong>
              </div>
              <div className="conta-field">
                <span>CNPJ</span>
                <strong>{p.cnpj}</strong>
              </div>
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
            <div className="conta-field">
              <span>Nome</span>
              <strong>{p.nomeResponsavel}</strong>
            </div>
            <div className="conta-field">
              <span>CPF</span>
              <strong>{p.cpf}</strong>
            </div>
            {p.rg && (
              <div className="conta-field">
                <span>RG</span>
                <strong>{p.rg}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="conta-section">
          <h3>Endereço</h3>
          <div className="conta-grid">
            <div className="conta-field conta-field--full">
              <span>Endereço</span>
              <strong>{p.endereco}, Nº {p.numero}{p.complemento ? ` - ${p.complemento}` : ''}</strong>
            </div>
            <div className="conta-field">
              <span>Bairro</span>
              <strong>{p.bairro}</strong>
            </div>
            <div className="conta-field">
              <span>Cidade/Estado</span>
              <strong>{p.municipio} - {p.estado}</strong>
            </div>
            <div className="conta-field">
              <span>CEP</span>
              <strong>{p.cep}</strong>
            </div>
          </div>
        </div>

        <div className="conta-section">
          <h3>Contato</h3>
          <div className="conta-grid">
            <div className="conta-field">
              <span>Telefone</span>
              <strong>{p.telefone}</strong>
            </div>
            <div className="conta-field">
              <span>Email</span>
              <strong>{p.email}</strong>
            </div>
          </div>
        </div>

        <button className="conta-logout" onClick={logout}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
