
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Language } from '../../types';

const SettingsScreen: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="p-4 md:p-12 bg-transparent min-h-full">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black text-slate-800 dark:text-white mb-12 italic tracking-tighter uppercase">
          {t('settings')}
        </h1>
        
        {/* Language Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-slate-200 dark:border-slate-900 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-4xl">🌍</span>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('language_label')}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mb-6 leading-tight">
            {t('settings_language_desc')}
          </p>
          <div className="relative w-full sm:w-80">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full appearance-none bg-slate-100 dark:bg-slate-700 border-4 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-black py-5 px-6 rounded-2xl text-xl leading-tight focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer"
              aria-label={t('language_label')}
            >
              <option value={Language.EN}>🇬🇧 {t('language_english')}</option>
              <option value={Language.FR}>🇫🇷 {t('language_french')}</option>
              <option value={Language.AR}>🇲🇦 {t('language_arabic')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Theme / Appearance Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-slate-200 dark:border-slate-900 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-4xl">🎨</span>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('appearance')}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mb-8 leading-tight">
            {t('appearance_desc')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Light Mode Button */}
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`relative flex flex-col items-center p-8 rounded-3xl border-4 transition-all transform active:scale-95 ${
                theme === 'light' 
                  ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-100 dark:ring-0' 
                  : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 grayscale opacity-60'
              }`}
            >
              <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center text-5xl mb-4 shadow-lg animate-pulse">☀️</div>
              <span className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t('light_mode')}</span>
              {theme === 'light' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black shadow-lg">✓</div>
              )}
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`relative flex flex-col items-center p-8 rounded-3xl border-4 transition-all transform active:scale-95 ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-blue-500 ring-4 ring-blue-900/50' 
                  : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 grayscale opacity-60'
              }`}
            >
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-5xl mb-4 shadow-lg">🌙</div>
              <span className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t('dark_mode')}</span>
              {theme === 'dark' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black shadow-lg">✓</div>
              )}
            </button>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center py-8">
          <p className="text-slate-400 dark:text-slate-600 font-black uppercase text-sm tracking-widest">
            Code For Tomorrow v1.2.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
