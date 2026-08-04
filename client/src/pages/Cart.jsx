import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, subtotal, updateQuantity, removeItem, loading } = useCart();

  if (loading) {
    return <div className="flex items-center justify-center py-32"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>;
  }

  if (!cart.items?.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-600">Browse our marketplace to find premium fabrics</p>
        <Link to="/marketplace" className="btn-primary mt-6">Browse Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-slate-900">Shopping Cart</h1>
      <p className="mt-2 text-slate-600">{cart.items.length} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card flex gap-4 p-4">
              <img
                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&q=80'}
                alt=""
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link to={`/product/${item.product?._id}`} className="font-semibold text-slate-900 hover:text-brand-600">
                      {item.product?.name}
                    </Link>
                    <p className="text-sm text-slate-500">{item.product?.category}{item.color ? ` · ${item.color}` : ''}</p>
                  </div>
                  <button onClick={() => removeItem(item._id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 50)} className="rounded-lg border p-1.5 hover:bg-slate-50">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-16 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 50)} className="rounded-lg border p-1.5 hover:bg-slate-50">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs text-slate-500">{item.product?.unit}s</span>
                  </div>
                  <p className="font-semibold text-slate-900">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Shipping</span><span className="font-medium text-green-600">Calculated at checkout</span></div>
            <div className="border-t border-slate-100 pt-3 flex justify-between">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-display text-xl font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
