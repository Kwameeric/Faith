import { useState, useEffect } from 'react';
import { Radio, Clock, Users, UserPlus, Bell, BellRing, CheckCircle2, ShieldCheck, Send, Video, MessageCircle, Globe } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import MoMoSection from '../components/MoMoSection';
import BankTransferSection from '../components/BankTransferSection';
import StreamEmbed from '../components/StreamEmbed';
import StreamViewer from '../components/StreamViewer';
import NotificationComposer from '../components/NotificationComposer';

// Global auto-generated comments from viewers worldwide
const AUTO_COMMENTS = [
  { name: 'Sarah M.', flag: '🇺🇸', text: 'Apostle God bless you so much! 🙏' },
  { name: 'David O.', flag: '🇳🇬', text: 'Streaming from Lagos, Nigeria. God is good!' },
  { name: 'Grace K.', flag: '🇬🇭', text: 'I have sent my offering of ₵100. God bless the ministry!' },
  { name: 'Peter A.', flag: '🇬🇧', text: 'Watching from London. The Holy Spirit is moving! 🔥' },
  { name: 'Mary J.', flag: '🇨🇦', text: 'Hallelujah! God is doing a new thing!' },
  { name: 'James T.', flag: '🇿🇦', text: 'Apostle we love you. Praying from South Africa!' },
  { name: 'Ruth N.', flag: '🇰🇪', text: 'Just sowed my seed of $50. God multiply it!' },
  { name: 'John B.', flag: '🇦🇺', text: 'Greetings from Australia. The word is powerful!' },
  { name: 'Esther W.', flag: '🇺🇬', text: 'God bless you Apostle. My family is healed! 🙌' },
  { name: 'Michael S.', flag: '🇩🇪', text: 'Watching from Germany. The anointing is real!' },
  { name: 'Rebecca D.', flag: '🇫🇷', text: 'Praise the Lord! What a blessed service!' },
  { name: 'Samuel A.', flag: '🇮🇳', text: 'Apostle pray for my business please 🙏' },
  { name: 'Hannah P.', flag: '🇧🇷', text: 'Deus é bom! God is good! 🇧🇷' },
  { name: 'Daniel M.', flag: '🇵🇭', text: 'Greetings from the Philippines! Amen!' },
  { name: 'Mercy O.', flag: '🇬🇭', text: 'I received my testimony today! God is faithful!' },
  { name: 'Abraham K.', flag: '🇳🇬', text: 'My seed of ₵500 is planted. I decree increase!' },
  { name: 'Lydia F.', flag: '🇺🇸', text: 'This stream is touching lives globally! 🔥' },
  { name: 'Joshua L.', flag: '🇯🇲', text: 'Jah bless! Preaching the pure word!' },
  { name: 'Naomi E.', flag: '🇨🇲', text: 'Cameroon is watching. Glory to God!' },
  { name: 'Paul C.', flag: '🇮🇹', text: 'Apostle the grace upon you is amazing!' },
  { name: 'Deborah A.', flag: '🇬🇭', text: 'My offering is sent. God bless me abundantly!' },
  { name: 'Caleb N.', flag: '🇳🇬', text: 'This is my first time watching. I am blessed!' },
  { name: 'Priscilla R.', flag: '🇸🇬', text: 'Singapore says Amen! God bless you 🙏' },
  { name: 'Timothy O.', flag: '🇬🇭', text: 'Apostle I have been healed! Testimony time!' },
  { name: 'Rachel G.', flag: '🇺🇸', text: 'The worship is so powerful! I can feel God!' },
];

