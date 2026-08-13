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
      description: "Quick reference guides and cheat sheets for various programming languages.",
      languages: "Languages"
    },
    fr: {
      title: "Documentation",
      description: "Guides de référence rapide et aide-mémoire pour divers langages de programmation.",
      languages: "Langages"
    },
    ar: {
      title: "المستندات المرجعية",
      description: "أدلة مرجعية سريعة وملخصات لمختلف اللغات البرمجية.",
      languages: "اللغات"
    }
  };

  const ui = localizedUI[language as 'en' | 'fr' | 'ar'] || localizedUI.en;

  return (
    <div className="w-full flex flex-col py-6 space-y-8">
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
        <div className="space-y-2 text-left">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
            REFERENCE RESOURCES
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
            {ui.title}
          </h1>
          <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm font-normal">
            {ui.description}
          </p>
        </div>
      </div>

      {/* Main Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Sidebar / Path selector */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-5 shadow-[0_1px_3px_rgba(60,64,67,0.08)] sticky top-24 space-y-3">
            <h2 className="text-xs font-bold uppercase text-[#5F6368] dark:text-[#9AA0A6] tracking-wider px-2">
              {ui.languages}
            </h2>
            <div className="space-y-1">
              {PATHS.filter(p => p.isAvailable || LANGUAGE_DOCS[p.id]).map(path => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-3 ${
                    selectedPath === path.id
                      ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30 font-semibold'
                      : 'text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] hover:text-[#202124] dark:hover:text-white'
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
          <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 md:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-8">
            <div className="border-b border-[#F1F3F4] dark:border-[#3C4043] pb-6 text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] dark:text-white">
                {doc.title}
              </h2>
              <p className="text-[#5F6368] dark:text-[#9AA0A6] font-normal text-xs sm:text-sm leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="space-y-6">
              {doc.sections.map((section, idx) => (
                <div key={idx} className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-6 text-left space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#202124] dark:text-white capitalize">
                    {section.title}
                  </h3>
                  
                  {section.isCode ? (
                    <CodeBlock code={section.content} language={selectedPath} />
                  ) : (
                    <p className="text-[#202124] dark:text-[#E8EAED] font-normal text-xs sm:text-sm leading-relaxed">
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
