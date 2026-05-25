import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface RepoContextValue {
  savedRepoIds: string[];
  toggleSave: (repoId: string) => Promise<void>;
  setSavedRepoIds: (ids: string[]) => void;
}

const RepoContext = createContext<RepoContextValue | undefined>(undefined);

const EMPTY_ARRAY: string[] = [];

export const RepoProvider: React.FC<{children: React.ReactNode, initialSaved?: string[]}> = ({ children, initialSaved = EMPTY_ARRAY }) => {
  const [savedRepoIds, setSavedRepoIds] = useState<string[]>(initialSaved);

  useEffect(() => {
    setSavedRepoIds(initialSaved || EMPTY_ARRAY);
  }, [initialSaved]);

  const toggleSave = async (repoId: string) => {
    try {
      // Call backend toggleSaveItem; backend manages user session
      const updatedUser = await api.toggleSaveItem(repoId, 'repo');
      if (updatedUser && updatedUser.savedRepos) {
        setSavedRepoIds(updatedUser.savedRepos);
      } else {
        // if no user returned (guest), toggle locally
        setSavedRepoIds(prev => prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]);
      }
    } catch (err) {
      // Fallback to local toggle
      setSavedRepoIds(prev => prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]);
    }
  };

  return (
    <RepoContext.Provider value={{ savedRepoIds, toggleSave, setSavedRepoIds }}>
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = () => {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error('useRepo must be used within RepoProvider');
  return ctx;
};

export default RepoContext;
