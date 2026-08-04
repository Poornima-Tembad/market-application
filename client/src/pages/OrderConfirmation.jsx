import { Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

export default function OrderConfirmation() {
  const orders = JSON.parse(sessionStorage.getItem('lastOrders') || '[]');

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>
      <p className="mt-3 text-slate-600">Your order has been sent to the supplier for processing. You'll receive updates as it progresses.</p>

      {orders.length > 0 && (
        <div className="card mt-8 space-y-3 p-6 text-left">
          {orders.map((order) => (
            <div key={order._id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Package className="h-5 w-5 text-brand-600" />
              <div>
                <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">${order.subtotal?.toFixed(2)} · {order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/dashboard" className="btn-primary">View Orders</Link>
        <Link to="/marketplace" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
}
