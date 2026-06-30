import { Link } from 'react-router-dom';
import { Play, Radio, Heart, Users, Calendar, MapPin, BookOpen, HandHeart, Church, ShoppingCart, Award, Quote, Handshake, Truck, HardHat, Home as HomeIcon, GraduationCap } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Home() {
  const { data } = useChurch();
  const { formatMoney } = useCurrency();

  const features = [
    { to: '/livestream', icon: Radio, title: 'Live Stream', desc: 'Watch our services live anywhere in the world', color: 'from-red-500 to-pink-600' },
    { to: '/members', icon: Users, title: 'Members', desc: 'Connect with the church family', color: 'from-blue-500 to-indigo-600' },
    { to: '/give', icon: Heart, title: 'Give', desc: 'Offerings, tithes & donations', color: 'from-amber-500 to-orange-600' },
    { to: '/events', icon: Calendar, title: 'Events', desc: 'Upcoming services & events', color: 'from-emerald-500 to-teal-600' },
    { to: '/branches', icon: MapPin, title: 'Branches', desc: 'Find a branch near you', color: 'from-purple-500 to-violet-600' },
    { to: '/bible-school', icon: BookOpen, title: 'Bible School', desc: 'Grow in the Word', color: 'from-cyan-500 to-blue-600' },
    { to: '/orphanage', icon: HandHeart, title: 'Orphanage', desc: `${data.orphanageName.split(' ')[0]} children's home`, color: 'from-pink-500 to-rose-600' },
    { to: '/building', icon: Church, title: 'Building Project', desc: 'Our new sanctuary', color: 'from-slate-600 to-slate-800' },
  ];

  return (
    <div>
      {/* Hero Video Section */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-slate-900">
        <video
          key={data.heroVideoUrl}
          src={data.heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            Welcome Home
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">{data.name}</h1>
          <p className="text-lg sm:text-2xl italic text-amber-300 mb-8">"{data.motto}"</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link to="/livestream" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-full transition shadow-xl">
              <Play className="h-5 w-5 fill-current" /> Watch Now
            </Link>
            <Link to="/give" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-full transition backdrop-blur">
              <Heart className="h-5 w-5" /> Give
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Explore Our Church</h2>
          <p className="text-slate-600 mt-3">Everything you need, in one place</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <Link
              key={f.to}
              to={f.to}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition border border-slate-100 hover:-translate-y-1"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* About the Pastor */}
      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-10 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
              Meet Our Shepherd
            </div>
            <h2 className="text-3xl font-bold mb-3">{data.pastorName}</h2>
            <p className="text-slate-300 leading-relaxed">{data.pastorBio}</p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
              <blockquote className="text-xl italic text-amber-200 mb-4">
                "For where two or three gather in my name, there am I with them."
              </blockquote>
              <p className="text-slate-400 text-sm">— Matthew 18:20</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
              <Award className="h-4 w-4" /> Meet The Founder
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{data.founder.name}</h2>
            <p className="text-amber-700 font-semibold mt-1">{data.founder.title}</p>
          </div>

          <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl blur-sm opacity-30" />
                <img
                  src={data.founder.image}
                  alt={data.founder.name}
                  className="relative w-64 h-80 object-cover rounded-2xl shadow-2xl ring-4 ring-white"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                  {data.founder.yearsInMinistry}+ Years in Ministry
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-amber-100">
                <Quote className="h-10 w-10 text-amber-400 mb-3" />
                <p className="text-lg italic text-slate-700 leading-relaxed mb-4">
                  "{data.founder.quote}"
                </p>
                <p className="text-amber-700 font-semibold">{data.founder.signature}</p>
              </div>

              <p className="text-slate-700 leading-relaxed mt-6">{data.founder.bio}</p>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white rounded-xl p-4 text-center shadow border border-slate-100">
                  <p className="text-2xl font-bold text-amber-600">{data.founder.yearsInMinistry}+</p>
                  <p className="text-xs text-slate-600">Years in Ministry</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow border border-slate-100">
                  <p className="text-2xl font-bold text-amber-600">{data.branches.length}</p>
                  <p className="text-xs text-slate-600">Branches Planted</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow border border-slate-100">
                  <p className="text-2xl font-bold text-amber-600">{data.books.length}</p>
                  <p className="text-xs text-slate-600">Books Published</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bible School Promo — Single Featured Image */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
              <GraduationCap className="h-4 w-4" /> Enroll Now
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{data.bibleSchoolName}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{data.bibleSchoolDescription.split(' ').slice(0, 20).join(' ')}...</p>
          </div>

          {/* Single Featured Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group">
            <img
              src={data.bibleSchoolImage}
              alt={data.bibleSchoolName}
              className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
              <div className="inline-flex items-center gap-2 bg-amber-500/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <GraduationCap className="h-3.5 w-3.5" /> {data.bibleSchoolName}
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold mb-2 drop-shadow-lg">Equipping Believers for Kingdom Impact</h3>
              <p className="text-slate-200 max-w-2xl text-sm sm:text-base">Join a legacy of faith — grow deeper in the Word, stand stronger in your calling.</p>
            </div>
          </div>

          {/* Stats + Enroll Button */}
          <div className="grid sm:grid-cols-[1fr_auto] gap-5 items-center">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow border border-slate-100">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">6+</p>
                <p className="text-xs text-slate-600 mt-1">Courses</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow border border-slate-100">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">500+</p>
                <p className="text-xs text-slate-600 mt-1">Graduates</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow border border-slate-100">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">30+</p>
                <p className="text-xs text-slate-600 mt-1">Years</p>
              </div>
            </div>
            <Link
              to="/enroll"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold px-8 py-4 rounded-full shadow-xl transition text-base"
            >
              <GraduationCap className="h-5 w-5" /> Enroll Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Orphanage Home Promo */}
      <section className="py-20 bg-gradient-to-br from-pink-950 via-rose-950 to-pink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={data.orphanageHomeImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-950/95 via-rose-950/90 to-pink-950/95" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-pink-400/20">
                <img src={data.orphanageHomeImage} alt={data.orphanageName} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-bold text-lg drop-shadow">{data.orphanageName}</p>
                  <p className="text-xs text-pink-300">A home of love for every child</p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-pink-400/20 border border-pink-400/40 text-pink-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <HandHeart className="h-4 w-4" /> Support a Child
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.orphanageName}</h2>
              <p className="text-slate-200 leading-relaxed mb-6 line-clamp-4">
                {data.orphanageDescription}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur">
                  <p className="text-2xl font-bold text-pink-300">45+</p>
                  <p className="text-xs text-slate-300">Children</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur">
                  <p className="text-2xl font-bold text-pink-300">15+</p>
                  <p className="text-xs text-slate-300">Sponsors</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur">
                  <p className="text-2xl font-bold text-pink-300">100%</p>
                  <p className="text-xs text-slate-300">Loved</p>
                </div>
              </div>
              <Link
                to="/orphanage"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold px-6 py-3 rounded-full shadow-2xl transition"
              >
                <Heart className="h-5 w-5 fill-current" /> Support a Child →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Home Photo Gallery */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-medium mb-3">
              📸 Church Gallery
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Moments from Our Family</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">A glimpse into the life, worship, and love at {data.name}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {data.homeGallery.map((img, i) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 ${
                  i % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-white font-semibold text-sm sm:text-base drop-shadow">{img.caption}</p>
                </div>
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {data.homeGallery.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p>No gallery images yet. Upload some from the Admin dashboard!</p>
            </div>
          )}

          {/* Testimonies Button */}
          <div className="text-center mt-10">
            <p className="text-slate-400 text-sm mb-4">Want to hear what God is doing in people's lives?</p>
            <Link
              to="/media?section=testimonies"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-8 py-4 rounded-full shadow-2xl transition group"
            >
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                <svg className="h-5 w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-base font-bold">Watch Testimonies</div>
                <div className="text-xs text-purple-200">{data.testimonies.length} powerful stories</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-3 py-1 rounded-full text-xs font-medium mb-3">
              <ShoppingCart className="h-4 w-4" /> Book Store
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Books by {data.founder.name.split(' ').slice(0, 2).join(' ')}</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">Life-changing teachings now available in print. Each book carries a mantle of wisdom for your season.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {data.books.map(book => (
              <div key={book.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-slate-100 flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 shadow-inner"
                  />
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                      {book.currency || '₵'}{book.price}
                    </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{book.title}</h3>
                  <p className="text-xs text-amber-700 font-medium mb-2">by {book.author}</p>
                  <p className="text-sm text-slate-600 line-clamp-3 flex-1">{book.description}</p>
                  <Link
                    to={`/books?book=${book.id}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-amber-500 hover:to-amber-600 hover:text-slate-900 text-white font-semibold rounded-xl transition"
                  >
                    <ShoppingCart className="h-4 w-4" /> Buy Now · {book.currency || '₵'}{book.price}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-slate-600">📦 Free shipping on orders over {formatMoney(500)} · 💳 Secure payment · 🌍 Worldwide delivery</p>
          </div>
        </div>
      </section>

      {/* Crusade Truck Fundraiser — Cheerful Giver */}
      <section className="py-16 bg-gradient-to-br from-red-950 via-slate-900 to-red-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #f59e0b 0%, transparent 60%)' }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_360px] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
                🚛 Cheerful Giver Fundraiser
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Be a Cheerful Giver — Support the Crusade Truck</h2>
              <p className="text-slate-300 leading-relaxed mb-5">
                Help us take the gospel to the unreached! Your seed will fund a fully-equipped evangelism truck with a raised stage, sound system, and lighting — reaching thousands in towns and villages for Christ.
              </p>

              {/* Progress */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Progress to Goal</span>
                  <span className="text-amber-400 font-bold">
                    {formatMoney(data.crusadeTruckRaised)} / {formatMoney(data.crusadeTruckGoal)}
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full"
                    style={{ width: `${Math.min((data.crusadeTruckRaised / data.crusadeTruckGoal) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {data.crusadeDonations.length} cheerful givers have partnered so far 🙏
                </p>
              </div>

              <blockquote className="italic text-amber-200 text-sm border-l-4 border-amber-500 pl-4 mb-5">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                <footer className="text-xs text-amber-300 font-semibold mt-1">— 2 Corinthians 9:7</footer>
              </blockquote>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-amber-500/30">
                <img src={data.crusadeTruckImage} alt="Crusade Truck" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-500 text-slate-900 px-2 py-1 rounded-full text-xs font-bold shadow">
                  <Truck className="h-3 w-3" /> Live Campaign
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">The Crusade Truck</p>
                  <p className="text-amber-300 text-xs">Mobile Evangelism</p>
                </div>
              </div>

              <Link
                to="/crusade-truck"
                className="mt-5 inline-flex items-center gap-2 w-full max-w-[320px] justify-center py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-full text-base shadow-2xl transition"
              >
                <Heart className="h-5 w-5 fill-current" /> Donate Now
              </Link>
              <p className="text-xs text-slate-400 mt-2 text-center">Every seed counts — be a cheerful giver today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Building Auditorium Fundraiser */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #3b82f6 0%, transparent 60%)' }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[360px_1fr] gap-8 items-center">
            <div className="flex flex-col items-center order-2 md:order-1">
              <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-blue-400/30">
                <img src={data.buildingAuditoriumImage} alt="Building Auditorium" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                  <HomeIcon className="h-3 w-3" /> Live Campaign
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">The Auditorium</p>
                  <p className="text-blue-300 text-xs">2,000-Seat Sanctuary</p>
                </div>
              </div>

              <Link
                to="/building"
                className="mt-5 inline-flex items-center gap-2 w-full max-w-[320px] justify-center py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-full text-base shadow-2xl transition"
              >
                <HardHat className="h-5 w-5" /> Donate Now
              </Link>
              <p className="text-xs text-slate-400 mt-2 text-center">Lay a brick — leave a legacy</p>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
                🏗️ Building The House of God
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Help Us Build the Auditorium</h2>
              <p className="text-slate-300 leading-relaxed mb-5">
                A 2,000-seat sanctuary with prayer tower, children's wing, and community hall — a permanent house of worship for generations to come. Your seed lays a brick in God's house.
              </p>

              {/* Progress */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Progress to Goal</span>
                  <span className="text-blue-400 font-bold">
                    {formatMoney(data.buildingAuditoriumRaised)} / {formatMoney(data.buildingAuditoriumGoal)}
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min((data.buildingAuditoriumRaised / data.buildingAuditoriumGoal) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {data.buildingDonations.length} builders have partnered so far 🏗️
                </p>
              </div>

              <blockquote className="italic text-blue-200 text-sm border-l-4 border-blue-500 pl-4">
                "Unless the LORD builds the house, the builders labor in vain."
                <footer className="text-xs text-blue-300 font-semibold mt-1">— Psalm 127:1</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white p-8 sm:p-12 shadow-2xl">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3">
                <Handshake className="h-4 w-4" /> Partner With Us
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Want to stand with us in faith?</h2>
              <p className="text-amber-50">
                Whether by prayer, giving, serving, or spreading the gospel — there's a place for you in this family.
              </p>
            </div>
            <Link
              to="/partner"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-7 py-4 rounded-full transition shadow-xl whitespace-nowrap"
            >
              Become a Partner →
            </Link>
          </div>
        </div>
      </section>

      {/* Verse of the day */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">A Word for You Today</h2>
        <p className="text-xl text-slate-700 italic leading-relaxed">
          "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another."
        </p>
        <p className="text-amber-600 font-semibold mt-4">— Hebrews 10:24-25</p>
      </section>
    </div>
  );
}
