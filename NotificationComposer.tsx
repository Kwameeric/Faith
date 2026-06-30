import { useState } from 'react';
import { MessageSquare, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function NotificationComposer() {
  const { data, sendNotification } = useChurch();
  const [message, setMessage] = useState('🔴 We are LIVE now! Join us for worship at Grace Covenant Church. Click here to watch: {streamUrl}');
  const [sentCount, setSentCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const templates = [
    {
      name: 'Live Stream Alert',
      message: '🔴 We are LIVE now! Join us for worship at Grace Covenant Church. Watch here: {streamUrl}',
    },
    {
      name: 'Service Reminder',
      message: '⏰ Reminder: Sunday service starts in 30 minutes! Join us online or in person. Stream: {streamUrl}',
    },
    {
      name: 'Special Event',
      message: '✨ Special event tonight at 7PM! Don\'t miss it. Watch live: {streamUrl}',
    },
  ];

  const sendMessage = (memberId: string, method: 'sms' | 'whatsapp') => {
    const personalizedMessage = message.replace('{streamUrl}', data.streamUrl || window.location.origin + '/livestream');
    sendNotification(memberId, method, personalizedMessage);
    setSentCount(prev => prev + 1);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sendToAll = (method: 'sms' | 'whatsapp') => {
    if (!confirm(`Send ${method.toUpperCase()} notification to all ${data.members.length} members?`)) return;

    data.members.forEach((member, index) => {
      setTimeout(() => {
        sendMessage(member.id, method);
      }, index * 500); // Stagger to avoid overwhelming
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-5 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Send className="h-6 w-6" /> Notify Members
        </h3>
        <p className="text-emerald-50 text-sm mt-1">Send SMS or WhatsApp notifications to church members</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Message Templates */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">Quick Templates</label>
          <div className="flex flex-wrap gap-2">
            {templates.map((template, i) => (
              <button
                key={i}
                onClick={() => setMessage(template.message)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Message <span className="text-xs text-slate-500">(Use {'{streamUrl}'} to insert stream link)</span>
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Total Members</p>
            <p className="text-2xl font-bold text-slate-900">{data.members.length}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-xs text-emerald-700 mb-1">Sent This Session</p>
            <p className="text-2xl font-bold text-emerald-700">{sentCount}</p>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => sendToAll('whatsapp')}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp All
          </button>
          <button
            onClick={() => sendToAll('sms')}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <MessageSquare className="h-5 w-5" /> SMS All
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm text-emerald-800 font-medium">Notification sent! Check your phone's messaging app.</p>
          </div>
        )}

        {/* Member List */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">Send to Individual Members</label>
          <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3">
            {data.members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.phone}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => sendMessage(member.id, 'whatsapp')}
                    className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
                    title="Send WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => sendMessage(member.id, 'sms')}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                    title="Send SMS"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
          <p className="font-semibold mb-1">💡 How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clicking "WhatsApp" opens WhatsApp with the message pre-filled</li>
            <li>Clicking "SMS" opens your phone's messaging app</li>
            <li>You'll need to manually send each message</li>
            <li>For automated SMS, consider integrating Twilio or similar service</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
