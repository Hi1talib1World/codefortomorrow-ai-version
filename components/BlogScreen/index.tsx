import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ChevronRight, Bookmark, Menu, X, Share2, Link, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../ToastNotification';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { AuthPromptModal } from '../AuthPromptModal';

export const blogPosts = [
    {
        id: "1",
        title: "Why Kids Should Learn to Code in 2026",
        excerpt: "Coding is the new literacy. Discover how early exposure to computational thinking gives children a massive advantage in any career path.",
        content: "Coding is no longer just for software engineers—it’s an essential skill for the future. By learning to code early, children develop computational thinking, problem-solving skills, and a deeper understanding of the technology they use every day. In this article, we explore how platforms like Code for Tomorrow are making these essential skills accessible, fun, and engaging for all ages.\n\n### The New Literacy\nJust like reading and writing, coding is a fundamental language of the modern world. Exposure to programming at a young age helps build a foundation of logic and sequencing that applies to nearly every industry—from medicine to design.\n\n### Preparing for the Future\nAccording to recent studies, 65% of children entering primary school today will ultimately end up working in completely new job types that don't yet exist. Empowering them with technical literacy now prepares them to be creators, not just consumers.",
        author: "Hicham Outaleb",
        date: "April 9, 2026",
        category: "Education",
        readTime: "5 min read",
        image: "/assets/images/blog_kids_coding.jpg"
    },
    {
        id: "2",
        title: "The Power of Gamified Learning",
        excerpt: "Explore the psychology behind why gamification works and how turning lessons into quests boosts retention and engagement by over 300%.",
        content: "Learning shouldn't be boring. By integrating game mechanics into educational content, we can tap into the natural human desire for achievement, competition, and discovery. Gamification isn't just about adding points; it's about shifting the learning experience from passive absorption to active participation.\n\n### Why it Works\nGamification leverages the brain's reward system. Earning badges, completing levels, and seeing progress visualised provides positive reinforcement. This triggers dopamine releases, keeping students motivated and eager to tackle harder challenges.\n\n### Improved Retention\nStudies show that gamified learning can increase material retention by up to 300%. When students are immersed in a narrative or a quest, they learn by doing, which solidifies concepts much more effectively than traditional lectures.",
        author: "Code for Tomorrow Team",
        date: "April 5, 2026",
        category: "Platform Updates",
        readTime: "4 min read",
        image: "/assets/images/blog_gamified_learning.jpg"
    },
    {
        id: "3",
        title: "Introducing the New Mentorship Feature",
        excerpt: "We're thrilled to announce our latest mentorship feature that adapts to your child's learning pace and provides real-time guidance.",
        content: "Everyone learns at their own pace. That's why we're excited to introduce the Mentorship feature, a revolutionary addition built directly into our learning platform. This intelligent assistant monitors progress, identifies areas where a student might be struggling, and provides personalized guidance and support.\n\n### Tailored Feedback\nInstead of simply giving the answer, the mentor acts like a real teacher. It analyzes the student's code in real-time and asks leading questions to help them arrive at the solution independently.\n\n### Always Available\nNo more waiting for office hours or getting stuck for hours. The mentor is available 24/7, providing a supportive safety net that empowers students to take risks, make mistakes, and learn from them without frustration.",
        author: "Product Team",
        date: "March 28, 2026",
        category: "New Features",
        readTime: "3 min read",
        image: "/assets/images/blog_ai_mentorship.jpg"
    },
    {
        id: "4",
        title: "5 Fun Ways to Teach Loop Concepts",
        excerpt: "Loops can be tricky for young beginners. Here are five fun, interactive physical activities that teach 'for' and 'while' loops without a screen.",
        content: "Before typing `for (let i = 0; i < 5; i++)`, kids need to understand what a loop actually is. By taking the concept offline into the physical world, abstract ideas become tangible and fun!\n\n### The Dance Routine Loop\nCreate a sequence of dance moves and tell the kids to \"loop\" it 3 times. This teaches a `for` loop (a set number of iterations). \n\n### Musical Chairs While Loop\nPlay a game of musical chairs! Instruct the kids: \"While the music is playing, walk around the chairs.\" This perfectly demonstrates a `while` loop, where an action continues as long as a condition is true.",
        author: "Aisha K.",
        date: "March 15, 2026",
        category: "Teaching Tips",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "5",
        title: "From Blocks to Python: The Transition Phase",
        excerpt: "Transitioning from drag-and-drop programming to text-based code is a major milestone. Here's how to ensure a smooth transition.",
        content: "Block-based coding like Scratch is a fantastic introduction to logic. However, transitioning to a syntax-heavy language like Python can leave students feeling lost. \n\n### Focus on Logic, Not Syntax First\nStart by showing them that the logic hasn't changed—only the \"language\" has. A `Repeat` block is just a `for` loop. An `If/Then` block is just an `if` statement. Drawing these direct parallels reduces anxiety and builds confidence.\n\n### Embrace the Errors\nSyntax errors are inevitable. Teach students that bugs aren't failures; they are puzzles waiting to be solved. Our platform's syntax highlighter is specifically designed to catch these early to make the transition painless.",
        author: "Karim M.",
        date: "February 22, 2026",
        category: "Curriculum",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "6",
        title: "How to Build an App in One Weekend",
        excerpt: "Think building a complete app takes months? With the right tools and mindset, your child can build and deploy their first app this weekend.",
        content: "There is nothing more empowering for a child than showing their friends an app *they* built on their own phone. While complex apps take time, simple and fun apps can be built in a single weekend!\n\n### Day 1: Design & Logic\nSpend Saturday mapping out what the app does. Is it a soundboard? A simple calculator? A random joke generator? Use pen and paper to draw the screens. \n\n### Day 2: Code & Deploy\nSpend Sunday putting the blocks together or writing the JavaScript. With tools like our Web Developer path, kids can instantly deploy their creations to a live link they can text to family members.",
        author: "Code for Tomorrow Team",
        date: "February 10, 2026",
        category: "Project Guides",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "7",
        title: "Understanding Object Oriented Programming",
        excerpt: "OOP sounds scary, but it's just a way of organizing code to mimic the real world. Here’s a simple explanation for kids.",
        content: "Object-Oriented Programming (OOP) is a core concept in languages like Python and Java. But how do you explain it to a 10-year-old? \n\n### Think About a Car\nImagine a generic 'Car'. It has properties (color, number of doors, top speed) and things it can do (drive, honk, brake). In code, this blueprint is called a `Class`.\n\n### Building Specific Cars\nWhen you build a specific car from that blueprint—like a red Ferrari or a blue minivan—you are creating an `Object`. By teaching kids how to group variables (properties) and functions (methods) into Objects, they learn how to build complex, scalable games and tools.",
        author: "Jawad",
        date: "January 28, 2026",
        category: "Education",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "8",
        title: "Celebrating Women in Tech",
        excerpt: "From Ada Lovelace to modern software engineers, women have always been at the forefront of computer science. Let's celebrate their achievements.",
        content: "It's a historical fact that the first programmer in the world was a woman: Ada Lovelace! Despite this, the tech industry has historically faced a gender gap. \n\n### The Grace Hopper Legacy\nDid you know the term \"debugging\" comes from Admiral Grace Hopper literally pulling a dead moth out of an early computer relay? \n\n### Encouraging Girls in STEM\nAt Code for Tomorrow, we are dedicated to closing the gender gap. We've introduced special avatars, inclusive project prompts, and female mentorship AI voices to ensure that every girl feels like a natural part of the tech ecosystem.",
        author: "Community Team",
        date: "January 15, 2026",
        category: "Community",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "9",
        title: "Debugging: The Most Important Skill",
        excerpt: "Writing code is easy. Figuring out why it doesn't work is hard. Here is how we teach kids the art of debugging.",
        content: "Every programmer knows the feeling: you run your perfectly logical code, and nothing happens—or worse, everything breaks. Debugging is arguably more important than writing the code itself.\n\n### The Rubber Duck Method\nWe teach our students the famous \"Rubber Duck\" debugging method. If you're stuck, explain your code line-by-line out loud to a rubber duck (or our mascot!). Often, just vocalizing the logic helps you catch the mistake.\n\n### Reading Error Messages\nError messages look scary, but they are just the computer trying to help. We gamify error reading so kids view errors as clues in a detective game rather than red marks on a test.",
        author: "Hicham Outaleb",
        date: "January 2, 2026",
        category: "Education",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
    }
];

