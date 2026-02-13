
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ProgrammingPath } from '../types';
import { PATHS } from '../constants';
import Mascot from './Mascot';

interface PathSelectionScreenProps {
  onPathSelected: (pathId: ProgrammingPath['id']) => void;
}

const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({ onPathSelected }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4">
          <Mascot />
        </div>
        <h1 className="text-4xl font-black text-slate-800">{t('choose_your_path')}</h1>
      </header>
      <main className="max-w-2xl w-full grid md:grid-cols-2 gap-6">
        {PATHS.map((path) => (
          <button
            key={path.id}
            onClick={() => onPathSelected(path.id)}
            disabled={!path.isAvailable}
            className={`relative p-6 text-left rounded-2xl shadow-lg border-b-8 transition-transform transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
              path.isAvailable ? `${path.color} text-white` : 'bg-gray-300 border-b-gray-500 text-gray-600'
            }`}
            style={{
              borderColor: path.isAvailable ? 'rgba(0,0,0,0.2)' : undefined
            }}
          >
            <div className="text-5xl mb-4">{path.icon}</div>
            <h2 className="text-2xl font-bold">{t(path.titleKey as any)}</h2>
            <p className="mt-1">{t(path.descriptionKey as any)}</p>
          </button>
        ))}
      </main>
    </div>
  );
};

export default PathSelectionScreen;
