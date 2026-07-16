import React, { useState, useEffect } from 'react';
import { User, ProgrammingPath } from '../../types';
import { LANGUAGE_DOCS, FALLBACK_DOC, LANGUAGE_DOCS_FR, LANGUAGE_DOCS_AR } from '../../utils/languageDocs';
import { PATHS } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen } from 'lucide-react';
import CodeBlock from '../CodeBlock';

interface DocumentationScreenProps {
  currentUser: User;
}

const DocumentationScreen: React.FC<DocumentationScreenProps> = ({ currentUser }) => {
  const { language, t } = useLanguage();
  const defaultPath = currentUser.currentPath || 'javascript';
  const [selectedPath, setSelectedPath] = useState<ProgrammingPath['id']>(defaultPath);

  const doc = (() => {
    if (language === 'fr' && LANGUAGE_DOCS_FR[selectedPath]) {
      return LANGUAGE_DOCS_FR[selectedPath]!;
    }
    if (language === 'ar' && LANGUAGE_DOCS_AR[selectedPath]) {
      return LANGUAGE_DOCS_AR[selectedPath]!;
    }
    return LANGUAGE_DOCS[selectedPath] || FALLBACK_DOC;
  })();

  const localizedUI = {
    en: {
      title: "Documentation",
      description: "Quick reference guides and cheat sheets for various languages.",
      languages: "Languages"
    },
    fr: {
      title: "Documentation",
      description: "Guides de référence rapide et aide-mémoire pour divers langages.",
      languages: "Langages"
    },
    ar: {
      title: "المستندات المرجعية",
      description: "أدلة مرجعية سريعة وملخصات لمختلف اللغات البرمجية.",
      languages: "اللغات"
    }
  };

  const ui = localizedUI[language as 'en' | 'fr' | 'ar'] || localizedUI.en;

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
    <div className="w-full flex flex-col py-6">
      {/* Intro Header */}
      <div className="grid grid-cols-12 w-full mb-12">
        <div className="col-span-12 flex flex-col text-left space-y-2">
          <span className="mono-label opt-align font-mono text-xs uppercase tracking-wider text-[#FBBF24]">REFERENCE RESOURCES</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 opt-align">
            <span>{ui.title}</span>
          </h1>
          <p className="text-slate-400 font-semibold text-sm">
            {ui.description}
          </p>
        </div>
      </div>

      {/* Main Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Sidebar / Path selector */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-slate-900/30 rounded-[2rem] p-5 shadow-xl sticky top-24">
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4">{ui.languages}</h2>
            <div className="space-y-1">
              {PATHS.filter(p => p.isAvailable || LANGUAGE_DOCS[p.id]).map(path => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center gap-2.5 ${
                    selectedPath === path.id
                      ? 'bg-[#FBBF24]/10 text-[#FBBF24]'
                      : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 shrink-0">
                    {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                      <img src={path.icon} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-base select-none">{path.icon}</span>
                    )}
                  </span>
                  <span>{t(path.titleKey as any)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl">
            <div className="mb-8 border-b border-slate-850 pb-6 text-left">
              <h2 className="text-3xl font-black text-white mt-1">
                {doc.title}
              </h2>
              <p className="text-slate-400 font-semibold text-base mt-3">
                {doc.description}
              </p>
            </div>

            <div className="space-y-10">
              {doc.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-950 rounded-2xl p-6 text-left">
                  <h3 className="text-xl font-black text-white mb-4 capitalize">
                    {section.title}
                  </h3>
                  
                  {section.isCode ? (
                    <CodeBlock code={section.content} language={selectedPath} />
                  ) : (
                    <p className="text-slate-300 font-semibold text-sm leading-relaxed">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationScreen;
