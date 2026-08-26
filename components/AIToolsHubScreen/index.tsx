import React, { useState, useMemo, useEffect } from 'react';
import { User, Lesson, ProgrammingPath } from '../../types';
import { Heart, Search, Code, Cpu, Gamepad2, Rocket, Shield, BookOpen, Layers, Target, Compass, CheckCircle2, ArrowRight, Star, Smile, MousePointer, Flame, Zap, Bot } from 'lucide-react';
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
  hint?: string;
  hintAr?: string;
  titleAr?: string;
  descriptionAr?: string;
}

const AI_TOOLS: AIToolCard[] = [
  {
    id: 'generate_custom_lesson',
    category: 'Créer',
    title: 'Generate Custom Lesson with COFOTO',
    titleAr: 'إنشاء درس مخصص بواسطة الذكاء الاصطناعي',
    description: 'Créez des cours et défis de code interactifs sur-mesure basés sur vos centres d\'intérêt (Game Dev, Robotique, Espace, Sécurité).',
    descriptionAr: 'أنشئ دروسًا وتحديات برمجية تفاعلية مخصصة بناءً على اهتماماتك (تطوير الألعاب، الروبوتات، الفضاء، الأمن السيبراني).',
    icon: '⚡',
    sticker: '💯',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    promptPreset: '',
    isFeatured: true,
    isPopular: true,
    actionType: 'personalized_lesson',
    hint: 'Tip: Specify your favorite topic (e.g., Space Robotics, Snake Game) to generate a complete interactive lesson with code blueprints!',
    hintAr: 'تلميح: حدد موضوعك المفضل (مثل روبوتات الفضاء، لعبة الثعبان) لتوليد درس تفاعلي مكتمل مع مخططات الكود!'
  },
  {
    id: 'blooket_quiz_gen',
    category: 'Créer',
    title: 'Générateur de Quiz Blooket & Flashcards',
    titleAr: 'مولد الاختبارات والبطاقات التعليمية',
    description: 'Créer des questions et quiz de code interactifs sur une variété de langages et concepts.',
    descriptionAr: 'أنشئ أسئلة واختبارات برمجية تفاعلية لمجموعة متنوعة من اللغات والمفاهيم.',
    icon: '🎮',
    sticker: '⭐',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    promptPreset: 'Interactive Coding Quiz',
    actionType: 'quiz',
    hint: 'Tip: Enter a language or topic (e.g. Python Loops, HTML Tags) to generate multiple-choice quiz questions with instant feedback.',
    hintAr: 'تلميح: أدخل لغة أو موضوعًا (مثل حلقات بايثون، ووسوم HTML) لتوليد أسئلة اختبار تفاعلية مع شرح فوري.'
  },
  {
    id: 'newsletter_gen',
    category: 'Créer',
    title: 'Newsletter de la classe & Portfolio',
    titleAr: 'النشرة البرمجية وتحديثات البورتفوليو',
    description: 'Produire des newsletters engagées de vos sessions de code pour partager vos progrès.',
    descriptionAr: 'أنشئ ملخصات ونشرات تفاعلية لجلسات البرمجة لمشاركة تقدمك وإنجازاتك.',
    icon: '📰',
    sticker: '✏️',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    promptPreset: 'Coding Progress Newsletter',
    actionType: 'chat',
    hint: 'Tip: Mention your latest coding project or streak to generate an engaging progress newsletter.',
    hintAr: 'تلميح: اذكر أحدث مشروع برمجي أو إنجاز حققته لتوليد نشرة ملهمة تعبر عن تقدمك.'
  },
  {
    id: 'consignes_redacteur',
    category: 'Créer',
    title: 'Rédacteur de consignes & exercices',
    titleAr: 'مُصمِم التمارين والتحديات',
    description: 'Générer des consignes concises et faciles à suivre pour vos devoirs et défis.',
    descriptionAr: 'توليد تعليمات وخطوات واضحة ومبسطة للواجبات والتحديات البرمجية.',
    icon: '📝',
    sticker: '📌',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    promptPreset: 'Concise Coding Challenges',
    actionType: 'personalized_lesson',
    hint: 'Tip: Specify beginner or advanced level to receive step-by-step problem specifications and code templates.',
    hintAr: 'تلميح: حدد مستوى الصعوبة (مبتدئ أو متقدم) للحصول على صيغة تحديات واضحة ومقاطع كود جاهزة.'
  },
  {
    id: 'code_blocks_text',
    category: 'Différencier',
    title: 'Texte en blocs & Simplificateur',
    titleAr: 'مُبسط ومُفكك الكود',
    description: 'Découper des textes et blocs de code complexes en sections simples à maîtriser.',
    descriptionAr: 'تقسيم النصوص والكتل البرمجية المعقدة إلى أجزاء بسيطة وسهلة الفهم.',
    icon: '🧩',
    sticker: '🧠',
    badgeBg: 'bg-[#FEF7E0] text-[#B06000] dark:bg-[#3C4043] dark:text-[#FDD663]',
    promptPreset: 'Code Simplification',
    actionType: 'simplifier',
    hint: 'Tip: Paste any complex function to break it down into clean, manageable step-by-step logic.',
    hintAr: 'تلميح: ألصق أي دالة برمجية معقدة لتقسيمها إلى خطوات منطقية وشرح مبسط.'
  },
  {
    id: 'vulgarisateur_tech',
    category: 'Différencier',
    title: 'Vulgarisateur de concepts tech',
    titleAr: 'شارح المفاهيم التقنية',
    description: 'Adapter la complexité d\'un sujet donné au niveau exact de l\'apprenant.',
    descriptionAr: 'تبسيط وتكيف تعقيد أي موضوع تقني يناسب مستوى المتعلم تمامًا.',
    icon: '💡',
    sticker: '🔍',
    badgeBg: 'bg-[#FEF7E0] text-[#B06000] dark:bg-[#3C4043] dark:text-[#FDD663]',
    promptPreset: 'Tech Concept Breakdown',
    actionType: 'simplifier',
    hint: 'Tip: Ask for real-world analogies (e.g., explain variables like labeled storage boxes) for effortless learning.',
    hintAr: 'تلميح: اطلب تشبيهات من الواقع (مثل تشبيه المتغيرات بالصناديق المرقمة) لسهولة الاستيعاب.'
  },
  {
    id: 'donner_du_sens',
    category: 'Différencier',
    title: 'Donner du sens !',
    titleAr: 'ربط الكود بالواقع',
    description: 'Relier les concepts de cours au quotidien et aux passions personnelles.',
    descriptionAr: 'ربط مفاهيم البرمجة بالحياة اليومية والاهتمامات الشخصية والمهنية.',
    icon: '🌍',
    sticker: '🌱',
    badgeBg: 'bg-[#FEF7E0] text-[#B06000] dark:bg-[#3C4043] dark:text-[#FDD663]',
    promptPreset: 'Real-World Applications',
    actionType: 'simplifier',
    hint: 'Tip: Share a domain you love (e.g. Web Apps, Data Analytics) to connect code concepts to real careers.',
    hintAr: 'تلميح: اذكر المجال الذي تحبه (مثل تطبيقات الويب، تحليل البيانات) لربط مفاهيم الكود بتطبيقات واقعية.'
  },
  {
    id: 'smart_goals_planner',
    category: 'Planifier',
    title: 'Objectifs SMART & Plan d\'étude',
    titleAr: 'مخطط الأهداف الذكية SMART',
    description: 'Structurez votre apprentissage du code avec des jalons hebdomadaires réalistes.',
    descriptionAr: 'تنظيم وتخطيط رحلة تعلم البرمجة مع محطات وأهداف أسبوعية واقعية.',
    icon: '🎯',
    sticker: '📅',
    badgeBg: 'bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995]',
    promptPreset: 'SMART Study Goals',
    actionType: 'smart_goals',
    hint: 'Tip: Input your weekly learning targets to receive a 4-week goal checklist with XP rewards.',
    hintAr: 'تلميح: أدخل هدفك الأسبوعي للحصول على خطة دراسية مقسمة على 4 أسابيع مع نقاط XP.'
  },
  {
    id: 'pedagogic_planner',
    category: 'Planifier',
    title: 'Planificateur de projet de code',
    titleAr: 'مخطط المشاريع البرمجية',
    description: 'Organiser des séquences d\'apprentissage complètes étape par étape.',
    descriptionAr: 'تنظيم تسلسل خطوات بناء أي مشروع برمجية خطوة بخطوة.',
    icon: '📋',
    sticker: '⏳',
    badgeBg: 'bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995]',
    promptPreset: 'Project Roadmap Plan',
    actionType: 'planner',
    hint: 'Tip: Input your target project (e.g., Weather App) to receive a full step-by-step roadmap.',
    hintAr: 'تلميح: أدخل اسم المشروع المراد بناؤه (مثل تطبيق الطقس) للحصول على خارطة طريق شاملة.'
  },
  {
    id: 'teacher_assistant_bot',
    category: 'Aider',
    title: 'Assistant & Mentor COFOTO AI',
    titleAr: 'مساعد وموجه COFOTO AI',
    description: 'Obtenez de l\'aide en temps réel pour débugger votre code ou expliquer les erreurs.',
    descriptionAr: 'احصل على مساعدة فورية لتصحيح أخطاء الكود وتفسير الرسائل البرمجية.',
    icon: '🤖',
    sticker: '💬',
    badgeBg: 'bg-[#FCE8E6] text-[#C5221F] dark:bg-[#3C4043] dark:text-[#F28B82]',
    promptPreset: 'Debug Code Error',
    actionType: 'chat',
    hint: 'Tip: Paste error logs or broken code snippets for instant AI diagnosis and clean solutions.',
    hintAr: 'تلميح: ألصق رسالة الخطأ أو الكود المتعثر للحصول على تشخيص فوري وحل برمجي سليم.'
  },
  {
    id: 'quick_concept_explainer',
    category: 'Apprendre',
    title: 'Expliqueur de concepts en 1 min',
    titleAr: 'شارح المفاهيم في دقيقة',
    description: 'Des explications ultra-rapides et illustrées sur la mémoire, les boucles, et la récursivité.',
    descriptionAr: 'شروحات سريعة ومصورة عن الذاكرة، الحلقات التكرارية، والدوال.',
    icon: '⏱️',
    sticker: '⚡',
    badgeBg: 'bg-[#F3E8FD] text-[#8E24AA] dark:bg-[#3C4043] dark:text-[#D7AEFB]',
    promptPreset: 'Quick Concept Explanation',
    actionType: 'chat',
    hint: 'Tip: Name any computer science concept (e.g., Recursion) for a 60-second summary with code.',
    hintAr: 'تلميح: اكتب اسم أي مفهوم برمجي (مثل العودية Recursion) للحصول على ملخص مكثف في دقيقة.'
  },
];

