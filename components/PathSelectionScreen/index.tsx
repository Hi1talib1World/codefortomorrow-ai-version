import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgrammingPath } from '../../types';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';

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
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-start py-6 px-4">
      {/* Intro Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <div className="w-24 h-24 mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <Mascot />
        </div>
        <span className="mono-label opt-align">C4T ACADEMY CURRICULUM</span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 mb-3 opt-align">
          {t('choose_your_path')}
        </h1>
        <p className="text-slate-400 text-sm font-semibold max-w-2xl leading-relaxed">
          Select a path to begin your coding adventure! Each path offers interactive lessons, fun games, and customized rewards.
        </p>
      </div>

      {/* Path Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {PATHS.map((path) => {
          return (
            <button
              key={path.id}
              onClick={() => handleSelect(path.id)}
              disabled={!path.isAvailable}
              className={`group pill-card rounded-[2rem] transition-all duration-300 flex flex-col justify-between min-h-[300px] overflow-hidden text-left border bg-slate-900/30 border-slate-800/80 hover:border-[#FBBF24] p-0
                ${!path.isAvailable 
                  ? 'opacity-40 cursor-not-allowed filter grayscale' 
                  : 'hover:scale-[1.02] cursor-pointer hover:shadow-2xl'
                }
              `}
              style={{ padding: '0px' }}
            >
              {/* Top Row: Floating Icon / Badge */}
              <div className="flex justify-between items-start w-full px-6 pt-6">
                {!path.isAvailable ? (
                  <span className="text-[9px] font-black px-2.5 py-1 rounded bg-slate-800/35 border border-slate-800 text-slate-500 uppercase tracking-widest">
                    Locked
                  </span>
                ) : (
                  <div />
                )}
                
                {/* Floating Logo (no container box) */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                    <img 
                      src={path.icon} 
                      alt="" 
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-110 duration-300" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-3xl select-none transition-transform group-hover:scale-110 duration-300">{path.icon}</span>
                  )}
                </div>
              </div>

              {/* Middle Row: Title & Description inside common text container */}
              <div className="px-6 flex-grow flex flex-col justify-center min-h-[120px] mt-4">
                <h2 className="text-2xl font-black tracking-tight leading-tight mb-2 text-white group-hover:text-[#FBBF24] transition-colors">
                  {t(path.titleKey as any)}
                </h2>
                <p className="text-xs font-semibold leading-relaxed text-slate-200 line-clamp-3">
                  {t(path.descriptionKey as any)}
                </p>
              </div>

              {/* Bottom Row: Soft Metadata Footer */}
              <div className="px-6 pb-6 w-full">
                {path.isAvailable ? (
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 pt-3 border-t border-slate-800/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                    <span>{getEnrolledCount(path.id)} enrolled</span>
                  </div>
                ) : (
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 pt-3 border-t border-slate-800/60">
                    Coming Soon
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PathSelectionScreen;
