
/**
 * ProgressMap/index.tsx  (exported as LearnScreen)
 * ──────────────────────────────────────────────────
 * The lesson roadmap screen shown when a student navigates to "Learn".
 *
 * Visual Design:
 *  - Duolingo-inspired winding snake path: lessons alternate left → right → left
 *  - Each section (chapter) has a colourful header card
 *  - A live progress bar shows how far through the path the student is
 *  - The "next" lesson pulses with a bouncing arrow indicator
 *  - Completed nodes are green ✓, locked nodes are dark grey 🔒
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MODULES_BY_PATH, LESSONS_BY_PATH, PATHS } from '../../constants';
import { Lesson, ProgrammingPath } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import LessonNode from '../LessonNode';
import { Search, X, Lock } from 'lucide-react';

interface LearnScreenProps {
  completedLessons: number[];
  onStartLesson: (lesson: Lesson) => void;
  path: ProgrammingPath['id'];
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Given a flat array of lessons, returns an alignment for each index.
 * Pattern: left, center, right, center, left, center, right, ...
 * This creates the Duolingo-style winding snake path.
 */
function getSnakeAlignment(index: number): 'left' | 'center' | 'right' {
  const pattern: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right', 'center'];
  return pattern[index % pattern.length];
}

/** Background gradient for each section based on a colour palette index. */
const SECTION_GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-purple-500 to-purple-700',
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-teal-500 to-teal-700',
  'from-indigo-500 to-indigo-700',
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

