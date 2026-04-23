// Detecta navegador e retorna mensagem com passos para desbloquear o microfone.
// Chamado quando getUserMedia joga NotAllowedError/SecurityError — o JS nao
// consegue "forcar autorizacao", so pode instruir o usuario onde clicar.

function detectBrowser() {
  if (typeof navigator === 'undefined') return 'generic';
  const ua = navigator.userAgent || '';
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  if (/Edg\//.test(ua)) return isMac ? 'edge-mac' : 'edge';
  if (/Chrome\//.test(ua) && !/Chromium|Edg\//.test(ua)) return isMac ? 'chrome-mac' : 'chrome';
  if (/Safari\//.test(ua) && !/Chrome|Chromium/.test(ua)) return 'safari';
  if (/Firefox\//.test(ua)) return isMac ? 'firefox-mac' : 'firefox';
  return isMac ? 'generic-mac' : 'generic';
}

export function buildMicBlockedHelp() {
  const b = detectBrowser();
  const common = 'Microfone bloqueado para este site.';
  if (b === 'safari') {
    return `${common} Safari → Ajustes → Sites → Microfone → friosof.web.app: Permitir. Depois recarregue a página.`;
  }
  if (b === 'chrome-mac' || b === 'chrome') {
    return `${common} Clique no cadeado 🔒 ao lado do endereço → Configurações do site → Microfone: Permitir. Depois recarregue.`;
  }
  if (b === 'edge-mac' || b === 'edge') {
    return `${common} Clique no cadeado 🔒 ao lado do endereço → Permissões → Microfone: Permitir. Depois recarregue.`;
  }
  if (b === 'firefox-mac' || b === 'firefox') {
    return `${common} Clique no cadeado 🔒 ao lado do endereço → Permissão do microfone: remover bloqueio. Depois recarregue.`;
  }
  if (b === 'generic-mac') {
    return `${common} Também verifique: Ajustes do Sistema → Privacidade e Segurança → Microfone: o navegador precisa estar ativado.`;
  }
  return `${common} Libere o microfone nas configurações do navegador e recarregue a página.`;
}
