import { Component } from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { fallbackTitle, fallbackMessage } = this.props;

    return (
      <div className="errboundary">
        <div className="errboundary-card">
          <div className="errboundary-icon">⚠️</div>
          <h2 className="errboundary-title">{fallbackTitle || 'Algo deu errado'}</h2>
          <p className="errboundary-msg">
            {fallbackMessage || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
          </p>
          <div className="errboundary-actions">
            <button type="button" className="errboundary-btn" onClick={this.handleReset}>
              Tentar novamente
            </button>
            <button type="button" className="errboundary-btn errboundary-btn--ghost" onClick={this.handleHome}>
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }
}
