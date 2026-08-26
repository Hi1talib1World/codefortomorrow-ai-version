import React, { useState } from 'react';
import { Lesson, ProgrammingPath, User } from '../../types';
import { PATHS } from '../../constants';
import api from '../../services/api';
import { useToast } from '../ToastNotification';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, Play, Cpu, Shield, Rocket, Gamepad2, Globe, Star } from 'lucide-react';

interface PersonalizedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onStartLesson: (lesson: Lesson) => void;
  currentPath?: ProgrammingPath['id'];
  initialTopic?: string;
}

const INTEREST_PRESETS = [
  { id: 'game_dev', label: '🎮 Game Combat', prompt: 'Game Combat & Enemy AI' },
  { id: 'ai_robotics', label: '🤖 AI Robotics', prompt: 'AI & Autonomous Robotics' },
  { id: 'space', label: '🚀 Space Navigation', prompt: 'Spacecraft Orbit & Navigation' },
  { id: 'web_apps', label: '🌐 Web APIs', prompt: 'Web APIs & Realtime Apps' },
  { id: 'cybersecurity', label: '🔐 Cybersecurity', prompt: 'Cybersecurity & Key Cipher' },
  { id: 'python_logic', label: '🐍 Logic & Data', prompt: 'Data Analytics & Algorithm Logic' },
];

const SURPRISE_TOPICS = [
  'Mars Rover Lander Physics',
  'Cybersecurity Password Vault',
  'Arcade Snake Game Engine',
  'Smart Home IoT Controller',
  'Neural Network Logic Gate',
  'Crypto Token Exchange Calculator',
  'Space Station Oxygen Telemetry',
  'Autonomous Drone Pathfinding'
];

