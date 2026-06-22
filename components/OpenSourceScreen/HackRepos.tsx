import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, CheckCircle2, Star, GitFork, ExternalLink, Shield } from 'lucide-react';
import { HACK_REPOS_DATA } from './hackReposData';
import { useI18n } from './i18n';
import { GITHUB_FALLBACK_AVATAR } from './utils';

const CATEGORIES = ['All', 'Web Security', 'Exploitation', 'Network', 'Database', 'Cryptography', 'Reverse Engineering', 'Toolkit'];
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const formatNumber = (num: number) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();

export const HackRepos: React.FC = () => {
  const { t, lang } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const source = repos.length > 0 ? repos : HACK_REPOS_DATA;
  const filtered = source.filter((r: any) => {
    const name = (r.name || r.full_name || '').toLowerCase();
    const desc = (r.description || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || (r.category === activeCategory) || ((r.topics || []).includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchHackRepos = async () => {
      setLoading(true);
      try {
        const q = 'security OR pentest OR ctf';
        const res = await fetch(`/api/opensource/search?q=${encodeURIComponent(q)}&sort=stars&per_page=30`);
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
        }
      } catch (err) {
        console.error('Failed to fetch hack repos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackRepos();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-black text-white tracking-tight">{t('hackRepos.title')}</h1>
        </div>
        <p className="text-slate-400 text-sm font-medium mb-8">{t('hackRepos.subtitle')}</p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-600" /></div>
            <input type="text" placeholder={t('hackRepos.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-[#0e0e11] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#111827]/50 sm:text-sm transition-colors" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-[#111827]/20 text-emerald-400 border border-[#111827]/30' : 'bg-[#0e0e11] text-slate-400 border border-slate-800 hover:text-slate-200'}`}
              >{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111827]/5 border border-[#111827]/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-emerald-300/80 text-xs font-medium leading-relaxed">
          <span className="font-bold text-emerald-400">Ethical Use Only.</span> These tools are for authorized security testing, education, and research only.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-2xl border border-slate-800"><p className="text-slate-500 font-semibold">{t('hackRepos.noResults')}</p></div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(repo => {
            const IconComp = repo.icon || Shield;
            return (
              <motion.div onClick={() => {
                if (repo.slug) {
                  navigate(`/cftos/post/${repo.slug}`);
                } else {
                  window.open(repo.html_url || repo.url, '_blank', 'noopener');
                }
              }} key={repo.id || repo.full_name} variants={itemVariants}
                className="bg-[#121212] rounded-2xl border border-slate-800/60 hover:border-[#111827]/30 p-6 flex flex-col transition-all group cursor-pointer hover:shadow-lg hover:shadow-[#111827]/5">
                <div className="flex items-start gap-4 mb-4">
                  <img src={repo.owner?.avatar_url || GITHUB_FALLBACK_AVATAR} alt={repo.name} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== GITHUB_FALLBACK_AVATAR) {
                        target.src = GITHUB_FALLBACK_AVATAR;
                      }
                    }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-lg text-white truncate group-hover:text-emerald-300 transition-colors">{repo.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {(lang === 'ar' && repo.description_ar) ? repo.description_ar : repo.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 shrink-0 transition-colors" />
                </div>
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-md">{repo.language || 'Code'}</span>
                  <span className="px-3 py-1 bg-[#111827]/10 border border-[#111827]/20 text-emerald-400 text-[11px] font-bold rounded-md flex items-center gap-1"><IconComp className="w-3 h-3" /> {repo.category || (repo.topics && repo.topics[0]) || 'Security'}</span>
                </div>
                <div className="flex items-center gap-2 mb-6 mt-auto flex-wrap">
                  {(repo.topics || []).slice(0, 3).map(topic => <div key={topic} className="px-3 py-1.5 bg-[#1a1a1f] text-slate-500 text-[10px] font-semibold rounded-md">{topic}</div>)}
                </div>
                <div className="flex items-center gap-6 pt-5 border-t border-slate-800/60 text-sm font-semibold">
                  <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#FBBF24] fill-current" /><span className="text-white">{t('feed.stars')}</span><span className="text-slate-400">{formatNumber(repo.stargazers_count || 0)}</span></div>
                  <div className="flex items-center gap-1.5"><GitFork className="w-4 h-4 text-slate-500" /><span className="text-white">{t('feed.forks')}</span><span className="text-slate-400">{formatNumber(repo.forks_count || 0)}</span></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
