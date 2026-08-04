import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Clock, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.buyerOrders().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const current = orders.filter((o) => !['completed', 'cancelled'].includes(o.status));
  const past = orders.filter((o) => ['completed', 'cancelled'].includes(o.status));
  const profile = user?.buyerProfile;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Buyer Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome back, {user?.name}</p>
        </div>
        <Link to="/marketplace" className="btn-primary"><ShoppingBag className="h-4 w-4" /> Browse Fabrics</Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
              <User className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          {profile && (
            <dl className="mt-6 space-y-3 text-sm">
              {profile.businessType && <div><dt className="text-slate-500">Business</dt><dd className="font-medium">{profile.businessType}</dd></div>}
              {profile.industry && <div><dt className="text-slate-500">Industry</dt><dd className="font-medium">{profile.industry}</dd></div>}
              {profile.categoriesOfInterest?.length > 0 && (
                <div><dt className="text-slate-500">Interests</dt><dd className="font-medium">{profile.categoriesOfInterest.join(', ')}</dd></div>
              )}
              {profile.budgetRange && <div><dt className="text-slate-500">Budget</dt><dd className="font-medium">{profile.budgetRange}</dd></div>}
            </dl>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
              <Clock className="h-5 w-5 text-brand-600" /> Current Orders ({current.length})
            </h2>
            {loading ? (
              <div className="mt-4 card p-8 text-center text-slate-500">Loading...</div>
            ) : current.length === 0 ? (
              <div className="mt-4 card p-8 text-center text-slate-500">No active orders</div>
            ) : (
              <div className="mt-4 space-y-3">
                {current.map((order) => (
                  <div key={order._id} className="card flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">{order.items?.length} item(s) · ${order.subtotal?.toFixed(2)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
              <Package className="h-5 w-5 text-brand-600" /> Order History ({past.length})
            </h2>
            {past.length === 0 ? (
              <div className="mt-4 card p-8 text-center text-slate-500">No past orders yet</div>
            ) : (
              <div className="mt-4 space-y-3">
                {past.map((order) => (
                  <div key={order._id} className="card flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
