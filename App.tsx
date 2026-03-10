import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
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
import PageTransitionLoader from './components/PageTransitionLoader';

/** Default blank progress object used when creating a guest/new user session. */
const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  completedLessons: {}, // { pathId: [lessonId, ...] }
  scores: {},           // { lessonId: score (0-100) }
  badgesEarned: {},     // { pathId: [badgeId, ...] }
  lastLessonCompletedDate: null,
};

// ─── LESSON OVERLAY ──────────────────────────────────────────────────────────
// Rendered on top of the dashboard when a lesson is active.
interface LessonOverlayProps {
  lesson: Lesson;
  currentPath: ProgrammingPath['id'] | null;
  currentUser: User;
  onComplete: (lessonId: number, xpGained: number, score?: number) => void;
  onExit: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
}

const LessonOverlay: React.FC<LessonOverlayProps> = ({
  lesson, currentPath, currentUser, onComplete, onExit, onSwitchPath
}) => {
  if (currentPath === 'math') {
    return (
      <MathGameScreen
        lesson={lesson}
        onComplete={onComplete}
        onExit={onExit}
        path={currentPath}
        currentUser={currentUser}
      />
    );
  }
  if (lesson.questions && lesson.questions.length > 0) {
    return (
      <QuizLessonScreen
        lesson={lesson}
        onComplete={onComplete}
        onExit={onExit}
        currentUser={currentUser}
      />
    );
  }
  return (
    <LessonScreen
      lesson={lesson}
      onComplete={onComplete}
      onExit={onExit}
      path={currentPath || 'javascript'}
      onSwitchPath={onSwitchPath}
      currentUser={currentUser}
    />
  );
};

// ─── DASHBOARD ROUTE WRAPPER ──────────────────────────────────────────────────
// Reads the optional :pathId param and switches the user's path if it changed.
interface DashboardRouteProps {
  currentUser: User;
  activeLesson: Lesson | null;
  onUpdateUser: (data: Partial<User>) => void;
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onComplete: (lessonId: number, xpGained: number, score?: number) => void;
  onExit: () => void;
}

const DashboardRoute: React.FC<DashboardRouteProps> = ({
  currentUser, activeLesson, onUpdateUser, onStartLesson, onLogout,
  onSwitchPath, onComplete, onExit
}) => {
  const { pathId } = useParams<{ pathId?: string }>();

  // When the URL includes a :pathId, ensure the user's active path matches it
  useEffect(() => {
    if (pathId && pathId !== currentUser.currentPath) {
      onSwitchPath(pathId as ProgrammingPath['id']);
    }
  }, [pathId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (activeLesson) {
    return (
      <LessonOverlay
        lesson={activeLesson}
        currentPath={currentUser.currentPath}
        currentUser={currentUser}
        onComplete={onComplete}
        onExit={onExit}
        onSwitchPath={onSwitchPath}
      />
    );
  }

  return (
    <Dashboard
      currentUser={currentUser}
      onUpdateUser={onUpdateUser}
      onStartLesson={onStartLesson}
      onLogout={onLogout}
      onSwitchPath={onSwitchPath}
    />
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate();
  const { hasSelectedLanguage } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

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

    const savedRoute = localStorage.getItem('lastVisitedRoute');
    navigate(savedRoute || '/dashboard');

    if (!user.role && selectedRole) {
      try {
        await api.updateUserProfile({ role: selectedRole });
      } catch (error) {
        console.error("Failed to save role to profile:", error);
      }
    }
  }, [selectedRole, navigate]);

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

    const savedRoute = localStorage.getItem('lastVisitedRoute');
    navigate(savedRoute || '/dashboard');
  }, [selectedRole, navigate]);

  const handleLogout = useCallback(async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveLesson(null);
    localStorage.removeItem('lastVisitedRoute');
    navigate('/auth');
  }, [navigate]);

  const onSplashFinish = useCallback(() => {
    if (currentUser) {
      const savedRoute = localStorage.getItem('lastVisitedRoute');
      navigate(savedRoute || '/dashboard');
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

  const switchPath = useCallback(async (pathId: ProgrammingPath['id']) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, currentPath: pathId });
    try {
      await api.updateUserProfile({ currentPath: pathId });
    } catch (error) {
      console.error("Failed to switch path:", error);
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
        await api.updateUserProgress((updatedUser as User).progress);
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
      return <SplashScreen onFinish={() => { }} />;
    }

    // Shared dashboard route props
    const dashProps = currentUser ? {
      currentUser,
      activeLesson,
      onUpdateUser: updateUser,
      onStartLesson: startLesson,
      onLogout: handleLogout,
      onSwitchPath: switchPath,
      onComplete: completeLesson,
      onExit: exitLesson,
    } : null;

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

        {/* ─── Teacher dashboard ───────────────────────────────────────── */}
        {currentUser?.role === 'teacher' && (
          <Route path="/dashboard/*" element={
            <TeacherDashboard currentUser={currentUser} onLogout={handleLogout} />
          } />
        )}

        {/* ─── Student dashboard sub-routes ────────────────────────────── */}
        {currentUser?.role !== 'teacher' && dashProps && (
          <>
            {/* /dashboard/learn/:pathId  — specific language roadmap */}
            <Route path="/dashboard/learn/:pathId" element={<DashboardRoute {...dashProps} />} />
            {/* /dashboard/learn          — language picker (no path set) */}
            <Route path="/dashboard/learn" element={<DashboardRoute {...dashProps} />} />
            {/* /dashboard/:view          — profile, goals, creations, etc. */}
            <Route path="/dashboard/:view" element={<DashboardRoute {...dashProps} />} />
            {/* /dashboard                — home hub */}
            <Route path="/dashboard" element={<DashboardRoute {...dashProps} />} />
          </>
        )}

        {/* Redirect unauthenticated users */}
        {!currentUser && (
          <Route path="/dashboard/*" element={<Navigate to="/auth" replace />} />
        )}

        <Route path="/brain-training" element={<BrainTrainingScreen />} />
        <Route path="/brain-training/:challengeId" element={<BrainChallengeGameScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen text-slate-800 dark:text-slate-100 antialiased transition-colors duration-300">
        <PageTransitionLoader />
        {renderContent()}
      </div>
    </ThemeProvider>
  );
}
