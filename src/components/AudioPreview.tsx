import React from 'react';
import { Headphones } from 'lucide-react';
import AudioPlayerWithSpeed from './AudioPlayerWithSpeed.js';

interface AudioPreviewProps {
  audioUrl?: string;
  speed: number;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, speed }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Headphones className="w-5 h-5 mr-2" />
      Audio Preview
    </h3>
    {/* ถ้ามี audioUrl ให้เล่นเสียงจริง */}
    {audioUrl ? (
      <AudioPlayerWithSpeed src={audioUrl} speed={speed} />
    ) : (
      // Waveform Visualization
      <div className="bg-black/30 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-end space-x-1">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-150 opacity-30`}
                style={{ height: `${Math.random() * 60 + 10}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

export default AudioPreview;
