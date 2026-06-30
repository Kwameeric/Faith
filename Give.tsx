import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CreditCard, DollarSign, Copy, Check, Smartphone, Phone, HardHat, HandHeart, Globe, ArrowRight } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import { useCurrency } from '../context/CurrencyContext';
import BankTransferSection from '../components/BankTransferSection';

export default function Give() {
  const { data } = useChurch();
  const { formatMoney, getCurrencyInfo, currency } = useCurrency();
  const currencyInfo = getCurrencyInfo(currency);
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(50);
  const [type, setType] = useState<'tithe' | 'offering' | 'building' | 'orphanage' | 'outreach'>('tithe');
  const [copied, setCopied] = useState('');

  // Some gift types should take the user to a dedicated page with its own payment section
  const giftTypeConfig: Record<string, { label: string; desc: string; icon: any; page?: string; color: string }> = {
    tithe: { label: 'Tithe', desc: 'Return your tithe faithfully', icon: DollarSign, color: 'from-amber-500 to-orange-600' },
    offering: { label: 'Offering', desc: 'Give a freewill offering', icon: Heart, color: 'from-rose-500 to-pink-600' },
    building: { label: 'Building', desc: 'Support the auditorium project', icon: HardHat, page: '/building', color: 'from-indigo-500 to-blue-600' },
    orphanage: { label: 'Orphanage', desc: 'Bless the children at Grace Haven', icon: HandHeart, page: '/orphanage', color: 'from-pink-500 to-rose-600' },
    outreach: { label: 'Outreach Funds', desc: 'Fund the Crusade Truck evangelism', icon: Globe, page: '/crusade-truck', color: 'from-emerald-500 to-green-600' },
  };

  const handleTypeSelect = (key: string) => {
    const cfg = giftTypeConfig[key];
    if (cfg.page) {
      navigate(cfg.page);
    } else {
      setType(key as any);
    }
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard?.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{data.givingTitle}</h1>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto">{data.givingDescription}</p>
      </div>

      {/* MoMo Quick Send Section */}
      <div className="mb-8 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 0%, transparent 50%)' }} />
        <div className="relative p-6 sm:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur">
              <Smartphone className="h-4 w-4" /> {data.momoNetwork}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Send Your Offering via MoMo</h2>
            <p className="text-emerald-50 text-sm mb-5">
              Tap the button below — it opens your phone dialer with our MoMo number ready. Just complete the transfer from your MoMo app.
            </p>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur mb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-emerald-100 mb-1 uppercase tracking-wider">MoMo Number</p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-wider font-mono">{data.momoNumber}</p>
                </div>
                <button
                  onClick={() => copy(data.momoNumber.replace(/\s/g, ''), 'momo')}
                  className="h-11 w-11 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 flex items-center justify-center flex-shrink-0 shadow-lg transition"
                  title="Copy number"
                >
                  {copied === 'momo' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-sm">
                <div>
                  <span className="text-emerald-100">Account: </span>
                  <span className="font-semibold">{data.momoName}</span>
                </div>
                {copied === 'momo' && <span className="text-xs bg-white text-emerald-700 px-2 py-0.5 rounded-full font-semibold">✓ Copied!</span>}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${data.momoNumber.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-full font-bold shadow-lg transition"
              >
                <Phone className="h-5 w-5" /> 📞 Send via MoMo
              </a>
              <a
                href={`sms:${data.momoNumber.replace(/\s/g, '')}?body=Hello%20${encodeURIComponent(data.momoName)},%20I%20would%20like%20to%20send%20my%20offering.`}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-5 py-3 rounded-full font-bold backdrop-blur transition"
              >
                💬 Send SMS First
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center text-white">
            <div className="h-32 w-32 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center mb-3">
              <div className="h-24 w-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Smartphone className="h-14 w-14 text-white" />
              </div>
            </div>
            <p className="text-xs text-emerald-100 text-center font-medium">Opens your dialer<br />with the number ready</p>
          </div>
        </div>

        <div className="bg-black/20 px-6 py-3 text-emerald-50 text-xs flex flex-wrap items-center gap-4">
          <span><strong>Steps:</strong> Tap "Send via MoMo" → Dialer opens → Call ends → Open MoMo app → Send Money → Enter amount → Add reference → Confirm PIN ✅</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Giving Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-bold">Make a Gift</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Gift Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(giftTypeConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  const isSelected = type === key && !cfg.page;
                  const hasPage = !!cfg.page;
                  return (
                    <button
                      key={key}
                      onClick={() => handleTypeSelect(key)}
                      className={`relative text-left p-3 rounded-xl text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-500 hover:shadow-sm'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center mb-2 shadow`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="font-bold text-sm mb-0.5">{cfg.label}</div>
                      <div className={`text-[10px] leading-tight ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>{cfg.desc}</div>
                      {hasPage && (
                        <div className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-600">
                          Go to page <ArrowRight className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-2">💡 Building, Orphanage & Outreach take you to their dedicated pages.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">{currencyInfo.symbol}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              <div className="flex gap-2 mt-2">
                    {[10, 50, 100, 500].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`flex-1 py-2 text-sm rounded-lg border transition ${amount === v ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:border-slate-400'}`}
                  >
                    {currencyInfo.symbol}{v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Card Details</label>
              <div className="space-y-2">
                <input placeholder="Card number" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="MM / YY" className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                  <input placeholder="CVV" className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition">
              <CreditCard className="h-5 w-5" />
              Give ₵{amount} as {type}
            </button>

            <p className="text-xs text-center text-slate-500">🔒 Secure, encrypted payment. Thank you for your generosity.</p>
          </div>
        </div>

        {/* Bank Transfer / PayPal */}
        <div className="space-y-5">
          <BankTransferSection
            bankName={data.bankName}
            accountName={data.accountName}
            accountNumber={data.accountNumber}
            paymentLink={data.paymentLink}
            reference="GIVING"
          />

          <a
            href={data.paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition text-center"
          >
            <div className="text-3xl mb-2">💙</div>
            <h3 className="text-xl font-bold">PayPal Giving</h3>
            <p className="text-sm text-blue-100 mt-1">Fast, secure giving via PayPal</p>
            <div className="mt-3 inline-block px-5 py-2 bg-white text-blue-700 font-semibold rounded-full text-sm">
              Go to PayPal →
            </div>
          </a>

          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <p className="text-amber-900 italic text-sm">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
            </p>
            <p className="text-amber-700 text-xs font-semibold mt-2">— 2 Corinthians 9:7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
