import { StreamPlatform } from '../context/ChurchContext';
import StreamViewer from './StreamViewer';

interface StreamEmbedProps {
  url: string;
  platform: StreamPlatform;
  autoPlay?: boolean;
  peerId?: string;
}

export default function StreamEmbed({ url, platform, autoPlay = true, peerId = '' }: StreamEmbedProps) {
  // Auto-detect platform from URL if not specified
  const detectedPlatform = detectPlatform(url) || platform;

  switch (detectedPlatform) {
    case 'youtube':
      return <YouTubeEmbed url={url} autoPlay={autoPlay} />;
    case 'facebook':
      return <FacebookEmbed url={url} />;
    case 'twitch':
      return <TwitchEmbed url={url} />;
    case 'instagram':
      return <InstagramEmbed url={url} />;
    case 'tiktok':
      return <TikTokEmbed url={url} />;
    case 'local':
      return <StreamViewer peerId={peerId} />;
    case 'custom':
    default:
      return <iframe
        src={url}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Live Stream"
      />;
  }
}

function YouTubeEmbed({ url, autoPlay }: { url: string; autoPlay: boolean }) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">Invalid YouTube URL</div>;

  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoPlay ? '?autoplay=1' : ''}`;
  return (
    <iframe
      src={embedUrl}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="YouTube Live Stream"
    />
  );
}

function FacebookEmbed({ url }: { url: string }) {
  const encodedUrl = encodeURIComponent(url);
  return (
    <iframe
      src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&autoplay=true`}
      className="w-full h-full"
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      title="Facebook Live Stream"
    />
  );
}

function TwitchEmbed({ url }: { url: string }) {
  const channel = extractTwitchChannel(url);
  if (!channel) return <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">Invalid Twitch URL</div>;

  const parentDomain = window.location.hostname;
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}&autoplay=true`}
      className="w-full h-full"
      allowFullScreen
      title="Twitch Live Stream"
    />
  );
}

function InstagramEmbed({ url }: { url: string }) {
  // Instagram Live has limited embedding support
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white p-8">
      <div className="text-center">
        <p className="text-2xl font-bold mb-4">Instagram Live</p>
        <p className="mb-4">Instagram Live streams cannot be embedded directly.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition"
        >
          Watch on Instagram →
        </a>
      </div>
    </div>
  );
}

function TikTokEmbed({ url }: { url: string }) {
  // TikTok Live has limited embedding support
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white p-8">
      <div className="text-center">
        <p className="text-2xl font-bold mb-4">TikTok Live</p>
        <p className="mb-4">TikTok Live streams cannot be embedded directly.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition"
        >
          Watch on TikTok →
        </a>
      </div>
    </div>
  );
}



// Helper functions
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTwitchChannel(url: string): string | null {
  const match = url.match(/twitch\.tv\/([^\/\?]+)/);
  return match ? match[1] : null;
}

export function detectPlatform(url: string): StreamPlatform | null {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  if (url.includes('twitch.tv')) return 'twitch';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  return 'custom';
}
