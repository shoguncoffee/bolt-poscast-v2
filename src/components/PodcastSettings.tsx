// src/components/PodcastSettings.tsx
import React from 'react';
import { Volume2, User, Clock, ChevronUp, ChevronDown, FileText } from 'lucide-react';

interface PodcastSettingsProps {
  title: string;
  setTitle: (v: string) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  voices: { id: string; name: string; accent: string }[];
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  roles: { id: string; name: string; description: string }[];
  speed: number;
  setSpeed: (v: number) => void;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  script: string;
  setScript: (v: string) => void;
}

const PodcastSettings: React.FC<PodcastSettingsProps> = ({
  title,
  setTitle,
  selectedVoice,
  setSelectedVoice,
  voices,
  selectedRole,
  setSelectedRole,
  roles,
  speed,
  setSpeed,
  showAdvanced,
  setShowAdvanced,
  script,
  setScript
}) => {
  voices = voices && voices.length > 0 ? voices : Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1), name: `Speaker ${i + 1}`, accent: '' }));

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold mb-6">Podcast Settings</h2>
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="text-sm font-medium mb-2">Podcast Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your podcast title..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice Selection */}
          <div>
            <label className="text-sm font-medium mb-2 flex items-center">
              <Volume2 className="w-4 h-4 mr-1" />
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id} className="bg-gray-800">
                  {voice.name} {voice.id ? `(speaker: ${voice.id})` : ''}
                </option>
              ))}
            </select>
          </div>
          {/* Role Selection */}
          <div>
            <label className="text-sm font-medium mb-2 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Speaker Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id} className="bg-gray-800">
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Speed Control */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Speaking Speed: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>
      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-6 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        Advanced Settings
      </button>
      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Custom Script (Optional)
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter your custom script or leave blank for AI generation..."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastSettings;
