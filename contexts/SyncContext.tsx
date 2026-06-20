import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface SyncContextType {
  isOnline: boolean;
  syncPending: boolean;
  queueProgressUpdate: (data: any) => void;
  triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncPending, setSyncPending] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    const handleQueueUpdate = () => {
      setSyncPending(getQueue().length > 0);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('cft_offline_queue_updated', handleQueueUpdate);

    // Check if there are items in the queue on boot
    const queue = getQueue();
    if (queue.length > 0) {
      setSyncPending(true);
      if (navigator.onLine) {
        triggerSync();
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('cft_offline_queue_updated', handleQueueUpdate);
    };
  }, []);

  const getQueue = (): any[] => {
    try {
      const queueStr = localStorage.getItem('cft_offline_progress_queue');
      return queueStr ? JSON.parse(queueStr) : [];
    } catch (e) {
      return [];
    }
  };

  const saveQueue = (queue: any[]) => {
    localStorage.setItem('cft_offline_progress_queue', JSON.stringify(queue));
    setSyncPending(queue.length > 0);
  };

  const queueProgressUpdate = (progressData: any) => {
    const queue = getQueue();
    queue.push({
      timestamp: new Date().toISOString(),
      data: progressData,
    });
    saveQueue(queue);

    if (navigator.onLine) {
      triggerSync();
    }
  };

  const triggerSync = async () => {
    if (!navigator.onLine) return;
    const queue = getQueue();
    if (queue.length === 0) return;

    console.log(` Offline Sync Manager: Syncing ${queue.length} buffered actions...`);
    
    // Merge all buffered progress items to send a single consolidated update
    const consolidatedProgress: any = {};
    for (const item of queue) {
      const progressData = item.data;
      if (progressData.xp) {
        consolidatedProgress.xp = (consolidatedProgress.xp || 0) + progressData.xp;
      }
      if (progressData.streak) {
        consolidatedProgress.streak = Math.max(consolidatedProgress.streak || 0, progressData.streak);
      }
      // Merge completedLessons mapping arrays
      if (progressData.completedLessons) {
        consolidatedProgress.completedLessons = consolidatedProgress.completedLessons || {};
        Object.keys(progressData.completedLessons).forEach(pathId => {
          const serverList = consolidatedProgress.completedLessons[pathId] || [];
          const localList = progressData.completedLessons[pathId] || [];
          consolidatedProgress.completedLessons[pathId] = Array.from(new Set([...serverList, ...localList]));
        });
      }
      if (progressData.scores) {
        consolidatedProgress.scores = {
          ...(consolidatedProgress.scores || {}),
          ...progressData.scores,
        };
      }
      if (progressData.skillMastery) {
        consolidatedProgress.skillMastery = {
          ...(consolidatedProgress.skillMastery || {}),
          ...progressData.skillMastery,
        };
      }
    }

    try {
      // Send consolidated progress updates to the server
      await api.updateUserProgress(consolidatedProgress);
      console.log(' Offline Sync Manager: Synchronization successful!');
      saveQueue([]); // Clear queue
    } catch (error) {
      console.error(' Offline Sync Manager: Sync failed:', error);
    }
  };

  return (
    <SyncContext.Provider value={{ isOnline, syncPending, queueProgressUpdate, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
