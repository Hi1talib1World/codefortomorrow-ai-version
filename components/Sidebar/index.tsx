
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
    <nav className="hidden md:flex flex-col bg-[#111827] w-60 px-6 py-10 border-r border-slate-950 transition-colors">
      <div className="mb-12 px-2">
        <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-10 w-auto object-contain" />
      </div>
      <ul className="space-y-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <div className="absolute -left-6 top-3 bottom-3 w-1 bg-[#FBBF24] rounded-r-md z-10" />
              )}
              <button
                onClick={() => setActiveView(item.id as DashboardView)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-2xl font-black text-sm transition-all duration-300 relative ${isActive
                  ? 'bg-white text-[#111827] shadow-md scale-[1.02]'
                  : 'text-indigo-200/70 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center transition-transform ${isActive ? 'scale-105 text-[#111827]' : 'text-indigo-300/80 group-hover:scale-105'}`}>{item.icon}</div>
                <span className="truncate tracking-wide text-[11px] uppercase">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
