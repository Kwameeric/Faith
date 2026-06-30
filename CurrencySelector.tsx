import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrency, getCurrencyInfo } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const info = getCurrencyInfo(currency);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition"
        title="Change currency"
      >
        <span className="text-base">{info.flag}</span>
        <span className="hidden sm:inline">{info.symbol}</span>
        <span className="hidden md:inline">{info.code}</span>
        <ChevronDown className={`h-3 w-3 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-700">Choose your currency</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Prices will be converted automatically</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition text-left ${
                  currency === c.code ? 'bg-amber-50' : ''
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.code} · {c.symbol}</p>
                </div>
                {currency === c.code && (
                  <Check className="h-4 w-4 text-amber-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
