
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type DashboardView = 'learn' | 'profile' | 'creations';

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'learn', label: t('learn'), icon: '📚' },
    { id: 'creations', label: t('creations'), icon: '📁' },
    { id: 'profile', label: t('profile'), icon: '👤' },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-white w-64 p-4 border-r-2 shadow-lg">
        <div className="mb-8 p-2">
            <h1 className="text-3xl font-black text-blue-500">Code Cubs</h1>
        </div>
        <ul className="space-y-2">
            {navItems.map((item) => (
                <li key={item.id}>
                    <button
                        onClick={() => setActiveView(item.id as DashboardView)}
                        className={`w-full flex items-center space-x-4 p-3 rounded-lg font-bold text-lg transition-colors ${
                            activeView === item.id 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'text-gray-500 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                    >
                        <span className="text-3xl">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                </li>
            ))}
        </ul>
    </nav>
  );
};

export default Sidebar;