import { useLanguage } from '../../contexts/LanguageContext';

const aiToolsTranslations = {
  en: {
    badge: 'Google AI Powered Tools',
    titlePrefix: 'AI Tools ',
    titleSuffix: 'Hub',
    subtitle: 'Free AI-powered tools designed to save you time and supercharge your coding learning journey!',
    popularTopics: 'Popular Topics',
    searchPlaceholder: 'Search an AI tool...',
    allTools: 'All Tools',
    favorites: '❤️ Favorites',
    popularBadge: 'POPULAR',
    launchGenerator: 'Launch Generator',
    useTool: 'Use Tool',
    noResults: 'No tools match your search',
    resetFilters: 'Reset Filters'
  },
  fr: {
    badge: 'Outils Alimentés par Google AI',
    titlePrefix: 'Hub d\'Outils ',
    titleSuffix: 'IA',
    subtitle: 'Des outils gratuits alimentés par l\'IA conçus pour vous faire gagner du temps et enrichir votre apprentissage du code !',
    popularTopics: 'Sujets Populaires',
    searchPlaceholder: 'Rechercher un outil...',
    allTools: 'Tous les outils',
    favorites: '❤️ Mes Favoris',
    popularBadge: 'POPULAIRE',
    launchGenerator: 'Lancer le générateur',
    useTool: 'Utiliser cet outil',
    noResults: 'Aucun outil ne correspond à votre recherche',
    resetFilters: 'Réinitialiser les filtres'
  },
  ar: {
    badge: 'أدوات مدعومة بالذكاء الاصطناعي من جوجل',
    titlePrefix: 'مركز أدوات ',
    titleSuffix: 'الذكاء الاصطناعي',
    subtitle: 'أدوات مجانية مدعومة بالذكاء الاصطناعي مصممة لتوفير وقتك وتعزيز رحلتك التعليمية في البرمجة!',
    popularTopics: 'المواضيع الشائعة',
    searchPlaceholder: 'ابحث عن أداة ذكاء اصطناعي...',
    allTools: 'جميع الأدوات',
    favorites: '❤️ المفضلة',
    popularBadge: 'شائع',
    launchGenerator: 'تشغيل المولد',
    useTool: 'استخدام هذه الأداة',
    noResults: 'لا توجد أدوات تطابق بحثك',
    resetFilters: 'إعادة ضبط الفلاتر'
  }
};

