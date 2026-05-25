
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgrammingPath } from '../../types';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';

interface PathSelectionScreenProps {
  onPathSelected: (pathId: ProgrammingPath['id']) => void;
}

const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({ onPathSelected }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (pathId: ProgrammingPath['id']) => {
    onPathSelected(pathId);
    // Navigate to the language-specific URL immediately
    navigate(`/dashboard/learn/${pathId}`);
  };

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-slate-900 transition-colors flex flex-col items-center justify-start py-12 px-4 md:px-8">
      <header className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-4">
          <Mascot />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white transition-colors">{t('choose_your_path')}</h1>
      </header>
      <main className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {PATHS.map((path) => (
          <button
            key={path.id}
            onClick={() => handleSelect(path.id)}
            disabled={!path.isAvailable}
            className={`relative p-5 text-left rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-1 duration-200 flex flex-col justify-between min-h-[200px] ${path.isAvailable ? `border-b-4 ${path.color.replace('bg-', 'border-b-')}` : 'border-b-4 border-b-gray-200 dark:border-b-slate-700 opacity-50'
              }`}
          >
            <div>
              <div className="text-4xl mb-3.5 flex items-center justify-start h-12">
                {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                  <img src={path.icon} alt="" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                ) : (
                  path.icon
                )}
              </div>
              <h2 className="text-base font-black tracking-tight leading-none text-slate-800 dark:text-white">{t(path.titleKey as any)}</h2>
              <p className="mt-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug line-clamp-3">{t(path.descriptionKey as any)}</p>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
};

export default PathSelectionScreen;
