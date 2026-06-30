import { useState } from 'react';
import { GraduationCap, CheckCircle2, BookOpen, Users, Clock } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function Enroll() {
  const { data, submitBibleEnrollment } = useChurch();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    age: '',
    education: '',
    motivation: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;
    submitBibleEnrollment(form);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 shadow-xl border border-indigo-100">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Enrollment Received!</h1>
          <p className="text-lg text-slate-700 mb-6">
            Welcome to <span className="font-semibold text-indigo-700">{data.bibleSchoolName}</span>, <span className="font-semibold text-indigo-700">{form.fullName}</span>!
          </p>
          <div className="bg-white rounded-2xl p-5 shadow text-left mb-6">
            <p className="text-sm text-slate-600 mb-2">✅ Your application has been received.</p>
            <p className="text-sm text-slate-600 mb-2">📧 We'll contact you at <span className="font-semibold">{form.email}</span> with next steps.</p>
            <p className="text-sm text-slate-600">📚 Classes begin soon — get your Bible ready!</p>
          </div>
          <blockquote className="italic text-slate-700 border-l-4 border-indigo-500 pl-4 text-left bg-white/60 rounded-r-lg p-4 mb-6">
            "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
            <footer className="text-xs text-indigo-700 font-semibold mt-1">— 2 Timothy 2:15</footer>
          </blockquote>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', country: '', age: '', education: '', motivation: '' }); }}
            className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium"
          >
            Register another student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={data.bibleSchoolImage} alt={data.bibleSchoolName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-indigo-950/70 to-indigo-950" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-24 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-sm mb-4">
            <GraduationCap className="h-4 w-4" /> Enroll Now
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg">{data.bibleSchoolName}</h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto">
            Equip yourself with the Word of God. Join our Bible School and grow deeper in faith.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 text-center">
            <BookOpen className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
            <p className="font-bold text-slate-900">Deep Biblical Knowledge</p>
            <p className="text-xs text-slate-600 mt-1">Old & New Testament studies</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 text-center">
            <Users className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
            <p className="font-bold text-slate-900">Experienced Teachers</p>
            <p className="text-xs text-slate-600 mt-1">Learn from seasoned ministers</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 text-center">
            <Clock className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
            <p className="font-bold text-slate-900">Flexible Schedule</p>
            <p className="text-xs text-slate-600 mt-1">Online & in-person options</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">About {data.bibleSchoolName}</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{data.bibleSchoolDescription}</p>
        </div>
      </section>

      {/* Enrollment Form */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-indigo-600" /> Enrollment Form
            </h2>
            <p className="text-slate-600 mb-6">Fill out the form below to register for {data.bibleSchoolName}.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Full Name *</label>
                <input
                  required
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+233 24 123 4567"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Country</label>
                  <input
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    placeholder="e.g., Ghana"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    placeholder="e.g., 25"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Education Level</label>
                <select
                  value={form.education}
                  onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="">Select your education level</option>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Why do you want to join this Bible School? *</label>
                <textarea
                  required
                  value={form.motivation}
                  onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                  placeholder="Tell us about your spiritual goals and what you hope to gain..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <GraduationCap className="h-5 w-5" /> Submit Enrollment
              </button>

              <p className="text-xs text-center text-slate-500">📚 Your application will be reviewed and we'll contact you soon.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
