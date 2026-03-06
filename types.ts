
export interface Lesson {
  id: number;
  level: number;
  titleKey: string;
  icon: string; // Now represents the internal icon key, e.g., 'brain', 'star'
  xp: number;
  color: string; // Used for accent colors
  type: 'lesson' | 'quiz' | 'project';
  nodeType: 'standard' | 'quiz' | 'project' | 'trophy';
  // New properties for the code editor screen
  challengeDescriptionKey: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hintKey?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Creation {
  id: string;
  title: string;
  date: string;
  contentType: 'quiz' | 'game' | 'book';
  stageKey: string;
  questionCount: number;
  language: string;
  data: QuizQuestion[];
}

export interface LessonSection {
  id: string;
  titleKey: string;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  titleKey: string;
  descriptionKey: string;
  color: string;
  levels: Level[];
}

export interface Level {
  id: string;
  titleKey: string;
  lessons: Lesson[];
  isLocked: boolean;
}

export interface UserProgress {
  xp: number;
  streak: number;
  completedLessons: {
    [pathId: string]: number[]; // e.g., { block_coding: [1, 2], python: [1] }
  };
  scores: {
    [lessonId: number]: number; // e.g., { 3: 100, 5: 85 }
  };
  badgesEarned: {
    [pathId: string]: string[]; // e.g., { block_coding: ['bc_badge1'], python: ['py_badge1'] }
  };
  lastLessonCompletedDate: string | null;
  skillMastery?: {
    [concept: string]: number;
  };
  learningProfile?: {
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    lastUpdated: string;
  };
  skillGraph?: {
    nodes: Array<{ id: string; label: string; status: 'locked' | 'available' | 'mastered' }>;
    edges: Array<{ from: string; to: string }>;
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
  id: 'block_coding' | 'python' | 'javascript' | 'lua' | 'web_dev' | 'c_plus_plus' | 'c_sharp' | 'java' | 'kotlin' | 'swift' | 'go' | 'rust' | 'php' | 'ruby' | 'typescript' | 'sql' | 'r' | 'dart' | 'scala' | 'math';
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  isAvailable: boolean;
};

export interface User {
  _id: string; // Changed from 'id' to match MongoDB's default identifier
  name: string;
  email: string;
  profilePictureUrl: string;
  bio?: string;
  password?: string; // Optional for OAuth users
  provider: 'google' | 'email';
  progress: UserProgress;
  currentPath: ProgrammingPath['id'] | null;
  role: 'teacher' | 'student' | null;
  createdAt: string;
  lastLogin: string;
}
