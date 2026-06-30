import { useState } from 'react';
import { HardHat, X, TrendingUp, DollarSign, Users2, Home, Heart, CheckCircle2, Send } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import MoMoSection from '../components/MoMoSection';
import BankTransferSection from '../components/BankTransferSection';

const AMOUNTS = [50, 100, 250, 500, 1000, 2500];

export default function Building() {
  const { data, submitBuildingDonation } = useChurch();
  const [active, setActive] = useState<string | null>(null);
  const activeImg = data.buildingImages.find(i => i.id === active);
  const progress = Math.min((data.buildingAuditoriumRaised / data.buildingAuditoriumGoal) * 100, 100);
  const remaining = Math.max(data.buildingAuditoriumGoal - data.buildingAuditoriumRaised, 0);

  // Donation form
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    amount: 100,
    paymentMethod: 'momo',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.amount) return;
    submitBuildingDonation(form);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <HardHat className="h-4 w-4" /> Under Construction
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Building Project</h1>
          <p className="text-slate-600 mt-3 max-w-3xl mx-auto">{data.buildingProjectDescription}</p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Auditorium Construction Progress</h3>
            <span className="text-amber-400 font-bold text-2xl">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <TrendingUp className="h-6 w-6 mx-auto text-amber-400 mb-2" />
              <p className="text-xs text-slate-400">Phase</p>
              <p className="font-bold">2 of 4</p>
            </div>
            <div>
              <DollarSign className="h-6 w-6 mx-auto text-amber-400 mb-2" />
              <p className="text-xs text-slate-400">Raised</p>
              <p className="font-bold">₵{data.buildingAuditoriumRaised.toLocaleString()}</p>
            </div>
            <div>
              <Users2 className="h-6 w-6 mx-auto text-amber-400 mb-2" />
              <p className="text-xs text-slate-400">Donors</p>
              <p className="font-bold">{data.buildingDonations.length}</p>
            </div>
          </div>
        </div>

        {/* Main Auditorium Image */}
        <div className="mb-8 relative rounded-3xl overflow-hidden shadow-2xl">
          <img src={data.buildingAuditoriumImage} alt="Building Auditorium" className="w-full aspect-[21/9] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Home className="h-3 w-3" /> The New Auditorium
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">A Permanent House of Worship</h2>
            <p className="text-slate-200 text-sm max-w-2xl">A 2,000-seat sanctuary with prayer tower, children's wing, and community hall.</p>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 mb-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Why We're Building</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{data.buildingAuditoriumDescription}</p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
              <p className="text-2xl font-bold text-amber-600">₵{data.buildingAuditoriumGoal.toLocaleString()}</p>
              <p className="text-xs text-slate-600">Goal</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
              <p className="text-2xl font-bold text-emerald-600">₵{data.buildingAuditoriumRaised.toLocaleString()}</p>
              <p className="text-xs text-slate-600">Raised</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
              <p className="text-2xl font-bold text-red-600">₵{remaining.toLocaleString()}</p>
              <p className="text-xs text-slate-600">Remaining</p>
            </div>
          </div>
        </div>

        {/* Construction Gallery */}
        <h2 className="text-2xl font-bold text-slate-900 mb-5">Construction Gallery</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {data.buildingImages.map(img => (
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

      {/* Donation Section */}
      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 text-white">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-sm mb-3">
              <Heart className="h-4 w-4 fill-current" /> Build With Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Lay a Brick — Leave a Legacy</h2>
            <p className="text-slate-300 mt-3">Your seed is laying the foundation for generations of worship.</p>
          </div>

          {submitted ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 text-center shadow-2xl">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You, Builder!</h3>
              <p className="text-slate-600 mb-4">
                Your ₵{form.amount} seed is helping us build a house of worship that will stand for generations.
              </p>
              <blockquote className="italic text-slate-700 border-l-4 border-amber-500 pl-4 text-left bg-amber-50 p-4 rounded-r-lg">
                "Unless the LORD builds the house, the builders labor in vain."
                <footer className="text-xs text-amber-700 font-semibold mt-1">— Psalm 127:1</footer>
              </blockquote>
              <button
                onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', amount: 100, paymentMethod: 'momo', message: '' }); }}
                className="mt-5 text-sm text-indigo-700 hover:text-indigo-900 font-medium underline"
              >
                Give again
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="space-y-4">
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
                  reference="BUILDING PROJECT"
                />

                <a
                  href={data.paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-5 shadow-xl text-center hover:shadow-2xl transition"
                >
                  <p className="text-2xl mb-1">💙</p>
                  <h3 className="font-bold text-lg">PayPal Giving</h3>
                  <p className="text-xs text-blue-100 mt-1">International donations welcome</p>
                </a>
              </div>

              {/* Donation Form */}
              <form onSubmit={handleDonate} className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                  <Send className="h-5 w-5 text-amber-600" /> Submit Your Gift
                </h3>
                <p className="text-sm text-slate-600 -mt-2">After sending via your preferred method, log your gift below.</p>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Select Amount (USD)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AMOUNTS.map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, amount: v }))}
                        className={`py-2.5 rounded-lg text-sm font-semibold border transition ${
                          form.amount === v ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-500'
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
                    className="w-full mt-2 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                </div>

                <input
                  required
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="Your Full Name *"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email (optional)"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                />
                <select
                  value={form.paymentMethod}
                  onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                >
                  <option value="momo">MoMo</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="card">Card</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Dedication, testimony, or prayer request (optional)"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Home className="h-5 w-5" /> Submit ₵{form.amount || 0} Gift
                </button>

                <p className="text-xs text-center text-slate-500">🏗️ Every brick matters. Your seed builds God's house.</p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Scripture */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-2xl italic text-slate-700 leading-relaxed">
          "And my people who are called by my name, if they humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven and will forgive their sin and heal their land."
        </p>
        <p className="text-amber-600 font-bold mt-4">— 2 Chronicles 7:14</p>
      </section>

      {/* Lightbox */}
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
