import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Facebook, Linkedin, Link2, X, Bookmark } from 'lucide-react';
import { blogPosts } from '../BlogScreen';
import { useToast } from '../ToastNotification';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { AuthPromptModal } from '../AuthPromptModal';

interface BlogPostScreenProps {
    currentUser?: UserType | null;
    updateUser?: (data: Partial<UserType>) => Promise<void>;
}

export default function BlogPostScreen({ currentUser, updateUser }: BlogPostScreenProps) {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const post = blogPosts.find(p => p.id === postId);

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
    
    // Social share links
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(post?.title || "Code for Tomorrow Blog");

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
                <h1 className="text-4xl font-black mb-4">Post Not Found</h1>
                <p className="text-slate-500 mb-8">The article you're looking for doesn't exist.</p>
                <button 
                    onClick={() => navigate('/blog')}
                    className="bg-brand-600 text-white px-6 py-3 rounded-full font-bold hover:bg-brand-500 transition-colors"
                >
                    Back to Blog
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-brand-100 selection:text-brand-900 pb-20">
            <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => navigate('/welcome')}
                    >
                        <img src="/assets/images/cofoto.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform" />
                        <span className="text-lg font-black tracking-tight uppercase hidden sm:block">Code for Tomorrow</span>
                    </div>
                    <button 
                        onClick={() => navigate('/blog')} 
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 font-bold transition-colors text-sm"
                    >
                        Read More Posts
                    </button>
                </div>
            </header>

            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[60vh] bg-slate-200 dark:bg-slate-800 relative">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="container mx-auto px-6 pb-12 pt-20">
                        <span className="inline-block bg-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm mb-6">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] max-w-4xl drop-shadow-md">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-200 text-sm font-medium">
                            <div className="flex items-center gap-2 font-bold">
                                <User className="w-4 h-4 text-brand-400" /> {post.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-400" /> {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-brand-400" /> {post.readTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 relative">
                {/* Social Share Sidebar */}
                <div className="lg:w-20 shrink-0 hidden lg:flex flex-col items-center sticky top-32 h-fit gap-4 border-r border-slate-200 dark:border-slate-800 pr-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>Share Article</span>
                    <button 
                        onClick={handleShareClick}
                        className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-500 hover:border-brand-500 transition-colors group shadow-sm"
                    >
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 mt-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>Save</span>
                    <button 
                        onClick={handleSavePost}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors group shadow-sm ${isSaved ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30 text-brand-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-500 hover:border-brand-500'}`}
                    >
                        <Bookmark className={`w-5 h-5 group-hover:scale-110 transition-transform ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Article Content */}
                <article className="max-w-3xl flex-1 mt-4">
                    <div className="flex items-center justify-between mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold cursor-pointer w-fit" onClick={() => navigate('/blog')}>
                            <ArrowLeft className="w-5 h-5" /> Back to Blog
                        </div>
                        <div className="flex lg:hidden items-center gap-3">
                            <button onClick={handleShareClick} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button onClick={handleSavePost} className={`p-2 rounded-full ${isSaved ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
                        {post.excerpt}
                    </p>

                    <div className="max-w-none">
                        {post.content.split('\n\n').map((block, i) => {
                            if (block.startsWith('### ')) {
                                return <h3 key={i} className="text-2xl font-black mt-10 mb-4 tracking-tight text-slate-900 dark:text-white">{block.replace('### ', '')}</h3>;
                            }
                            return <p key={i} className="text-slate-600 dark:text-slate-400 leading-loose mb-6 text-lg font-medium">{block}</p>;
                        })}
                    </div>

                    {/* Author Bio Footer */}
                    <div className="mt-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 shadow-inner">
                            <User className="w-8 h-8" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Written by {post.author}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                Passionate about making education accessible, engaging, and modern. Writing about tech, code, and how kids learn best.
                            </p>
                            <button className="text-brand-600 dark:text-brand-400 font-bold text-sm hover:underline">View all posts by {post.author.split(' ')[0]}</button>
                        </div>
                    </div>
                </article>
            </main>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden translate-y-0 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80">
                            <h3 className="font-black tracking-tight text-xl text-slate-900 dark:text-white flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-brand-500" /> Share Post
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
                                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#E8F5FE] dark:bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Twitter className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">Twitter</span>
                                </a>
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#EBF0F8] dark:bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Facebook className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">Facebook</span>
                                </a>
                                <a 
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#EAF3FA] dark:bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Linkedin className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">LinkedIn</span>
                                </a>
                                <button 
                                    onClick={copyToClipboard}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                        <Link2 className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">Copy</span>
                                </button>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                                <div className="text-xs font-medium text-slate-500 truncate flex-1 pl-1 select-all">
                                    {window.location.href}
                                </div>
                                <button 
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-shadow border border-slate-200 dark:border-slate-600 shrink-0"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
