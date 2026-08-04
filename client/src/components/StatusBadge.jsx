const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-700' },
  ready_for_dispatch: { label: 'Ready for Dispatch', color: 'bg-indigo-100 text-indigo-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
  return <span className={`badge ${config.color}`}>{config.label}</span>;
}

export function StatCard({ title, value, icon: Icon, trend, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
