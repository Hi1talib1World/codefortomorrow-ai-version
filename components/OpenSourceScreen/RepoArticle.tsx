import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, GitFork, Github, ExternalLink, Share2, Twitter, Facebook, Linkedin, Link2, X, Clock, Calendar } from 'lucide-react';
import { useToast } from '../ToastNotification';

interface RepoArticleProps {
  repo: {
    name: string;
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    html_url: string;
    category: string;
    topics: string[];
    article: {
      title: string;
      readTime: string;
      date: string;
      sections: { heading: string; content: string }[];
    };
    owner: {
      avatar_url: string;
    };
  };
  onBack: () => void;
  accentColor: string; // 'purple' or 'emerald'
}

export const RepoArticle: React.FC<RepoArticleProps> = ({ repo, onBack, accentColor }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { showToast } = useToast();

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const shareUrl = encodeURIComponent(repo.html_url);
  const shareTitle = encodeURIComponent(repo.article.title);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(repo.html_url);
      showToast('Link copied to clipboard!', 'success');
      setIsShareModalOpen(false);
    } catch (err) {
      showToast('Failed to copy link.', 'error');
    }
  };

  const accent = accentColor === 'purple'
    ? { bg: 'bg-purple-500', bgLight: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', textBright: 'text-purple-300' }
    : { bg: 'bg-[#111827]', bgLight: 'bg-[#111827]/10', border: 'border-[#111827]/20', text: 'text-emerald-400', textBright: 'text-emerald-300' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 ${accent.bgLight} border ${accent.border} ${accent.text} rounded-lg font-semibold transition-colors hover:opacity-80`}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
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

      {/* Repo Header */}
      <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
          <img
            src={repo.owner.avatar_url}
            alt={repo.name}
            className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://github.com/github.png'; }}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white mb-2">{repo.article.title}</h1>
            <p className="text-slate-400 text-lg">{repo.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className={`px-3 py-1.5 ${accent.bgLight} border ${accent.border} ${accent.text} text-xs font-bold rounded-lg`}>
            {repo.category}
          </span>
          <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg">
            {repo.language}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Star className="w-4 h-4 text-[#FBBF24] fill-current" />
            <span className="text-white">{formatNumber(repo.stargazers_count)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <GitFork className="w-4 h-4 text-slate-500" />
            <span className="text-white">{formatNumber(repo.forks_count)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{repo.article.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>{repo.article.date}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {repo.topics.map((topic) => (
            <span key={topic} className="px-3 py-1.5 bg-[#1a1a1f] text-slate-500 text-[10px] font-semibold rounded-md">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 md:p-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {repo.article.sections.map((section, i) => (
            <div key={i}>
              <h2 className={`text-2xl font-black ${accent.textBright} mb-4 tracking-tight`}>{section.heading}</h2>
              {section.content.split('\n\n').map((paragraph, j) => (
                <p key={j} className="text-slate-400 leading-loose mb-4 text-[15px] font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {/* CTA */}
          <div className={`${accent.bgLight} border ${accent.border} rounded-2xl p-8 text-center mt-12`}>
            <h3 className={`text-xl font-black ${accent.textBright} mb-3`}>Ready to explore {repo.name}?</h3>
            <p className="text-slate-400 text-sm mb-6">Dive into the source code, contribute, or star the repo to follow updates.</p>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 ${accent.bg} text-white rounded-xl font-bold transition-opacity hover:opacity-90`}
            >
              <ExternalLink className="w-4 h-4" />
              Open on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] w-full max-w-sm rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex justify-between items-center border-b border-slate-800">
              <h3 className="font-black text-xl text-white flex items-center gap-2">
                <Share2 className={`w-5 h-5 ${accent.text}`} /> Share Article
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Twitter className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Twitter</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Facebook</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">LinkedIn</span>
                </a>
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${accent.bgLight} ${accent.text} flex items-center justify-center group-hover:-translate-y-1 transition-transform`}>
                    <Link2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Copy</span>
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-700">
                <div className="text-xs font-medium text-slate-500 truncate flex-1 pl-1 select-all">
                  {repo.html_url}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