/** Colourful chapter header banner shown at the start of each section/level. */
const SectionBanner: React.FC<{ title: string; index: number; isLocked: boolean }> = ({ title, index, isLocked }) => {
  const gradient = SECTION_GRADIENTS[index % SECTION_GRADIENTS.length];
  return (
    <div className={`relative mx-4 mb-6 rounded-2xl bg-gradient-to-r ${gradient} p-4 shadow-lg overflow-hidden`}>
      {/* Decorative background shapes */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full bg-white/10" />
      <div className="relative z-10 flex items-center gap-3">
        {isLocked && <Lock className="w-4 h-4 text-white/70 shrink-0" />}
        <div>
          <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.2em]">Chapter {index + 1}</p>
          <h3 className="text-white font-black text-base uppercase tracking-tight italic leading-none mt-0.5">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

/** Overall progress bar shown at the top of the roadmap. */
const ProgressHeader: React.FC<{ completed: number; total: number; pathLabel: string }> = ({ completed, total, pathLabel }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="px-4 pt-4 pb-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{pathLabel}</span>
        <span className="text-[11px] font-black text-brand-500">{completed}/{total} lessons</span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const LearnScreen: React.FC<LearnScreenProps> = ({ completedLessons, onStartLesson, path, onSwitchPath }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const modules = MODULES_BY_PATH[path] || [];
  const sections = LESSONS_BY_PATH[path] || [];

  // Flatten all lessons in order for next-lesson detection
  const allLessons = useMemo(() => {
    if (modules.length > 0) return modules.flatMap(m => m.levels.flatMap(l => l.lessons));
    return sections.flatMap(s => s.lessons);
  }, [modules, sections]);

  const lastCompletedId = Math.max(0, ...completedLessons);

  // Find the next lesson to unlock
  const nextLesson = useMemo(() => {
    if (lastCompletedId === 0) return allLessons[0];
    const idx = allLessons.findIndex(l => l.id === lastCompletedId);
    return allLessons[idx + 1] || null;
  }, [allLessons, lastCompletedId]);

  // Search filtering
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map(s => ({ ...s, lessons: s.lessons.filter(l => t(l.titleKey as any).toLowerCase().includes(q)) }))
      .filter(s => s.lessons.length > 0);
  }, [sections, searchQuery, t]);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const q = searchQuery.toLowerCase();
    return modules
      .map(m => ({
        ...m,
        levels: m.levels
          .map(lv => ({ ...lv, lessons: lv.lessons.filter(l => t(l.titleKey as any).toLowerCase().includes(q)) }))
          .filter(lv => lv.lessons.length > 0),
      }))
      .filter(m => m.levels.length > 0);
  }, [modules, searchQuery, t]);

  // Current path metadata
  const pathMeta = PATHS.find(p => p.id === path);
  const pathLabel = pathMeta ? t(pathMeta.titleKey as any) : path;

  if (allLessons.length === 0) {
    return (
      <div className="text-center text-slate-400 py-20 px-6">
        <div className="text-6xl mb-4">🚧</div>
        <p className="font-black text-xl uppercase tracking-tighter italic">Coming soon!</p>
      </div>
    );
  }

  // ── Render a flat list of lessons as a winding snake path ──────────────────
  const renderSnakePath = (lessons: Lesson[], sectionIsLocked = false, globalOffset = 0) => (
    <div className="relative flex flex-col items-stretch px-2">
      {lessons.map((lesson, i) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isUnlocked = !sectionIsLocked && (lesson.id === allLessons[0]?.id || completedLessons.includes(lesson.id - 1));
        const isNext = nextLesson?.id === lesson.id;

        const alignment = getSnakeAlignment(globalOffset + i);

        const justifyClass = alignment === 'left'
          ? 'justify-start pl-6'
          : alignment === 'right'
            ? 'justify-end pr-6'
            : 'justify-center';

        // Draw a curved connector between nodes
        const showConnector = i < lessons.length - 1;
        const nextAlignment = getSnakeAlignment(globalOffset + i + 1);

        return (
          <div key={lesson.id}>
            {/* Lesson node row */}
            <div className={`flex ${justifyClass} py-2`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.06, 0.6), type: 'spring', stiffness: 260, damping: 22 }}
              >
                <LessonNode
                  lesson={lesson}
                  isCompleted={isCompleted}
                  isUnlocked={isUnlocked}
                  isNext={isNext}
                  onStartLesson={onStartLesson}
                />
              </motion.div>
            </div>

            {/* Curved SVG connector to next node */}
            {showConnector && (
              <div className="relative h-10 w-full overflow-visible">
                <svg
                  viewBox="0 0 300 40"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Determine curve direction based on alignment change */}
                  {alignment === 'left' && nextAlignment === 'center' && (
                    <path d="M 60 0 Q 150 40 150 40" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeDasharray="6 4" strokeLinecap="round" />
                  )}
                  {alignment === 'center' && nextAlignment === 'right' && (
                    <path d="M 150 0 Q 150 20 240 40" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeDasharray="6 4" strokeLinecap="round" />
                  )}
                  {alignment === 'right' && nextAlignment === 'center' && (
                    <path d="M 240 0 Q 150 20 150 40" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeDasharray="6 4" strokeLinecap="round" />
                  )}
                  {alignment === 'center' && nextAlignment === 'left' && (
                    <path d="M 150 0 Q 150 20 60 40" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeDasharray="6 4" strokeLinecap="round" />
                  )}
                  {alignment === nextAlignment && (
                    <path d="M 150 0 L 150 40" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeDasharray="6 4" strokeLinecap="round" />
                  )}
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full min-h-full bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors pb-28">

      {/* Progress header bar */}
      <ProgressHeader completed={completedLessons.length} total={allLessons.length} pathLabel={pathLabel} />

      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search lessons…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Sections (most paths like Python, JS, Web) ── */}
      {modules.length === 0 && (
        <div className="mt-2">
          {filteredSections.map((section, sectionIdx) => {
            // Calculate global index offset so the snake continues across sections
            const offset = sections.slice(0, sectionIdx).reduce((sum, s) => sum + s.lessons.length, 0);
            return (
              <div key={section.id} className="mb-4">
                <SectionBanner
                  title={t(section.titleKey as any)}
                  index={sectionIdx}
                  isLocked={false}
                />
                {renderSnakePath(section.lessons, false, offset)}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modules (Block Coding path: has multiple levels) ── */}
      {modules.length > 0 && (
        <div className="mt-2">
          {filteredModules.map((module, moduleIdx) =>
            module.levels.map((level, levelIdx) => {
              const offset = filteredModules
                .slice(0, moduleIdx)
                .reduce((s, m) => s + m.levels.reduce((ls, lv) => ls + lv.lessons.length, 0), 0)
                + module.levels.slice(0, levelIdx).reduce((s, lv) => s + lv.lessons.length, 0);
              return (
                <div key={level.id} className="mb-4">
                  <SectionBanner
                    title={t(level.titleKey as any)}
                    index={moduleIdx + levelIdx}
                    isLocked={level.isLocked}
                  />
                  {renderSnakePath(level.lessons, level.isLocked, offset)}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* No results state */}
      {searchQuery && filteredSections.length === 0 && filteredModules.length === 0 && (
        <div className="text-center py-20 px-6">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-black text-slate-400 text-lg uppercase tracking-tighter italic">
            No lessons found for "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-brand-500 font-black uppercase tracking-widest text-sm"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default LearnScreen;