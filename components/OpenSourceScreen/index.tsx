import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { ProjectFeed } from './ProjectFeed';
import { Leaderboard } from './Leaderboard';
import { ResourcesHub } from './ResourcesHub';
import { AdminPanel } from './AdminPanel';
import { MySaved } from './MySaved';
import { AIRepos } from './AIRepos';
import { HackRepos } from './HackRepos';
import { GoodFirstIssues } from './GoodFirstIssues';
import { BountiesHub } from './BountiesHub';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';

interface OpenSourceScreenProps {
  currentUser?: User | null;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

import { useSearchParams } from 'react-router-dom';

export default function OpenSourceScreen({ currentUser, updateUser }: OpenSourceScreenProps) {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'feed';

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {(activeTab === 'feed' || activeTab === 'trending') && <ProjectFeed currentUser={currentUser} updateUser={updateUser} />}
          {activeTab === 'yc-oss' && <AIRepos />}
          {activeTab === 'gsoc' && <HackRepos />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'issues' && <GoodFirstIssues />}
          {activeTab === 'resources' && <ResourcesHub />}
          {activeTab === 'bounties' && <BountiesHub />}
          {activeTab === 'admin' && <MySaved />}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}

