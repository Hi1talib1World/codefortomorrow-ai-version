
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../Header';
import api from '../../services/api';
import BottomNav from '../BottomNav';
import LearnScreen from '../ProgressMap';
import ProfileScreen from '../ProfileScreen';
import CreationsScreen from '../CreationsScreen';
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
import FeedScreen from '../FeedScreen';
import AboutScreen from '../AboutScreen';
import AIToolsHubScreen from '../AIToolsHubScreen';
import { User, Lesson, ProgrammingPath } from '../../types';

export type DashboardView = 'home' | 'learn' | 'profile' | 'creations' | 'leaderboard' | 'store' | 'settings' | 'messages' | 'docs' | 'ai-assistant' | 'missions' | 'how-to-learn' | 'privacy-policy' | 'feed' | 'about' | 'ai-tools';

// Map URL :view param → DashboardView enum
const VIEW_MAP: Record<string, DashboardView> = {
  feed: 'feed',
  learn: 'learn',
  profile: 'profile',
  creations: 'creations',
  leaderboard: 'leaderboard',
  store: 'store',
  settings: 'settings',
  messages: 'messages',
  docs: 'docs',
  'ai-assistant': 'ai-assistant',
  missions: 'missions',
  'how-to-learn': 'how-to-learn',
  'privacy-policy': 'privacy-policy',
  about: 'about',
  'ai-tools': 'ai-tools',
};

interface DashboardProps {
  currentUser: User;
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onStartLesson, onLogout, onSwitchPath, onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { view, pathId } = useParams<{ view?: string; pathId?: string }>();
  const [unreadMessagesCount, setUnreadMessagesCount] = React.useState(0);
  const [gridOn, setGridOn] = React.useState(false);

  // Keyboard layout toggle trigger (G key)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setGridOn(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (gridOn) {
      document.body.classList.add('grid-on');
    } else {
      document.body.classList.remove('grid-on');
    }
    return () => document.body.classList.remove('grid-on');
  }, [gridOn]);

  // Poll for unread message counts in the background
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const conversations = await api.getConversations();
        const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

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

  const renderGuides = () => (
    <div className="guides" aria-hidden="true">
      <div className="cols">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="col">
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="rows" />
      <div className="mline l" />
      <div className="mline r" />
    </div>
  );

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
            currentUser={currentUser}
          />
        );
      case 'feed':
        return <FeedScreen currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      case 'profile':
        return <ProfileScreen currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      case 'creations':
        return <CreationsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen currentUser={currentUser} />;
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
        return <AIAssistantScreen currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      case 'missions':
        return <MissionsScreen currentUser={currentUser} />;
      case 'how-to-learn':
        return <HowToLearnScreen />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen />;
      case 'about':
        return <AboutScreen />;
      case 'ai-tools':
        return <AIToolsHubScreen currentUser={currentUser} onStartLesson={onStartLesson} onSwitchPath={(pId) => navigate(`/dashboard/learn/${pId}`)} />;
      default:
        return (
          <HomeHubScreen 
            onNavigate={setActiveView} 
            currentUser={currentUser} 
            onUpdateUser={onUpdateUser}
            onStartLesson={onStartLesson}
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
    ? 'bg-slate-50 dark:bg-slate-900'
    : (activeView === 'home' ? 'bg-transparent' : 'bg-slate-50 dark:bg-slate-900');

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
          onLogout={onLogout}
          onSwitchPath={(pId) => navigate(`/dashboard/learn/${pId}`)}
          onStartLesson={onStartLesson}
          unreadMessagesCount={unreadMessagesCount}
          updateUser={onUpdateUser}
        />
        <main className={`flex-grow overflow-y-auto ${mainContentBg} pb-24 md:pb-12 transition-colors muller-grid-root`}>
          <style>{`
            .muller-grid-root {
              --cols: 12;
              --bl: 8px;
              --lh: 24px;
              --gutter: 24px;
              --margin: 24px;
              --pad: 24px;
              
              --g-col: rgba(251, 191, 36, 0.02);
              --g-edge: rgba(251, 191, 36, 0.15);
              --g-base: rgba(99, 102, 241, 0.1);
              --g-base-min: rgba(99, 102, 241, 0.03);
            }

            .muller-grid-root .guides {
              position: absolute;
              inset: 0;
              pointer-events: none;
              z-index: 60;
              opacity: 0;
              transition: opacity 0.25s ease;
            }

            body.grid-on .muller-grid-root .guides {
              opacity: 1;
            }

            .muller-grid-root .guides .cols {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 16px;
              right: 16px;
              display: grid;
              grid-template-columns: repeat(var(--cols), 1fr);
              column-gap: 16px;
            }

            .muller-grid-root .guides .col {
              background: var(--g-col);
              box-shadow: inset 1px 0 0 var(--g-edge), inset -1px 0 0 var(--g-edge);
              position: relative;
            }

            .muller-grid-root .guides .col span {
              position: absolute;
              top: 16px;
              left: 0;
              right: 0;
              text-align: center;
              font-family: monospace;
              font-size: 10px;
              color: #FBBF24;
            }
          `}</style>
          
          <div className="relative w-full min-h-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              {renderActiveView()}
            </div>
            {renderGuides()}
          </div>
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} unreadMessagesCount={unreadMessagesCount} />
      </div>
    </div>
  );
};

export default Dashboard;
