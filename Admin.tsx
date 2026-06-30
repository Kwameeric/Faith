import { useState } from 'react';
import { Save, Plus, Trash2, Upload, Settings, Image as ImageIcon, Film, Users2, Calendar, MapPin, Home, Building2, BookOpen, Lock, Inbox, Radio, BellRing, UserPlus, Truck, HandHeart, CreditCard, Heart, ShoppingCart, GraduationCap, MessageSquare, Video } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';
import { compressImage, formatFileSize, estimateStorageUsage } from '../utils/compressImage';
import AdminBroadcaster from '../components/AdminBroadcaster';

import { Book } from '../context/ChurchContext';

type Tab = 'general' | 'hero' | 'founder' | 'books' | 'members' | 'events' | 'branches' | 'media' | 'orphanage' | 'building' | 'bible' | 'bible-enrollments' | 'partners' | 'livestream' | 'home-gallery' | 'crusade-truck' | 'building-auditorium' | 'orphanage-donations' | 'payment' | 'book-orders';

function isImageUrl(value: string): boolean {
  if (!value) return false;
  return value.startsWith('data:image/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/') ||
    value.endsWith('.png') ||
    value.endsWith('.jpg') ||
    value.endsWith('.jpeg') ||
    value.endsWith('.webp') ||
    value.endsWith('.gif') ||
    value.endsWith('.svg');
}

