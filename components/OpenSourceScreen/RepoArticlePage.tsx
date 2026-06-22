import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Star, GitFork, Github, ExternalLink, Share2, Twitter, Facebook, Linkedin, Link2, X, Clock, Calendar, Shield, Sparkles, Terminal, Copy, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../ToastNotification';
import { AI_REPOS_DATA } from './aiReposData';
import { HACK_REPOS_DATA } from './hackReposData';
import { GITHUB_FALLBACK_AVATAR } from './utils';
import { useI18n } from './i18n';

export default function RepoArticlePage() {
  const { category, slug, owner, repoName } = useParams<{ category?: string; slug?: string; owner?: string; repoName?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, lang } = useI18n();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // States for dynamic repositories
  const [dynamicRepo, setDynamicRepo] = useState<any | null>(null);
  const [guide, setGuide] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if it is a curated repo or dynamic repo
  const isCurated = !owner || !repoName;
  
  // Find curated repo
  let repo: any = null;
  let resolvedCategory = category;

  if (isCurated) {
    if (category === 'ai') {
      repo = AI_REPOS_DATA.find(r => r.slug === slug);
    } else if (category === 'hack') {
      repo = HACK_REPOS_DATA.find(r => r.slug === slug);
    } else {
      // Search both
      repo = AI_REPOS_DATA.find(r => r.slug === slug);
      if (repo) {
        resolvedCategory = 'ai';
      } else {
        repo = HACK_REPOS_DATA.find(r => r.slug === slug);
        if (repo) {
          resolvedCategory = 'hack';
        }
      }
    }
  } else {
    repo = dynamicRepo;
  }

  // Fetch details for dynamic/custom repos
  useEffect(() => {
    if (isCurated) return;

    const fetchDynamicRepo = async () => {
      setLoading(true);
      setError(null);
      try {
        const repoRes = await fetch(`/api/opensource/by-id?ids=${owner}/${repoName}`);
        if (!repoRes.ok) throw new Error(t('details.errorRepo') || 'Failed to fetch repository details');
        const repoData = await repoRes.json();
        if (!repoData || repoData.length === 0) throw new Error(t('details.errorRepo') || 'Repository not found');
        
        const fetchedRepo = repoData[0];
        
        if (lang === 'ar') {
          const transRes = await fetch('/api/opensource/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: fetchedRepo.description, targetLang: 'ar' })
          });
          if (transRes.ok) {
            const transData = await transRes.json();
            fetchedRepo.description_ar = transData.translatedText;
          }
        }
        
        setDynamicRepo(fetchedRepo);

        const descParam = encodeURIComponent(fetchedRepo.description || '');
        const guideRes = await fetch(`/api/opensource/repos/${owner}/${repoName}/setup-guide?description=${descParam}&lang=${lang}`);
        if (!guideRes.ok) throw new Error(t('details.errorGuide') || 'Failed to fetch setup guide');
        const guideText = await guideRes.text();
        setGuide(guideText);
      } catch (err: any) {
        setError(err.message || 'Error loading repository');
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicRepo();
  }, [owner, repoName, isCurated, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">{lang === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...'}</p>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black mb-4">{lang === 'ar' ? 'المقال غير موجود' : 'Article Not Found'}</h1>
        <p className="text-slate-500 mb-8">{error || (lang === 'ar' ? 'المقال الذي تبحث عنه غير موجود.' : "The article you're looking for doesn't exist.")}</p>
        <button onClick={() => navigate('/cftos')} className="bg-brand-600 text-white px-6 py-3 rounded-full font-bold hover:bg-brand-500 transition-colors">
          {lang === 'ar' ? 'العودة إلى المشاريع مفتوحة المصدر' : 'Back to Open Source'}
        </button>
      </div>
    );
  }

  const accent = resolvedCategory === 'ai' || (repo && (repo.language === 'Python' || repo.language === 'TypeScript'))
    ? { bg: 'bg-purple-500', bgLight: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', textBright: 'text-purple-300', icon: Sparkles }
    : { bg: 'bg-[#111827]', bgLight: 'bg-[#111827]/10', border: 'border-[#111827]/20', text: 'text-emerald-400', textBright: 'text-emerald-300', icon: Shield };

  const articleUrl = window.location.href;
  const shareUrl = encodeURIComponent(articleUrl);
  const shareTitle = encodeURIComponent(isCurated ? repo.article.title : `Setting Up ${repo.name}: Complete Guide`);
  const formatNumber = (num: number) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      showToast('Link copied to clipboard!', 'success');
      setIsShareModalOpen(false);
    } catch { showToast('Failed to copy link.', 'error'); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-white">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#09090b] z-50 sticky top-0">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/welcome')}>
          <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-8 w-auto object-contain" />
        </div>
        <button onClick={() => navigate('/cftos')} className="text-slate-400 hover:text-white font-bold text-sm transition-colors">
          ← Back to Open Source
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Back + Actions */}
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/cftos')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" /><span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsShareModalOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 ${accent.bgLight} border ${accent.border} ${accent.text} rounded-lg font-semibold transition-colors hover:opacity-80`}>
                <Share2 className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
              </button>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors">
                <Github className="w-4 h-4" /><span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>

          {/* Article Header */}
          <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 md:p-10">
            <div className="flex items-start gap-5 mb-6">
              <img src={repo.owner?.avatar_url || GITHUB_FALLBACK_AVATAR} alt={repo.name} className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== GITHUB_FALLBACK_AVATAR) {
                    target.src = GITHUB_FALLBACK_AVATAR;
                  }
                }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-1 ${accent.bgLight} border ${accent.border} ${accent.text} text-[10px] font-bold rounded-md uppercase tracking-wider`}>
                    {isCurated ? (resolvedCategory === 'ai' ? 'AI' : 'Security') : (repo.language || 'Repository')} • {repo.category || (repo.topics && repo.topics[0]) || 'Open Source'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
                  {isCurated ? repo.article.title : (lang === 'ar' ? `دليل إعداد ${repo.name}` : `Setting Up ${repo.name}: Complete Guide`)}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {(lang === 'ar' && repo.description_ar) ? repo.description_ar : repo.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg">{repo.language || 'Code'}</span>
              <div className="flex items-center gap-1.5 font-semibold"><Star className="w-4 h-4 text-[#FBBF24] fill-current" /><span>{formatNumber(repo.stargazers_count)}</span></div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-400"><GitFork className="w-4 h-4" /><span>{formatNumber(repo.forks_count || 0)}</span></div>
              <div className="flex items-center gap-1.5 text-slate-500"><Clock className="w-4 h-4" /><span>{isCurated ? repo.article.readTime : (lang === 'ar' ? '5 دقائق قراءة' : '5 min read')}</span></div>
              <div className="flex items-center gap-1.5 text-slate-500"><Calendar className="w-4 h-4" /><span>{isCurated ? repo.article.date : new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span></div>
            </div>
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {repo.topics.slice(0, 5).map((t: string) => <span key={t} className="px-3 py-1.5 bg-[#1a1a1f] text-slate-500 text-[10px] font-semibold rounded-md">{t}</span>)}
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="bg-[#121212] rounded-3xl border border-slate-800 p-8 md:p-12">
            {isCurated ? (
              <div className="space-y-10">
                {repo.article.sections.map((section: any, i: number) => (
                  <div key={i}>
                    <h2 className={`text-2xl font-black ${accent.textBright} mb-4 tracking-tight`}>{section.heading}</h2>
                    {section.content.split('\n\n').map((p: any, j: number) => (
                      <p key={j} className="text-slate-400 leading-loose mb-4 text-[15px] font-medium">{p}</p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-a:text-brand-400 hover:prose-a:text-brand-300 prose-img:rounded-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {guide}
                </ReactMarkdown>
              </div>
            )}

            {/* CTA */}
            <div className={`${accent.bgLight} border ${accent.border} rounded-2xl p-8 text-center mt-12`}>
              <h3 className={`text-xl font-black ${accent.textBright} mb-3`}>Ready to explore {repo.name}?</h3>
              <p className="text-slate-400 text-sm mb-6">Dive into the source code, contribute, or star the repo to follow updates.</p>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 ${accent.bg} text-white rounded-xl font-bold transition-opacity hover:opacity-90`}>
                <ExternalLink className="w-4 h-4" /> Open on GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setIsShareModalOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
            className="bg-[#121212] w-full max-w-sm rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-800">
              <h3 className="font-black text-xl text-white flex items-center gap-2"><Share2 className={`w-5 h-5 ${accent.text}`} /> Share Article</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform"><Twitter className="w-6 h-6" /></div>
                  <span className="text-xs font-bold text-slate-500">Twitter</span>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform"><Facebook className="w-6 h-6" /></div>
                  <span className="text-xs font-bold text-slate-500">Facebook</span>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center group-hover:-translate-y-1 transition-transform"><Linkedin className="w-6 h-6" /></div>
                  <span className="text-xs font-bold text-slate-500">LinkedIn</span>
                </a>
                <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 rounded-2xl ${accent.bgLight} ${accent.text} flex items-center justify-center group-hover:-translate-y-1 transition-transform`}><Link2 className="w-6 h-6" /></div>
                  <span className="text-xs font-bold text-slate-500">Copy</span>
                </button>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-700">
                <div className="text-xs font-medium text-slate-500 truncate flex-1 pl-1 select-all">{articleUrl}</div>
                <button onClick={copyToClipboard} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors shrink-0">Copy</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
