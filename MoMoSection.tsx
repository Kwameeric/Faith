import { useState } from 'react';
import { Smartphone, Phone, Copy, Check } from 'lucide-react';

type MoMoSectionProps = {
  number: string;
  name: string;
  network: string;
  title?: string;
  description?: string;
  variant?: 'full' | 'compact';
  instructions?: string;
};

export default function MoMoSection({
  number,
  name,
  network,
  title = 'Send Your Offering via MoMo',
  description = 'Tap the button below — it opens your phone dialer with our MoMo number ready. Just complete the transfer from your MoMo app.',
  variant = 'full',
  instructions,
}: MoMoSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyNumber = () => {
    navigator.clipboard?.writeText(number.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-green-700 text-white rounded-2xl p-5 shadow-xl">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          📱 {network}
        </h3>
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-100 mb-1 uppercase tracking-wider">MoMo Number</p>
              <p className="text-xl sm:text-2xl font-bold font-mono tracking-wider truncate">{number}</p>
            </div>
            <button
              onClick={copyNumber}
              className="h-11 w-11 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 flex items-center justify-center flex-shrink-0 shadow-lg transition"
              title="Copy number"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <div className="pt-2 border-t border-white/20 text-sm">
            <p className="text-xs text-emerald-100">Account Name</p>
            <p className="font-semibold">{name}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`tel:${number.replace(/\s/g, '')}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition"
          >
            <Phone className="h-4 w-4" /> Send via MoMo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 0%, transparent 50%)' }} />
      <div className="relative p-6 sm:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur">
            <Smartphone className="h-4 w-4" /> {network}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-emerald-50 text-sm mb-5">{description}</p>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur mb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-emerald-100 mb-1 uppercase tracking-wider">MoMo Number</p>
                <p className="text-2xl sm:text-3xl font-bold tracking-wider font-mono truncate">{number}</p>
              </div>
              <button
                onClick={copyNumber}
                className="h-11 w-11 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 flex items-center justify-center flex-shrink-0 shadow-lg transition"
                title="Copy number"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-sm flex-wrap gap-2">
              <div>
                <span className="text-emerald-100">Account: </span>
                <span className="font-semibold">{name}</span>
              </div>
              {copied && <span className="text-xs bg-white text-emerald-700 px-2 py-0.5 rounded-full font-semibold">✓ Copied!</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${number.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-full font-bold shadow-lg transition"
            >
              <Phone className="h-5 w-5" /> 📞 Send via MoMo
            </a>
            <a
              href={`sms:${number.replace(/\s/g, '')}?body=Hello%20${encodeURIComponent(name)},%20I%20would%20like%20to%20send%20my%20offering.`}
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

      {instructions && (
        <div className="bg-black/20 px-6 py-3 text-emerald-50 text-xs">
          {instructions}
        </div>
      )}
    </div>
  );
}
