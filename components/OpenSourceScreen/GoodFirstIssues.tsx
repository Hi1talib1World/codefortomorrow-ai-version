import React, { useEffect, useState } from 'react';
import { Search, GitPullRequest, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from './i18n';

interface IssueItem {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  user: { login: string; avatar_url: string };
  labels: Array<{ id: number; name: string; color: string }>;
  comments: number;
  created_at: string;
  body: string;
}

export const GoodFirstIssues: React.FC = () => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState<'comments'|'updated'|'created'>('comments');
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('q', query || 'good first issue');
        if (language) params.set('language', language);
        params.set('sort', sortBy);
        params.set('order', 'desc');
        params.set('per_page', '30');
        const res = await fetch(`/api/opensource/issues?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setIssues(data.items || []);
        } else {
          setIssues([]);
        }
      } catch (err) {
        console.error('Failed to fetch issues', err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [query, language, sortBy]);

  return (
    <div className="space-y-8 pb-24">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <GitPullRequest className="w-8 h-8 text-sky-400" />
          <h1 className="text-3xl font-black text-white tracking-tight">{t('issues.title')}</h1>
        </div>
        <p className="text-slate-400 text-sm font-medium mb-8">{t('issues.subtitle')}</p>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              placeholder={t('issues.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-[#0e0e11] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 sm:text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-3 py-2 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm text-slate-300">
              <option value="">{t('issues.anyLanguage')}</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm text-slate-300">
              <option value="comments">{t('issues.mostComments')}</option>
              <option value="updated">{t('feed.recentlyUpdated')}</option>
              <option value="created">{t('issues.newest')}</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-56 bg-[#121212] rounded-2xl border border-slate-800/60 animate-pulse"></div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-2xl border border-slate-800">
          <p className="text-slate-500 font-semibold">{t('issues.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {issues.map(issue => (
            <motion.a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-[#121212] rounded-3xl border border-slate-800/60 p-6 hover:border-sky-500/40 hover:bg-slate-900 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">{issue.title}</h2>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{issue.body || t('issues.noDescription')}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
              </div>
              <div className="flex flex-wrap gap-3 items-center text-xs text-slate-400">
                <span className="bg-slate-900 border border-slate-800 rounded-full px-3 py-1">{new URL(issue.repository_url).pathname.replace('/repos/', '')}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(issue.created_at).toLocaleDateString()}</span>
                <span className="inline-flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {issue.comments} {t('issues.comments')}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {issue.labels.map(label => (
                  <span key={label.id} className="bg-slate-800 border border-slate-700 rounded-full px-2 py-1 text-[11px] text-slate-300" style={{ backgroundColor: `#${label.color}` }}>
                    {label.name}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
};
