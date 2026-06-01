
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Language, ProgrammingPath, Lesson } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PATHS, MODULES_BY_PATH, LESSONS_BY_PATH } from '../../constants';
import DbSetupGuide from '../DbSetupGuide';
import { useSync } from '../../contexts/SyncContext';
import { Bell, BookOpen, Compass, Trophy, Play } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onStartLesson?: (lesson: Lesson) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onSwitchPath, onStartLesson }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isOnline, syncPending, triggerSync } = useSync();
  const { theme, toggleTheme } = useTheme();
  const [isPathDropdownOpen, setIsPathDropdownOpen] = useState(false);
  const [isDbGuideOpen, setIsDbGuideOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const currentPath = currentUser.currentPath;
  const currentPathData = PATHS.find(p => p.id === currentPath);

  const { nextLesson, isPathCompleted, hasSelectedPath } = React.useMemo(() => {
    if (!currentPath) {
      return { nextLesson: null, isPathCompleted: false, hasSelectedPath: false };
    }
    const modules = MODULES_BY_PATH[currentPath] || [];
    const sections = LESSONS_BY_PATH[currentPath] || [];
    const allLessons = modules.length > 0 
      ? modules.flatMap(m => m.levels.flatMap(l => l.lessons)) 
      : sections.flatMap(s => s.lessons);
    
    if (allLessons.length === 0) {
      return { nextLesson: null, isPathCompleted: false, hasSelectedPath: true };
    }
    
    const completedLessons = currentUser.progress?.completedLessons?.[currentPath] || [];
    const firstUncompleted = allLessons.find(l => !completedLessons.includes(l.id));
    
    return {
      nextLesson: firstUncompleted || null,
      isPathCompleted: allLessons.length > 0 && !firstUncompleted,
      hasSelectedPath: true
    };
  }, [currentPath, currentUser.progress?.completedLessons]);

  const localizedTexts = {
    en: {
      notifications: "Notifications",
      nextSteps: "Next Steps",
      choosePathTitle: "Choose a Learning Path",
      choosePathDesc: "Select a coding path (Python, JavaScript, etc.) to start your learning journey!",
      choosePathBtn: "Choose Path",
      congratsTitle: "Path Completed! 🎉",
      congratsDesc: `Congratulations! You have completed all lessons in ${currentPathData ? t(currentPathData.titleKey as any) : 'this path'}. Explore other paths to continue.`,
      explorePathsBtn: "Explore Paths",
      nextUpTitle: "Next Lesson",
      resumeBtn: "Resume Learning",
      noNotifications: "No new notifications",
      xpReward: "XP Reward",
      minutes: "mins",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
    },
    fr: {
      notifications: "Notifications",
      nextSteps: "Étapes Suivantes",
      choosePathTitle: "Choisir un Parcours",
      choosePathDesc: "Sélectionnez un parcours de code (Python, JavaScript, etc.) pour commencer votre apprentissage !",
      choosePathBtn: "Choisir un parcours",
      congratsTitle: "Parcours Terminé ! 🎉",
      congratsDesc: `Félicitations ! Vous avez terminé toutes les leçons de ${currentPathData ? t(currentPathData.titleKey as any) : 'ce parcours'}. Explorez d'autres parcours.`,
      explorePathsBtn: "Explorer les parcours",
      nextUpTitle: "Prochaine Leçon",
      resumeBtn: "Reprendre l'apprentissage",
      noNotifications: "Aucune nouvelle notification",
      xpReward: "Récompense XP",
      minutes: "min",
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
      expert: "Expert",
    },
    ar: {
      notifications: "الإشعارات",
      nextSteps: "الخطوات التالية",
      choosePathTitle: "اختر مسارًا تعليميًا",
      choosePathDesc: "اختر مسارًا للبرمجة (بايثون، جافا سكريبت، إلخ) لبدء رحلة التعلم الخاصة بك!",
      choosePathBtn: "اختر المسار",
      congratsTitle: "تم إكمال المسار! 🎉",
      congratsDesc: `تهانينا! لقد أكملت جميع الدروس في مسار ${currentPathData ? t(currentPathData.titleKey as any) : 'هذا المسار'}. استكشف مسارات أخرى للمتابعة.`,
      explorePathsBtn: "استكشف المسارات",
      nextUpTitle: "الدرس التالي",
      resumeBtn: "مواصلة التعلم",
      noNotifications: "لا توجد إشعارات جديدة",
      xpReward: "نقاط خبرة",
      minutes: "دقائق",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
      expert: "خبير",
    }
  };

  const texts = localizedTexts[language as 'en' | 'fr' | 'ar'] || localizedTexts.en;

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setDbStatus(data.database === 'connected' ? 'connected' : 'disconnected');
      } catch (error) {
        setDbStatus('disconnected');
      }
    };
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleRetryDb = async () => {
    setDbStatus('loading');
    try {
      const response = await fetch('/api/health/retry', { method: 'POST' });
      const data = await response.json();
      setDbStatus(data.database === 'connected' ? 'connected' : 'disconnected');
    } catch (error) {
      setDbStatus('disconnected');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPathDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-800 shadow-sm px-6 py-3 z-20 border-b border-slate-200 dark:border-slate-700 transition-colors">
      <DbSetupGuide
        isOpen={isDbGuideOpen}
        onClose={() => setIsDbGuideOpen(false)}
        onRetry={handleRetryDb}
        isRetrying={dbStatus === 'loading'}
      />
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <h1 className="text-2xl md:hidden font-bold text-[#2E2FCE] dark:text-[#a3aaeb] leading-none tracking-tight">C4T</h1>
        <div className="flex-grow md:hidden"></div>
        <div className="flex items-center space-x-3 sm:space-x-6 rtl:space-x-reverse">

          {/* Network / Sync Status Indicator */}
          <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-3 sm:pr-4">
            <div
              className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                !isOnline ? 'bg-amber-500 animate-pulse' :
                syncPending ? 'bg-cyan-500 animate-spin border border-dashed border-cyan-400' : 'bg-emerald-500'
              }`}
              title={
                !isOnline ? 'Offline - Progress cached locally' :
                syncPending ? 'Unsynced actions pending' : 'Synced & Online'
              }
            />
            <span className="text-[10px] font-black uppercase text-slate-500 select-none">
              {!isOnline ? 'Offline' : syncPending ? 'Sync Pending' : 'Online'}
            </span>
            {syncPending && isOnline && (
              <button
                onClick={triggerSync}
                className="text-[8px] font-black text-cyan-500 hover:text-cyan-600 transition-colors uppercase border border-cyan-500/20 px-2 py-0.5 rounded-full hover:bg-cyan-500/5 cursor-pointer ml-1"
              >
                Sync
              </button>
            )}
          </div>

          {/* DB Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full shadow-sm ${dbStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                dbStatus === 'loading' ? 'bg-yellow-400 animate-spin' : 'bg-red-500'
                }`}
              title={dbStatus === 'connected' ? 'Database Connected' : 'Database Disconnected - Check IP Whitelist'}
            ></div>
            {dbStatus === 'disconnected' && (
              <button
                onClick={() => setIsDbGuideOpen(true)}
                className="text-[10px] font-black text-red-500 uppercase hover:underline cursor-pointer"
              >
                Fix Connection
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-600"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l.707.707m12.728 12.728l.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Notification Bell */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setIsNotificationOpen(prev => !prev)}
              className="relative w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-600 cursor-pointer"
              aria-label="Notifications"
              title={texts.notifications}
            >
              <Bell className="h-5 w-5" />
              {(!hasSelectedPath || !!nextLesson) && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-800 animate-pulse" />
              )}
            </button>

            {isNotificationOpen && (
              <div className={`absolute top-full mt-2 w-80 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 z-30 overflow-hidden origin-top-right transition-all duration-200 ${language === Language.AR ? 'left-0 right-auto origin-top-left' : ''}`}>
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-extrabold text-slate-800 dark:text-white tracking-wide text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#2E2FCE]" />
                    <span>{texts.nextSteps}</span>
                  </h3>
                  {(!hasSelectedPath || !!nextLesson) && (
                    <span className="bg-[#2E2FCE]/10 text-[#2E2FCE] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      1 New
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {/* Scenario 1: No Path Selected */}
                  {!hasSelectedPath && (
                    <div className="text-center py-2">
                      <div className="w-12 h-12 bg-[#2E2FCE]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Compass className="w-6 h-6 text-[#2E2FCE]" />
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{texts.choosePathTitle}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-relaxed">{texts.choosePathDesc}</p>
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          navigate('/dashboard/learn');
                        }}
                        className="w-full bg-[#2E2FCE] hover:bg-[#3367d6] text-white text-xs font-black uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer animate-[pulse_2s_infinite]"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{texts.choosePathBtn}</span>
                      </button>
                    </div>
                  )}

                  {/* Scenario 2: Path Completed */}
                  {hasSelectedPath && isPathCompleted && (
                    <div className="text-center py-2">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-amber-500" />
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{texts.congratsTitle}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-relaxed">{texts.congratsDesc}</p>
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          navigate('/dashboard/learn');
                        }}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{texts.explorePathsBtn}</span>
                      </button>
                    </div>
                  )}

                  {/* Scenario 3: Next Lesson Available */}
                  {hasSelectedPath && nextLesson && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700/60 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-[#2E2FCE]/5 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-[#2E2FCE] to-[#2E2FCE] shadow-md shadow-blue-500/20 mt-0.5">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-wider text-[#2E2FCE] mb-0.5">{texts.nextUpTitle}</p>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                              {t(nextLesson.titleKey as any)}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                ⭐ +{nextLesson.xp} XP
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                ⏱️ {nextLesson.estimatedMinutes || 10} {texts.minutes}
                              </span>
                              {nextLesson.difficulty && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  nextLesson.difficulty === 'Beginner' ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' :
                                  nextLesson.difficulty === 'Intermediate' ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30' :
                                  'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
                                }`}>
                                  {nextLesson.difficulty === 'Beginner' ? texts.beginner :
                                   nextLesson.difficulty === 'Intermediate' ? texts.intermediate :
                                   nextLesson.difficulty === 'Advanced' ? texts.advanced : texts.expert}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          if (onStartLesson) {
                            onStartLesson(nextLesson);
                          }
                        }}
                        className="w-full bg-[#2E2FCE] hover:bg-[#3367d6] text-white text-xs font-black uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{texts.resumeBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsPathDropdownOpen(prev => !prev)}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-all font-bold border border-slate-200 dark:border-slate-600"
            >
              <span className="text-xl flex items-center justify-center w-6 h-6">
                {currentPathData?.icon.startsWith('http') || currentPathData?.icon.startsWith('/') ? (
                  <img src={currentPathData.icon} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                ) : (
                  currentPathData?.icon
                )}
              </span>
              <span className="hidden md:inline tracking-wide text-sm">{currentPathData ? t(currentPathData.titleKey as any) : '...'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isPathDropdownOpen && (
              <div className="absolute top-full mt-2 w-64 max-h-[350px] overflow-y-auto right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 z-30 no-scrollbar origin-top-right transition-all">
                <div className="p-2 space-y-1">
                  {PATHS.map(path => (
                    <button
                      key={path.id}
                      onClick={() => {
                        onSwitchPath(path.id);
                        setIsPathDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center space-x-3 rtl:space-x-reverse p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform flex items-center justify-center w-8 h-8">
                        {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                          <img src={path.icon} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          path.icon
                        )}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 tracking-wide text-sm">{t(path.titleKey as any)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-[#EA4335] font-bold text-sm bg-[#EA4335]/10 px-3 py-1.5 rounded-full border border-[#EA4335]/20">
              <span>🔥</span>
              <span>{currentUser.progress?.streak ?? 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#F29900] dark:text-[#fde293] font-bold text-sm bg-[#FBBC05]/10 px-3 py-1.5 rounded-full border border-[#FBBC05]/20">
              <span>⭐</span>
              <span>{currentUser.progress?.xp ?? 0}</span>
            </div>
          </div>

          <div className="relative group">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-slate-50 dark:bg-slate-700 dark:text-slate-200 rounded-full pl-4 pr-10 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#2E2FCE]/50 transition-all border border-slate-200 dark:border-slate-600 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
              aria-label="Select language"
            >
              <option value={Language.EN}>EN</option>
              <option value={Language.FR}>FR</option>
              <option value={Language.AR}>AR</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-10 h-10 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 transition-all border border-slate-200 dark:border-slate-600"
            title={t('logout')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
