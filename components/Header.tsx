
import React, { useState, useEffect, useRef } from 'react';
import { User, Language, ProgrammingPath } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { PATHS } from '../constants';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onSwitchPath }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isPathDropdownOpen, setIsPathDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 bg-white dark:bg-slate-800 shadow-lg px-6 py-3 z-20 border-b-4 border-sky-100 dark:border-slate-700 transition-colors">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <h1 className="text-2xl md:hidden font-black text-blue-500 dark:text-blue-400 leading-none italic tracking-tighter">C4T</h1>
        <div className="flex-grow md:hidden"></div>
        <div className="flex items-center space-x-3 sm:space-x-6 rtl:space-x-reverse">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-slate-700 text-sky-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-600 transition-all transform active:scale-90 flex items-center justify-center shadow-sm bubbly-btn border-b-2 border-sky-200 dark:border-slate-600"
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
              className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-2xl hover:bg-sky-100 dark:hover:bg-slate-600 transition-all font-black italic shadow-sm bubbly-btn border-b-2 border-sky-200 dark:border-slate-600"
            >
              <span className="text-xl flex items-center justify-center w-6 h-6">
                {currentPathData?.icon.startsWith('http') ? (
                  <img src={currentPathData.icon} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                ) : (
                  currentPathData?.icon
                )}
              </span>
              <span className="hidden md:inline uppercase tracking-tighter text-sm">{currentPathData ? t(currentPathData.titleKey as any) : '...'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isPathDropdownOpen && (
              <div className="absolute top-full mt-4 w-64 max-h-[350px] overflow-y-auto right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-sky-100 dark:border-slate-700 z-30 no-scrollbar kid-card animate-pop-in">
                <div className="p-3 space-y-1">
                  {PATHS.map(path => (
                    <button
                        key={path.id}
                        onClick={() => {
                          onSwitchPath(path.id);
                          setIsPathDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center space-x-3 p-3 hover:bg-sky-50 dark:hover:bg-slate-700 rounded-xl transition-all group bubbly-btn"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform flex items-center justify-center w-8 h-8">
                          {path.icon.startsWith('http') ? (
                            <img src={path.icon} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            path.icon
                          )}
                        </span>
                        <span className="font-black text-slate-700 dark:text-slate-200 uppercase italic tracking-tighter text-sm">{t(path.titleKey as any)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-orange-500 font-black text-sm bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-2xl shadow-inner border border-orange-100 dark:border-orange-800/30">
                <span className="animate-bounce">🔥</span>
                <span>{currentUser.progress.streak}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-yellow-500 font-black text-sm bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-2xl shadow-inner border border-yellow-100 dark:border-yellow-800/30">
                <span className="animate-pulse">⭐</span>
                <span>{currentUser.progress.xp}</span>
              </div>
          </div>
          
          <div className="relative group">
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="appearance-none bg-sky-50 dark:bg-slate-700 dark:text-slate-200 rounded-2xl px-4 py-2 pr-10 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-sm transition-all border-b-2 border-sky-200 dark:border-slate-600 bubbly-btn text-sm"
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
            className="w-10 h-10 bg-sky-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 transition-all shadow-sm bubbly-btn border-b-2 border-sky-200 dark:border-slate-600"
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
