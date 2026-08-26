/**
 * ProgressMap/index.tsx (exported as LearnScreen)
 * ──────────────────────────────────────────────────
 * Google Material 3 styled snake progress map for language paths.
 * Routes ai_ml to AiMlRoadmapView and ai_engineering to AiEngineeringRoadmapView.
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
import { AiMlRoadmapView } from './AiMlRoadmapView';

interface LearnScreenProps {
  completedLessons: number[];
  onStartLesson: (lesson: Lesson) => void;
  path: ProgrammingPath['id'];
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  currentUser?: UserType;
}

function getSnakeOffset(index: number): number {
  const pattern = [0, 30, 15, -30, -15, 0, 30, 15, -30, -15];
  return pattern[index % pattern.length];
}

/** Google Material 3 Section Banner */
const SectionBanner: React.FC<{ title: string; index: number; isLocked: boolean; lessonCount: number }> = ({ title, index, isLocked }) => {
  return (
    <div className="relative mx-auto mb-4 rounded-2xl bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] px-5 py-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden max-w-xs transition-all">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          {isLocked && <Lock className="w-3.5 h-3.5 text-[#5F6368] dark:text-[#9AA0A6] mb-0.5" />}
          <p className="text-[#1A73E8] dark:text-[#8AB4F8] text-[10px] font-mono font-medium uppercase tracking-wider">
            Unit {index + 1} • Section {index + 1}
          </p>
          <h3 className="font-bold text-sm text-[#202124] dark:text-white leading-tight mt-0.5">
            {title}
          </h3>
        </div>
        <div className="w-7 h-7 bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] rounded-full flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

/** Google Material 3 Progress Header */
const ProgressHeader: React.FC<{
  completed: number;
  total: number;
  pathLabel: string;
  pathIcon?: string;
  onBackToSelection: () => void;
}> = ({ completed, total, pathLabel, pathIcon, onBackToSelection }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="px-6 py-4 bg-white/90 dark:bg-[#292A2D]/90 border-b border-[#E8EAED] dark:border-[#3C4043] backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3">
          {pathIcon && (
            <div className="w-10 h-10 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#202124] rounded-2xl p-1.5 border border-[#E8EAED] dark:border-[#3C4043]">
              {pathIcon.startsWith('http') || pathIcon.startsWith('/') ? (
                <img src={pathIcon} alt="" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl select-none">{pathIcon}</span>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#202124] dark:text-white uppercase tracking-wide leading-none">{pathLabel}</span>
            <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6] mt-1">{completed}/{total} Lessons Complete</span>
          </div>
        </div>

        <button
          onClick={onBackToSelection}
          className="flex items-center space-x-1.5 bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] hover:bg-[#D2E3FC] px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border border-[#1A73E8]/20 shadow-sm cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Switch Path</span>
        </button>
      </div>
      <div className="h-2 bg-[#F1F3F4] dark:bg-[#202124] rounded-full overflow-hidden max-w-2xl mx-auto border border-[#E8EAED] dark:border-[#3C4043]">
        <motion.div
          className="h-full bg-[#1A73E8] dark:bg-[#8AB4F8] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

/* ─── GOOGLE MATERIAL 3 PATH CERTIFICATE CARD ─── */
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
      <div className="flex flex-col items-center mb-6">
        <div className="w-1.5 h-12 flex flex-col justify-between items-center opacity-60">
          <span className="w-2 h-2 rounded-full bg-[#5F6368]"></span>
          <span className="w-2 h-2 rounded-full bg-[#5F6368]"></span>
          <span className="w-2 h-2 rounded-full bg-[#5F6368]"></span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-left relative overflow-hidden space-y-5">
        <div>
          <span className="bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8] font-mono text-[10px] font-semibold uppercase px-3 py-1 rounded-full border border-[#1A73E8]/30 tracking-wider shadow-sm inline-block">
            VERIFIABLE CERTIFICATE
          </span>
        </div>

        <p className="text-xs font-normal text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
          Finish this section to earn your free verifiable certificate signed by Code for Tomorrow.
        </p>

        <div className="relative bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-6 sm:p-8 text-center shadow-inner overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h4 className="font-mono text-base font-bold text-[#202124] dark:text-white tracking-widest uppercase">
              Certificate of Completion
            </h4>
            
            <p className="font-mono text-[11px] text-[#5F6368] dark:text-[#9AA0A6]">
              This is to certify that
            </p>

            <div className="my-2 py-1 px-4 border-b border-dashed border-[#5F6368] inline-block">
              <span className="text-xl font-bold text-[#202124] dark:text-white tracking-wide">
                {studentName}
              </span>
            </div>

            <p className="font-mono text-[10px] text-[#5F6368] dark:text-[#9AA0A6]">
              has completed the curriculum for
            </p>

            <h5 className="text-lg font-bold text-[#1A73E8] dark:text-[#8AB4F8] tracking-tight">
              {pathLabel}
            </h5>

            <div className="pt-6 grid grid-cols-3 items-end border-t border-[#E8EAED] dark:border-[#3C4043] text-[10px] text-[#5F6368] dark:text-[#9AA0A6] font-mono">
              <div className="text-left">
                <p className="font-bold text-[#202124] dark:text-white">Hicham Outaleb</p>
                <p className="text-[9px] text-[#5F6368]">Hicham Outaleb, CTO</p>
              </div>

              <div className="flex justify-center">
                <div className="w-9 h-9 rounded-full bg-[#E6F4EA] dark:bg-[#3C4043] border border-[#34A853] flex items-center justify-center text-base shadow-sm">
                  🌱
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#202124] dark:text-white">{todayDate}</p>
                <p className="text-[9px] text-[#5F6368]">Date</p>
              </div>
            </div>

            <div className="pt-2 text-[9px] font-mono text-[#5F6368] text-left">
              Certification ID: {certId}
            </div>
          </div>
        </div>

        <div>
          {isCompleted ? (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-6 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>VIEW CERTIFICATE</span>
              <span className="font-extrabold text-sm">→</span>
            </button>
          ) : (
            <div className="w-full py-3.5 px-6 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] font-semibold text-xs uppercase tracking-wider flex items-center justify-between border border-[#E8EAED] dark:border-[#5F6368]">
              <span>VIEW CERTIFICATE</span>
              <span className="text-[10px] font-mono bg-white dark:bg-[#202124] text-[#202124] dark:text-white px-2.5 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#5F6368]">
                {completedLessonsCount} / {totalLessons} LESSONS
              </span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-10 max-w-4xl w-full aspect-[16/10] flex flex-col justify-between text-center shadow-2xl text-[#202124] dark:text-white overflow-hidden">
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-[#1A73E8] uppercase tracking-widest">Verifiable Credentials</span>
              <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Certificate of Achievement</h2>
              <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6]">Issued to {studentName} for completing {pathLabel}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 py-3 px-8 bg-[#1A73E8] text-white rounded-full font-semibold text-xs uppercase tracking-wider self-center cursor-pointer"
            >
              Close Certificate Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export const LearnScreen: React.FC<LearnScreenProps> = ({
  completedLessons,
  onStartLesson,
  path,
  onSwitchPath,
  currentUser,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

  React.useEffect(() => {
    setActiveTooltipId(null);
  }, [path, searchQuery]);

  if (path === 'ai_engineering') {
    return <AiEngineeringRoadmapView onStartLesson={onStartLesson} />;
  }

  if (path === 'ai_ml') {
    return <AiMlRoadmapView onStartLesson={onStartLesson} />;
  }

  const sections = LESSONS_BY_PATH[path] || [];
  const modules = MODULES_BY_PATH[path] || [];
  const pathMeta = PATHS.find(p => p.id === path);
  const pathLabel = pathMeta ? t(pathMeta.titleKey as any) : path;

  const allLessons = useMemo(() => {
    if (sections.length > 0) {
      return sections.flatMap(s => s.lessons);
    }
    if (modules.length > 0) {
      return modules.flatMap(m => m.levels.flatMap(l => l.lessons));
    }
    return [];
  }, [sections, modules]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map(sec => ({
        ...sec,
        lessons: sec.lessons.filter(l =>
          t(l.titleKey as any).toLowerCase().includes(q)
        ),
      }))
      .filter(sec => sec.lessons.length > 0);
  }, [sections, searchQuery, t]);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const q = searchQuery.toLowerCase();
    return modules
      .map(m => ({
        ...m,
        levels: m.levels
          .map(l => ({
            ...l,
            lessons: l.lessons.filter(les =>
              t(les.titleKey as any).toLowerCase().includes(q)
            ),
          }))
          .filter(l => l.lessons.length > 0),
      }))
      .filter(m => m.levels.length > 0);
  }, [modules, searchQuery, t]);

  const renderSnakePath = (lessons: Lesson[], sectionLocked: boolean, offsetBase: number) => {
    return (
      <div className="relative flex flex-col items-center space-y-3 py-2">
        {lessons.map((lesson, idx) => {
          const globalIdx = offsetBase + idx;
          const isDone = completedLessons.includes(lesson.id);
          const isFirstUncompleted =
            !isDone &&
            !sectionLocked &&
            lessons.slice(0, idx).every(l => completedLessons.includes(l.id));
          const isCurrent = isFirstUncompleted;
          const isLockedNode = sectionLocked || (!isDone && !isCurrent);
          const snakeOffset = getSnakeOffset(globalIdx);
          const isTooltipOpen = activeTooltipId === lesson.id;

          return (
            <React.Fragment key={lesson.id}>
              {idx > 0 && (
                <div className="w-0.5 h-4 bg-[#E8EAED] dark:bg-[#3C4043] my-0.5 rounded-full" />
              )}

              <div
                style={{
                  transform: `translateX(${snakeOffset}px)`,
                  zIndex: isTooltipOpen ? 40 : 1,
                }}
                className={`transition-transform duration-300 relative group flex justify-center items-center ${isTooltipOpen ? 'z-40' : 'z-1'}`}
              >
                <LessonNode
                  lesson={lesson}
                  isCompleted={isDone}
                  isUnlocked={!isLockedNode}
                  isNext={isCurrent}
                  isTooltipOpen={isTooltipOpen}
                  onToggleTooltip={(open) => {
                    setActiveTooltipId(open ? lesson.id : null);
                  }}
                  onStartLesson={() => {
                    setActiveTooltipId(null);
                    if (!isLockedNode) onStartLesson(lesson);
                  }}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 transition-colors">
      <ProgressHeader
        completed={completedLessons.length}
        total={allLessons.length}
        pathLabel={pathLabel}
        pathIcon={pathMeta?.icon}
        onBackToSelection={() => navigate('/dashboard/learn')}
      />

      <div className="px-4 pt-4 pb-2">
        <div className="relative max-w-xs mx-auto">
          <Search className="h-4 w-4 text-[#5F6368] dark:text-[#9AA0A6] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search lessons…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-full text-[#202124] dark:text-white placeholder-[#5F6368] text-xs font-medium focus:outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-[#5F6368] hover:text-[#202124]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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

      {!searchQuery && (
        <PathCertificateCard
          pathLabel={pathLabel}
          isCompleted={completedLessons.length >= allLessons.length && allLessons.length > 0}
          studentName={currentUser?.name || 'Student Name'}
          totalLessons={allLessons.length}
          completedLessonsCount={completedLessons.length}
        />
      )}
    </div>
  );
};

export default LearnScreen;