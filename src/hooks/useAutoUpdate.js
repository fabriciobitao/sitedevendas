import { useEffect } from 'react';

const VERSION_URL = '/version.json';
const POLL_INTERVAL_MS = 60_000; // 1 min

// Deteccao de "conversa ativa" — nao recarrega no meio de uma acao do usuario
function isUserBusy() {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return true;
  // Modais abertos (login, cadastro, carrinho, etc.)
  if (document.querySelector('.cf-overlay, .login-overlay, .cart-open, .pdm-overlay')) return true;
  return false;
}

async function fetchVersion() {
  try {
    const res = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.version || null;
  } catch {
    return null;
  }
}

export function useAutoUpdate() {
  useEffect(() => {
    // Versao atual embutida no bundle (definida pelo vite.config em build)
    const currentVersion = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : null;
    if (!currentVersion) return; // dev mode — skip

    let timer;
    let reloading = false;

    const check = async () => {
      if (reloading) return;
      const latest = await fetchVersion();
      if (!latest || latest === currentVersion) return;
      // Nova versao disponivel — espera usuario ficar ocioso para recarregar
      if (isUserBusy()) {
        // Tenta de novo em 30s
        timer = setTimeout(check, 30_000);
        return;
      }
      reloading = true;
      // location.reload busca novo HTML; bundles mudam de hash automaticamente
      window.location.reload();
    };

    // Checa ao voltar de background (celular desbloqueado, aba reativada)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', check);
    window.addEventListener('online', check);

    // Polling periodico
    const interval = setInterval(check, POLL_INTERVAL_MS);

    // Primeira checagem 5s apos carregar
    const initial = setTimeout(check, 5_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', check);
      window.removeEventListener('online', check);
      clearInterval(interval);
      clearTimeout(initial);
      if (timer) clearTimeout(timer);
    };
  }, []);
}
