
/**
 * LessonNode/index.tsx
 * ─────────────────────
 * A single interactive node on the lesson roadmap.
 * Duolingo-style: large circle with progress ring, icon center.
 *
 * Visual states:
 *  - completed  → green circle with checkmark ✓ and full ring
 *  - next       → pulsing brand circle with "START" badge and partial ring
 *  - unlocked   → solid circle with lesson icon
 *  - locked     → grey circle with 🔒 icon
 */
import React from 'react';
import { Lesson } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';

interface LessonNodeProps {
  lesson: Lesson;
  isCompleted: boolean;
  isUnlocked: boolean;
  isNext: boolean;
  onStartLesson: (lesson: Lesson) => void;
}

/** Map from lesson.icon key → emoji for the node center. */
const EMOJI_MAP: Record<string, string> = {
  brain: '🧠',
  star: '⭐',
  trophy: '🏆',
  book: '📖',
  code: '💻',
  math: '∑',
  web: '🌐',
  game: '🎮',
  camel: '🐫',
  tea: '🍵',
  zellige: '🎨',
};

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, isCompleted, isUnlocked, isNext, onStartLesson }) => {
  const { t } = useLanguage();
  const emoji = EMOJI_MAP[lesson.icon] ?? '📚';

  // Circle colors: only completed lessons are green (in color).
  // Next, unlocked, and locked are styled in clean gray/slate/neutral colors.
  const circleBg = isCompleted
    ? 'bg-[#58cc02]'
    : isNext
      ? 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600'
      : isUnlocked
        ? 'bg-white dark:bg-slate-800'
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

  return (
    <div className="relative flex flex-col items-center">

      {/* "START" static badge above next lesson */}
      {isNext && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-3 py-1 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 uppercase tracking-widest flex items-center gap-1 whitespace-nowrap animate-bounce"
        >
          START ⭐
        </div>
      )}

      {/* Progress ring + circle button */}
      <div className="relative">
        {/* SVG progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
          {/* Background track */}
          <circle cx="36" cy="36" r="32" fill="none" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="5" />
          {/* Progress arc */}
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
          onClick={() => isUnlocked && onStartLesson(lesson)}
          disabled={!isUnlocked}
          whileHover={isUnlocked ? { scale: 1.05 } : {}}
          whileTap={isUnlocked ? { scale: 0.95 } : {}}
          className={`
            relative w-[68px] h-[68px] rounded-full flex items-center justify-center
            transition-all duration-200 font-black m-[2px]
            ${circleBg} ${shadowStyle}
            ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
          `}
        >
          {/* Content */}
          {isCompleted ? (
            <span className="text-white text-3xl font-black drop-shadow-sm">✓</span>
          ) : !isUnlocked ? (
            <span className="text-slate-400 text-2xl filter grayscale opacity-40">🔒</span>
          ) : emoji === '🏆' ? (
            <img 
              src="/assets/images/trophy.png" 
              alt="Trophy" 
              className="w-10 h-10 object-contain select-none"
            />
          ) : (
            <span className="text-3xl select-none drop-shadow-sm filter grayscale opacity-70">{emoji}</span>
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
    </div>
  );
};

export default LessonNode;
