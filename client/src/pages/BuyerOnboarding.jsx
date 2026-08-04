import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  {
    id: 'business',
    title: 'Tell us about your business',
    aiPrompt: "Let's personalize your experience! What type of business are you?",
    fields: [
      { key: 'businessType', label: 'Business Type', type: 'select', options: ['Brand/Retailer', 'Manufacturer', 'Wholesaler', 'Designer', 'Other'] },
      { key: 'industry', label: 'Industry', type: 'select', options: ['Fashion Apparel', 'Home Textiles', 'Industrial', 'Sportswear', 'Luxury', 'Other'] },
    ],
  },
  {
    id: 'preferences',
    title: 'Fabric preferences',
    aiPrompt: 'What fabric categories and types interest you most?',
    fields: [
      { key: 'categoriesOfInterest', label: 'Categories of Interest', type: 'multiselect', options: ['Cotton', 'Silk', 'Linen', 'Wool', 'Denim', 'Synthetic', 'Cellulosic'] },
      { key: 'preferredFabricTypes', label: 'Preferred Fabric Types', type: 'multiselect', options: ['Natural', 'Organic', 'Synthetic', 'Blended', 'Recycled', 'Premium'] },
    ],
  },
  {
    id: 'ordering',
    title: 'Ordering details',
    aiPrompt: 'Help us understand your typical order patterns.',
    fields: [
      { key: 'typicalOrderQuantity', label: 'Typical Order Quantity', type: 'select', options: ['Under 100 meters', '100-500 meters', '500-2000 meters', '2000+ meters'] },
      { key: 'budgetRange', label: 'Budget Range (per meter)', type: 'select', options: ['Under $5', '$5-$10', '$10-$20', '$20-$50', '$50+'] },
    ],
  },
];

export default function BuyerOnboarding() {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const updateField = (key, value) => setData({ ...data, [key]: value });

  const toggleMulti = (key, value) => {
    const current = data[key] || [];
    updateField(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const user = await authAPI.buyerOnboarding(data);
      updateUser(user);
      navigate('/marketplace');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const lower = chatInput.toLowerCase();
    if (lower.includes('fashion') || lower.includes('apparel')) updateField('industry', 'Fashion Apparel');
    if (lower.includes('cotton')) toggleMulti('categoriesOfInterest', 'Cotton');
    if (lower.includes('silk')) toggleMulti('categoriesOfInterest', 'Silk');
    if (lower.includes('organic')) toggleMulti('preferredFabricTypes', 'Organic');
    if (lower.includes('500') || lower.includes('bulk')) updateField('typicalOrderQuantity', '500-2000 meters');
    setChatInput('');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
          <Sparkles className="h-6 w-6 text-brand-600" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Welcome to TexTrade</h1>
        <p className="mt-2 text-slate-600">Let's set up your buyer profile</p>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setChatMode(false)} className={`rounded-full px-4 py-1.5 text-xs font-medium ${!chatMode ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          Form Mode
        </button>
        <button onClick={() => setChatMode(true)} className={`rounded-full px-4 py-1.5 text-xs font-medium ${chatMode ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          <MessageCircle className="mr-1 inline h-3 w-3" /> AI Chat Mode
        </button>
      </div>

      <div className="card mt-6 p-6">
        <p className="text-sm font-medium text-brand-600">{current.aiPrompt}</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-slate-900">{current.title}</h2>

        {chatMode ? (
          <div className="mt-6">
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>Try: "I'm a fashion apparel brand interested in organic cotton, ordering 500-2000 meters"</p>
            </div>
            <div className="mt-4 flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()} className="input-field flex-1" placeholder="Describe your business..." />
              <button onClick={handleChatSubmit} className="btn-primary">Apply</button>
            </div>
            {Object.keys(data).length > 0 && (
              <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm">
                <p className="font-medium text-brand-700">Detected preferences:</p>
                <pre className="mt-1 text-brand-600">{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {current.fields.map((field) => (
              <div key={field.key}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                {field.type === 'select' ? (
                  <select value={data[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} className="input-field">
                    <option value="">Select...</option>
                    {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((o) => (
                      <button key={o} type="button" onClick={() => toggleMulti(field.key, o)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          (data[field.key] || []).includes(o) ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleFinish} disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
