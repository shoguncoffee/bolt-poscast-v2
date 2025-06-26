// src/components/PodcastSettings.tsx
import React from 'react';
import { Volume2, User, Clock } from 'lucide-react';

interface PodcastSettingsProps {
  title: string; // ชื่อพอดแคสต์
  setTitle: (v: string) => void; // ฟังก์ชันสำหรับเปลี่ยนชื่อพอดแคสต์ (ภาษาไทย)
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  voices: { id: string; name: string; accent: string }[];
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  roles: { id: string; name: string; description: string ; style: string}[];
  speed: number;
  setSpeed: (v: number) => void;
  speedDisabled?: boolean; // NEW: disables speed dropdown
  speedError?: string; // NEW: error message for speed
  language: string;
  setLanguage: (v: string) => void;
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
  speedError = "",
  language,
  setLanguage,
}) => {
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
          <div className="relative">
            <label className="text-sm font-medium mb-2 flex items-center">
              <Volume2 className="w-4 h-4 mr-1" />
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
              size={1}
            >
              <option value="" disabled hidden>เลือกเสียงพูด (Speaker)</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id} className="bg-gray-800">
                  {voice.name} - {voice.accent}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-4 w-4 text-purple-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
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
              <option value="" disabled hidden>โปรดเลือกบทบาท</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id} className="bg-gray-800">
                  {/* ชื่อ role เป็น bold, description เป็นบรรทัดใหม่ */}
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Language & Speed Control */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 flex items-center">Language</label>
            <select
              value={language}
              onChange={() => setLanguage('th')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled
            >
              <option value="th">Thai (ไทย)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Speaking Speed: {speed}x
            </label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {Array.from({ length: 8 }, (_, i) => 0.25 + i * 0.25).map((val) => (
                <option key={val} value={val} className="bg-gray-800">
                  {val.toFixed(2)}x
                </option>
              ))}
            </select>
            {speedError && (
              <div className="text-red-400 text-xs mt-1">{speedError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastSettings;