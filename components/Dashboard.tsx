
import React, { useState } from 'react';
import Header from './Header';
import ProgressMap from './ProgressMap';
import ProfileScreen from './ProfileScreen';
import CreationsScreen from './CreationsScreen';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { UserProgress, Lesson, ProgrammingPath } from '../types';

type DashboardView = 'learn' | 'profile' | 'creations';

interface DashboardProps {
  userProgress: UserProgress;
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
  path: ProgrammingPath['id'];
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress, onStartLesson, onLogout, onSwitchPath, path }) => {
  const [activeView, setActiveView] = useState<DashboardView>('learn');

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userProgress={userProgress} 
          onLogout={onLogout} 
          onSwitchPath={onSwitchPath}
          currentPath={path}
        />
        <main className="flex-grow overflow-y-auto">
          {activeView === 'learn' && (
            <div className="p-4 md:p-6">
              <ProgressMap 
                completedLessons={userProgress.completedLessons[path] || []} 
                onStartLesson={onStartLesson}
                path={path}
              />
            </div>
          )}
          {activeView === 'profile' && <ProfileScreen userProgress={userProgress} />}
          {activeView === 'creations' && <CreationsScreen />}
        </main>
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default Dashboard;