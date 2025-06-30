import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Crown,
  Zap,
  Headphones,
  FileText,
  Download,
} from 'lucide-react';
import Navbar from "./components/Navbar.js";
import PodcastSettings from './components/PodcastSettings.js';
import AIGenerator from './components/AIGenerator.js';
import ExportShare from './components/ExportShare.js';
import PricingPage from './components/PricingPage.js';
import Footer from './components/Footer.js';
import { generatePodcastWithAudio, get_speaker_voices } from './api.js';
import { ROLES } from './constants/roles.js';

interface GeneratedScript {
  title: string;
  content: string;
  speakers: { name: string; role: string }[];
  audioUrl?: string; // เพิ่ม property สำหรับ audio จริง
}

type CurrentPage = 'home' | 'payment';

// Helper function to format time
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const voices = await get_speaker_voices();
const roles = ROLES;

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [title, setTitle] = useState(''); // เตรียมใช้ API
  const [selectedVoice, setSelectedVoice] = useState(''); // เตรียมใช้ API
  const [selectedRole, setSelectedRole] = useState(''); // เตรียมใช้ API
  const [speed, setSpeed] = useState(1.0); // สามารถ set เป็น null ได้ถ้าต้องการ
  const [script, setScript] = useState(''); // สำหรับ prompt รอง (Advanced)
  const [promptIdea, setPromptIdea] = useState(''); // เตรียมใช้ API
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [credits, setCredits] = useState(0); // Credits available (start with 500)
  const [currentPlan] = useState('basic'); // removed setCurrentPlan (unused)
  const [language, setLanguage] = useState('th');

  // สร้าง Podcast Script และ Audio ด้วย API
  const canGenerate = !!title.trim() && !!selectedVoice && !!selectedRole && !!speed && !!language && !!promptIdea.trim() && credits >= 200;

  const generatePodcast = async () => {
    if (!canGenerate) return;

    if (credits < 200) {
      alert('ไม่มีเครดิตเพียงพอ! คุณต้องมีอย่างน้อย 200 เครดิตเพื่อสร้าง Podcast');
      return;
    }

    setIsGenerating(true);
    setCredits(prev => prev - 200); // Deduct 200 credits per generation

    try {
      // รวม prompt หลักและ prompt รอง (ถ้ามี)
      let fullPrompt = promptIdea.trim();

      if (script.trim()) {
        fullPrompt += '\n\n' + script.trim();
      }

      const { script: content, audioUrl } = await generatePodcastWithAudio(
        fullPrompt,
        selectedRole,
        selectedVoice,
        speed,
        language,
      );

      const mockScript = {
        title: title || 'AI Generated Podcast',
        content,
        speakers: [
          {
            name: selectedVoice || 'Speaker',
            role: selectedRole || 'Host',
          },
        ],
        audioUrl,
      };
      setGeneratedScript(mockScript);

      // Reset audio states
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
    catch (err) {
      alert('เกิดข้อผิดพลาดในการสร้าง Podcast: ' + (err instanceof Error ? err.message : String(err)));
    }
    finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!generatedScript?.audioUrl) return;

    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    }
    else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to ${planId}`);

    // Define credit mapping for each plan
    const planCredits: { [key: string]: number } = {
      'basic': 3,
      'basic+': 500,  // Updated to match PricingPage
      'pro': 1000,    // Updated to match PricingPage
      'pro+ ': 2500,
      'Premium': 5000,
      'Elite': 50000
    };

    // Get credits for the selected plan
    const creditsToAdd = planCredits[planId] || 0;

    if (creditsToAdd > 0) {
      // Add credits to existing credits
      setCredits(prev => prev + creditsToAdd);
      // Go back to home page to show updated usage
      setCurrentPage('home');
      console.log(`Added ${creditsToAdd} credits to your account`);
    }
  };

  async function handleDownload() {
    const audioUrl = generatedScript?.audioUrl;
    if (!audioUrl) return;

    const title_element = document.getElementById('podcast-title') as HTMLInputElement;
    const title = title_element.value || 'podcast';

    const safeTitle = title.trim() ? title.replace(/[^a-zA-Z0-9ก-๙ _-]/g, '').replace(/\s+/g, '_') : 'podcast';
    const fileName = `${safeTitle}.wav`;
    const downloadUrl = `/api/proxy-audio?url=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(fileName)}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.click();
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Podcast Settings */}
            <PodcastSettings
              title={title}
              setTitle={setTitle}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              voices={voices}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              roles={roles}
              speed={speed}
              setSpeed={setSpeed}
              speedError={''}
              language={language}
              setLanguage={setLanguage}
            />
            {/* AI Generation */}
            <AIGenerator
              promptIdea={promptIdea}
              setPromptIdea={setPromptIdea}
              generatePodcast={generatePodcast}
              isGenerating={isGenerating}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              script={script}
              setScript={setScript}
              canGenerate={canGenerate}
            />
            {/* Generated Script Display */}
            {generatedScript && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Generated Script
                </h2>

                <div className="bg-black/30 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-purple-300">{generatedScript.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{generatedScript.content}</p>

                  {generatedScript.speakers.map((speaker, index) => (
                    <div key={index} className="border-l-2 border-purple-500 pl-4">
                      <p className="text-sm text-purple-400 font-medium">{speaker.name} ({speaker.role})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Audio Player & Controls */}
          <div className="space-y-6">

            {/* Usage Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Today's Usage
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Credit</span>
                  <span className="font-semibold">{credits}</span>
                </div>

                <button
                  onClick={() => setCurrentPage('payment')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade for More
                </button>
              </div>
            </div>

            {/* Audio Player */}
            {generatedScript && (
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center justify-center text-white">
                  <Headphones className="w-6 h-6 mr-3 text-purple-300" />
                  Your Audio
                </h3>

                {/* ถ้ามี audioUrl ให้เล่นเสียงจริง */}
                {generatedScript.audioUrl ? (
                  <div className="space-y-6">

                    {/* Play Button - Separated Row */}
                    <div className="flex justify-center">
                      <button
                        onClick={togglePlayback}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-200 border-2 border-white/20 group"
                      >
                        <div className="relative">
                          {isPlaying ? (
                            <Pause className="w-6 h-6 drop-shadow-lg" />
                          ) : (
                            <Play className="w-6 h-6 drop-shadow-lg ml-0.5" />
                          )}
                          <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </button>
                    </div>

                    {/* Custom Audio Player */}
                    <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-xl p-4 border border-purple-500/30">
                      {/* Hidden native audio element */}
                      <audio
                        ref={(audio) => {
                          if (audio) {
                            audio.addEventListener('play', () => setIsPlaying(true));
                            audio.addEventListener('pause', () => setIsPlaying(false));
                            audio.addEventListener('ended', () => setIsPlaying(false));
                            audio.addEventListener('loadedmetadata', () => {
                              setDuration(audio.duration || 0);
                            });
                            audio.addEventListener('timeupdate', () => {
                              setCurrentTime(audio.currentTime || 0);
                            });
                          }
                        }}
                        src={generatedScript.audioUrl}
                        style={{ display: 'none' }}
                        id='audio'
                      />

                      {/* Custom Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-purple-200 mb-2">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div className="relative h-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100 ease-out"
                            style={{
                              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                              transform: 'translateX(0)'
                            }}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1 disabled:opacity-50"
                        onClick={handleDownload}
                        disabled={!generatedScript.audioUrl}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-6">

                    {/* Placeholder Play Button */}
                    <div className="flex justify-center">
                      <button
                        disabled
                        className="bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-2 border-white/10 opacity-50 cursor-not-allowed"
                      >
                        <Play className="w-6 h-6 ml-0.5" />
                      </button>
                    </div>

                    {/* Enhanced placeholder */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-8 border border-purple-500/20">
                      <div className="flex items-center justify-center h-24">
                        <div className="text-center">
                          <Headphones className="w-12 h-12 text-purple-300 mx-auto mb-3 opacity-60" />
                          <p className="text-purple-200 text-base opacity-60">Generate audio to see player</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Download & Share */}
            {generatedScript && (
              <ExportShare
              />
            )}

          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5CF6, #EC4899);
          cursor: pointer;
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5CF6, #EC4899);
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>

      <Footer />
    </div>
  );

  return currentPage === 'payment' ? (
    <PricingPage
      onBack={() => setCurrentPage('home')}
      onUpgrade={handleUpgrade}
      currentPlan={currentPlan}
    />
  ) : (
    renderHomePage()
  );
}