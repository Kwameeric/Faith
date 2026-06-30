import { useState } from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function Events() {
  const { data } = useChurch();
  const [tab, setTab] = useState<'all' | 'service' | 'event'>('all');

  const filtered = data.events.filter(e => tab === 'all' || e.type === tab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Events & Services</h1>
        <p className="text-slate-600 mt-2">Join us in worship, fellowship, and service</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'service', 'event'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All' : t === 'service' ? 'Services' : 'Events'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map(e => (
          <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 flex flex-col">
            <div className="relative aspect-video overflow-hidden">
              <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  e.type === 'service' ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-slate-900'
                }`}>
                  <Tag className="h-3 w-3" /> {e.type === 'service' ? 'Service' : 'Event'}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{e.title}</h3>
              <p className="text-sm text-slate-600 flex-1 mb-4">{e.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4 text-amber-600" /> {new Date(e.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-amber-600" /> {e.time}</span>
              </div>
              <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition">
                Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
