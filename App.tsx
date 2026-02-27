
import React, { useState, useCallback, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import LessonScreen from './components/LessonScreen';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import PathSelectionScreen from './components/PathSelectionScreen';
import { Lesson, User, ProgrammingPath, UserProgress } from './types';
import { BADGES_BY_PATH } from './constants';
import api from './services/api';
import LandingPage from './components/LandingPage';

type AppState = 'splash' | 'landing' | 'role_selection' | 'auth' | 'path_selection' | 'dashboard';
const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  completedLessons: {},
  scores: {},
  badgesEarned: {},
  lastLessonCompletedDate: null,
};


export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  // Effect to check for an existing session on app load by calling the API
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await api.getLoggedInUser();
        if (user) {
          if (!user.progress.scores) user.progress.scores = {};
          if (!user.progress.badgesEarned) user.progress.badgesEarned = {};
          if (user.progress.lastLessonCompletedDate === undefined) {
               user.progress.lastLessonCompletedDate = null;
          }

          setCurrentUser(user);
          setAppState('dashboard');
        } else {
          setAppState('landing');
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setAppState('landing'); 
      }
    };
    
    checkUserSession();
  }, []);

  const handleAuthSuccess = useCallback(async (user: User) => {
    const roleToSet = user.role || selectedRole || 'student';
    const userWithRole = { ...user, role: roleToSet };
    setCurrentUser(userWithRole);
    setAppState('dashboard');
    
    // Save role to profile if it wasn't there
    if (!user.role && selectedRole) {
      try {
        await api.updateUserProfile({ role: selectedRole });
      } catch (error) {
        console.error("Failed to save role to profile:", error);
      }
    }
  }, [selectedRole]);
  
  const handleSkipAuth = useCallback(() => {
      const now = new Date().toISOString();
      const guestUser: User = {
          _id: `guest_${Date.now()}`,
          name: 'Guest',
          email: `guest_${Date.now()}@codefortomorrow.com`,
          provider: 'email',
          profilePictureUrl: `https://ui-avatars.com/api/?name=G&background=random&color=fff`,
          progress: defaultProgress,
          currentPath: null,
          role: selectedRole || 'student',
          createdAt: now,
          lastLogin: now,
      };
      setCurrentUser(guestUser);
      setAppState('dashboard');
  }, [selectedRole]);
  
  const handleLogout = useCallback(async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveLesson(null);
    setAppState('auth');
  }, []);

  const onSplashFinish = useCallback(() => {
    if (appState === 'splash') {
        setAppState('landing');
    }
  }, [appState]);

  const handleRoleSelect = useCallback((role: 'teacher' | 'student') => {
    setSelectedRole(role);
    setAppState('auth');
  }, []);

  const handlePathSelected = useCallback(async (pathId: ProgrammingPath['id']) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, currentPath: pathId };
    setCurrentUser(updatedUser);

    try {
      await api.updateUserProfile({ currentPath: pathId });
    } catch (error) {
      console.error("Failed to update path:", error);
    }
  }, [currentUser]);
  
  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    
    try {
      await api.updateUserProfile(updatedData);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  }, [currentUser]);

  const switchPath = useCallback(async (pathId: ProgrammingPath['id']) => {
    if (!currentUser) return;
    
    setCurrentUser({ ...currentUser, currentPath: pathId });

    try {
      await api.updateUserProfile({ currentPath: pathId });
    } catch (error) {
      console.error("Failed to switch path:", error);
    }
  }, [currentUser]);

  const startLesson = useCallback((lesson: Lesson) => {
    setActiveLesson(lesson);
  }, []);

  const completeLesson = useCallback(async (lessonId: number, xpGained: number, score?: number) => {
    if (!currentUser || !currentUser.currentPath) return;

    let updatedUser: User | null = null;
    setCurrentUser(prevUser => {
      if (!prevUser || !prevUser.currentPath) return prevUser;

      const path = prevUser.currentPath;
      const progress = prevUser.progress;

      const currentPathCompletions = progress.completedLessons[path] || [];
      const isAlreadyCompleted = currentPathCompletions.includes(lessonId);
      const newCompleted = isAlreadyCompleted ? currentPathCompletions : [...currentPathCompletions, lessonId];
      const newXp = isAlreadyCompleted ? progress.xp : progress.xp + xpGained;

      const newScores = { ...progress.scores };
      if (score !== undefined) {
        newScores[lessonId] = score;
      }

      const pathBadges = BADGES_BY_PATH[path] || [];
      const earnedBadgesForPath = progress.badgesEarned[path] || [];
      const newlyEarnedBadges = pathBadges
        .filter(badge => badge.lessonId === lessonId && !earnedBadgesForPath.includes(badge.id))
        .map(badge => badge.id);
      const allEarnedForPath = [...earnedBadgesForPath, ...newlyEarnedBadges];

      let newStreak = progress.streak;
      const today = new Date();
      const lastCompletion = progress.lastLessonCompletedDate ? new Date(progress.lastLessonCompletedDate) : null;
      
      if (lastCompletion) {
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastCompletionDateOnly = new Date(lastCompletion.getFullYear(), lastCompletion.getMonth(), lastCompletion.getDate());
        
        const diffTime = todayDateOnly.getTime() - lastCompletionDateOnly.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      updatedUser = {
        ...prevUser,
        progress: {
          ...progress,
          xp: newXp,
          scores: newScores,
          streak: newStreak,
          lastLessonCompletedDate: today.toISOString(),
          completedLessons: {
            ...progress.completedLessons,
            [path]: newCompleted,
          },
          badgesEarned: {
            ...progress.badgesEarned,
            [path]: allEarnedForPath
          }
        }
      };
      return updatedUser;
    });

    setActiveLesson(null);

    if (updatedUser) {
        try {
            await api.updateUserProgress(updatedUser.progress);
        } catch(error) {
            console.error("Failed to save progress:", error);
        }
    }
  }, [currentUser]);


  const exitLesson = useCallback(() => {
    setActiveLesson(null);
  }, []);

  const renderContent = () => {
    if (appState === 'splash') {
       return <SplashScreen onFinish={onSplashFinish} />;
    }
    if (appState === 'landing') {
      return <LandingPage onGetStarted={() => setAppState('role_selection')} />;
    }
    if (appState === 'role_selection') {
        return <RoleSelectionScreen onSelect={handleRoleSelect} />;
    }
    if (!currentUser) {
        return <AuthScreen onAuthSuccess={handleAuthSuccess} skipAuth={handleSkipAuth} />;
    }
    
    const { currentPath } = currentUser;

    switch (appState) {
      case 'dashboard':
        if (currentUser.role === 'teacher') {
          return (
            <TeacherDashboard 
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          );
        }

        return activeLesson ? (
          <LessonScreen 
            lesson={activeLesson} 
            onComplete={completeLesson} 
            onExit={exitLesson} 
            path={currentPath || 'javascript'}
            onSwitchPath={switchPath}
          />
        ) : (
          <Dashboard 
            currentUser={currentUser}
            onUpdateUser={updateUser}
            onStartLesson={startLesson}
            onLogout={handleLogout}
            onSwitchPath={switchPath}
          />
        );
      default:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} skipAuth={handleSkipAuth} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen text-slate-800 dark:text-slate-100 antialiased transition-colors duration-300">
          {renderContent()}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
