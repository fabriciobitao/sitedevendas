import { useEffect } from 'react';

const VERSION_URL = '/version.json';
const POLL_INTERVAL_MS = 5 * 60_000; // 5 min (conservador — evita loops)
const MIN_AGE_BEFORE_RELOAD_MS = 60_000; // nunca recarrega no 1o minuto
const IDLE_BEFORE_RELOAD_MS = 30_000; // 30s sem interacao
const INITIAL_CHECK_DELAY_MS = 30_000; // 30s apos carregar

let lastInteraction = Date.now();
const bumpInteraction = () => { lastInteraction = Date.now(); };

// Deteccao de "usuario ocupado" — NUNCA recarrega se modal/input ativo
function isUserBusy() {
  try {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable)) return true;
    if (document.querySelector('.cf-overlay, .login-overlay, .cart-open, .pdm-overlay, .cart, [class*="modal"][class*="open"]')) return true;
  } catch {}
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
    // Versao do bundle atual (definida em vite.config)
    const currentVersion = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : null;
    if (!currentVersion) return; // dev mode

    const pageLoadedAt = Date.now();
    let reloading = false;
    let retryTimer;

    const check = async () => {
      if (reloading) return;
      // Guardrail 1: nunca recarregar nos primeiros 60s apos carregar
      if (Date.now() - pageLoadedAt < MIN_AGE_BEFORE_RELOAD_MS) return;
      // Guardrail 2: precisa de 30s de ociosidade
      if (Date.now() - lastInteraction < IDLE_BEFORE_RELOAD_MS) return;
      // Guardrail 3: nao recarregar com input/modal ativo
      if (isUserBusy()) return;

      const latest = await fetchVersion();
      if (!latest || latest === currentVersion) return;

      // Checa de novo ainda-e-atual logo antes de recarregar
      if (isUserBusy() || Date.now() - lastInteraction < IDLE_BEFORE_RELOAD_MS) {
        retryTimer = setTimeout(check, IDLE_BEFORE_RELOAD_MS);
        return;
      }

      reloading = true;
      window.location.reload();
    };

    // Rastreia interacao para garantir ociosidade antes de recarregar
    const events = ['click', 'touchstart', 'touchmove', 'keydown', 'mousedown', 'input', 'scroll'];
    events.forEach((e) => window.addEventListener(e, bumpInteraction, { passive: true, capture: true }));

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        bumpInteraction();
        // so checa depois de confirmar ociosidade
        setTimeout(check, IDLE_BEFORE_RELOAD_MS + 1000);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    const interval = setInterval(check, POLL_INTERVAL_MS);
    const initial = setTimeout(check, INITIAL_CHECK_DELAY_MS);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bumpInteraction, true));
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
      clearTimeout(initial);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);
}
