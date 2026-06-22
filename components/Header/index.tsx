
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Language, ProgrammingPath, Lesson, AppNotification } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PATHS, MODULES_BY_PATH, LESSONS_BY_PATH } from '../../constants';
import DbSetupGuide from '../DbSetupGuide';
import { useSync } from '../../contexts/SyncContext';
import { DashboardView } from '../Dashboard';
import { Bell, BookOpen, Compass, Trophy, Play, Home, Target, Sparkles, Folder, Award, ShoppingBag, FileText, MessageSquare, Settings, ChevronDown, ExternalLink, LogOut, Flame, Unlock, Trash2, CheckCircle, Share2, Bot } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../ToastNotification';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onStartLesson?: (lesson: Lesson) => void;
  activeView?: DashboardView;
  setActiveView?: (view: DashboardView) => void;
  unreadMessagesCount?: number;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onSwitchPath, onStartLesson, activeView, setActiveView, unreadMessagesCount = 0 }) => {
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { showToast } = useToast();

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen]);

  // Real-Time Notification Stream Hookup via SSE
  useEffect(() => {
    if (!currentUser || !currentUser._id || currentUser._id.startsWith('guest_')) return;

    const token = localStorage.getItem('authToken') || '';
    if (!token) return;

    const streamUrl = `/api/notifications/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(streamUrl, { withCredentials: true });

    eventSource.onmessage = (event) => {
      try {
        const newNotif: AppNotification = JSON.parse(event.data);
        console.log(' SSE: Received new notification:', newNotif);
        
        // Append to notifications state
        setNotifications(prev => {
          if (prev.some(n => n._id === newNotif._id)) return prev;
          return [newNotif, ...prev];
        });

        // Trigger dynamic toast popup
        showToast(newNotif.message, 'success');
      } catch (err) {
        console.error('Error parsing SSE notification:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error(' SSE connection error, browser will auto-retry:', err);
    };

    return () => {
      console.log(' SSE: Closing stream connection');
      eventSource.close();
    };
  }, [currentUser, showToast]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isLearnHovered, setIsLearnHovered] = useState(false);
  const [isMissionsHovered, setIsMissionsHovered] = useState(false);
  const [showAllLanguagesGrid, setShowAllLanguagesGrid] = useState(false);

  useEffect(() => {
    if (!isLearnHovered) {
      setShowAllLanguagesGrid(false);
    }
  }, [isLearnHovered]);

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
      congratsTitle: "Path Completed! ",
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
      congratsTitle: "Parcours Terminé ! ",
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
      congratsTitle: "تم إكمال المسار! ",
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
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'streak_at_risk':
        return <Flame className="w-4 h-4 text-orange-500 shrink-0 animate-bounce" />;
      case 'leaderboard_rank_change':
        return <Trophy className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'course_unlocked':
        return <Unlock className="w-4 h-4 text-indigo-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const formatNotificationDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / (1000 * 60));
    const diffHr = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const primaryNavItems = [
    { id: 'home', label: t('home'), icon: <Home className="w-4 h-4" /> },
    { id: 'learn', label: t('learn'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'feed', label: language === 'fr' ? 'Communauté' : language === 'ar' ? 'الموجز' : 'Feed', icon: <Share2 className="w-4 h-4" /> },
    { id: 'creations', label: t('creations'), icon: <Folder className="w-4 h-4" /> },
    { id: 'missions', label: t('missions') || 'Missions', icon: <Target className="w-4 h-4" /> },
    { id: 'ai-assistant', label: t('ai_assistant') || 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
  ];

  const secondaryNavItems = [
    { id: 'store', label: t('store'), icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'docs', label: 'Docs', icon: <FileText className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: t('settings'), icon: <Settings className="w-4 h-4" /> },
    { id: 'logout', label: t('logout') || 'Logout', icon: <LogOut className="w-4 h-4" /> },
  ];
  const subNavTranslations = {
    en: [
      { label: "How do I learn?", href: "how-to-learn", isExternal: false, icon: <Compass className="w-3.5 h-3.5 text-indigo-500" /> },
      { label: "What are missions?", href: "missions", isExternal: false, icon: <Target className="w-3.5 h-3.5 text-emerald-500" /> },
      { label: "Who is leading?", href: "leaderboard", isExternal: false, icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" /> },
      { label: "Follow Us", href: "https://wa.me/212600000000", isExternal: true, icon: <MessageSquare className="w-3.5 h-3.5 text-rose-500" /> }
    ],
    fr: [
      { label: "Comment apprendre ?", href: "how-to-learn", isExternal: false, icon: <Compass className="w-3.5 h-3.5 text-indigo-500" /> },
      { label: "Qu'est-ce que les missions ?", href: "missions", isExternal: false, icon: <Target className="w-3.5 h-3.5 text-emerald-500" /> },
      { label: "Qui est en tête ?", href: "leaderboard", isExternal: false, icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" /> },
      { label: "Suivez-nous", href: "https://wa.me/212600000000", isExternal: true, icon: <MessageSquare className="w-3.5 h-3.5 text-rose-500" /> }
    ],
    ar: [
      { label: "كيف أتعلم؟", href: "how-to-learn", isExternal: false, icon: <Compass className="w-3.5 h-3.5 text-indigo-500" /> },
      { label: "ما هي المهام؟", href: "missions", isExternal: false, icon: <Target className="w-3.5 h-3.5 text-emerald-500" /> },
      { label: "من في الصدارة؟", href: "leaderboard", isExternal: false, icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" /> },
      { label: "تابعنا", href: "https://wa.me/212600000000", isExternal: true, icon: <MessageSquare className="w-3.5 h-3.5 text-rose-500" /> }
    ]
  };

  const missionsSubNavTranslations = {
    en: [
      { label: "Leadership", href: "leaderboard", icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" /> }
    ],
    fr: [
      { label: "Classement", href: "leaderboard", icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" /> }
    ],
    ar: [
      { label: "لوحة الصدارة", href: "leaderboard", icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" /> }
    ]
  };

  const handleSubItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const internalViews = ['how-to-learn', 'missions', 'leaderboard'];
    if (internalViews.includes(href)) {
      e.preventDefault();
      if (setActiveView) {
        setActiveView(href as DashboardView);
      }
    } else if (href.startsWith('#')) {
      e.preventDefault();
      if (setActiveView) {
        setActiveView('home');
      }
      setTimeout(() => {
        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    }
  };

  return (
    <header className="sticky top-0 bg-[#111827] dark:bg-slate-900 px-6 py-3 z-20 border-b border-[#1f2937] dark:border-slate-800 transition-colors text-white">
      <DbSetupGuide
        isOpen={isDbGuideOpen}
        onClose={() => setIsDbGuideOpen(false)}
        onRetry={handleRetryDb}
        isRetrying={dbStatus === 'loading'}
      />
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        {/* Left Side: App Launcher, Logo, Explore Dropdown, My Learning */}
        <div className="flex items-center gap-4">
          {/* App Launcher (Bento/Grid Menu icon) */}
          <button 
            onClick={() => navigate('/portals')}
            className="p-2 hover:bg-white/10 dark:hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView && setActiveView('home')}>
            <h1 className="text-2xl font-bold text-white dark:text-white leading-none tracking-tight">C4T</h1>
          </div>

          {/* Explore Dropdown */}
          {setActiveView && (
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0056D2] hover:bg-[#00419e] text-white rounded-lg font-bold text-sm transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Explore</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExploreOpen && (
                <div className="absolute top-full left-0 mt-3 w-[460px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-50 grid grid-cols-2 gap-6 animate-[fade-in_0.2s_ease-out]">
                  {/* Column 1: Ecosystem Portals */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                      Portals
                    </h3>
                    <div className="flex flex-col gap-1">
                      {primaryNavItems.map((item) => {
                        const isActive = activeView === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveView(item.id as DashboardView);
                              setIsExploreOpen(false);
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm font-bold transition-all w-full cursor-pointer hover:bg-slate-800/80 ${
                              isActive
                                ? 'text-blue-400 bg-slate-850'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <span className={isActive ? 'text-blue-400' : 'text-slate-450'}>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Platform & Settings */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">
                      Resources & More
                    </h3>
                    <div className="flex flex-col gap-1">
                      {secondaryNavItems.map((item) => {
                        const isActive = activeView === item.id;
                        const isLogout = item.id === 'logout';
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (isLogout) {
                                onLogout();
                              } else {
                                setActiveView(item.id as DashboardView);
                              }
                              setIsExploreOpen(false);
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm font-bold transition-all w-full cursor-pointer hover:bg-slate-800/80 ${
                              isActive
                                ? 'text-blue-400 bg-slate-850'
                                : isLogout
                                  ? 'text-red-400 hover:bg-red-950/20'
                                  : 'text-slate-305 hover:text-white'
                            }`}
                          >
                            <span className={isActive ? 'text-blue-400' : isLogout ? 'text-red-400' : 'text-slate-450'}>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My Learning Link */}
          {setActiveView && (
            <button
              onClick={() => setActiveView('learn')}
              className={`px-3 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                activeView === 'learn'
                  ? 'text-blue-450 font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-slate-800'
              }`}
            >
              My Learning
            </button>
          )}
        </div>

        {/* Center: Search Bar (Coursera Styled) */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative flex items-center w-full bg-slate-950/60 border border-slate-800 rounded-full py-1.5 pl-4 pr-10 shadow-inner group focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
            <input
              type="text"
              placeholder="Search C4T courses, lessons and skills..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium pr-2 border-none ring-0 outline-none"
            />
            <button className="absolute right-1 w-8 h-8 rounded-full bg-[#0056D2] hover:bg-[#00419e] text-white flex items-center justify-center transition-colors cursor-pointer shadow active:scale-95">
              <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6 rtl:space-x-reverse">

          {/* Network / Sync Status Indicator */}
          <div className="flex items-center gap-2 border-r border-[#1f2937] dark:border-slate-700 pr-3 sm:pr-4">
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

          {/* Theme Toggle — Animated Pill */}
          <button
            onClick={toggleTheme}
            className={`relative w-[52px] h-[28px] rounded-full transition-all duration-500 ease-in-out flex items-center cursor-pointer shrink-0 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#111827] ${
              theme === 'light'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 border-amber-500/30 focus:ring-amber-400/50'
                : 'bg-gradient-to-r from-indigo-600 to-violet-700 border-indigo-400/30 focus:ring-indigo-400/50'
            }`}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {/* Sliding indicator */}
            <div
              className={`absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center ${
                theme === 'light'
                  ? 'left-[3px] bg-white'
                  : 'left-[27px] bg-slate-900'
              }`}
            >
              {/* Sun icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3.5 h-3.5 text-amber-500 absolute transition-all duration-400 ${
                  theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707-.707M6.343 17.657l-.707.707m12.728 0l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {/* Moon icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3.5 h-3.5 text-indigo-300 absolute transition-all duration-400 ${
                  theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </div>
            {/* Decorative stars for dark mode */}
            <div className={`absolute right-[8px] top-[5px] transition-all duration-500 ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className={`absolute right-[14px] top-[10px] transition-all duration-500 delay-75 ${theme === 'dark' ? 'opacity-70 scale-100' : 'opacity-0 scale-0'}`}>
              <div className="w-0.5 h-0.5 bg-white/80 rounded-full animate-pulse [animation-delay:0.5s]"></div>
            </div>
            {/* Decorative rays for light mode */}
            <div className={`absolute left-[30px] top-[6px] transition-all duration-500 ${theme === 'light' ? 'opacity-60 scale-100' : 'opacity-0 scale-0'}`}>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className={`absolute left-[38px] top-[12px] transition-all duration-500 delay-75 ${theme === 'light' ? 'opacity-40 scale-100' : 'opacity-0 scale-0'}`}>
              <div className="w-0.5 h-0.5 bg-white/80 rounded-full"></div>
            </div>
          </button>

          {/* Messaging Shortcut Icon */}
          <button
            onClick={() => setActiveView && setActiveView('messages')}
            className={`relative w-10 h-10 rounded-full transition-all flex items-center justify-center border cursor-pointer shrink-0 aspect-square ${
              activeView === 'messages'
                ? 'bg-[#FBBF24] text-slate-900 border-[#FBBF24]'
                : 'bg-white/10 text-slate-200 hover:bg-white/20 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 border-white/10 dark:border-slate-600'
            }`}
            aria-label="Messages"
            title="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#111827] dark:border-slate-900 px-1 animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notification Bell */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setIsNotificationOpen(prev => !prev)}
              className="relative w-10 h-10 rounded-full bg-white/10 text-slate-200 hover:bg-white/20 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all flex items-center justify-center border border-white/10 dark:border-slate-600 cursor-pointer shrink-0 aspect-square"
              aria-label="Notifications"
              title={texts.notifications}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#111827] dark:border-slate-900 px-1 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className={`absolute top-full mt-2 w-80 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 z-30 overflow-hidden origin-top-right transition-all duration-200 ${language === Language.AR ? 'left-0 right-auto origin-top-left' : ''}`}>
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-extrabold text-slate-800 dark:text-white tracking-wide text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#111827] dark:text-indigo-300" />
                    <span>{texts.notifications}</span>
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-black text-[#0a66c2] hover:text-blue-700 dark:text-[#70b5f9] dark:hover:text-blue-400 uppercase tracking-wider cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-150 dark:divide-slate-700/50">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleMarkAsRead(n._id)}
                        className={`p-3.5 flex gap-3 items-start transition-all hover:bg-slate-50/80 dark:hover:bg-slate-700/40 cursor-pointer relative group ${!n.read ? 'bg-blue-50/15 dark:bg-blue-950/10' : ''}`}
                      >
                        {/* Unread indicator dot */}
                        {!n.read && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0a66c2] dark:bg-[#70b5f9] rounded-full" />
                        )}
                        
                        <div className="mt-0.5 shrink-0">
                          {getNotificationIcon(n.type)}
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className={`text-xs font-bold text-slate-850 dark:text-white leading-tight ${!n.read ? 'font-extrabold' : ''}`}>
                            {n.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-0.5 whitespace-pre-wrap">
                            {n.message}
                          </p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-1">
                            {formatNotificationDate(n.createdAt)}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleDeleteNotification(n._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all rounded cursor-pointer shrink-0"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-450 dark:text-slate-500 font-semibold select-none">
                      {texts.noNotifications}
                    </div>
                  )}
                </div>

                {/* Recommendations fallback if notifications are empty */}
                {notifications.length === 0 && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20">
                    {/* Scenario 1: No Path Selected */}
                    {!hasSelectedPath && (
                      <div className="text-center">
                        <div className="w-10 h-10 bg-[#111827]/10 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Compass className="w-5 h-5 text-[#111827] dark:text-indigo-300" />
                        </div>
                        <h4 className="font-bold text-slate-850 dark:text-white text-xs mb-0.5">{texts.choosePathTitle}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-3 leading-relaxed">{texts.choosePathDesc}</p>
                        <button
                          onClick={() => {
                            setIsNotificationOpen(false);
                            navigate('/dashboard/learn');
                          }}
                          className="w-full bg-[#111827] hover:bg-[#1f2937] text-white text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer animate-[pulse_2s_infinite]"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>{texts.choosePathBtn}</span>
                        </button>
                      </div>
                    )}

                    {/* Scenario 2: Path Completed */}
                    {hasSelectedPath && isPathCompleted && (
                      <div className="text-center">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-5 h-5 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-slate-850 dark:text-white text-xs mb-0.5">{texts.congratsTitle}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-3 leading-relaxed">{texts.congratsDesc}</p>
                        <button
                          onClick={() => {
                            setIsNotificationOpen(false);
                            navigate('/dashboard/learn');
                          }}
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>{texts.explorePathsBtn}</span>
                        </button>
                      </div>
                    )}

                    {/* Scenario 3: Next Lesson Available */}
                    {hasSelectedPath && nextLesson && (
                      <div className="space-y-2.5">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-100 dark:border-slate-700/60 relative overflow-hidden group">
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-[#111827] to-[#111827] dark:from-slate-900 dark:to-slate-900 shadow mt-0.5">
                              <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black uppercase tracking-wider text-[#111827] dark:text-[#FBBF24] mb-0.5">{texts.nextUpTitle}</p>
                              <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate">
                                {t(nextLesson.titleKey as any)}
                              </h4>
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
                          className="w-full bg-[#111827] hover:bg-[#1f2937] text-white text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{texts.resumeBtn}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>





          <div className="relative group">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-white/10 text-slate-100 dark:bg-slate-700 dark:text-slate-200 rounded-full pl-4 pr-10 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#111827]/50 transition-all border border-white/10 dark:border-slate-600 text-sm cursor-pointer hover:bg-white/20 dark:hover:bg-slate-600"
              aria-label="Select language"
            >
              <option value={Language.EN} className="text-black dark:text-white">EN</option>
              <option value={Language.FR} className="text-black dark:text-white">FR</option>
              <option value={Language.AR} className="text-black dark:text-white">AR</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-300 dark:text-slate-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveView && setActiveView('profile')}
            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-105 duration-200 cursor-pointer shrink-0 aspect-square ${
              activeView === 'profile'
                ? 'border-[#FBBF24] ring-2 ring-[#FBBF24]/20'
                : 'border-white/10 hover:border-white/30 dark:border-slate-600 dark:hover:border-slate-500'
            }`}
            title="Profile"
          >
            <img
              src={currentUser.profilePictureUrl || 'https://ui-avatars.com/api/?name=U&background=random'}
              alt={currentUser.name || 'User'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>


        </div>
      </div>
      
      {/* Horizontal Sub-Navbar in standard layout flow */}
      <div 
        onMouseEnter={() => setIsHomeHovered(true)}
        onMouseLeave={() => setIsHomeHovered(false)}
        className={`bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden z-10 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 relative ${
          isHomeHovered 
            ? 'max-h-12 opacity-100 border-t border-[#1f2937] dark:border-slate-700 py-2.5 px-6' 
            : 'max-h-0 opacity-0 border-t-0 py-0 px-6'
        }`}
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-start gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
          {(subNavTranslations[language as 'en' | 'fr' | 'ar'] || subNavTranslations.en).map((subItem: any, idx: number) => {
            const linkContent = (
              <span className="flex items-center gap-1.5 group/item select-none cursor-pointer">
                {subItem.icon}
                <span className="group-hover/item:underline underline-offset-4 decoration-1 decoration-slate-300 dark:decoration-slate-600 transition-all">{subItem.label}</span>
                {subItem.isExternal && <ExternalLink className="w-3 h-3 text-slate-400 group-hover/item:text-slate-600 dark:text-slate-500 dark:group-hover/item:text-slate-300 transition-colors" />}
              </span>
            );

            if (subItem.isExternal) {
              return (
                <a
                  key={idx}
                  href={subItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#111827] dark:text-slate-400 dark:hover:text-[#FBBF24] font-semibold text-xs tracking-wide transition-colors duration-200"
                >
                  {linkContent}
                </a>
              );
            }
            return (
              <a
                key={idx}
                href={subItem.href}
                onClick={(e) => handleSubItemClick(e, subItem.href)}
                className="text-slate-500 hover:text-[#111827] dark:text-slate-400 dark:hover:text-[#FBBF24] font-semibold text-xs tracking-wide transition-colors duration-200"
              >
                {linkContent}
              </a>
            );
          })}
        </div>
      </div>
      {/* Horizontal Sub-Navbar for Learn in standard layout flow */}
      <div 
        onMouseEnter={() => setIsLearnHovered(true)}
        onMouseLeave={() => setIsLearnHovered(false)}
        className={`bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden z-10 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 relative ${
          isLearnHovered 
            ? showAllLanguagesGrid
              ? 'max-h-[460px] opacity-100 border-t border-[#1f2937] dark:border-slate-700 py-4 px-6 overflow-y-auto'
              : 'max-h-12 opacity-100 border-t border-[#1f2937] dark:border-slate-700 py-2 px-6' 
            : 'max-h-0 opacity-0 border-t-0 py-0 px-6'
        }`}
      >
        {showAllLanguagesGrid ? (
          <div className="container mx-auto max-w-7xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {texts.choosePathTitle || 'All Coding Journeys'}
              </h3>
              <button
                onClick={() => setShowAllLanguagesGrid(false)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#111827] dark:text-[#FBBF24] hover:underline cursor-pointer"
              >
                <span>Show Less</span>
                <ChevronDown className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[320px] overflow-y-auto pr-1 no-scrollbar pb-2">
              {PATHS.map((path) => {
                const isCurrent = currentPath === path.id;
                return (
                  <button
                    key={path.id}
                    onClick={() => {
                      onSwitchPath(path.id);
                      setIsLearnHovered(false);
                      setShowAllLanguagesGrid(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${
                      isCurrent 
                        ? 'bg-slate-50 dark:bg-slate-800 border-[#111827] dark:border-[#FBBF24] ring-1 ring-[#111827] dark:ring-[#FBBF24]' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border flex items-center justify-center w-11 h-11 shrink-0 ${
                      isCurrent 
                        ? 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                    }`}>
                      {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                        <img src={path.icon} alt="" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-xl">{path.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate leading-snug mb-0.5">
                        {t(path.titleKey as any)}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold line-clamp-2 leading-normal">
                        {t(path.descriptionKey as any)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="container mx-auto max-w-7xl flex items-center justify-start gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar scroll-smooth w-full py-0.5">
            {PATHS.map((path) => {
              const isCurrent = currentPath === path.id;
              return (
                <button
                  key={path.id}
                  onClick={() => {
                    onSwitchPath(path.id);
                    setIsLearnHovered(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 select-none group/item cursor-pointer ${
                    isCurrent 
                      ? 'bg-[#111827] text-white dark:bg-[#FBBF24] dark:text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-[#111827] dark:hover:text-[#FBBF24] hover:bg-slate-100 dark:hover:bg-slate-700/50 font-semibold'
                  }`}
                >
                  <span className="text-base flex items-center justify-center w-5 h-5 group-hover/item:scale-110 transition-transform">
                    {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                      <img src={path.icon} alt="" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      path.icon
                    )}
                  </span>
                  <span className="text-xs">{t(path.titleKey as any)}</span>
                </button>
              );
            })}
            
            {/* Show More Trigger Button */}
            <button
              onClick={() => setShowAllLanguagesGrid(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[#111827] dark:text-[#FBBF24] hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all cursor-pointer font-extrabold shrink-0 border border-slate-200/50 dark:border-slate-700/50"
            >
              <span>Show More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Sub-Navbar for Missions in standard layout flow */}
      <div 
        onMouseEnter={() => setIsMissionsHovered(true)}
        onMouseLeave={() => setIsMissionsHovered(false)}
        className={`bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden z-10 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 relative ${
          isMissionsHovered 
            ? 'max-h-12 opacity-100 border-t border-[#1f2937] dark:border-slate-700 py-2.5 px-6' 
            : 'max-h-0 opacity-0 border-t-0 py-0 px-6'
        }`}
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-start gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
          {(missionsSubNavTranslations[language as 'en' | 'fr' | 'ar'] || missionsSubNavTranslations.en).map((subItem: any, idx: number) => {
            const linkContent = (
              <span className="flex items-center gap-1.5 group/item select-none cursor-pointer">
                {subItem.icon}
                <span className="group-hover/item:underline underline-offset-4 decoration-1 decoration-slate-300 dark:decoration-slate-600 transition-all">{subItem.label}</span>
              </span>
            );

            return (
              <a
                key={idx}
                href={subItem.href}
                onClick={(e) => handleSubItemClick(e, subItem.href)}
                className="text-slate-500 hover:text-[#111827] dark:text-slate-400 dark:hover:text-[#FBBF24] font-semibold text-xs tracking-wide transition-colors duration-200"
              >
                {linkContent}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
