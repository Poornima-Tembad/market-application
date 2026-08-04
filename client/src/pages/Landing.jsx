import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Shield, Zap, TrendingUp, Users, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { productAPI } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Landing() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    productAPI.featured().then(setFeatured).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-1.5 text-sm font-medium text-brand-200 ring-1 ring-brand-500/30">
              <Globe className="h-4 w-4" /> Global B2B Textile Marketplace
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Source premium fabrics from trusted suppliers worldwide
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              TexTrade connects commercial fabric buyers with verified global textile suppliers.
              Discover, compare, and order with AI-powered assistance — all in one platform.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/marketplace" className="btn-primary bg-brand-500 hover:bg-brand-400 px-8 py-3 text-base">
                Browse Marketplace <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/register" className="btn-secondary border-slate-600 bg-transparent text-white hover:bg-white/10 px-8 py-3 text-base">
                Join as Supplier
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Users, label: '500+ Suppliers', value: 'Global network' },
              { icon: Package, label: '10K+ Fabrics', value: 'Curated catalog' },
              { icon: Globe, label: '40+ Countries', value: 'Worldwide reach' },
              { icon: TrendingUp, label: 'AI-Powered', value: 'Smart discovery' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
                <Icon className="h-6 w-6 text-brand-400" />
                <p className="mt-2 font-display text-lg font-bold text-white">{label}</p>
                <p className="text-sm text-slate-400">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900">Built for B2B textile trade</h2>
          <p className="mt-3 text-slate-600">Everything you need to source fabrics efficiently</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Zap, title: 'AI Fabric Assistant', desc: 'Natural language search, recommendations, and product Q&A powered by smart AI.' },
            { icon: Shield, title: 'Verified Suppliers', desc: 'Every supplier is vetted with transparent profiles, MOQs, and inventory data.' },
            { icon: TrendingUp, title: 'Bulk Ordering', desc: 'Designed for commercial buyers with MOQ support, cart management, and order tracking.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-slate-900">Featured Fabrics</h2>
                <p className="mt-2 text-slate-600">Hand-picked premium selections from top suppliers</p>
              </div>
              <Link to="/marketplace" className="btn-ghost text-brand-600">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold text-white">Ready to transform your sourcing?</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Join thousands of buyers and suppliers on the fastest-growing B2B textile marketplace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-brand-50">
              Create Free Account
            </Link>
            <Link to="/marketplace" className="rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