interface BlogScreenProps {
    currentUser?: UserType | null;
    updateUser?: (data: Partial<UserType>) => Promise<void>;
}

export default function BlogScreen({ currentUser, updateUser }: BlogScreenProps) {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [gridOn, setGridOn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copiedBlogPostId, setCopiedBlogPostId] = useState<string | null>(null);

    const handleShareBlogPost = async (e: React.MouseEvent, post: typeof blogPosts[0]) => {
        e.stopPropagation();
        const postUrl = `${window.location.origin}/blog/${post.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: postUrl,
                });
                showToast('Blog post link shared! 🚀', 'success');
                return;
            } catch (err) {}
        }
        navigator.clipboard.writeText(postUrl);
        setCopiedBlogPostId(post.id);
        showToast('Blog post permalink copied to clipboard! 🔗', 'success');
        setTimeout(() => setCopiedBlogPostId(null), 2500);
    };

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

    const handleSavePost = async (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        if (!currentUser || currentUser._id.startsWith('guest_')) {
            setIsAuthModalOpen(true);
            return;
        }
        
        try {
            const updatedUser = await api.toggleSaveItem(postId, 'post');
            if (updateUser) {
                await updateUser(updatedUser);
            }
        } catch (error) {
            console.error('Failed to save post:', error);
        }
    };

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
        <div className="min-h-screen bg-[#0a0f1d] font-sans text-white selection:bg-[#FBBF24]/30 selection:text-white muller-grid-root">
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

            <section className="spread pt-16">
                <div className="wrap">
                    <div className="muller-grid">
                        
                        {/* Title Band */}
                        <div className="band mb-16">
                            <div style={{ gridColumn: '1 / 13' }}>
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="flex items-center gap-2 text-slate-450 hover:text-[#FBBF24] font-bold mb-8 transition-colors text-xs uppercase tracking-wider bg-transparent border-none cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <span className="mono-label opt-align">CFT PUBLICATION</span>
                                <h1 className="masthead opt-align mt-2">Our Blog</h1>
                                <p className="text-slate-400 text-base font-semibold mt-4 max-w-2xl leading-relaxed">
                                    News, updates, and educational insights from the Code for Tomorrow team.
                                </p>
                            </div>
                        </div>

                        {/* Cards Band */}
                        <div className="band">
                            {blogPosts.map((post, i) => {
                                // Design asymmetrical column placements based on index
                                const colSpanMap = [
                                    '1 / 5',   // Item 1
                                    '5 / 9',   // Item 2
                                    '9 / 13',  // Item 3
                                    '1 / 7',   // Item 4 (wider grid span)
                                    '7 / 13',  // Item 5 (wider grid span)
                                    '1 / 5',   // Item 6
                                    '5 / 9',   // Item 7
                                    '9 / 13',  // Item 8
                                    '1 / 13'   // Item 9 (hero focus span)
                                ];
                                const colSpan = colSpanMap[i % colSpanMap.length];

                                return (
                                    <div 
                                        key={post.id} 
                                        onClick={() => navigate(`/blog/${post.id}`)}
                                        style={{ gridColumn: colSpan }}
                                        className="pill-card rounded-[2rem] overflow-hidden group flex flex-col cursor-pointer"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-slate-900 border-b border-slate-800">
                                            <img 
                                                src={post.image} 
                                                alt={post.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <div className="bg-[#0a0f1d]/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#FBBF24] border border-[#FBBF24]/30 shadow-sm">
                                                    {post.category}
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button
                                                    onClick={(e) => handleShareBlogPost(e, post)}
                                                    title="Share / Copy Link"
                                                    className="p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm border bg-[#0a0f1d]/95 border-slate-800 text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24] cursor-pointer"
                                                >
                                                    {copiedBlogPostId === post.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={(e) => handleSavePost(e, post.id)}
                                                    title="Save Article"
                                                    className={`p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm border ${currentUser?.savedPosts?.includes(post.id) ? 'bg-[#FBBF24] border-[#FBBF24] text-slate-950' : 'bg-[#0a0f1d]/95 border-slate-800 text-slate-400 hover:text-[#FBBF24]'}`}
                                                >
                                                    <Bookmark className={`w-4 h-4 ${currentUser?.savedPosts?.includes(post.id) ? 'fill-current' : ''}`} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pt-6 flex flex-col flex-1">
                                            <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 transition-colors group-hover:text-[#FBBF24]">
                                                {post.title}
                                            </h2>
                                            <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed font-semibold flex-1">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                                        <User className="w-3.5 h-3.5" /> {post.author}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                                                        <Calendar className="w-3.5 h-3.5" /> {post.date}
                                                    </div>
                                                </div>
                                                <button className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center group-hover:bg-[#FBBF24] group-hover:text-slate-950 transition-colors border-none cursor-pointer">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                    {renderGuides()}
                </div>
            </section>
        </div>
    );
}
