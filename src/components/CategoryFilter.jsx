import { categories } from '../data/products';
import './CategoryFilter.css';

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-chip ${selected === cat.id ? 'active' : ''}`}
          style={{ '--chip-color': cat.color }}
          onClick={() => onSelect(selected === cat.id ? 'all' : cat.id)}
        >
          <span className="chip-icon">{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
