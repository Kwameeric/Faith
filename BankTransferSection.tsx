import { useState } from 'react';
import { Building2, Copy, Check, ExternalLink, CreditCard } from 'lucide-react';

type BankTransferSectionProps = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  paymentLink?: string;
  reference?: string;
  variant?: 'full' | 'compact';
};

export default function BankTransferSection({
  bankName,
  accountName,
  accountNumber,
  paymentLink,
  reference = 'GIVING',
  variant = 'full',
}: BankTransferSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  const copyAllDetails = () => {
    const text = `Bank: ${bankName}\nAccount Name: ${accountName}\nAccount Number: ${accountNumber}\nReference: ${reference}`;
    navigator.clipboard?.writeText(text);
    setCopied('all');
    setTimeout(() => setCopied(null), 2500);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-slate-900" />
          </div>
          <h3 className="font-bold text-lg">Bank Transfer</h3>
        </div>
        <div className="space-y-2 text-sm">
          <Row label="Bank" value={bankName} copyKey="bank" copied={copied} onCopy={() => copy(bankName, 'bank')} />
          <Row label="Account Name" value={accountName} copyKey="name" copied={copied} onCopy={() => copy(accountName, 'name')} />
          <Row label="Account Number" value={accountNumber} mono copyKey="num" copied={copied} onCopy={() => copy(accountNumber, 'num')} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={copyAllDetails}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            {copied === 'all' ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy All</>}
          </button>
          {paymentLink && (
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-3 py-2.5 rounded-lg text-sm font-bold shadow-lg transition"
            >
              <CreditCard className="h-4 w-4" /> Pay Now
            </a>
          )}
        </div>
        {reference && (
          <p className="text-xs text-amber-300 mt-3">💡 Use "{reference}" as reference.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-slate-900" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Bank Transfer</h2>
          <p className="text-xs text-slate-400">Fast, secure direct transfer from your bank app</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <DetailRow label="Bank Name" value={bankName} copyKey="bank" copied={copied} onCopy={() => copy(bankName, 'bank')} />
        <DetailRow label="Account Name" value={accountName} copyKey="name" copied={copied} onCopy={() => copy(accountName, 'name')} />
        <DetailRow label="Account Number" value={accountNumber} mono copyKey="num" copied={copied} onCopy={() => copy(accountNumber, 'num')} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {paymentLink && (
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 px-5 py-3 rounded-full font-bold shadow-lg transition"
          >
            <CreditCard className="h-5 w-5" /> 💳 Pay via Bank App
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <button
          onClick={copyAllDetails}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-full font-bold backdrop-blur transition"
        >
          {copied === 'all' ? <><Check className="h-5 w-5" /> All Details Copied!</> : <><Copy className="h-5 w-5" /> 📋 Copy All Details</>}
        </button>
      </div>

      {reference && (
        <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-3 text-sm">
          <p className="text-xs text-slate-400 mb-1">Reference (include in transfer)</p>
          <p className="font-mono font-bold text-amber-300">{reference}</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono, copyKey, copied, onCopy }: {
  label: string; value: string; mono?: boolean; copyKey: string;
  copied: string | null; onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className={`font-semibold truncate ${mono ? 'font-mono tracking-wider' : ''}`}>{value}</div>
      </div>
      <button onClick={onCopy} className="text-amber-400 hover:text-amber-300 p-1.5 flex-shrink-0">
        {copied === copyKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Row({ label, value, mono, copyKey, copied, onCopy }: {
  label: string; value: string; mono?: boolean; copyKey: string;
  copied: string | null; onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
      <div className="min-w-0 flex-1">
        <span className="text-slate-400 text-xs">{label}:</span>{' '}
        <span className={`font-semibold ${mono ? 'font-mono' : ''}`}>{value}</span>
      </div>
      <button onClick={onCopy} className="text-amber-400 hover:text-amber-300 p-1 flex-shrink-0">
        {copied === copyKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
