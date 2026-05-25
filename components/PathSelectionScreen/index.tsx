import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgrammingPath } from '../../types';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';
import { 
  Puzzle, 
  Gamepad2, 
  Globe, 
  Scroll, 
  Code2, 
  Database, 
  Coffee, 
  Cpu, 
  Zap, 
  Bird, 
  Terminal
} from 'lucide-react';

interface PathSelectionScreenProps {
  onPathSelected: (pathId: ProgrammingPath['id']) => void;
}

const getPathStyle = (pathId: string) => {
  switch (pathId) {
    case 'block_coding':
      return {
        cardBg: 'bg-[#2563eb] hover:bg-[#1d4ed8] shadow-blue-500/10 border-blue-400/20',
        textColor: 'text-white',
        descColor: 'text-blue-100/80',
        iconComp: <Puzzle className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'python':
      return {
        cardBg: 'bg-[#ca8a04] hover:bg-[#a16207] shadow-yellow-500/10 border-yellow-400/20',
        textColor: 'text-white',
        descColor: 'text-yellow-50/80',
        iconComp: (
          <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
            <path d="M11.93 2c-3.15 0-2.95 2.76-2.95 2.76L9 6.57h6.05V7.4H9.06s-3 .24-3 3.25c0 3 2.6 2.87 2.6 2.87h1.56v-2.2c0-2.43 2-2.28 2-2.28h3.76s2.85-.23 2.85-2.95c0-2.73-2.58-2.65-2.58-2.65H11.93zm-2.07 1.83a.62.62 0 1 1 0 1.25.62.62 0 0 1 0-1.25zM12.07 22c3.15 0 2.95-2.76 2.95-2.76l-.02-1.81H8.95v-.83h5.99s3-.24 3-3.25c0-3-2.6-2.87-2.6-2.87h-1.56v2.2c0 2.43-2 2.28-2 2.28H8.02s-2.85.23-2.85 2.95c0 2.73 2.58 2.65 2.58 2.65h6.32zm2.07-1.83a.62.62 0 1 1 0-1.25.62.62 0 0 1 0 1.25z" />
          </svg>
        )
      };
    case 'javascript':
      return {
        cardBg: 'bg-[#dc2626] hover:bg-[#b91c1c] shadow-red-500/10 border-red-400/20',
        textColor: 'text-white',
        descColor: 'text-red-100/80',
        iconComp: <Scroll className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'lua':
      return {
        cardBg: 'bg-[#4f46e5] hover:bg-[#4338ca] shadow-indigo-500/10 border-indigo-400/20',
        textColor: 'text-white',
        descColor: 'text-indigo-100/80',
        iconComp: <Gamepad2 className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'web_dev':
      return {
        cardBg: 'bg-[#db2777] hover:bg-[#be185d] shadow-pink-500/10 border-pink-400/20',
        textColor: 'text-white',
        descColor: 'text-pink-100/80',
        iconComp: <Globe className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'sql':
      return {
        cardBg: 'bg-[#0d9488] hover:bg-[#0f766e] shadow-teal-500/10 border-teal-400/20',
        textColor: 'text-white',
        descColor: 'text-teal-100/80',
        iconComp: <Database className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'java':
      return {
        cardBg: 'bg-[#ea580c] hover:bg-[#c2410c] shadow-orange-500/10 border-orange-400/20',
        textColor: 'text-white',
        descColor: 'text-orange-100/80',
        iconComp: <Coffee className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'rust':
      return {
        cardBg: 'bg-[#78350f] hover:bg-[#451a03] shadow-amber-900/10 border-amber-800/20',
        textColor: 'text-white',
        descColor: 'text-amber-100/80',
        iconComp: <Cpu className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'swift':
      return {
        cardBg: 'bg-[#e11d48] hover:bg-[#be123c] shadow-rose-500/10 border-rose-400/20',
        textColor: 'text-white',
        descColor: 'text-rose-100/80',
        iconComp: <Bird className="w-10 h-10 text-white stroke-[2.5]" />
      };
    case 'go':
      return {
        cardBg: 'bg-[#0891b2] hover:bg-[#0e7490] shadow-cyan-500/10 border-cyan-400/20',
        textColor: 'text-white',
        descColor: 'text-cyan-100/80',
        iconComp: <Zap className="w-10 h-10 text-white stroke-[2.5]" />
      };
    default:
      return {
        cardBg: 'bg-[#1e293b] hover:bg-[#334155] shadow-slate-900/50 border-slate-700/40 backdrop-blur-md',
        textColor: 'text-white',
        descColor: 'text-slate-300/80',
        iconComp: <Terminal className="w-10 h-10 text-white stroke-[2.5]" />
      };
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
    <div className="min-h-screen bg-[#0b0f19] dark:bg-[#070a12] transition-colors flex flex-col items-center justify-start py-16 px-4 md:px-8 overflow-x-hidden">
      <header className="text-center mb-16 flex flex-col items-center max-w-2xl">
        <div className="w-24 h-24 mb-6">
          <Mascot />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md">
          {t('choose_your_path')}
        </h1>
        <p className="text-sm font-semibold text-slate-400 leading-relaxed">
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
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5 flex items-center justify-center">
                  {style.iconComp}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none text-white mb-2.5">
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
