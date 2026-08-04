import { Link } from 'react-router-dom';
import { Package, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80';

  return (
    <Link to={`/product/${product._id}`} className="group card overflow-hidden transition hover:shadow-elevated">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="absolute left-3 top-3 badge bg-amber-100 text-amber-700">
            <Star className="mr-1 h-3 w-3" /> Featured
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute right-3 top-3 badge bg-red-100 text-red-700">Out of Stock</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-600">{product.category}</p>
        <h3 className="mt-1 font-display text-base font-semibold text-slate-900 line-clamp-2 group-hover:text-brand-700">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-sm text-slate-500">/{product.unit}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Package className="h-3.5 w-3.5" />
            MOQ {product.moq}
          </span>
        </div>
        {product.colors?.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                className="h-4 w-4 rounded-full border border-slate-200"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
