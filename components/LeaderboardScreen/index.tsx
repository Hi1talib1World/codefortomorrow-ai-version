
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LeaderboardScreen: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 md:p-12 bg-brand-50 dark:bg-slate-900 transition-colors min-h-full flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic mb-4">
        {t('leaderboard')}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 font-bold text-xl max-w-md">
        See how you rank against other master coders in the world!
      </p>
       <div className="mt-12 p-12 bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl border-b-[12px] border-slate-200 dark:border-slate-950 transition-colors transform hover:scale-105">
        <span className="text-8xl block mb-6 animate-pulse">🏆</span>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          {t('coming_soon')}
        </h2>
        <p className="text-slate-400 dark:text-slate-500 font-bold mt-2">Gathering all the star points...</p>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
