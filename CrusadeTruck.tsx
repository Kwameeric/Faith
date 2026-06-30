import { useState } from 'react';
import { Truck, Heart, Target, DollarSign, CheckCircle2, Send, Flame } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import MoMoSection from '../components/MoMoSection';
import BankTransferSection from '../components/BankTransferSection';

const AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function CrusadeTruck() {
  const { data, submitCrusadeDonation } = useChurch();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    amount: 50,
    paymentMethod: 'momo',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const progress = Math.min((data.crusadeTruckRaised / data.crusadeTruckGoal) * 100, 100);
  const remaining = Math.max(data.crusadeTruckGoal - data.crusadeTruckRaised, 0);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.amount) return;
    submitCrusadeDonation(form);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-amber-50 to-emerald-50 rounded-3xl p-10 shadow-xl border border-amber-100">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Kingdom Builder!</h1>
          <p className="text-lg text-slate-700 mb-6">
            Thank you, <span className="font-semibold text-amber-700">{form.fullName}</span>, for your seed of <span className="font-bold text-emerald-700">₵{form.amount}</span> toward the Crusade Truck.
          </p>
          <blockquote className="italic text-slate-700 border-l-4 border-amber-500 pl-4 text-left bg-white/60 rounded-r-lg p-4 mb-6">
            "Those who sow in tears will reap with songs of joy. He who goes out weeping, carrying seed to sow, will return with songs of joy, carrying sheaves with him."
            <footer className="text-sm text-amber-700 font-semibold mt-2">— Psalm 126:5-6</footer>
          </blockquote>
          <p className="text-sm text-slate-600">Your gift will carry the gospel to the unreached. The harvest is coming!</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', amount: 50, paymentMethod: 'momo', message: '' }); }}
            className="mt-8 inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium"
          >
            Support again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white">
        <img src={data.crusadeTruckImage} alt="Crusade Truck" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-200 px-4 py-1.5 rounded-full text-sm mb-5">
            <Flame className="h-4 w-4" /> Evangelism Campaign
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg">The Crusade Truck Project</h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl">
            Taking the gospel beyond walls, into towns, villages, and open fields — reaching thousands for Christ.
          </p>
        </div>
      </section>

      {/* Truck Image + Vision */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
            <img src={data.crusadeTruckImage} alt="Crusade Truck" className="w-full aspect-[4/3] object-cover" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <Truck className="h-4 w-4" /> Mobile Evangelism
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why We Need This Truck</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-6">{data.crusadeTruckDescription}</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 text-center">
                <Target className="h-6 w-6 mx-auto text-amber-600 mb-1" />
                <p className="text-xs text-slate-600">Goal</p>
                <p className="font-bold text-slate-900">₵{data.crusadeTruckGoal.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto text-emerald-600 mb-1" />
                <p className="text-xs text-slate-600">Raised</p>
                <p className="font-bold text-slate-900">₵{data.crusadeTruckRaised.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 text-center">
                <Heart className="h-6 w-6 mx-auto text-red-600 mb-1" />
                <p className="text-xs text-slate-600">Remaining</p>
                <p className="font-bold text-slate-900">₵{remaining.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="max-w-4xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Campaign Progress</h3>
            <span className="font-bold text-amber-600 text-xl">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>₵{data.crusadeTruckRaised.toLocaleString()} raised</span>
            <span>₵{data.crusadeTruckGoal.toLocaleString()} goal</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{data.crusadeDonations.length}</p>
              <p className="text-xs text-slate-500">Donors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100+</p>
              <p className="text-xs text-slate-500">Towns to Reach</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">1,000+</p>
              <p className="text-xs text-slate-500">Souls Expected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form + Payment Options */}
      <section className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 text-white">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-sm mb-3">
              <Heart className="h-4 w-4 fill-current" /> Support the Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Partner With the Crusade Truck</h2>
            <p className="text-slate-300 mt-3">Every seed, no matter the size, moves this truck closer to the harvest field.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Payment Methods Info */}
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
                reference="CRUSADE TRUCK"
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
                placeholder="Testimony or prayer request (optional)"
                rows={2}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Heart className="h-5 w-5 fill-current" /> Submit ₵{form.amount || 0} Gift
              </button>

              <p className="text-xs text-center text-slate-500">🌍 Every gift counts. God sees your heart and your seed.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Scripture Banner */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-2xl italic text-slate-700 leading-relaxed">
          "How then will they call on him in whom they have not believed? And how are they to believe in him of whom they have never heard? And how are they to hear without someone preaching? And how are they to preach unless they are sent?"
        </p>
        <p className="text-amber-600 font-bold mt-4">— Romans 10:14-15</p>
        <p className="text-slate-600 mt-4 text-sm">You are the one who sends. You are the one who carries the gospel.</p>
      </section>
    </div>
  );
}
