import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { productAPI } from '../api/client';
import ProductCard from '../components/ProductCard';
import FilterPanel, { MobileFilterBar } from '../components/FilterPanel';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: 'all', sort: 'newest', search: '', minPrice: '', maxPrice: '', inStock: '' });

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort: filters.sort };
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = filters.inStock;

      const data = await productAPI.list(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Fabric Marketplace</h1>
        <p className="mt-2 text-slate-600">Browse {pagination.total || '...'} premium fabrics from global suppliers</p>
      </div>

      <MobileFilterBar filters={filters} onChange={setFilters} showFilters={showFilters} setShowFilters={setShowFilters} />

      <div className="mt-6 flex gap-8">
        <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card sticky top-24 p-5">
            <FilterPanel filters={filters} onChange={setFilters} onSearch={() => fetchProducts()} />
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="card py-20 text-center">
              <Search className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No fabrics found</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchProducts(page)}
                      className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
                        pagination.page === page
                          ? 'bg-brand-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
