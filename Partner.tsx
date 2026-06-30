import { useState } from 'react';
import { Heart, Handshake, CheckCircle2, Send, BookOpen, Users, Globe, DollarSign } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

const PARTNERSHIP_TYPES = [
  { id: 'prayer', label: 'Prayer Partner', icon: BookOpen, desc: 'Cover the ministry in daily intercession', color: 'from-blue-500 to-indigo-600' },
  { id: 'financial', label: 'Financial Partner', icon: DollarSign, desc: 'Sow monthly into the vision', color: 'from-amber-500 to-orange-600' },
  { id: 'volunteer', label: 'Volunteer Partner', icon: Handshake, desc: 'Serve with your time and gifts', color: 'from-emerald-500 to-teal-600' },
  { id: 'missions', label: 'Missions Partner', icon: Globe, desc: 'Support outreach & evangelism', color: 'from-purple-500 to-violet-600' },
];

const AFFIRMATION_ITEMS = [
  'I believe in the vision of Grace Covenant Church',
  'I commit to stand with the leadership in prayer',
  'I will give cheerfully according to my ability',
  'I decree that my seed shall bring an abundant harvest',
  'I receive the covenant blessings of partnership',
];

export default function Partner() {
  const { data, submitPartnership } = useChurch();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    partnershipType: 'prayer',
    affirmation: [] as string[],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [agreedToAffirmation, setAgreedToAffirmation] = useState(false);

  const toggleAffirmation = (item: string) => {
    setForm(f => ({
      ...f,
      affirmation: f.affirmation.includes(item)
        ? f.affirmation.filter(x => x !== item)
        : [...f.affirmation, item],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToAffirmation) {
      alert('Please affirm the partnership declaration to proceed.');
      return;
    }
    submitPartnership(form);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-3xl p-10 shadow-xl border border-emerald-100">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Welcome to the Family!</h1>
          <p className="text-lg text-slate-700 mb-6">
            Thank you, <span className="font-semibold text-amber-700">{form.fullName}</span>, for partnering with Grace Covenant Church. Your partnership is a seed that will bear much fruit.
          </p>
          <blockquote className="italic text-slate-600 border-l-4 border-amber-500 pl-4 text-left bg-white/50 rounded-r-lg p-4">
            "And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work."
            <footer className="text-sm text-amber-700 font-semibold mt-2">— 2 Corinthians 9:8</footer>
          </blockquote>
          <p className="text-sm text-slate-600 mt-6">A confirmation has been noted. Our team will reach out to you soon at <span className="font-semibold">{form.email}</span>.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', country: '', partnershipType: 'prayer', affirmation: [], message: '' }); setAgreedToAffirmation(false); }}
            className="mt-8 inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium"
          >
            Submit another partnership
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 80% 70%, #fbbf24 0%, transparent 50%)' }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-sm mb-5">
            <Heart className="h-4 w-4 fill-current" /> Partner With Us
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">Become a Covenant Partner</h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Join a global family of believers advancing the gospel, transforming lives, and building the kingdom together.
          </p>
        </div>
      </section>

      {/* Partnership Note */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-100">
          <div className="flex items-start gap-5">
            <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex-shrink-0 items-center justify-center shadow-lg">
              <Handshake className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">A Note From Our Heart</h2>
              <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">{data.partnershipNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">Ways You Can Partner</h2>
        <p className="text-slate-600 text-center mb-10">Choose the partnership that fits your calling</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PARTNERSHIP_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setForm(f => ({ ...f, partnershipType: t.id }))}
              className={`text-left bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition border-2 ${
                form.partnershipType === t.id ? 'border-amber-500 ring-4 ring-amber-100' : 'border-transparent hover:-translate-y-1'
              }`}
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 shadow-md`}>
                <t.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{t.label}</h3>
              <p className="text-sm text-slate-600">{t.desc}</p>
              {form.partnershipType === t.id && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                  <CheckCircle2 className="h-4 w-4" /> Selected
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Affirmation + Form */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Affirmation */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-400" /> Partnership Affirmation
            </h2>
            <p className="text-slate-300 text-sm mb-5">Please read the following declaration and check the items you affirm.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
              <p className="italic text-amber-100 leading-relaxed text-sm whitespace-pre-line">{data.partnershipAffirmation}</p>
            </div>

            <div className="space-y-2">
              {AFFIRMATION_ITEMS.map(item => {
                const checked = form.affirmation.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition ${
                      checked ? 'bg-amber-500/20 border border-amber-400/40' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAffirmation(item)}
                      className="mt-0.5 h-5 w-5 rounded accent-amber-500"
                    />
                    <span className="text-sm text-white">{item}</span>
                  </label>
                );
              })}
            </div>

            <label className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToAffirmation}
                onChange={e => setAgreedToAffirmation(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded accent-amber-500"
              />
              <span className="text-sm text-amber-100">
                <strong>I agree</strong> to this affirmation and willingly enter into covenant partnership with Grace Covenant Church.
              </span>
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Send className="h-6 w-6 text-amber-600" /> Partnership Form
            </h2>
            <p className="text-sm text-slate-600 -mt-2">Fill in your details and we'll be in touch.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Full Name *" value={form.fullName} onChange={v => setForm(f => ({ ...f, fullName: v }))} required />
              <FormField label="Country *" value={form.country} onChange={v => setForm(f => ({ ...f, country: v }))} required />
            </div>
            <FormField label="Email *" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required />
            <FormField label="Phone" type="tel" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Partnership Type</label>
              <select
                value={form.partnershipType}
                onChange={e => setForm(f => ({ ...f, partnershipType: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {PARTNERSHIP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Personal Note (optional)</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={3}
                placeholder="Share a testimony, prayer request, or how God led you to partner..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!agreedToAffirmation || !form.fullName || !form.email}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" /> Submit Partnership
            </button>

            <p className="text-xs text-center text-slate-500">🔒 Your details are kept confidential and used only to serve you better.</p>
          </form>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
      />
    </div>
  );
}
