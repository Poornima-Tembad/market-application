import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, User, LogOut, Menu, X, Package, LayoutDashboard,
  Warehouse, ClipboardList, Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const buyerLinks = [
    { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const supplierLinks = [
    { to: '/supplier', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/supplier/inventory', label: 'Inventory', icon: Warehouse },
    { to: '/supplier/orders', label: 'Orders', icon: ClipboardList },
  ];

  const links = user?.role === 'supplier' ? supplierLinks : buyerLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Tex<span className="text-brand-600">Trade</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {!user && (
            <>
              <Link to="/marketplace" className="btn-ghost">Marketplace</Link>
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary ml-2">Get Started</Link>
            </>
          )}
          {user && links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive(to) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user?.role === 'buyer' && (
            <Link to="/cart" className="relative btn-ghost">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          {user && (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to={user.role === 'supplier' ? '/supplier/profile' : '/dashboard'}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <User className="h-4 w-4" />
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-slate-500">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          {!user ? (
            <div className="flex flex-col gap-2">
              <Link to="/marketplace" onClick={() => setMobileOpen(false)} className="btn-ghost justify-start">Marketplace</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost justify-start">Sign In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary">Get Started</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
