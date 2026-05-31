import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { RepoProvider } from './contexts/RepoContext';
import SplashScreen from './components/SplashScreen';
import { Lesson, User, ProgrammingPath, UserProgress } from './types';
import { BADGES_BY_PATH } from './constants';
import api from './services/api';
import { useLanguage } from './contexts/LanguageContext';
import PageTransitionLoader from './components/PageTransitionLoader';
import ConfettiCelebration from './components/ConfettiCelebration';
import { ToastProvider } from './components/ToastNotification';
import ErrorBoundary from './components/ErrorBoundary';
import AdminGuard from './components/AdminDashboard/AdminGuard';

const queryClient = new QueryClient();

const Dashboard = lazy(() => import('./components/Dashboard'));
const TeacherDashboard = lazy(() => import('./components/teacher/TeacherDashboard'));
const LessonScreen = lazy(() => import('./components/LessonScreen'));
const QuizLessonScreen = lazy(() => import('./components/QuizLessonScreen'));
const AuthScreen = lazy(() => import('./components/AuthScreen'));
const RoleSelectionScreen = lazy(() => import('./components/RoleSelectionScreen'));
const MathGameScreen = lazy(() => import('./components/MathGameScreen'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const LanguageSelectionScreen = lazy(() => import('./components/LanguageSelectionScreen'));
const BrainTrainingScreen = lazy(() => import('./components/BrainTrainingScreen'));
const BrainChallengeGameScreen = lazy(() => import('./components/BrainChallengeGameScreen'));
const BlogScreen = lazy(() => import('./components/BlogScreen'));
const BlogPostScreen = lazy(() => import('./components/BlogPostScreen'));
const OpenSourceScreen = lazy(() => import('./components/OpenSourceScreen'));
const RepoArticlePage = lazy(() => import('./components/OpenSourceScreen/RepoArticlePage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

/** Default blank progress object used when creating a guest/new user session. */
const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  completedLessons: {}, // { pathId: [lessonId, ...] }
  scores: {},           // { lessonId: score (0-100) }
  badgesEarned: {},     // { pathId: [badgeId, ...] }
  lastLessonCompletedDate: null,
};

const NOOP = () => {};

// ─── LESSON OVERLAY ──────────────────────────────────────────────────────────
// Rendered on top of the dashboard when a lesson is active.
interface LessonOverlayProps {
  lesson: Lesson;
  currentPath: ProgrammingPath['id'] | null;
  currentUser: User;
  onComplete: (lessonId: number, xpGained: number, score?: number) => void;
  onExit: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onStartLesson?: (lesson: Lesson) => void;
}

const LessonOverlay: React.FC<LessonOverlayProps> = ({
  lesson, currentPath, currentUser, onComplete, onExit, onSwitchPath, onStartLesson
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
      onStartLesson={onStartLesson}
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
        onStartLesson={onStartLesson}
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
  const [showConfetti, setShowConfetti] = useState(false);

  // Effect to check for an existing session on app load by calling the API
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await api.getLoggedInUser();
        if (user) {
          if (!user.progress) {
            user.progress = { ...defaultProgress };
          }
          if (!user.progress.completedLessons) user.progress.completedLessons = {};
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
    if (!userWithRole.progress) {
      userWithRole.progress = { ...defaultProgress };
    }
    if (!userWithRole.progress.completedLessons) userWithRole.progress.completedLessons = {};
    if (!userWithRole.progress.scores) userWithRole.progress.scores = {};
    if (!userWithRole.progress.badgesEarned) userWithRole.progress.badgesEarned = {};
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
    if (currentUser && currentUser.progress) {
      try {
        console.log("Saving user progress before logout...");
        await api.updateUserProgress(currentUser.progress);
      } catch (error) {
        console.error("Failed to save progress on logout:", error);
      }
    }
    await api.logout();
    setCurrentUser(null);
    setActiveLesson(null);
    localStorage.removeItem('lastVisitedRoute');
    navigate('/auth');
  }, [currentUser, navigate]);

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
      
      // Calculate Streak Multiplier
      const streak = progress.streak || 0;
      const multiplier = streak >= 5 ? 1.5 : (streak >= 3 ? 1.2 : 1.0);
      const finalXpGained = isAlreadyCompleted ? 5 : Math.round(xpGained * multiplier);
      const baseNewXp = progress.xp + finalXpGained;

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

      // Update Daily Quests in skillGraph
      const skillGraph = progress.skillGraph || {};
      let dailyQuests = skillGraph.dailyQuests ? [...skillGraph.dailyQuests] : [];
      let dailyQuestsDate = skillGraph.dailyQuestsDate || '';
      let chestOpenedToday = skillGraph.chestOpenedToday || false;
      const todayStr = today.toISOString().split('T')[0];

      // Auto-initialize daily quests if they are not generated for today
      if (dailyQuestsDate !== todayStr || dailyQuests.length === 0) {
        dailyQuests = [
          { id: 'q1', type: 'lesson', targetValue: 1, currentValue: 0, titleKey: 'quest_lesson', xpReward: 15 },
          { id: 'q2', type: 'xp', targetValue: 30, currentValue: 0, titleKey: 'quest_xp', xpReward: 20 },
          { id: 'q3', type: 'quiz', targetValue: 1, currentValue: 0, titleKey: 'quest_quiz', xpReward: 15 },
        ];
        dailyQuestsDate = todayStr;
        chestOpenedToday = false;
      }

      let xpEarnedFromQuests = 0;
      if (!isAlreadyCompleted) {
        dailyQuests = dailyQuests.map(quest => {
          let curr = quest.currentValue;
          if (quest.type === 'lesson') {
            curr = Math.min(quest.targetValue, curr + 1);
          } else if (quest.type === 'xp') {
            curr = Math.min(quest.targetValue, curr + finalXpGained);
          } else if (quest.type === 'quiz' && activeLesson?.type === 'quiz') {
            curr = Math.min(quest.targetValue, curr + 1);
          }

          const wasCompleted = quest.currentValue >= quest.targetValue;
          const isCompleted = curr >= quest.targetValue;
          if (isCompleted && !wasCompleted) {
            xpEarnedFromQuests += quest.xpReward;
          }

          return { ...quest, currentValue: curr };
        });
      }

      updatedUser = {
        ...prevUser,
        progress: {
          ...progress,
          xp: baseNewXp + xpEarnedFromQuests,
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
          },
          skillGraph: {
            ...skillGraph,
            dailyQuests,
            dailyQuestsDate,
            chestOpenedToday,
          }
        },
      };
      return updatedUser;
    });

    // Trigger confetti celebration!
    setShowConfetti(true);

    setActiveLesson(null);

    if (updatedUser) {
      try {
        await api.updateUserProgress((updatedUser as User).progress);
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  }, [currentUser, activeLesson]);
  const exitLesson = useCallback(() => {
    setActiveLesson(null);
  }, []);

  const renderContent = () => {
    if (!isSessionLoaded) {
      return <SplashScreen onFinish={NOOP} />;
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
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/missions" element={<Navigate to="/dashboard/missions" replace />} />
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
            currentUser ? <Navigate to="/dashboard" replace /> : <AuthScreen onAuthSuccess={handleAuthSuccess} skipAuth={handleSkipAuth} role={selectedRole || undefined} />
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
          <Route path="/blog" element={<BlogScreen currentUser={currentUser} updateUser={updateUser} />} />
          <Route path="/blog/:postId" element={<BlogPostScreen currentUser={currentUser} updateUser={updateUser} />} />
          <Route path="/cftos" element={<OpenSourceScreen currentUser={currentUser} updateUser={updateUser} onLogout={handleLogout} />} />
          <Route path="/cftos/:category/:slug" element={<RepoArticlePage />} />

          {/* ─── Owner Admin Dashboard ────────────────────────────────────── */}
          <Route
            path="/admin/*"
            element={
              <AdminGuard currentUser={currentUser}>
                <AdminDashboard
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              </AdminGuard>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RepoProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen text-slate-800 dark:text-slate-100 antialiased transition-colors duration-300">
              <PageTransitionLoader />
              <ConfettiCelebration isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
              {renderContent()}
            </div>
          </ToastProvider>
        </ThemeProvider>
      </ErrorBoundary>
      </RepoProvider>
    </QueryClientProvider>
  );
}
