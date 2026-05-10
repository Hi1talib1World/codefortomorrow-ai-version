import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, GitFork, BookOpen, Clock, Tag } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
}

const mockArticles = [
  { id: 1, title: 'Understanding React Server Components in 2026', readTime: '5 min', tags: ['React', 'Architecture'], image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80', url: '#' },
  { id: 2, title: 'The Future of WebAssembly and Edge Computing', readTime: '8 min', tags: ['Wasm', 'Edge'], image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80', url: '#' },
  { id: 3, title: 'A Deep Dive into Framer Motion Shared Layouts', readTime: '6 min', tags: ['Animation', 'UI'], image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80', url: '#' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const ProjectFeed: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-[#111217] rounded-xl border border-dashed border-slate-800 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 md:pb-0">
      <section>
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-6 h-6 text-[#00f2ff]" />
          <h2 className="text-2xl font-bold font-mono uppercase tracking-widest">Curated Repositories</h2>
        </div>
        
        {repos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-[#111217]/50">
            <p className="text-slate-500 font-mono text-sm">No curated repositories found. Add some from the Admin panel.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {repos.map(repo => (
              <motion.div key={repo.id} variants={itemVariants} className="group relative bg-[#111217]/80 backdrop-blur-sm border border-dashed border-slate-800 rounded-xl p-6 hover:border-[#00f2ff]/50 transition-colors flex flex-col h-full">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00f2ff] opacity-0 group-hover:opacity-10 blur-2xl transition-opacity rounded-full pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-white truncate pr-4" title={repo.full_name}>{repo.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 font-mono text-xs bg-[#050505] px-2 py-1 rounded border border-slate-800 shrink-0">
                    <Star className="w-3 h-3 text-[#00f2ff]" />
                    {repo.stargazers_count.toLocaleString()}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {repo.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-slate-800/50">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00f2ff]"></span>
                    {repo.language || 'Mixed'}
                  </span>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold font-mono text-[#00f2ff] hover:text-white transition-colors bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 px-3 py-1.5 rounded">
                    READ_MORE
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-6 h-6 text-[#00f2ff]" />
          <h2 className="text-2xl font-bold font-mono uppercase tracking-widest">Featured Articles</h2>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {mockArticles.map(article => (
            <motion.div key={article.id} variants={itemVariants} className="group bg-[#111217]/80 backdrop-blur-sm border border-dashed border-slate-800 rounded-xl overflow-hidden hover:border-[#00f2ff]/50 transition-colors flex flex-col h-full">
              <div className="h-40 overflow-hidden relative">
                <div className="absolute inset-0 bg-[#00f2ff]/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-slate-400 bg-[#050505] px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-white mb-4 line-clamp-2 leading-snug">{article.title}</h3>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-slate-800/50">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {article.readTime}
                  </span>
                  <a href={article.url} className="text-xs font-bold font-mono text-[#00f2ff] hover:text-white transition-colors">
                    READ_ARTICLE →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};
