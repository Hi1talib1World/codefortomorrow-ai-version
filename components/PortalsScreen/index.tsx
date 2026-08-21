import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Terminal } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PortalsScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [gridOn, setGridOn] = useState(false);

  const isAr = language === 'ar';

  // Keyboard layout toggle trigger (G key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setGridOn(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gridOn) {
      document.body.classList.add('grid-on');
    } else {
      document.body.classList.remove('grid-on');
    }
    return () => document.body.classList.remove('grid-on');
  }, [gridOn]);

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

  const portals = [
    {
      id: 'academy',
      title: isAr ? 'أكاديمية CFT' : 'CFT Academy',
      description: isAr 
        ? 'مغامرات برمجة تفاعلية، دروس ممتعة، ومناهج تعليمية مخصصة لجميع مستويات المهارة.'
        : 'Interactive coding adventures, gamified lessons, and curriculum builders tailored for all skill levels.',
      actionText: isAr ? 'دخول الأكاديمية' : 'Enter Academy',
      route: '/dashboard',
      colSpan: '1 / 5',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-[#0b132b] border border-sky-500/20 flex items-center justify-center p-2 shadow-inner">
          <img src="/assets/code-for-tomorrow-logo.png" alt="CFT Academy" className="w-full h-full object-contain" />
        </div>
      )
    },
    {
      id: 'cftos',
      title: isAr ? 'منصة CFTOS' : 'CFTOS',
      description: isAr 
        ? 'بيئة تعاونية لبناء وكلاء الذكاء الاصطناعي المستقلين والمساهمة في البرمجيات مفتوحة المصدر.'
        : 'A collaborative environment for building autonomous AI agents and contributing to open-source software.',
      actionText: isAr ? 'فتح المنصة' : 'Open Platform',
      route: '/cftos',
      colSpan: '5 / 9',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-[#0b132b] border border-sky-500/20 flex items-center justify-center p-1.5 shadow-inner relative overflow-hidden">
          <span className="text-[10px] font-black text-sky-400 font-mono tracking-tighter">CFTOS</span>
        </div>
      )
    },
    {
      id: 'blog',
      title: isAr ? 'المدونة والوثائق' : 'Docs & Blog',
      description: isAr 
        ? 'أدلة تقنية مفصلة، دروس تعليمية، ورؤى يكتبها مجتمع المهندسين لدينا.'
        : 'In-depth technical guides, tutorials, and insights authored by our community of engineers.',
      actionText: isAr ? 'قراءة المدونة' : 'Read Docs',
      route: '/blog',
      colSpan: '9 / 13',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-[#0b132b] border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-inner">
          <Terminal className="w-5 h-5" />
        </div>
      )
    }
  ];

  const renderGuides = () => (
    <div className="guides" aria-hidden="true">
      <div className="cols">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="col">
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="rows" />
      <div className="mline l" />
      <div className="mline r" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060b19] text-white flex flex-col font-sans relative overflow-hidden selection:bg-sky-500/30 selection:text-white muller-grid-root">
      <style>{`
        .muller-grid-root {
          --cols: 12;
          --bl: 8px;
          --lh: 24px;
          --gutter: 24px;
          --margin: 72px;
          --pad: 96px;
          --maxw: 1296px;
          
          --paper: #060b19;
          --ink: #ffffff;
          --ink-soft: #94a3b8;
          --accent: #38bdf8;
          
          --g-col: rgba(56, 189, 248, 0.03);
          --g-edge: rgba(56, 189, 248, 0.2);
          --g-base: rgba(14, 165, 233, 0.15);
          --g-base-min: rgba(14, 165, 233, 0.05);

          background-color: var(--paper);
          color: var(--ink);
        }

        .muller-grid-root,
        .muller-grid-root * {
          box-sizing: border-box;
        }

        .muller-grid-root .spread {
          position: relative;
          width: 100%;
        }

        .muller-grid-root .wrap {
          position: relative;
          max-width: var(--maxw);
          margin: 0 auto;
          padding: var(--pad) var(--margin);
        }

        .muller-grid-root .muller-grid {
          display: grid;
          grid-template-columns: repeat(var(--cols), 1fr);
          column-gap: var(--gutter);
          row-gap: var(--lh);
        }

        .muller-grid-root .band {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: subgrid;
          column-gap: var(--gutter);
          row-gap: var(--lh);
          align-items: start;
        }

        @supports not (grid-template-columns: subgrid) {
          .muller-grid-root .band {
            grid-template-columns: repeat(var(--cols), 1fr);
          }
        }

        .muller-grid-root .guides {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 60;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        body.grid-on .muller-grid-root .guides {
          opacity: 1;
        }

        .muller-grid-root .guides .cols {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--margin);
          right: var(--margin);
          display: grid;
          grid-template-columns: repeat(var(--cols), 1fr);
          column-gap: var(--gutter);
        }

        .muller-grid-root .guides .col {
          background: var(--g-col);
          box-shadow: inset 1px 0 0 var(--g-edge), inset -1px 0 0 var(--g-edge);
          position: relative;
        }

        .muller-grid-root .guides .col span {
          position: absolute;
          top: 32px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: "Space Mono", monospace;
          font-size: 10px;
          line-height: 1;
          color: var(--accent);
        }

        .muller-grid-root .guides .rows {
          position: absolute;
          left: var(--margin);
          right: var(--margin);
          top: var(--pad);
          bottom: 0;
          background-image: 
            repeating-linear-gradient(to bottom, var(--g-base) 0 1px, transparent 1px var(--lh)),
            repeating-linear-gradient(to bottom, var(--g-base-min) 0 1px, transparent 1px var(--bl));
        }

        .muller-grid-root .guides .mline {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--g-edge);
        }

        .muller-grid-root .guides .mline.l { left: var(--margin); }
        .muller-grid-root .guides .mline.r { right: var(--margin); }

        /* Typography Snapping */
        .muller-grid-root .masthead {
          font-family: "Inter", sans-serif;
          font-weight: 900;
          font-size: 56px;
          line-height: 56px;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          margin: 0;
        }

        .muller-grid-root .mono-label {
          font-family: "Space Mono", monospace;
          font-size: 11px;
          line-height: 16px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent);
          display: block;
        }

        .muller-grid-root .pill-card {
          border: 1px solid rgba(56, 189, 248, 0.15);
          background: rgba(11, 19, 43, 0.8);
          padding: 32px;
          transition: all 0.2s ease;
        }
        .muller-grid-root .pill-card:hover {
          border-color: var(--accent);
          background: rgba(56, 189, 248, 0.05);
        }

        @media (max-width: 992px) {
          .muller-grid-root {
            --margin: 40px;
            --gutter: 16px;
            --pad: 64px;
          }
          .muller-grid-root .masthead {
            font-size: 44px;
            line-height: 44px;
          }
        }

        @media (max-width: 640px) {
          .muller-grid-root {
            --margin: 20px;
            --gutter: 12px;
            --pad: 40px;
          }
          .muller-grid-root .masthead {
            font-size: 32px;
            line-height: 32px;
          }
        }
      `}</style>

      {/* Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-[1296px] mx-auto px-[72px] h-20 flex items-center justify-between z-10 transition-all duration-300 border-b border-sky-900/20">
        <div className="flex items-center gap-3">
          <img src="/assets/code-for-tomorrow-logo.png" alt="Code for Tomorrow" className="w-7 h-7 object-contain" />
          <span className="font-mono font-black text-lg tracking-wider text-white">C4T ECOSYSTEM</span>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors bg-transparent border-none font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isAr ? 'العودة' : 'Back'}</span>
        </button>
      </header>

      {/* Main Grid Wrapper */}
      <section className="spread flex-1 flex flex-col justify-center">
        <div className="wrap">
          <div className="muller-grid">
            
            {/* Intro Text Block (columns 1 / 13) */}
            <div className="band mb-16">
              <div style={{ gridColumn: '1 / 13' }} className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold rounded uppercase tracking-wider mb-2">
                  <span>{isAr ? 'بوابات التعلم والتطوير' : 'Unified Workspace Portals'}</span>
                </div>
                <h1 className="masthead opt-align">
                  {isAr ? 'اختر وجهتك المفضلة' : 'Select Your Destination'}
                </h1>
                <p className="text-slate-300 text-base md:text-lg font-semibold max-w-2xl leading-relaxed">
                  {isAr 
                    ? 'تنقل بسهولة بين أكاديمية التعلم والمنصة المفتوحة ومدونة المطورين لدينا.'
                    : 'Easily transition between our gamified learning portal, open-source AI playground, and engineering documentation.'}
                </p>
              </div>
            </div>

            {/* Portal Cards Band */}
            <div className="band">
              {portals.map((portal) => (
                <div
                  key={portal.id}
                  onClick={() => navigate(portal.route)}
                  style={{ gridColumn: portal.colSpan }}
                  className="group pill-card rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full cursor-pointer"
                >
                  <div className="flex flex-col h-full space-y-6">
                    <div className="flex items-center justify-between">
                      {portal.icon}
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:text-sky-400 group-hover:border-sky-500/30">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                        {portal.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80">
                      <div className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white hover:brightness-110 transition-all shadow-lg shadow-sky-500/20">
                        <span>{portal.actionText}</span>
                        <span className="text-sm leading-none group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          {renderGuides()}
        </div>
      </section>

      {/* Footer Info */}
      <footer className="w-full py-8 text-center text-slate-400 text-xs font-mono border-t border-slate-800/50 z-10 max-w-[1296px] mx-auto px-[72px]">
        <p>© Code for Tomorrow. All platforms are seamlessly interconnected.</p>
      </footer>
    </div>
  );
}
