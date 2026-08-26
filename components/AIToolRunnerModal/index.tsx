import React, { useState } from 'react';
import { User, ProgrammingPath } from '../../types';
import api from '../../services/api';
import { useToast } from '../ToastNotification';
import { X, Copy, Check, Play, Send, Zap, BookOpen, Layers, Loader2 } from 'lucide-react';
import { AIToolCard } from '../AIToolsHubScreen';

import { useLanguage } from '../../contexts/LanguageContext';

const TOOL_PRESETS: Record<string, { labelEn: string; labelAr: string; prompt: string }[]> = {
  generate_custom_lesson: [
    { labelEn: '🎮 Game Physics', labelAr: '🎮 فيزياء الألعاب', prompt: 'Game Physics & Collision Mechanics' },
    { labelEn: '🤖 Space Robotics', labelAr: '🤖 روبوتات الفضاء', prompt: 'Space Robotics & Autonomous Loops' },
    { labelEn: '🔐 Cybersecurity', labelAr: '🔐 الأمن السيبراني', prompt: 'Encryption Basics & Hashing' },
    { labelEn: '🌐 Web Apps', labelAr: '🌐 تطبيقات الويب', prompt: 'Interactive Web Interfaces & APIs' },
  ],
  blooket_quiz_gen: [
    { labelEn: '🐍 Python Basics', labelAr: '🐍 أساسيات بايثون', prompt: 'Python Variables & Control Flow Quiz' },
    { labelEn: '⚡ Functions & Loops', labelAr: '⚡ الدوال والحلقات', prompt: 'Functions, Parameters & While Loops' },
    { labelEn: '🌐 HTML & CSS', labelAr: '🌐 HTML و CSS', prompt: 'Web Layouts, Flexbox & HTML Tags' },
    { labelEn: '🧠 Logic & Algorithms', labelAr: '🧠 الخوارزميات والمنطق', prompt: 'Algorithmic Thinking & Sorting' },
  ],
  teacher_assistant_bot: [
    { labelEn: '🐞 Debug Error', labelAr: '🐞 تصحيح خطأ برمجي', prompt: 'Debug Syntax Error & Fix Exceptions' },
    { labelEn: '💡 Explain Code', labelAr: '💡 شرح الكود', prompt: 'Explain line-by-line how this function works' },
    { labelEn: '🚀 Optimize Performance', labelAr: '🚀 تحسين الأداء', prompt: 'Optimize loop efficiency & memory usage' },
  ],
  default: [
    { labelEn: '🚀 Quick Starter', labelAr: '🚀 بداية سريعة', prompt: 'Generate interactive example with starter code' },
    { labelEn: '💡 Beginner Friendly', labelAr: '💡 مناسب للمبتدئين', prompt: 'Step-by-step simple explanation with examples' },
    { labelEn: '🎯 Core Concepts', labelAr: '🎯 المفاهيم الأساسية', prompt: 'Focus on main programming principles and best practices' },
  ]
};

interface AIToolRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: AIToolCard | null;
  currentUser: User;
  currentPath?: ProgrammingPath['id'];
}

