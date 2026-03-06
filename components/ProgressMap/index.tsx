
import React, { useState, useMemo } from 'react';
import { MODULES_BY_PATH, LESSONS_BY_PATH, PATHS } from '../../constants';
import { Lesson, ProgrammingPath, LessonSection, Module, Level } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import LessonNode from '../LessonNode';
import { Search, X, Lock, ChevronRight, Star, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LearnScreenProps {
  completedLessons: number[];
  onStartLesson: (lesson: Lesson) => void;
  path: ProgrammingPath['id'];
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
}

// NOTE: This file now exports the main LearnScreen component to match the new design.
const LearnScreen: React.FC<LearnScreenProps> = ({ completedLessons, onStartLesson, path, onSwitchPath }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const modules = MODULES_BY_PATH[path] || [];
  const sections = LESSONS_BY_PATH[path] || [];
  
  const allLessons = useMemo(() => {
    if (modules.length > 0) {
      return modules.flatMap(m => m.levels.flatMap(l => l.lessons));
    }
    return sections.flatMap(s => s.lessons);
  }, [modules, sections]);

  const lastCompletedId = Math.max(0, ...completedLessons);

  const filteredPaths = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return PATHS.filter(p => 
      t(p.titleKey as any).toLowerCase().includes(query) && p.isAvailable
    );
  }, [searchQuery, t]);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const query = searchQuery.toLowerCase();
    return modules.map(module => ({
      ...module,
      levels: module.levels.map(level => ({
        ...level,
        lessons: level.lessons.filter(lesson => 
          t(lesson.titleKey as any).toLowerCase().includes(query) || 
          t(lesson.challengeDescriptionKey as any).toLowerCase().includes(query)
        )
      })).filter(level => level.lessons.length > 0)
    })).filter(module => module.levels.length > 0);
  }, [modules, searchQuery, t]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.map(section => ({
      ...section,
      lessons: section.lessons.filter(lesson => 
        t(lesson.titleKey as any).toLowerCase().includes(query) || 
        t(lesson.challengeDescriptionKey as any).toLowerCase().includes(query)
      )
    })).filter(section => section.lessons.length > 0);
  }, [sections, searchQuery, t]);

  if (modules.length === 0 && sections.length === 0) {
    return (
      <div className="text-center text-slate-400 py-20">
        <p>Lessons for this path are coming soon!</p>
      </div>
    );
  }

  const findNextLesson = () => {
    if (lastCompletedId === 0) return allLessons[0];
    const lastCompletedIndex = allLessons.findIndex(l => l.id === lastCompletedId);
    return allLessons[lastCompletedIndex + 1] || null;
  }
  const nextLesson = findNextLesson();

  return (
    <div className="w-full min-h-full bg-brand-50 dark:bg-slate-900 transition-colors pb-20">
      <div className="max-w-lg mx-auto pt-6 px-4 sticky top-0 z-10 bg-brand-50/80 dark:bg-slate-900/80 backdrop-blur-md pb-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-brand-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t('search_lessons' as any) || "Search lessons..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border-2 border-brand-100 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 transition-all shadow-sm text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="relative max-w-lg mx-auto py-6 px-4">
        {searchQuery.trim() && filteredPaths.length > 0 && (
          <div className="mb-12">
            <SectionTitle title={t('paths' as any) || 'Paths'} />
            <div className="grid grid-cols-1 gap-4">
              {filteredPaths.map(p => (
                <button 
                   key={p.id} 
                   onClick={() => onSwitchPath(p.id)}
                   className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-700 transition-all shadow-sm border-b-2 border-brand-100 dark:border-slate-700 bubbly-btn"
                >
                  <span className="text-2xl mr-3">{p.icon.startsWith('http') ? <img src={p.icon} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" /> : p.icon}</span>
                  <span className="font-bold text-slate-700 dark:text-white uppercase italic tracking-tighter text-sm">{t(p.titleKey as any)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {modules.length > 0 ? (
          filteredModules.map((module, moduleIndex) => (
            <div key={module.id} className="mb-16">
              <ModuleHeader module={module} />
              {module.levels.map((level, levelIndex) => (
                <div key={level.id} className="mb-12">
                  <LevelTitle title={t(level.titleKey as any)} isLocked={level.isLocked} />
                  <div className="relative flex flex-col items-center">
                    {!searchQuery && <div className="absolute top-10 bottom-10 w-2 bg-brand-100 dark:bg-slate-800 rounded-full" />}
                    {level.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isUnlocked = !level.isLocked && (lesson.id === allLessons[0].id || completedLessons.includes(lesson.id - 1));
                      const isNext = nextLesson?.id === lesson.id;

                      return (
                        <div key={lesson.id} className="relative w-full my-8 flex justify-center">
                          <LessonNode
                            lesson={lesson}
                            isCompleted={isCompleted}
                            isUnlocked={isUnlocked}
                            isNext={isNext}
                            onStartLesson={onStartLesson}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          filteredSections.map((section) => (
            <div key={section.id} className="mb-12">
              <SectionTitle title={t(section.titleKey as any)} />
              <div className="relative flex flex-col items-center">
                {!searchQuery && <div className="absolute top-10 bottom-10 w-2 bg-brand-100 dark:bg-slate-800 rounded-full" />}
                {section.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isUnlocked = lesson.id === allLessons[0].id || completedLessons.includes(lesson.id - 1);
                  const isNext = nextLesson?.id === lesson.id;

                  return (
                    <div key={lesson.id} className="relative w-full my-8 flex justify-center">
                      <LessonNode
                        lesson={lesson}
                        isCompleted={isCompleted}
                        isUnlocked={isUnlocked}
                        isNext={isNext}
                        onStartLesson={onStartLesson}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {searchQuery.trim() && filteredPaths.length === 0 && filteredModules.length === 0 && filteredSections.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-7xl mb-6 animate-float">🔍</div>
            <p className="text-slate-400 dark:text-slate-500 font-black text-xl italic uppercase tracking-tighter">No lessons found for "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-brand-500 hover:text-brand-400 font-black uppercase tracking-widest text-sm bg-brand-50 dark:bg-brand-900/20 px-6 py-3 rounded-2xl transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ModuleHeader = ({ module }: { module: Module }) => {
  const { t } = useLanguage();
  return (
    <div className={`p-8 rounded-[2.5rem] ${module.color} text-white shadow-xl mb-10 relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
        <Sparkles className="w-32 h-32" />
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{t(module.titleKey as any)}</h2>
        <p className="text-white/80 font-bold text-sm italic">{t(module.descriptionKey as any)}</p>
        <button className="mt-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/30 transition-all flex items-center gap-2">
          Module Overview <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const LevelTitle = ({ title, isLocked }: { title: string; isLocked: boolean }) => (
  <div className="flex items-center justify-center my-8">
    <div className="flex-grow h-0.5 bg-brand-100 dark:bg-slate-800 rounded-full"></div>
    <div className="mx-4 flex items-center gap-2">
      {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
      <h3 className={`text-brand-400 dark:text-slate-500 font-black uppercase tracking-widest italic text-[10px] ${isLocked ? 'opacity-50' : ''}`}>
        {title}
      </h3>
    </div>
    <div className="flex-grow h-0.5 bg-brand-100 dark:bg-slate-800 rounded-full"></div>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center my-6">
        <div className="flex-grow h-0.5 bg-brand-100 dark:bg-slate-800 rounded-full"></div>
        <h2 className="mx-4 text-brand-400 dark:text-slate-500 font-black uppercase tracking-widest italic text-[10px]">{title}</h2>
        <div className="flex-grow h-0.5 bg-brand-100 dark:bg-slate-800 rounded-full"></div>
    </div>
);


export default LearnScreen;