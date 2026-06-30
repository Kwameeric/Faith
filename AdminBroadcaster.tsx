import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Radio, Copy, Check, AlertCircle, Camera, RefreshCw, Lightbulb, LightbulbOff } from 'lucide-react';
import Peer from 'peerjs';

interface AdminBroadcasterProps {
  peerId: string;
  onPeerIdChange: (id: string) => void;
}

export default function AdminBroadcaster({ peerId, onPeerIdChange }: AdminBroadcasterProps) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'broadcasting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedPeer, setCopiedPeer] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [actualResolution, setActualResolution] = useState<{ width: number; height: number } | null>(null);

  // Camera management
  const [cameras, setCameras] = useState<{ deviceId: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [currentFacing, setCurrentFacing] = useState<'user' | 'environment'>('environment');
  const [cameraSwitching, setCameraSwitching] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callsRef = useRef<any[]>([]);

  // Load available cameras
  const loadCameras = async () => {
    try {
      // Request initial permission with simple constraints
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      tempStream.getTracks().forEach(t => t.stop());

      // Now enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices: { deviceId: string; label: string }[] = devices
        .filter(d => d.kind === 'videoinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${idx + 1}`,
        }));

      setCameras(videoDevices);

      // Default to back camera (environment)
      if (videoDevices.length > 0) {
        const backCamera = videoDevices.find(c =>
          c.label.toLowerCase().includes('back') ||
          c.label.toLowerCase().includes('rear') ||
          c.label.toLowerCase().includes('environment')
        );
        setSelectedCameraId(backCamera?.deviceId || videoDevices[0].deviceId);
        setCurrentFacing('environment');
      }
    } catch (err: any) {
      console.error('Camera enumeration error:', err);
      setErrorMessage(`Could not access cameras: ${err.message || 'Permission denied'}. Please allow camera access and try again.`);
    }
  };

  useEffect(() => {
    loadCameras();
  }, []);

  // Initialize PeerJS
  useEffect(() => {
    if (!peerId) {
      const peer = new Peer();
      peer.on('open', (id) => {
        onPeerIdChange(id);
      });
      peer.on('error', (err) => {
        console.error('Peer error:', err);
        setErrorMessage(`Connection error: ${err.message}`);
        setStatus('error');
      });
      peerRef.current = peer;
    }
    return () => {
      if (peerRef.current && !isBroadcasting) {
        peerRef.current.destroy();
      }
    };
  }, []);

  // Start broadcasting
  const startBroadcast = async () => {
    try {
      setStatus('connecting');
      setErrorMessage('');

      // Build video constraints - use `ideal` for better compatibility across devices
      const videoConstraints: any = selectedCameraId
        ? { deviceId: { ideal: selectedCameraId } }
        : { facingMode: { ideal: 'environment' } };

      // Quality constraints (use `ideal` so browser can fallback if exact values not available)
      videoConstraints.width = { ideal: 1920 };
      videoConstraints.height = { ideal: 1080 };
      videoConstraints.frameRate = { ideal: 30 };

      // Try to get stream with requested constraints
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioEnabled ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } : false,
        });
      } catch (firstError) {
        // Fallback: try with minimal constraints for maximum compatibility
        console.log('Trying minimal video constraints:', firstError);
        stream = await navigator.mediaDevices.getUserMedia({
          video: selectedCameraId
            ? { deviceId: { ideal: selectedCameraId } }
            : { facingMode: { ideal: 'environment' } },
          audio: audioEnabled ? true : false,
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check torch support
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack as any).getCapabilities?.() || {};
        setTorchSupported(!!capabilities.torch);

        // Auto-turn on torch for back camera
        if (capabilities.torch && currentFacing === 'environment') {
          try {
            await (videoTrack as any).applyConstraints({ advanced: [{ torch: true }] });
            setTorchEnabled(true);
          } catch (e) {
            console.log('Torch not available:', e);
          }
        }

        // Get resolution
        setTimeout(() => {
          const settings = videoTrack.getSettings();
          if (settings.width && settings.height) {
            setActualResolution({ width: settings.width, height: settings.height });
          }
        }, 1000);
      }

      // Create/reuse peer
      if (!peerRef.current) {
        peerRef.current = peerId ? new Peer(peerId) : new Peer();
      }

      const peer = peerRef.current;

      // Handle incoming calls
      peer.on('call', (call: any) => {
        call.answer(stream);
        callsRef.current.push(call);
        call.on('close', () => {
          callsRef.current = callsRef.current.filter(c => c !== call);
          setViewerCount(callsRef.current.length);
        });
      });

      peer.on('open', (id) => {
        if (!peerId) onPeerIdChange(id);
        setStatus('broadcasting');
        setIsBroadcasting(true);
      });

      if (peer.open) {
        setStatus('broadcasting');
        setIsBroadcasting(true);
      }
    } catch (err: any) {
      console.error('Broadcast error:', err);
      let msg = err.message || 'Unknown error';
      if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
        msg = 'Camera/microphone permission denied. Please allow access in your browser settings and try again.';
      } else if (msg.includes('NotFoundError')) {
        msg = 'No camera found on this device.';
      } else if (msg.includes('NotReadableError')) {
        msg = 'Camera is being used by another application. Please close other apps using the camera.';
      }
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const stopBroadcast = () => {
    callsRef.current.forEach(c => c.close());
    callsRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;
    setIsBroadcasting(false);
    setStatus('idle');
    setViewerCount(0);
    setTorchEnabled(false);
  };

  // Toggle torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const newTorchState = !torchEnabled;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: newTorchState }],
      });
      setTorchEnabled(newTorchState);
    } catch (e: any) {
      console.error('Torch toggle error:', e);
      setErrorMessage('Torch control not available on this device');
    }
  };

  // Switch camera - properly releases old camera first on mobile
  const switchCamera = async (newCameraId: string) => {
    if (!isBroadcasting || !streamRef.current) {
      setSelectedCameraId(newCameraId);
      return;
    }

    setCameraSwitching(true);
    setErrorMessage('');

    try {
      // IMPORTANT: Stop the old video track FIRST to release the camera hardware
      // This is critical on mobile devices where camera can only be used once at a time
      const oldVideoTrack = streamRef.current.getVideoTracks()[0];
      const oldAudioTrack = streamRef.current.getAudioTracks()[0];

      // Disable old track in preview immediately for smooth UX
      if (oldVideoTrack) oldVideoTrack.enabled = false;

      // Small delay to let hardware release
      await new Promise(resolve => setTimeout(resolve, 100));

      // Stop old video track to release the camera
      if (oldVideoTrack) {
        oldVideoTrack.stop();
        streamRef.current.removeTrack(oldVideoTrack);
      }

      // Get new stream with the new camera - use looser constraints for better compatibility
      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { ideal: newCameraId },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          },
          audio: false, // Keep audio track, don't replace it
        });
      } catch (firstError) {
        // Fallback: try with minimal constraints
        console.log('Trying fallback constraints:', firstError);
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { ideal: newCameraId } },
          audio: false,
        });
      }

      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace track in all peer connections
      const replacePromises = callsRef.current.map(async (call) => {
        try {
          const senders = call.peerConnection?.getSenders?.() || [];
          for (const sender of senders) {
            if (sender.track?.kind === 'video' && newVideoTrack) {
              await sender.replaceTrack(newVideoTrack);
            }
          }
        } catch (err) {
          console.error('Track replace failed:', err);
        }
      });
      await Promise.all(replacePromises);

      // Add new video track to main stream
      if (newVideoTrack) {
        streamRef.current.addTrack(newVideoTrack);
      }

      // Keep audio track (don't replace audio)
      if (oldAudioTrack) {
        // Re-enable audio
        oldAudioTrack.enabled = audioEnabled;
      }

      // Update preview
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }

      setSelectedCameraId(newCameraId);

      // Detect if front or back camera based on label
      const selectedCam = cameras.find(c => c.deviceId === newCameraId);
      const label = selectedCam?.label.toLowerCase() || '';
      if (label.includes('front') || label.includes('user') || label.includes('selfie')) {
        setCurrentFacing('user');
      } else {
        setCurrentFacing('environment');
      }

      // Update torch - auto on for back camera
      const capabilities = (newVideoTrack as any).getCapabilities?.() || {};
      setTorchSupported(!!capabilities.torch);

      if (capabilities.torch) {
        const isBack = !label.includes('front') && !label.includes('user') && !label.includes('selfie');
        if (isBack && !torchEnabled) {
          try {
            await (newVideoTrack as any).applyConstraints({ advanced: [{ torch: true }] });
            setTorchEnabled(true);
          } catch (e) {
            console.log('Auto torch failed:', e);
          }
        } else if (!isBack && torchEnabled) {
          try {
            await (newVideoTrack as any).applyConstraints({ advanced: [{ torch: false }] });
            setTorchEnabled(false);
          } catch (e) {
            console.log('Auto torch off failed:', e);
          }
        }
      }

      // Update resolution
      setTimeout(() => {
        const settings = newVideoTrack.getSettings();
        if (settings.width && settings.height) {
          setActualResolution({ width: settings.width, height: settings.height });
        }
      }, 500);
    } catch (err: any) {
      console.error('Camera switch error:', err);
      setErrorMessage(`Could not switch camera: ${err.message}`);
    } finally {
      setCameraSwitching(false);
    }
  };

  const quickSwitchCamera = () => {
    if (cameras.length < 2) {
      setErrorMessage('Only one camera detected on this device');
      return;
    }
    const currentIndex = cameras.findIndex(c => c.deviceId === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    switchCamera(cameras[nextIndex].deviceId);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
      setAudioEnabled(!audioEnabled);
    }
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId);
    setCopiedPeer(true);
    setTimeout(() => setCopiedPeer(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const getResolutionLabel = () => {
    if (!actualResolution) return null;
    const { width, height } = actualResolution;
    if (width >= 3840 && height >= 2160) return { text: '4K UHD', color: 'text-amber-400' };
    if (width >= 1920) return { text: 'HD 1080p', color: 'text-emerald-400' };
    if (width >= 1280) return { text: 'HD 720p', color: 'text-blue-400' };
    return { text: `${width}×${height}`, color: 'text-slate-300' };
  };

  const resolutionLabel = getResolutionLabel();

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

        {!isBroadcasting && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
            <div className="text-center text-white px-4">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Broadcast Preview</p>
              <p className="text-sm opacity-70">Click "Start Broadcasting" below</p>
            </div>
          </div>
        )}

        {isBroadcasting && (
          <>
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
              <Radio className="h-4 w-4" /> LIVE · {viewerCount} viewer{viewerCount !== 1 ? 's' : ''}
            </div>

            {resolutionLabel && (
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-mono">
                <span className={`font-bold ${resolutionLabel.color}`}>{resolutionLabel.text}</span>
                <span className="ml-2 opacity-70">
                  {currentFacing === 'environment' ? '📷 Back' : '📱 Front'}
                </span>
              </div>
            )}

            {torchEnabled && (
              <div className="absolute bottom-3 left-3 bg-yellow-500 text-slate-900 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Lightbulb className="h-3 w-3" /> TORCH ON
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-slate-800 space-y-3">
        {peerId && (
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Broadcast ID (viewers connect automatically):</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-emerald-400 font-mono truncate">{peerId}</code>
              <button onClick={copyPeerId} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white transition" title="Copy ID">
                {copiedPeer ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-200">{errorMessage}</p>
          </div>
        )}

        {/* Camera Switcher */}
        {cameras.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                {currentFacing === 'environment' ? '📷 Back Camera' : '📱 Front Camera'}
              </label>
              {cameras.length > 1 && (
                <button
                  onClick={quickSwitchCamera}
                  disabled={cameraSwitching || !isBroadcasting}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`h-3 w-3 ${cameraSwitching ? 'animate-spin' : ''}`} />
                  {cameraSwitching ? 'Switching...' : 'Switch'}
                </button>
              )}
            </div>
            <select
              value={selectedCameraId}
              onChange={e => switchCamera(e.target.value)}
              disabled={!isBroadcasting || cameraSwitching}
              className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
            >
              {cameras.map(cam => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label}
                  {cam.label.toLowerCase().includes('front') && ' 📱'}
                  {cam.label.toLowerCase().includes('back') && ' 📷'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Torch Toggle */}
        {torchSupported && isBroadcasting && (
          <button
            onClick={toggleTorch}
            className={`w-full px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              torchEnabled
                ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {torchEnabled ? (
              <><Lightbulb className="h-4 w-4" /> Turn Off Flashlight</>
            ) : (
              <><LightbulbOff className="h-4 w-4" /> Turn On Flashlight</>
            )}
          </button>
        )}

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleVideo}
            disabled={!isBroadcasting}
            className={`p-3 rounded-full transition ${
              videoEnabled && isBroadcasting
                ? 'bg-white text-slate-900 hover:bg-slate-200'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleAudio}
            disabled={!isBroadcasting}
            className={`p-3 rounded-full transition ${
              audioEnabled && isBroadcasting
                ? 'bg-white text-slate-900 hover:bg-slate-200'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            onClick={isBroadcasting ? stopBroadcast : startBroadcast}
            disabled={status === 'connecting'}
            className={`px-6 py-3 rounded-full font-bold transition ${
              isBroadcasting
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            } disabled:opacity-50`}
          >
            {status === 'connecting' ? 'Starting...' : isBroadcasting ? 'Stop Broadcasting' : 'Start Broadcasting'}
          </button>
        </div>

        {status === 'broadcasting' && (
          <p className="text-xs text-emerald-400 text-center">
            ✓ Broadcasting live to website viewers
          </p>
        )}

        {!isBroadcasting && status !== 'error' && (
          <p className="text-xs text-slate-400 text-center">
            💡 Your phone flashlight will automatically turn on when using the back camera
          </p>
        )}
      </div>
    </div>
  );
}
