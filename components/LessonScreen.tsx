
import React from 'react';
import { Lesson } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Mascot from './Mascot';

interface LessonScreenProps {
  lesson: Lesson;
  onComplete: (lessonId: number, xpGained: number) => void;
  onExit: () => void;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete, onExit }) => {
  const { t } = useLanguage();
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-black text-green-600 mb-2">{t('lesson_complete')}</h2>
            <p className="text-xl text-yellow-600 font-bold mb-6">
              {t('you_earned')} {lesson.xp} {t('xp')} ⭐
            </p>
            <button
                onClick={() => onComplete(lesson.id, lesson.xp)}
                className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-2xl text-2xl uppercase border-b-8 border-green-700 hover:bg-green-400 transition-all duration-150 transform hover:-translate-y-1"
            >
                {t('continue')}
            </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl me-3">{lesson.icon}</span>
            {t(lesson.titleKey as any)}
          </h2>
          <button onClick={onExit} className="text-gray-500 font-bold text-2xl hover:text-red-500 transition">&times;</button>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-8 flex flex-col items-center justify-center text-center">
        <div className="w-40 h-40 mb-8">
            <Mascot />
        </div>
        <h3 className="text-3xl font-bold mb-4">Block-based coding challenge here!</h3>
        <p className="text-lg text-gray-600 max-w-lg">
            This is where the interactive Scratch-style block coding interface would be. Students would drag and drop blocks to solve a puzzle.
        </p>
      </main>
      <footer className="p-4 bg-white border-t-2">
        <div className="container mx-auto">
            <button 
                onClick={handleComplete}
                className="w-full md:w-auto md:px-20 bg-green-500 text-white font-bold py-4 rounded-2xl text-xl uppercase border-b-8 border-green-700 hover:bg-green-400 transition-all duration-150"
            >
                {t('continue')}
            </button>
        </div>
      </footer>
    </div>
  );
};

export default LessonScreen;
