import { useRef, useEffect } from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const focusedRef = useRef(false);
  const startScrollYRef = useRef(0);

  const handleFocus = () => {
    focusedRef.current = true;
    setTimeout(() => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 120);
  };

  const handleBlur = () => {
    focusedRef.current = false;
  };

  useEffect(() => {
    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (!focusedRef.current) return;
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dy < 24) return;
      const target = e.target;
      if (target && (target === inputRef.current || (target.closest && target.closest('.search-bar')))) return;
      inputRef.current && inputRef.current.blur();
    };
    const onWheel = () => {
      if (!focusedRef.current) return;
      inputRef.current && inputRef.current.blur();
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current && inputRef.current.blur();
    }
  };

  return (
    <div className="search-bar" ref={wrapRef}>
      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        ref={inputRef}
        type="search"
        placeholder="Buscar produtos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="search-input"
        enterKeyHint="search"
        autoCapitalize="off"
        autoCorrect="off"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Limpar busca">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
}
