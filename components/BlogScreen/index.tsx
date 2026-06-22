import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ChevronRight, Bookmark } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
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
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
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
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"
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
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
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
    const { t } = useLanguage();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-brand-100 selection:text-brand-900">
            <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/portals')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer hidden sm:block"
                            title="App Launcher"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
                            </svg>
                        </button>
                        <div 
                            className="flex items-center cursor-pointer group"
                            onClick={() => navigate('/welcome')}
                        >
                            <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 md:py-20">
                <div className="mb-12">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 font-bold mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Our Blog</h1>
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                        News, updates, and educational insights from the Code for Tomorrow team.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                        <div 
                            key={post.id} 
                            onClick={() => navigate(`/blog/${post.id}`)}
                            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 shadow-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleSavePost(e, post.id)}
                                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm ${currentUser?.savedPosts?.includes(post.id) ? 'bg-brand-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-brand-500'}`}
                                >
                                    <Bookmark className={`w-4 h-4 ${currentUser?.savedPosts?.includes(post.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 mix-blend-luminosity">
                                    {post.title}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 font-medium flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <User className="w-3.5 h-3.5" /> {post.author}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5" /> {post.date}
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
