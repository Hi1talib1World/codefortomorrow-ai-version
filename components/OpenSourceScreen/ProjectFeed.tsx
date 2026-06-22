import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, CheckCircle2, Star, GitFork, Bookmark, Share2 } from 'lucide-react';
import { RepoDetails } from './RepoDetails';
import { User } from '../../types';
import api from '../../services/api';
import { useI18n } from './i18n';
import { AuthPromptModal } from '../AuthPromptModal';
import { GITHUB_FALLBACK_AVATAR } from './utils';

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

type SortOption = 'stars' | 'forks' | 'updated' | '';

export const ProjectFeed: React.FC<ProjectFeedProps> = ({ currentUser, updateUser }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('');
  const [searchResults, setSearchResults] = useState<Repo[] | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t, lang } = useI18n();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/opensource/trending');
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
        }
      } catch (error) {
        console.error('Failed to fetch trending repos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Fetch search results from GitHub when query or filters change
  useEffect(() => {
    const doSearch = async () => {
      // If no query or filters are applied, don't trigger a rate-limiting API search.
      // Simply reset searchResults to null to fallback to the trending/curated repos feed.
      if (!searchQuery.trim() && !languageFilter && !sortBy) {
        setSearchResults(null);
        return;
      }

      const baseQuery = searchQuery.trim() || 'stars:>10000';
      const queryParts = [baseQuery];
      if (languageFilter) queryParts.push(`language:${languageFilter}`);
      const query = queryParts.join(' ');

      const params = new URLSearchParams();
      params.set('q', query);
      if (sortBy) {
        params.set('sort', sortBy as string);
        params.set('order', 'desc');
      }
      params.set('per_page', '30');

      const url = `/api/opensource/search?${params.toString()}`;
      try {
        console.log('GitHub search URL:', url);
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          console.error('Search API request failed:', url, res.status, res.statusText, text);
          setSearchResults([]);
          return;
        }

        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Search failed:', err, 'URL:', url);
        setSearchResults([]);
      }
    };
    const timer = setTimeout(doSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, languageFilter, sortBy]);

  const sourceRepos = searchResults !== null ? searchResults : repos;
  const displayedRepos = sourceRepos.filter(r => 
    (r.name || r.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    ((r.description || '')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getTierBadge = (stars: number) => {
    if (stars > 5000) return { label: t('feed.legendary'), class: 'bg-[#FBBF24]/10 border-[#FBBF24]/20 text-[#FBBF24]' };
    if (stars > 1000) return { label: t('feed.popular'), class: 'bg-blue-500/10 border-blue-500/20 text-blue-400' };
    return { label: t('feed.rising'), class: 'bg-[#111827]/10 border-[#111827]/20 text-emerald-400' };
  };

  const handleShareInFeed = (e: React.MouseEvent, repo: Repo) => {
    e.stopPropagation();
    const shareUrl = encodeURIComponent(repo.html_url);
    const shareText = encodeURIComponent(repo.name);
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank', 'noopener');
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
        <h1 className="text-3xl font-black text-white mb-8 tracking-tight">{t('feed.title')}</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              placeholder={t('feed.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg leading-5 bg-[#0e0e11] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 sm:text-sm transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="px-3 py-2 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm text-slate-300">
                <option value="">{t('feed.allLanguages')}</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm text-slate-300">
                <option value="">{t('feed.sort')}</option>
                <option value="stars">{t('feed.mostStars')}</option>
                <option value="forks">{t('feed.mostForks')}</option>
                <option value="updated">{t('feed.recentlyUpdated')}</option>
              </select>
            </div>
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
      ) : displayedRepos.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-2xl border border-slate-800">
          <p className="text-slate-500 font-semibold">{t('feed.noResults')}</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedRepos.map(repo => {
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
                    src={repo.owner?.avatar_url || GITHUB_FALLBACK_AVATAR} 
                    alt={repo.name} 
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== GITHUB_FALLBACK_AVATAR) {
                        target.src = GITHUB_FALLBACK_AVATAR;
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-lg text-white truncate">{repo.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-[#111827] shrink-0" />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {(lang === 'ar' && repo.description_ar) ? repo.description_ar : (repo.description || t('feed.noDescription'))}
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
                    <Star className="w-4 h-4 text-[#FBBF24] fill-current" />
                    <span className="text-white">{t('feed.stars')}</span>
                    <span className="text-slate-400">{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-slate-500" />
                    <span className="text-white">{t('feed.forks')}</span>
                    <span className="text-slate-400">{formatNumber(repo.forks_count || 0)}</span>
                  </div>
                  <button onClick={(e) => handleShareInFeed(e, repo)} className="flex items-center gap-1.5 p-2 rounded-md bg-slate-800 hover:bg-slate-700">
                    <Share2 className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-300">{t('feed.share')}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
