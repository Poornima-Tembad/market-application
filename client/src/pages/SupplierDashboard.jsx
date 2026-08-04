import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { orderAPI } from '../api/client';
import { StatCard } from '../components/StatusBadge';
import StatusBadge from '../components/StatusBadge';

export default function SupplierDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.supplierStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-32"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Supplier Dashboard</h1>
          <p className="mt-2 text-slate-600">Overview of your marketplace activity</p>
        </div>
        <Link to="/supplier/inventory" className="btn-primary"><Plus className="h-4 w-4" /> Add Product</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} color="brand" />
        <StatCard title="Active Products" value={stats?.activeProducts || 0} icon={TrendingUp} color="blue" />
        <StatCard title="Pending Orders" value={stats?.pendingOrders || 0} icon={ShoppingCart} color="amber" />
        <StatCard title="Low Stock Alerts" value={stats?.lowStock?.length || 0} icon={AlertTriangle} color="red" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/supplier/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          {stats?.recentOrders?.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">No orders yet</p>
          ) : (
            <div className="mt-4 space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">{order.buyer?.name}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">Inventory Alerts</h2>
          {stats?.lowStock?.length === 0 ? (
            <p className="mt-6 text-center text-sm text-green-600">All stock levels healthy</p>
          ) : (
            <div className="mt-4 space-y-3">
              {stats?.lowStock?.map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{product.name}</p>
                  <span className="text-sm font-semibold text-red-600">{product.stock} left</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/supplier/inventory" className="btn-secondary mt-4 w-full">Manage Inventory</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { to: '/supplier/inventory', label: 'Manage Products', desc: 'Add, edit, update stock' },
          { to: '/supplier/orders', label: 'Process Orders', desc: 'View and fulfill orders' },
          { to: '/supplier/profile', label: 'Business Profile', desc: 'Update company info' },
        ].map(({ to, label, desc }) => (
          <Link key={to} to={to} className="card p-5 transition hover:shadow-elevated">
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
