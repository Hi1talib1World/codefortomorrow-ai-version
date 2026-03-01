
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';
import { DashboardView } from '../Dashboard';

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUser }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: <span className="text-2xl">🏠</span> },
    { id: 'learn', label: t('learn'), icon: <span className="text-2xl">📚</span> },
    { id: 'creations', label: t('creations'), icon: <span className="text-2xl">📁</span> },
    { id: 'goals', label: t('goals'), icon: <span className="text-2xl">🏅</span> },
    { id: 'leaderboard', label: t('leaderboard'), icon: <span className="text-2xl">🏆</span> },
    { id: 'store', label: t('store'), icon: <span className="text-2xl">🛒</span> },
    { id: 'settings', label: t('settings'), icon: <span className="text-2xl">⚙️</span> },
    { 
      id: 'profile', 
      label: currentUser.name, 
      icon: <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
    },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-white dark:bg-slate-800 w-60 px-6 py-10 border-r-4 border-sky-100 dark:border-slate-700 shadow-xl transition-colors">
        <div className="mb-12 px-4">
            <h1 className="text-2xl font-black text-blue-500 dark:text-blue-400 leading-none uppercase italic tracking-tighter">C4T</h1>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Code for Tomorrow</p>
        </div>
        <ul className="space-y-3 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveView(item.id as DashboardView)}
                            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl font-black text-sm transition-all bubbly-btn ${
                                isActive 
                                    ? 'bg-blue-500 text-white shadow-[0_4px_0_0_#1d4ed8] ring-2 ring-blue-400/30' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 border-b-2 border-transparent hover:border-sky-100 dark:hover:border-slate-600'
                            }`}
                        >
                            <div className={`w-6 h-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 rotate-6' : 'group-hover:scale-105'}`}>{item.icon}</div>
                            <span className="truncate uppercase tracking-tighter italic text-xs">{item.label}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    </nav>
  );
};

export default Sidebar;
