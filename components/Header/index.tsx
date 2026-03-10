
import React, { useState, useEffect, useRef } from 'react';
import { User, Language, ProgrammingPath } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PATHS } from '../../constants';
import DbSetupGuide from '../DbSetupGuide';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onSwitchPath }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isPathDropdownOpen, setIsPathDropdownOpen] = useState(false);
  const [isDbGuideOpen, setIsDbGuideOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const currentPath = currentUser.currentPath;
  const currentPathData = PATHS.find(p => p.id === currentPath);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPathDropdownOpen(false);
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
        <h1 className="text-2xl md:hidden font-bold text-[#4285F4] dark:text-[#8ab4f8] leading-none tracking-tight">C4T</h1>
        <div className="flex-grow md:hidden"></div>
        <div className="flex items-center space-x-3 sm:space-x-6 rtl:space-x-reverse">

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
                className="text-[10px] font-black text-red-500 uppercase hover:underline"
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

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsPathDropdownOpen(prev => !prev)}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-all font-bold border border-slate-200 dark:border-slate-600"
            >
              <span className="text-xl flex items-center justify-center w-6 h-6">
                {currentPathData?.icon.startsWith('http') ? (
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
                        {path.icon.startsWith('http') ? (
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
              <span>{currentUser.progress.streak}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#F29900] dark:text-[#fde293] font-bold text-sm bg-[#FBBC05]/10 px-3 py-1.5 rounded-full border border-[#FBBC05]/20">
              <span>⭐</span>
              <span>{currentUser.progress.xp}</span>
            </div>
          </div>

          <div className="relative group">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-slate-50 dark:bg-slate-700 dark:text-slate-200 rounded-full pl-4 pr-10 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#4285F4]/50 transition-all border border-slate-200 dark:border-slate-600 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
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
