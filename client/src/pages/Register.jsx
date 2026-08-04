import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Factory } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password, role });
      navigate(role === 'buyer' ? '/onboarding/buyer' : '/onboarding/supplier');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-slate-900">Join TexTrade</h1>
        <p className="mt-2 text-slate-600">Create your account to start trading</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {[
          { value: 'buyer', label: "I'm a Buyer", icon: ShoppingBag, desc: 'Source fabrics' },
          { value: 'supplier', label: "I'm a Supplier", icon: Factory, desc: 'Sell fabrics' },
        ].map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              role === value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Icon className={`h-6 w-6 ${role === value ? 'text-brand-600' : 'text-slate-400'}`} />
            <p className="mt-2 font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {role === 'buyer' ? 'Company / Name' : 'Business Name'}
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm Password</label>
          <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input-field" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-medium text-brand-600">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
