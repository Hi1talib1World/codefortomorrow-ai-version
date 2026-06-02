
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../Header';
import BottomNav from '../BottomNav';
import LearnScreen from '../ProgressMap';
import ProfileScreen from '../ProfileScreen';
import CreationsScreen from '../CreationsScreen';
import GoalsScreen from '../GoalsScreen';
import LeaderboardScreen from '../LeaderboardScreen';
import StoreScreen from '../StoreScreen';
import SettingsScreen from '../SettingsScreen';
import HomeHubScreen from '../HomeHubScreen';
import PathSelectionScreen from '../PathSelectionScreen';
import MessagingSystem from '../MessagingSystem';
import DocumentationScreen from '../DocumentationScreen';
import AIAssistantScreen from '../AIAssistantScreen';
import MissionsScreen from '../MissionsScreen';
import HowToLearnScreen from '../HowToLearnScreen';
import PrivacyPolicyScreen from '../PrivacyPolicyScreen';
import { User, Lesson, ProgrammingPath } from '../../types';

export type DashboardView = 'home' | 'learn' | 'profile' | 'creations' | 'goals' | 'leaderboard' | 'store' | 'settings' | 'messages' | 'docs' | 'ai-assistant' | 'missions' | 'how-to-learn' | 'privacy-policy';

// Map URL :view param → DashboardView enum
const VIEW_MAP: Record<string, DashboardView> = {
  learn: 'learn',
  profile: 'profile',
  creations: 'creations',
  goals: 'goals',
  leaderboard: 'leaderboard',
  store: 'store',
  settings: 'settings',
  messages: 'messages',
  docs: 'docs',
  'ai-assistant': 'ai-assistant',
  missions: 'missions',
  'how-to-learn': 'how-to-learn',
  'privacy-policy': 'privacy-policy',
};

interface DashboardProps {
  currentUser: User;
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onUpdateUser: (updatedData: Partial<User>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onStartLesson, onLogout, onSwitchPath, onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { view, pathId } = useParams<{ view?: string; pathId?: string }>();

  // Derive the active view from the URL
  const activeView: DashboardView = (() => {
    // /dashboard/learn/:pathId  OR  /dashboard/learn
    if (location.pathname.startsWith('/dashboard/learn')) return 'learn';
    if (view && VIEW_MAP[view]) return VIEW_MAP[view];
    return 'home';
  })();

  const path = currentUser.currentPath;

  /** Navigate to a dashboard sub-route */
  const setActiveView = (v: DashboardView) => {
    if (v === 'home') {
      navigate('/dashboard');
    } else if (v === 'learn') {
      // If user already has a path chosen, go straight to that language's map
      navigate(path ? `/dashboard/learn/${path}` : '/dashboard/learn');
    } else {
      navigate(`/dashboard/${v}`);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeHubScreen 
            onNavigate={setActiveView} 
            currentUser={currentUser} 
            onUpdateUser={onUpdateUser}
          />
        );
      case 'learn':
        if (!pathId) {
          return <PathSelectionScreen onPathSelected={(pId) => {
            onSwitchPath(pId);
            navigate(`/dashboard/learn/${pId}`);
          }} />;
        }
        return (
          <LearnScreen
            completedLessons={currentUser.progress?.completedLessons?.[pathId] || []}
            onStartLesson={onStartLesson}
            path={pathId as ProgrammingPath['id']}
            onSwitchPath={(pId) => navigate(`/dashboard/learn/${pId}`)}
          />
        );
      case 'profile':
        return <ProfileScreen currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      case 'creations':
        return <CreationsScreen />;
      case 'goals':
        return <GoalsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'store':
        return <StoreScreen currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      case 'settings':
        return <SettingsScreen />;
      case 'messages':
        return (
          <div className="h-[calc(100vh-12rem)]">
            <MessagingSystem currentUser={currentUser} />
          </div>
        );
      case 'docs':
        return <DocumentationScreen currentUser={currentUser} />;
      case 'ai-assistant':
        return <AIAssistantScreen currentUser={currentUser} />;
      case 'missions':
        return <MissionsScreen currentUser={currentUser} />;
      case 'how-to-learn':
        return <HowToLearnScreen />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen />;
      default:
        return (
          <HomeHubScreen 
            onNavigate={setActiveView} 
            currentUser={currentUser} 
            onUpdateUser={onUpdateUser}
          />
        );
    }
  };

  // Save the current dashboard route to localStorage whenever it changes
  React.useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      localStorage.setItem('lastVisitedRoute', location.pathname);
    }
  }, [location.pathname]);

  const mainContentBg = (activeView === 'learn' && (path || pathId))
    ? 'bg-brand-50 dark:bg-slate-900'
    : (activeView === 'home' ? 'bg-transparent' : 'bg-brand-50 dark:bg-slate-900');

  return (
    <div className="flex flex-col h-screen bg-brand-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
          onLogout={onLogout}
          onSwitchPath={(pId) => navigate(`/dashboard/learn/${pId}`)}
          onStartLesson={onStartLesson}
        />
        <main className={`flex-grow overflow-y-auto ${mainContentBg} pb-24 md:pb-12 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-10">
            {renderActiveView()}
          </div>
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
};

export default Dashboard;
