import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgrammingPath } from '../../types';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';
import { Sparkles, Star, Users, ArrowRight, Lock } from 'lucide-react';

interface PathSelectionScreenProps {
  onPathSelected: (pathId: ProgrammingPath['id']) => void;
}

const getEnrolledCount = (pathId: string) => {
  const counts: Record<string, number> = {
    python: 284,
    javascript: 256,
    block_coding: 210,
    web_dev: 195,
    sql: 148,
    typescript: 115,
    java: 98,
    'c++': 85,
    c_sharp: 72,
    rust: 64,
    go: 58,
    swift: 42,
    kotlin: 36,
    lua: 24,
    dart: 18,
  };
  const count = counts[pathId] || (Math.abs(pathId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 80 + 15);
  return count.toLocaleString();
};

const PASTEL_BG_COLORS: Record<string, string> = {
  ai_engineering: 'bg-[#FFE87C]',
  block_coding: 'bg-[#F3EFE0]',
  python: 'bg-[#FFF8D6]',
  javascript: 'bg-[#FFF0F0]',
  web_dev: 'bg-[#EAFBF7]',
  lua: 'bg-[#D8CEF6]',
  c_sharp: 'bg-[#B5F2D6]',
  cpp: 'bg-[#FFB1B1]',
  java: 'bg-[#FFE87C]',
};

const TILT_CLASSES = [
  '-rotate-1 hover:rotate-0',
  'rotate-1 hover:rotate-0',
  '-rotate-2 hover:rotate-0',
  'rotate-2 hover:rotate-0',
  '-rotate-[0.5deg] hover:rotate-0',
  'rotate-[0.5deg] hover:rotate-0',
];

const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({ onPathSelected }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (pathId: ProgrammingPath['id']) => {
    onPathSelected(pathId);
    navigate(`/dashboard/learn/${pathId}`);
  };

  // Runtime Optical Alignment
  useEffect(() => {
    const alignInk = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      document.querySelectorAll('.opt-align').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.marginLeft = '0px';
        const style = window.getComputedStyle(htmlEl);
        const char = (htmlEl.textContent || '').trim().charAt(0);
        if (!char) return;

        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textAlign = 'left';
        const metrics = ctx.measureText(char);
        const sideBearing = metrics.actualBoundingBoxLeft;

        if (isFinite(sideBearing) && sideBearing > 0) {
          htmlEl.style.marginLeft = `${sideBearing.toFixed(2)}px`;
        }
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(alignInk);
    }
    alignInk();
    window.addEventListener('resize', alignInk);
    return () => window.removeEventListener('resize', alignInk);
  }, []);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-[#0F172A] dark:text-slate-100 p-4 sm:p-8 space-y-8 animate-fade-in font-sans selection:bg-[#FFE87C] selection:text-[#0F172A]">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-start py-6 px-4 space-y-10">
        
        {/* Intro Header */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl">
          <div className="w-24 h-24 mb-2 drop-shadow-[0_8px_0_rgba(15,23,42,0.8)] hover:scale-110 hover:rotate-6 transition-transform cursor-pointer">
            <Mascot />
          </div>

          <span className="bg-[#FFE87C] text-slate-900 border-2 border-slate-900 font-black shadow-[2.5px_2.5px_0px_0px_#0F172A] px-4 py-1 rounded-full uppercase tracking-wider text-xs flex items-center gap-1.5 select-none">
            <Star className="w-3.5 h-3.5 fill-current text-slate-900" />
            C4T ACADEMY CURRICULUM
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2 mb-1 leading-tight opt-align">
            {t('choose_your_path')}
          </h1>

          <p className="text-slate-800 dark:text-slate-300 text-sm font-extrabold max-w-2xl leading-relaxed">
            Select a path to begin your coding adventure! Each path offers interactive lessons, fun games, and customized rewards.
          </p>
        </div>

        {/* Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full pt-2">
          {PATHS.map((path, idx) => {
            const tiltClass = TILT_CLASSES[idx % TILT_CLASSES.length];
            const pastelBg = PASTEL_BG_COLORS[path.id] || 'bg-white';

            return (
              <button
                key={path.id}
                onClick={() => handleSelect(path.id)}
                disabled={!path.isAvailable}
                className={`group relative border-3 border-slate-900 dark:border-slate-700 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0F172A] dark:shadow-[6px_6px_0px_0px_#06b6d4] hover:-translate-x-1 hover:-translate-y-1.5 hover:shadow-[9px_9px_0px_0px_#0F172A] transition-all duration-300 flex flex-col justify-between min-h-[310px] text-left overflow-visible cursor-pointer ${tiltClass} ${
                  !path.isAvailable 
                    ? 'opacity-60 cursor-not-allowed bg-slate-200 dark:bg-slate-950 grayscale' 
                    : `${pastelBg} dark:bg-slate-900`
                }`}
              >
                {/* Top Row: Locked Badge or Floating Squircle Tech Icon */}
                <div className="flex justify-between items-start w-full mb-4">
                  {!path.isAvailable ? (
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-900 text-white border-2 border-slate-900 uppercase tracking-wider shadow-[2px_2px_0px_0px_#0F172A] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider">
                      PATH #{idx + 1}
                    </span>
                  )}
                  
                  {/* Top-Right Icon Badge: Floating Squircle Container */}
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_#0F172A] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                      <img 
                        src={path.icon} 
                        alt="" 
                        className="w-9 h-9 object-contain filter drop-shadow-sm transition-transform duration-300" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-3xl select-none transition-transform duration-300">{path.icon}</span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Title & Description */}
                <div className="space-y-2 flex-grow flex flex-col justify-center my-2">
                  <h2 className="text-2xl font-black tracking-tight leading-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                    {t(path.titleKey as any)}
                  </h2>
                  <p className="text-xs font-extrabold leading-relaxed text-slate-800 dark:text-slate-300 line-clamp-3">
                    {t(path.descriptionKey as any)}
                  </p>
                </div>

                {/* Bottom Row: High-Energy Enrollment Pill Badge Footer */}
                <div className="pt-4 mt-2 border-t-2 border-slate-900/10 dark:border-slate-800 flex items-center justify-between">
                  {path.isAvailable ? (
                    <>
                      <div className="bg-[#FFE87C] border-2 border-slate-900 px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-wider shadow-[2px_2px_0px_0px_#0F172A] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-900" />
                        <span>{getEnrolledCount(path.id)} enrolled</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#00D2D3] border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] group-hover:bg-[#FFE87C] group-hover:translate-x-1 transition-all">
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-400">
                      Coming Soon
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PathSelectionScreen;
