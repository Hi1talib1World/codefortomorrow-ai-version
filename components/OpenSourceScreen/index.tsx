import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { ProjectFeed } from './ProjectFeed';
import { Leaderboard } from './Leaderboard';
import { ResourcesHub } from './ResourcesHub';
import { AdminPanel } from './AdminPanel';
import { AIRepos } from './AIRepos';
import { HackRepos } from './HackRepos';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';

interface OpenSourceScreenProps {
  currentUser?: User | null;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

export default function OpenSourceScreen({ currentUser, updateUser }: OpenSourceScreenProps) {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'feed' && <ProjectFeed currentUser={currentUser} updateUser={updateUser} />}
          {activeTab === 'yc-oss' && <AIRepos />}
          {activeTab === 'gsoc' && <HackRepos />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'resources' && <ResourcesHub />}
          {activeTab === 'admin' && <AdminPanel />}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}

