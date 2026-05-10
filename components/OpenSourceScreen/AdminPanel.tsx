import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, ShieldAlert, Plus, Github, Loader2, CheckCircle2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-0">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-[#00f2ff]" />
          <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-white">Curate Content</h1>
        </div>
        <p className="text-slate-400 font-mono text-sm">
          Administrative dashboard to manage the Deep Tech project feed.
        </p>
      </div>

      <div className="bg-[#111217]/80 backdrop-blur-md border border-dashed border-[#00f2ff]/30 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldAlert className="w-32 h-32 text-[#00f2ff]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white font-mono mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#00f2ff]" /> Add Repository
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
                  className="w-full bg-[#050505] border border-slate-700 text-white font-mono rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] transition-all"
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
              className="w-full sm:w-auto bg-[#00f2ff]/10 border border-[#00f2ff]/50 hover:bg-[#00f2ff]/20 text-[#00f2ff] font-mono font-bold px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};