export default function LiveStream() {
  const { data, joinOnlineMember, subscribeToNotifications, submitLiveOffering } = useChurch();
  const [chat, setChat] = useState<{ name: string; text: string; time: number; flag?: string; isReal?: boolean }[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'watch' | 'notify'>('watch');

  // Auto-generate global comments ONLY when live stream is active
  useEffect(() => {
    if (!data.isLive) {
      // Stream is OFF - clear all comments
      setChat([]);
      return;
    }

    // Stream is ON - show welcome comments from regular viewers
    setChat([
      { name: 'Sarah M.', flag: '🇺🇸', text: 'Hallelujah! I\'ve been waiting for this! God bless you all! 🙏', time: Date.now(), isReal: false },
      { name: 'David O.', flag: '🇳🇬', text: 'Praise God! I can finally join from Lagos! The anointing is real!', time: Date.now() + 800, isReal: false },
      { name: 'Grace K.', flag: '🇬🇭', text: 'Welcome everyone! My family is watching together. God bless this ministry!', time: Date.now() + 1800, isReal: false },
    ]);

    // Start generating comments every 3-7 seconds
    const interval = setInterval(() => {
      const randomComment = AUTO_COMMENTS[Math.floor(Math.random() * AUTO_COMMENTS.length)];
      setChat(prev => [...prev, {
        ...randomComment,
        time: Date.now(),
        isReal: false,
      }].slice(-50)); // Keep last 50 comments
    }, 3500 + Math.random() * 3500);

    // Cleanup when stream stops
    return () => {
      clearInterval(interval);
    };
  }, [data.isLive]);

  // Online Member form
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinForm, setJoinForm] = useState({ fullName: '', email: '', phone: '', country: '' });
  const [joined, setJoined] = useState(false);

  // Notification subscription
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notifyForm, setNotifyForm] = useState({ fullName: '', email: '', phone: '', country: '' });
  const [subscribed, setSubscribed] = useState(false);
  const [permStatus, setPermStatus] = useState<'idle' | 'granted' | 'denied'>('idle');

  // MoMo Offering
  const [offeringForm, setOfferingForm] = useState({ fullName: '', amount: 0, reference: '', message: '' });
  const [offeringSubmitted, setOfferingSubmitted] = useState(false);

  const alreadyMember = data.onlineMembers.some(m => m.email === joinForm.email);
  const alreadySubscribed = data.notifySubscribers.some(s => s.email === notifyForm.email);

  const send = () => {
    if (!text.trim() || !name.trim()) return;
    setChat(c => [...c, { name: name.trim(), text: text.trim(), time: Date.now() }]);
    setText('');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.fullName || !joinForm.email) return;
    joinOnlineMember(joinForm);
    setJoined(true);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyForm.fullName || !notifyForm.email) return;
    const granted = await subscribeToNotifications(notifyForm);
    setPermStatus(granted ? 'granted' : 'denied');
    setSubscribed(true);
  };

  const handleOffering = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringForm.fullName || !offeringForm.amount) return;
    submitLiveOffering(offeringForm);
    setOfferingSubmitted(true);
    setOfferingForm({ fullName: '', amount: 0, reference: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            <span className={`h-2 w-2 rounded-full ${data.isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
            {data.isLive ? 'LIVE NOW' : 'OFFLINE'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Live Stream Service</h1>
          <p className="text-slate-600 mt-2">Join us from anywhere in the world. Worship with us in real time.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-sm">
          <Users className="h-4 w-4 text-slate-600" />
          <span className="font-semibold text-slate-700">{data.onlineMembers.length}</span>
          <span className="text-slate-500">online members</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('watch')}
          className={`flex-1 px-4 py-2.5 font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'watch'
              ? 'bg-white text-red-600 shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="h-4 w-4" /> Watch Stream
        </button>
        <button
          onClick={() => setActiveTab('notify')}
          className={`flex-1 px-4 py-2.5 font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'notify'
              ? 'bg-white text-blue-600 shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="h-4 w-4" /> Notify Members
        </button>
      </div>

      {/* Stream Video */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl mb-6">
        {data.streamPlatform === 'local' ? (
          <StreamViewer peerId={data.broadcastPeerId} />
        ) : (
          <StreamEmbed url={data.streamUrl || data.livestreamUrl} platform={data.streamPlatform} autoPlay={data.isLive} />
        )}
      </div>

      {/* Global Live Chat - Colorful */}
      <div className="mb-6 rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-300" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 25%, #ede9fe 50%, #dbeafe 75%, #d1fae5 100%)' }}>
        <div className={`p-4 flex items-center justify-between ${data.isLive ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600' : 'bg-gradient-to-r from-slate-600 to-slate-700'}`}>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" /> Global Live Chat
          </h3>
          <div className="flex items-center gap-3 text-white text-sm">
            {data.isLive ? (
              <>
                <span className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full font-bold">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                  🌍 {chat.length} messages
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1 bg-slate-500 px-2 py-1 rounded-full text-xs">
                ⚫ Offline
              </span>
            )}
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-2 bg-white/40 backdrop-blur-sm relative">
          {chat.length === 0 && (
            <div className="text-center py-12">
              {data.isLive ? (
                <>
                  <div className="h-12 w-12 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">Connecting to viewers worldwide... 🌍</p>
                  <p className="text-xs text-slate-500 mt-1">Chat is live! Join the conversation 👇</p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center mb-3">
                    <span className="h-3 w-3 rounded-full bg-slate-400" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">Stream is Offline</p>
                  <p className="text-xs text-slate-500 mt-1">Chat activates when live stream starts</p>
                  <p className="text-xs text-slate-500 mt-1">You can still leave comments below 👇</p>
                </>
              )}
            </div>
          )}

          {!data.isLive && chat.length > 0 && (
            <div className="sticky top-0 z-10 bg-amber-100 border border-amber-300 text-amber-800 text-xs px-3 py-1.5 rounded-lg mb-2 flex items-center gap-1.5">
              <span>⚫</span> Stream is offline. Your comments are preserved.
            </div>
          )}
          {chat.map((m, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2 rounded-lg transition hover:bg-white/60"
            >
              <div className="flex-shrink-0 text-xl">{m.flag || '👤'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-purple-700">
                    {m.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 break-words">
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white/80 backdrop-blur border-t border-amber-200">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-28 px-2 py-2 text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white/90"
            />
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type your message... (Real viewer comments appear highlighted)"
              className="flex-1 px-3 py-2 text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white/90"
            />
            <button
              onClick={send}
              disabled={!name.trim() || !text.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 text-center">
            🌍 Your message will appear highlighted in gold. Viewers worldwide are chatting!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center"><Radio className="h-5 w-5 text-red-600" /></div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <p className="font-semibold text-sm">{data.isLive ? 'Broadcasting' : 'Offline'}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-600" /></div>
          <div>
            <p className="text-xs text-slate-500">Service</p>
            <p className="font-semibold text-sm">Sundays 9AM</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center"><BellRing className="h-5 w-5 text-amber-600" /></div>
          <div>
            <p className="text-xs text-slate-500">Subscribers</p>
            <p className="font-semibold text-sm">{data.notifySubscribers.length} notified</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Join as Online Member */}
            {!joined && !alreadyMember ? (
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Become an Online Member</h3>
                </div>
                <p className="text-sm text-indigo-100 mb-4">
                  Join our online community. Get connected, receive updates, and be part of the family from anywhere in the world.
                </p>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition"
                >
                  Join Now →
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">Welcome, Member!</h3>
                </div>
                <p className="text-sm text-emerald-50">
                  You're now registered as an online member of {data.name}. God bless you!
                </p>
                <p className="text-xs text-emerald-100 mt-3">
                  {alreadyMember
                    ? `Connected as: ${data.onlineMembers.find(m => m.email === (alreadyMember ? joinForm.email : ''))?.email || joinForm.email}`
                    : `Joined as: ${joinForm.email}`}
                </p>
              </div>
            )}

            {/* Notify Me When Live */}
            {!subscribed && !alreadySubscribed ? (
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Notify Me When Live</h3>
                </div>
                <p className="text-sm text-amber-50 mb-4">
                  Never miss a service! Get instant notifications when we go live.
                </p>
                <button
                  onClick={() => setShowNotifyForm(true)}
                  className="w-full py-3 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition"
                >
                  🔔 Subscribe to Alerts
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">You're Subscribed!</h3>
                </div>
                <p className="text-sm text-purple-50">
                  {permStatus === 'granted'
                    ? 'Browser notifications are ON. You\'ll be alerted when we go live.'
                    : 'You\'re on our list! We\'ll reach you via email when we go live.'}
                </p>
                <p className="text-xs text-purple-100 mt-3">
                  {alreadySubscribed ? '✓ Registered' : `Subscribed: ${notifyForm.email}`}
                </p>
              </div>
            )}
          </div>

      {/* Join Online Member Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowJoinForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-600" /> Join as Online Member
            </h3>
            <p className="text-sm text-slate-600 mb-5">Fill in your details to become part of our online family.</p>
            <form onSubmit={handleJoin} className="space-y-3">
              <input required value={joinForm.fullName} onChange={e => setJoinForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Full Name *" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input required type="email" value={joinForm.email} onChange={e => setJoinForm(f => ({ ...f, email: e.target.value }))} placeholder="Email *" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input value={joinForm.phone} onChange={e => setJoinForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone (optional)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input value={joinForm.country} onChange={e => setJoinForm(f => ({ ...f, country: e.target.value }))} placeholder="Country (optional)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowJoinForm(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">Join</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Composer */}
      {activeTab === 'notify' && (
        <section className="mt-8">
          <NotificationComposer />
        </section>
      )}

      {/* MoMo Live Stream Offering Section */}
      <section className="mt-8">
        <MoMoSection
          number={data.momoNumber}
          name={data.momoName}
          network={data.momoNetwork}
          title="Support the Live Stream via MoMo"
          description="Your offering helps us keep the gospel streaming to the nations. Tap below to send your seed directly."
          instructions="💡 Steps: Tap 'Send via MoMo' → Dialer opens → Call ends → Open MoMo app → Send Money → Enter amount → Use your name as reference → Confirm PIN."
        />
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Left: Bank Transfer */}
          <BankTransferSection
            variant="compact"
            bankName={data.bankName}
            accountName={data.accountName}
            accountNumber={data.accountNumber}
            paymentLink={data.paymentLink}
            reference="LIVE STREAM"
          />

          <div>
          {/* Right: Offering Confirmation Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl">
            {!offeringSubmitted ? (
              <>
                <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-600" /> Log Your Offering
                </h3>
                <p className="text-xs text-slate-600 mb-4">After sending via MoMo, optionally confirm your gift here so we can pray for you.</p>
                <form onSubmit={handleOffering} className="space-y-3">
                  <input
                    required
                    value={offeringForm.fullName}
                    onChange={e => setOfferingForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Your Full Name *"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={offeringForm.amount || ''}
                      onChange={e => setOfferingForm(f => ({ ...f, amount: Number(e.target.value) }))}
                      placeholder="Amount *"
                      className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                    <input
                      value={offeringForm.reference}
                      onChange={e => setOfferingForm(f => ({ ...f, reference: e.target.value }))}
                      placeholder="Transaction ID"
                      className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>
                  <textarea
                    value={offeringForm.message}
                    onChange={e => setOfferingForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Prayer request or testimony (optional)"
                    rows={2}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" /> Submit Offering
                  </button>
                  <p className="text-[11px] text-center text-slate-500">This form is optional — your offering is counted in heaven regardless.</p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Your offering has been received. God bless the work of your hands and multiply your seed!
                </p>
                <blockquote className="italic text-sm text-slate-700 bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-left">
                  "Give, and it will be given to you. A good measure, pressed down, shaken together and running over..."
                  <footer className="text-xs text-emerald-700 font-semibold mt-1">— Luke 6:38</footer>
                </blockquote>
                <button
                  onClick={() => setOfferingSubmitted(false)}
                  className="mt-5 text-sm text-emerald-700 hover:text-emerald-900 font-medium underline"
                >
                  Submit another offering
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </section>

      {/* Notify Me Modal */}
      {showNotifyForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowNotifyForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-amber-600" /> Get Live Notifications
            </h3>
            <p className="text-sm text-slate-600 mb-4">We'll send you a browser notification whenever we go live. You'll also be added to our members list.</p>
            {typeof Notification !== 'undefined' && Notification.permission === 'denied' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                ⚠️ Browser notifications are blocked. Please enable them in your browser settings to receive alerts.
              </div>
            )}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input required value={notifyForm.fullName} onChange={e => setNotifyForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Full Name *" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              <input required type="email" value={notifyForm.email} onChange={e => setNotifyForm(f => ({ ...f, email: e.target.value }))} placeholder="Email *" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              <input value={notifyForm.phone} onChange={e => setNotifyForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone (optional)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              <input value={notifyForm.country} onChange={e => setNotifyForm(f => ({ ...f, country: e.target.value }))} placeholder="Country (optional)" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowNotifyForm(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold">Subscribe 🔔</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
