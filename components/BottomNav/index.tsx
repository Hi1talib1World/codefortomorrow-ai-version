
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 md:hidden transition-colors">
      <div className="container mx-auto flex justify-around max-w-lg px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as DashboardView)}
            className={`flex-1 flex flex-col items-center justify-center pt-4 pb-4 transition-all transform active:scale-95 ${activeView === item.id ? 'text-[#4285F4] dark:text-[#8ab4f8]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <span className={`text-2xl mb-1 transition-all ${activeView === item.id ? 'scale-110' : 'filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}`}>{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
            {activeView === item.id && (
              <div className="w-8 h-1 bg-[#4285F4] dark:bg-[#8ab4f8] rounded-full mt-1.5"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
