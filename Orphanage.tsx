import { useState } from 'react';
import { HandHeart, X, CheckCircle2, Send, Heart, Shirt, BookOpen, UtensilsCrossed, DollarSign, Package } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import MoMoSection from '../components/MoMoSection';
import BankTransferSection from '../components/BankTransferSection';

const DONATION_TYPES = [
  { id: 'funds', label: 'Monetary Funds', icon: DollarSign, desc: 'Cash donation via MoMo, Bank or PayPal', color: 'from-emerald-500 to-green-600' },
  { id: 'clothes', label: 'Clothes & Fabrics', icon: Shirt, desc: 'New or gently worn clothing for children', color: 'from-pink-500 to-rose-600' },
  { id: 'school', label: 'School Materials', icon: BookOpen, desc: 'Books, uniforms, bags, stationery', color: 'from-blue-500 to-indigo-600' },
  { id: 'food', label: 'Food & Provisions', icon: UtensilsCrossed, desc: 'Rice, beans, oil, milk, meals', color: 'from-amber-500 to-orange-600' },
  { id: 'toiletries', label: 'Toiletries & Health', icon: Heart, desc: 'Soap, toothpaste, medicine, sanitary items', color: 'from-cyan-500 to-teal-600' },
  { id: 'other', label: 'Other Items', icon: Package, desc: 'Toys, bedding, shoes, etc.', color: 'from-purple-500 to-violet-600' },
];

export default function Orphanage() {
  const { data, submitOrphanageDonation } = useChurch();
  const [active, setActive] = useState<string | null>(null);
  const activeImg = data.orphanageImages.find(i => i.id === active);

  const [donationType, setDonationType] = useState('funds');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: 50,
    itemDescription: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName) return;
    if (donationType === 'funds' && !form.amount) return;
    if (donationType !== 'funds' && !form.itemDescription) return;
    submitOrphanageDonation({ ...form, donationType });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ fullName: '', email: '', phone: '', amount: 50, itemDescription: '', message: '' });
    setDonationType('funds');
  };

  if (submitted) {
    const typeInfo = DONATION_TYPES.find(t => t.id === donationType);
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-10 shadow-xl border border-pink-100">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">God Bless You!</h1>
          <p className="text-lg text-slate-700 mb-6">
            Thank you, <span className="font-semibold text-pink-700">{form.fullName}</span>, for your {typeInfo?.label.toLowerCase()} donation to {data.orphanageName}.
          </p>
          {donationType === 'funds' ? (
            <p className="text-slate-600 mb-4">Your ₵{form.amount} gift will feed, clothe, and educate a child in need.</p>
          ) : (
            <p className="text-slate-600 mb-4">Your donation of <span className="font-semibold">{form.itemDescription}</span> will bring joy to a child.</p>
          )}
          <blockquote className="italic text-slate-700 border-l-4 border-pink-500 pl-4 text-left bg-white/60 rounded-r-lg p-4 mb-6">
            "Whoever is kind to the poor lends to the LORD, and he will reward them for what they have done."
            <footer className="text-xs text-pink-700 font-semibold mt-1">— Proverbs 19:17</footer>
          </blockquote>
          <p className="text-sm text-slate-600">Our team will reach out to coordinate your donation if needed.</p>
          <button onClick={resetForm} className="mt-8 inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium">
            Support again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <HandHeart className="h-4 w-4" /> {data.orphanageName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Orphanage Home</h1>
          <p className="text-slate-600 mt-3 max-w-3xl mx-auto">{data.orphanageDescription}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.orphanageImages.map(img => (
            <button
              key={img.id}
              onClick={() => setActive(img.id)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition"
            >
              <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-white font-medium text-sm">{img.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Donation Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <Heart className="h-4 w-4 fill-current" /> Ways to Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How Can You Help?</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">Choose how you'd like to bless the children of {data.orphanageName.split(' ')[0]}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DONATION_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setDonationType(t.id)}
              className={`text-left bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition border-2 ${
                donationType === t.id ? 'border-pink-500 ring-4 ring-pink-100' : 'border-transparent hover:-translate-y-1'
              }`}
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 shadow-md`}>
                <t.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{t.label}</h3>
              <p className="text-sm text-slate-600">{t.desc}</p>
              {donationType === t.id && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-pink-700">
                  <CheckCircle2 className="h-4 w-4" /> Selected
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Payment Methods (for funds) */}
      {donationType === 'funds' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid md:grid-cols-2 gap-5">
            <MoMoSection
              variant="compact"
              number={data.momoNumber}
              name={data.momoName}
              network={data.momoNetwork}
            />
            <BankTransferSection
              variant="compact"
              bankName={data.bankName}
              accountName={data.accountName}
              accountNumber={data.accountNumber}
              paymentLink={data.paymentLink}
              reference="ORPHANAGE"
            />
          </div>
        </section>
      )}

      {/* Donation Form */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-rose-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-pink-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="h-6 w-6 text-pink-600" /> Submit Your Donation
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {donationType === 'funds'
                ? 'After sending via MoMo or Bank, log your gift so we can pray for you.'
                : 'Tell us what you\'re donating so we can coordinate pickup/delivery.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-800 px-3 py-1.5 rounded-full text-sm font-medium">
                {(() => { const t = DONATION_TYPES.find(x => x.id === donationType); return t ? <><t.icon className="h-4 w-4" /> {t.label}</> : null; })()}
              </div>

              <input
                required
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                placeholder="Your Full Name *"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email (optional)"
                  className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                />
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="Phone (optional)"
                  className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                />
              </div>

              {donationType === 'funds' ? (
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Amount (USD) *</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[25, 50, 100, 250].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, amount: v }))}
                        className={`py-2.5 rounded-lg text-sm font-semibold border transition ${
                          form.amount === v ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-200 hover:border-pink-500'
                        }`}
                      >
                        ₵{v}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={form.amount || ''}
                    onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                    placeholder="Or enter custom amount"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">What are you donating? *</label>
                  <textarea
                    required
                    value={form.itemDescription}
                    onChange={e => setForm(f => ({ ...f, itemDescription: e.target.value }))}
                    placeholder={`Describe your ${DONATION_TYPES.find(t => t.id === donationType)?.label.toLowerCase()} donation (quantity, size, condition, etc.)`}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm resize-none"
                  />
                </div>
              )}

              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Message / prayer request (optional)"
                rows={2}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm resize-none"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <HandHeart className="h-5 w-5" /> Submit Donation
              </button>

              <p className="text-xs text-center text-slate-500">
                💝 {donationType === 'funds' ? 'Every dollar feeds a child.' : 'We\'ll contact you to arrange pickup or drop-off.'}
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Impact Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-bold text-slate-900">Sponsor a Child</h3>
            <p className="text-sm text-slate-600 mt-2">₵50/month covers food, school, and care for one child.</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
            <div className="text-3xl mb-2">👕</div>
            <h3 className="font-bold text-slate-900">Donate Supplies</h3>
            <p className="text-sm text-slate-600 mt-2">Clothes, books, toys, and school materials are always needed.</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-slate-900">Visit & Volunteer</h3>
            <p className="text-sm text-slate-600 mt-2">Your time and presence mean the world to these children.</p>
          </div>
        </div>
      </section>

      {/* Scripture */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-2xl italic text-slate-700 leading-relaxed">
          "Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world."
        </p>
        <p className="text-pink-600 font-bold mt-4">— James 1:27</p>
      </section>

      {activeImg && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button onClick={() => setActive(null)} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
          <img src={activeImg.src} alt={activeImg.caption} className="max-h-[85vh] max-w-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
