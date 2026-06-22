import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, GitFork, Bookmark, ExternalLink } from 'lucide-react';
import { useRepo } from '../../contexts/RepoContext';
import { useI18n } from './i18n';
import { GITHUB_FALLBACK_AVATAR } from './utils';

export const MySaved: React.FC = () => {
  const { savedRepoIds, toggleSave } = useRepo();
  const { t } = useI18n();
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!savedRepoIds || savedRepoIds.length === 0) {
        setRepos([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/opensource/by-id?ids=${savedRepoIds.join(',')}`);
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
        }
      } catch (err) {
        console.error('Failed to fetch saved repos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [savedRepoIds]);

  if (loading) return <div className="py-20 text-center">{t('saved.loading')}</div>;
  if (repos.length === 0) return <div className="py-20 text-center text-slate-500">{t('saved.empty')}</div>;

  return (
    <div>
      <h2 className="text-3xl font-black text-white mb-6">{t('saved.title')}</h2>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map(repo => (
          <div key={repo.id} className="bg-[#121212] rounded-2xl border border-slate-800/60 p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={repo.owner?.avatar_url || GITHUB_FALLBACK_AVATAR} 
                className="w-10 h-10 rounded-xl object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== GITHUB_FALLBACK_AVATAR) {
                    target.src = GITHUB_FALLBACK_AVATAR;
                  }
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-bold text-white truncate">{repo.full_name}</a>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{repo.description}</p>
              </div>
              <button 
                onClick={() => {
                  const identifier = savedRepoIds.includes(repo.full_name) ? repo.full_name : String(repo.id);
                  toggleSave(identifier);
                }} 
                className="p-2"
              >
                <Bookmark className={`w-5 h-5 ${savedRepoIds.includes(repo.full_name) || savedRepoIds.includes(String(repo.id)) ? 'text-brand-500 fill-current' : 'text-slate-300'}`} />
              </button>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FBBF24]" /> <span className="text-slate-300">{repo.stargazers_count}</span></div>
              <div className="flex items-center gap-2"><GitFork className="w-4 h-4 text-slate-400" /> <span className="text-slate-300">{repo.forks_count}</span></div>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-slate-400 hover:text-white"><ExternalLink className="w-4 h-4" /></a>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