const categoryLabels: { [key: string]: { [lang: string]: string } } = {
  'Créer': { en: '🎨 Create', fr: '🎨 Créer', ar: '🎨 إنشاء' },
  'Différencier': { en: '🧩 Simplify', fr: '🧩 Différencier', ar: '🧩 تبسيط' },
  'Planifier': { en: '📅 Plan', fr: '📅 Planifier', ar: '📅 تخطيط' },
  'Aider': { en: '🤖 Assist', fr: '🤖 Aider', ar: '🤖 مساعدة' },
  'Apprendre': { en: '💡 Learn', fr: '💡 Apprendre', ar: '💡 تعلم' },
};

const CATEGORIES = [
  { id: 'all' },
  { id: 'favorites' },
  { id: 'Créer' },
  { id: 'Différencier' },
  { id: 'Planifier' },
  { id: 'Aider' },
  { id: 'Apprendre' },
];

const QUICK_PROMPT_PRESETS = [
  { label: '🎮 Physics Engine', prompt: 'Game Physics & Collision Detection' },
  { label: '🤖 Robotics', prompt: 'Sensor Loops & Autonomous Motors' },
  { label: '🚀 Space AI', prompt: 'Orbital Calculations & Satellite Code' },
  { label: '🔐 Cybersecurity', prompt: 'Encryption Basics & Hashing' },
];

