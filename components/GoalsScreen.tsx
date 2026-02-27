
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TreasureChestIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8H20V19H4V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GoalItem: React.FC<{ title: string; progress: number; total: number }> = ({ title, progress, total }) => {
    const percentage = (progress / total) * 100;
    return (
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border-2 border-transparent hover:border-blue-500/20 transition-all">
            <div className="flex-grow">
                <p className="text-slate-700 dark:text-slate-200 font-black text-lg leading-tight">{title}</p>
                <div className="bg-slate-200 dark:bg-slate-800 rounded-full h-3 mt-3 overflow-hidden border border-white dark:border-slate-600">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
            <div className="text-right flex flex-col items-center">
                <p className="text-slate-500 dark:text-slate-400 font-black text-sm">{progress}/{total}</p>
                <TreasureChestIcon className="w-10 h-10 text-yellow-500 dark:text-yellow-400 drop-shadow-sm" />
            </div>
        </div>
    );
};

const MotivationalQuote = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border-b-8 border-slate-200 dark:border-slate-950 shadow-lg overflow-hidden transition-colors">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-6 text-left">
                <div>
                    <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-xl">Motivational Quote</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Daily Inspiration</p>
                </div>
                <svg
                    className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 italic font-bold text-lg animate-pop-in">
                    <p className="border-t-2 border-slate-100 dark:border-slate-700 pt-4">"The only way to do great work is to love what you do." - Steve Jobs</p>
                </div>
            )}
        </div>
    );
};

const GoalsScreen: React.FC = () => {
    const { t } = useLanguage();
    const dailyGoals = [
        { id: 1, title: 'Solve 3 challenges on the first try', progress: 1, total: 3 },
        { id: 2, title: 'Earn 85 XP', progress: 45, total: 85 },
        { id: 3, title: 'Complete 3 exercises', progress: 2, total: 3 },
    ];

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-full transition-colors p-4 sm:p-12">
            <div className="max-w-3xl mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                        {t('goals')}
                    </h1>
                    <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 border-2 border-cyan-200 dark:border-cyan-800 rounded-2xl px-5 py-2 uppercase tracking-widest">
                        Time left: 22 hours
                    </span>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 space-y-6 shadow-xl border-b-[12px] border-slate-200 dark:border-slate-950 transition-colors">
                    {dailyGoals.map(goal => (
                        <GoalItem
                            key={goal.id}
                            title={goal.title}
                            progress={goal.progress}
                            total={goal.total}
                        />
                    ))}
                </div>

                <MotivationalQuote />
            </div>
        </div>
    );
};

export default GoalsScreen;
