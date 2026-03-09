import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import LessonScreen from './components/LessonScreen';
import QuizLessonScreen from './components/QuizLessonScreen';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import PathSelectionScreen from './components/PathSelectionScreen';
import MathGameScreen from './components/MathGameScreen';
import { Lesson, User, ProgrammingPath, UserProgress } from './types';
import { BADGES_BY_PATH } from './constants';
import api from './services/api';
import LandingPage from './components/LandingPage';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import { useLanguage } from './contexts/LanguageContext';
import BrainTrainingScreen from './components/BrainTrainingScreen';
import BrainChallengeGameScreen from './components/BrainChallengeGameScreen';

/** The internal navigation state machine steps used before React Router takes over. */
type AppState = 'splash' | 'landing' | 'role_selection' | 'auth' | 'path_selection' | 'dashboard';

/** Default blank progress object used when creating a guest/new user session. */
const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  completedLessons: {}, // { pathId: [lessonId, ...] }
  scores: {},           // { lessonId: score (0-100) }
  badgesEarned: {},     // { pathId: [badgeId, ...] }
  lastLessonCompletedDate: null,
};


export default function App() {
  const navigate = useNavigate();
  const { hasSelectedLanguage } = useLanguage();
  const [appState, setAppState] = useState<AppState>('splash');
  /** The lesson currently being played. When null, the Dashboard is shown. */
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  /** The authenticated user. Null means the user is a guest or not logged in. */
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  /**
   * Set to true after completeLesson() runs so the Dashboard opens directly
   * on the 'learn' (roadmap) tab instead of the default 'home' hub tab.
   */
  const [returnToLearnMap, setReturnToLearnMap] = useState(false);

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
        } else {
          // We do not auto-redirect to landing here, so the user can see splash screen 
          // and the splash screen redirects them eventually if needed, or we let the Route logic handle it
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsSessionLoaded(true);
      }
    };

    checkUserSession();
  }, []);

  const handleAuthSuccess = useCallback(async (user: User) => {
    const roleToSet = user.role || selectedRole || 'student';
    const userWithRole = { ...user, role: roleToSet };
    setCurrentUser(userWithRole);
    navigate('/dashboard');

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
    navigate('/dashboard');
  }, [selectedRole, navigate]);

  const handleLogout = useCallback(async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveLesson(null);
    navigate('/auth');
  }, [navigate]);

  const onSplashFinish = useCallback(() => {
    if (currentUser) {
      navigate('/dashboard');
    } else if (!hasSelectedLanguage) {
      navigate('/language-selection');
    } else {
      navigate('/welcome');
    }
  }, [currentUser, navigate, hasSelectedLanguage]);

  const handleRoleSelect = useCallback((role: 'teacher' | 'student') => {
    setSelectedRole(role);
    navigate('/auth');
  }, [navigate]);

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
    setReturnToLearnMap(true);

    if (updatedUser) {
      try {
        await api.updateUserProgress(updatedUser.progress);
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  }, [currentUser]);


  const exitLesson = useCallback(() => {
    setActiveLesson(null);
  }, []);

  const renderContent = () => {
    if (!isSessionLoaded) {
      // Show splash screen while checking session
      return <SplashScreen onFinish={() => { }} />;
    }

    const { currentPath } = currentUser || {};

    return (
      <Routes>
        <Route path="/" element={<SplashScreen onFinish={onSplashFinish} />} />

        <Route path="/language-selection" element={
          currentUser ? <Navigate to="/dashboard" replace /> :
            hasSelectedLanguage ? <Navigate to="/welcome" replace /> :
              <LanguageSelectionScreen />
        } />

        <Route path="/welcome" element={
          currentUser ? <Navigate to="/dashboard" replace /> :
            !hasSelectedLanguage ? <Navigate to="/language-selection" replace /> :
              <LandingPage onGetStarted={() => navigate('/role-selection')} />
        } />

        <Route path="/role-selection" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <RoleSelectionScreen onSelect={handleRoleSelect} />
        } />

        <Route path="/auth" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <AuthScreen onAuthSuccess={handleAuthSuccess} skipAuth={handleSkipAuth} />
        } />

        <Route path="/dashboard" element={
          !currentUser ? <Navigate to="/auth" replace /> :
            currentUser.role === 'teacher' ? (
              <TeacherDashboard currentUser={currentUser} onLogout={handleLogout} />
            ) : activeLesson ? (
              // ─── LESSON ROUTING DECISION ────────────────────────────────────────────
              // Priority order when a lesson is active:
              //  1. Math path         → MathGameScreen   (special interactive game UI)
              //  2. Lesson has quiz   → QuizLessonScreen (read + multiple-choice format)
              //  3. Everything else   → LessonScreen     (code editor + terminal output)
              currentPath === 'math' ? (
                <MathGameScreen
                  lesson={activeLesson}
                  onComplete={completeLesson}
                  onExit={exitLesson}
                  path={currentPath}
                  currentUser={currentUser}
                />
              ) : activeLesson.questions && activeLesson.questions.length > 0 ? (
                <QuizLessonScreen
                  lesson={activeLesson}
                  onComplete={completeLesson}
                  onExit={exitLesson}
                  currentUser={currentUser}
                />
              ) : (
                <LessonScreen
                  lesson={activeLesson}
                  onComplete={completeLesson}
                  onExit={exitLesson}
                  path={currentPath || 'javascript'}
                  onSwitchPath={switchPath}
                  currentUser={currentUser}
                />
              )
            ) : (
              <Dashboard
                currentUser={currentUser}
                onUpdateUser={updateUser}
                onStartLesson={startLesson}
                onLogout={handleLogout}
                onSwitchPath={switchPath}
                initialView={returnToLearnMap ? 'learn' : 'home'}
                key={returnToLearnMap ? 'learn' : 'home'}
              />
            )
        } />

        <Route path="/brain-training" element={<BrainTrainingScreen />} />
        <Route path="/brain-training/:challengeId" element={<BrainChallengeGameScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen text-slate-800 dark:text-slate-100 antialiased transition-colors duration-300">
        {renderContent()}
      </div>
    </ThemeProvider>
  );
}