const AIToolRunnerModal: React.FC<AIToolRunnerModalProps> = ({
  isOpen,
  onClose,
  tool,
  currentUser,
  currentPath = 'python'
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [inputText, setInputText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [outputSource, setOutputSource] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { showToast } = useToast();

  if (!isOpen || !tool) return null;

  const toolTitle = isAr && tool.titleAr ? tool.titleAr : tool.title;
  const toolDesc = isAr && tool.descriptionAr ? tool.descriptionAr : tool.description;
  const toolHint = isAr && tool.hintAr ? tool.hintAr : tool.hint;

  const handleGenerate = async (overridePrompt?: string | React.MouseEvent) => {
    const promptStr = typeof overridePrompt === 'string' ? overridePrompt : undefined;
    setIsGenerating(true);
    setGeneratedOutput('');
    setOutputSource('');

    try {
      const promptInput = promptStr || inputText.trim() || tool.promptPreset || tool.title;
      const res = await api.generateToolContent(tool.id, promptInput, currentPath);
      if (res && res.output) {
        setGeneratedOutput(res.output);
        setOutputSource(res.source || 'gemini');
        if (res.source === 'client_fallback' || res.source === 'simulation') {
          showToast(`⚡ ${toolTitle} ${isAr ? 'تم الإنشاء (وضع أوفلاين/محاكاة)' : 'généré (Mode Hors Ligne)'}!`, 'info');
        } else {
          showToast(`🎉 ${toolTitle} ${isAr ? 'تم الإنشاء بنجاح بواسطة الذكاء الاصطناعي!' : 'généré avec l\'IA Gemini!'}`, 'success');
        }
      } else {
        throw new Error('No output returned');
      }
    } catch (error) {
      console.error('Failed to run AI tool:', error);
      const fallbackText = `⚡ ${isAr ? 'النتيجة المولدة لـ' : 'Résultat généré pour'} ${toolTitle} :\n\n📌 ${isAr ? 'الموضوع' : 'Sujet'} : ${inputText || toolTitle}\n\n1. ${isAr ? 'المفهوم الرئيسي' : 'Concept clé'} : ${isAr ? 'تحليل هيكلي للمطلوب بـ' : 'Analyse structurée des exigences en'} ${currentPath.toUpperCase()}.\n2. ${isAr ? 'التعليمات' : 'Instructions'} : ${isAr ? 'إنشاء وحدة برمجية مع معالجة الأخطاء' : 'Créer un module fonctionnel avec gestion d\'erreurs'}.\n3. ${isAr ? 'الخطوة التالية' : 'Prochaine étape'} : ${isAr ? 'اختبار الكود في بيئة التطوير' : 'Valider et tester le code dans l\'IDE'}.`;
      setGeneratedOutput(fallbackText);
      setOutputSource('client_fallback');
      showToast(`⚡ ${toolTitle} ${isAr ? 'تم الإنشاء (وضع أوفلاين)' : 'généré (Mode Hors Ligne)'}!`, 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      showToast(isAr ? 'تم النسخ للحافظة!' : 'Copié dans le presse-papier!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activePresets = TOOL_PRESETS[tool.id] || TOOL_PRESETS.default;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-fade-in overflow-y-auto select-none">
      <div className="bg-white dark:bg-[#141824] border-3 border-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-[8px_8px_0px_#0F172A] text-slate-900 dark:text-white space-y-6 animate-pop-in my-8 overflow-visible">
        
        {/* Corner Sticker Accent */}
        <div className="absolute -top-4 -left-4 bg-[#FFE87C] border-2 border-slate-900 rounded-full w-10 h-10 flex items-center justify-center shadow-[3px_3px_0px_0px_#0F172A] text-lg rotate-12 z-30">
          {tool.sticker || '⚡'}
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-3 border-slate-900/10 dark:border-slate-800 pb-4">
          <div className="space-y-1.5 pr-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-slate-900 text-slate-900 text-xs font-black shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider ${tool.badgeBg}`}>
              {tool.category} • {currentPath.toUpperCase()}
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1 flex items-center gap-2">
              <span>{tool.icon}</span>
              <span>{toolTitle}</span>
            </h2>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {toolDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-rose-100 hover:bg-rose-200 border-2 border-slate-900 text-slate-900 font-bold p-2 rounded-full shadow-[2px_2px_0px_0px_#0F172A] transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Input & Tool Hint */}
        <div className="space-y-4">
          {/* Tool Hint Card inside Modal */}
          {toolHint && (
            <div className="bg-amber-500/10 border-2 border-slate-900 rounded-2xl p-3.5 space-y-1 text-xs shadow-[3px_3px_0px_0px_#0F172A]">
              <span className="font-black uppercase tracking-wider block text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                💡 {isAr ? 'تلميح وإرشادات الاستخدام:' : 'Tool Hint & Usage Tip:'}
              </span>
              <p className="text-slate-800 dark:text-amber-200 font-bold leading-relaxed">
                {toolHint}
              </p>
            </div>
          )}

          {/* 1-Tap Quick Starters */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider block">
              ⚡ {isAr ? 'اختر بنقرة واحدة بدون كتابة:' : '1-Tap Quick Starters:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {activePresets.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(chip.prompt);
                    handleGenerate(chip.prompt);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#FFE87C] hover:bg-[#00D2D3] border-2 border-slate-900 text-slate-900 text-xs font-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  {isAr ? chip.labelAr : chip.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider block">
              {isAr ? 'أو أدخل التوجيهات المخصصة:' : 'Or enter custom instructions:'}
            </label>
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isAr ? `مثال: إنشاء محتوى عن ${tool.promptPreset || 'موضوع من اختيارك'}...` : `Ex: Create custom content about ${tool.promptPreset || 'your topic'}...`}
              className="w-full bg-[#F4F1FA] dark:bg-slate-950 border-2 border-slate-900 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 font-extrabold focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-[3px_3px_0px_0px_#0F172A] resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#00D2D3] text-slate-900 font-black text-sm uppercase tracking-wider border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération en cours par Gemini...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Générer avec {tool.title}</span>
              </>
            )}
          </button>
        </div>

        {/* Skeleton Loading State Shimmer */}
        {isGenerating && (
          <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 rounded-2xl p-5 space-y-3 animate-pulse shadow-[3px_3px_0px_0px_#0F172A]">
            <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-full w-1/3"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded-full w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded-full w-1/2"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800/40 rounded-xl w-full"></div>
          </div>
        )}

        {/* Output Result Card */}
        {generatedOutput && !isGenerating && (
          <div className="bg-[#FFF8D6] dark:bg-slate-950 border-3 border-slate-900 rounded-2xl p-5 space-y-3.5 animate-fade-in shadow-[4px_4px_0px_0px_#0F172A] relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-900 bg-[#00D2D3] px-2.5 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0F172A] flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                {outputSource === 'gemini' ? 'Généré par Gemini 2.5 Flash' : 'Mode Hors Ligne (Simulé)'}
              </span>

              <button
                onClick={handleCopy}
                className="bg-white dark:bg-slate-800 border-2 border-slate-900 px-3 py-1 rounded-xl text-xs font-black text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_#0F172A] hover:bg-[#FFE87C] transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-xl p-4 text-xs font-mono text-slate-900 dark:text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-72 scrollbar-thin selection:bg-[#FFE87C] selection:text-slate-900">
              {generatedOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolRunnerModal;
