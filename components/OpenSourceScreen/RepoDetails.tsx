import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, GitFork, Github, CheckCircle2, Bookmark, Share2, Twitter, Facebook, Linkedin, Link2, X, Sparkles, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User } from '../../types';
import api from '../../services/api';
import { AuthPromptModal } from '../AuthPromptModal';
import { useI18n } from './i18n';
import { GITHUB_FALLBACK_AVATAR } from './utils';

interface RepoDetailsProps {
  repo: any;
  onBack: () => void;
  currentUser?: User | null;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

export const RepoDetails: React.FC<RepoDetailsProps> = ({ repo, onBack, currentUser, updateUser }) => {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<'guide' | 'readme'>('guide');
  const [guide, setGuide] = useState<string>('');
  const [readme, setReadme] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Automatically translate description when language is switched to Arabic
  useEffect(() => {
    if (lang === 'ar' && repo.description && !repo.description_ar && !translatedDesc && !isTranslating) {
      const performTranslation = async () => {
        setIsTranslating(true);
        try {
          const res = await fetch('/api/opensource/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: repo.description,
              targetLang: 'ar'
            })
          });
          if (res.ok) {
            const data = await res.json();
            setTranslatedDesc(data.translatedText);
          }
        } catch (err) {
          console.error('Auto translation failed:', err);
        } finally {
          setIsTranslating(false);
        }
      };
      performTranslation();
    }
  }, [lang, repo.description, repo.description_ar, translatedDesc, isTranslating]);

  // Reset state when active repo changes
  useEffect(() => {
    setGuide('');
    setReadme('');
    setActiveTab('guide');
    setError(null);
    setTranslatedDesc(null);
    setIsTranslating(false);
  }, [repo.full_name]);

  // Fetch AI Setup Guide
  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const [owner, name] = repo.full_name.split('/');
        const descriptionParam = encodeURIComponent(repo.description || '');
        const res = await fetch(`/api/opensource/repos/${owner}/${name}/setup-guide?description=${descriptionParam}`);
        if (!res.ok) {
          throw new Error(t('details.failedFetchGuide'));
        }
        const text = await res.text();
        setGuide(text);
      } catch (err: any) {
        setError(err.message || t('details.errorGuide'));
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'guide' && !guide) {
      fetchGuide();
    }
  }, [repo.full_name, activeTab, guide, repo.description]);

  // Fetch README
  useEffect(() => {
    const fetchReadme = async () => {
      setLoading(true);
      setError(null);
      try {
        const [owner, name] = repo.full_name.split('/');
        const res = await fetch(`/api/opensource/repos/${owner}/${name}/readme`);
        if (!res.ok) {
          if (res.status === 404) {
            setError(t('details.noReadme'));
          } else {
            throw new Error(t('details.failedFetchReadme'));
          }
        } else {
          const text = await res.text();
          setReadme(text);
        }
      } catch (err: any) {
        setError(err.message || t('details.errorReadme'));
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'readme' && !readme) {
      fetchReadme();
    }
  }, [repo.full_name, activeTab, readme]);

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
          <span className="font-semibold">{t('details.back')}</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold transition-colors bg-[#121212] border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('details.share')}</span>
          </button>
          <button 
            onClick={handleSaveRepo}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold transition-colors ${isSaved ? 'bg-brand-500/10 border-brand-500/20 text-brand-500' : 'bg-[#121212] border-slate-800 text-slate-300 hover:bg-slate-800'}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? t('details.saved') : t('details.save')}</span>
          </button>
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>{t('details.viewOnGithub')}</span>
          </a>
        </div>
      </div>

      {/* Repo Header Info */}
      <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <img 
          src={repo.owner?.avatar_url || GITHUB_FALLBACK_AVATAR} 
          alt={repo.name} 
          className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== GITHUB_FALLBACK_AVATAR) {
              target.src = GITHUB_FALLBACK_AVATAR;
            }
          }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-black text-white">{repo.name}</h1>
            <CheckCircle2 className="w-6 h-6 text-[#111827] shrink-0" />
          </div>
          <p className="text-slate-400 text-lg">
            {(lang === 'ar' && (repo.description_ar || translatedDesc)) ? (repo.description_ar || translatedDesc) : repo.description}
          </p>
        </div>
        <div className="flex gap-6 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FBBF24] fill-current" />
            <div className="flex flex-col">
              <span className="text-white">{formatNumber(repo.stargazers_count)}</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">{t('feed.stars')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-white">{formatNumber(repo.forks_count)}</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">{t('feed.forks')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-black tracking-tight text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brand-500" /> {t('details.shareTitle')}
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(repo.html_url)}&text=${encodeURIComponent(repo.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F5FE] text-[#1DA1F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Twitter className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Twitter</span>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(repo.html_url)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#EBF0F8] text-[#1877F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Facebook</span>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(repo.html_url)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF3FA] text-[#0A66C2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">LinkedIn</span>
                </a>
                <button 
                  onClick={async () => { await navigator.clipboard.writeText(repo.html_url); setIsShareModalOpen(false); }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{t('details.copy')}</span>
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-medium text-slate-500 truncate flex-1 pl-1 select-all">
                  {repo.html_url}
                </div>
                <button 
                  onClick={async () => { await navigator.clipboard.writeText(repo.html_url); setIsShareModalOpen(false); }}
                  className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-shadow border border-slate-200 dark:border-slate-600 shrink-0"
                >
                  {t('details.copyLink')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section (AI Setup Guide / README) */}
      <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 min-h-[50vh]">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-400 fill-brand-400/20" />
            <span>{t('details.aiBeginnerGuide')}</span>
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
              activeTab === 'readme'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t('details.fullReadme')}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 space-y-4">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            {activeTab === 'guide' && (
              <p className="text-slate-400 text-sm animate-pulse font-medium">
                {t('details.generatingGuide')}
              </p>
            )}
          </div>
        ) : error ? (
          <div className="text-center text-slate-400 py-10 font-semibold">
            {error}
          </div>
        ) : (
          <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-a:text-brand-400 hover:prose-a:text-brand-300 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {activeTab === 'guide' ? guide : readme}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};
