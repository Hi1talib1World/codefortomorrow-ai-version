
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
};

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, isCompleted, isUnlocked, isNext, onStartLesson }) => {
  const { t } = useLanguage();
  const emoji = EMOJI_MAP[lesson.icon] ?? '📚';

  // Circle colors
  const circleBg = isCompleted
    ? 'bg-[#58cc02]'
    : isNext
      ? 'bg-[#4285F4]'
      : isUnlocked
        ? 'bg-white dark:bg-slate-700'
        : 'bg-slate-200 dark:bg-slate-700';

  const ringColor = isCompleted
    ? 'stroke-[#58cc02]'
    : isNext
      ? 'stroke-[#4285F4]'
      : 'stroke-slate-200 dark:stroke-slate-600';

  const shadowStyle = isCompleted
    ? 'shadow-[0_6px_0_#46a302]'
    : isNext
      ? 'shadow-[0_6px_0_#1a73e8]'
      : isUnlocked
        ? 'shadow-[0_6px_0_#d1d5db] dark:shadow-[0_6px_0_#475569]'
        : 'shadow-[0_4px_0_#9ca3af] dark:shadow-[0_4px_0_#334155]';

  return (
    <div className="relative flex flex-col items-center">

      {/* "START" floating badge above next lesson */}
      {isNext && (
        <motion.div
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: [-6, -2, -6], opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-1 bg-white dark:bg-slate-800 text-[#4285F4] text-[10px] font-black px-3 py-1 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 uppercase tracking-widest flex items-center gap-1"
        >
          START ⭐
        </motion.div>
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
          whileHover={isUnlocked ? { scale: 1.08 } : {}}
          whileTap={isUnlocked ? { scale: 0.92 } : {}}
          className={`
            relative w-[68px] h-[68px] rounded-full flex items-center justify-center
            transition-all duration-200 font-black m-[2px]
            ${circleBg} ${shadowStyle}
            ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
          `}
        >
          {/* Pulse ring for next */}
          {isNext && (
            <span className="absolute inset-0 rounded-full bg-[#4285F4] opacity-30 animate-ping" />
          )}

          {/* Content */}
          {isCompleted ? (
            <span className="text-white text-3xl font-black drop-shadow-sm">✓</span>
          ) : !isUnlocked ? (
            <span className="text-slate-400 text-2xl">🔒</span>
          ) : (
            <span className="text-3xl select-none drop-shadow-sm">{emoji}</span>
          )}
        </motion.button>
      </div>

      {/* XP stars below completed nodes */}
      {isCompleted && (
        <div className="flex gap-0.5 mt-1">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-yellow-400 text-[10px]">★</span>
        </div>
      )}
    </div>
  );
};

export default LessonNode;
