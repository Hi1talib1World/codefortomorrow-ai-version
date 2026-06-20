import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { ProjectFeed } from './ProjectFeed';
import { Leaderboard } from './Leaderboard';
import { ResourcesHub } from './ResourcesHub';
import { AdminPanel } from './AdminPanel';
import { MySaved } from './MySaved';
import { HackRepos } from './HackRepos';
import { GoodFirstIssues } from './GoodFirstIssues';
import { BountiesHub } from './BountiesHub';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import { I18nProvider } from './i18n';

interface OpenSourceScreenProps {
  currentUser?: User | null;
  updateUser?: (data: Partial<User>) => Promise<void>;
  onLogout?: () => void;
}

import { useSearchParams } from 'react-router-dom';

export default function OpenSourceScreen({ currentUser, updateUser, onLogout }: OpenSourceScreenProps) {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'feed';

  return (
    <I18nProvider>
      <div id="cftos-root">
        <DashboardLayout currentUser={currentUser} onLogout={onLogout}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {(activeTab === 'feed' || activeTab === 'trending') && <ProjectFeed currentUser={currentUser} updateUser={updateUser} />}
              {activeTab === 'gsoc' && <HackRepos />}
              {activeTab === 'leaderboard' && <Leaderboard />}
              {activeTab === 'issues' && <GoodFirstIssues />}
              {activeTab === 'resources' && <ResourcesHub />}
              {activeTab === 'bounties' && <BountiesHub />}
              {activeTab === 'admin' && <MySaved />}
            </motion.div>
          </AnimatePresence>
        </DashboardLayout>
      </div>
    </I18nProvider>
  );
}

