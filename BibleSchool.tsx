import { useState } from 'react';
import { BookOpen, X, GraduationCap, Clock } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function BibleSchool() {
  const { data } = useChurch();
  const [active, setActive] = useState<string | null>(null);
  const activeImg = data.bibleImages.find(i => i.id === active);

  const classes = [
    { name: 'Old Testament Survey', instructor: 'Pastor James', level: 'Beginner' },
    { name: 'New Testament Survey', instructor: 'Pastor Samuel', level: 'Beginner' },
    { name: 'Systematic Theology', instructor: 'Dr. Rebecca', level: 'Advanced' },
    { name: 'Christian Living', instructor: 'Pastor Mary', level: 'All Levels' },
    { name: 'Evangelism & Missions', instructor: 'Pastor Daniel', level: 'Intermediate' },
    { name: 'Biblical Hebrew & Greek', instructor: 'Dr. Peter', level: 'Advanced' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
          <GraduationCap className="h-4 w-4" /> Grace Bible School
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Bible School</h1>
        <p className="text-slate-600 mt-3 max-w-3xl mx-auto">{data.bibleSchoolDescription}</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-10 shadow-xl">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <BookOpen className="h-8 w-8 mx-auto text-amber-400 mb-2" />
            <p className="font-bold">{data.bibleImages.length * 50}+</p>
            <p className="text-xs text-slate-400">Graduates</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <GraduationCap className="h-8 w-8 mx-auto text-amber-400 mb-2" />
            <p className="font-bold">{classes.length}</p>
            <p className="text-xs text-slate-400">Classes Offered</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <Clock className="h-8 w-8 mx-auto text-amber-400 mb-2" />
            <p className="font-bold">Saturdays 9AM-1PM</p>
            <p className="text-xs text-slate-400">Class Schedule</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-5">Our Classes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {classes.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition border border-slate-100">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">{c.level}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{c.name}</h3>
            <p className="text-sm text-slate-600">Instructor: {c.instructor}</p>
            <button className="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700">Enroll →</button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-5">Life at Bible School</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.bibleImages.map(img => (
          <button
            key={img.id}
            onClick={() => setActive(img.id)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition"
          >
            <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <p className="text-white font-medium text-sm">{img.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {activeImg && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button onClick={() => setActive(null)} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
          <img src={activeImg.src} alt={activeImg.caption} className="max-h-[85vh] max-w-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
