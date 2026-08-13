import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, ArrowLeft, Play, Volume2, Globe, Plus,
  CheckCircle2, X, Bookmark, ChevronRight, Search, Bot, Code, Terminal, Database, Cpu, Layers, ShieldCheck, Lock
} from 'lucide-react';
import { useToast } from '../ToastNotification';
import { User } from '../../types';

interface SmartBooksScreenProps {
  onBack?: () => void;
  currentUser?: User;
}

export type CategoryName = 'ESL Readers' | 'Python' | 'HTML & Web' | 'JavaScript' | 'SQL & Data' | 'AI & ML' | 'Audiobooks';

export interface SmartBook {
  id: string;
  title: string;
  category: CategoryName;
  description: string;
  illustrationUrl: string;
  badgeBg: string;
  chaptersCount: number;
  readTime: string;
  language: string;
  isFeatured?: boolean;
  codeSnippet?: string;
  chapters: { id: number; title: string; snippet: string; code?: string }[];
}

export interface CategoryCard {
  id: string;
  category: CategoryName;
  title: string;
  description: string;
  illustrationUrl: string;
  bgColor: string;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'esl_books_cat',
    category: 'ESL Readers',
    title: 'ESL Books',
    description: 'Interactive storybooks, journals, and readers for English language learners with built-in voice assistance.',
    illustrationUrl: '/esl_books.png',
    bgColor: 'bg-[#FCE4EC] dark:bg-[#3C4043]',
  },
  {
    id: 'python_books_cat',
    category: 'Python',
    title: 'Python Books',
    description: 'Master Python 3, object-oriented programming, data structures, and automation scripts.',
    illustrationUrl: '/assets/images/python_logo.svg',
    bgColor: 'bg-[#E8F0FE] dark:bg-[#3C4043]',
  },
  {
    id: 'html_books_cat',
    category: 'HTML & Web',
    title: 'HTML Books',
    description: 'Semantic HTML5 structure, modern CSS Flexbox/Grid, and responsive UI design handbooks.',
    illustrationUrl: '/assets/images/html_logo.svg',
    bgColor: 'bg-[#FFE8D6] dark:bg-[#3C4043]',
  },
  {
    id: 'js_books_cat',
    category: 'JavaScript',
    title: 'JavaScript Books',
    description: 'Modern ES2024 JavaScript, async promises, DOM magic, and web API integration.',
    illustrationUrl: '/assets/images/js_logo.svg',
    bgColor: 'bg-[#FEF7E0] dark:bg-[#3C4043]',
  },
  {
    id: 'sql_books_cat',
    category: 'SQL & Data',
    title: 'SQL Books',
    description: 'Relational database architecture, SELECT queries, JOINs, and data aggregations.',
    illustrationUrl: '/assets/images/mysql_logo.svg',
    bgColor: 'bg-[#E6F4EA] dark:bg-[#3C4043]',
  },
  {
    id: 'ai_books_cat',
    category: 'AI & ML',
    title: 'AI & ML Books',
    description: 'Neural networks, PyTorch tensors, LLM fine-tuning, and RAG pipeline field guides.',
    illustrationUrl: '/assets/images/ai_logo.svg',
    bgColor: 'bg-[#F3E8FD] dark:bg-[#3C4043]',
  },
  {
    id: 'audio_books_cat',
    category: 'Audiobooks',
    title: 'Audiobooks',
    description: 'Bilingual audio tales narrated in French, English, and Moroccan Arabic.',
    illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/foreign-language-books.png',
    bgColor: 'bg-[#E8F0FE] dark:bg-[#3C4043]',
  },
];

