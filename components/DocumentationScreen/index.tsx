import React, { useState } from 'react';
import { User, ProgrammingPath } from '../../types';
import { LANGUAGE_DOCS, FALLBACK_DOC } from '../../utils/languageDocs';
import { PATHS } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen } from 'lucide-react';

interface DocumentationScreenProps {
  currentUser: User;
}

const DocumentationScreen: React.FC<DocumentationScreenProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const defaultPath = currentUser.currentPath || 'javascript';
  const [selectedPath, setSelectedPath] = useState<ProgrammingPath['id']>(defaultPath);

  const doc = LANGUAGE_DOCS[selectedPath] || FALLBACK_DOC;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#4285F4]" />
          Documentation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Quick reference guides and cheat sheets for various languages.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar / Path selector */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-4">
            <h2 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">Languages</h2>
            <div className="space-y-1">
              {PATHS.filter(p => p.isAvailable || LANGUAGE_DOCS[p.id]).map(path => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    selectedPath === path.id
                      ? 'bg-[#4285F4]/10 text-[#4285F4]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="mr-2">{path.icon}</span>
                  {t(path.titleKey as any)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="lg:w-3/4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                {doc.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
                {doc.description}
              </p>
            </div>

            <div className="space-y-10">
              {doc.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 capitalize">
                    {section.title}
                  </h3>
                  
                  {section.isCode ? (
                    <div className="bg-slate-900 dark:bg-[#0f172a] rounded-xl p-4 overflow-x-auto shadow-inner">
                      <pre className="text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre block">
                        <code>{section.content}</code>
                      </pre>
                    </div>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
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