export default function Admin() {
  const { data, updateField, setLive, broadcastLiveNotification } = useChurch();
  const [tab, setTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [storage, setStorage] = useState(() => estimateStorageUsage());
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(() => {
    try { return sessionStorage.getItem('adminPinVerified') === 'true'; } catch { return false; }
  });
  const [pinError, setPinError] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === data.adminPin) {
      setPinVerified(true);
      setPinError('');
      try { sessionStorage.setItem('adminPinVerified', 'true'); } catch {}
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setPinVerified(false);
    setPinInput('');
    try { sessionStorage.removeItem('adminPinVerified'); } catch {}
  };

  // PIN Entry Screen
  if (!pinVerified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-center text-white">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-xl">
                <Lock className="h-8 w-8 text-slate-900" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-slate-300 text-sm">Enter your PIN to access admin controls</p>
            </div>

            <form onSubmit={handlePinSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Admin PIN</label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={e => { setPinInput(e.target.value); setPinError(''); }}
                  placeholder="Enter PIN"
                  autoFocus
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
                {pinError && (
                  <p className="text-sm text-red-600 mt-2 text-center">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition"
              >
                Unlock Dashboard
              </button>

              <p className="text-xs text-center text-slate-500">🔒 Admin access is protected</p>
            </form>
          </div>
        </div>
      </div>
    );
  }


  const tabs: { id: Tab; label: string; Icon: typeof Settings }[] = [
    { id: 'general', label: 'General', Icon: Settings },
    { id: 'payment', label: 'Payment & Giving', Icon: CreditCard },
    { id: 'hero', label: 'Home/Hero', Icon: Home },
    { id: 'founder', label: 'Founder', Icon: Users2 },
    { id: 'books', label: 'Books', Icon: BookOpen },
    { id: 'book-orders', label: 'Book Orders', Icon: ShoppingCart },
    { id: 'members', label: 'Members', Icon: Users2 },
    { id: 'events', label: 'Events', Icon: Calendar },
    { id: 'branches', label: 'Branches', Icon: MapPin },
    { id: 'media', label: 'Media', Icon: Film },
    { id: 'orphanage', label: 'Orphanage', Icon: ImageIcon },
    { id: 'orphanage-donations', label: 'Orphan Donations', Icon: HandHeart },
    { id: 'building', label: 'Building', Icon: Building2 },
    { id: 'bible', label: 'Bible School', Icon: BookOpen },
    { id: 'bible-enrollments', label: 'Enrollments', Icon: GraduationCap },
    { id: 'partners', label: 'Partners', Icon: Inbox },
    { id: 'livestream', label: 'Live Stream', Icon: Radio },
    { id: 'home-gallery', label: 'Home Gallery', Icon: ImageIcon },
    { id: 'crusade-truck', label: 'Crusade Truck', Icon: Truck },
    { id: 'building-auditorium', label: 'Building', Icon: Home },
  ];

  const onSave = () => {
    setSaved(true);
    setStorage(estimateStorageUsage());
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress images; pass through videos and other files as-is
    if (file.type.startsWith('image/')) {
      const originalSize = file.size;
      const isLargeImage = originalSize > 2 * 1024 * 1024; // 2MB+

      console.log(`🗜️ Processing ${file.name} (${formatFileSize(originalSize)})...`);

      // Use higher quality for large/AI images
      compressImage(file, {
        preserveQuality: isLargeImage,
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      })
        .then((dataUrl) => {
          const finalSize = Math.round((dataUrl.length * 3) / 4);
          const savedPercent = Math.round((1 - finalSize / originalSize) * 100);
          console.log(`✨ Done: ${formatFileSize(originalSize)} → ${formatFileSize(finalSize)} (${savedPercent}% smaller)`);

          // Try to save; handle storage errors
          try {
            callback(dataUrl);
            setStorage(estimateStorageUsage());
          } catch (err) {
            const msg = `⚠️ Could not save image — browser storage is full.\n\n`;
            const details = `Original: ${formatFileSize(originalSize)}\nAfter compression: ${formatFileSize(finalSize)}\n\n`;
            const tips = `💡 Tips for large AI images:\n`;
            const tip1 = `• Upload to imgur.com or cloudinary.com and paste the URL instead\n`;
            const tip2 = `• Use the "Paste URL" option below the upload area\n`;
            const tip3 = `• Try a smaller image file\n`;
            alert(msg + details + tips + tip1 + tip2 + tip3);
          }
        })
        .catch((err) => {
          console.error('Compression failed:', err);
          alert(`❌ Failed to process image: ${err.message || 'Unknown error'}\n\n💡 For very large AI images, try:\n• Upload to imgur.com, then paste the URL\n• Use a smaller resolution image`);
        });
    } else {
      // Video or other file — pass through uncompressed
      const reader = new FileReader();
      reader.onload = () => {
        try {
          callback(reader.result as string);
          setStorage(estimateStorageUsage());
        } catch (err) {
          alert(`⚠️ Could not save — file too large for browser storage.\n\n💡 For large videos, upload to YouTube/Vimeo and use the embed URL.`);
        }
      };
      reader.onerror = () => alert('❌ Failed to read the file.');
      reader.readAsDataURL(file);
    }

    // Reset input so the same file can be re-uploaded if needed
    e.target.value = '';
  };

  // Note: compression happens inside handleFileUpload and inline handlers below

  const fileInputClass = "hidden";
  const uploadBtn = (onFile: (url: string) => void, label = 'Upload Image') => (
    <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium cursor-pointer transition">
      <Upload className="h-4 w-4" /> {label}
      <input type="file" accept="image/*,video/*" className={fileInputClass} onChange={e => handleFileUpload(e, onFile)} />
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Storage Usage Indicator */}
      <div className="mb-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Browser Storage</p>
              <p className="text-xs text-slate-500">
                {formatFileSize(storage.used)} of {formatFileSize(storage.total)} used
                {storage.percentage > 80 && <span className="text-orange-600 font-semibold"> · {storage.percentage.toFixed(0)}% full</span>}
              </p>
            </div>
          </div>
          {storage.percentage > 80 && (
            <div className="text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
              💡 Tip: Use external image URLs for very large AI images
            </div>
          )}
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              storage.percentage > 90 ? 'bg-red-500' :
              storage.percentage > 70 ? 'bg-orange-500' :
              storage.percentage > 50 ? 'bg-yellow-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(storage.percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium mb-2">
            <Lock className="h-3 w-3" /> Admin Area · 🔒 PIN Protected
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Edit everything about your church website</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
            title="Lock dashboard"
          >
            <Lock className="h-4 w-4" /> Lock
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition"
          >
            {saved ? <><span>✓</span> Saved!</> : <><Save className="h-5 w-5" /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>
        <div className="text-sm text-blue-900">
          <p className="font-semibold">📱 Upload directly from your phone</p>
          <p className="text-blue-700 mt-0.5">
            Tap any image box below to pick photos straight from your phone gallery, camera, or files. All images are saved automatically in your browser.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow border border-slate-100 p-2 h-fit lg:sticky lg:top-20">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                tab === t.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <t.Icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="bg-white rounded-2xl shadow border border-slate-100 p-6 sm:p-8 min-h-[500px]">
          {tab === 'general' && (
            <div className="space-y-5">
              {/* Admin PIN Settings */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" /> Admin PIN (Password)
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Current PIN</label>
                  <input
                    type="password"
                    value={data.adminPin}
                    onChange={e => updateField('adminPin', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm tracking-widest font-mono focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <p className="text-xs text-red-700 mt-2">🔒 This PIN protects your admin dashboard. Change it anytime. Default: <span className="font-mono font-bold">7771</span></p>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Church Information</h2>
              <Field label="Church Name" value={data.name} onChange={v => updateField('name', v)} />
              <Field label="Motto / Tagline" value={data.motto} onChange={v => updateField('motto', v)} />
              <Field label="Pastor Name(s)" value={data.pastorName} onChange={v => updateField('pastorName', v)} />
              <Field label="Pastor Bio" value={data.pastorBio} onChange={v => updateField('pastorBio', v)} textarea />
              <Field label="Contact Address" value={data.contactAddress} onChange={v => updateField('contactAddress', v)} />
              <Field label="Contact Phone" value={data.contactPhone} onChange={v => updateField('contactPhone', v)} />
              <Field label="Contact Email" value={data.contactEmail} onChange={v => updateField('contactEmail', v)} />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Church Logo</label>
                <p className="text-xs text-slate-500 mb-3">Upload from your phone gallery, or paste an emoji / URL below.</p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="h-24 w-24 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                    {isImageUrl(data.logo) ? (
                      <img src={data.logo} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-5xl">{data.logo || '⛪'}</span>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg cursor-pointer shadow-md transition">
                      <Upload className="h-4 w-4" />
                      Upload from Gallery
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, v => updateField('logo', v))}
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">Works on phone gallery, camera, and computer files</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    value={data.logo}
                    onChange={e => updateField('logo', e.target.value)}
                    placeholder="Or paste an emoji (e.g. ⛪) or image URL here"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 self-center">Quick pick:</span>
                    {['⛪', '✝️', '🕊️', '📖', '🙏'].map(e => (
                      <button
                        key={e}
                        onClick={() => updateField('logo', e)}
                        className={`h-9 w-9 rounded-lg border text-lg transition ${data.logo === e ? 'bg-amber-100 border-amber-500' : 'bg-white border-slate-200 hover:border-amber-400'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'founder' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-4">Founder Profile</h2>
              <Field label="Name" value={data.founder.name} onChange={v => updateField('founder', { ...data.founder, name: v })} />
              <Field label="Title" value={data.founder.title} onChange={v => updateField('founder', { ...data.founder, title: v })} />
              <Field label="Signature" value={data.founder.signature} onChange={v => updateField('founder', { ...data.founder, signature: v })} />
              <Field label="Inspirational Quote" value={data.founder.quote} onChange={v => updateField('founder', { ...data.founder, quote: v })} textarea />
              <Field label="Biography" value={data.founder.bio} onChange={v => updateField('founder', { ...data.founder, bio: v })} textarea />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Years in Ministry</label>
                <input type="number" value={data.founder.yearsInMinistry} onChange={e => updateField('founder', { ...data.founder, yearsInMinistry: Number(e.target.value) })} className="px-3 py-2 border border-slate-300 rounded-lg w-32" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
                <input value={data.founder.image} onChange={e => updateField('founder', { ...data.founder, image: e.target.value })} placeholder="Image URL" className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2" />
                {uploadBtn(v => updateField('founder', { ...data.founder, image: v }))}
                {data.founder.image && <img src={data.founder.image} className="mt-3 h-40 w-32 object-cover rounded-xl shadow" alt="Founder" />}
              </div>
            </div>
          )}

          {tab === 'books' && (
            <ListEditor
              title="Books for Sale"
              items={data.books}
              setItems={m => updateField('books', m)}
              empty={{ id: '', title: '', author: data.founder.name, cover: '', description: '', price: 19.99, buyLink: '#give' } as Book}
              render={(m, set) => (
                <>
                  <Field label="Title" value={m.title} onChange={v => set({ ...m, title: v } as Book)} />
                  <Field label="Author" value={m.author} onChange={v => set({ ...m, author: v } as Book)} />
                  <Field label="Description" value={m.description} onChange={v => set({ ...m, description: v } as Book)} textarea />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price (USD)</label>
                    <input type="number" step="0.01" value={m.price} onChange={e => set({ ...m, price: Number(e.target.value) } as Book)} className="px-3 py-2 border border-slate-300 rounded-lg w-40" />
                  </div>
                  <Field label="Buy Link" value={m.buyLink} onChange={v => set({ ...m, buyLink: v } as Book)} />
                  <ImageField label="Cover Image" value={m.cover} onChange={v => set({ ...m, cover: v } as Book)} />
                  {m.cover && <img src={m.cover} className="mt-3 h-40 w-32 object-cover rounded-lg shadow ring-4 ring-amber-100" alt={m.title} />}
                </>
              )}
              display={(m) => `${m.title} — ₵${(m as Book).price}`}
            />
          )}

          {tab === 'book-orders' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Book Orders</h2>
                <p className="text-sm text-slate-600">Track all book purchases from the online book store</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">All Book Orders</h3>
                      <p className="text-xs text-slate-500">
                        {data.bookPurchases.length} order(s)
                        {data.bookPurchases.reduce((a, b) => a + (b.totalPrice || 0), 0) > 0 &&
                          ` · Total revenue: ₵${data.bookPurchases.reduce((a, b) => a + (b.totalPrice || 0), 0).toFixed(2)}`}
                        {data.bookPurchases.reduce((a, b) => a + (b.quantity || 0), 0) > 0 &&
                          ` · ${data.bookPurchases.reduce((a, b) => a + (b.quantity || 0), 0)} book(s)`}
                      </p>
                    </div>
                  </div>
                  {data.bookPurchases.length > 0 && (
                    <button onClick={() => { if (confirm('Clear all book orders?')) updateField('bookPurchases', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Clear</button>
                  )}
                </div>
                {data.bookPurchases.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No orders yet. They'll appear here when customers place orders.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {data.bookPurchases.slice().reverse().map(o => {
                      const items = o.items && o.items.length > 0 ? o.items : [{ bookTitle: o.bookTitle || 'Unknown', quantity: o.quantity || 0 }];
                      return (
                        <div key={o.id} className="p-3 bg-amber-50 rounded-lg">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm text-slate-900">{o.fullName}</p>
                                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">₵{o.totalPrice.toFixed(2)}</span>
                                <span className="text-xs bg-slate-700 text-white px-2 py-0.5 rounded-full">×{items.reduce((a, b) => a + (b.quantity || 0), 0)} items</span>
                                <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full capitalize">{o.paymentMethod}</span>
                              </div>
                              <div className="mt-1 space-y-0.5">
                                {items.map((it, i) => (
                                  <p key={i} className="text-sm text-slate-700 italic">
                                    📖 "{it.bookTitle}" × {it.quantity}{'price' in it && it.price ? ` · ₵${((it as any).price * it.quantity).toFixed(2)}` : ''}
                                  </p>
                                ))}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {o.email} {o.phone && `· ${o.phone}`} · {new Date(o.submittedAt).toLocaleString()}
                              </p>
                              {o.shippingAddress && <p className="text-xs text-slate-700 mt-1">📦 {o.shippingAddress}</p>}
                              {o.message && <p className="text-xs text-slate-600 mt-1">💬 {o.message}</p>}
                            </div>
                            <button onClick={() => updateField('bookPurchases', data.bookPurchases.filter(x => x.id !== o.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex-shrink-0">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Payment & Giving Settings</h2>
                <p className="text-sm text-slate-600">Edit all MoMo, Bank Transfer, PayPal, and giving information in one place. Changes reflect across all pages.</p>
              </div>

              {/* Giving Info */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-amber-600" /> General Giving Info
                </h3>
                <Field label="Giving Page Title" value={data.givingTitle} onChange={v => updateField('givingTitle', v)} />
                <div className="mt-3">
                  <Field label="Giving Description" value={data.givingDescription} onChange={v => updateField('givingDescription', v)} textarea />
                </div>
              </div>

              {/* MoMo Details */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  📱 Mobile Money (MoMo)
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">MoMo Number</label>
                    <input value={data.momoNumber} onChange={e => updateField('momoNumber', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+233 24 123 4567" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Network</label>
                    <input value={data.momoNetwork} onChange={e => updateField('momoNetwork', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="MTN MoMo" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Name</label>
                    <input value={data.momoName} onChange={e => updateField('momoName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <p className="text-xs text-emerald-700 mt-3">💚 "Send via MoMo" buttons on all pages will use this number. Tapping opens the phone dialer.</p>
              </div>

              {/* Bank Transfer */}
              <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  🏦 Bank Transfer
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name</label>
                    <input value={data.bankName} onChange={e => updateField('bankName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Name</label>
                    <input value={data.accountName} onChange={e => updateField('accountName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Number</label>
                    <input value={data.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono tracking-wider" />
                  </div>
                </div>
                <p className="text-xs text-indigo-700 mt-3">🏦 Bank details shown on Give, Live Stream, Crusade Truck, Building, and Orphanage pages.</p>
              </div>

              {/* Payment Gateway Link */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  💳 Payment Gateway Link (Paystack / Flutterwave / Bank)
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment URL</label>
                  <input value={data.paymentLink} onChange={e => updateField('paymentLink', e.target.value)} placeholder="https://paystack.com/pay/your-link" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <p className="text-xs text-blue-700 mt-3">💳 The "💳 Pay via Bank App" button on all pages opens this URL. Supports Paystack, Flutterwave, or any online payment link.</p>
              </div>

              {/* PayPal */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  💙 PayPal
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">PayPal Link</label>
                  <input value={data.paypalLink} onChange={e => updateField('paypalLink', e.target.value)} placeholder="https://paypal.me/your-church" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <p className="text-xs text-sky-700 mt-3">💙 "PayPal Giving" buttons on all pages open this link. Great for international donors.</p>
              </div>

              {/* Where these appear */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3">🌐 Where These Settings Appear</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {[
                    { page: 'Give Page', uses: 'MoMo, Bank, PayPal' },
                    { page: 'Live Stream', uses: 'MoMo, Bank, Payment Link' },
                    { page: 'Crusade Truck', uses: 'MoMo, Bank, PayPal' },
                    { page: 'Building Project', uses: 'MoMo, Bank, PayPal' },
                    { page: 'Orphanage', uses: 'MoMo, Bank' },
                  ].map(p => (
                    <div key={p.page} className="flex justify-between bg-white px-3 py-2 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-900">{p.page}</span>
                      <span className="text-xs text-slate-500">{p.uses}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">✨ Edit any value here and it updates everywhere automatically!</p>
              </div>
            </div>
          )}

          {tab === 'hero' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-4">Home Page / Hero Video</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hero Video (plays behind the home page hero)</label>
                <label className="group relative block w-full h-48 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-amber-500 hover:from-amber-50 hover:to-amber-50 transition cursor-pointer overflow-hidden">
                  {data.heroVideoUrl ? (
                    <>
                      <video src={data.heroVideoUrl} controls muted className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">Preview</div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-sm font-medium">Tap to replace video</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <Upload className="h-8 w-8 mb-1 text-amber-500" />
                      <span className="text-base font-semibold text-slate-700">Tap to upload video from phone</span>
                      <span className="text-xs text-slate-500 mt-1">MP4, MOV, or WEBM · or paste URL below</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={e => handleFileUpload(e, v => updateField('heroVideoUrl', v))}
                  />
                </label>
                <input
                  value={data.heroVideoUrl}
                  onChange={e => updateField('heroVideoUrl', e.target.value)}
                  placeholder="Or paste a video URL here"
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <Field label="Live Stream URL (YouTube embed)" value={data.livestreamUrl} onChange={v => updateField('livestreamUrl', v)} />

              <h3 className="text-lg font-bold mt-6 pt-6 border-t border-slate-200">Giving Information</h3>
              <Field label="Giving Title" value={data.givingTitle} onChange={v => updateField('givingTitle', v)} />
              <Field label="Giving Description" value={data.givingDescription} onChange={v => updateField('givingDescription', v)} textarea />
              <Field label="Bank Name" value={data.bankName} onChange={v => updateField('bankName', v)} />
              <Field label="Account Name" value={data.accountName} onChange={v => updateField('accountName', v)} />
              <Field label="Account Number" value={data.accountNumber} onChange={v => updateField('accountNumber', v)} />
              <Field label="PayPal Link" value={data.paypalLink} onChange={v => updateField('paypalLink', v)} />
            </div>
          )}

          {tab === 'members' && (
            <ListEditor
              title="Church Members"
              items={data.members}
              setItems={m => updateField('members', m)}
              empty={{ id: '', name: '', role: '', phone: '', email: '', joinedDate: new Date().toISOString().slice(0, 10), photo: 'https://i.pravatar.cc/150' }}
              render={(m, set) => (
                <>
                  <Field label="Name" value={m.name} onChange={v => set({ ...m, name: v })} />
                  <Field label="Role/Ministry" value={m.role} onChange={v => set({ ...m, role: v })} />
                  <Field label="Phone" value={m.phone} onChange={v => set({ ...m, phone: v })} />
                  <Field label="Email" value={m.email} onChange={v => set({ ...m, email: v })} />
                  <Field label="Joined Date" value={m.joinedDate} onChange={v => set({ ...m, joinedDate: v })} />
                  <ImageField label="Member Photo" value={m.photo} onChange={v => set({ ...m, photo: v })} />
                  {m.photo && <img src={m.photo} className="h-20 w-20 rounded-full object-cover mt-2 ring-4 ring-amber-100" alt="" />}
                </>
              )}
              display={(m) => `${m.name} — ${m.role}`}
            />
          )}

          {tab === 'events' && (
            <ListEditor
              title="Events & Services"
              items={data.events}
              setItems={m => updateField('events', m)}
              empty={{ id: '', title: '', date: '', time: '', description: '', image: '', type: 'service' as const }}
              render={(m, set) => (
                <>
                  <Field label="Title" value={m.title} onChange={v => set({ ...m, title: v })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date" value={m.date} onChange={v => set({ ...m, date: v })} />
                    <Field label="Time" value={m.time} onChange={v => set({ ...m, time: v })} />
                  </div>
                  <Field label="Description" value={m.description} onChange={v => set({ ...m, description: v })} textarea />
                  <Field label="Image URL" value={m.image} onChange={v => set({ ...m, image: v })} />
                  <div>{uploadBtn(v => set({ ...m, image: v }))}</div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                    <select value={m.type} onChange={e => set({ ...m, type: e.target.value as 'service' | 'event' })} className="px-3 py-2 border border-slate-300 rounded-lg">
                      <option value="service">Service</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </>
              )}
              display={(m) => `${m.title} — ${m.date}`}
            />
          )}

          {tab === 'branches' && (
            <ListEditor
              title="Church Branches"
              items={data.branches}
              setItems={m => updateField('branches', m)}
              empty={{ id: '', name: '', address: '', pastor: '', phone: '', image: '' }}
              render={(m, set) => (
                <>
                  <Field label="Branch Name" value={m.name} onChange={v => set({ ...m, name: v })} />
                  <Field label="Address" value={m.address} onChange={v => set({ ...m, address: v })} />
                  <Field label="Pastor" value={m.pastor} onChange={v => set({ ...m, pastor: v })} />
                  <Field label="Phone" value={m.phone} onChange={v => set({ ...m, phone: v })} />
                  <ImageField label="Branch Image" value={m.image} onChange={v => set({ ...m, image: v })} />
                </>
              )}
              display={(m) => m.name}
            />
          )}

          {tab === 'media' && (
            <div className="space-y-8">
              <ListEditor
                title="Media (YouTube, TikTok, Instagram)"
                items={data.media}
                setItems={m => updateField('media', m)}
                empty={{ id: '', title: '', url: '', platform: 'youtube' as const, thumbnail: '' }}
                render={(m, set) => (
                  <>
                    <Field label="Title" value={m.title} onChange={v => set({ ...m, title: v })} />
                    <Field label="URL (embed link)" value={m.url} onChange={v => set({ ...m, url: v })} />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Platform</label>
                      <select value={m.platform} onChange={e => set({ ...m, platform: e.target.value as 'youtube' | 'tiktok' | 'instagram' })} className="px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="instagram">Instagram</option>
                      </select>
                    </div>
                    <ImageField label="Thumbnail" value={m.thumbnail} onChange={v => set({ ...m, thumbnail: v })} />
                  </>
                )}
                display={(m) => `${m.title} (${m.platform})`}
              />

              {/* Testimonies */}
              <div className="pt-8 border-t-2 border-slate-200">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mb-2">
                    🎬 Testimonies
                  </div>
                  <h2 className="text-xl font-bold">Church Testimonies</h2>
                  <p className="text-sm text-slate-600">Add video testimonies — paste a URL or upload from your phone gallery</p>
                </div>
                <ListEditor
                  title=""
                  items={data.testimonies}
                  setItems={m => updateField('testimonies', m)}
                  empty={{ id: '', title: '', author: '', videoUrl: '', description: '', submittedAt: Date.now() }}
                  render={(m, set) => (
                    <>
                      <Field label="Testimony Title" value={m.title} onChange={v => set({ ...m, title: v })} />
                      <Field label="Author / Testifier" value={m.author} onChange={v => set({ ...m, author: v })} />
                      <Field label="Description / Summary" value={m.description} onChange={v => set({ ...m, description: v })} textarea />
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Video</label>
                        <label className="group relative block w-full h-44 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-purple-50 to-slate-50 hover:border-purple-500 transition cursor-pointer overflow-hidden">
                          {m.videoUrl ? (
                            <>
                              <video src={m.videoUrl} className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                                <Upload className="h-6 w-6 mb-1" />
                                <span className="text-sm font-medium">Tap to replace video</span>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                              <Upload className="h-8 w-8 mb-1 text-purple-500" />
                              <span className="text-base font-semibold text-slate-700">Tap to upload from phone gallery</span>
                              <span className="text-xs text-slate-500 mt-1">or paste a video URL below</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => set({ ...m, videoUrl: reader.result as string });
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <input
                          value={m.videoUrl}
                          onChange={e => set({ ...m, videoUrl: e.target.value })}
                          placeholder="Or paste video URL (mp4, YouTube, etc.)"
                          className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </>
                  )}
                  display={(m) => `${m.title} — ${m.author || 'Unknown'}`}
                />
              </div>
            </div>
          )}

          {tab === 'orphanage' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-4">Orphanage Gallery</h2>
              <Field label="Description" value={data.orphanageDescription} onChange={v => updateField('orphanageDescription', v)} textarea />
              <GalleryEditor
                items={data.orphanageImages}
                setItems={m => updateField('orphanageImages', m)}
                empty={{ id: '', src: '', caption: '' }}
              />
            </div>
          )}

          {tab === 'building' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-4">Building Project</h2>
              <Field label="Project Description" value={data.buildingProjectDescription} onChange={v => updateField('buildingProjectDescription', v)} textarea />
              <GalleryEditor
                items={data.buildingImages}
                setItems={m => updateField('buildingImages', m)}
                empty={{ id: '', src: '', caption: '' }}
              />
            </div>
          )}

          {tab === 'bible' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold mb-4">Bible School</h2>
              <Field label="School Name" value={data.bibleSchoolName} onChange={v => updateField('bibleSchoolName', v)} />
              <Field label="Description" value={data.bibleSchoolDescription} onChange={v => updateField('bibleSchoolDescription', v)} textarea />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">🖼️ Bible School Image (Home Page)</label>
                <label className="group relative block w-full h-56 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-indigo-500 transition cursor-pointer overflow-hidden">
                  {data.bibleSchoolImage ? (
                    <>
                      <img src={data.bibleSchoolImage} alt="Bible School" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-sm font-medium">Tap to replace from phone gallery</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <Upload className="h-8 w-8 mb-1 text-indigo-500" />
                      <span className="text-base font-semibold text-slate-700">Tap to upload from gallery</span>
                      <span className="text-xs text-slate-500 mt-1">Works on phone gallery, camera, and computer</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      compressImage(file).then(v => updateField('bibleSchoolImage', v));
                    }}
                  />
                </label>
                <input
                  value={data.bibleSchoolImage}
                  onChange={e => updateField('bibleSchoolImage', e.target.value)}
                  placeholder="Or paste image URL here"
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">📌 This image appears on the Home page Bible School section and the Enroll page hero. Tap the box above to upload from your phone gallery.</p>
              </div>

              <h3 className="text-lg font-bold mt-6 pt-6 border-t border-slate-200">Bible School Gallery</h3>
              <GalleryEditor
                items={data.bibleImages}
                setItems={m => updateField('bibleImages', m)}
                empty={{ id: '', src: '', caption: '' }}
              />
            </div>
          )}

          {tab === 'bible-enrollments' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Bible School Enrollments</h2>
                <p className="text-sm text-slate-600">View all student enrollment applications for {data.bibleSchoolName}</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Enrollment Applications</h3>
                      <p className="text-xs text-slate-500">{data.bibleEnrollments.length} student(s) enrolled</p>
                    </div>
                  </div>
                  {data.bibleEnrollments.length > 0 && (
                    <button onClick={() => { if (confirm('Clear all enrollments?')) updateField('bibleEnrollments', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Clear</button>
                  )}
                </div>
                {data.bibleEnrollments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No enrollments yet.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {data.bibleEnrollments.slice().reverse().map(e => (
                      <div key={e.id} className="p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900">{e.fullName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {e.email} {e.phone && `· ${e.phone}`} {e.country && `· ${e.country}`} {e.age && `· Age ${e.age}`}
                            </p>
                            {e.education && <p className="text-xs text-indigo-700 mt-1">🎓 {e.education}</p>}
                            {e.motivation && <p className="text-xs text-slate-700 mt-1 italic">"{e.motivation}"</p>}
                            <p className="text-xs text-slate-400 mt-1">{new Date(e.submittedAt).toLocaleString()}</p>
                          </div>
                          <button onClick={() => updateField('bibleEnrollments', data.bibleEnrollments.filter(x => x.id !== e.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'orphanage-donations' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Orphanage Donations</h2>
                <p className="text-sm text-slate-600">Track all donations for {data.orphanageName} (funds, clothes, food, school materials, etc.)</p>
              </div>

              {/* Orphanage Settings */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <HandHeart className="h-5 w-5 text-pink-600" /> Orphanage Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Orphanage Name</label>
                    <input
                      value={data.orphanageName}
                      onChange={e => updateField('orphanageName', e.target.value)}
                      placeholder="e.g., Grace Haven Orphanage"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">This name appears on the Orphanage page, Home page, and donation confirmations.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Orphanage Description</label>
                    <textarea
                      value={data.orphanageDescription}
                      onChange={e => updateField('orphanageDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">🖼️ Featured Image (Home Page)</label>
                    <label className="group relative block w-full h-44 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-pink-50 to-rose-50 hover:border-pink-500 transition cursor-pointer overflow-hidden">
                      {data.orphanageHomeImage ? (
                        <>
                          <img src={data.orphanageHomeImage} alt="Orphanage" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                            <Upload className="h-6 w-6 mb-1" />
                            <span className="text-sm font-medium">Tap to replace from phone gallery</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                          <Upload className="h-8 w-8 mb-1 text-pink-500" />
                          <span className="text-base font-semibold text-slate-700">Tap to upload from gallery</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          compressImage(file).then(v => updateField('orphanageHomeImage', v));
                        }}
                      />
                    </label>
                    <input
                      value={data.orphanageHomeImage}
                      onChange={e => updateField('orphanageHomeImage', e.target.value)}
                      placeholder="Or paste image URL here"
                      className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">This image appears on the Home page and Orphanage page.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-pink-100 flex items-center justify-center">
                      <HandHeart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">All Orphanage Donations</h3>
                      <p className="text-xs text-slate-500">
                        {data.orphanageDonations.length} donation(s)
                        {data.orphanageDonations.filter(d => d.donationType === 'funds').reduce((a, b) => a + (b.amount || 0), 0) > 0 &&
                          ` · Cash total: ₵${data.orphanageDonations.filter(d => d.donationType === 'funds').reduce((a, b) => a + (b.amount || 0), 0).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  {data.orphanageDonations.length > 0 && (
                    <button onClick={() => { if (confirm('Clear all orphanage donations?')) updateField('orphanageDonations', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Clear</button>
                  )}
                </div>
                {data.orphanageDonations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No donations yet. They'll appear here when supporters submit.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {data.orphanageDonations.slice().reverse().map(d => {
                      const typeColors: Record<string, string> = {
                        funds: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        clothes: 'bg-pink-50 text-pink-700 border-pink-200',
                        school: 'bg-blue-50 text-blue-700 border-blue-200',
                        food: 'bg-amber-50 text-amber-700 border-amber-200',
                        toiletries: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                        other: 'bg-purple-50 text-purple-700 border-purple-200',
                      };
                      return (
                        <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-slate-900">{d.fullName}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${typeColors[d.donationType] || 'bg-slate-50 text-slate-700'}`}>
                                {d.donationType}
                              </span>
                              {d.donationType === 'funds' && d.amount > 0 && (
                                <span className="text-xs font-bold text-emerald-700">₵{d.amount.toFixed(2)}</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {d.email && `${d.email} · `}{d.phone && `${d.phone} · `}{new Date(d.submittedAt).toLocaleString()}
                            </p>
                            {d.itemDescription && <p className="text-xs text-slate-700 mt-1 italic">📦 {d.itemDescription}</p>}
                            {d.message && <p className="text-xs text-slate-600 mt-1">💬 {d.message}</p>}
                          </div>
                          <button onClick={() => updateField('orphanageDonations', data.orphanageDonations.filter(x => x.id !== d.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'building-auditorium' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Building Auditorium Campaign</h2>
                <p className="text-sm text-slate-600">Manage the auditorium image, goal, and track donations</p>
              </div>

              {/* Building Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Auditorium Image</label>
                <label className="group relative block w-full h-56 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-amber-500 hover:from-amber-50 hover:to-amber-50 transition cursor-pointer overflow-hidden">
                  {data.buildingAuditoriumImage ? (
                    <>
                      <img src={data.buildingAuditoriumImage} alt="Building" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-sm font-medium">Tap to replace from phone gallery</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <Upload className="h-8 w-8 mb-1 text-amber-500" />
                      <span className="text-base font-semibold text-slate-700">Tap to upload from gallery</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      compressImage(file).then(v => updateField('buildingAuditoriumImage', v));
                    }}
                  />
                </label>
                <input
                  value={data.buildingAuditoriumImage}
                  onChange={e => updateField('buildingAuditoriumImage', e.target.value)}
                  placeholder="Or paste image URL here"
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {/* Goal & Description */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fundraising Goal (USD)</label>
                  <input type="number" value={data.buildingAuditoriumGoal} onChange={e => updateField('buildingAuditoriumGoal', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount Raised (USD)</label>
                  <input type="number" value={data.buildingAuditoriumRaised} onChange={e => updateField('buildingAuditoriumRaised', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <Field label="Campaign Description" value={data.buildingAuditoriumDescription} onChange={v => updateField('buildingAuditoriumDescription', v)} textarea />

              {/* Building Donations */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold">Building Donations</h3>
                    <p className="text-xs text-slate-500">
                      {data.buildingDonations.length} donation(s) · Total logged: ₵{data.buildingDonations.reduce((a, b) => a + (b.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  {data.buildingDonations.length > 0 && (
                    <button onClick={() => { if (confirm('Clear all donations?')) updateField('buildingDonations', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Clear</button>
                  )}
                </div>
                {data.buildingDonations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No donations yet. They'll appear here when supporters submit their gifts.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.buildingDonations.slice().reverse().map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            {d.fullName} <span className="text-emerald-700 font-bold">· ₵{d.amount.toFixed(2)}</span> <span className="text-xs text-slate-500">({d.paymentMethod})</span>
                          </p>
                          <p className="text-xs text-slate-500">{new Date(d.submittedAt).toLocaleString()}</p>
                          {d.message && <p className="text-xs text-slate-600 italic mt-1">"{d.message}"</p>}
                        </div>
                        <button onClick={() => updateField('buildingDonations', data.buildingDonations.filter(x => x.id !== d.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'crusade-truck' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Crusade Truck Campaign</h2>
                <p className="text-sm text-slate-600">Manage the evangelism truck image, goal, and track donations</p>
              </div>

              {/* Truck Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Crusade Truck Image</label>
                <label className="group relative block w-full h-56 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-amber-500 hover:from-amber-50 hover:to-amber-50 transition cursor-pointer overflow-hidden">
                  {data.crusadeTruckImage ? (
                    <>
                      <img src={data.crusadeTruckImage} alt="Crusade Truck" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-sm font-medium">Tap to replace from phone gallery</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <Upload className="h-8 w-8 mb-1 text-amber-500" />
                      <span className="text-base font-semibold text-slate-700">Tap to upload from gallery</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      compressImage(file).then(v => updateField('crusadeTruckImage', v));
                    }}
                  />
                </label>
                <input
                  value={data.crusadeTruckImage}
                  onChange={e => updateField('crusadeTruckImage', e.target.value)}
                  placeholder="Or paste image URL here"
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {/* Goal & Description */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fundraising Goal (USD)</label>
                  <input
                    type="number"
                    value={data.crusadeTruckGoal}
                    onChange={e => updateField('crusadeTruckGoal', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount Raised (USD)</label>
                  <input
                    type="number"
                    value={data.crusadeTruckRaised}
                    onChange={e => updateField('crusadeTruckRaised', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <Field label="Campaign Description" value={data.crusadeTruckDescription} onChange={v => updateField('crusadeTruckDescription', v)} textarea />

              {/* Donations List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold">Donations Received</h3>
                    <p className="text-xs text-slate-500">
                      {data.crusadeDonations.length} donation(s) · Total logged: ₵{data.crusadeDonations.reduce((a, b) => a + (b.amount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  {data.crusadeDonations.length > 0 && (
                    <button onClick={() => { if (confirm('Clear all donations?')) updateField('crusadeDonations', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">
                      Clear
                    </button>
                  )}
                </div>
                {data.crusadeDonations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No donations yet. They'll appear here when supporters submit their gifts.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.crusadeDonations.slice().reverse().map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            {d.fullName} <span className="text-emerald-700 font-bold">· ₵{d.amount.toFixed(2)}</span> <span className="text-xs text-slate-500">({d.paymentMethod})</span>
                          </p>
                          <p className="text-xs text-slate-500">{new Date(d.submittedAt).toLocaleString()}</p>
                          {d.message && <p className="text-xs text-slate-600 italic mt-1">"{d.message}"</p>}
                        </div>
                        <button onClick={() => updateField('crusadeDonations', data.crusadeDonations.filter(x => x.id !== d.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'home-gallery' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Home Page Gallery</h2>
                <p className="text-sm text-slate-600">These 4 images are featured on the home page. Tap any box to upload from your phone gallery.</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-900">
                💡 <strong>Tip:</strong> Use vertical or square photos for best results. Recommended size: 1200×900 pixels.
              </div>
              <GalleryEditor
                items={data.homeGallery}
                setItems={m => updateField('homeGallery', m)}
                empty={{ id: '', src: '', caption: '' }}
              />
            </div>
          )}

          {tab === 'livestream' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Live Stream Control</h2>
                <p className="text-sm text-slate-600">Manage live status, view online members & subscribers</p>
              </div>

              {/* Go Live toggle */}
              <div className={`rounded-2xl p-6 border-2 ${data.isLive ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`h-3 w-3 rounded-full ${data.isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                      <h3 className="font-bold text-lg text-slate-900">{data.isLive ? 'LIVE — Broadcasting Now' : 'Offline'}</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      {data.isLive
                        ? 'Your stream is live. Viewers are being notified.'
                        : 'Tap "Go Live" to start broadcasting and notify subscribers.'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLive(!data.isLive);
                        if (!data.isLive) broadcastLiveNotification();
                      }}
                      className={`px-5 py-2.5 rounded-xl font-semibold shadow-lg transition ${
                        data.isLive
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                      }`}
                    >
                      {data.isLive ? '● End Stream' : '● Go Live'}
                    </button>
                    {data.isLive && (
                      <button
                        onClick={broadcastLiveNotification}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center gap-2"
                        title="Send notification to current browser"
                      >
                        <BellRing className="h-4 w-4" /> Re-notify
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-slate-200/60 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Notification Title</label>
                    <input
                      value={data.liveNotificationTitle}
                      onChange={e => updateField('liveNotificationTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Notification Message</label>
                    <input
                      value={data.liveNotificationMessage}
                      onChange={e => updateField('liveNotificationMessage', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">💡 Subscribers who granted browser permission will receive a pop-up notification when you go live.</p>
              </div>

              {/* Stream Settings */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Radio className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Stream Settings</h3>
                    <p className="text-xs text-slate-500">Configure where your live stream comes from</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Stream Platform</label>
                    <select
                      value={data.streamPlatform}
                      onChange={e => updateField('streamPlatform', e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="youtube">YouTube Live</option>
                      <option value="facebook">Facebook Live</option>
                      <option value="twitch">Twitch</option>
                      <option value="instagram">Instagram Live</option>
                      <option value="tiktok">TikTok Live</option>
                      <option value="local">Local Broadcast (Camera/Mic)</option>
                      <option value="custom">Custom Embed URL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Stream URL</label>
                    <input
                      value={data.streamUrl}
                      onChange={e => updateField('streamUrl', e.target.value)}
                      placeholder={
                        data.streamPlatform === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                        data.streamPlatform === 'facebook' ? 'https://www.facebook.com/...' :
                        data.streamPlatform === 'twitch' ? 'https://www.twitch.tv/channelname' :
                        'Paste stream URL'
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {data.streamPlatform === 'local' && '📹 Broadcast directly from your device - controls are below'}
                      {data.streamPlatform === 'youtube' && '📺 Paste YouTube Live URL - will be embedded automatically'}
                      {data.streamPlatform === 'facebook' && '📱 Paste Facebook Live URL - will be embedded automatically'}
                      {data.streamPlatform === 'twitch' && '🎮 Paste Twitch channel URL - will be embedded automatically'}
                      {(data.streamPlatform === 'instagram' || data.streamPlatform === 'tiktok') && '📲 These platforms cannot be embedded - visitors will be redirected to the platform'}
                      {data.streamPlatform === 'custom' && '🔗 Paste any embed-compatible URL'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Switch Button - Switch between Local Broadcast and Embedded Stream */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Radio className="h-5 w-5 text-purple-600" />
                      Quick Switch Mode
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Instantly switch between your live camera and an embedded video (for breaks, pre-recorded content, etc.)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {data.streamPlatform === 'local' ? (
                      <button
                        onClick={() => updateField('streamPlatform', 'youtube')}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl flex items-center gap-2 shadow transition"
                      >
                        <Video className="h-4 w-4" /> Switch to Embedded
                      </button>
                    ) : (
                      <button
                        onClick={() => updateField('streamPlatform', 'local')}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl flex items-center gap-2 shadow transition"
                      >
                        <Radio className="h-4 w-4 animate-pulse" /> Go Live Now
                      </button>
                    )}
                  </div>
                </div>
                <div className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  data.streamPlatform === 'local'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {data.streamPlatform === 'local' ? (
                    <span>📹 <strong>Currently Live:</strong> Your camera/mic broadcast is active. Viewers see you live.</span>
                  ) : (
                    <span>🎬 <strong>Currently Embedded:</strong> Viewers see your embedded video ({data.streamPlatform}). Perfect for breaks or pre-recorded content.</span>
                  )}
                </div>
              </div>

              {/* Local Broadcast Controls */}
              {data.streamPlatform === 'local' && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">📹 Broadcast from Your Device</h3>
                      <p className="text-xs text-slate-500">Use camera and mic to stream directly to the website</p>
                    </div>
                  </div>
                  <AdminBroadcaster
                    peerId={data.broadcastPeerId}
                    onPeerIdChange={(id) => updateField('broadcastPeerId', id)}
                  />
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>💡 How it works:</strong> Click "Start Broadcasting" above to begin streaming. Viewers on the Live Stream page will automatically connect to your broadcast. Keep this tab open while broadcasting.
                    </p>
                  </div>
                </div>
              )}

              {/* Notification History */}
              {data.notificationRecords.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold">Notification History</h3>
                        <p className="text-xs text-slate-500">{data.notificationRecords.length} notification(s) sent</p>
                      </div>
                    </div>
                    <button onClick={() => { if (confirm('Clear all notification history?')) updateField('notificationRecords', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Clear</button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.notificationRecords.slice().reverse().map(n => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-slate-900">{n.memberName}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${n.method === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {n.method === 'whatsapp' ? '💬 WhatsApp' : '📱 SMS'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{n.memberPhone}</p>
                            <p className="text-xs text-slate-700 mt-1 italic">"{n.message}"</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(n.sentAt).toLocaleString()}</p>
                          </div>
                          <button onClick={() => updateField('notificationRecords', data.notificationRecords.filter(x => x.id !== n.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded flex-shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MoMo Settings */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900">Mobile Money (MoMo) Details</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">MoMo Number</label>
                    <input value={data.momoNumber} onChange={e => updateField('momoNumber', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Network</label>
                    <input value={data.momoNetwork} onChange={e => updateField('momoNetwork', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Name</label>
                    <input value={data.momoName} onChange={e => updateField('momoName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">💳 Payment Link (Paystack/Flutterwave/Bank URL)</label>
                    <input value={data.paymentLink} onChange={e => updateField('paymentLink', e.target.value)} placeholder="https://paystack.com/pay/your-link" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                    <p className="text-xs text-slate-500 mt-1">Opens in a new tab — visitors can pay directly via their bank app.</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-700 mt-3">💚 MoMo uses the phone dialer (tel: link). Payment link opens online bank transfer (Paystack/Flutterwave).</p>
              </div>

              {/* Live Offerings */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">💰</div>
                    <div>
                      <h3 className="font-bold">Live Stream Offerings</h3>
                      <p className="text-xs text-slate-500">
                        {data.liveOfferings.length} offering(s) received
                        {data.liveOfferings.length > 0 && ` · Total: ₵${data.liveOfferings.reduce((a, b) => a + (b.amount || 0), 0).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  {data.liveOfferings.length > 0 && (
                    <button onClick={() => { if (confirm('Clear all offerings?')) updateField('liveOfferings', []); }} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Clear</button>
                  )}
                </div>
                {data.liveOfferings.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No offerings recorded yet. They'll appear here when viewers submit their gift confirmations.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.liveOfferings.slice().reverse().map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{o.fullName} <span className="text-emerald-700 font-bold">· {o.amount.toFixed(2)}</span></p>
                          <p className="text-xs text-slate-500">
                            {o.reference && `Ref: ${o.reference} · `}{new Date(o.submittedAt).toLocaleString()}
                          </p>
                          {o.message && <p className="text-xs text-slate-600 italic mt-1">"{o.message}"</p>}
                        </div>
                        <button onClick={() => updateField('liveOfferings', data.liveOfferings.filter(x => x.id !== o.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Online Members */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Online Members</h3>
                      <p className="text-xs text-slate-500">{data.onlineMembers.length} registered online member(s)</p>
                    </div>
                  </div>
                  {data.onlineMembers.length > 0 && (
                    <button
                      onClick={() => { if (confirm('Clear all online members?')) updateField('onlineMembers', []); }}
                      className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {data.onlineMembers.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No online members yet.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.onlineMembers.slice().reverse().map(m => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">
                            {m.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-900">{m.fullName}</p>
                            <p className="text-xs text-slate-500">
                              {m.email} {m.country && `· ${m.country}`} · {new Date(m.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => updateField('onlineMembers', data.onlineMembers.filter(x => x.id !== m.id))}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Subscribers */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <BellRing className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Notification Subscribers</h3>
                      <p className="text-xs text-slate-500">{data.notifySubscribers.length} subscriber(s) — {data.notifySubscribers.filter(s => s.permissionGranted).length} with browser permission</p>
                    </div>
                  </div>
                  {data.notifySubscribers.length > 0 && (
                    <button
                      onClick={() => { if (confirm('Clear all subscribers?')) updateField('notifySubscribers', []); }}
                      className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {data.notifySubscribers.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No subscribers yet.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.notifySubscribers.slice().reverse().map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                            {s.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-900">
                              {s.fullName}
                              {s.permissionGranted && <span className="ml-2 text-xs text-emerald-600">✓ notified</span>}
                            </p>
                            <p className="text-xs text-slate-500">
                              {s.email} {s.country && `· ${s.country}`} · {new Date(s.subscribedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => updateField('notifySubscribers', data.notifySubscribers.filter(x => x.id !== s.id))}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'partners' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Partnership Submissions</h2>
                  <p className="text-sm text-slate-600">{data.partnerSubmissions.length} total partner(s)</p>
                </div>
                {data.partnerSubmissions.length > 0 && (
                  <button
                    onClick={() => { if (confirm('Clear all submissions? This cannot be undone.')) updateField('partnerSubmissions', []); }}
                    className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Clear All
                  </button>
                )}
              </div>

              {/* Partnership note & affirmation editors */}
              <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3">Edit Partnership Page Content</h3>
                <Field label="Partnership Note" value={data.partnershipNote} onChange={v => updateField('partnershipNote', v)} textarea />
                <div className="mt-3">
                  <Field label="Partnership Affirmation Declaration" value={data.partnershipAffirmation} onChange={v => updateField('partnershipAffirmation', v)} textarea />
                </div>
              </div>

              {data.partnerSubmissions.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Inbox className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No partnership submissions yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Submissions will appear here when members complete the form.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.partnerSubmissions.slice().reverse().map(s => (
                    <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold flex items-center justify-center">
                            {s.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{s.fullName}</h4>
                            <p className="text-xs text-slate-500">
                              {new Date(s.submittedAt).toLocaleString()} · <span className="text-amber-700 font-medium capitalize">{s.partnershipType}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Delete this submission?')) {
                              updateField('partnerSubmissions', data.partnerSubmissions.filter(x => x.id !== s.id));
                            }
                          }}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                        <div><span className="text-slate-500">Email:</span> <a href={`mailto:${s.email}`} className="text-indigo-600 hover:underline">{s.email}</a></div>
                        <div><span className="text-slate-500">Phone:</span> {s.phone || '—'}</div>
                        <div><span className="text-slate-500">Country:</span> {s.country || '—'}</div>
                      </div>
                      {s.affirmation.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-1 font-medium">Affirmations:</p>
                          <div className="flex flex-wrap gap-1">
                            {s.affirmation.map((a, i) => (
                              <span key={i} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">✓ {a}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.message && (
                        <div className="bg-slate-50 rounded-lg p-3 text-sm">
                          <p className="text-xs text-slate-500 mb-1 font-medium">Personal Note:</p>
                          <p className="text-slate-700">{s.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={cls} />
        : <input value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  );
}

function ImageField({ label, value, onChange, accept = 'image/*' }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      <label className="group relative block w-full h-32 rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-amber-500 hover:from-amber-50 hover:to-amber-50 transition cursor-pointer overflow-hidden">
        {value ? (
          <>
            <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
              <Upload className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Tap to replace</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <Upload className="h-7 w-7 mb-1 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">Tap to upload from gallery</span>
            <span className="text-xs text-slate-500 mt-0.5">or paste a URL below</span>
          </div>
        )}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.type.startsWith('image/')) {
              compressImage(file).then(onChange);
            } else {
              const reader = new FileReader();
              reader.onload = () => onChange(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
        />
      </label>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Or paste image URL here"
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
      />
    </div>
  );
}

function ListEditor<T extends { id: string }>({ title, items, setItems, empty, render, display }: {
  title: string;
  items: T[];
  setItems: (items: T[]) => void;
  empty: T;
  render: (item: T, set: (item: T) => void) => React.ReactNode;
  display: (item: T) => string;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const current = items.find(i => i.id === editing);

  const add = () => {
    const newItem = { ...empty, id: crypto.randomUUID() } as T;
    setItems([...items, newItem]);
    setEditing(newItem.id);
  };

  const update = (item: T) => {
    setItems(items.map(i => i.id === item.id ? item : i));
  };

  const remove = (id: string) => {
    if (confirm('Delete this item?')) {
      setItems(items.filter(i => i.id !== id));
      if (editing === id) setEditing(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {items.length === 0 && <p className="text-slate-500 text-sm py-6 text-center">No items yet. Click "Add New" to get started.</p>}

      <div className="space-y-2 mb-6">
        {items.map(item => (
          <div key={item.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${editing === item.id ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
            <span className="text-sm">{display(item)}</span>
            <div className="flex gap-1">
              <button onClick={() => setEditing(item.id)} className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded">Edit</button>
              <button onClick={() => remove(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-200">
          <h3 className="font-semibold text-slate-900">Editing: {display(current)}</h3>
          {render(current, update)}
          <button onClick={() => setEditing(null)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Done</button>
        </div>
      )}
    </div>
  );
}

function GalleryEditor<T extends { id: string; src: string; caption: string }>({ items, setItems, empty }: {
  items: T[];
  setItems: (items: T[]) => void;
  empty: T;
}) {
  const add = () => {
    const newItem = { ...empty, id: crypto.randomUUID() } as T;
    setItems([...items, newItem]);
  };
  const update = (id: string, patch: Partial<T>) => setItems(items.map(i => i.id === id ? { ...i, ...patch } : i));
  const remove = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Images ({items.length})</h3>
        <button onClick={add} className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium">
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(img => (
          <div key={img.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
            <label className="group relative block w-full h-36 rounded-lg border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-amber-500 hover:from-amber-50 hover:to-amber-50 transition cursor-pointer overflow-hidden">
              {img.src ? (
                <>
                  <img src={img.src} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-sm font-medium">Tap to replace</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <Upload className="h-6 w-6 mb-1 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">Tap to upload</span>
                  <span className="text-xs text-slate-500 mt-0.5">from phone gallery</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                compressImage(file).then(dataUrl => update(img.id, { src: dataUrl } as Partial<T>));
              }} />
            </label>
            <input value={img.src} onChange={e => update(img.id, { src: e.target.value } as Partial<T>)} placeholder="Or paste image URL here" className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs" />
            <input value={img.caption} onChange={e => update(img.id, { caption: e.target.value } as Partial<T>)} placeholder="Caption" className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs" />
            <button onClick={() => remove(img.id)} className="inline-flex items-center gap-1 px-2 py-1 text-red-500 hover:bg-red-50 rounded text-xs">
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
