// src/components/AIGenerator.tsx
import React from 'react';
import { Sparkles, ChevronUp, ChevronDown, FileText } from 'lucide-react';

interface AIGeneratorProps {
  promptIdea: string;
  setPromptIdea: (v: string) => void;
  generatePodcast: () => void;
  isGenerating: boolean;
  usageCount: number;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  script: string;
  setScript: (v: string) => void;
  canGenerate: boolean;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({
  promptIdea,
  setPromptIdea,
  generatePodcast,
  isGenerating,
  usageCount,
  showAdvanced,
  setShowAdvanced,
  script,
  setScript,
  canGenerate,
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
    <h2 className="text-xl font-semibold mb-6 flex items-center">
      <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
      AI Podcast Generator
    </h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Prompt Your Podcast Idea</label>
        <textarea
          value={promptIdea}
          onChange={(e) => setPromptIdea(e.target.value)}
          placeholder="Describe your podcast topic, theme, or specific points you want to cover..."
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
        />
      </div>
      {/* Advanced Toggle & Settings moved above Generate Podcast */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-2 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        Advanced Settings
      </button>
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
              placeholder="Enter your own custom additional prompts to orient the content."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      )}
      <button
        onClick={generatePodcast}
        disabled={!canGenerate || isGenerating || usageCount <= 0}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Podcast
          </>
        )}
      </button>
    </div>
  </div>
);

export default AIGenerator;
