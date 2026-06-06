
/**
 * ProgressMap/index.tsx  (exported as LearnScreen)
 * ──────────────────────────────────────────────────
 * Duolingo-style winding snake path where lesson nodes are
 * positioned close together in a zigzag pattern.
 *
 * The path snakes: center → right → center → left → center → right …
 * Nodes are compact with minimal vertical gaps.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MODULES_BY_PATH, LESSONS_BY_PATH, PATHS } from '../../constants';
import { Lesson, ProgrammingPath } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LessonNode from '../LessonNode';
import { Search, X, Lock, ChevronRight, ArrowLeftRight } from 'lucide-react';

interface LearnScreenProps {
  completedLessons: number[];
  onStartLesson: (lesson: Lesson) => void;
  path: ProgrammingPath['id'];
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Duolingo-style horizontal offset pattern.
 * Creates a tight zigzag: slightly left, center, slightly right, center, ...
 * Values are in percentage of container width for the node's translateX.
 */
function getSnakeOffset(index: number): number {
  const pattern = [0, 30, 15, -30, -15, 0, 30, 15, -30, -15];
  return pattern[index % pattern.length];
}

const SECTION_COLORS = [
  { bg: 'bg-[#2E2FCE]', text: 'text-white', border: 'border-[#2E2FCE]' },
  { bg: 'bg-[#9b59b6]', text: 'text-white', border: 'border-[#8e44ad]' },
  { bg: 'bg-[#EA4335]', text: 'text-white', border: 'border-[#c5221f]' },
  { bg: 'bg-[#FBBC05]', text: 'text-white', border: 'border-[#e0a800]' },
  { bg: 'bg-[#34A853]', text: 'text-white', border: 'border-[#2e9347]' },
  { bg: 'bg-[#00BCD4]', text: 'text-white', border: 'border-[#0097A7]' },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

/** Colourful section header card. */
const SectionBanner: React.FC<{ title: string; index: number; isLocked: boolean; lessonCount: number }> = ({ title, index, isLocked, lessonCount }) => {
  const color = SECTION_COLORS[index % SECTION_COLORS.length];
  return (
    <div className={`relative mx-auto mb-4 rounded-2xl ${color.bg} ${color.border} border-b-4 px-5 py-3 shadow-md overflow-hidden max-w-xs`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          {isLocked && <Lock className="w-3 h-3 text-white/60 mb-0.5" />}
          <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.2em]">
            Section {index + 1}, Unit 1
          </p>
          <h3 className={`${color.text} font-black text-sm uppercase tracking-tight leading-tight mt-0.5`}>
            {title}
          </h3>
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

/** Overall progress bar at the top. */
const ProgressHeader: React.FC<{
  completed: number;
  total: number;
  pathLabel: string;
  pathIcon?: string;
  onBackToSelection: () => void;
}> = ({ completed, total, pathLabel, pathIcon, onBackToSelection }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="px-4 pt-4 pb-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3 max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          {pathIcon && (
            <div className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl p-1.5 shadow-sm border border-slate-200 dark:border-slate-600">
              {pathIcon.startsWith('http') || pathIcon.startsWith('/') ? (
                <img src={pathIcon} alt="" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl select-none">{pathIcon}</span>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide leading-none">{pathLabel}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">{completed}/{total} Lessons</span>
          </div>
        </div>

        <button
          onClick={onBackToSelection}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#2E2FCE]" />
          <span>Switch Path</span>
        </button>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-md mx-auto">
        <motion.div
          className="h-full bg-gradient-to-r from-[#2E2FCE] to-[#34A853] rounded-full"
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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const modules = MODULES_BY_PATH[path] || [];
  const sections = LESSONS_BY_PATH[path] || [];

  // Flatten all lessons for next-lesson detection
  const allLessons = useMemo(() => {
    if (modules.length > 0) return modules.flatMap(m => m.levels.flatMap(l => l.lessons));
    return sections.flatMap(s => s.lessons);
  }, [modules, sections]);

  const lastCompletedId = Math.max(0, ...completedLessons);

  const nextLesson = useMemo(() => {
    if (lastCompletedId === 0) return allLessons[0];
    const idx = allLessons.findIndex(l => l.id === lastCompletedId);
    return allLessons[idx + 1] || null;
  }, [allLessons, lastCompletedId]);

  // Search
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

  const pathMeta = PATHS.find(p => p.id === path);
  const pathLabel = pathMeta ? t(pathMeta.titleKey as any) : path;

  if (allLessons.length === 0) {
    return (
      <div className="text-center text-slate-400 py-20 px-6">
        <div className="text-6xl mb-4">🚧</div>
        <p className="font-black text-xl uppercase tracking-tighter">Coming soon!</p>
      </div>
    );
  }

  // ── Render the Duolingo-style snake path ───────────────────────────────────
  const renderSnakePath = (lessons: Lesson[], sectionIsLocked = false, globalOffset = 0) => (
    <div className="relative w-full" style={{ height: `${lessons.length * 120}px` }}>
      {/* ─── Duolingo-style Winding Road/Line Connectors ─── */}
      {lessons.map((lesson, i) => {
        if (i === 0) return null;
        const o1 = getSnakeOffset(globalOffset + i - 1);
        const o2 = getSnakeOffset(globalOffset + i);
        // A segment is unlocked if the target node (i) is unlocked or completed
        const isSegmentUnlocked = !sectionIsLocked && (lesson.id === allLessons[0]?.id || completedLessons.includes(lesson.id - 1));

        // Duolingo colors: vibrant green with dark green 3D shadow vs slate gray with dark slate shadow
        const shadowColor = isSegmentUnlocked 
          ? '#46a302' 
          : (isDark ? '#1e293b' : '#cbd5e1');
        const strokeColor = isSegmentUnlocked 
          ? '#58cc02' 
          : (isDark ? '#334155' : '#e2e8f0');

        return (
          <svg
            key={`line-${lesson.id}`}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0"
            style={{
              top: `${(i - 1) * 120 + 60}px`,
              height: '120px',
              width: '200px',
            }}
            viewBox="0 0 200 120"
          >
            {/* 3D Shadow curve (offset vertically by 4px) */}
            <path
              d={`M ${100 + o1} 0 C ${100 + o1} 60 ${100 + o2} 60 ${100 + o2} 120`}
              fill="none"
              stroke={shadowColor}
              strokeWidth="16"
              strokeLinecap="round"
              transform="translate(0, 4)"
            />
            {/* Main top curve */}
            <path
              d={`M ${100 + o1} 0 C ${100 + o1} 60 ${100 + o2} 60 ${100 + o2} 120`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
        );
      })}

      {/* ─── Lesson Nodes absolute positioned ─── */}
      {lessons.map((lesson, i) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isUnlocked = !sectionIsLocked && (lesson.id === allLessons[0]?.id || completedLessons.includes(lesson.id - 1));
        const isNext = nextLesson?.id === lesson.id;
        const offset = getSnakeOffset(globalOffset + i);

        return (
          <div
            key={lesson.id}
            className="absolute left-0 right-0 flex justify-center items-center z-10"
            style={{ top: `${i * 120}px`, height: '120px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5), type: 'spring', stiffness: 300, damping: 24 }}
              style={{ transform: `translateX(${offset}px)` }}
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
        );
      })}
    </div>
  );

  return (
    <div className="w-full min-h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors pb-28">

      <ProgressHeader
        completed={completedLessons.length}
        total={allLessons.length}
        pathLabel={pathLabel}
        pathIcon={pathMeta?.icon}
        onBackToSelection={() => navigate('/dashboard/learn')}
      />

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative max-w-xs mx-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search lessons…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-[#2E2FCE] focus:ring-2 focus:ring-[#2E2FCE]/20 transition"
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

      {/* ── Sections (Python, JS, Web paths) ── */}
      {modules.length === 0 && (
        <div className="mt-2 max-w-md mx-auto">
          {filteredSections.map((section, sectionIdx) => {
            const offset = sections.slice(0, sectionIdx).reduce((sum, s) => sum + s.lessons.length, 0);
            return (
              <div key={section.id} className="mb-6">
                <SectionBanner
                  title={t(section.titleKey as any)}
                  index={sectionIdx}
                  isLocked={false}
                  lessonCount={section.lessons.length}
                />
                {renderSnakePath(section.lessons, false, offset)}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modules (Block Coding: multiple levels) ── */}
      {modules.length > 0 && (
        <div className="mt-2 max-w-md mx-auto">
          {filteredModules.map((module, moduleIdx) =>
            module.levels.map((level, levelIdx) => {
              const offset = filteredModules
                .slice(0, moduleIdx)
                .reduce((s, m) => s + m.levels.reduce((ls, lv) => ls + lv.lessons.length, 0), 0)
                + module.levels.slice(0, levelIdx).reduce((s, lv) => s + lv.lessons.length, 0);
              return (
                <div key={level.id} className="mb-6">
                  <SectionBanner
                    title={t(level.titleKey as any)}
                    index={moduleIdx + levelIdx}
                    isLocked={level.isLocked}
                    lessonCount={level.lessons.length}
                  />
                  {renderSnakePath(level.lessons, level.isLocked, offset)}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* No results */}
      {searchQuery && filteredSections.length === 0 && filteredModules.length === 0 && (
        <div className="text-center py-20 px-6">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-black text-slate-400 text-lg uppercase tracking-tighter">
            No lessons found for "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-[#2E2FCE] font-black uppercase tracking-widest text-sm"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default LearnScreen;