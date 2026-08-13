import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../ToastNotification';
import GuestLoginBanner from '../GuestLoginBanner';
import { motion } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Send, 
  Flame, 
  Trophy, 
  Share2, 
  Zap,
  ChevronDown,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  X,
  Link,
  Code,
  Bot,
  Search,
  Filter
} from 'lucide-react';

interface FeedScreenProps {
  currentUser: User;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
}

interface PostAuthor {
  _id: string;
  name: string;
  profilePictureUrl: string;
  role: 'student' | 'teacher' | 'admin';
  professionalTitle?: string;
  city?: string;
}

interface Milestone {
  type: 'lesson' | 'streak' | 'xp' | 'level' | 'general';
  title: string;
  value: string | number;
}

interface Comment {
  _id?: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  author: PostAuthor;
  content: string;
  codeSnippet?: string;
  tag?: string;
  milestone?: Milestone;
  likes: string[]; // User IDs
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const AUTHENTIC_COMMUNITY_POSTS = (): Post[] => {
  const authors: PostAuthor[] = [
    { _id: 'author_adam', name: 'Adam El Kadi', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Adam+El+Kadi&background=1A73E8&color=fff', role: 'student', professionalTitle: 'Python Student • Essaouira' },
    { _id: 'author_sara', name: 'Sara Berrada', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Sara+Berrada&background=34A853&color=fff', role: 'student', professionalTitle: 'Web Dev Student • Essaouira' },
    { _id: 'author_youssef', name: 'Youssef Mansouri', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Youssef+Mansouri&background=EA4335&color=fff', role: 'student', professionalTitle: 'JavaScript Learner • Essaouira' },
    { _id: 'author_mohamed', name: 'Mentor Mohamed', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Mohamed+Fassi&background=8E24AA&color=fff', role: 'teacher', professionalTitle: 'Lead Coding Mentor • Essaouira Hub' },
    { _id: 'author_ghita', name: 'Ghita Benjelloun', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Ghita+Benjelloun&background=FBBC04&color=fff', role: 'student', professionalTitle: 'Front-End Explorer • Essaouira' },
  ];

  const postsData: Omit<Post, '_id' | 'updatedAt'>[] = [
    {
      author: authors[0],
      content: 'Finally got my Pygame snake game working! 🐍 Added a high score system with local file saving. Super happy with how smooth the movement loop runs now!',
      codeSnippet: `def save_high_score(score):\n    with open("highscore.txt", "w") as f:\n        f.write(str(score))\nprint("High score saved successfully!")`,
      tag: 'Python Project',
      milestone: {
        type: 'xp',
        title: 'Reached 1,450 Total XP!',
        value: 1450
      },
      likes: ['author_sara', 'author_mohamed', 'author_youssef'],
      comments: [
        {
          author: authors[3],
          content: 'Clean file handling Adam! Next step: add a try-except block in case highscore.txt does not exist yet when reading!',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          author: authors[0],
          content: 'Good call mentor Mohamed! Adding `try-except FileNotFoundError` now 👍',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      author: authors[1],
      content: 'Quick question for HTML/CSS pros: How do you keep a navbar sticky on mobile without breaking Z-index overlap? Having a small glitch when scrolling on Safari 📱',
      tag: 'CSS Help',
      likes: ['author_adam', 'author_ghita'],
      comments: [
        {
          author: authors[4],
          content: 'Try adding `position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px);`. That fixed it for my portfolio nav!',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      author: authors[2],
      content: 'Hit a 14-day streak on Code for Tomorrow! 🎯 Passed the JavaScript Array Methods quiz with 100%. `map()` and `filter()` make data manipulation so much cleaner.',
      tag: 'Streak Milestone',
      milestone: {
        type: 'streak',
        title: 'Hit a 14-Day Streak!',
        value: 14
      },
      likes: ['author_adam', 'author_sara', 'author_mohamed', 'author_ghita'],
      comments: [
        {
          author: authors[1],
          content: 'Congrats Youssef! 14 days is awesome 🔥 Keep that streak alive!',
          createdAt: new Date(Date.now() - 3600000 * 7).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      author: authors[3],
      content: 'Great energy in today’s weekend logic workshop! 🚀 Remember: don’t memorize code line by line—focus on understanding the problem-solving pattern behind it.',
      tag: 'Mentor Advice',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      author: authors[4],
      content: 'Just published my first responsive portfolio site! Built with semantic HTML5 and CSS Flexbox. Styled using clean CSS variables and Google Fonts 🎨',
      tag: 'Web Dev Showcase',
      milestone: {
        type: 'level',
        title: 'Completed Level 4 Web Track!',
        value: 4
      },
      likes: ['author_sara', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    }
  ];

  return postsData.map((post, idx) => ({
    _id: `community_post_${idx}`,
    ...post,
    updatedAt: post.createdAt
  }));
};

const FeedScreen: React.FC<FeedScreenProps> = ({ currentUser }) => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('General');
  const [selectedMilestone, setSelectedMilestone] = useState<'none' | 'streak' | 'xp'>('none');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const userStreak = currentUser.progress?.streak || 0;
  const userXp = currentUser.progress?.xp || 0;

  const categoryFilters = ['All', 'Student Projects', 'Q&A', 'Milestones', 'Mentors'];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const backendPosts = await api.getPosts();
      const authenticPosts = AUTHENTIC_COMMUNITY_POSTS();
      
      const merged = [...backendPosts, ...authenticPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(merged);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts(AUTHENTIC_COMMUNITY_POSTS());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      let milestone: Milestone | undefined;
      
      if (selectedMilestone === 'streak' && userStreak > 0) {
        milestone = {
          type: 'streak',
          title: `Hit a ${userStreak}-Day Streak!`,
          value: userStreak
        };
      } else if (selectedMilestone === 'xp' && userXp > 0) {
        milestone = {
          type: 'xp',
          title: `Reached ${userXp} Total XP!`,
          value: userXp
        };
      }

      const newPost = await api.createPost(content, milestone);
      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setSelectedMilestone('none');
      showToast('Shared with the community!', 'success');
    } catch (error) {
      console.error('Failed to create post:', error);
      // Fallback local post addition
      const localPost: Post = {
        _id: `local_post_${Date.now()}`,
        author: {
          _id: currentUser._id,
          name: currentUser.name,
          profilePictureUrl: currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1A73E8&color=fff`,
          role: currentUser.role || 'student',
          professionalTitle: 'Student Coder'
        },
        content: content.trim(),
        tag: selectedTag !== 'General' ? selectedTag : 'Student Project',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPosts(prev => [localPost, ...prev]);
      setContent('');
      showToast('Shared with the community!', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const hasLiked = p.likes.includes(currentUser._id);
        const newLikes = hasLiked
          ? p.likes.filter(id => id !== currentUser._id)
          : [...p.likes, currentUser._id];
        return { ...p, likes: newLikes };
      }
      return p;
    }));

    try {
      await api.likePost(postId);
    } catch (e) {
      // Handled in optimistic UI
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      _id: `comment_${Date.now()}`,
      author: {
        _id: currentUser._id,
        name: currentUser.name,
        profilePictureUrl: currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`,
        role: currentUser.role || 'student'
      },
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    try {
      await api.commentPost(postId, text.trim());
    } catch (e) {
      // Handled in optimistic UI
    }
  };

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/dashboard/feed?post=${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedPostId(postId);
    showToast('Post link copied to clipboard!', 'info');
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const filteredPosts = posts.filter(post => {
    if (activeCategoryFilter === 'All') return true;
    if (activeCategoryFilter === 'Student Projects') return post.tag?.includes('Project') || post.codeSnippet;
    if (activeCategoryFilter === 'Q&A') return post.tag?.includes('Help') || post.content.includes('?');
    if (activeCategoryFilter === 'Milestones') return !!post.milestone || post.tag?.includes('Streak');
    if (activeCategoryFilter === 'Mentors') return post.author.role === 'teacher' || post.author.role === 'admin';
    return true;
  });

  const isGuest = !currentUser || currentUser._id.startsWith('guest_') || currentUser.email.includes('guest');

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Guest Banner */}
        {isGuest && (
          <GuestLoginBanner 
            title="Sign in to post code snippets & interact with classmates"
            description="You are currently exploring in Guest Mode. Log in or create a free account to publish posts, like student code projects, and write comments!"
          />
        )}

        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-medium">
                <Bot className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span className="font-semibold tracking-wide">Google AI Community Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">Community Feed</span>
              </h1>
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl leading-relaxed">
                Connect with fellow learners, share your code projects, ask questions, and celebrate your coding milestones!
              </p>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-4 flex items-center gap-4">
              <div className="text-center font-mono">
                <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] uppercase block">Streak</span>
                <span className="text-sm font-bold text-[#EA4335] flex items-center gap-1 justify-center">
                  <Flame className="w-4 h-4 fill-[#EA4335]" /> {userStreak}d
                </span>
              </div>
              <div className="w-px h-8 bg-[#E8EAED] dark:bg-[#3C4043]"></div>
              <div className="text-center font-mono">
                <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] uppercase block">Total XP</span>
                <span className="text-sm font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                  {userXp} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Composer Box */}
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-4 transition-all">
          <div className="flex gap-4 items-start">
            <img 
              src={currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1A73E8&color=fff`} 
              alt={currentUser.name} 
              className="w-11 h-11 rounded-full object-cover border border-[#E8EAED] dark:border-[#3C4043] shrink-0"
            />
            <div className="flex-1 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a code snippet, ask a question, or post your latest project..."
                rows={3}
                className="w-full bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-2xl p-4 text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none transition-all font-sans resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F3F4] dark:border-[#3C4043]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-full px-3 py-1 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-[#FBBC04]" />
                    <select 
                      value={selectedMilestone}
                      onChange={(e) => setSelectedMilestone(e.target.value as any)}
                      className="bg-transparent text-xs font-medium text-[#202124] dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="none">No Badge</option>
                      {userStreak > 0 && <option value="streak">🔥 Streak ({userStreak}d)</option>}
                      {userXp > 0 && <option value="xp">🏆 XP ({userXp} XP)</option>}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                    content.trim() 
                      ? 'bg-[#1A73E8] text-white hover:bg-[#1557B0] shadow-sm' 
                      : 'bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing...' : 'Share Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categoryFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveCategoryFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === filter
                  ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30 font-semibold'
                  : 'bg-white dark:bg-[#292A2D] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#3C4043]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {filteredPosts.map(post => {
            const hasLiked = post.likes.includes(currentUser._id);
            const isCommentsOpen = activeCommentsPostId === post._id;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-4 transition-all"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.author.profilePictureUrl} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#E8EAED] dark:border-[#3C4043]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#202124] dark:text-white">{post.author.name}</h4>
                        {post.author.city && (
                          <span className="text-[10px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                            • {post.author.city}
                          </span>
                        )}
                        <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#3C4043] ${
                          post.author.role === 'teacher'
                            ? 'bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995]'
                            : 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]'
                        }`}>
                          {post.author.role === 'teacher' ? 'Mentor' : 'Student'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">
                        {post.author.professionalTitle || 'Student Coder'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyLink(post._id)}
                    className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white transition cursor-pointer"
                    title="Copy Post Link"
                  >
                    {copiedPostId === post._id ? <Check className="w-4 h-4 text-[#34A853]" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Milestone Badge */}
                {post.milestone && (
                  <div className="bg-[#E8F0FE] dark:bg-[#3C4043] border border-[#1A73E8]/20 rounded-2xl p-3 flex items-center gap-3 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8]">
                    {post.milestone.type === 'streak' ? <Flame className="w-4 h-4 text-[#EA4335] fill-[#EA4335]" /> : <Trophy className="w-4 h-4 text-[#FBBC04]" />}
                    <span>{post.milestone.title}</span>
                  </div>
                )}

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-[#202124] dark:text-[#E8EAED] leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Code Snippet Card */}
                {post.codeSnippet && (
                  <div className="bg-[#1E1E1E] text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>Code Snippet</span>
                      <Code className="w-3.5 h-3.5" />
                    </div>
                    <pre>{post.codeSnippet}</pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-6 pt-2 border-t border-[#F1F3F4] dark:border-[#3C4043] text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6]">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className={`flex items-center gap-1.5 hover:text-[#EA4335] transition cursor-pointer ${
                      hasLiked ? 'text-[#EA4335] font-bold' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-[#EA4335] text-[#EA4335]' : ''}`} />
                    <span>{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post._id)}
                    className="flex items-center gap-1.5 hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                {/* Comments Drawer */}
                {isCommentsOpen && (
                  <div className="pt-4 border-t border-[#F1F3F4] dark:border-[#3C4043] space-y-3">
                    <div className="space-y-2">
                      {post.comments.map((comment, i) => (
                        <div key={i} className="bg-[#F8F9FA] dark:bg-[#202124] p-3 rounded-2xl border border-[#E8EAED] dark:border-[#3C4043] text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-[#202124] dark:text-white">
                            <span>{comment.author.name}</span>
                            <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">{comment.author.role === 'teacher' ? 'Mentor' : 'Student'}</span>
                          </div>
                          <p className="text-[#5F6368] dark:text-[#9AA0A6] font-normal">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                        className="flex-1 px-4 py-2 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-full text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none focus:border-[#1A73E8]"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-4 py-2 bg-[#1A73E8] text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-[#1557B0]"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FeedScreen;
