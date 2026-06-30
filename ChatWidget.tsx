import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function ChatWidget() {
  const { data, messages, sendMessage } = useChurch();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, selectedMember]);

  const thread = messages.filter(m =>
    (m.from === userName && m.to === selectedMember) ||
    (m.from === selectedMember && m.to === userName)
  );

  const handleSend = () => {
    if (!text.trim() || !userName || !selectedMember) return;
    sendMessage(userName, selectedMember, text.trim());
    setText('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition"
        aria-label="Chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-amber-400" />
              Member Chat
            </h3>
            <p className="text-xs text-slate-300 mt-1">Instant one-on-one conversation with members</p>
          </div>

          {!userName ? (
            <div className="p-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Your Name</label>
              <input
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
              {userName && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Chat with:</p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {data.members.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMember(m.name)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 flex items-center gap-2"
                      >
                        <img src={m.photo} alt={m.name} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-slate-500">{m.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : !selectedMember ? (
            <div className="p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Hi {userName}! Chat with:</p>
              <div className="max-h-80 overflow-y-auto space-y-1">
                {data.members.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMember(m.name)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 flex items-center gap-2"
                  >
                    <img src={m.photo} alt={m.name} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.role}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setUserName('')} className="text-xs text-slate-500 mt-3 underline">Change name</button>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={data.members.find(m => m.name === selectedMember)?.photo} alt="" className="h-7 w-7 rounded-full object-cover" />
                  <span className="text-sm font-medium">{selectedMember}</span>
                </div>
                <button onClick={() => setSelectedMember(null)} className="text-xs text-slate-500 underline">Change</button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50" style={{ minHeight: 260, maxHeight: 300 }}>
                {thread.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-8">Start the conversation! 💬</p>
                )}
                {thread.map(m => {
                  const mine = m.from === userName;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                        mine ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 rounded-bl-sm'
                      }`}>
                        {m.text}
                        <div className={`text-[10px] mt-1 ${mine ? 'text-amber-100' : 'text-slate-400'}`}>
                          {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-200 flex gap-2 bg-white">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-full text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center hover:scale-105 transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
