
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardView } from '../Dashboard';
import { 
  Home, 
  BookOpen, 
  Folder, 
  MessageSquare, 
  ShoppingBag, 
  User,
  Share2
} from 'lucide-react';

interface BottomNavProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  unreadMessagesCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, unreadMessagesCount }) => {
  const { t, language } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: <Home className="w-6 h-6" /> },
    { id: 'learn', label: t('learn'), icon: <BookOpen className="w-6 h-6" /> },
    { id: 'feed', label: language === 'fr' ? 'Communauté' : language === 'ar' ? 'الموجز' : 'Feed', icon: <Share2 className="w-6 h-6" /> },
    { id: 'creations', label: t('creations'), icon: <Folder className="w-6 h-6" /> },
    { id: 'messages', label: 'Chat', icon: <MessageSquare className="w-6 h-6" /> },
    { id: 'store', label: t('store'), icon: <ShoppingBag className="w-6 h-6" /> },
    { id: 'profile', label: t('profile'), icon: <User className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-20 md:hidden transition-colors">
      <div className="container mx-auto flex justify-around max-w-lg px-2">
        {navItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <div className="w-[1px] h-6 bg-slate-200/60 dark:bg-slate-700/40 self-center shrink-0" />
            )}
            <button
              onClick={() => setActiveView(item.id as DashboardView)}
              className={`flex-1 flex flex-col items-center justify-center pt-4 pb-4 transition-all transform active:scale-95 ${
                activeView === item.id 
                  ? 'text-[#111827] dark:text-[#FBBF24]' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`relative mb-1 transition-all ${activeView === item.id ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
                {item.icon}
                {item.id === 'messages' && unreadMessagesCount && unreadMessagesCount > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-800 animate-pulse">
                    {unreadMessagesCount}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
              {activeView === item.id && (
                <div className="w-8 h-1 bg-[#FBBF24] rounded-full mt-1.5"></div>
              )}
            </button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