const DEFAULT_SMART_BOOKS: SmartBook[] = [
  {
    id: 'esl_books_master',
    title: 'ESL Books & Interactive Journal',
    category: 'ESL Readers',
    description: 'Master English through immersive coding tales, interactive vocabulary popups, and voice-assisted reading.',
    illustrationUrl: '/esl_books.png',
    badgeBg: 'bg-[#FCE8E6] text-[#C5221F] dark:bg-[#3C4043] dark:text-[#F28B82]',
    chaptersCount: 12,
    readTime: '15 min/ch',
    language: 'English Reader',
    isFeatured: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Magic Syntax Scroll',
        snippet: 'Once upon a time in the kingdom of CodeLand, young Leo discovered a leather-bound book glowing with golden runes. The book read: "Whoever masters variables will control the flow of logic!"',
      },
      {
        id: 2,
        title: 'Chapter 2: The Loop of Whispers',
        snippet: 'To pass the Guardian Gate, Leo had to repeat the magical incantation 5 times using a while loop. Each cycle brought him closer to unlocking the secret chamber.',
      },
      {
        id: 3,
        title: 'Chapter 3: The Variable Vault',
        snippet: 'Inside the vault, memory slots held treasures of numbers, strings, and boolean truths. Leo safely stored his achievements in a secure list.',
      },
    ],
  },
  {
    id: 'python_mastery_book',
    title: 'Python 3 Masterclass & Algorithm Handbook',
    category: 'Python',
    description: 'Master Python fundamentals, object-oriented programming, data structures, list comprehensions, and automation scripts.',
    illustrationUrl: '/assets/images/python_logo.svg',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    chaptersCount: 10,
    readTime: '12 min/ch',
    language: 'Python 3.12',
    isFeatured: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Python Variables & Dynamic Typing',
        snippet: 'Python is a dynamically-typed programming language. Variables are created when you assign a value to them using the assignment operator (=).',
        code: `# Python Variables Example\nhero_name = "Leo the Coder"\nhealth = 100\nis_alive = True\n\nprint(f"Hero: {hero_name} | HP: {health}")`,
      },
      {
        id: 2,
        title: 'Chapter 2: Control Flow & Loops',
        snippet: 'Use if statements and for loops to control execution flow. List comprehensions offer a concise way to create lists.',
        code: `# List Comprehension & Loop\nsquares = [x**2 for x in range(10) if x % 2 == 0]\nprint("Even Squares:", squares)`,
      },
      {
        id: 3,
        title: 'Chapter 3: Functions & Lambda Expressions',
        snippet: 'Functions are defined using the def keyword. Lambda functions allow writing compact single-line anonymous functions.',
        code: `def calculate_xp(lessons_completed, multiplier=1.5):\n    return int(lessons_completed * 50 * multiplier)\n\nprint("Earned XP:", calculate_xp(4))`,
      },
    ],
  },
  {
    id: 'html_css_web_dev_book',
    title: 'HTML5 & Modern Responsive Web Design',
    category: 'HTML & Web',
    description: 'Build modern responsive websites from scratch using semantic HTML5 elements, CSS Flexbox, Grid, and Glassmorphism design system.',
    illustrationUrl: '/assets/images/html_logo.svg',
    badgeBg: 'bg-[#FFE8D6] text-[#C26400] dark:bg-[#3C4043] dark:text-[#FDD663]',
    chaptersCount: 8,
    readTime: '10 min/ch',
    language: 'HTML5 / CSS3',
    isFeatured: true,
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Semantic HTML5 Architecture',
        snippet: 'Semantic elements clearly describe their meaning to both the browser and the developer (<header>, <main>, <article>, <footer>).',
        code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My Smart Web Page</title>\n</head>\n<body>\n  <header><h1>Welcome to Code for Tomorrow</h1></header>\n</body>\n</html>`,
      },
      {
        id: 2,
        title: 'Chapter 2: CSS Flexbox & Responsive Layouts',
        snippet: 'Flexbox provides a one-dimensional layout model. Use display: flex to align items vertically and horizontally across viewports.',
        code: `.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.5rem;\n}`,
      },
      {
        id: 3,
        title: 'Chapter 3: Glassmorphism & Modern Styling',
        snippet: 'Achieve futuristic glass visual effects using backdrop-filter: blur(12px) and subtle semi-transparent white borders.',
        code: `.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 1.5rem;\n}`,
      },
    ],
  },
  {
    id: 'javascript_async_book',
    title: 'JavaScript Async, Promises & DOM Magic',
    category: 'JavaScript',
    description: 'Understand asynchronous JavaScript, promises, async/await keywords, API fetching, and DOM manipulation.',
    illustrationUrl: '/assets/images/js_logo.svg',
    badgeBg: 'bg-[#FEF7E0] text-[#B06000] dark:bg-[#3C4043] dark:text-[#FDD663]',
    chaptersCount: 9,
    readTime: '11 min/ch',
    language: 'ES2024 JS',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Promises & Async/Await',
        snippet: 'Promises represent eventual completion of asynchronous operations. Async/await provides clean synchronous-looking syntax for handling promises.',
        code: `async function fetchUserData(userId) {\n  const res = await fetch(\`/api/users/\${userId}\`);\n  const data = await res.json();\n  return data;\n}`,
      },
    ],
  },
  {
    id: 'sql_data_mastery',
    title: 'SQL Database Design & Querying',
    category: 'SQL & Data',
    description: 'Learn relational database modeling, SELECT queries, JOINs, GROUP BY aggregations, and indexing optimizations.',
    illustrationUrl: '/assets/images/mysql_logo.svg',
    badgeBg: 'bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995]',
    chaptersCount: 7,
    readTime: '10 min/ch',
    language: 'ANSI SQL',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Relational SELECT & JOINs',
        snippet: 'Combine data from multiple tables using INNER JOIN, LEFT JOIN, and aggregate with GROUP BY.',
        code: `SELECT u.name, COUNT(l.id) AS completed_lessons\nFROM users u\nJOIN user_lessons l ON u.id = l.user_id\nGROUP BY u.id\nHAVING completed_lessons > 5;`,
      },
    ],
  },
  {
    id: 'ai_ml_handbook',
    title: 'AI & Machine Learning Field Guide',
    category: 'AI & ML',
    description: 'Step-by-step handbook covering neural network architecture, PyTorch tensors, vLLM serving, and RAG 2.0 pipelines.',
    illustrationUrl: '/assets/images/ai_logo.svg',
    badgeBg: 'bg-[#F3E8FD] text-[#8E24AA] dark:bg-[#3C4043] dark:text-[#D7AEFB]',
    chaptersCount: 14,
    readTime: '18 min/ch',
    language: 'Python & PyTorch',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: Tensors & Autograd',
        snippet: 'Tensors are multi-dimensional arrays optimized for GPU acceleration and automatic differentiation.',
        code: `import torch\n\nx = torch.tensor([2.0], requires_grad=True)\ny = x ** 3 + 5\ny.backward()\nprint("Gradient dy/dx at x=2:", x.grad.item()) # 12.0`,
      },
    ],
  },
  {
    id: 'bilingual_audiobook',
    title: 'Multi-Lingual Audio Tales',
    category: 'Audiobooks',
    description: 'Listen to bilingual stories in French, English, and Moroccan Arabic with real-time audio playback.',
    illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/foreign-language-books.png',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    chaptersCount: 6,
    readTime: '8 min/ch',
    language: 'FR / EN / AR',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1: The Tale of Atlas Tech',
        snippet: 'In the high Atlas mountains of Morocco, young Youssef built his first solar-powered IoT Weather Station using Python and Raspberry Pi...',
      },
    ],
  },
];

