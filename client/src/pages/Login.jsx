import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.role === 'buyer') {
        navigate(data.buyerProfile?.onboardingComplete ? '/dashboard' : '/onboarding/buyer');
      } else {
        navigate(data.supplierProfile?.onboardingComplete ? '/supplier' : '/onboarding/supplier');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-slate-600">Sign in to your TexTrade account</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6">
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">Register</Link>
        </p>

        <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          <p className="font-medium text-slate-700">Demo accounts:</p>
          <p className="mt-1">Buyer: buyer@textrade.com / demo123</p>
          <p>Supplier: supplier@textrade.com / demo123</p>
        </div>
      </form>
    </div>
  );
}
