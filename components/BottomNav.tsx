
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type DashboardView = 'learn' | 'profile' | 'creations';

interface BottomNavProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'learn', label: t('learn'), icon: '📚' },
    { id: 'creations', label: t('creations'), icon: '📁' },
    { id: 'profile', label: t('profile'), icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-20 md:hidden">
      <div className="container mx-auto flex justify-around max-w-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as DashboardView)}
            className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1 font-bold text-sm transition-colors ${
              activeView === item.id ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            <span className="text-3xl">{item.icon}</span>
            <span>{item.label}</span>
            {activeView === item.id && (
              <div className="w-10 h-1 bg-blue-500 rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;