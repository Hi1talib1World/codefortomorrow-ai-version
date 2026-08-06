import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, Trophy, Flame, CheckCircle2, Lock, Star, Shield, Code, Calculator, Globe, Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ChallengeItem {
  id: number;
  title: string;
  category: 'logic' | 'algo' | 'python' | 'web' | 'math' | 'cyber' | 'kids';
  categoryLabel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  questionsCount: number;
  xpReward: number;
  timeEst: string;
  unlocked: boolean;
}

// Handcrafted Themed Challenges across CS domains
export const THEMED_CHALLENGES_BASE: Omit<ChallengeItem, 'id' | 'unlocked'>[] = [
  // 🎈 Kids Coding & Logic (25 Handcrafted Challenges)
  { title: '🤖 Robot Maze Navigation', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🍌 Monkey Banana Algorithm', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🐱 Scratch Block Sequencing', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🍕 Pizza Slice Fractions & Logic', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🎨 Color Pattern Secret Code', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🔍 Detective Clue Finder', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🏰 Treasure Map Coordinates', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🚀 Rocket Countdown Loop', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🐝 Honeybee Flower Path', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🧙 Magical Spell If-Else Logic', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Beginner', questionsCount: 5, xpReward: 15, timeEst: '2 min' },
  { title: '🎮 Arcade High Score Sort', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🤖 Robo-Pet Room Cleaner', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '📦 Toy Box Sorting Machine', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🔑 Secret Emoji Cipher Decoder', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '👾 Alien Language Translator', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🚦 Traffic Light Pattern Rules', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🧩 Puzzle Piece Fitting', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🎂 Birthday Candle Counter Loop', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🍎 Fruit Basket Filter', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🐸 Frog Pond Jump Sequence', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Intermediate', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: '🚂 Toy Train Station Routing', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Advanced', questionsCount: 5, xpReward: 25, timeEst: '4 min' },
  { title: '🦕 Dino Footprint Classifier', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Advanced', questionsCount: 5, xpReward: 25, timeEst: '4 min' },
  { title: '🏰 Castle Drawbridge Logic Gate', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Advanced', questionsCount: 5, xpReward: 25, timeEst: '4 min' },
  { title: '🛸 Space Explorer Navigation', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Advanced', questionsCount: 5, xpReward: 25, timeEst: '4 min' },
  { title: '🏆 Junior CS Master Trophy', category: 'kids', categoryLabel: '🎈 Kids', difficulty: 'Master', questionsCount: 5, xpReward: 30, timeEst: '4 min' },

  // Logic
  { title: 'Boolean Logic & Gates', category: 'logic', categoryLabel: '🧠 Logic', difficulty: 'Beginner', questionsCount: 5, xpReward: 20, timeEst: '2 min' },
  { title: 'Pattern Sequence Master', category: 'logic', categoryLabel: '🧠 Logic', difficulty: 'Beginner', questionsCount: 5, xpReward: 20, timeEst: '3 min' },
  { title: 'Truth Table Analyzer', category: 'logic', categoryLabel: '🧠 Logic', difficulty: 'Intermediate', questionsCount: 5, xpReward: 30, timeEst: '4 min' },
  { title: 'Deductive Reasoning Lab', category: 'logic', categoryLabel: '🧠 Logic', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'Conditional Statement Maze', category: 'logic', categoryLabel: '🧠 Logic', difficulty: 'Advanced', questionsCount: 5, xpReward: 45, timeEst: '5 min' },
  { title: 'Syllogism & Venn Logic', category: 'logic', categoryLabel: '🧠 Logic', difficulty: 'Master', questionsCount: 5, xpReward: 50, timeEst: '5 min' },

  // Algorithms
  { title: 'Binary Search Speedrun', category: 'algo', categoryLabel: '⚡ Algorithms', difficulty: 'Beginner', questionsCount: 5, xpReward: 25, timeEst: '3 min' },
  { title: 'Sorting Algorithm Race', category: 'algo', categoryLabel: '⚡ Algorithms', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'Recursion Stack Climber', category: 'algo', categoryLabel: '⚡ Algorithms', difficulty: 'Intermediate', questionsCount: 5, xpReward: 40, timeEst: '4 min' },
  { title: 'Big-O Complexity Quiz', category: 'algo', categoryLabel: '⚡ Algorithms', difficulty: 'Advanced', questionsCount: 5, xpReward: 45, timeEst: '5 min' },
  { title: 'Graph Traversal (BFS & DFS)', category: 'algo', categoryLabel: '⚡ Algorithms', difficulty: 'Advanced', questionsCount: 5, xpReward: 50, timeEst: '5 min' },
  { title: 'Dynamic Programming Blitz', category: 'algo', categoryLabel: '⚡ Algorithms', difficulty: 'Master', questionsCount: 5, xpReward: 60, timeEst: '6 min' },

  // Python
  { title: 'Variables & Data Types', category: 'python', categoryLabel: '🐍 Python', difficulty: 'Beginner', questionsCount: 5, xpReward: 20, timeEst: '2 min' },
  { title: 'List Comprehension Magic', category: 'python', categoryLabel: '🐍 Python', difficulty: 'Intermediate', questionsCount: 5, xpReward: 30, timeEst: '3 min' },
  { title: 'Dictionary & Unpacking', category: 'python', categoryLabel: '🐍 Python', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'Lambda & Higher-Order Functions', category: 'python', categoryLabel: '🐍 Python', difficulty: 'Advanced', questionsCount: 5, xpReward: 45, timeEst: '4 min' },
  { title: 'Decorators & Generators', category: 'python', categoryLabel: '🐍 Python', difficulty: 'Advanced', questionsCount: 5, xpReward: 50, timeEst: '5 min' },
  { title: 'OOP & Class Inheritance', category: 'python', categoryLabel: '🐍 Python', difficulty: 'Master', questionsCount: 5, xpReward: 55, timeEst: '5 min' },

  // Web Dev
  { title: 'DOM Tree Structure', category: 'web', categoryLabel: '🌐 Web Dev', difficulty: 'Beginner', questionsCount: 5, xpReward: 20, timeEst: '2 min' },
  { title: 'JSON Parsing & APIs', category: 'web', categoryLabel: '🌐 Web Dev', difficulty: 'Intermediate', questionsCount: 5, xpReward: 30, timeEst: '3 min' },
  { title: 'Async & Promises Sprint', category: 'web', categoryLabel: '🌐 Web Dev', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'CSS Flexbox & Grid Puzzle', category: 'web', categoryLabel: '🌐 Web Dev', difficulty: 'Advanced', questionsCount: 5, xpReward: 40, timeEst: '4 min' },
  { title: 'HTTP Headers & Status Codes', category: 'web', categoryLabel: '🌐 Web Dev', difficulty: 'Advanced', questionsCount: 5, xpReward: 45, timeEst: '5 min' },
  { title: 'State Management Architecture', category: 'web', categoryLabel: '🌐 Web Dev', difficulty: 'Master', questionsCount: 5, xpReward: 55, timeEst: '5 min' },

  // Math
  { title: 'Modular Arithmetic', category: 'math', categoryLabel: '🔢 Math', difficulty: 'Beginner', questionsCount: 5, xpReward: 20, timeEst: '2 min' },
  { title: 'Prime Number Sieve', category: 'math', categoryLabel: '🔢 Math', difficulty: 'Intermediate', questionsCount: 5, xpReward: 30, timeEst: '3 min' },
  { title: 'Fibonacci & Golden Ratio', category: 'math', categoryLabel: '🔢 Math', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'Matrix Multiplication', category: 'math', categoryLabel: '🔢 Math', difficulty: 'Advanced', questionsCount: 5, xpReward: 45, timeEst: '5 min' },
  { title: 'Probability & Combinatorics', category: 'math', categoryLabel: '🔢 Math', difficulty: 'Master', questionsCount: 5, xpReward: 50, timeEst: '5 min' },

  // Cybersecurity
  { title: 'Hash Function & Cryptography', category: 'cyber', categoryLabel: '🛡️ Cyber', difficulty: 'Beginner', questionsCount: 5, xpReward: 25, timeEst: '3 min' },
  { title: 'SQL Injection Spotter', category: 'cyber', categoryLabel: '🛡️ Cyber', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'Base64 & Binary Encoding', category: 'cyber', categoryLabel: '🛡️ Cyber', difficulty: 'Intermediate', questionsCount: 5, xpReward: 35, timeEst: '4 min' },
  { title: 'Network Ports & Protocols', category: 'cyber', categoryLabel: '🛡️ Cyber', difficulty: 'Advanced', questionsCount: 5, xpReward: 45, timeEst: '5 min' },
];

export function getChallengeById(id: number): ChallengeItem {
  const index = Math.max(0, id - 1);
  const base = THEMED_CHALLENGES_BASE[index % THEMED_CHALLENGES_BASE.length];
  const multiplier = Math.floor(index / THEMED_CHALLENGES_BASE.length) + 1;
  return {
    id,
    title: multiplier > 1 ? `${base.title} ${multiplier}` : base.title,
    category: base.category,
    categoryLabel: base.categoryLabel,
    difficulty: base.difficulty,
    questionsCount: base.questionsCount,
    xpReward: base.xpReward + (multiplier - 1) * 5,
    timeEst: base.timeEst,
    unlocked: true,
  };
}

export default function BrainTrainingScreen() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [completedIds, setCompletedIds] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem('completedBrainChallenges');
            if (stored) {
                setCompletedIds(JSON.parse(stored));
            }
        } catch (e) {}
    }, []);

    // Generate full list of 100 enriched challenges
    const allChallenges: ChallengeItem[] = Array.from({ length: 100 }, (_, i) => {
        const base = THEMED_CHALLENGES_BASE[i % THEMED_CHALLENGES_BASE.length];
        const multiplier = Math.floor(i / THEMED_CHALLENGES_BASE.length) + 1;
        return {
            id: i + 1,
            title: multiplier > 1 ? `${base.title} ${multiplier}` : base.title,
            category: base.category,
            categoryLabel: base.categoryLabel,
            difficulty: base.difficulty,
            questionsCount: base.questionsCount,
            xpReward: base.xpReward + (multiplier - 1) * 5,
            timeEst: base.timeEst,
            unlocked: true,
        };
    });

    const filteredChallenges = allChallenges.filter(c => {
        const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        return matchesCategory && matchesSearch;
    });

    const completedCount = completedIds.length;

    const difficultyBadgeStyles = {
        Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50',
        Intermediate: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
        Advanced: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
        Master: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50',
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-20">

            {/* Back Button & Page Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-xs hover:shadow-md transition-all group self-start"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-slate-500 dark:text-slate-400" />
                        <span>Back to Dashboard</span>
                    </button>

                    {/* Stats HUD Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-xs">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Free Daily Tries:</span>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50">3 / 3</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-xs">
                            <Trophy className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Completed:</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">{completedCount} / {allChallenges.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Hero Banner (High Contrast Slate & Gradient Accent) */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="rounded-[2.5rem] bg-slate-900 dark:bg-slate-900/90 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
                    {/* Subtle Background Glow Accent */}
                    <div className="absolute -right-10 -top-10 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col lg:flex-row items-stretch gap-8 relative z-10">

                        {/* Left Column: Interactive Mode Cards */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                                <Brain className="w-4 h-4 text-blue-400" />
                                <span>Brain Training Modes</span>
                            </div>

                            {/* Challenges Card */}
                            <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                    <Trophy className="w-6 h-6 text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">Daily Challenges</h4>
                                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                                        Test your logic, algorithms & problem solving with timed quizzes.
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-blue-600 text-slate-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                                    <span className="text-sm font-bold">→</span>
                                </div>
                            </div>

                            {/* Brain Workouts Card */}
                            <div 
                                onClick={() => navigate('/brain-training/workouts')}
                                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                    <Flame className="w-6 h-6 text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">Brain Workouts</h4>
                                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                                        Explore categorical skill tracks for balanced cognitive growth.
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-purple-600 text-slate-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                                    <span className="text-sm font-bold">→</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Premium Upsell Card */}
                        <div className="flex-1 bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-900/50 rounded-2xl p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        PRO UNLOCK
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-4">
                                    Take Your Brain Training to the Next Level!
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Unlimited challenge attempts</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Unlimited brain workouts</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>AI performance diagnostic tips</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Unlock all premium features</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="self-start px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer">
                                Unlock All Features
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter Tabs & Challenges Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Coding & Logic Challenges <span className="text-slate-400 text-base font-normal">({filteredChallenges.length})</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            Practice real Computer Science questions with instant feedback and XP rewards.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Title Search Bar */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search challenge title..."
                                className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Topic Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                            {[
                                { id: 'all', label: 'All Topics' },
                                { id: 'kids', label: '🎈 Kids' },
                                { id: 'logic', label: '🧠 Logic' },
                                { id: 'algo', label: '⚡ Algorithms' },
                                { id: 'python', label: '🐍 Python' },
                                { id: 'web', label: '🌐 Web' },
                                { id: 'math', label: '🔢 Math' },
                                { id: 'cyber', label: '🛡️ Cyber' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedCategory(tab.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                                        selectedCategory === tab.id
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Challenge Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredChallenges.map((challenge) => {
                        const isCompleted = completedIds.includes(challenge.id);
                        return (
                            <div
                                key={challenge.id}
                                onClick={() => navigate(`/brain-training/${challenge.id}`)}
                                className={`group rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden shadow-xs hover:shadow-lg ${
                                    isCompleted
                                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/50 hover:border-emerald-500'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500'
                                }`}
                            >
                                {/* Card Header */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {challenge.categoryLabel}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${difficultyBadgeStyles[challenge.difficulty]}`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>

                                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {challenge.title}
                                    </h4>

                                    {/* Meta Details */}
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                                        <span>{challenge.questionsCount} Questions</span>
                                        <span>•</span>
                                        <span>{challenge.timeEst}</span>
                                        <span>•</span>
                                        <span className="text-amber-600 dark:text-amber-400 font-bold">+{challenge.xpReward} XP</span>
                                    </div>
                                </div>

                                {/* Card Footer: Star Rating & Compact CTA */}
                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    {/* Star Rating Indicator */}
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3].map((starIndex) => (
                                            <Star
                                                key={starIndex}
                                                className={`w-3.5 h-3.5 ${
                                                    isCompleted
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-300 dark:text-slate-700'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Compact CTA Button */}
                                    <button
                                        type="button"
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                                            isCompleted
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'bg-blue-600 group-hover:bg-blue-700 text-white shadow-xs'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Review</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Start</span>
                                                <span className="text-xs">→</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
