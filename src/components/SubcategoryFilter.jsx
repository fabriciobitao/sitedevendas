import { subcategories } from '../data/products';
import './SubcategoryFilter.css';

export default function SubcategoryFilter({ category, selected, onSelect }) {
  if (category === 'all') return null;

  const categoryName = category === 'resfriados' ? 'Resfriados'
    : category === 'congelados' ? 'Congelados'
    : 'Secos';

  const subs = subcategories[categoryName] || [];
  if (subs.length === 0) return null;

  return (
    <div className="subcategory-filter">
      <button
        className={`sub-chip ${selected === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        Todos
      </button>
      {subs.map(sub => (
        <button
          key={sub}
          className={`sub-chip ${selected === sub ? 'active' : ''}`}
          onClick={() => onSelect(sub)}
        >
          {sub}
        </button>
      ))}
    </div>
  );
}
