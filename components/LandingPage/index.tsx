import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { motion, useInView, useAnimation } from 'motion/react';
import { ChevronRight, X, Menu, Gamepad2, Brush, Bot, Award, Star, Twitter, Instagram, Facebook, Github, Linkedin, Mail, Code, Terminal, Cpu, ChevronDown, CheckCircle, Play, Users, Rocket, Globe, Languages, ShieldCheck, Zap, Users2, Send, Youtube, ChevronUp, MessageSquare, Heart, ShoppingBasket, User as UserIcon } from 'lucide-react';
import Mascot from '../Mascot';
import { ImageCarousel } from '../ImageCarousel';
import { useLanguage } from '../../contexts/LanguageContext';

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
      });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatCard: React.FC<{ icon: any, value: string, label: string, color: string }> = ({ icon: Icon, value, label, color }) => (
  <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</span>
    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const PricingCard: React.FC<{ title: string, price: string, features: string[], isPopular?: boolean, onGetStarted: () => void }> = ({ title, price, features, isPopular, onGetStarted }) => (
  <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 ${isPopular ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-2xl shadow-brand-500/10 scale-105 z-10' : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-black">{price}</span>
      {price !== 'Free' && <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">/month</span>}
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 group">
          <CheckCircle className={`w-5 h-5 shrink-0 ${isPopular ? 'text-brand-500' : 'text-slate-400'}`} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{f}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onGetStarted}
      className={`w-full py-4 rounded-full font-bold transition-all active:scale-95 ${isPopular ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-xl shadow-brand-500/25' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}
    >
      {price === 'Free' ? 'Sign Up Free' : 'Choose Plan'}
    </button>
  </div>
);

const statsTranslations = {
  en: {
    title: "Key Achievements",
    studentsVal: "15 Million",
    studentsSub: "Students",
    studentsDesc: "Watch and learn from Science Street videos on all digital platforms",
    viewsVal: "10M",
    viewsSub: "Views",
    viewsDesc: "Across our digital platforms",
    expsVal: "400",
    expsSub: "Experiments",
    expsDesc: "Produced and filmed by Science Street",
    festsVal: "22+",
    festsSub: "Science Festivals",
    festsDesc: "Across the Middle East and North Africa",
    showsVal: "5,000",
    showsSub: "Science Shows",
    showsDesc: "Presented to all ages and students in a fun, interactive way"
  },
  fr: {
    title: "Principales Réalisations",
    studentsVal: "15 Millions",
    studentsSub: "d'étudiants",
    studentsDesc: "Regardez et apprenez avec les vidéos de Science Street sur toutes les plateformes",
    viewsVal: "10M",
    viewsSub: "de vues",
    viewsDesc: "Sur nos plateformes numériques",
    expsVal: "400",
    expsSub: "Expériences",
    expsDesc: "Produites et filmées par Science Street",
    festsVal: "22+",
    festsSub: "Festivals de sciences",
    festsDesc: "À travers le Moyen-Orient et l'Afrique du Nord",
    showsVal: "5 000",
    showsSub: "Spectacles scientifiques",
    showsDesc: "Présentés à tous les âges et aux étudiants de manière interactive"
  },
  ar: {
    title: "أهم الإنجازات",
    studentsVal: "15 مليون",
    studentsSub: "طالب",
    studentsDesc: "شاهد وتعلم من فيديوهات شارع العلوم على جميع المنصات الرقمية",
    viewsVal: "10 مليون",
    viewsSub: "مشاهدة",
    viewsDesc: "عبر منصاتنا الرقمية",
    expsVal: "400",
    expsSub: "تجربة",
    expsDesc: "تم انتاجها وتصويرها من شارع العلوم",
    festsVal: "22+",
    festsSub: "مهرجانات علمية",
    festsDesc: "في جميع أنحاء الشرق الأوسط وشمال أفريقيا",
    showsVal: "5,000",
    showsSub: "عروض علمية",
    showsDesc: "مقدم لجميع الأعمار والطلاب بأسلوب تفاعلي ممتع"
  }
};

const LandingPage: React.FC<{ currentUser: User | null, onGetStarted: () => void }> = ({ currentUser, onGetStarted }) => {
  const { language } = useLanguage();
  const port = window.location.port ? `:${window.location.port}` : '';

  const getPlatformHref = (subdomain: 'academy' | 'os' | 'docs', path: string) => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.endsWith('palycofoto.club')) {
      return path;
    }
    return `http://${subdomain}.palycofoto.club${port}`;
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, subdomain: 'academy' | 'os' | 'docs', path: string) => {
    if (!currentUser) {
      e.preventDefault();
      const hostname = window.location.hostname;
      const targetRoute = hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.endsWith('palycofoto.club')
        ? path
        : `http://${subdomain}.palycofoto.club${port}`;
      
      localStorage.setItem('lastVisitedRoute', targetRoute);
      
      const authPath = hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.endsWith('palycofoto.club')
        ? '/auth'
        : `http://palycofoto.club${port}/auth`;
        
      window.location.href = authPath;
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoCode, setDemoCode] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const fullCode = "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Click Run to see the output\nconsole.log(greet('World'));";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullCode.length) {
        setDemoCode(fullCode.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  const NavLink: React.FC<{ href: string, children: React.ReactNode, className?: string }> = ({ href, children, className }) => (
    <a href={href} className={`font-bold transition-colors text-sm ${className}`}>
      {children}
    </a>
  );

  return (
    <div className="bg-brand-50 dark:bg-slate-950 font-sans overflow-x-hidden text-slate-900 dark:text-slate-100 selection:bg-brand-100 selection:text-brand-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-transparent z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo on the left */}
          <div className="flex items-center cursor-pointer group shrink-0">
            <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
          </div>

          {/* Yellow pill Navigation in the center */}
          <nav className="hidden lg:flex items-center bg-[#FDD501] rounded-full px-12 py-3.5 gap-10">
            <a href="#" className="text-[#3d1844] hover:opacity-85 transition-opacity text-base font-black tracking-wide">
              Home
            </a>
            <a 
              href={getPlatformHref('academy', '/dashboard')} 
              onClick={(e) => handleCardClick(e, 'academy', '/dashboard')}
              className="text-[#3d1844] hover:opacity-85 transition-opacity text-base font-black tracking-wide"
            >
              Academy
            </a>
            <a 
              href={getPlatformHref('os', '/cftos')} 
              onClick={(e) => handleCardClick(e, 'os', '/cftos')}
              className="text-[#3d1844] hover:opacity-85 transition-opacity text-base font-black tracking-wide"
            >
              CFTOS
            </a>
            <a 
              href={getPlatformHref('docs', '/blog')} 
              onClick={(e) => handleCardClick(e, 'docs', '/blog')}
              className="text-[#3d1844] hover:opacity-85 transition-opacity text-base font-black tracking-wide"
            >
              Docs & Blog
            </a>
            <a href="#features" className="text-[#3d1844] hover:opacity-85 transition-opacity text-base font-black tracking-wide">
              Features
            </a>
            <a href="#testimonials" className="text-[#3d1844] hover:opacity-85 transition-opacity text-base font-black tracking-wide">
              Testimonials
            </a>
          </nav>

          {/* Icons on the right */}
          <div className="flex items-center gap-6">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-6 text-[#FDD501]">
              <ShoppingBasket className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" aria-label="Shopping basket" />
              <Heart className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" aria-label="Favorites" />
              <UserIcon className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" aria-label="Account" onClick={onGetStarted} />
            </div>

            {/* Mobile Icons & Menu Toggle */}
            <div className="flex md:hidden items-center gap-4 text-[#FDD501]">
              <UserIcon className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" aria-label="Account" onClick={onGetStarted} />
              <button className="p-1 hover:scale-110 transition-transform" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                <Menu className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 bg-white dark:bg-slate-800 w-72 p-8 shadow-lg" onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-1" aria-label="Close menu">
              <X className="w-6 h-6 text-slate-500" />
            </button>
            <div className="flex items-center cursor-pointer group">
              <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            </div>
            <nav className="flex flex-col space-y-6 mt-12 mb-8">
              <NavLink href="#features" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium text-lg">Features</NavLink>
              <NavLink href="#how-it-works" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium text-lg">How It Works</NavLink>
              <NavLink href="#testimonials" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium text-lg">Testimonials</NavLink>
              <a 
                href={getPlatformHref('docs', '/blog')} 
                onClick={(e) => handleCardClick(e, 'docs', '/blog')}
                className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors text-lg"
              >
                Blog & Docs
              </a>
              <a 
                href={getPlatformHref('os', '/cftos')} 
                onClick={(e) => handleCardClick(e, 'os', '/cftos')}
                className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors text-lg"
              >
                Open Source
              </a>
            </nav>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                150 Students Online
              </div>
              <button
                onClick={onGetStarted}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-brand-500 transition-all text-sm shadow-xl shadow-brand-500/25 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <main className="pt-32 md:pt-40 pb-20 container mx-auto px-6 text-center relative isolate">
        {/* Decorative background elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <AnimatedSection>
          <div className="relative inline-block mb-10">
            <div className="absolute -inset-4 bg-[#2E2FCE]/10 rounded-full blur-2xl"></div>
            <div className="w-32 h-32 md:w-44 md:h-44 transition-all duration-700 cursor-pointer drop-shadow-[0_20px_50px_rgba(66,133,244,0.3)] relative">
              <Mascot />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            Building the Tech
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E2FCE] via-[#EA4335] to-[#FBBC05] dark:from-[#a3aaeb] dark:to-[#fdd663]">Ecosystem for Tomorrow.</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-8 text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
            An all-in-one ecosystem for interactive learning, open-source collaboration, and technical documentation.
          </p>
 
          {/* Integrated Ecosystem Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12 mb-12 max-w-5xl mx-auto">
            {/* Card 1: CFT Academy */}
            <a 
              href={getPlatformHref('academy', '/dashboard')}
              onClick={(e) => handleCardClick(e, 'academy', '/dashboard')}
              className="group relative flex flex-col h-full p-8 md:p-10 rounded-[2.5rem] bg-[#f0f4ff] dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 shadow-[0_15px_50px_rgba(26,115,232,0.03)] dark:shadow-none hover:shadow-[0_20px_60px_rgba(26,115,232,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden decoration-none text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] dark:bg-blue-950/60 flex items-center justify-center text-[#2E2FCE] dark:text-blue-400 mb-6 shadow-sm">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                CFT Academy
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-grow text-[15px]">
                Interactive coding adventures, gamified lessons, and curriculum builders for students.
              </p>
              <span className="inline-flex items-center text-sm font-bold text-[#2E2FCE] dark:text-blue-400 group-hover:underline">
                Enter Academy &rarr;
              </span>
            </a>
 
            {/* Card 2: CFTOS */}
            <a 
              href={getPlatformHref('os', '/cftos')}
              onClick={(e) => handleCardClick(e, 'os', '/cftos')}
              className="group relative flex flex-col h-full p-8 md:p-10 rounded-[2.5rem] bg-[#fdf2f2] dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 shadow-[0_15px_50px_rgba(217,48,37,0.03)] dark:shadow-none hover:shadow-[0_20px_60px_rgba(217,48,37,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden decoration-none text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fce8e6] dark:bg-red-950/60 flex items-center justify-center text-[#d93025] dark:text-red-400 mb-6 shadow-sm">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                CFTOS
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-grow text-[15px]">
                Our collaborative developer platform for building autonomous AI agents and open software.
              </p>
              <span className="inline-flex items-center text-sm font-bold text-[#d93025] dark:text-red-400 group-hover:underline">
                Open Platform &rarr;
              </span>
            </a>
 
            {/* Card 3: CFT Docs & Blog */}
            <a 
              href={getPlatformHref('docs', '/blog')}
              onClick={(e) => handleCardClick(e, 'docs', '/blog')}
              className="group relative flex flex-col h-full p-8 md:p-10 rounded-[2.5rem] bg-[#fdfaf2] dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 shadow-[0_15px_50px_rgba(249,171,0,0.03)] dark:shadow-none hover:shadow-[0_20px_60px_rgba(249,171,0,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden decoration-none text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fef7e0] dark:bg-amber-950/60 flex items-center justify-center text-[#f9ab00] dark:text-amber-400 mb-6 shadow-sm">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                CFT Docs & Blog
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-grow text-[15px]">
                In-depth technical guides, tutorials, and insights for our engineering community.
              </p>
              <span className="inline-flex items-center text-sm font-bold text-[#f9ab00] dark:text-amber-400 group-hover:underline">
                Read Documentation &rarr;
              </span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-[#2E2FCE] text-white font-bold px-10 py-4 rounded-full hover:bg-[#2324ba] transition-all shadow-xl shadow-[#2E2FCE]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              Get Started for Free <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto text-center px-10 py-4 rounded-full border border-slate-200/60 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30 decoration-none cursor-pointer"
            >
              Explore Features
            </button>
          </div>
        </AnimatedSection>

      </main>

      {/* Interactive Demo Section */}
      <section className="py-20 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/50">
        <AnimatedSection className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-bold mb-6 text-sm">
                <Terminal className="w-4 h-4" /> Try It Out
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">See the Magic in Action.</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 font-medium">
                Our interactive code editor lets kids write real code and see the results instantly. It's the best way to understand how the digital world is built.
              </p>
              <ul className="space-y-4 mb-8">
                {["Live syntax highlighting", "Instant feedback mechanism", "Safe sandbox environment"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-brand-500" /> {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-3.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2"
              >
                Try the First Lesson <Code className="w-4 h-4" />
              </button>
            </div>
            <div className="lg:w-1/2 w-full max-w-2xl">
              <div className="bg-[#1e1e2e] rounded-2xl p-4 shadow-2xl border border-slate-700 font-mono text-sm relative">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-400 ml-4 font-semibold text-xs">hello.js</span>
                </div>
                <div className="bg-[#181825] p-6 rounded-xl text-slate-300 h-56 overflow-hidden relative">
                  <pre className="whitespace-pre-wrap"><code className="text-emerald-400">{demoCode}</code><span className="animate-pulse">_</span></pre>
                  {demoCode.length === fullCode.length && !showOutput && (
                    <button onClick={() => setShowOutput(true)} className="absolute bottom-6 right-6 bg-brand-500 hover:bg-brand-400 text-white font-bold py-2 px-5 rounded flex items-center gap-2 transition-all shadow-lg active:scale-95">
                      <Play className="w-4 h-4 fill-current" /> Run
                    </button>
                  )}
                </div>
                <div className={`mt-4 bg-black/50 rounded-xl border border-slate-700/50 transition-all overflow-hidden ${showOutput ? 'h-24 opacity-100 p-4' : 'h-0 opacity-0 py-0 border-transparent p-0'}`}>
                  <p className="text-slate-400 text-xs mb-1">Console Output:</p>
                  <p className="text-brand-300 font-semibold">{showOutput ? "> Hello, World!" : ""}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid Section */}
          <div className="mt-32 max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black text-center text-[#2E2FCE] dark:text-[#a3aaeb] mb-12 tracking-tight">
              {statsTranslations[language as 'en' | 'fr' | 'ar']?.title || statsTranslations.en.title}
            </h2>

            {/* Top Row: Two Big Highlight Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Card 1: Students */}
              <div className="bg-[#FDD501] border-2 border-[#2E2FCE] shadow-[6px_6px_0px_#2E2FCE] rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#2E2FCE]">
                <span className="text-4xl md:text-5xl font-black text-[#2E2FCE] mb-1 leading-none">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.studentsVal || statsTranslations.en.studentsVal}
                </span>
                <span className="text-lg md:text-xl font-black text-[#2E2FCE] mb-3">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.studentsSub || statsTranslations.en.studentsSub}
                </span>
                <p className="text-xs font-bold text-[#2E2FCE]/80 max-w-sm leading-relaxed">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.studentsDesc || statsTranslations.en.studentsDesc}
                </p>
              </div>

              {/* Card 2: Views */}
              <div className="bg-[#FDD501] border-2 border-[#2E2FCE] shadow-[6px_6px_0px_#2E2FCE] rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#2E2FCE]">
                <span className="text-4xl md:text-5xl font-black text-[#2E2FCE] mb-1 leading-none">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.viewsVal || statsTranslations.en.viewsVal}
                </span>
                <span className="text-lg md:text-xl font-black text-[#2E2FCE] mb-3">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.viewsSub || statsTranslations.en.viewsSub}
                </span>
                <p className="text-xs font-bold text-[#2E2FCE]/80 max-w-sm leading-relaxed">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.viewsDesc || statsTranslations.en.viewsDesc}
                </p>
              </div>
            </div>

            {/* Bottom Row: Three White Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 3: Experiments */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-3xl md:text-4xl font-black text-[#2E2FCE] dark:text-[#a3aaeb] mb-1">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.expsVal || statsTranslations.en.expsVal}
                </span>
                <span className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.expsSub || statsTranslations.en.expsSub}
                </span>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.expsDesc || statsTranslations.en.expsDesc}
                </p>
              </div>

              {/* Card 4: Festivals */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-3xl md:text-4xl font-black text-[#2E2FCE] dark:text-[#a3aaeb] mb-1">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.festsVal || statsTranslations.en.festsVal}
                </span>
                <span className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.festsSub || statsTranslations.en.festsSub}
                </span>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.festsDesc || statsTranslations.en.festsDesc}
                </p>
              </div>

              {/* Card 5: Shows */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-3xl md:text-4xl font-black text-[#2E2FCE] dark:text-[#a3aaeb] mb-1">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.showsVal || statsTranslations.en.showsVal}
                </span>
                <span className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.showsSub || statsTranslations.en.showsSub}
                </span>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {statsTranslations[language as 'en' | 'fr' | 'ar']?.showsDesc || statsTranslations.en.showsDesc}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Platform Carousel Section */}
      <section className="py-24 bg-brand-50/30 dark:bg-slate-900/10">
        <AnimatedSection className="container mx-auto px-6 text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Explore the Platform.</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-lg font-medium">A sneak peek into the amazing worlds your child will explore.</p>
          </div>
          <ImageCarousel />
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-50/50 dark:bg-slate-900/50">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What's Inside?</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-lg">A comprehensive learning ecosystem designed for the next generation of creators.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Gamepad2, title: "Fun Games", color: "bg-[#2E2FCE]", text: "Learn coding logic through immersive puzzles and interactive challenges." },
              { icon: Brush, title: "Creative Projects", color: "bg-[#EA4335]", text: "Design your own digital worlds, from simple animations to complex games." },
              { icon: Bot, title: "Mentorship", color: "bg-[#34A853]", text: "Personalized guidance that adapts to your child's unique learning pace." },
              { icon: Award, title: "Skill Certification", color: "bg-[#FBBC05]", text: "Earn verifiable badges and certificates as you master new technologies." }
            ].map(feature => (
              <div key={feature.title} className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-500">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-md`}>
                  <feature.icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-lg">Three simple steps to unlock your child's potential.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 text-center relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800 hidden md:block -z-10"></div>
            {[
              { icon: <Star className="w-8 h-8" />, title: "1. Choose a Path", text: "Select from diverse coding adventures tailored to your child's age and interests." },
              { icon: <Gamepad2 className="w-8 h-8" />, title: "2. Interactive Play", text: "Master complex logic through gamified lessons that feel like play, not work." },
              { icon: <Bot className="w-8 h-8" />, title: "3. Build & Share", text: "Create real projects and share them with a community of young innovators." }
            ].map(step => (
              <div key={step.title} className="flex flex-col items-center group">
                <div className="w-20 h-20 mb-8 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800 text-brand-600 dark:text-brand-400">
                  {step.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium px-4">{step.text}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Learning Paths Preview */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/30">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Choose Your Adventure</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">Different paths for different goals. Start visually and graduate to real-world syntax.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { id: "block", title: "Block Coding", logo: "/assets/images/scratch_logo.svg", desc: "Drag and drop blocks to learn logic. Perfect for beginners mapping out their first games.", iconBg: "bg-[#EA4335]/10 dark:bg-[#EA4335]/20", glow: "bg-[#EA4335]/10 group-hover:bg-[#EA4335]/20", border: 'border-[#EA4335]/20 dark:border-[#EA4335]/30', age: "Ages 7-9" },
              { id: "js", title: "JavaScript", logo: "/assets/images/js_logo.svg", desc: "The language of the web. Build interactive websites and web-based games.", iconBg: "bg-[#FBBC05]/10 dark:bg-[#FBBC05]/20", glow: "bg-[#FBBC05]/10 group-hover:bg-[#FBBC05]/20", border: 'border-[#FBBC05]/20 dark:border-[#FBBC05]/30', age: "Ages 10-14" },
              { id: "python", title: "Python", logo: "/assets/images/python_logo.svg", desc: "Powerful yet easy to read. Dive into data, back-end logic, and AI concepts.", iconBg: "bg-[#34A853]/10 dark:bg-[#34A853]/20", glow: "bg-[#34A853]/10 group-hover:bg-[#34A853]/20", border: 'border-[#34A853]/20 dark:border-[#34A853]/30', age: "Ages 12-16+" }
            ].map(path => (
              <div key={path.id} className={`bg-white dark:bg-slate-800 rounded-3xl p-8 border hover:border-transparent ${path.border} hover:shadow-xl transition-all duration-500 group cursor-pointer relative overflow-hidden`}>
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl transition-all ${path.glow}`}></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 ${path.iconBg}`}>
                    <img src={path.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{path.age}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white relative z-10">{path.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-3 relative z-10">{path.desc}</p>
                <div className="flex items-center text-brand-600 dark:text-brand-400 font-bold group-hover:gap-2 transition-all relative z-10">
                  Explore Path <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="mt-40">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Invest in their Future</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">Simple, transparent plans for every stage of the journey.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard
                title="Starter"
                price="Free"
                features={["Basic Block Coding", "3 Interactive Lessons", "Community Access", "Public Profile"]}
                onGetStarted={onGetStarted}
              />
              <PricingCard
                title="Pro Explorer"
                price="190 DH"
                isPopular
                features={["All Programming Paths", "Unlimited Lessons", "AI Mentor Support", "Skill Certifications", "Advanced Projects"]}
                onGetStarted={onGetStarted}
              />
              <PricingCard
                title="Team/School"
                price="490 DH"
                features={["Up to 30 Students", "Teacher Dashboard", "Advanced Analytics", "Classroom Tools", "Priority Support"]}
                onGetStarted={onGetStarted}
              />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-white dark:bg-slate-950">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Trusted by Families</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-lg">Join a community of thousands of students learning to build the future.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: "Fatima Z.", role: "Parent", quote: "The curriculum is perfectly paced. My daughter went from zero coding knowledge to building her first game in weeks.", img: "https://picsum.photos/seed/fatima/100/100" },
              { name: "Omar, Age 9", role: "Student", quote: "I love how the mascot explains things. It doesn't feel like school at all, it feels like I'm on a mission!", img: "https://picsum.photos/seed/omar/100/100" },
              { name: "Mr. Ahmed", role: "STEM Educator", quote: "Finally, a platform that bridges the gap between block-based coding and real-world logic effectively.", img: "https://picsum.photos/seed/ahmed/100/100" }
            ].map(t => (
              <div key={t.name} className="bg-white dark:bg-slate-900/40 p-10 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-sm relative">
                <div className="absolute top-10 right-10 opacity-10">
                  <svg width="45" height="36" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 0C6.04416 0 0 6.04416 0 13.5V36H18V13.5H9C9 11.0147 11.0147 9 13.5 9V0ZM40.5 0C33.0442 0 27 6.04416 27 13.5V36H45V13.5H36C36 11.0147 38.0147 9 40.5 9V0Z" /></svg>
                </div>
                <div className="flex items-center mb-8">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full mr-4 object-cover ring-2 ring-slate-100 dark:ring-slate-800" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-brand-600 dark:text-brand-400 font-medium text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">"{t.quote}"</p>
                <div className="flex mt-8 text-[#FBBC05] gap-1"> {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-4 h-4" />)} </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-brand-50/50 dark:bg-slate-900/20 border-t border-b border-brand-100 dark:border-slate-800">
        <AnimatedSection className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Everything you need to know about the platform.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "What age group is this for?", a: "Our completely self-paced curriculum is designed for kids and teens aged 7 to 16+. We have different paths tailored to different cognitive levels, starting from visual block coding up to real-world syntax like Python." },
              { q: "Does my child need previous coding experience?", a: "Not at all! Our beginner paths assume zero prior knowledge. We slowly introduce computational thinking concepts through games before moving to actual code." },
              { q: "Is it safe for kids to use?", a: "Yes. Safety and privacy are our top priorities. There are no external links, ads, or direct messaging with strangers. Our community sharing features are heavily moderated." },
              { q: "What devices do I need?", a: "Code for Tomorrow runs entirely in your web browser. A standard laptop, Chromebook, or desktop computer with an internet connection is all you need. Tablets are also supported for block coding." }
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 pt-0 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA Section */}
      <section className="py-32">
        <AnimatedSection className="container mx-auto px-6">
          <div className="bg-brand-600 dark:bg-brand-500 rounded-[3rem] p-12 md:p-20 shadow-3xl shadow-brand-500/40 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-300 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to Start the Adventure?</h2>
              <p className="text-brand-100 mt-6 max-w-2xl mx-auto text-xl font-medium">Join thousands of young creators and unlock their potential today. Start your free trial now.</p>
              <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto bg-white text-brand-600 font-bold px-12 py-5 rounded-full hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  Get Started for Free <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-brand-200 text-sm font-semibold">No credit card required</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Newsletter Section */}
      <section className="pb-32 container mx-auto px-6">
        <AnimatedSection className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">Stay in the loop</h2>
            <p className="text-slate-400 font-medium">Get the latest coding tips, project ideas, and platform updates delivered to your inbox.</p>
          </div>
          <form className="w-full max-w-md flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600 rounded-full px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            />
            <button className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap">
              Subscribe <Send className="w-4 h-4" />
            </button>
          </form>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E2FCE] text-white border-t border-[#1a1f8c] font-sans relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {/* Column 1: Logo & Social Links */}
            <div className="flex flex-col items-center md:items-start space-y-6">
              <div className="flex items-center">
                <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-12 w-auto object-contain transition-transform hover:scale-105" />
              </div>
              
              {/* Social media icons - White on Blue */}
              <div className="flex items-center gap-5 justify-center md:justify-start">
                <a href="#" className="text-white hover:text-[#FDD501] transition-all hover:scale-110" aria-label="YouTube">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-[#FDD501] transition-all hover:scale-110" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/hicham-outaleb-04a49319a/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FDD501] transition-all hover:scale-110" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-[#FDD501] transition-all hover:scale-110" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://github.com/hichamoutaleb" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FDD501] transition-all hover:scale-110" aria-label="GitHub">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Column 2: Description */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-lg font-black text-[#FDD501] uppercase tracking-wider">Code for Tomorrow</h4>
              <p className="text-slate-100 text-sm leading-relaxed max-w-sm font-medium">
                Empowering the next generation with the tools to build the future. We turn coding into a lifelong passion through play, interactive learning, open-source collaboration, and technical documentation.
              </p>
            </div>

            {/* Column 3: Important Links */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-lg font-black text-[#FDD501] uppercase tracking-wider">Important Links</h4>
              <nav className="flex flex-col items-center md:items-start space-y-3 font-bold text-sm">
                <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="text-slate-100 hover:text-[#FDD501] transition-colors">Academy</a>
                <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="text-slate-100 hover:text-[#FDD501] transition-colors">CFTOS</a>
                <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="text-slate-100 hover:text-[#FDD501] transition-colors">Docs & Blog</a>
                <NavLink href="#features" className="text-slate-100 hover:text-[#FDD501] transition-colors">Features</NavLink>
                <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-100 hover:text-[#FDD501] transition-colors">
                  Join Us
                  <span className="w-5 h-5 rounded-full bg-[#25d366] hover:bg-[#20ba5a] flex items-center justify-center text-white transition-all p-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.618-1.016-5.078-2.87-6.932-1.854-1.854-4.318-2.873-6.93-2.875-5.399 0-9.799 4.4-9.802 9.802-.001 1.572.43 3.102 1.248 4.467l-.989 3.602 3.705-.972zm10.135-4.808c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                  </span>
                </a>
              </nav>
            </div>
          </div>

          {/* Policy Links & Copyright */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-[#FDD501]">
              <a href="#" className="hover:underline transition-all">Privacy Policy</a>
              <a href="#" className="hover:underline transition-all">Terms of Use</a>
              <a href="#" className="hover:underline transition-all">Delivery Policy</a>
              <a href="#" className="hover:underline transition-all">Return Policy</a>
            </div>
            <p className="text-xs text-slate-200 font-bold">
              All Rights Reserved @ Code for Tomorrow {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Floating buttons in corners */}
        {/* Left corner: WhatsApp and Scroll-to-Top */}
        <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40">
          <a
            href="https://wa.me/212600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#25d366] hover:bg-[#20ba5a] flex flex-center items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Contact on WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.618-1.016-5.078-2.87-6.932-1.854-1.854-4.318-2.873-6.93-2.875-5.399 0-9.799 4.4-9.802 9.802-.001 1.572.43 3.102 1.248 4.467l-.989 3.602 3.705-.972zm10.135-4.808c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-[#2E2FCE] shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200/50"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </div>

        {/* Right corner: Chat Widget Trigger */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => alert("Support chat is opening...")}
            className="w-12 h-12 rounded-full bg-[#f04f63] hover:bg-[#e03f53] flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Open support chat"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </footer>

    </div >
  );
};

export default LandingPage;
