import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, GitFork, Github, CheckCircle2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User } from '../../types';
import api from '../../services/api';
import { AuthPromptModal } from '../AuthPromptModal';

interface RepoDetailsProps {
  repo: any;
  onBack: () => void;
  currentUser?: User | null;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

export const RepoDetails: React.FC<RepoDetailsProps> = ({ repo, onBack, currentUser, updateUser }) => {
  const [readme, setReadme] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const [owner, name] = repo.full_name.split('/');
        const res = await fetch(`/api/opensource/repos/${owner}/${name}/readme`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('No README found for this repository.');
          } else {
            throw new Error('Failed to fetch README');
          }
        } else {
          const text = await res.text();
          setReadme(text);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the documentation.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReadme();
  }, [repo.full_name]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num?.toString() || '0';
  };

  const handleSaveRepo = async () => {
    if (!currentUser || currentUser._id.startsWith('guest_')) {
      setIsAuthModalOpen(true);
      return;
    }
    
    try {
      const updatedUser = await api.toggleSaveItem(repo.id.toString(), 'repo');
      if (updateUser) {
        await updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to save repo:', error);
    }
  };

  const isSaved = currentUser?.savedRepos?.includes(repo.id.toString());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Feed</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveRepo}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold transition-colors ${isSaved ? 'bg-brand-500/10 border-brand-500/20 text-brand-500' : 'bg-[#121212] border-slate-800 text-slate-300 hover:bg-slate-800'}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      {/* Repo Header Info */}
      <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <img 
          src={repo.owner?.avatar_url || 'https://github.com/github.png'} 
          alt={repo.name} 
          className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-black text-white">{repo.name}</h1>
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          </div>
          <p className="text-slate-400 text-lg">{repo.description}</p>
        </div>
        <div className="flex gap-6 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <div className="flex flex-col">
              <span className="text-white">{formatNumber(repo.stargazers_count)}</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">Stars</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-white">{formatNumber(repo.forks_count)}</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">Forks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Readme Content */}
      <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-slate-400 py-10 font-semibold">
            {error}
          </div>
        ) : (
          <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-a:text-brand-400 hover:prose-a:text-brand-300 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {readme}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};
