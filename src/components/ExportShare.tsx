import { Share2, Music, Download } from 'lucide-react';
import React from 'react';

interface ExportShareProps {
  audioAvailable: boolean;
  showShareMenu: boolean;
  setShowShareMenu: (v: boolean) => void;
  handleShare: (platform: string) => void;
  audioUrl?: string;
  podcastTitle?: string;
}

const ExportShare: React.FC<ExportShareProps> = ({
  audioAvailable,
  showShareMenu,
  setShowShareMenu,
  handleShare,
  audioUrl,
  podcastTitle = 'podcast',
}) => {
  // Download handler moved from AudioPreview
  const handleDownload = async () => {
    if (!audioUrl) return;
    const safeTitle = podcastTitle.trim() ? podcastTitle.replace(/[^a-zA-Z0-9ก-๙ _-]/g, '').replace(/\s+/g, '_') : 'podcast';
    const fileName = `${safeTitle}.mp4`;
    const downloadUrl = `/api/proxy-audio?url=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(fileName)}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
        <Share2 className="w-5 h-5 mr-2" />
        Export & Share
      </h3>
      <div className="space-y-3">
        {/* Download Button */}
        <div className="flex items-center gap-2 justify-center">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1 disabled:opacity-50"
            onClick={handleDownload}
            disabled={!audioAvailable}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        {/* Share Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            disabled={!audioAvailable}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </button>
          {showShareMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-10">
              {['Spotify', 'Apple Podcasts', 'Google Podcasts', 'Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 flex items-center"
                >
                  <Music className="w-4 h-4 mr-3" />
                  {platform}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportShare;
