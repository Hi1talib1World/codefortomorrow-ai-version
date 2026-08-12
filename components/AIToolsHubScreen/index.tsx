import React, { useState, useMemo, useEffect } from 'react';
import { User, Lesson, ProgrammingPath } from '../../types';
import { Sparkles, Heart, Search, Code, Cpu, Gamepad2, Rocket, Shield, BookOpen, Layers, Target, Compass, CheckCircle2, ArrowRight, Star, Smile, MousePointer, Flame, Zap } from 'lucide-react';
import PersonalizedContentModal from '../PersonalizedContentModal';
import AIToolRunnerModal from '../AIToolRunnerModal';

interface AIToolsHubScreenProps {
  currentUser: User;
  onStartLesson: (lesson: Lesson) => void;
  onSwitchPath?: (pathId: ProgrammingPath['id']) => void;
}

export interface AIToolCard {
  id: string;
  category: 'Créer' | 'Différencier' | 'Planifier' | 'Aider' | 'Apprendre';
  title: string;
  description: string;
  icon: string;
  sticker: string;
  badgeBg: string;
  promptPreset?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  actionType: 'personalized_lesson' | 'quiz' | 'planner' | 'simplifier' | 'smart_goals' | 'chat';
}

const AI_TOOLS: AIToolCard[] = [
  {
    id: 'generate_custom_lesson',
    category: 'Créer',
    title: 'Generate Custom Lesson with COFOTO',
    description: 'Créez des cours et défis de code interactifs sur-mesure basés sur vos centres d\'intérêt (Game Dev, Robotique, Espace, Sécurité).',
    icon: '⚡',
    sticker: '💯',
    badgeBg: 'bg-[#FFE87C]',
    promptPreset: 'Game Physics & Mechanics',
    isFeatured: true,
    isPopular: true,
    actionType: 'personalized_lesson',
  },
  {
    id: 'blooket_quiz_gen',
    category: 'Créer',
    title: 'Générateur de Quiz Blooket & Flashcards',
    description: 'Créer des questions et quiz de code interactifs sur une variété de langages et concepts.',
    icon: '🎮',
    sticker: '⭐',
    badgeBg: 'bg-[#FFE87C]',
    promptPreset: 'Interactive Coding Quiz',
    actionType: 'quiz',
  },
  {
    id: 'newsletter_gen',
    category: 'Créer',
    title: 'Newsletter de la classe & Portfolio',
    description: 'Produire des newsletters engagées de vos sessions de code pour partager vos progrès.',
    icon: '📰',
    sticker: '✏️',
    badgeBg: 'bg-[#FFE87C]',
    promptPreset: 'Coding Progress Newsletter',
    actionType: 'chat',
  },
  {
    id: 'consignes_redacteur',
    category: 'Créer',
    title: 'Rédacteur de consignes & exercices',
    description: 'Générer des consignes concises et faciles à suivre pour vos devoirs et défis.',
    icon: '📝',
    sticker: '📌',
    badgeBg: 'bg-[#FFE87C]',
    promptPreset: 'Concise Coding Challenges',
    actionType: 'personalized_lesson',
  },
  {
    id: 'code_blocks_text',
    category: 'Différencier',
    title: 'Texte en blocs & Simplificateur',
    description: 'Découper des textes et blocs de code complexes en sections simples à maîtriser.',
    icon: '🧩',
    sticker: '🧠',
    badgeBg: 'bg-[#FFB1B1]',
    promptPreset: 'Code Simplification',
    actionType: 'simplifier',
  },
  {
    id: 'vulgarisateur_tech',
    category: 'Différencier',
    title: 'Vulgarisateur de concepts tech',
    description: 'Adapter la complexité d\'un sujet donné au niveau exact de l\'apprenant.',
    icon: '💡',
    sticker: '🔍',
    badgeBg: 'bg-[#FFB1B1]',
    promptPreset: 'Tech Concept Breakdown',
    actionType: 'simplifier',
  },
  {
    id: 'donner_du_sens',
    category: 'Différencier',
    title: 'Donner du sens !',
    description: 'Relier les concepts de cours au quotidien et aux passions personnelles.',
    icon: '🚀',
    sticker: '🔥',
    badgeBg: 'bg-[#FFB1B1]',
    promptPreset: 'Real-world Tech Applications',
    actionType: 'personalized_lesson',
  },
  {
    id: 'activites_apercu',
    category: 'Planifier',
    title: 'Aperçu des activités de classe',
    description: 'Examiner les tendances de maîtrise et la performance d\'apprentissage.',
    icon: '📊',
    sticker: '📈',
    badgeBg: 'bg-[#B5F2D6]',
    promptPreset: 'Learning Progress Summary',
    actionType: 'planner',
  },
  {
    id: 'discussion_amorces',
    category: 'Planifier',
    title: 'Amorces de discussion tech',
    description: 'Créer des amorces engageantes pour stimuler des réflexions riches en groupe.',
    icon: '💬',
    sticker: '💭',
    badgeBg: 'bg-[#B5F2D6]',
    promptPreset: 'Software Architecture Discussion',
    actionType: 'chat',
  },
  {
    id: 'bilan_fin_cours',
    category: 'Planifier',
    title: 'Bilan de fin de cours',
    description: 'Créer des évaluations rapides en fin de module pour vérifier la compréhension.',
    icon: '📋',
    sticker: '✅',
    badgeBg: 'bg-[#B5F2D6]',
    promptPreset: 'End of Course Quiz',
    actionType: 'quiz',
  },
  {
    id: 'plan_individualise',
    category: 'Aider',
    title: 'Plan d\'apprentissage individualisé',
    description: 'Faciliter la création de plans de révision personnalisés selon vos objectifs.',
    icon: '🎯',
    sticker: '🎯',
    badgeBg: 'bg-[#D8CEF6]',
    promptPreset: 'Individual Revision Plan',
    actionType: 'smart_goals',
  },
  {
    id: 'smart_objectifs',
    category: 'Aider',
    title: 'Rédacteur d\'objectifs SMART',
    description: 'Créer un plan d\'action avec des objectifs spécifiques, mesurables et atteignables.',
    icon: '🏆',
    sticker: '🥇',
    badgeBg: 'bg-[#D8CEF6]',
    promptPreset: 'SMART Coding Goals',
    actionType: 'smart_goals',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tous (12)' },
  { id: 'favorites', label: 'Mes favoris' },
  { id: 'Créer', label: 'Créer' },
  { id: 'Différencier', label: 'Différencier' },
  { id: 'Planifier', label: 'Planifier' },
  { id: 'Aider', label: 'Aider' },
  { id: 'Apprendre', label: 'Apprendre' },
];

const QUICK_PROMPT_PRESETS = [
  { label: '🎮 Game Physics', prompt: 'Game Physics & Mechanics' },
  { label: '🤖 Autonomous Robotics', prompt: 'AI & Autonomous Robotics' },
  { label: '🚀 Space Exploration', prompt: 'Spacecraft Systems & Astronomy' },
  { label: '🌐 Fullstack Web Apps', prompt: 'Web Apps & APIs' },
  { label: '🔐 Cybersecurity & Hacking', prompt: 'Cybersecurity & Cryptography' },
];

const TILT_ROTATIONS = [
  '-rotate-1',
  'rotate-1',
  '-rotate-2',
  'rotate-2',
  '-rotate-[0.5deg]',
  'rotate-[0.5deg]',
];

const AIToolsHubScreen: React.FC<AIToolsHubScreenProps> = ({ currentUser, onStartLesson, onSwitchPath }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  
  // Persistent favorites state in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cft_ai_tool_favorites');
      return saved ? JSON.parse(saved) : ['generate_custom_lesson'];
    } catch {
      return ['generate_custom_lesson'];
    }
  });
  
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [runnerTool, setRunnerTool] = useState<AIToolCard | null>(null);
  const [presetTopic, setPresetTopic] = useState<string>('');

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cft_ai_tool_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Debounce search query to prevent unnecessary re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Optimized tool filtering using useMemo
  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter(tool => {
      if (activeCategory === 'favorites') {
        if (!favorites.includes(tool.id)) return false;
      } else if (activeCategory !== 'all') {
        if (tool.category !== activeCategory) return false;
      }

      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase().trim();
        return (
          tool.title.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [activeCategory, debouncedQuery, favorites]);

  const handleToolClick = (tool: AIToolCard) => {
    if (tool.id === 'generate_custom_lesson' || tool.actionType === 'personalized_lesson') {
      if (tool.promptPreset) {
        setPresetTopic(tool.promptPreset);
      }
      setIsAIModalOpen(true);
    } else {
      setRunnerTool(tool);
    }
  };

  const launchPresetTopic = (prompt: string) => {
    setPresetTopic(prompt);
    setIsAIModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-[#0F172A] dark:text-slate-100 p-4 sm:p-8 space-y-8 animate-fade-in font-sans selection:bg-[#FFE87C] selection:text-[#0F172A]">
      
      {/* Top Playful Hero Header with Floating Avatar, Speech Bubble & Live Ticker */}
      <div className="space-y-4 border-b-4 border-slate-900 dark:border-slate-800 pb-6 relative overflow-visible">
        
        {/* Floating Avatar Speech Bubble Accent */}
        <div className="absolute -top-3 right-4 sm:right-12 hidden lg:flex items-center gap-2.5 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] -rotate-3 z-20 hover:scale-105 transition-transform cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#FFE87C] border border-slate-900 flex items-center justify-center font-black text-sm shadow-[1px_1px_0px_0px_#0f172a]">
            👩‍🏫
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">
            Besoin d'un cours sur-mesure ? 💡
          </span>
        </div>

        {/* Hand-Drawn Cursor Callout Pointing to Generator */}
        <div className="absolute top-10 right-64 hidden xl:flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-cyan-300 pointer-events-none rotate-6 z-20">
          <MousePointer className="w-4 h-4 fill-slate-900 dark:fill-cyan-300 text-slate-900 dark:text-cyan-300 animate-bounce" />
          <span className="bg-[#FFE87C] dark:bg-slate-900 text-slate-900 dark:text-cyan-300 px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            Testez cet outil ! ⚡
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#FFE87C] border-2 border-slate-900 px-3.5 py-1 rounded-full text-xs font-black text-slate-900 shadow-[2.5px_2.5px_0px_0px_#0f172a] uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current text-slate-900" />
            Outils COFOTO AI
          </span>

          <span className="bg-[#00D2D3] border-2 border-slate-900 px-3 py-1 rounded-full text-[11px] font-black text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Powered by Gemini 2.5 Flash
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          Outils pour les apprenants & enseignant·es
        </h1>
        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-300 max-w-3xl leading-relaxed">
          Des outils gratuits alimentés par l'IA conçus pour vous faire gagner du temps et enrichir votre apprentissage du code !
        </p>

        {/* Quick Interest Prompt Pills Bar */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-black text-slate-500 uppercase shrink-0">Sujets populaires :</span>
          {QUICK_PROMPT_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => launchPresetTopic(preset.prompt)}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:bg-[#FFE87C] hover:text-slate-900 transition-all cursor-pointer shrink-0"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Bar: Category Pills + Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar py-1">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4.5 py-2 rounded-full text-xs font-black transition-all shrink-0 border-2 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#00D2D3] text-slate-900 border-slate-900 shadow-[3px_3px_0px_0px_#000] scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border-slate-900 dark:border-slate-800 hover:bg-[#FFE87C] hover:text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Top Right Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un outil..."
            className="w-full bg-[#F3EFE0] dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-full pl-10 pr-4 py-2.5 text-xs font-black text-slate-900 dark:text-white placeholder-slate-500 shadow-[3px_3px_0px_0px_#000]"
          />
          <Search className="w-4 h-4 text-slate-900 dark:text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* 3-Column Dynamic Playful Cards Grid with Varied Tilts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
        {filteredTools.map((tool, idx) => {
          const isFav = favorites.includes(tool.id);
          const isSpecial = tool.id === 'generate_custom_lesson';
          const tiltClass = TILT_ROTATIONS[idx % TILT_ROTATIONS.length];

          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`group relative bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1E293B] dark:shadow-[5px_5px_0px_0px_#06b6d4] hover:-translate-x-1 hover:-translate-y-1.5 hover:shadow-[9px_9px_0px_0px_#1E293B] transition-all duration-200 cursor-pointer flex flex-col justify-between select-none overflow-visible ${tiltClass} ${
                isSpecial ? 'bg-[#FFF8D6] dark:bg-[#0d1527] border-3 border-slate-900' : ''
              }`}
            >
              {/* Overlapping Callout Badge on Special Featured Card */}
              {isSpecial && (
                <div className="absolute -top-4 -right-3 bg-[#FF5964] text-white font-black text-[10px] uppercase px-3.5 py-1 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] rotate-6 z-30 animate-bounce">
                  ✨ TRY THIS!
                </div>
              )}

              {/* Graphic Corner Emoji Sticker Anchor */}
              <div className="absolute -bottom-2.5 -right-2.5 bg-white dark:bg-slate-800 border-2 border-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_#0f172a] z-20 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                {tool.sticker}
              </div>

              <div className="space-y-3.5">
                {/* Card Header: Category Tag & Favorite Heart Button */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] ${tool.badgeBg}`}>
                    {tool.category}
                  </span>

                  <button
                    onClick={(e) => toggleFavorite(tool.id, e)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} />
                  </button>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-bold line-clamp-3">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 mt-4 border-t-2 border-slate-900/10 dark:border-slate-800 flex items-center justify-between text-xs font-black text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                <span>{isSpecial ? 'Lancer le générateur' : 'Utiliser cet outil'}</span>
                <div className="w-8 h-8 rounded-full bg-[#00D2D3] dark:bg-cyan-400 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] group-hover:bg-[#FFE87C] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 border-3 border-slate-900 rounded-3xl p-8 shadow-[5px_5px_0px_0px_#0f172a]">
          <p className="text-slate-900 dark:text-slate-300 font-black text-sm">
            Aucun outil ne correspond à votre recherche "{searchQuery}".
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="text-xs font-black text-blue-600 dark:text-cyan-400 underline cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* AI Lesson Generator Modal */}
      <PersonalizedContentModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentUser={currentUser}
        currentPath={currentUser.currentPath || 'python'}
        onStartLesson={onStartLesson}
        initialTopic={presetTopic}
      />

      {/* Specialized AI Tool Runner Modal */}
      <AIToolRunnerModal
        isOpen={!!runnerTool}
        onClose={() => setRunnerTool(null)}
        tool={runnerTool}
        currentUser={currentUser}
        currentPath={currentUser.currentPath || 'python'}
      />
    </div>
  );
};

export default AIToolsHubScreen;
