import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Facebook, Linkedin, Link2, X, Bookmark, Menu } from 'lucide-react';
import { blogPosts } from '../BlogScreen';
import { useToast } from '../ToastNotification';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { AuthPromptModal } from '../AuthPromptModal';

export default function BlogPostScreen({ currentUser, updateUser }: BlogPostScreenProps) {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { language } = useLanguage();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [gridOn, setGridOn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isDashboard = window.location.pathname.startsWith('/dashboard') || currentUser !== null;
    const isRtl = language === 'ar';

    const getPlatformHref = (platform: 'academy' | 'os' | 'docs', fallbackRoute: string) => {
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        if (hostname.endsWith('palycofoto.club')) {
            if (platform === 'academy') return `http://palycofoto.club${port}${fallbackRoute}`;
            if (platform === 'os') return `http://os.palycofoto.club${port}${fallbackRoute}`;
            if (platform === 'docs') return `http://docs.palycofoto.club${port}${fallbackRoute}`;
        }
        return fallbackRoute;
    };

    const handleCardClick = (e: React.MouseEvent, platform: 'academy' | 'os' | 'docs', fallbackRoute: string) => {
        const hostname = window.location.hostname;
        if (hostname.endsWith('palycofoto.club')) {
            e.preventDefault();
            window.location.href = getPlatformHref(platform, fallbackRoute);
        }
    };

    const onGetStarted = () => {
        if (currentUser) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    const post = blogPosts.find(p => p.id === postId);

    // Keyboard layout toggle trigger (G key)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
                setGridOn(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (gridOn) {
            document.body.classList.add('grid-on');
        } else {
            document.body.classList.remove('grid-on');
        }
        return () => document.body.classList.remove('grid-on');
    }, [gridOn]);

    // Runtime Optical Alignment
    useEffect(() => {
        const alignInk = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            document.querySelectorAll('.opt-align').forEach((el) => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.marginLeft = '0px';
                const style = window.getComputedStyle(htmlEl);
                const char = (htmlEl.textContent || '').trim().charAt(0);
                if (!char) return;

                ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                ctx.textAlign = 'left';
                const metrics = ctx.measureText(char);
                const sideBearing = metrics.actualBoundingBoxLeft;

                if (isFinite(sideBearing) && sideBearing > 0) {
                    htmlEl.style.marginLeft = `${sideBearing.toFixed(2)}px`;
                }
            });
        };

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(alignInk);
        }
        alignInk();
        window.addEventListener('resize', alignInk);
        return () => window.removeEventListener('resize', alignInk);
    }, []);

    const handleSavePost = async () => {
        if (!post) return;
        if (!currentUser || currentUser._id.startsWith('guest_')) {
            setIsAuthModalOpen(true);
            return;
        }
        
        try {
            const updatedUser = await api.toggleSaveItem(post.id, 'post');
            if (updateUser) {
                await updateUser(updatedUser);
            }
            showToast(updatedUser.savedPosts?.includes(post.id) ? 'Post saved to bookmarks!' : 'Post removed from bookmarks.', 'success');
        } catch (error) {
            console.error('Failed to save post:', error);
            showToast('Failed to save post.', 'error');
        }
    };
    
    const isSaved = currentUser?.savedPosts?.includes(post?.id || '');

    const handleShareClick = () => {
        setIsShareModalOpen(true);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
            setIsShareModalOpen(false);
        } catch (err) {
            showToast('Failed to copy link.', 'error');
        }
    };
    
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(post?.title || "Code for Tomorrow Blog");

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-black mb-4">Post Not Found</h1>
                <p className="text-slate-400 mb-8">The article you're looking for doesn't exist.</p>
                <button 
                    onClick={() => navigate('/blog')}
                    className="bg-[#FBBF24] text-slate-950 px-6 py-3 rounded font-bold hover:bg-[#f59e0b] transition-all"
                >
                    Back to Blog
                </button>
            </div>
        );
    }

    const renderGuides = () => (
        <div className="guides" aria-hidden="true">
            <div className="cols">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="col">
                        <span>{i + 1}</span>
                    </div>
                ))}
            </div>
            <div className="rows" />
            <div className="mline l" />
            <div className="mline r" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0f1d] font-sans text-white selection:bg-[#FBBF24]/30 selection:text-white muller-grid-root pb-20">
            <style>{`
                .muller-grid-root {
                    --cols: 12;
                    --bl: 8px;
                    --lh: 24px;
                    --gutter: 24px;
                    --margin: 72px;
                    --pad: 96px;
                    --maxw: 1296px;
                    
                    --paper: #0a0f1d;
                    --ink: #ffffff;
                    --ink-soft: #94a3b8;
                    --accent: #FBBF24;
                    
                    --g-col: rgba(251, 191, 36, 0.03);
                    --g-edge: rgba(251, 191, 36, 0.2);
                    --g-base: rgba(99, 102, 241, 0.15);
                    --g-base-min: rgba(99, 102, 241, 0.05);

                    background-color: var(--paper);
                    color: var(--ink);
                }

                .muller-grid-root,
                .muller-grid-root * {
                    box-sizing: border-box;
                }

                .muller-grid-root .spread {
                    position: relative;
                    width: 100%;
                }

                .muller-grid-root .wrap {
                    position: relative;
                    max-width: var(--maxw);
                    margin: 0 auto;
                    padding: var(--pad) var(--margin);
                }

                .muller-grid-root .muller-grid {
                    display: grid;
                    grid-template-columns: repeat(var(--cols), 1fr);
                    column-gap: var(--gutter);
                    row-gap: var(--lh);
                }

                .muller-grid-root .band {
                    grid-column: 1 / -1;
                    display: grid;
                    grid-template-columns: subgrid;
                    column-gap: var(--gutter);
                    row-gap: var(--lh);
                    align-items: start;
                }

                @supports not (grid-template-columns: subgrid) {
                    .muller-grid-root .band {
                        grid-template-columns: repeat(var(--cols), 1fr);
                    }
                }

                .muller-grid-root .guides {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 60;
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }

                body.grid-on .muller-grid-root .guides {
                    opacity: 1;
                }

                .muller-grid-root .guides .cols {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: var(--margin);
                    right: var(--margin);
                    display: grid;
                    grid-template-columns: repeat(var(--cols), 1fr);
                    column-gap: var(--gutter);
                }

                .muller-grid-root .guides .col {
                    background: var(--g-col);
                    box-shadow: inset 1px 0 0 var(--g-edge), inset -1px 0 0 var(--g-edge);
                    position: relative;
                }

                .muller-grid-root .guides .col span {
                    position: absolute;
                    top: 32px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-family: "Space Mono", monospace;
                    font-size: 10px;
                    line-height: 1;
                    color: var(--accent);
                }

                .muller-grid-root .guides .rows {
                    position: absolute;
                    left: var(--margin);
                    right: var(--margin);
                    top: var(--pad);
                    bottom: 0;
                    background-image: 
                        repeating-linear-gradient(to bottom, var(--g-base) 0 1px, transparent 1px var(--lh)),
                        repeating-linear-gradient(to bottom, var(--g-base-min) 0 1px, transparent 1px var(--bl));
                }

                .muller-grid-root .guides .mline {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--g-edge);
                }

                .muller-grid-root .guides .mline.l { left: var(--margin); }
                .muller-grid-root .guides .mline.r { right: var(--margin); }

                /* Typography snapper */
                .muller-grid-root .masthead {
                    font-family: "Inter", sans-serif;
                    font-weight: 900;
                    font-size: 64px;
                    line-height: 64px;
                    letter-spacing: -0.04em;
                    text-transform: uppercase;
                    margin: 0;
                }

                .muller-grid-root .mono-label {
                    font-family: "Space Mono", monospace;
                    font-size: 11px;
                    line-height: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--accent);
                    display: block;
                }

                .muller-grid-root .pill-card {
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(255, 255, 255, 0.01);
                    padding: 24px;
                    transition: all 0.2s ease;
                }
                .muller-grid-root .pill-card:hover {
                    border-color: var(--accent);
                    background: rgba(251, 191, 36, 0.02);
                }

                @media (max-width: 992px) {
                    .muller-grid-root {
                        --margin: 40px;
                        --gutter: 16px;
                        --pad: 64px;
                    }
                    .muller-grid-root .masthead {
                        font-size: 48px;
                        line-height: 48px;
                    }
                }

                @media (max-width: 640px) {
                    .muller-grid-root {
                        --margin: 20px;
                        --gutter: 12px;
                        --pad: 40px;
                    }
                    .muller-grid-root .masthead {
                        font-size: 36px;
                        line-height: 36px;
                    }
                }
            `}</style>

            <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-[#0a0f1d]/90 backdrop-blur-md z-50 border-b border-slate-800 transition-all duration-300">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/portals')}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
                            title="App Launcher"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
                            </svg>
                        </button>
                        <div 
                            className="flex items-center cursor-pointer shrink-0" 
                            onClick={() => navigate('/welcome')}
                        >
                            <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-8 w-auto object-contain" />
                        </div>
                    </div>

                    <nav className={`hidden lg:flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="text-white hover:text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                            Academy
                        </a>
                        <div className="w-[1px] h-3 bg-slate-800 self-center" />
                        <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="text-white hover:text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                            Open Source
                        </a>
                        <div className="w-[1px] h-3 bg-slate-800 self-center" />
                        <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                            Docs & Blog
                        </a>
                        <div className="w-[1px] h-3 bg-slate-800 self-center" />
                        <a href="/about" className="text-white hover:text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                            About
                        </a>
                    </nav>

                    <div className="hidden md:flex items-center">
                        <button onClick={onGetStarted} className="bg-[#FBBF24] text-[#111827] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-[#f59e0b] transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-[#FBBF24]/20">
                            Launch Ecosystem
                        </button>
                    </div>

                    <div className="flex lg:hidden items-center">
                        <button className="p-1 text-white hover:text-[#FBBF24] bg-transparent border-none cursor-pointer" onClick={() => setIsMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-[#111827]/95 z-50 md:hidden flex flex-col p-8">
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-1 text-white hover:text-[#FBBF24] bg-transparent border-none cursor-pointer">
                        <X className="w-8 h-8" />
                    </button>
                    <nav className="flex flex-col space-y-6 mt-16 text-center">
                        <a href={getPlatformHref('academy', '/dashboard')} className="text-xl font-black uppercase text-white hover:text-[#FBBF24]">Academy</a>
                        <a href={getPlatformHref('os', '/cftos')} className="text-xl font-black uppercase text-white hover:text-[#FBBF24]">Open Source</a>
                        <a href={getPlatformHref('docs', '/blog')} className="text-xl font-black uppercase text-[#FBBF24]">Docs & Blog</a>
                        <a href="/about" className="text-xl font-black uppercase text-white hover:text-[#FBBF24]">About</a>
                        <button onClick={onGetStarted} className="mt-8 bg-[#FBBF24] text-[#111827] font-bold px-8 py-4 rounded text-lg hover:bg-[#f59e0b]">
                            Launch Ecosystem
                        </button>
                    </nav>
                </div>
            )}

            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[60vh] bg-slate-900 relative mt-16">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="container mx-auto px-6 pb-12 pt-20 max-w-[1296px]">
                        <span className="inline-block bg-[#FBBF24] text-slate-950 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm mb-6">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] max-w-4xl drop-shadow-md opt-align">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#FBBF24]" /> {post.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#FBBF24]" /> {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#FBBF24]" /> {post.readTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="spread">
                <div className="wrap">
                    <div className="muller-grid">
                        
                        {/* Social Share Sidebar (Left side, columns 1 to 2) */}
                        <div style={{ gridColumn: '1 / 3' }} className="hidden lg:flex flex-col items-center gap-4 border-r border-slate-800 pr-8 mt-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>Share Article</span>
                            <button 
                                onClick={handleShareClick}
                                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24] transition-colors group cursor-pointer"
                            >
                                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>Save</span>
                            <button 
                                onClick={handleSavePost}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors group cursor-pointer ${isSaved ? 'bg-[#FBBF24] border-[#FBBF24] text-slate-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24]'}`}
                            >
                                <Bookmark className={`w-5 h-5 group-hover:scale-110 transition-transform ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Article Content (Right side, columns 3 to 11) */}
                        <article style={{ gridColumn: '3 / 11' }} className="mt-4">
                            <div className="flex items-center justify-between mb-10 pb-10 border-b border-slate-800">
                                <div className="flex items-center gap-2 text-[#FBBF24] hover:text-[#f59e0b] font-bold cursor-pointer w-fit text-xs uppercase tracking-wider" onClick={() => navigate('/blog')}>
                                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                                </div>
                                <div className="flex lg:hidden items-center gap-3">
                                    <button onClick={handleShareClick} className="p-2 bg-slate-900 text-slate-400 rounded-full border border-slate-800 cursor-pointer">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleSavePost} className={`p-2 rounded-full border cursor-pointer ${isSaved ? 'bg-[#FBBF24] border-[#FBBF24] text-slate-950' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xl md:text-2xl font-semibold text-slate-300 leading-relaxed mb-12">
                                {post.excerpt}
                            </p>

                            <div className="max-w-none">
                                {post.content.split('\n\n').map((block, i) => {
                                    if (block.startsWith('### ')) {
                                        return <h3 key={i} className="text-2xl font-black mt-10 mb-4 tracking-tight text-white uppercase">{block.replace('### ', '')}</h3>;
                                    }
                                    return <p key={i} className="text-slate-400 leading-loose mb-6 text-lg font-medium">{block}</p>;
                                })}
                            </div>

                            {/* Author Bio Footer */}
                            <div className="mt-20 p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-[#FBBF24] shadow-inner">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="font-bold text-lg text-white mb-2">Written by {post.author}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4 font-semibold">
                                        Passionate about making education accessible, engaging, and modern. Writing about tech, code, and how kids learn best.
                                    </p>
                                    <button className="text-[#FBBF24] font-bold text-xs uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer">View all posts by {post.author.split(' ')[0]}</button>
                                </div>
                            </div>
                        </article>
                    </div>

                    {renderGuides()}
                </div>
            </section>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0f1d]/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0e0e11] w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden translate-y-0 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 flex justify-between items-center border-b border-slate-800">
                            <h3 className="font-black tracking-tight text-xl text-white flex items-center gap-2 uppercase">
                                <Share2 className="w-5 h-5 text-[#FBBF24]" /> Share Post
                            </h3>
                            <button 
                                onClick={() => setIsShareModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors border-none cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <a 
                                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group decoration-none"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#1DA1F2] border border-slate-800 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Twitter className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Twitter</span>
                                </a>
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group decoration-none"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#1877F2] border border-slate-800 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Facebook className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Facebook</span>
                                </a>
                                <a 
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group decoration-none"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#0A66C2] border border-slate-800 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Linkedin className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">LinkedIn</span>
                                </a>
                                <button 
                                    onClick={copyToClipboard}
                                    className="flex flex-col items-center gap-2 group bg-transparent border-none cursor-pointer"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#FBBF24] border border-slate-800 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Link2 className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Copy</span>
                                </button>
                            </div>
                            
                            <div className="bg-[#0a0f1d] rounded-xl p-3 flex items-center gap-3 border border-slate-800">
                                <div className="text-xs font-semibold text-slate-400 truncate flex-1 pl-1 select-all">
                                    {window.location.href}
                                </div>
                                <button 
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-[#FBBF24] text-slate-950 text-xs font-bold rounded shadow-sm hover:shadow transition-shadow border-none cursor-pointer"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface BlogPostScreenProps {
    currentUser?: UserType | null;
    updateUser?: (data: Partial<UserType>) => Promise<void>;
}
