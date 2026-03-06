
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardView } from '../Dashboard';

interface BottomNavProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: '🏠' },
    { id: 'learn', label: t('learn'), icon: '📚' },
    { id: 'creations', label: t('creations'), icon: '📁' },
    { id: 'messages', label: 'Chat', icon: '💬' },
    { id: 'store', label: t('store'), icon: '🛒' },
    { id: 'profile', label: t('profile'), icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t-4 dark:border-slate-700 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 md:hidden transition-colors">
      <div className="container mx-auto flex justify-around max-w-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as DashboardView)}
            className={`flex-1 flex flex-col items-center justify-center pt-3 pb-2 transition-all transform active:scale-95 ${
              activeView === item.id ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="text-3xl mb-1 filter grayscale-[0.5] group-hover:grayscale-0">{item.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            {activeView === item.id && (
              <div className="w-8 h-1.5 bg-brand-500 rounded-full mt-1.5"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
