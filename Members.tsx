import { useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function Members() {
  const { data } = useChurch();
  const [query, setQuery] = useState('');

  const filtered = data.members.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Church Members</h1>
        <p className="text-slate-600 mt-2">Meet the family of {data.name} — {data.members.length} registered members</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search members by name or role..."
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <img src={m.photo} alt={m.name} className="h-14 w-14 rounded-full object-cover ring-4 ring-amber-100" />
              <div>
                <h3 className="font-bold text-slate-900">{m.name}</h3>
                <p className="text-xs text-amber-600 font-medium">{m.role}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {m.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {m.phone}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Joined {new Date(m.joinedDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">No members found.</div>
      )}
    </div>
  );
}