const PersonalizedContentModal: React.FC<PersonalizedContentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onStartLesson,
  currentPath = 'python',
  initialTopic
}) => {
  const [selectedInterest, setSelectedInterest] = useState<string>(
    initialTopic || INTEREST_PRESETS[Math.floor(Math.random() * INTEREST_PRESETS.length)].prompt
  );
  const [customInterest, setCustomInterest] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<ProgrammingPath['id']>(currentPath);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);
  const { showToast } = useToast();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (initialTopic) {
      setSelectedInterest(initialTopic);
      setCustomInterest('');
    } else if (isOpen) {
      const randomPreset = INTEREST_PRESETS[Math.floor(Math.random() * INTEREST_PRESETS.length)].prompt;
      setSelectedInterest(randomPreset);
    }
  }, [initialTopic, isOpen]);

  const randomizeTopic = () => {
    const randomPrompt = SURPRISE_TOPICS[Math.floor(Math.random() * SURPRISE_TOPICS.length)];
    setSelectedInterest(randomPrompt);
    setCustomInterest('');
    showToast(`🎲 Selected Random Topic: "${randomPrompt}"`, 'info');
  };

  if (!isOpen) return null;

  const activeTopic = customInterest.trim() || selectedInterest;

  const handleGenerate = async () => {
    if (!activeTopic) {
      showToast('Please select or type an interest topic!', 'info');
      return;
    }

    setIsGenerating(true);
    setGeneratedLesson(null);

    try {
      const response = await api.generatePersonalizedContent(activeTopic, selectedPath);
      if (response && response.lesson) {
        setGeneratedLesson(response.lesson);
        if (response.source === 'client_fallback' || response.source === 'simulation') {
          showToast('⚡ Custom AI Lesson Generated (Hors Ligne / Simulée)!', 'info');
        } else {
          showToast('🎉 Custom AI Lesson Generated with Gemini 2.5 Flash!', 'success');
        }
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Failed to generate AI lesson:', error);
      showToast('Failed to generate AI lesson. Try again!', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLaunch = () => {
    if (generatedLesson) {
      onStartLesson(generatedLesson);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-fade-in overflow-y-auto select-none">
      <div className="bg-white dark:bg-[#141824] border-3 border-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-[8px_8px_0px_#0F172A] text-slate-900 dark:text-white space-y-6 animate-pop-in my-8 overflow-visible">
        
        {/* Playful Floating Corner Stickers */}
        <div className="absolute -top-4 -left-4 bg-[#FFE87C] border-2 border-slate-900 rounded-full w-10 h-10 flex items-center justify-center shadow-[3px_3px_0px_0px_#0F172A] text-lg rotate-12 z-30">
          🚀
        </div>
        <div className="absolute -top-3 -right-3 bg-pink-300 border-2 border-slate-900 rounded-full w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A] text-base -rotate-6 z-30">
          🎮
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-3 border-slate-900/10 dark:border-slate-800 pb-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE87C] border border-slate-900 text-slate-900 text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current" />
              AI Personalized Quest
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
              Generate Custom Lesson with COFOTO
            </h2>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Generates custom interactive lessons tailored to your level ({currentUser.progress?.xp || 0} XP) and favorite topics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-rose-100 hover:bg-rose-200 border-2 border-slate-900 text-slate-900 font-bold p-2 rounded-full shadow-[2px_2px_0px_0px_#0F172A] transition-all cursor-pointer shrink-0 ml-3"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* Preset Interest Chips */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider block">
              1. Choose an Interest Topic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INTEREST_PRESETS.map((preset) => {
                const isSelected = selectedInterest === preset.prompt && !customInterest.trim();
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedInterest(preset.prompt);
                      setCustomInterest('');
                    }}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-black transition-all border-2 text-left cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#00D2D3] border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0F172A] scale-105'
                        : 'bg-white dark:bg-slate-900 border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-yellow-50 dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_#0F172A]'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                );
              })}
              <button
                onClick={randomizeTopic}
                className="px-3 py-2.5 rounded-2xl text-xs font-black transition-all border-2 text-left cursor-pointer flex items-center gap-2 bg-[#FFE87C] border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0F172A] hover:scale-105"
              >
                <span>🎲 Surprise Me!</span>
              </button>
            </div>
          </div>

          {/* Custom Interest Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider block">
              Or Type Custom Interest Prompt
            </label>
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="e.g., Mars Rover Simulation, Crypto Portfolio, Chess Bot..."
              className="w-full bg-[#F4F1FA] dark:bg-slate-950 border-2 border-slate-900 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 font-extrabold focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-[3px_3px_0px_0px_#0F172A]"
            />
          </div>

          {/* Target Language Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider block">
              2. Target Language / Path
            </label>
            <select
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value as ProgrammingPath['id'])}
              className="w-full bg-[#F4F1FA] dark:bg-slate-950 border-2 border-slate-900 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white font-extrabold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-[3px_3px_0px_0px_#0F172A]"
            >
              {PATHS.map((p) => {
                const pathName = t(p.titleKey as any) || p.id.replace(/_/g, ' ');
                return (
                  <option key={p.id} value={p.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    {pathName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Action Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#00D2D3] text-slate-900 font-black text-sm uppercase tracking-wider border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span>Crafting AI Lesson...</span>
            ) : (
              <span>Generate Custom Lesson with COFOTO</span>
            )}
          </button>
        </div>

        {/* Generated Lesson Preview Card */}
        {generatedLesson && (
          <div 
            onClick={handleLaunch}
            className="bg-[#FFF8D6] dark:bg-slate-950 border-2 border-slate-900 rounded-2xl p-5 space-y-3.5 animate-fade-in shadow-[4px_4px_0px_0px_#0F172A] cursor-pointer group hover:scale-[1.01] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-900 bg-[#00D2D3] px-2.5 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]">
                  Ready to Launch
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">{(generatedLesson as any).title || generatedLesson.titleKey}</h3>
              </div>
              <span className="text-xs font-black text-slate-900 bg-[#FFE87C] px-2.5 py-1 rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A]">
                {generatedLesson.xp} XP
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-bold line-clamp-3">
              {generatedLesson.introduction?.replace(/### 📌 Key Concepts:|1\.|2\.|3\./g, '')}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch();
              }}
              className="w-full py-3 px-5 rounded-xl bg-slate-900 text-white dark:bg-cyan-400 dark:text-slate-950 font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_#FFE87C] dark:shadow-[3px_3px_0px_0px_#0F172A] cursor-pointer flex items-center justify-center gap-2 group-hover:bg-[#00D2D3] group-hover:text-slate-900 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch AI Lesson in IDE</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedContentModal;
