import { useState, useEffect, useRef } from 'react';
import { Radio, AlertCircle, Loader2 } from 'lucide-react';
import Peer from 'peerjs';

interface StreamViewerProps {
  peerId: string;
}

export default function StreamViewer({ peerId }: StreamViewerProps) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'offline'>('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    if (!peerId) {
      setStatus('offline');
      setErrorMessage('Admin has not started the broadcast yet');
      return;
    }

    setStatus('connecting');

    // Create viewer peer
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      // Call the broadcaster
      const call = peer.call(peerId, new MediaStream());

      if (!call) {
        setStatus('error');
        setErrorMessage('Could not connect to broadcaster');
        return;
      }

      call.on('stream', (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          setStatus('connected');
        }
      });

      call.on('close', () => {
        setStatus('offline');
        setErrorMessage('Broadcast has ended');
      });

      call.on('error', (err) => {
        console.error('Call error:', err);
        setStatus('error');
        setErrorMessage('Connection error. The broadcast may have ended.');
      });
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      if (err.type === 'peer-unavailable') {
        setStatus('offline');
        setErrorMessage('Admin is not broadcasting right now. Please check back later.');
      } else {
        setStatus('error');
        setErrorMessage(`Connection error: ${err.message}`);
      }
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [peerId]);

  if (status === 'offline') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white p-8">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-4">
            <Radio className="h-8 w-8 opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2">Not Broadcasting</h3>
          <p className="text-slate-300 text-sm mb-4">{errorMessage || 'The admin has not started the local broadcast yet.'}</p>
          <p className="text-xs text-slate-400">Check back during service times or when a live broadcast is announced.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-900/30 to-slate-900 flex items-center justify-center text-white p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Connection Error</h3>
          <p className="text-slate-300 text-sm">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
        style={{
          imageRendering: 'auto',
        }}
      />
      {status === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-amber-500" />
            <p className="text-lg font-semibold">Connecting to live broadcast...</p>
            <p className="text-sm text-slate-400 mt-1">Please wait</p>
          </div>
        </div>
      )}
      {status === 'connected' && (
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
          <Radio className="h-4 w-4 animate-pulse" /> LIVE
        </div>
      )}
    </div>
  );
}
