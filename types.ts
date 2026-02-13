
export interface Lesson {
  id: number;
  level: number;
  titleKey: string;
  icon: string;
  xp: number;
  color: string;
  type: 'lesson' | 'quiz' | 'project';
}

export interface UserProgress {
  xp: number;
  streak: number;
  completedLessons: {
    [pathId: string]: number[]; // e.g., { block_coding: [1, 2], python: [1] }
  };
}

export enum Language {
  EN = 'en',
  FR = 'fr',
  AR = 'ar',
}

export interface Badge {
  id: string;
  icon: string;
  titleKey: string;
  lessonId: number; // The ID of the lesson that unlocks this badge within its path
}

export type ProgrammingPath = {
  id: 'block_coding' | 'python' | 'javascript' | 'lua' | 'web_dev' | 'c_plus_plus' | 'c_sharp' | 'java' | 'kotlin' | 'swift' | 'go' | 'rust' | 'php' | 'ruby' | 'typescript' | 'sql' | 'r' | 'dart' | 'scala';
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  isAvailable: boolean;
};
