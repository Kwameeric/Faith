import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Video, Camera, Music2, Quote, Play, User } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function Media() {
  const { data } = useChurch();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<'all' | 'youtube' | 'tiktok' | 'instagram'>('all');
  const [active, setActive] = useState<string | null>(null);
  const [activeTestimony, setActiveTestimony] = useState<string | null>(null);

  // Auto-scroll to testimonies section if coming from home page
  useEffect(() => {
    if (searchParams.get('section') === 'testimonies') {
      setTimeout(() => {
        document.getElementById('testimonies-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [searchParams]);

  const filtered = data.media.filter(m => filter === 'all' || m.platform === filter);
  const activeItem = data.media.find(m => m.id === active);

  const icons = {
    youtube: { Icon: Video, color: 'bg-red-500', label: 'YouTube' },
    tiktok: { Icon: Music2, color: 'bg-pink-500', label: 'TikTok' },
    instagram: { Icon: Camera, color: 'bg-gradient-to-tr from-purple-500 to-pink-500', label: 'Instagram' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Church Media</h1>
        <p className="text-slate-600 mt-2">Watch sermons, clips & highlights from YouTube, TikTok & Instagram</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {(['all', 'youtube', 'tiktok', 'instagram'] as const).map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === p ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p === 'all' ? 'All' : icons[p].label}
          </button>
        ))}
      </div>

      {activeItem && (
        <div className="mb-6 bg-slate-900 rounded-2xl p-4 shadow-2xl">
          <div className="flex justify-between items-center mb-3 text-white">
            <h3 className="font-bold">{activeItem.title}</h3>
            <button onClick={() => setActive(null)} className="text-xs underline text-amber-400">Close</button>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            {activeItem.platform === 'youtube' ? (
              <iframe src={activeItem.url} className="w-full h-full" allowFullScreen />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className={`h-16 w-16 mx-auto rounded-full ${icons[activeItem.platform].color} flex items-center justify-center mb-3`}>
                    {(() => { const { Icon } = icons[activeItem.platform]; return <Icon className="h-8 w-8 text-white" />; })()}
                  </div>
                  <p>Open on {icons[activeItem.platform].label}</p>
                  <a href={activeItem.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-5 py-2 bg-amber-500 text-slate-900 font-semibold rounded-full">
                    Watch Now →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(m => {
          const { Icon, color, label } = icons[m.platform];
          return (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition text-left border border-slate-100"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-200">
                <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                <div className="absolute top-2 left-2">
                  <div className={`${color} h-7 w-7 rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center">
                    <span className="text-2xl ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-slate-500">{label}</span>
                <h3 className="font-semibold text-slate-900 mt-1 line-clamp-2">{m.title}</h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Testimonies Section */}
      <section id="testimonies-section" className="mt-16 scroll-mt-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Quote className="h-4 w-4" /> Testimonies
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What God Has Done</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">Real stories of transformation from our church family. Watch and be encouraged!</p>
        </div>

        {data.testimonies.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 rounded-3xl border border-purple-100">
            <Quote className="h-12 w-12 mx-auto text-purple-300 mb-3" />
            <p className="text-slate-500">No testimonies yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.testimonies.map(t => (
              <div
                key={t.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100 flex flex-col"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setActiveTestimony(t.id)}>
                  <video
                    src={t.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                      <Play className="h-6 w-6 text-purple-600 ml-0.5 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                      <Quote className="h-3 w-3" /> Testimony
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 mb-1">{t.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium mb-2">
                    <User className="h-3 w-3" /> {t.author}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 flex-1">{t.description}</p>
                  <button
                    onClick={() => setActiveTestimony(t.id)}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="h-4 w-4 fill-current" /> Watch Testimony
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-600 italic">
            "They triumphed over him by the blood of the Lamb and by the word of their testimony." — Revelation 12:11
          </p>
        </div>
      </section>

      {/* Testimony Video Modal */}
      {activeTestimony && (() => {
        const t = data.testimonies.find(x => x.id === activeTestimony);
        if (!t) return null;
        return (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setActiveTestimony(null)}>
            <button onClick={() => setActiveTestimony(null)} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center z-10">
              ✕
            </button>
            <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
              <video src={t.videoUrl} controls autoPlay className="w-full rounded-2xl shadow-2xl mb-4 bg-black" />
              <div className="text-white text-center">
                <h3 className="text-xl font-bold mb-1">{t.title}</h3>
                <p className="text-purple-300 text-sm mb-3">by {t.author}</p>
                <p className="text-slate-300 text-sm max-w-2xl mx-auto">{t.description}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
