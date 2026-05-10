import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, CheckCircle2, Star, GitFork, Bookmark } from 'lucide-react';
import { RepoDetails } from './RepoDetails';
import { User } from '../../types';
import api from '../../services/api';
import { AuthPromptModal } from '../AuthPromptModal';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  topics: string[];
  owner: {
    avatar_url: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface ProjectFeedProps {
  currentUser?: User | null;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

export const ProjectFeed: React.FC<ProjectFeedProps> = ({ currentUser, updateUser }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('/api/opensource/repos');
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
        }
      } catch (error) {
        console.error('Failed to fetch repos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getTierBadge = (stars: number) => {
    if (stars > 5000) return { label: 'Legendary', class: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' };
    if (stars > 1000) return { label: 'Popular', class: 'bg-blue-500/10 border-blue-500/20 text-blue-400' };
    return { label: 'Rising', class: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  };

  const handleSaveRepo = async (e: React.MouseEvent, repoId: number) => {
    e.stopPropagation();
    if (!currentUser || currentUser._id.startsWith('guest_')) {
      setIsAuthModalOpen(true);
      return;
    }
    
    try {
      const updatedUser = await api.toggleSaveItem(repoId.toString(), 'repo');
      if (updateUser) {
        await updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to save repo:', error);
    }
  };

  if (selectedRepo) {
    return <RepoDetails repo={selectedRepo} onBack={() => setSelectedRepo(null)} currentUser={currentUser} updateUser={updateUser} />;
  }

  return (
    <div className="space-y-8">
      <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Trending Repos</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg leading-5 bg-[#0e0e11] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 sm:text-sm transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-between gap-3 px-4 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/50 transition-colors">
              Languages <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-between gap-3 px-4 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800/50 transition-colors">
              Popularity <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-[#121212] rounded-2xl border border-slate-800/60 animate-pulse"></div>
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-2xl border border-slate-800">
          <p className="text-slate-500 font-semibold">No repositories match your search.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRepos.map(repo => {
            const tier = getTierBadge(repo.stargazers_count);
            return (
              <motion.div 
                onClick={() => setSelectedRepo(repo)}
                key={repo.id} 
                variants={itemVariants} 
                className="bg-[#121212] rounded-2xl border border-slate-800/60 hover:border-slate-700 p-6 flex flex-col transition-colors group cursor-pointer"
              >
                {/* Header: Avatar, Name, Verified */}
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={repo.owner?.avatar_url || 'https://github.com/github.png'} 
                    alt={repo.name} 
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://github.com/github.png'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-lg text-white truncate">{repo.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleSaveRepo(e, repo.id)}
                    className={`p-2 rounded-lg transition-colors ${currentUser?.savedRepos?.includes(repo.id.toString()) ? 'bg-brand-500/20 text-brand-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${currentUser?.savedRepos?.includes(repo.id.toString()) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-md">
                    {repo.language || 'Code'}
                  </span>
                  <span className={`px-3 py-1 border text-[11px] font-bold rounded-md ${tier.class}`}>
                    {tier.label}
                  </span>
                </div>

                {/* Topics */}
                <div className="flex items-center gap-2 mb-8 mt-auto flex-wrap">
                  {repo.topics?.slice(0, 3).map((topic) => (
                    <div key={topic} className="px-3 py-1.5 bg-[#1a1a1f] text-slate-500 text-[10px] font-semibold rounded-md">
                      {topic}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-6 pt-5 border-t border-slate-800/60 text-sm font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-white">Stars</span>
                    <span className="text-slate-400">{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-slate-500" />
                    <span className="text-white">Forks</span>
                    <span className="text-slate-400">{formatNumber(repo.forks_count || 0)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
