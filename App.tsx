
import React, { useState, useCallback } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './components/Dashboard';
import LessonScreen from './components/LessonScreen';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import PathSelectionScreen from './components/PathSelectionScreen';
import { Lesson, UserProgress, ProgrammingPath } from './types';
import useLocalStorage from './hooks/useLocalStorage';

type AppState = 'splash' | 'auth' | 'path_selection' | 'dashboard';

const defaultProgress: UserProgress = { xp: 0, streak: 0, completedLessons: {} };

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentPath, setCurrentPath] = useLocalStorage<ProgrammingPath['id'] | null>('currentPath', null);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('userProgress', defaultProgress);

  const onSplashFinish = useCallback(() => {
    setAppState('auth');
  }, []);
  
  const onLoginSuccess = useCallback(() => {
    if (currentPath) {
      setAppState('dashboard');
    } else {
      setAppState('path_selection');
    }
  }, [currentPath]);

  const handlePathSelected = useCallback((pathId: ProgrammingPath['id']) => {
    setCurrentPath(pathId);
    setAppState('dashboard');
  }, [setCurrentPath]);
  
  const onLogout = useCallback(() => {
    // Note: We are not clearing progress, so user can log back in and continue
    setCurrentPath(null);
    setAppState('auth');
  }, [setCurrentPath]);

  const switchPath = useCallback((pathId: ProgrammingPath['id']) => {
    setCurrentPath(pathId);
  }, [setCurrentPath]);

  const startLesson = useCallback((lesson: Lesson) => {
    setActiveLesson(lesson);
  }, []);

  const completeLesson = useCallback((lessonId: number, xpGained: number) => {
    if (!currentPath) return;
    setUserProgress(prev => {
      const currentPathCompletions = prev.completedLessons[currentPath] || [];
      
      const newCompleted = currentPathCompletions.includes(lessonId) 
        ? currentPathCompletions
        : [...currentPathCompletions, lessonId];
      
      const newXp = currentPathCompletions.includes(lessonId) ? prev.xp : prev.xp + xpGained;

      return {
        ...prev,
        xp: newXp,
        streak: prev.streak + 1, // Simplified streak logic
        completedLessons: {
          ...prev.completedLessons,
          [currentPath]: newCompleted,
        }
      };
    });
    setActiveLesson(null);
  }, [currentPath, setUserProgress]);

  const exitLesson = useCallback(() => {
    setActiveLesson(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'splash':
        return <SplashScreen onFinish={onSplashFinish} />;
      case 'auth':
        return <AuthScreen onLoginSuccess={onLoginSuccess} />;
      case 'path_selection':
        return <PathSelectionScreen onPathSelected={handlePathSelected} />;
      case 'dashboard':
        if (!currentPath) {
          // Fallback if path is somehow lost
          return <PathSelectionScreen onPathSelected={handlePathSelected} />;
        }
        return activeLesson ? (
          <LessonScreen 
            lesson={activeLesson} 
            onComplete={completeLesson} 
            onExit={exitLesson} 
          />
        ) : (
          <Dashboard 
            userProgress={userProgress} 
            onStartLesson={startLesson}
            onLogout={onLogout}
            onSwitchPath={switchPath}
            path={currentPath}
          />
        );
      default:
        return <SplashScreen onFinish={onSplashFinish} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen text-slate-800 antialiased">
        {renderContent()}
      </div>
    </LanguageProvider>
  );
}