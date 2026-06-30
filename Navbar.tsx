import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Church } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import CurrencySelector from './CurrencySelector';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data } = useChurch();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/livestream', label: 'Live Stream' },
    { to: '/members', label: 'Members' },
    { to: '/media', label: 'Media' },
    { to: '/give', label: 'Give' },
    { to: '/orphanage', label: 'Orphanage' },
    { to: '/building', label: 'Building' },
    { to: '/events', label: 'Events' },
    { to: '/branches', label: 'Branches' },
    { to: '/bible-school', label: 'Bible School' },
    { to: '/enroll', label: 'Enroll' },
    { to: '/partner', label: 'Partner' },
    { to: '/crusade-truck', label: 'Crusade Truck' },
    { to: '/books', label: 'Books' },
    { to: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 shadow-lg border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white group">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
              {data.logo && (data.logo.startsWith('data:image/') || data.logo.startsWith('http') || data.logo.startsWith('/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(data.logo)) ? (
                <img src={data.logo} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <Church className="h-6 w-6 text-slate-900" />
              )}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm sm:text-base tracking-wide">{data.name}</span>
              <span className="text-amber-400 text-[10px] hidden sm:block italic">{data.motto}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(l.to)
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-200 hover:text-amber-400 hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CurrencySelector />
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur">
          <nav className="flex flex-col px-4 py-2 max-h-[70vh] overflow-y-auto">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`py-3 px-2 border-b border-white/5 text-sm font-medium ${
                  isActive(l.to) ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
