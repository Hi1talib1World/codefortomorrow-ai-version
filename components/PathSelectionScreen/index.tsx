import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgrammingPath } from '../../types';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';

interface PathSelectionScreenProps {
  onPathSelected: (pathId: ProgrammingPath['id']) => void;
}

const getPathStyle = (pathId: string) => {
  const blueStyle = {
    cardBg: 'bg-[#2E2FCE] hover:bg-[#2324ba] shadow-[#2E2FCE]/10 border-blue-400/20',
    textColor: 'text-white',
    descColor: 'text-blue-100/80',
    iconBg: 'bg-white/15 border-white/10',
  };
  const yellowStyle = {
    cardBg: 'bg-[#FDD501] hover:bg-[#e0be00] shadow-yellow-500/10 border-yellow-600/20',
    textColor: 'text-slate-900',
    descColor: 'text-slate-700/95',
    iconBg: 'bg-black/5 border-black/5',
  };

  switch (pathId) {
    case 'block_coding':
    case 'javascript':
    case 'web_dev':
    case 'java':
    case 'swift':
      return blueStyle;
    case 'python':
    case 'lua':
    case 'sql':
    case 'rust':
    case 'go':
      return yellowStyle;
    default:
      return blueStyle;
  }
};

const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({ onPathSelected }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (pathId: ProgrammingPath['id']) => {
    onPathSelected(pathId);
    navigate(`/dashboard/learn/${pathId}`);
  };

  return (
    <div className="transition-colors flex flex-col items-center justify-start py-6 px-4 overflow-x-hidden">
      <header className="text-center mb-12 flex flex-col items-center max-w-2xl">
        <div className="w-24 h-24 mb-6">
          <Mascot />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#2E2FCE] dark:text-white tracking-tight mb-3 drop-shadow-sm">
          {t('choose_your_path')}
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
          Select a path to begin your coding adventure! Each path offers interactive lessons, fun games, and customized rewards.
        </p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
        {PATHS.map((path) => {
          const style = getPathStyle(path.id);
          return (
            <button
              key={path.id}
              onClick={() => handleSelect(path.id)}
              disabled={!path.isAvailable}
              className={`relative p-8 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[220px] text-left border
                ${style.cardBg}
                ${!path.isAvailable 
                  ? 'opacity-40 cursor-not-allowed filter grayscale' 
                  : 'hover:scale-[1.03] cursor-pointer hover:shadow-2xl'
                }
              `}
            >
              <div className="flex justify-between items-start w-full mb-6">
                <div></div>
                <div className={`p-3 rounded-2xl backdrop-blur-md border flex items-center justify-center w-16 h-16 shrink-0 shadow-inner ${style.iconBg}`}>
                  {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                    <img 
                      src={path.icon} 
                      alt="" 
                      className="w-10 h-10 object-contain filter drop-shadow-sm" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl">{path.icon}</span>
                  )}
                </div>
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tight leading-none mb-2.5 ${style.textColor}`}>
                  {t(path.titleKey as any)}
                </h2>
                <p className={`text-xs font-semibold leading-normal line-clamp-3 ${style.descColor}`}>
                  {t(path.descriptionKey as any)}
                </p>
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
};

export default PathSelectionScreen;
