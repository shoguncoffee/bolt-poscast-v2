import { Zap, Crown } from 'lucide-react';
import React from 'react';

interface UsageStatsProps {
  usageCount: number;
  onUpgrade: () => void;
}

const UsageStats: React.FC<UsageStatsProps> = ({ usageCount, onUpgrade }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
      Today's Usage
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Podcasts Created</span>
        <span className="font-semibold">{10 - usageCount}/10</span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-300"
          style={{ width: `${((10 - usageCount) / 10) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">
        Resets 1 energy every 3 hours.
      </p>
      <button
        onClick={onUpgrade}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
      >
        <Crown className="w-4 h-4 mr-2" />
        Upgrade for More
      </button>
    </div>
  </div>
);

export default UsageStats;
