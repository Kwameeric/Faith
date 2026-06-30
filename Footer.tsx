import { Link } from 'react-router-dom';
import { Church, Phone, Mail, MapPin } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function Footer() {
  const { data } = useChurch();
  return (
    <footer className="bg-slate-950 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              {data.logo && (data.logo.startsWith('data:image/') || data.logo.startsWith('http') || data.logo.startsWith('/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(data.logo)) ? (
                <img src={data.logo} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <Church className="h-6 w-6 text-slate-900" />
              )}
            </div>
            <h3 className="text-white font-bold text-lg">{data.name}</h3>
          </div>
          <p className="text-sm italic text-amber-400 mb-3">{data.motto}</p>
          <p className="text-sm text-slate-400">A place where faith grows and lives are transformed.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/events" className="hover:text-amber-400">Events & Services</Link></li>
            <li><Link to="/livestream" className="hover:text-amber-400">Live Stream</Link></li>
            <li><Link to="/give" className="hover:text-amber-400">Give</Link></li>
            <li><Link to="/branches" className="hover:text-amber-400">Branches</Link></li>
            <li><Link to="/bible-school" className="hover:text-amber-400">Bible School</Link></li>
            <li><Link to="/partner" className="hover:text-amber-400">Partner With Us</Link></li>
            <li><Link to="/crusade-truck" className="hover:text-amber-400">Crusade Truck</Link></li>
            <li><Link to="/books" className="hover:text-amber-400">Book Store</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Ministries</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/orphanage" className="hover:text-amber-400">Orphanage</Link></li>
            <li><Link to="/building" className="hover:text-amber-400">Building Project</Link></li>
            <li><Link to="/media" className="hover:text-amber-400">Media</Link></li>
            <li><Link to="/members" className="hover:text-amber-400">Members</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-amber-400" /> {data.contactAddress}</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-amber-400" /> {data.contactPhone}</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-amber-400" /> {data.contactEmail}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {data.name}. All rights reserved. Built with faith ❤️
      </div>
    </footer>
  );
}
