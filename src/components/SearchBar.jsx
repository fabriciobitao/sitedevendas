import { useRef, useEffect } from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const focusedRef = useRef(false);
  const startScrollYRef = useRef(0);

  const handleFocus = () => {
    focusedRef.current = true;
    startScrollYRef.current = window.scrollY;
    setTimeout(() => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      startScrollYRef.current = offset;
    }, 120);
  };

  const handleBlur = () => {
    focusedRef.current = false;
  };

  useEffect(() => {
    const onScroll = () => {
      if (!focusedRef.current) return;
      if (Math.abs(window.scrollY - startScrollYRef.current) < 40) return;
      inputRef.current && inputRef.current.blur();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
