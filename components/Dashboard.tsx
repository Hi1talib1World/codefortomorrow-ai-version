
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import LearnScreen from './ProgressMap';
import ProfileScreen from './ProfileScreen';
import CreationsScreen from './CreationsScreen';
import GoalsScreen from './GoalsScreen';
import LeaderboardScreen from './LeaderboardScreen';
import StoreScreen from './StoreScreen';
import SettingsScreen from './SettingsScreen';
import HomeHubScreen from './HomeHubScreen';
import PathSelectionScreen from './PathSelectionScreen';
import { User, Lesson, ProgrammingPath } from '../types';

export type DashboardView = 'home' | 'learn' | 'profile' | 'creations' | 'goals' | 'leaderboard' | 'store' | 'settings';

interface DashboardProps {
  currentUser: User;
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  onUpdateUser: (updatedData: Partial<User>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onStartLesson, onLogout, onSwitchPath, onUpdateUser }) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const path = currentUser.currentPath;

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeHubScreen onNavigate={setActiveView} userName={currentUser.name} role={currentUser.role} />;
      case 'learn':
        if (!path) {
          return <PathSelectionScreen onPathSelected={(pId) => {
            onSwitchPath(pId);
            setActiveView('learn');
          }} />;
        }
        return <LearnScreen 
                 completedLessons={currentUser.progress.completedLessons[path] || []} 
                 onStartLesson={onStartLesson}
                 path={path}
                 onSwitchPath={onSwitchPath}
               />;
      case 'profile':
        return <ProfileScreen currentUser={currentUser} onUpdateUser={onUpdateUser} />;
      case 'creations':
        return <CreationsScreen />;
      case 'goals':
        return <GoalsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'store':
        return <StoreScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeHubScreen onNavigate={setActiveView} userName={currentUser.name} role={currentUser.role} />;
    }
  };

  const mainContentBg = (activeView === 'learn' && path) 
    ? 'bg-sky-50 dark:bg-slate-900' 
    : (activeView === 'home' ? 'bg-transparent' : 'bg-sky-50 dark:bg-slate-900');

  return (
    <div className="flex h-screen bg-sky-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar activeView={activeView} setActiveView={setActiveView} currentUser={currentUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentUser={currentUser}
          onLogout={onLogout}
          onSwitchPath={onSwitchPath}
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
