import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../ToastNotification';
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
  Link
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
  milestone?: Milestone;
  likes: string[]; // User IDs
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const generateMockPosts = (): Post[] => {
  const mockAuthors: PostAuthor[] = [
    { _id: 'mock_author_1', name: 'Youssef El Amrani', profilePictureUrl: 'https://ui-avatars.com/api/?name=Youssef+El+Amrani&background=0284c7&color=fff', role: 'student', professionalTitle: 'Student Coder' },
    { _id: 'mock_author_2', name: 'Ghita Berrada', profilePictureUrl: 'https://ui-avatars.com/api/?name=Ghita+Berrada&background=10b981&color=fff', role: 'student', professionalTitle: 'Student Coder' },
    { _id: 'mock_author_3', name: 'Dr. Amina Bennani', profilePictureUrl: 'https://ui-avatars.com/api/?name=Amina+Bennani&background=8b5cf6&color=fff', role: 'teacher', professionalTitle: 'Computer Science Professor' },
    { _id: 'mock_author_4', name: 'Reda Fassi', profilePictureUrl: 'https://ui-avatars.com/api/?name=Reda+Fassi&background=f59e0b&color=fff', role: 'student', professionalTitle: 'Student Front-End Developer' },
    { _id: 'mock_author_5', name: 'Mohamed El Fassi', profilePictureUrl: 'https://ui-avatars.com/api/?name=Mohamed+El+Fassi&background=ec4899&color=fff', role: 'teacher', professionalTitle: 'Lead Scratch Mentor' },
    { _id: 'mock_author_6', name: 'Salma Benjelloun', profilePictureUrl: 'https://ui-avatars.com/api/?name=Salma+Benjelloun&background=3b82f6&color=fff', role: 'student', professionalTitle: 'Student Coder' },
    { _id: 'mock_author_7', name: 'Mehdi Tazi', profilePictureUrl: 'https://ui-avatars.com/api/?name=Mehdi+Tazi&background=ef4444&color=fff', role: 'student', professionalTitle: 'Student Python Developer' }
  ];

  const postsData = [
    {
      author: mockAuthors[0],
      content: 'Just solved the recursive Fibonacci challenge in Javascript!  It took me 2 hours, but seeing the call stack visually made it click. Next stop: Dynamic Programming!',
      milestone: {
        type: 'xp' as const,
        title: 'Reached 1200 Total XP!',
        value: 1200
      },
      likes: ['mock_author_2', 'mock_author_3'],
      comments: [
        {
          author: mockAuthors[2],
          content: 'Excellent, Youssef! Recursion is tough but fundamental. Try to think about the time complexity of the naive recursion vs memoization next.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      author: mockAuthors[1],
      content: 'Loving the Block Coding tracks!  Just built a mini maze solver script using repeat-until loops. It feels so cool to see the robot navigate automatically.',
      milestone: {
        type: 'streak' as const,
        title: 'Hit a 10-Day Streak!',
        value: 10
      },
      likes: ['mock_author_4', 'mock_author_5'],
      comments: [
        {
          author: mockAuthors[4],
          content: 'Keep up the amazing work Ghita! You are ready to start exploring Javascript soon!',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      author: mockAuthors[3],
      content: 'Hey everyone, does anyone know the difference between CSS Flexbox and Grid? When should I use one over the other? ',
      likes: ['mock_author_0', 'mock_author_6'],
      comments: [
        {
          author: mockAuthors[5],
          content: 'Grid is great for two-dimensional layouts (rows AND columns), whereas Flexbox is best for one-dimensional layouts (either rows OR columns). I usually use Flexbox for navbar items and Grid for page structure!',
          createdAt: new Date(Date.now() - 3600000 * 7).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      author: mockAuthors[4],
      content: 'Had a wonderful block programming session with the middle school class today. They built interactive storyboards using conditional events. Teaching logic is so rewarding! ',
      likes: ['mock_author_2', 'mock_author_3', 'mock_author_0'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      author: mockAuthors[5],
      content: 'Just reached Level 4 in the Web Development pathway!  Built a simple responsive personal portfolio page. Styling with CSS variables is super clean.',
      milestone: {
        type: 'level' as const,
        title: 'Reached Level 4!',
        value: 4
      },
      likes: ['mock_author_1', 'mock_author_3'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      author: mockAuthors[6],
      content: 'Python is amazing!  I just wrote a script to automate downloading my favorite music playlists. Combining logic and real-world tools is satisfying.',
      likes: ['mock_author_0', 'mock_author_4'],
      comments: [
        {
          author: mockAuthors[0],
          content: 'That sounds awesome! Are you using the pytube library?',
          createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];

  return postsData.map((post, idx) => ({
    _id: `mock_post_client_${idx}`,
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
  const [selectedMilestone, setSelectedMilestone] = useState<'none' | 'streak' | 'xp'>('none');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const localizedTexts = {
    en: {
      communityFeed: "Community Feed",
      composerPlaceholder: "What's on your mind? Share your progress or ask a question...",
      postButton: "Post to Feed",
      postingButton: "Posting...",
      milestoneLabel: "Attach Achievement",
      noMilestone: "No Milestone",
      streakMilestone: " Streak Milestone",
      xpMilestone: " XP Milestone",
      streakTitle: "Hit a {value}-Day Streak!",
      xpTitle: "Reached {value} Total XP!",
      commentsHeader: "Comments",
      writeCommentPlaceholder: "Write a comment...",
      emptyFeed: "No posts yet. Be the first to share your progress!",
      likeLabel: "Like",
      commentLabel: "Comment",
      shareLabel: "Share",
      studentRole: "Student",
      teacherRole: "Teacher",
      adminRole: "Admin",
      postedJustNow: "Just now",
      postedMinutesAgo: "{value}m ago",
      postedHoursAgo: "{value}h ago",
      errorMessage: "Something went wrong. Please try again."
    },
    fr: {
      communityFeed: "Fil Communautaire",
      composerPlaceholder: "Qu'avez-vous en tête ? Partagez vos progrès ou posez une question...",
      postButton: "Publier dans le fil",
      postingButton: "Publication...",
      milestoneLabel: "Joindre un succès",
      noMilestone: "Sans succès",
      streakMilestone: " 🔥 Succès Série",
      xpMilestone: " 🏆 Succès XP",
      streakTitle: "Série active de {value} jours !",
      xpTitle: "Atteint {value} XP au total !",
      commentsHeader: "Commentaires",
      writeCommentPlaceholder: "Écrire un commentaire...",
      emptyFeed: "Aucun post pour le moment. Soyez le premier à partager !",
      likeLabel: "J'aime",
      commentLabel: "Commenter",
      shareLabel: "Partager",
      studentRole: "Étudiant",
      teacherRole: "Enseignant",
      adminRole: "Admin",
      postedJustNow: "À l'instant",
      postedMinutesAgo: "Il y a {value}m",
      postedHoursAgo: "Il y a {value}h",
      errorMessage: "Une erreur est survenue. Veuillez réessayer."
    },
    ar: {
      communityFeed: "موجز المجتمع",
      composerPlaceholder: "ماذا يدور في ذهنك؟ شارك تقدمك أو اطرح سؤالاً...",
      postButton: "نشر في الموجز",
      postingButton: "جاري النشر...",
      milestoneLabel: "إرفاق إنجاز",
      noMilestone: "بدون إنجاز",
      streakMilestone: " 🔥 إنجاز الحماس",
      xpMilestone: " 🏆 إنجاز نقاط الخبرة",
      streakTitle: "حماس يومي متواصل لمدة {value} أيام!",
      xpTitle: "الوصول إلى {value} نقطة خبرة إجمالية!",
      commentsHeader: "التعليقات",
      writeCommentPlaceholder: "اكتب تعليقًا...",
      emptyFeed: "لا توجد منشورات بعد. كن أول من يشارك تقدمه!",
      likeLabel: "إعجاب",
      commentLabel: "تعليق",
      shareLabel: "مشاركة",
      studentRole: "طالب",
      teacherRole: "معلم",
      adminRole: "مدير",
      postedJustNow: "الآن",
      postedMinutesAgo: "منذ {value} د",
      postedHoursAgo: "منذ {value} س",
      errorMessage: "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    }
  };

  const texts = localizedTexts[language as 'en' | 'fr' | 'ar'] || localizedTexts.en;

  const userStreak = currentUser.progress?.streak || 0;
  const userXp = currentUser.progress?.xp || 0;

  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleSharePost = async (post: Post) => {
    const shareUrl = `${window.location.origin}/dashboard?post=${post._id}`;
    const shareText = `Check out this post by ${post.author.name} on Code for Tomorrow: "${post.content.slice(0, 100)}..."`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Code for Tomorrow - Post by ${post.author.name}`,
          text: shareText,
          url: shareUrl,
        });
        showToast('Post shared successfully! 🚀', 'success');
        return;
      } catch (err) {
        // Fallback to custom modal if user closed or native share cancelled
      }
    }
    
    setShareModalPost(post);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Post link copied to clipboard! 📋', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySinglePostLink = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/dashboard?post=${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedPostId(postId);
    showToast('Post permalink copied to clipboard! 🔗', 'success');
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getPosts();
      const mockPosts = generateMockPosts();
      
      // Merge backend posts and frontend mock posts, sorting by newest first
      const allPosts = [...data, ...mockPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts(generateMockPosts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetPostId = params.get('post');
    if (targetPostId && posts.length > 0) {
      setHighlightedPostId(targetPostId);
      setTimeout(() => {
        const elem = document.getElementById(`post-card-${targetPostId}`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }
  }, [posts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      let milestone: Milestone | undefined;
      
      if (selectedMilestone === 'streak' && userStreak > 0) {
        milestone = {
          type: 'streak',
          title: texts.streakTitle.replace('{value}', userStreak.toString()),
          value: userStreak
        };
      } else if (selectedMilestone === 'xp' && userXp > 0) {
        milestone = {
          type: 'xp',
          title: texts.xpTitle.replace('{value}', userXp.toString()),
          value: userXp
        };
      }

      const newPost = await api.createPost(content, milestone);
      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setSelectedMilestone('none');
      showToast('Post shared with the community! ', 'success');
    } catch (error) {
      console.error('Failed to create post:', error);
      showToast(texts.errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const result = await api.likePost(postId);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, likes: result.likes };
        }
        return p;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      const updatedComments = await api.commentPost(postId, commentText);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Failed to comment on post:', error);
      showToast(texts.errorMessage, 'error');
    }
  };

  const toggleComments = (postId: string) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
    } else {
      setActiveCommentsPostId(postId);
    }
  };

  const formatPostDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / (1000 * 60));
    const diffHr = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffMin < 1) return texts.postedJustNow;
    if (diffMin < 60) return texts.postedMinutesAgo.replace('{value}', diffMin.toString());
    if (diffHr < 24) return texts.postedHoursAgo.replace('{value}', diffHr.toString());
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher': return texts.teacherRole;
      case 'admin': return texts.adminRole;
      default: return texts.studentRole;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20';
      case 'teacher':
        return 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20';
      default:
        return 'bg-[#FBBF24]/10 text-amber-500 dark:bg-[#FBBF24]/20 text-[#FBBF24]';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Share2 className="w-8 h-8 text-[#FBBF24] animate-pulse" />
            <span>{texts.communityFeed}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Connect with classmates, share achievements, and support each other's progress.
          </p>
        </div>
      </div>

      {/* Post Composer Box */}
      <form onSubmit={handleCreatePost} className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-lg shadow-slate-100/50 dark:shadow-none transition-all duration-300">
        <div className="flex gap-4">
          <img 
            src={currentUser.profilePictureUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)} 
            alt={currentUser.name} 
            className="w-11 h-11 rounded-full object-cover border-2 border-[#FBBF24] shadow-sm shrink-0"
          />
          <div className="flex-1 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={texts.composerPlaceholder}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-all font-semibold resize-none"
            />

            {/* Achievement / Milestone Attachment Drawer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500">{texts.milestoneLabel}:</span>
                <div className="relative inline-flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-350 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <select 
                    value={selectedMilestone}
                    onChange={(e) => setSelectedMilestone(e.target.value as any)}
                    className="appearance-none bg-transparent pr-6 focus:outline-none font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="none" className="bg-white dark:bg-slate-800">{texts.noMilestone}</option>
                    {userStreak > 0 && <option value="streak" className="bg-white dark:bg-slate-800">{texts.streakMilestone} ({userStreak}d)</option>}
                    {userXp > 0 && <option value="xp" className="bg-white dark:bg-slate-800">{texts.xpMilestone} ({userXp} XP)</option>}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2 pointer-events-none text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md ${
                  content.trim() 
                    ? 'bg-[#111827] text-white dark:bg-[#FBBF24] dark:text-slate-900 hover:shadow-lg' 
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-700/40 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? texts.postingButton : texts.postButton}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Timeline Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 animate-pulse space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="w-28 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-750 rounded" />
                </div>
              </div>
              <div className="w-full h-16 bg-slate-100 dark:bg-slate-750 rounded-xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-10 text-center shadow-lg">
          <Zap className="w-12 h-12 text-[#FBBF24] mx-auto mb-4 animate-bounce" />
          <p className="font-extrabold text-slate-800 dark:text-white text-lg">{texts.emptyFeed}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {highlightedPostId && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span>Viewing Shared Post via Permalink</span>
              </div>
              <button
                onClick={() => {
                  setHighlightedPostId(null);
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors cursor-pointer text-[11px]"
              >
                View All Posts
              </button>
            </div>
          )}

          {posts.map((post) => {
            const hasLiked = post.likes.includes(currentUser._id);
            const isCommentsOpen = activeCommentsPostId === post._id;
            const isHighlighted = post._id === highlightedPostId;

            return (
              <div 
                id={`post-card-${post._id}`}
                key={post._id} 
                className={`bg-white dark:bg-slate-800 border rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-slate-150/40 dark:hover:shadow-none overflow-hidden ${
                  isHighlighted 
                    ? 'border-amber-400 dark:border-amber-400 ring-2 ring-amber-400/80 shadow-2xl scale-[1.01] bg-amber-50/20 dark:bg-amber-950/10' 
                    : 'border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {/* Post Header */}
                <div className="p-5 flex justify-between items-start">
                  <div className="flex gap-3.5">
                    <img 
                      src={post.author.profilePictureUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name)} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-250 dark:border-slate-650 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-850 dark:text-white text-sm leading-none hover:underline cursor-pointer">
                          {post.author.name}
                        </h4>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getRoleBadgeStyle(post.author.role)}`}>
                          {getRoleLabel(post.author.role)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 leading-none">
                        {post.author.professionalTitle || (post.author.role === 'teacher' ? 'Educator' : 'Student')} • {formatPostDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Permalink Link Button */}
                  <button
                    onClick={(e) => handleCopySinglePostLink(e, post._id)}
                    title="Copy direct post link"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-[#FBBF24] dark:hover:text-[#FBBF24] transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer shrink-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    {copiedPostId === post._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-extrabold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Post Body Content */}
                <div className="px-5 pb-4 space-y-4">
                  <p className="text-sm text-slate-750 dark:text-slate-200 font-semibold leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Milestone Card Attachment */}
                  {post.milestone && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-slate-750 dark:to-slate-800 border border-amber-200/60 dark:border-slate-700/80 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group shadow-sm">
                      <div className="absolute right-2 -bottom-4 opacity-10 dark:opacity-5 transform rotate-12 scale-150 transition-transform duration-500 group-hover:rotate-6">
                        {post.milestone.type === 'streak' ? (
                          <Flame className="w-20 h-20 text-orange-500 fill-current" />
                        ) : (
                          <Trophy className="w-20 h-20 text-amber-500" />
                        )}
                      </div>
                      
                      <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 dark:bg-[#FBBF24]/20 flex items-center justify-center shrink-0 border border-amber-300/30">
                        {post.milestone.type === 'streak' ? (
                          <Flame className="w-5 h-5 text-orange-500 fill-current" />
                        ) : (
                          <Trophy className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-[#FBBF24]">Milestone Unlocked</span>
                        <h5 className="font-extrabold text-slate-800 dark:text-white text-xs mt-0.5 truncate">{post.milestone.title}</h5>
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Interaction Actions Bar */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-750 flex items-center gap-6 text-slate-550 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/10">
                  <button 
                    onClick={() => handleLikePost(post._id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                      hasLiked 
                        ? 'text-red-500 font-extrabold' 
                        : 'hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform duration-300 ${hasLiked ? 'fill-current scale-110' : ''}`} />
                    <span>{post.likes.length} {texts.likeLabel}</span>
                  </button>

                  <button 
                    onClick={() => toggleComments(post._id)}
                    className={`flex items-center gap-1.5 text-xs font-bold hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer ${
                      isCommentsOpen ? 'text-[#FBBF24] dark:text-[#FBBF24] font-extrabold' : ''
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} {texts.commentLabel}</span>
                  </button>

                  <button 
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-1.5 text-xs font-bold hover:text-[#FBBF24] dark:hover:text-[#FBBF24] transition-colors cursor-pointer ml-auto"
                  >
                    <Share2 className="w-4 h-4 text-slate-400 group-hover:text-[#FBBF24]" />
                    <span>{texts.shareLabel}</span>
                  </button>
                </div>

                {/* Expandable Comments Section */}
                {isCommentsOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900/10 p-5 space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      {texts.commentsHeader} ({post.comments.length})
                    </h5>

                    {/* Comments List */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-750/50">
                        {post.comments.map((comment, cIndex) => (
                          <div key={comment._id || cIndex} className={`flex gap-3 pt-3 ${cIndex === 0 ? 'pt-0' : ''}`}>
                            <img 
                              src={comment.author.profilePictureUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author.name)} 
                              alt={comment.author.name} 
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="flex-1 min-w-0 bg-white dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/60 rounded-xl px-3 py-2 shadow-sm">
                              <div className="flex justify-between items-baseline gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-xs text-slate-850 dark:text-white hover:underline cursor-pointer">{comment.author.name}</span>
                                  <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-450 scale-90">
                                    {getRoleLabel(comment.author.role)}
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold shrink-0">{formatPostDate(comment.createdAt)}</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-350 font-semibold leading-relaxed mt-1">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Composer Input */}
                    <div className="flex gap-3 pt-2">
                      <img 
                        src={currentUser.profilePictureUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)} 
                        alt={currentUser.name} 
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-grow flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post._id);
                          }}
                          placeholder={texts.writeCommentPlaceholder}
                          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-xl px-4 py-2 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition-all font-semibold"
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          disabled={!commentInputs[post._id]?.trim()}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                            commentInputs[post._id]?.trim()
                              ? 'bg-[#111827] text-white dark:bg-[#FBBF24] dark:text-slate-900 hover:scale-105 shadow-sm'
                              : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-650 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SHARE POST MODAL */}
      {shareModalPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Share Post</h4>
              </div>
              <button
                onClick={() => setShareModalPost(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Preview Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={shareModalPost.author.profilePictureUrl}
                  alt={shareModalPost.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white">{shareModalPost.author.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-3 italic">
                "{shareModalPost.content}"
              </p>
            </div>

            {/* Social Share Grid */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${shareModalPost.author.name}'s post on Code for Tomorrow: "${shareModalPost.content.slice(0, 100)}" ${window.location.origin}/dashboard?post=${shareModalPost._id}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-900/50"
              >
                <span className="text-base font-black">💬</span>
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${shareModalPost.author.name}'s post on Code for Tomorrow!`)}&url=${encodeURIComponent(`${window.location.origin}/dashboard?post=${shareModalPost._id}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl hover:scale-105 transition-transform flex flex-col items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <span className="text-base font-black">𝕏</span>
                <span>Twitter/X</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/dashboard?post=${shareModalPost._id}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center gap-1.5 border border-blue-200/60 dark:border-blue-900/50"
              >
                <span className="text-base font-black">💼</span>
                <span>LinkedIn</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/dashboard?post=${shareModalPost._id}`)}&text=${encodeURIComponent(`Check out ${shareModalPost.author.name}'s post on Code for Tomorrow!`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center gap-1.5 border border-sky-200/60 dark:border-sky-900/50"
              >
                <span className="text-base font-black">✈️</span>
                <span>Telegram</span>
              </a>
            </div>

            {/* Direct Copy Link Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Direct Post Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/dashboard?post=${shareModalPost._id}`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
                <button
                  onClick={() => handleCopyLink(`${window.location.origin}/dashboard?post=${shareModalPost._id}`)}
                  className="px-4 py-2.5 bg-[#FBBF24] hover:bg-[#f59e0b] text-[#111827] font-black rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeedScreen;
