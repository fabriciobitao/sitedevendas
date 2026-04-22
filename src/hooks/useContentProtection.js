import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function useContentProtection() {
  const { user } = useAuth();
  const ADMIN_EMAILS = ['fabricio.fazer@gmail.com', 'fabiomenezes@gmail.com'];
  const isAdminUser = ADMIN_EMAILS.includes(user?.email);

  useEffect(() => {
    // Liberar tudo para o admin logado
    const isAdmin = () => isAdminUser;

    // --- 1. Disable right-click context menu ---
    const handleContextMenu = (e) => {
      if (isAdmin()) return;
      e.preventDefault();
      return false;
    };

    // --- 2. Block copy/cut ---
    const handleCopy = (e) => {
      if (isAdmin()) return;
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
      return false;
    };

    // --- 3. Block keyboard shortcuts ---
    const handleKeyDown = (e) => {
      if (isAdmin()) return;
      const ctrl = e.ctrlKey || e.metaKey;
      // View source, Save, Print, Select All
      if (ctrl && ['u', 's', 'p', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
      // DevTools: Ctrl+Shift+I/J/C
      if (ctrl && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+E (Network tab), Ctrl+Shift+M (mobile view)
      if (ctrl && e.shiftKey && ['E', 'M', 'e', 'm'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    // --- 4. Block image dragging ---
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // --- 5. Block selecting text via mouse ---
    const handleSelectStart = (e) => {
      if (isAdmin()) return;
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        return false;
      }
    };

    // DevTools detection removed — causava falsos positivos em mobile

    // --- 7. Block "Save As" dialog ---
    const handleBeforePrint = (e) => {
      e.preventDefault();
    };

    // --- 8. Disable page visibility changes for screenshot tools ---
    const handleVisibilityChange = () => {
      // noop - just registering to prevent some automation tools
    };

    // --- 9. Console warning ---
    const style = 'color: red; font-size: 24px; font-weight: bold;';
    const styleSmall = 'color: #333; font-size: 14px;';
    console.log('%c⛔ ACESSO PROIBIDO', style);
    console.log(
      '%cEste site é protegido por lei. Tentativas de cópia, scraping ou engenharia reversa ' +
      'são monitoradas e podem resultar em ações legais conforme LGPD (Lei 13.709/2018).',
      styleSmall
    );

    // --- Register listeners ---
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('beforeprint', handleBeforePrint);

    // --- 10. CSS protections (apenas para nao-admin) ---
    const styleEl = document.createElement('style');
    styleEl.id = 'content-protection-styles';
    if (!isAdminUser) {
      styleEl.textContent = `
        body {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }

        input, textarea, select, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        img {
          -webkit-touch-callout: none !important;
          -webkit-user-drag: none !important;
          user-drag: none !important;
        }

        @media print {
          html, body {
            display: none !important;
            visibility: hidden !important;
          }
        }

        ::selection {
          background: transparent !important;
          color: inherit !important;
        }

        ::-moz-selection {
          background: transparent !important;
          color: inherit !important;
        }
      `;
    }
    document.head.appendChild(styleEl);

    // --- Cleanup ---
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('beforeprint', handleBeforePrint);
      const el = document.getElementById('content-protection-styles');
      if (el) el.remove();
    };
  }, [isAdminUser]);
}
