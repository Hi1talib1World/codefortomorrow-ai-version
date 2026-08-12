
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
import { Lesson, ProgrammingPath, User as UserType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LessonNode from '../LessonNode';
import { Search, X, Lock, ChevronRight, ArrowLeftRight, Award } from 'lucide-react';
import { AiEngineeringRoadmapView } from './AiEngineeringRoadmapView';

interface LearnScreenProps {
  completedLessons: number[];
  onStartLesson: (lesson: Lesson) => void;
  path: ProgrammingPath['id'];
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  currentUser?: UserType;
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
    <div className="px-6 py-4 bg-[#0F172A] border-b-2 border-slate-800 backdrop-blur-md sticky top-0 z-50 transition-all shadow-xl">
      <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3">
          {pathIcon && (
            <div className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl p-1.5 shadow-md border border-slate-800">
              {pathIcon.startsWith('http') || pathIcon.startsWith('/') ? (
                <img src={pathIcon} alt="" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl select-none">{pathIcon}</span>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-black text-white uppercase tracking-wide leading-none">{pathLabel}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">{completed}/{total} Lessons</span>
          </div>
        </div>

        <button
          onClick={onBackToSelection}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-800 shadow-sm cursor-pointer active:translate-y-0.5"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>Switch Path</span>
        </button>
      </div>
      <div className="h-2 bg-slate-950 rounded-full overflow-hidden max-w-2xl mx-auto border border-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

/* ─── CERTIFICATE CARD AT THE END OF PATH ─── */
const PathCertificateCard: React.FC<{
  pathLabel: string;
  isCompleted: boolean;
  studentName: string;
  totalLessons: number;
  completedLessonsCount: number;
}> = ({ pathLabel, isCompleted, studentName, totalLessons, completedLessonsCount }) => {
  const [showModal, setShowModal] = useState(false);
  const todayDate = new Date().toLocaleDateString('en-US');
  const certId = useMemo(() => {
    return 'C4T-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto mt-10 mb-8 px-4">
      {/* Dashed Path Connector Line connecting last node to Certificate */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-1.5 h-12 flex flex-col justify-between items-center opacity-60">
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>
        </div>
      </div>

      {/* Main Certificate Card Outer Wrapper */}
      <div className="bg-[#1A1E24] dark:bg-slate-900 border-2 border-slate-700/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden space-y-5">
        
        {/* Top Badge */}
        <div>
          <span className="bg-[#00BCD4] text-slate-950 font-mono text-[10px] font-black uppercase px-3 py-1 rounded border border-cyan-400 tracking-wider shadow-sm inline-block">
            EARN A CERTIFICATE
          </span>
        </div>

        {/* Subtitle description */}
        <p className="text-xs font-semibold text-slate-300 dark:text-slate-400 leading-relaxed">
          Finish this section and we'll mint your free, verifiable certificate - add it to your CV or share it on LinkedIn.
        </p>

        {/* Inner Certificate Box Preview */}
        <div className="relative bg-[#0F172A] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-inner overflow-hidden">
          
          {/* Watermark Code Background Pattern */}
          <div className="absolute inset-0 opacity-10 font-mono text-[10px] text-cyan-400 pointer-events-none p-4 flex flex-wrap gap-6 select-none">
            <span>{'{ }'}</span>
            <span>;</span>
            <span>0</span>
            <span>1</span>
            <span>//</span>
            <span>def cert()</span>
            <span>{'{ }'}</span>
            <span>1</span>
            <span>0</span>
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 space-y-3">
            <h4 className="font-mono text-base sm:text-lg font-bold text-white tracking-widest uppercase">
              Certificate of Completion
            </h4>
            
            <p className="font-mono text-[11px] text-slate-400">
              This is to certify that
            </p>

            <div className="my-2 py-1 px-4 border-b border-dashed border-slate-600 inline-block">
              <span className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {studentName}
              </span>
            </div>

            <p className="font-mono text-[10px] text-slate-400">
              has completed the section
            </p>

            <h5 className="text-lg sm:text-xl font-black text-cyan-300 tracking-tight">
              {pathLabel}
            </h5>

            {/* Signature & Seal Row */}
            <div className="pt-6 grid grid-cols-3 items-end border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              <div className="text-left">
                <p className="font-bold text-slate-200">Hicham Outaleb</p>
                <p className="text-[9px] text-slate-500">Hicham Outaleb, CTO</p>
              </div>

              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl shadow-sm">
                  🌱
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-200">{todayDate}</p>
                <p className="text-[9px] text-slate-500">Date</p>
              </div>
            </div>

            {/* Certification ID */}
            <div className="pt-2 text-[9px] font-mono text-slate-500 text-left">
              Certification ID: {certId}
            </div>
          </div>
        </div>

        {/* View / Claim Certificate Button */}
        <div>
          {isCompleted ? (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider border border-cyan-300 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>VIEW CERTIFICATION</span>
              <span className="font-extrabold text-sm">→</span>
            </button>
          ) : (
            <div className="w-full py-3.5 px-6 rounded-xl bg-[#232830] text-slate-400 font-black text-xs uppercase tracking-wider border border-slate-700/60 flex items-center justify-between opacity-80 cursor-not-allowed">
              <span className="text-slate-500">VIEW CERTIFICATION</span>
              <span className="text-[10px] font-bold bg-slate-900 text-slate-400 px-2.5 py-1 rounded">
                {completedLessonsCount} / {totalLessons} LESSONS
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Landscape Printable Certificate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 overflow-y-auto print:p-0 print:bg-white">
          <style>{`
            @media print {
              @page {
                size: landscape;
                margin: 0;
              }
              body {
                background: white !important;
                color: black !important;
              }
              .no-print {
                display: none !important;
              }
              .print-certificate-card {
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                border-radius: 0 !important;
                border: none !important;
                box-shadow: none !important;
              }
            }
          `}</style>

          <div className="print-certificate-card relative bg-[#0D1527] border-4 border-cyan-400 rounded-3xl p-6 sm:p-10 max-w-4xl w-full aspect-[16/10] flex flex-col justify-between text-center shadow-2xl text-white overflow-hidden select-text">
            
            {/* Watermark Code Background Pattern */}
            <div className="absolute inset-0 opacity-10 font-mono text-xs text-cyan-400 pointer-events-none p-6 flex flex-wrap gap-8 select-none">
              <span>{'{ }'}</span>
              <span>;</span>
              <span>0</span>
              <span>1</span>
              <span>//</span>
              <span>def cert()</span>
              <span>{'{ }'}</span>
              <span>1</span>
              <span>0</span>
              <span>const path = "{pathLabel}";</span>
            </div>

            {/* Close Modal Button */}
            <button
              onClick={() => setShowModal(false)}
              className="no-print absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full border border-slate-700 transition cursor-pointer z-20"
            >
              ✕
            </button>

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between border-b-2 border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span className="font-mono text-xs font-black uppercase text-cyan-300 tracking-widest">
                  C4T ACADEMY
                </span>
              </div>

              <span className="bg-[#00BCD4] text-slate-950 font-mono text-[11px] font-black uppercase px-4 py-1 rounded-full border border-cyan-300 tracking-widest shadow-md">
                OFFICIAL CERTIFICATE OF COMPLETION
              </span>

              <span className="font-mono text-[10px] text-slate-400">
                ID: {certId}
              </span>
            </div>

            {/* Center Main Certificate Body */}
            <div className="relative z-10 space-y-3 my-auto py-2">
              <h3 className="font-mono text-2xl sm:text-4xl font-black text-white tracking-widest uppercase">
                Certificate of Completion
              </h3>
              
              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                This is to certify that
              </p>

              <div className="py-1 px-8 border-b-2 border-dashed border-cyan-400/50 inline-block">
                <p className="text-3xl sm:text-5xl font-black text-cyan-200 tracking-wide">
                  {studentName}
                </p>
              </div>

              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest pt-1">
                has successfully completed all requirements & challenges for
              </p>

              <h4 className="text-2xl sm:text-3xl font-black text-[#FFE87C] tracking-tight">
                {pathLabel}
              </h4>
            </div>

            {/* Footer Signature & Seal Row */}
            <div className="relative z-10 pt-4 grid grid-cols-3 items-end border-t-2 border-slate-800 text-xs text-slate-400 font-mono">
              <div className="text-left">
                <p className="font-bold text-white text-base">Hicham Outaleb</p>
                <p className="text-[11px] text-slate-400">Hicham Outaleb, CTO</p>
              </div>

              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg">
                  🌱
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-white text-base">{todayDate}</p>
                <p className="text-[11px] text-slate-400">Date Issued</p>
              </div>
            </div>

            {/* Print & Action Controls Row */}
            <div className="no-print pt-4 flex flex-col sm:flex-row gap-3 relative z-20">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#00BCD4] hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border border-cyan-300 shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🖨️ Print / Save Landscape Certificate</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const LearnScreen: React.FC<LearnScreenProps> = ({ completedLessons, onStartLesson, path, onSwitchPath, currentUser }) => {
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
        <div className="text-6xl mb-4"></div>
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
            className="absolute left-0 right-0 flex justify-center items-center"
            style={{ top: `${i * 120}px`, height: '120px', zIndex: 100 - i }}
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

  if (path === 'ai_engineering') {
    return <AiEngineeringRoadmapView onStartLesson={onStartLesson} />;
  }

  return (
    <div className="w-full min-h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 transition-colors pb-28">

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
        <div className="mt-6 pt-4 max-w-md mx-auto">
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
        <div className="mt-6 pt-4 max-w-md mx-auto">
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

      {/* ── Path Completion Certificate ── */}
      {!searchQuery && (
        <PathCertificateCard
          pathLabel={pathLabel}
          isCompleted={completedLessons.length >= allLessons.length && allLessons.length > 0}
          studentName={currentUser?.name || 'Student Name'}
          totalLessons={allLessons.length}
          completedLessonsCount={completedLessons.length}
        />
      )}

      {/* No results */}
      {searchQuery && filteredSections.length === 0 && filteredModules.length === 0 && (
        <div className="text-center py-20 px-6">
          <div className="text-6xl mb-4"></div>
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