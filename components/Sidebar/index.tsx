
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';
import { DashboardView } from '../Dashboard';
import { 
  Home, 
  BookOpen, 
  Folder, 
  Award, 
  Trophy, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  Settings,
  Sparkles,
  Target
} from 'lucide-react';

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUser }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: <Home className="w-5 h-5" /> },
    { id: 'learn', label: t('learn'), icon: <BookOpen className="w-5 h-5" /> },
    { id: 'missions', label: t('missions') || 'Missions', icon: <Target className="w-5 h-5" /> },
    { id: 'ai-assistant', label: t('ai_assistant') || 'AI Assistant', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'creations', label: t('creations'), icon: <Folder className="w-5 h-5" /> },
    { id: 'goals', label: t('goals'), icon: <Award className="w-5 h-5" /> },
    { id: 'leaderboard', label: t('leaderboard'), icon: <Trophy className="w-5 h-5" /> },
    { id: 'store', label: t('store'), icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'docs', label: 'Docs', icon: <FileText className="w-5 h-5" /> },
    { id: 'messages', label: 'Support', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'settings', label: t('settings'), icon: <Settings className="w-5 h-5" /> },
    {
      id: 'profile',
      label: currentUser.name,
      icon: <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
    },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-white dark:bg-slate-800 w-60 px-6 py-10 border-r border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-bold text-[#2E2FCE] dark:text-[#a3aaeb] leading-none tracking-tight">C4T</h1>
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
                  ? 'bg-[#2E2FCE]/10 text-[#2E2FCE] dark:bg-[#2E2FCE]/20 dark:text-[#a3aaeb]'
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
