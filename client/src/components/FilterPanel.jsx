import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['all', 'Cotton', 'Silk', 'Linen', 'Wool', 'Denim', 'Synthetic', 'Cellulosic'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function FilterPanel({ filters, onChange, onSearch, categories = CATEGORIES }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
            placeholder="Search fabrics..."
            className="input-field pl-10"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => update('category', cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filters.category === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Price Range ($/meter)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => update('minPrice', e.target.value)}
            className="input-field"
          />
          <span className="text-slate-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => update('maxPrice', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Sort By</label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => update('sort', e.target.value)}
          className="input-field"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={filters.inStock === 'true'}
          onChange={(e) => update('inStock', e.target.checked ? 'true' : '')}
          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        In stock only
      </label>

      {(filters.search || filters.category !== 'all' || filters.minPrice || filters.maxPrice) && (
        <button
          onClick={() => onChange({ category: 'all', sort: 'newest', search: '', minPrice: '', maxPrice: '', inStock: '' })}
          className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
        >
          <X className="h-4 w-4" /> Clear filters
        </button>
      )}
    </div>
  );
}

export function MobileFilterBar({ filters, onChange, showFilters, setShowFilters }) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex-1">
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>
    </div>
  );
}
