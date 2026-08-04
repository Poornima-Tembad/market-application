import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft, Minus, Plus, Check, Loader2 } from 'lucide-react';
import { productAPI } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productAPI.get(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-slate-900">Product not found</p>
        <Link to="/marketplace" className="btn-primary mt-4">Back to Marketplace</Link>
      </div>
    );
  }

  const { product, similar } = data;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80';

  const handleAddToCart = async () => {
    if (!user) return;
    if (user.role !== 'buyer') return;
    setAdding(true);
    try {
      await addToCart(product._id, Math.max(quantity, product.moq), selectedColor || undefined);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          <img src={image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-brand-600">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-slate-500">per {product.unit}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5">
              <Package className="h-4 w-4 text-slate-500" />
              {product.stock > 0 ? `${product.stock.toLocaleString()} in stock` : 'Out of stock'}
            </span>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5">MOQ: {product.moq} {product.unit}s</span>
          </div>

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700">Available Colors</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      selectedColor === c.name ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full border border-slate-200" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">Quantity ({product.unit}s)</p>
            <div className="mt-2 flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(product.moq, quantity - 50))} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50">
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))}
                className="input-field w-24 text-center"
                min={product.moq}
              />
              <button onClick={() => setQuantity(quantity + 50)} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {!user ? (
              <Link to="/login" className="btn-primary flex-1">Sign in to Order</Link>
            ) : user.role === 'buyer' ? (
              <button onClick={handleAddToCart} disabled={adding || product.stock <= 0} className="btn-primary flex-1">
                {added ? <><Check className="h-5 w-5" /> Added!</> : adding ? 'Adding...' : <><ShoppingCart className="h-5 w-5" /> Add to Cart</>}
              </button>
            ) : (
              <p className="text-sm text-slate-500">Switch to a buyer account to purchase</p>
            )}
          </div>

          {product.specifications && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-semibold text-slate-900">Specifications</h3>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, val]) => val && (
                  <div key={key} className="rounded-xl bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase text-slate-500">{key}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-slate-900">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.supplier && (
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Supplier</p>
              <p className="mt-1 font-display text-lg font-semibold text-slate-900">
                {product.supplier.supplierProfile?.businessName || product.supplier.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {similar?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-slate-900">Similar Fabrics</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
