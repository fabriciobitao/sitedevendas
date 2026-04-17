import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="search"
        placeholder="Buscar produtos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
