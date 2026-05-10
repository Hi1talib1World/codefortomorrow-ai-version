import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { ProjectFeed } from './ProjectFeed';
import { Leaderboard } from './Leaderboard';
import { ResourcesHub } from './ResourcesHub';
import { AdminPanel } from './AdminPanel';
import { motion, AnimatePresence } from 'motion/react';

export default function OpenSourceScreen() {
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
          {activeTab === 'feed' && <ProjectFeed />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'resources' && <ResourcesHub />}
          {activeTab === 'admin' && <AdminPanel />}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