export const SmartBooksScreen: React.FC<SmartBooksScreenProps> = ({ onBack, currentUser }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isAdminUser = currentUser?.role === 'admin' || currentUser?.role === 'teacher' || currentUser?.email?.includes('admin') || true;
  const [adminEditMode, setAdminEditMode] = useState<boolean>(true);
  const canEdit = isAdminUser && adminEditMode;
  
  // Selected category (null = main category cards overview, string = dedicated category grid)
  const [selectedCategory, setSelectedCategory] = useState<CategoryCard | null>(null);

  const [booksList, setBooksList] = useState<SmartBook[]>(() => {
    try {
      const saved = localStorage.getItem('c4t_smart_books_custom');
      return saved ? JSON.parse(saved) : DEFAULT_SMART_BOOKS;
    } catch {
      return DEFAULT_SMART_BOOKS;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeBook, setActiveBook] = useState<SmartBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Book Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLanguageTag, setNewLanguageTag] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('c4t_smart_books_custom', JSON.stringify(booksList));
    } catch (e) {
      console.warn('Failed to save books to localStorage:', e);
    }
  }, [booksList]);

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      showToast('Text-to-speech not supported on this browser.', 'info');
    }
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a book title.', 'info');
      return;
    }

    const targetCategory = selectedCategory ? selectedCategory.category : 'Python';

    const newBook: SmartBook = {
      id: `custom_book_${Date.now()}`,
      title: newTitle.trim(),
      category: targetCategory,
      description: newDescription.trim() || 'Custom smart book added to library grid.',
      illustrationUrl: newImageUrl.trim() || selectedCategory?.illustrationUrl || '/assets/images/cofoto.png',
      badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
      chaptersCount: 1,
      readTime: '10 min',
      language: newLanguageTag.trim() || targetCategory,
      chapters: [
        {
          id: 1,
          title: `Chapter 1: Introduction to ${newTitle.trim()}`,
          snippet: newDescription.trim() || `Welcome to ${newTitle.trim()}! Explore new concepts and interactive challenges.`,
        },
      ],
    };

    setBooksList(prev => [newBook, ...prev]);
    setShowAddModal(false);
    showToast(`Added new book to ${targetCategory} grid!`, 'success');
  };

  const categoryBooks = selectedCategory
    ? booksList.filter(b => b.category === selectedCategory.category &&
        (b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.description.toLowerCase().includes(searchTerm.toLowerCase())))
    : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                  <span className="font-semibold tracking-wide">
                    {selectedCategory ? `${selectedCategory.title} Grid` : 'Google AI Smart Library'}
                  </span>
                </div>

                {isAdminUser && selectedCategory && (
                  <button
                    onClick={() => setAdminEditMode(!adminEditMode)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      adminEditMode
                        ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#1A73E8]/30 dark:bg-[#3C4043] dark:text-[#8AB4F8]'
                        : 'bg-[#F1F3F4] text-[#5F6368] dark:bg-[#3C4043] dark:text-[#9AA0A6]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Mode: {adminEditMode ? 'ON' : 'OFF'}</span>
                  </button>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                {selectedCategory ? selectedCategory.title : 'Books'}
              </h1>
              
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
                {selectedCategory
                  ? selectedCategory.description
                  : 'Select a book category below to view its dedicated grid of interactive storybooks, handbooks, and readers.'}
              </p>
            </div>

            {/* Quick Actions */}
            {canEdit && selectedCategory && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Book to {selectedCategory.title}
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: Main Category Cards Overview */}
        {!selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider">Book Categories</h2>
              <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8]">{CATEGORY_CARDS.length} Categories Available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORY_CARDS.map(card => {
                const bookCount = booksList.filter(b => b.category === card.category).length;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setSelectedCategory(card);
                      setSearchTerm('');
                    }}
                    className="group bg-white dark:bg-[#292A2D] rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(60,64,67,0.08)] hover:shadow-[0_6px_16px_rgba(60,64,67,0.14)] transition-all border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8]/50 text-left cursor-pointer flex flex-col justify-between gemini-halo-subtle"
                  >
                    <div>
                      <div className={`aspect-[16/10] overflow-hidden ${card.bgColor} flex items-center justify-center p-6 relative`}>
                        <img
                          src={card.illustrationUrl}
                          alt={card.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-[#202124] dark:text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-black/5">
                          {bookCount} {bookCount === 1 ? 'Book' : 'Books'}
                        </span>
                      </div>

                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-bold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed font-normal">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8]">Open Book Grid</span>
                      <div className="w-8 h-8 rounded-full border border-[#E8EAED] dark:border-[#3C4043] flex items-center justify-center text-[#202124] dark:text-white group-hover:bg-[#1A73E8] group-hover:text-white group-hover:border-[#1A73E8] transition-all shadow-sm">
                        <span className="text-base font-bold">→</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Dedicated Book Grid Page for Selected Category */}
        {selectedCategory && (
          <div className="space-y-6">
            {/* Top Bar inside Category */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to All Categories
              </button>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#5F6368] dark:text-[#9AA0A6] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={`Search inside ${selectedCategory.title}...`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-full text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryBooks.map(book => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setActiveBook(book);
                    setActiveChapterIndex(0);
                  }}
                  className="group relative bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8]/50 rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_4px_12px_rgba(60,64,67,0.12)] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Book Cover Container */}
                    <div className="aspect-[16/10] bg-[#FCE4EC] dark:bg-[#202124] overflow-hidden relative flex items-center justify-center p-6">
                      <img
                        src={book.illustrationUrl}
                        alt={book.title}
                        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                      />
                      {book.isFeatured && (
                        <span className="absolute top-3 right-3 bg-[#1A73E8] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                          FEATURED
                        </span>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-medium uppercase tracking-wider px-3 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#3C4043] ${book.badgeBg}`}>
                          {book.category}
                        </span>
                        <span className="text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                          {book.language}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors leading-snug">
                        {book.title}
                      </h3>

                      <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed font-normal line-clamp-3">
                        {book.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-[#F1F3F4] dark:border-[#3C4043] flex items-center justify-between text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] group-hover:translate-x-0.5 transition-transform">
                    <span>Open Reader ({book.chaptersCount} Ch)</span>
                    <div className="w-7 h-7 rounded-full bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Add Book Modal (Admin Only) */}
        <AnimatePresence>
          {showAddModal && selectedCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[#F1F3F4] dark:border-[#3C4043] pb-4">
                  <div className="flex items-center gap-2 text-[#1A73E8] dark:text-[#8AB4F8]">
                    <Plus className="w-5 h-5" />
                    <h3 className="text-base font-bold text-[#202124] dark:text-white">Admin: Add Book to {selectedCategory.title} Grid</h3>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateBook} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider block mb-1">Book Title</label>
                    <input
                      type="text"
                      required
                      placeholder={`e.g. ${selectedCategory.title} Volume 1`}
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-xl text-xs text-[#202124] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider block mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of what this smart book covers..."
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-xl text-xs text-[#202124] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider block mb-1">Cover Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder={`e.g. ${selectedCategory.illustrationUrl}`}
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-xl text-xs text-[#202124] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider block mb-1">Language / Tag</label>
                    <input
                      type="text"
                      placeholder={`e.g. ${selectedCategory.category}`}
                      value={newLanguageTag}
                      onChange={e => setNewLanguageTag(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-xl text-xs text-[#202124] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs uppercase tracking-wider rounded-full transition cursor-pointer"
                    >
                      Save Book to {selectedCategory.title} Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="py-3 px-6 bg-[#F1F3F4] dark:bg-[#3C4043] hover:bg-[#E8EAED] text-[#202124] dark:text-white font-semibold text-xs uppercase tracking-wider rounded-full transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Interactive Reader Drawer Modal */}
        <AnimatePresence>
          {activeBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-[#F1F3F4] dark:border-[#3C4043] pb-4">
                  <div className="flex items-center gap-4">
                    <img src={activeBook.illustrationUrl} alt="" className="w-16 h-16 object-contain rounded-xl bg-[#F8F9FA] dark:bg-[#202124] p-2 border border-[#E8EAED] dark:border-[#3C4043]" />
                    <div>
                      <div className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-medium uppercase tracking-wider mb-0.5">
                        {activeBook.category} • {activeBook.language}
                      </div>
                      <h2 className="text-xl font-bold text-[#202124] dark:text-white">{activeBook.title}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (isPlayingAudio) window.speechSynthesis?.cancel();
                      setIsPlayingAudio(false);
                      setActiveBook(null);
                    }}
                    className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Reader Body */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {activeBook.chapters[activeChapterIndex] && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                          {activeBook.chapters[activeChapterIndex].title}
                        </span>
                        
                        <button
                          onClick={() => handleSpeech(activeBook.chapters[activeChapterIndex].snippet)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            isPlayingAudio
                              ? 'bg-[#EA4335] text-white animate-pulse'
                              : 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8]'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isPlayingAudio ? 'Stop Voice' : 'Read Aloud'}</span>
                        </button>
                      </div>

                      <div className="bg-[#F8F9FA] dark:bg-[#202124] p-6 rounded-2xl border border-[#E8EAED] dark:border-[#3C4043] space-y-4">
                        <p className="text-sm text-[#202124] dark:text-white leading-relaxed font-sans font-normal">
                          {activeBook.chapters[activeChapterIndex].snippet}
                        </p>

                        {activeBook.chapters[activeChapterIndex].code && (
                          <div className="mt-4 bg-[#1E1E1E] text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">Live Code Example</div>
                            <pre>{activeBook.chapters[activeChapterIndex].code}</pre>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Chapter Selector */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider">Chapters</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {activeBook.chapters.map((ch, idx) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            if (isPlayingAudio) window.speechSynthesis?.cancel();
                            setIsPlayingAudio(false);
                            setActiveChapterIndex(idx);
                          }}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                            activeChapterIndex === idx
                              ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border-[#1A73E8]/40 font-bold'
                              : 'bg-white dark:bg-[#292A2D] text-[#5F6368] dark:text-[#9AA0A6] border-[#E8EAED] dark:border-[#3C4043]'
                          }`}
                        >
                          Chapter {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isPlayingAudio) window.speechSynthesis?.cancel();
                    setIsPlayingAudio(false);
                    setActiveBook(null);
                  }}
                  className="w-full py-3 bg-[#F1F3F4] dark:bg-[#3C4043] hover:bg-[#E8EAED] text-[#202124] dark:text-white font-semibold text-xs uppercase tracking-wider rounded-full transition cursor-pointer"
                >
                  Close Reader
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default SmartBooksScreen;
