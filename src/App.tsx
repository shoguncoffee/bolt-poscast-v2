import { useState, useEffect } from 'react';
import {
  Radio,
  Crown,
  ArrowLeft,
  Rocket,
  FileText
} from 'lucide-react';
import Navbar from "./components/Navbar.js";
import PodcastSettings from './components/PodcastSettings.js';
import AIGenerator from './components/AIGenerator.js';
import { generatePodcastWithAudio, fetchBotnoiRoles } from './api.js';
import AudioPreview from './components/AudioPreview.js';
import ExportShare from './components/ExportShare.js';
import UsageStats from './components/UsageStats.js';
import PricingPlans from './components/PricingPlans.js';

interface GeneratedScript {
  title: string;
  content: string;
  speakers: { name: string; role: string }[];
  audioUrl?: string; // เพิ่ม property สำหรับ audio จริง
}

type CurrentPage = 'home' | 'payment';

function App() {
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
  const [usageCount, setUsageCount] = useState(10); // Remaining uses
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [currentPlan] = useState('basic'); // removed setCurrentPlan (unused)
  const [language, setLanguage] = useState('th');
  
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      period: '',
      description: 'Perfect for getting started',
      features: [
        '10 podcasts per day',
        '5 voice options',
        'Basic audio quality',
        'MP3 download only',
        'Community support',
        '5-minute max length'
      ],
      limitations: [
        'Limited voice selection',
        'Basic audio quality',
        'Watermark included'
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-500 cursor-not-allowed',
      popular: false,
      icon: Radio
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious podcast creators',
      features: [
        '100 podcasts per day',
        '15+ premium voices',
        'High-quality audio',
        'All download formats',
        'Priority support',
        '30-minute max length',
        'Custom voice training',
        'Advanced editing tools',
        'Analytics dashboard'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: true,
      icon: Crown
    },
    {
      id: 'extreme',
      name: 'Extreme',
      price: '$49',
      period: '/month',
      description: 'For professional studios',
      features: [
        'Unlimited podcasts',
        '50+ premium voices',
        'Studio-quality audio',
        'All formats + lossless',
        '24/7 dedicated support',
        'Unlimited length',
        'Custom voice cloning',
        'Advanced AI features',
        'White-label solution',
        'API access',
        'Team collaboration',
        'Custom integrations'
      ],
      limitations: [],
      buttonText: 'Upgrade to Extreme',
      buttonStyle: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      popular: false,
      icon: Rocket
    }
  ];

  // โหลด voice/role จาก API (หรือ mock)
  useEffect(() => {
    fetchBotnoiRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  // สร้าง Podcast Script และ Audio ด้วย API
  const canGenerate = !!title.trim() && !!selectedVoice && !!selectedRole && !!speed && !!language && !!promptIdea.trim();

  const generatePodcast = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setUsageCount(prev => Math.max(0, prev - 1));
    try {
      let fullPrompt = promptIdea.trim();
      if (script.trim()) {
        fullPrompt += '\n\n' + script.trim();
      }
      const { script: content, audioUrl } = await generatePodcastWithAudio({
        topic: fullPrompt,
        speaker: selectedVoice || '1',
        speed,
        type_media: 'mp4',
        save_file: true,
        language,
        role: selectedRole || undefined,
      });
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
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการสร้าง Podcast: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
    setShowShareMenu(false);
  };

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to ${planId}`);
    // Here you would integrate with your payment processor
  };

  const renderPaymentPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Studio</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Botcats
                </h1>
                <p className="text-sm text-gray-400">Pricing Plans</p>
              </div>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PricingPlans
          pricingPlans={pricingPlans}
          currentPlan={currentPlan}
          handleUpgrade={handleUpgrade}
        />
      </div>
    </div>
  );

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
              voices={Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1), name: `Speaker ${i + 1}`, accent: '' }))}
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
              usageCount={usageCount}
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
            {/* Audio Player */}
            {generatedScript && (
              <AudioPreview
                audioUrl={generatedScript.audioUrl}
                speed={speed}
                podcastTitle={generatedScript.title}
              />
            )}

            {/* Download & Share */}
            {generatedScript && (
              <ExportShare
                audioAvailable={!!generatedScript.audioUrl}
                showShareMenu={showShareMenu}
                setShowShareMenu={setShowShareMenu}
                handleShare={handleShare}
                audioUrl={generatedScript.audioUrl}
                podcastTitle={generatedScript.title}
              />
            )}

            {/* Usage Stats */}
            <UsageStats usageCount={usageCount} onUpgrade={() => setCurrentPage('payment')} />
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
    </div>
  );

  return currentPage === 'payment' ? renderPaymentPage() : renderHomePage();
}

export default App;