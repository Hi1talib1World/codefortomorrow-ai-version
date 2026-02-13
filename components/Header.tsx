
import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, Language, ProgrammingPath } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PATHS } from '../constants';

interface HeaderProps {
  userProgress: UserProgress;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  currentPath: ProgrammingPath['id'];
}

const Header: React.FC<HeaderProps> = ({ userProgress, onLogout, onSwitchPath, currentPath }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isPathDropdownOpen, setIsPathDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 bg-white shadow-md p-4 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:hidden font-black text-blue-500">Code Cubs</h1>
        <div className="flex-grow md:hidden"></div>
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse text-sm md:text-base">
          
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsPathDropdownOpen(prev => !prev)}
              className="flex items-center space-x-2 bg-slate-200 text-slate-700 p-2 rounded-lg hover:bg-slate-300 transition font-bold"
            >
              <span className="text-xl">{currentPathData?.icon}</span>
              <span className="hidden md:inline">{currentPathData ? t(currentPathData.titleKey as any) : '...'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isPathDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 max-h-60 overflow-y-auto right-0 bg-white rounded-lg shadow-xl border border-slate-200">
                <ul>
                  {PATHS.map(path => (
                    <li key={path.id}>
                      <button
                        onClick={() => {
                          onSwitchPath(path.id);
                          setIsPathDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center space-x-3 p-3 hover:bg-slate-100 transition"
                      >
                        <span className="text-2xl">{path.icon}</span>
                        <span className="font-bold text-slate-700">{t(path.titleKey as any)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-orange-500 font-bold">
            <span>🔥</span>
            <span>{userProgress.streak}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-yellow-500 font-bold">
            <span>⭐</span>
            <span>{userProgress.xp}</span>
          </div>
          
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-slate-200 rounded-md p-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select language"
          >
            <option value={Language.EN}>🇬🇧</option>
            <option value={Language.FR}>🇫🇷</option>
            <option value={Language.AR}>🇲🇦</option>
          </select>
          <button
            onClick={onLogout}
            className="bg-slate-200 text-slate-600 p-2 rounded-lg hover:bg-red-200 hover:text-red-600 transition"
            title={t('logout')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="sr-only">{t('logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;