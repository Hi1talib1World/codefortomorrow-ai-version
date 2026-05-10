import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, ShieldAlert, Plus, Github, Loader2, CheckCircle2, TrendingUp, Star } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [trending, setTrending] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [addingRepo, setAddingRepo] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        const res = await fetch('/api/opensource/trending');
        if (res.ok) {
          const data = await res.json();
          setTrending(data);
        }
      } catch (err) {
        console.error('Failed to fetch trending repos', err);
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/opensource/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Repository successfully added to feed.');
        setUrl('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to add repository.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('A network error occurred.');
    }
  };

  const handleAddTrending = async (repoUrl: string, repoName: string) => {
    setAddingRepo(repoName);
    try {
      const res = await fetch('/api/opensource/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(`Successfully added ${repoName} to feed.`);
      } else {
        setStatus('error');
        setMessage(data.message || `Failed to add ${repoName}.`);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('A network error occurred.');
    } finally {
      setAddingRepo(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-0">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-[#facc15]" />
          <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-white">Curate Content</h1>
        </div>
        <p className="text-slate-400 font-mono text-sm">
          Administrative dashboard to manage the Deep Tech project feed.
        </p>
      </div>

      <div className="bg-[#121212]/80 backdrop-blur-md border border-dashed border-[#facc15]/30 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldAlert className="w-32 h-32 text-[#facc15]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white font-mono mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#facc15]" /> Add Repository
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="github-url" className="block text-sm font-mono text-slate-400 mb-2">
                GITHUB_URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Github className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  id="github-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full bg-[#09090b] border border-slate-700 text-white font-mono rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-2">
                Must be a valid public GitHub repository URL.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto bg-[#facc15]/10 border border-[#facc15]/50 hover:bg-[#facc15]/20 text-[#facc15] font-mono font-bold px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...</>
              ) : (
                <><Plus className="w-5 h-5" /> ADD_TO_FEED</>
              )}
            </button>
          </form>

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm font-mono text-emerald-400">{message}</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm font-mono text-red-400">{message}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trending Section */}
      <div className="mt-8 bg-[#121212]/80 backdrop-blur-md border border-dashed border-[#facc15]/30 rounded-xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white font-mono mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#facc15]" /> Discover Trending (Last 7 Days)
          </h2>
          
          {trendingLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#facc15] animate-spin" />
            </div>
          ) : trending.length === 0 ? (
            <p className="text-slate-400 font-mono text-sm">No trending repositories found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trending.map((repo) => (
                <div key={repo.id} className="bg-[#09090b] border border-slate-700 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#facc15] font-mono text-sm hover:underline flex items-center gap-2 mb-1">
                      {repo.full_name}
                    </a>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                      <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                    </div>
                    <button
                      onClick={() => handleAddTrending(repo.html_url, repo.full_name)}
                      disabled={addingRepo === repo.full_name}
                      className="text-xs bg-[#facc15]/10 hover:bg-[#facc15]/20 text-[#facc15] border border-[#facc15]/30 px-3 py-1.5 rounded transition-colors disabled:opacity-50 flex items-center gap-1 font-bold"
                    >
                      {addingRepo === repo.full_name ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
