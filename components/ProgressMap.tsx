
import React from 'react';
import { LESSONS_BY_PATH } from '../constants';
import { Lesson, ProgrammingPath } from '../types';
import LessonNode from './LessonNode';
import Mascot from './Mascot';

interface ProgressMapProps {
  completedLessons: number[];
  onStartLesson: (lesson: Lesson) => void;
  path: ProgrammingPath['id'];
}

const ProgressMap: React.FC<ProgressMapProps> = ({ completedLessons, onStartLesson, path }) => {
  const lastCompletedId = Math.max(0, ...completedLessons);
  const lessons = LESSONS_BY_PATH[path] || [];

  return (
    <div className="relative max-w-2xl mx-auto py-10">
      {/* Dashed Path SVG */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-4" aria-hidden="true">
        <path d="M 2 0 V 2000" stroke="#d1d5db" strokeWidth="4" strokeDasharray="8 8" />
      </svg>

      <div className="space-y-12 relative">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isUnlocked = lesson.id === 1 || completedLessons.includes(lesson.id - 1);
          const isNext = lesson.id === lastCompletedId + 1;
          
          return (
            <div
              key={lesson.id}
              className={`flex items-center w-full justify-center ${index % 2 === 1 ? 'md:justify-start' : 'md:justify-end'}`}
            >
              <div className={index % 2 === 1 ? 'md:ms-auto' : 'md:me-auto'}>
                <LessonNode
                  lesson={lesson}
                  isCompleted={isCompleted}
                  isUnlocked={isUnlocked}
                  isNext={isNext}
                  onStartLesson={onStartLesson}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute -bottom-10 right-0 md:-right-20">
        <Mascot />
      </div>
    </div>
  );
};

export default ProgressMap;