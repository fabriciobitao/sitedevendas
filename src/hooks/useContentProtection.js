import { useEffect } from 'react';

/**
 * Client-side content protection layer.
 * Not bulletproof (nothing client-side is), but raises the bar
 * significantly against casual copying, scraping, and image theft.
 */
export default function useContentProtection() {
  useEffect(() => {
    // --- 1. Disable right-click context menu ---
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // --- 2. Block copy/cut/paste of content ---
    const handleCopy = (e) => {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
      return false;
    };

    // --- 3. Block keyboard shortcuts for view-source, dev tools, save, print ---
    const handleKeyDown = (e) => {
      // Ctrl+U / Cmd+U = View source
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S / Cmd+S = Save page
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Ctrl+P / Cmd+P = Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I / Cmd+Opt+I = DevTools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J / Cmd+Opt+J = Console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C / Cmd+Opt+C = Element inspector
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // F12 = DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+A / Cmd+A = Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }
    };

    // --- 4. Block image dragging (prevents drag-to-desktop save) ---
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // --- 5. Console warning to deter inspection ---
    const consoleWarning = () => {
      const style = 'color: red; font-size: 24px; font-weight: bold;';
      const styleSmall = 'color: #333; font-size: 14px;';
      console.log('%cATENCAO!', style);
      console.log(
        '%cEste site e protegido. Tentativas de copia, scraping ou engenharia reversa ' +
        'sao monitoradas e podem resultar em acoes legais.',
        styleSmall
      );
    };
    consoleWarning();

    // --- Register all listeners ---
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // --- 6. CSS-level protections via injected style ---
    const styleEl = document.createElement('style');
    styleEl.id = 'content-protection-styles';
    styleEl.textContent = `
      /* Disable text selection globally */
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }

      /* Re-enable selection ONLY in form inputs and textareas */
      input, textarea, select, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      /* Prevent image saving via long-press on mobile */
      img {
        -webkit-touch-callout: none !important;
        pointer-events: none !important;
      }

      /* Allow pointer events on interactive images (links wrapping images) */
      a img, button img {
        pointer-events: auto !important;
      }

      /* Disable print styles - blank page when printing */
      @media print {
        body {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // --- Cleanup ---
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      const el = document.getElementById('content-protection-styles');
      if (el) el.remove();
    };
  }, []);
}
