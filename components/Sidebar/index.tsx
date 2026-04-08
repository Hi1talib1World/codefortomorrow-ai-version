
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    { id: 'docs', label: 'Docs', icon: <span className="text-2xl">📖</span> },
    { id: 'messages', label: 'Support', icon: <span className="text-2xl">💬</span> },
    { id: 'settings', label: t('settings'), icon: <span className="text-2xl">⚙️</span> },
    {
      id: 'profile',
      label: currentUser.name,
      icon: <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
    },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-white dark:bg-slate-800 w-60 px-6 py-10 border-r border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-bold text-[#4285F4] dark:text-[#8ab4f8] leading-none tracking-tight">C4T</h1>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Code for Tomorrow</p>
      </div>
      <ul className="space-y-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id as DashboardView)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${isActive
                  ? 'bg-[#4285F4]/10 text-[#1a73e8] dark:bg-[#4285F4]/20 dark:text-[#8ab4f8]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>{item.icon}</div>
                <span className="truncate tracking-wide text-xs">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
