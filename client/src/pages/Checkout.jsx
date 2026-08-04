import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../api/client';

export default function Checkout() {
  const { cart, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    company: '', street: '', city: '', state: '', country: '', zipCode: '', phone: '',
  });
  const [notes, setNotes] = useState('');

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const result = await orderAPI.place({ shippingAddress: shipping, notes });
      sessionStorage.setItem('lastOrders', JSON.stringify(result.orders));
      await refreshCart();
      navigate('/order-confirmation');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-4 flex gap-2">
        {['Shipping', 'Review', 'Confirm'].map((label, i) => (
          <div key={label} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
            step === i + 1 ? 'bg-brand-600 text-white' : step > i + 1 ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
          }`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">{i + 1}</span>
            {label}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="card space-y-4 p-6">
              <h2 className="font-display text-lg font-semibold">Shipping Information</h2>
              {['company', 'street', 'city', 'state', 'country', 'zipCode', 'phone'].map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-medium capitalize text-slate-700">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    required
                    value={shipping[field]}
                    onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}
              <button onClick={() => setStep(2)} className="btn-primary w-full">Continue to Review</button>
            </div>
          )}

          {step === 2 && (
            <div className="card space-y-4 p-6">
              <h2 className="font-display text-lg font-semibold">Order Review</h2>
              {cart.items?.map((item) => (
                <div key={item._id} className="flex justify-between border-b border-slate-100 py-3 text-sm">
                  <span>{item.product?.name} × {item.quantity} {item.product?.unit}s</span>
                  <span className="font-medium">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Order Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" rows={3} placeholder="Special instructions..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Confirm Order</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6 text-center">
              <h2 className="font-display text-lg font-semibold">Ready to place your order?</h2>
              <p className="mt-2 text-sm text-slate-600">No payment required for this prototype. Your order will be sent to the supplier for processing.</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card h-fit p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            {cart.items?.map((item) => (
              <div key={item._id} className="flex justify-between text-slate-600">
                <span className="truncate pr-2">{item.product?.name}</span>
                <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-3 flex justify-between font-semibold text-slate-900">
              <span>Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
