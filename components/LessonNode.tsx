
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

const ICONS: { [key: string]: React.FC<{className: string}> } = {
  brain: ({className}) => <path className={className} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0 0v2.5m0-10V4m-4.5 7.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm0 0V14m0-10V4m9 7.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm0 0V14m0-10V4M9.5 14v2.5m-4.5-2.5V14m9-2.5V14" />,
  star: ({className}) => <path className={className} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  trophy: ({className}) => <path className={className} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.5 8.5a1.5 1.5 0 01-3 0V6a1.5 1.5 0 013 0v2.5zM10 6V4m0 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3.5 10a.5.5 0 01-.5-.5V4.5a.5.5 0 011 0v5a.5.5 0 01-.5.5zm13 0a.5.5 0 01-.5-.5V4.5a.5.5 0 011 0v5a.5.5 0 01-.5.5zM8 14h4M6.5 16h7s.5-1.5-3.5-1.5S6.5 16 6.5 16z" />,
};

const Hexagon: React.FC<{ color: string, isLocked: boolean }> = ({ color, isLocked }) => {
  const lockedFill = "url(#lockedPattern)";
  const fill = isLocked ? lockedFill : color;
  return (
    <svg viewBox="0 0 100 115.47" className="w-full h-full">
      <defs>
        <pattern id="lockedPattern" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-5,5 l10,-10 M0,10 l10,-10 M5,15 l10,-10" stroke="#555" strokeWidth="1"/>
        </pattern>
        <filter id="dropshadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="2" dy="3" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#dropshadow)" className="transition-all duration-300">
        <path d="M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z" fill={isLocked ? "#4A5568" : "#1e293b"} />
        <path d="M50 8 L92 32 L92 83 L50 107 L8 83 L8 32 Z" fill={fill} />
        <path d="M50 8 L92 32 L92 83 L50 107 L8 83 L8 32 Z" fill="url(#gloss)" opacity="0.2" />
        {!isLocked && (
          <path d="M25 25 Q 50 15 75 25" stroke="white" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
};


const LessonNode: React.FC<LessonNodeProps> = ({ lesson, isCompleted, isUnlocked, isNext, onStartLesson }) => {
  const { t } = useLanguage();
  const status = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';
  const IconComponent = ICONS[lesson.icon] || ICONS['brain'];
  
  const iconColor = status === 'locked' ? 'stroke-gray-500' : 'stroke-white';
  const nodeColor = isNext ? '#2563EB' : lesson.color;

  return (
    <div className="relative flex flex-col items-center">
      {isNext && (
          <div className="absolute -top-6 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {t('continue').toUpperCase()}
          </div>
      )}
      <button
        onClick={() => isUnlocked && onStartLesson(lesson)}
        disabled={!isUnlocked}
        className="w-16 h-20 relative transition-transform duration-200 transform hover:-translate-y-1 disabled:transform-none"
      >
        <div className="absolute inset-0">
          <Hexagon color={nodeColor} isLocked={!isUnlocked} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 20 20" className="w-6 h-6">
            <IconComponent className={iconColor} />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default LessonNode;
