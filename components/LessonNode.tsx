
import React from 'react';
import { Lesson } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LessonNodeProps {
  lesson: Lesson;
  isCompleted: boolean;
  isUnlocked: boolean;
  isNext: boolean;
  onStartLesson: (lesson: Lesson) => void;
}

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, isCompleted, isUnlocked, isNext, onStartLesson }) => {
  const { t } = useLanguage();
  const status = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

  const baseButtonClasses = "w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center p-4 text-center font-bold text-white transition-transform duration-200 transform hover:-translate-y-1 shadow-lg border-4 border-white";
  const statusColors: { [key: string]: string } = {
    completed: `${lesson.color} opacity-70`,
    unlocked: `${lesson.color} hover:brightness-110`,
    locked: 'bg-gray-400 cursor-not-allowed',
  };

  const statusText: { [key: string]: string } = {
    completed: t('completed'),
    unlocked: t('start'),
    locked: t('locked'),
  }

  return (
    <div className="relative">
      <button
        onClick={() => isUnlocked && onStartLesson(lesson)}
        disabled={!isUnlocked}
        className={`${baseButtonClasses} ${statusColors[status]}`}
      >
        <span className="text-3xl md:text-4xl mb-1">{isCompleted ? '✅' : lesson.icon}</span>
        <span className="text-xs md:text-sm leading-tight">{t(lesson.titleKey as any)}</span>
      </button>
      
      {isNext && !isCompleted && (
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          START
        </div>
      )}

      <div className={`mt-2 text-center font-bold uppercase text-xs ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
        {statusText[status]}
      </div>
    </div>
  );
};

export default LessonNode;