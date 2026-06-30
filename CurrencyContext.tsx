import { createContext, useContext, useState, ReactNode } from 'react';

export type CurrencyCode = 'GHS' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'NGN';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  // Rate relative to GHS (1 GHS = X units of this currency)
  rate: number;
  decimals: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'GHS', symbol: '₵', name: 'Ghana Cedi', flag: '🇬🇭', rate: 1, decimals: 0 },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 0.065, decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.060, decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.052, decimals: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 0.090, decimals: 2 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', rate: 100, decimals: 0 },
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatMoney: (amountGHS: number, forceCode?: CurrencyCode) => string;
  convertFromGHS: (amountGHS: number, toCode?: CurrencyCode) => number;
  getCurrencyInfo: (code: CurrencyCode) => CurrencyInfo;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('preferredCurrency');
      if (saved && CURRENCIES.find(c => c.code === saved)) {
        return saved as CurrencyCode;
      }
    } catch {}
    return 'GHS';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try { localStorage.setItem('preferredCurrency', code); } catch {}
  };

  const getCurrencyInfo = (code: CurrencyCode): CurrencyInfo => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  };

  const convertFromGHS = (amountGHS: number, toCode?: CurrencyCode): number => {
    const targetCode = toCode || currency;
    const info = getCurrencyInfo(targetCode);
    return amountGHS * info.rate;
  };

  const formatMoney = (amountGHS: number, forceCode?: CurrencyCode): string => {
    const targetCode = forceCode || currency;
    const info = getCurrencyInfo(targetCode);
    const converted = amountGHS * info.rate;
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals,
    });
    return `${info.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatMoney,
      convertFromGHS,
      getCurrencyInfo,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
