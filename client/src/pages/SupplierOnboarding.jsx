import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  {
    id: 'business',
    title: 'Business Information',
    aiPrompt: 'Tell us about your textile business.',
    fields: [
      { key: 'businessName', label: 'Business Name', type: 'text' },
      { key: 'businessType', label: 'Business Type', type: 'select', options: ['Manufacturer', 'Wholesaler', 'Trader', 'Mill', 'Other'] },
      { key: 'contactPhone', label: 'Contact Phone', type: 'tel' },
    ],
  },
  {
    id: 'location',
    title: 'Business Address',
    aiPrompt: 'Where is your business located?',
    fields: [
      { key: 'street', label: 'Street Address', type: 'text', nested: 'businessAddress' },
      { key: 'city', label: 'City', type: 'text', nested: 'businessAddress' },
      { key: 'country', label: 'Country', type: 'text', nested: 'businessAddress' },
      { key: 'operatingHours', label: 'Operating Hours', type: 'text' },
    ],
  },
  {
    id: 'products',
    title: 'Product Offerings',
    aiPrompt: 'What fabrics do you offer?',
    fields: [
      { key: 'productCategories', label: 'Product Categories', type: 'multiselect', options: ['Cotton', 'Silk', 'Linen', 'Wool', 'Denim', 'Synthetic'] },
      { key: 'fabricTypes', label: 'Fabric Types', type: 'multiselect', options: ['Natural', 'Synthetic', 'Blended', 'Organic', 'Recycled'] },
      { key: 'moq', label: 'Minimum Order Quantity (meters)', type: 'number' },
    ],
  },
];

export default function SupplierOnboarding() {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ businessAddress: {} });
  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const updateField = (key, value, nested) => {
    if (nested) {
      setData({ ...data, [nested]: { ...data[nested], [key]: value } });
    } else {
      setData({ ...data, [key]: value });
    }
  };

  const toggleMulti = (key, value) => {
    const current = data[key] || [];
    setData({ ...data, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const user = await authAPI.supplierOnboarding(data);
      updateUser(user);
      navigate('/supplier');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const lower = chatInput.toLowerCase();
    if (lower.includes('manufacturer')) updateField('businessType', 'Manufacturer');
    if (lower.includes('cotton')) toggleMulti('productCategories', 'Cotton');
    if (lower.includes('mumbai') || lower.includes('india')) {
      updateField('city', 'Mumbai', 'businessAddress');
      updateField('country', 'India', 'businessAddress');
    }
    setChatInput('');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
          <Factory className="h-6 w-6 text-brand-600" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Supplier Setup</h1>
        <p className="mt-2 text-slate-600">Configure your business profile</p>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setChatMode(false)} className={`rounded-full px-4 py-1.5 text-xs font-medium ${!chatMode ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Form Mode</button>
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
              <p>Try: "We're a cotton manufacturer in Mumbai, India with MOQ of 100 meters"</p>
            </div>
            <div className="mt-4 flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()} className="input-field flex-1" placeholder="Describe your business..." />
              <button onClick={handleChatSubmit} className="btn-primary">Apply</button>
            </div>
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
                ) : field.type === 'multiselect' ? (
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((o) => (
                      <button key={o} type="button" onClick={() => toggleMulti(field.key, o)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          (data[field.key] || []).includes(o) ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>{o}</button>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={field.nested ? data[field.nested]?.[field.key] || '' : data[field.key] || ''}
                    onChange={(e) => updateField(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value, field.nested)}
                    className="input-field"
                  />
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
            <button onClick={() => setStep(step + 1)} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button onClick={handleFinish} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Complete Setup'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