const AIToolsHubScreen: React.FC<AIToolsHubScreenProps> = ({
  currentUser,
  onStartLesson,
  onSwitchPath,
}) => {
  const { language } = useLanguage();
  const tHub = aiToolsTranslations[language] || aiToolsTranslations.en;
  const isAr = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  
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

  useEffect(() => {
    try {
      localStorage.setItem('cft_ai_tool_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

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
          (tool.titleAr && tool.titleAr.toLowerCase().includes(q)) ||
          tool.description.toLowerCase().includes(q) ||
          (tool.descriptionAr && tool.descriptionAr.toLowerCase().includes(q)) ||
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Google Gemini AI Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-medium">
                <Bot className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span className="font-semibold tracking-wide">{tHub.badge}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                {tHub.titlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">{tHub.titleSuffix}</span>
              </h1>
              
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
                {tHub.subtitle}
              </p>
            </div>

            {/* Quick Presets Bar */}
            <div className="w-full lg:w-auto bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-4 space-y-2 min-w-[300px]">
              <span className="text-[11px] font-mono font-medium text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider block">
                {tHub.popularTopics}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPT_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => launchPresetTopic(preset.prompt)}
                    className="bg-white dark:bg-[#292A2D] text-[#202124] dark:text-[#E8EAED] border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8] hover:text-[#1A73E8] text-[11px] font-medium px-2.5 py-1 rounded-full transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills & Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              let label = cat.id === 'all' ? tHub.allTools : cat.id === 'favorites' ? tHub.favorites : categoryLabels[cat.id]?.[language] || cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30 font-semibold'
                      : 'bg-white dark:bg-[#292A2D] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#3C4043]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#5F6368] dark:text-[#9AA0A6] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tHub.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-full text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3-Column Google Material 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            const isSpecial = tool.id === 'generate_custom_lesson';

            return (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="group relative bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_4px_12px_rgba(60,64,67,0.12)] cursor-pointer select-none"
              >
                {isSpecial && (
                  <div className="absolute -top-3 right-4 bg-[#1A73E8] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                    {tHub.popularBadge}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full border border-[#E8EAED] dark:border-[#3C4043] ${tool.badgeBg}`}>
                      {categoryLabels[tool.category]?.[language] || tool.category}
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(tool.id, e)}
                      className="p-1.5 rounded-full border border-[#E8EAED] dark:border-[#3C4043] text-[#5F6368] hover:text-[#EA4335] transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-[#EA4335] text-[#EA4335]' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors leading-snug">
                      {isAr && tool.titleAr ? tool.titleAr : tool.title}
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed font-normal line-clamp-3">
                      {isAr && tool.descriptionAr ? tool.descriptionAr : tool.description}
                    </p>

                    {/* Hint Box for AI Tool */}
                    {(tool.hint || tool.hintAr) && (
                      <div className="mt-3 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] font-medium text-amber-800 dark:text-amber-300 space-y-0.5">
                        <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-600 dark:text-amber-400">💡 {isAr ? 'تلميح الاستخدام:' : 'Tool Hint:'}</span>
                        <p className="leading-snug">{isAr && tool.hintAr ? tool.hintAr : tool.hint}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F1F3F4] dark:border-[#3C4043] flex items-center justify-between text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] group-hover:translate-x-0.5 transition-transform">
                  <span>{isSpecial ? tHub.launchGenerator : tHub.useTool}</span>
                  <div className="w-7 h-7 rounded-full bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-8">
            <p className="text-[#202124] dark:text-white font-medium text-sm">
              {tHub.noResults} "{searchQuery}".
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] underline cursor-pointer"
            >
              {tHub.resetFilters}
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
    </div>
  );
};

export default AIToolsHubScreen;
