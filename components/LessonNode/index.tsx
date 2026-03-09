
/**
 * LessonNode/index.tsx
 * ─────────────────────
 * A single interactive node on the lesson roadmap.
 *
 * Visual states:
 *  - completed  → filled green circle with a checkmark ✓
 *  - next       → pulsing brand-colored circle with a "▶ START" label above
 *  - unlocked   → solid colored circle with lesson icon
 *  - locked     → dark grey circle with a 🔒 icon
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

  // Pick the icon to show inside the node
  const emoji = EMOJI_MAP[lesson.icon] ?? '📚';

  // Determine background color of the node circle
  const bgColor = isCompleted
    ? 'bg-green-400 border-green-600'
    : isNext
      ? 'bg-brand-400 border-brand-600'
      : isUnlocked
        ? 'border-slate-400 bg-white dark:bg-slate-700'
        : 'bg-slate-700 border-slate-600';

  const shadowColor = isCompleted
    ? 'shadow-green-400/60'
    : isNext
      ? 'shadow-brand-400/60'
      : 'shadow-slate-800/30';

  return (
    <div className="relative flex flex-col items-center">

      {/* "CONTINUE / START" label above the next lesson */}
      {isNext && (
        <motion.div
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: [-4, 0, -4], opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-2 bg-brand-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest"
        >
          ▶ {t('continue') || 'Start'}
        </motion.div>
      )}

      {/* Main circular button */}
      <motion.button
        onClick={() => isUnlocked && onStartLesson(lesson)}
        disabled={!isUnlocked}
        whileHover={isUnlocked ? { scale: 1.1 } : {}}
        whileTap={isUnlocked ? { scale: 0.93 } : {}}
        className={`
          relative w-16 h-16 rounded-full border-[3px] flex items-center justify-center
          transition-all duration-200 font-black
          ${bgColor}
          ${isUnlocked ? `shadow-lg ${shadowColor} cursor-pointer` : 'cursor-not-allowed opacity-60'}
        `}
      >
        {/* Pulsing ring for the next lesson */}
        {isNext && (
          <span className="absolute inset-0 rounded-full bg-brand-400 opacity-40 animate-ping" />
        )}

        {/* Bottom shadow border (3D effect) */}
        <span className={`absolute inset-0 rounded-full border-b-4 translate-y-1 -z-10
          ${isCompleted ? 'border-green-700' : isNext ? 'border-brand-700' : 'border-slate-600'}
        `} />

        {/* Node content */}
        {isCompleted ? (
          <span className="text-white text-2xl font-black">✓</span>
        ) : !isUnlocked ? (
          <span className="text-slate-400 text-xl">🔒</span>
        ) : (
          <span className="text-2xl select-none">{emoji}</span>
        )}
      </motion.button>

      {/* Lesson title label below */}
      <p className={`mt-2 text-[10px] font-black text-center max-w-[80px] leading-tight uppercase tracking-wide
        ${isUnlocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}
      `}>
        {t(lesson.titleKey as any)}
      </p>

      {/* XP badge */}
      {isUnlocked && (
        <span className="mt-1 text-[9px] font-bold text-yellow-500">+{lesson.xp} XP</span>
      )}
    </div>
  );
};

export default LessonNode;
