/**
 * LessonNode/index.tsx
 * ─────────────────────
 * A single interactive node on the lesson roadmap.
 * Duolingo-style: large circle with progress ring + interactive popover tooltip card.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Lesson } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Play, RotateCcw } from 'lucide-react';

interface LessonNodeProps {
  lesson: Lesson;
  isCompleted: boolean;
  isUnlocked: boolean;
  isNext: boolean;
  onStartLesson: (lesson: Lesson) => void;
  isTooltipOpen?: boolean;
  onToggleTooltip?: (open: boolean) => void;
}

/** Map from lesson.icon key → emoji for the node center. */
const EMOJI_MAP: Record<string, string> = {
  brain: '🧠',
  star: '⭐',
  trophy: '🏆',
  book: '📚',
  code: '💻',
  math: '∑',
  web: '🌐',
  game: '🎮',
  camel: '🐪',
  tea: '🫖',
  zellige: '🧱',
};

const LessonNode: React.FC<LessonNodeProps> = ({
  lesson,
  isCompleted,
  isUnlocked,
  isNext,
  onStartLesson,
  isTooltipOpen,
  onToggleTooltip,
}) => {
  const { t } = useLanguage();
  const [internalShowTooltip, setInternalShowTooltip] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const showTooltip = isTooltipOpen !== undefined ? isTooltipOpen : internalShowTooltip;

  const toggleTooltip = (val?: boolean) => {
    const nextVal = val !== undefined ? val : !showTooltip;
    if (onToggleTooltip) {
      onToggleTooltip(nextVal);
    } else {
      setInternalShowTooltip(nextVal);
    }
  };

  const emoji = EMOJI_MAP[lesson.icon] ?? '';
  const lessonTitle = t(lesson.titleKey as any) || lesson.titleKey;

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        toggleTooltip(false);
      }
    };
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const circleBg = isCompleted
    ? 'bg-[#58cc02]'
    : isNext
      ? (lesson.nodeType === 'game' ? 'bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-purple-400' : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600')
      : isUnlocked
        ? (lesson.nodeType === 'game' ? 'bg-gradient-to-tr from-purple-400 to-pink-400' : 'bg-white dark:bg-slate-800')
        : 'bg-slate-200 dark:bg-slate-900';

  const ringColor = isCompleted
    ? 'stroke-[#58cc02]'
    : 'stroke-slate-200 dark:stroke-slate-700';

  const shadowStyle = isCompleted
    ? 'shadow-[0_6px_0_#46a302]'
    : isNext
      ? 'shadow-[0_6px_0_#94a3b8] dark:shadow-[0_6px_0_#334155]'
      : isUnlocked
        ? 'shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_6px_0_#1e293b]'
        : 'shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#1e293b]';

  const handleNodeClick = () => {
    toggleTooltip();
  };

  const handleActionClick = () => {
    if (isUnlocked) {
      toggleTooltip(false);
      onStartLesson(lesson);
    }
  };

  return (
    <div ref={nodeRef} className={`relative flex flex-col items-center select-text ${showTooltip ? 'z-[100]' : 'z-10'}`}>

      {/* "START" static badge above next lesson */}
      {isNext && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-3 py-1 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 uppercase tracking-widest flex items-center gap-1 whitespace-nowrap select-none"
        >
          START 🚀
        </div>
      )}

      {/* Progress ring + circle button */}
      <div className="relative">
        {/* SVG progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="32" fill="none" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="5" />
          {(isCompleted || isNext) && (
            <circle
              cx="36" cy="36" r="32"
              fill="none"
              className={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (isCompleted ? 0 : 0.6)}`}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          )}
        </svg>

        {/* Main circle button */}
        <motion.button
          onClick={handleNodeClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={`
            relative w-[68px] h-[68px] rounded-full flex items-center justify-center
            transition-all duration-200 font-black m-[2px]
            ${circleBg} ${shadowStyle}
            cursor-pointer
          `}
        >
          {isCompleted ? (
            <span className="text-white text-3xl font-black drop-shadow-sm">✓</span>
          ) : !isUnlocked ? (
            <Lock className="w-6 h-6 text-slate-400 opacity-60" />
          ) : emoji === '' ? (
            <img 
              src="/assets/images/trophy.png" 
              alt="Trophy" 
              className="w-10 h-10 object-contain select-none"
            />
          ) : (
            <span className={`text-3xl select-none drop-shadow-sm ${lesson.nodeType === 'game' ? '' : 'filter grayscale opacity-70'}`}>{emoji}</span>
          )}
        </motion.button>
      </div>

      {/* XP stars below completed nodes */}
      {isCompleted && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-0.5 z-20">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-yellow-400 text-[10px]">★</span>
        </div>
      )}

      {/* ─── DUOLINGO-STYLE POPOVER TOOLTIP CARD (EVERYWHERE) ─── */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 z-[100] w-64 bg-[#181D28] dark:bg-slate-900 border-2 border-slate-700 dark:border-slate-700 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left"
          >
            {/* Top Pointer Caret */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#181D28] dark:border-b-slate-900 z-10" />

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-black text-white tracking-tight leading-snug">
                  {lessonTitle}
                </h4>
                <p className="text-xs font-semibold text-slate-300 dark:text-slate-400 leading-relaxed mt-1">
                  {!isUnlocked
                    ? 'Complete the lesson above to unlock this!'
                    : isCompleted
                      ? 'You completed this lesson! Practice again to master it.'
                      : 'Read theory & solve interactive coding tasks to master this lesson!'}
                </p>
              </div>

              {/* Action Button inside Popover Card */}
              {!isUnlocked ? (
                <div className="w-full py-2.5 px-4 bg-[#2A303C] text-slate-400 font-black text-xs uppercase tracking-wider rounded-xl border border-slate-700 text-center select-none flex items-center justify-center gap-1.5 opacity-80 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  <span>LOCKED</span>
                </div>
              ) : isCompleted ? (
                <button
                  onClick={handleActionClick}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs uppercase tracking-wider rounded-xl border-b-4 border-slate-950 transition cursor-pointer flex items-center justify-center gap-1.5 active:translate-y-0.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REVIEW LESSON</span>
                </button>
              ) : (
                <button
                  onClick={handleActionClick}
                  className="w-full py-2.5 px-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider rounded-xl border-b-4 border-[#46a302] transition cursor-pointer flex items-center justify-center gap-1.5 active:translate-y-0.5 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START +{lesson.xp} XP</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LessonNode;
