import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { motion, useInView, useAnimation } from 'motion/react';
import { Terminal, Play, CheckCircle, Menu, X, ArrowRight, BookOpen, Layers, Users, Star, MessageSquare, ChevronUp, Check, Zap, ShieldCheck, Building2 } from 'lucide-react';
import Mascot from '../Mascot';
import { useLanguage } from '../../contexts/LanguageContext';
import { RadialOrbitalTimelineDemo } from '@/components/ui/demo';
import { GlowCard } from '@/components/ui/spotlight-card';
import { HeroScrollDemo } from '@/components/ui/scroll-demo';
import { PaymentModal } from '../PaymentModal';


const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } });
    }
  }, [isInView, controls]);

  return <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={controls} className={className}>{children}</motion.div>;
};

const LandingPage: React.FC<{ currentUser: User | null, onGetStarted: () => void }> = ({ currentUser, onGetStarted }) => {
  const { language } = useLanguage();
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{ name: string; price: string; interval: 'monthly' | 'yearly' }>({
    name: 'Pioneer Pro',
    price: '$19',
    interval: 'monthly'
  });

  const handleOpenCheckout = (name: string, price: string) => {
    setSelectedPlanDetails({
      name,
      price,
      interval: isYearlyBilling ? 'yearly' : 'monthly'
    });
    setIsPaymentModalOpen(true);
  };

  const port = window.location.port ? `:${window.location.port}` : '';

  const getPlatformHref = (subdomain: 'academy' | 'os' | 'docs', path: string) => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.endsWith('palycofoto.club')) return path;
    return `http://${subdomain}.palycofoto.club${port}`;
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, subdomain: 'academy' | 'os' | 'docs', path: string) => {
    if (!currentUser) {
      e.preventDefault();
      const hostname = window.location.hostname;
      const targetRoute = hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.endsWith('palycofoto.club')
        ? path : `http://${subdomain}.palycofoto.club${port}`;
      localStorage.setItem('lastVisitedRoute', targetRoute);
      const authPath = hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.endsWith('palycofoto.club')
        ? '/auth' : `http://palycofoto.club${port}/auth`;
      window.location.href = authPath;
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div className="font-sans overflow-x-hidden selection:bg-[#FBBF24] selection:text-[#111827]">
      
      {/* 1. Sleek Floating Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0a0f1d]/80 backdrop-blur-md z-50 border-b border-[#111827] transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group shrink-0">
            <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </div>

          <nav className="hidden lg:flex items-center gap-4">
            <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="text-white hover:text-[#FBBF24] transition-colors text-sm font-bold tracking-wide">
              Academy
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="text-white hover:text-[#FBBF24] transition-colors text-sm font-bold tracking-wide">
              Open Source
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="text-white hover:text-[#FBBF24] transition-colors text-sm font-bold tracking-wide">
              Docs & Blog
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href="#pricing" className="text-white hover:text-[#FBBF24] transition-colors text-sm font-bold tracking-wide">
              Pricing
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href="/about" className="text-white hover:text-[#FBBF24] transition-colors text-sm font-bold tracking-wide">
              About
            </a>
          </nav>

          <div className="hidden md:flex items-center">
            <button onClick={onGetStarted} className="bg-[#FBBF24] text-[#111827] font-bold px-6 py-2.5 rounded-full hover:bg-[#f59e0b] transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-[#FBBF24]/20 cursor-pointer">
              Launch Ecosystem
            </button>
          </div>

          <div className="flex md:hidden items-center">
            <button className="p-1 text-white hover:text-[#FBBF24]" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#111827]/95 backdrop-blur-sm z-50 md:hidden flex flex-col p-8">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-1 text-white hover:text-[#FBBF24]">
            <X className="w-8 h-8" />
          </button>
          <nav className="flex flex-col space-y-6 mt-16 text-center">
            <a href={getPlatformHref('academy', '/dashboard')} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Academy</a>
            <a href={getPlatformHref('os', '/cftos')} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Open Source</a>
            <a href={getPlatformHref('docs', '/blog')} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Docs & Blog</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Pricing</a>
            <a href="/about" className="text-2xl font-bold text-white hover:text-[#FBBF24]">About</a>
            <button onClick={() => { setIsMenuOpen(false); onGetStarted(); }} className="mt-8 bg-[#FBBF24] text-[#111827] font-bold px-8 py-4 rounded-full text-xl hover:bg-[#f59e0b]">
              Launch Ecosystem
            </button>
          </nav>
        </div>
      )}

      {/* 2. Premium Hero Section with Built-in Portal Grid */}
      <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 bg-[#0a0f1d] text-white overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#111827] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#FBBF24]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <AnimatedSection>
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 transition-transform duration-700 hover:scale-110 cursor-pointer drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                <Mascot />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              Building the Tech
              <br />
              <span className="text-[#FBBF24]">Ecosystem for Tomorrow.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-8 font-medium">
              An all-in-one platform for interactive learning, open-source collaboration, and advanced technical documentation.
            </p>

            {/* Built-in Portal Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
              <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
                <GlowCard glowColor="orange" customSize={true} className="p-8 h-full flex flex-col justify-between">
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-center overflow-hidden mb-6">
                      <img src="/assets/images/logo.png" alt="CFT Academy" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#FBBF24] transition-colors">CFT Academy</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">Interactive coding adventures, gamified lessons, and curriculum builders tailored for all skill levels.</p>
                  </div>
                  <span className="inline-flex items-center text-[#FBBF24] font-bold text-sm">Enter Academy <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                </GlowCard>
              </a>

              <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
                <GlowCard glowColor="purple" customSize={true} className="p-8 h-full flex flex-col justify-between">
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-center overflow-hidden mb-6">
                      <img src="/assets/images/cftos_logo.jpg" alt="CFTOS" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#FBBF24] transition-colors">CFTOS</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">A collaborative environment for building autonomous AI agents and contributing to open-source software.</p>
                  </div>
                  <span className="inline-flex items-center text-[#FBBF24] font-bold text-sm">Open Platform <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                </GlowCard>
              </a>

              <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
                <GlowCard glowColor="blue" customSize={true} className="p-8 h-full flex flex-col justify-between">
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-center text-[#FBBF24] mb-6">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#FBBF24] transition-colors">Docs & Blog</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">In-depth technical guides, tutorials, and insights authored by our community of engineers.</p>
                  </div>
                  <span className="inline-flex items-center text-[#FBBF24] font-bold text-sm">Read Docs <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                </GlowCard>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. Two-Column Solution Split */}
      <section className="py-12 bg-white border-b border-slate-100">
        <AnimatedSection className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/5 text-[#111827] font-bold mb-6 text-sm">
                <Layers className="w-4 h-4 text-[#FBBF24]" /> Unified Ecosystem
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] leading-tight mb-6">
                Learn, Build, and Ship together.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We remove the friction between learning syntax and deploying real applications. Our platform seamlessly connects interactive education with robust open-source collaboration tools.
              </p>
            </div>

            {/* Right Column: Modern UI List */}
            <div className="space-y-6">
              {[
                { icon: BookOpen, title: "Structured Curriculum", desc: "Gamified lessons that build a strong foundation in logic and syntax." },
                { icon: Terminal, title: "Real-World Environments", desc: "Transition from block coding directly into our robust IDE workspaces." },
                { icon: Users, title: "Community Collaboration", desc: "Join open-source projects and get code reviews from experienced mentors." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#FBBF24] hover:shadow-md transition-all">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#111827] flex items-center justify-center text-[#FBBF24]">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#111827] mb-2">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 4. Clean Interactive Code Block */}
      <section className="py-12 bg-slate-50">
        <AnimatedSection className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-[#111827] rounded-2xl p-4 shadow-2xl border border-slate-800 font-mono text-sm relative">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <span className="text-slate-400 ml-4 font-semibold text-xs">hello.js</span>
                </div>
                <div className="bg-[#0a0f1d] p-6 rounded-xl text-slate-300 h-56 overflow-hidden relative">
                  <pre className="whitespace-pre-wrap"><code className="text-[#FBBF24]">{demoCode}</code><span className="animate-pulse">_</span></pre>
                  {demoCode.length === fullCode.length && !showOutput && (
                    <button onClick={() => setShowOutput(true)} className="absolute bottom-6 right-6 bg-[#FBBF24] hover:bg-[#f59e0b] text-[#111827] font-bold py-2 px-6 rounded-md flex items-center gap-2 transition-all shadow-lg">
                      <Play className="w-4 h-4 fill-current" /> Run
                    </button>
                  )}
                </div>
                <div className={`mt-4 bg-[#0a0f1d] rounded-xl border border-slate-800 transition-all overflow-hidden ${showOutput ? 'h-24 opacity-100 p-4' : 'h-0 opacity-0 py-0 border-transparent p-0'}`}>
                  <p className="text-slate-500 text-xs mb-1">Console Output:</p>
                  <p className="text-white font-semibold">{showOutput ? "> Hello, World!" : ""}</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-6">Write code, instantly.</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Our in-browser editor provides a safe, fully-featured sandbox. Experience live syntax highlighting, instant execution, and comprehensive error reporting without configuring a local environment.
              </p>
              <ul className="space-y-4">
                {["Zero setup required", "Instant execution feedback", "Safe sandbox architecture"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-[#111827]">
                    <CheckCircle className="w-6 h-6 text-[#FBBF24]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 24/7 AI Agents Presentation */}
      <section className="pt-16 pb-8 bg-[#060814] text-white overflow-hidden relative border-t border-[#111827]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <AnimatedSection className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Running 24/7 Every Single Day</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Powered by <span className="text-[#FBBF24]">3 Specialized AI Agents</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
              Our autonomous AI agents work non-stop 24 hours a day, 7 days a week, 365 days a year to personalize learning, synthesize curriculum, and support school partners every single day.
            </p>
          </AnimatedSection>

          <AnimatedSection className="w-full">
            <RadialOrbitalTimelineDemo />
          </AnimatedSection>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-[#0a0f1d] text-white relative overflow-hidden border-t border-slate-800">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
              <span>Transparent & Accessible Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
              Flexible Plans for <span className="text-[#FBBF24]">Every Learner & Institution</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              Start learning for free, upgrade for unlimited AI tutoring, or deploy an offline-first CS lab in your school.
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-bold ${!isYearlyBilling ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
              <button
                onClick={() => setIsYearlyBilling(!isYearlyBilling)}
                className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center transition-colors cursor-pointer relative"
              >
                <div className={`w-6 h-6 rounded-full bg-[#FBBF24] shadow-md transform transition-transform ${isYearlyBilling ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-bold flex items-center gap-2 ${isYearlyBilling ? 'text-white' : 'text-slate-400'}`}>
                <span>Yearly</span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </AnimatedSection>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* TIER 1: STARTER FREE */}
            <AnimatedSection className="h-full">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-slate-700 transition-all shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Starter</span>
                    <Zap className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Free Explorer</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Essential coding challenges and playground for self-directed learners.
                  </p>

                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">$0</span>
                    <span className="text-slate-400 text-sm font-medium ml-2">/ forever</span>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800/80 pt-6 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Access to 60+ Basic CS & Logic Challenges</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Standard AI Tutor (10 queries/day)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Public Code Sandbox & Playground</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Community Discussion Forum</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckout('Free Explorer', '$0')}
                  className="w-full py-4 mt-8 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all cursor-pointer border border-slate-700"
                >
                  Get Started Free
                </button>
              </div>
            </AnimatedSection>

            {/* TIER 2: PIONEER PRO (MOST POPULAR) */}
            <AnimatedSection className="h-full">
              <div className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-8 flex flex-col justify-between h-full relative shadow-2xl shadow-amber-400/10 transform lg:-translate-y-2">
                {/* Popular Pill */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  🔥 Most Popular
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4 mt-1">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400">Pioneer Pro</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro Mastery</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Full AI agent suite, 100+ challenges, unlimited diagnostics & multi-language support.
                  </p>

                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">
                      {isYearlyBilling ? '$15' : '$19'}
                    </span>
                    <span className="text-slate-400 text-sm font-medium ml-2">
                      / month {isYearlyBilling && '(billed yearly)'}
                    </span>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800/80 pt-6 text-sm text-white">
                    <div className="flex items-center gap-3 font-semibold">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>All 100+ CS, Python, Web & Kids Challenges</span>
                    </div>
                    <div className="flex items-center gap-3 font-semibold">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Unlimited AI Tutor & Real-time Diagnostics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Multi-Language Support (EN, FR, AR)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>3 Specialized Autonomous AI Agents Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Interactive Math & Speaking Voice Labs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Priority Support & Certifications</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckout('Pioneer Pro', isYearlyBilling ? '$15' : '$19')}
                  className="w-full py-4 mt-8 rounded-2xl bg-[#FBBF24] hover:bg-[#f59e0b] text-[#111827] font-black text-sm transition-all shadow-lg shadow-[#FBBF24]/25 active:scale-95 cursor-pointer"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </AnimatedSection>

            {/* TIER 3: ENTERPRISE & SCHOOLS */}
            <AnimatedSection className="h-full">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-slate-700 transition-all shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Institutional</span>
                    <Building2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Schools & B2G</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Offline-first classroom deployment, seat management & custom curriculum engineering.
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-black text-white">Custom</span>
                    <span className="text-slate-400 text-sm font-medium ml-2">/ school license</span>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800/80 pt-6 text-sm text-slate-300">
                    <div className="flex items-center gap-3 font-semibold text-white">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Offline Hotspot & Ollama Local Server Setup</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Curriculum Factory Agent Customization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Student Analytics & Teacher Mastery Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Bulk Seat Allocations & NGO Grant Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Dedicated Account Manager & 24/7 SLA</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckout('Schools & Enterprise', '$499')}
                  className="w-full py-4 mt-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Contact Sales & Onboard
                </button>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* 6. Final Action Module (CTA Block) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 text-center">
        <AnimatedSection className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-[#111827] mb-8">Ready to build the future?</h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">Join thousands of students, educators, and developers in the most comprehensive tech ecosystem.</p>
          <button onClick={onGetStarted} className="bg-[#FBBF24] text-[#111827] font-bold px-10 py-5 rounded-full text-lg hover:bg-[#f59e0b] transition-all shadow-xl shadow-[#FBBF24]/20 active:scale-95 inline-flex items-center gap-3">
            Launch Ecosystem <ArrowRight className="w-6 h-6" />
          </button>
        </AnimatedSection>
      </section>

      {/* Scroll Animation Showcase */}
      <HeroScrollDemo />

      {/* Footer */}
      <footer className="bg-[#0a0f1d] text-slate-400 border-t border-white/5">
        {/* Top CTA Banner */}
        <div className="border-b border-white/5">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Ready to start your journey?</h3>
              <p className="text-slate-400 text-lg">Join thousands of learners building the future of technology.</p>
            </div>
            <button onClick={onGetStarted} className="bg-[#FBBF24] text-[#111827] font-bold px-8 py-4 rounded-full hover:bg-[#f59e0b] transition-all active:scale-95 shadow-lg shadow-[#FBBF24]/20 whitespace-nowrap text-lg">
              Get Started Free
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

            {/* Column 1: Brand */}
            <div className="lg:col-span-1">
              <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-12 w-auto object-contain mb-5" />
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                An all-in-one ecosystem for interactive learning, open-source collaboration, and technical documentation. Empowering the next generation of developers.
              </p>
              <div className="flex items-center gap-4">
                {/* GitHub */}
                <a href="https://github.com/codefortomorrow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24]/50 hover:bg-[#FBBF24]/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                {/* Twitter/X */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24]/50 hover:bg-[#FBBF24]/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24]/50 hover:bg-[#FBBF24]/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#FBBF24] hover:border-[#FBBF24]/50 hover:bg-[#FBBF24]/10 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="hover:text-[#FBBF24] transition-colors text-sm">CFT Academy</a></li>
                <li><a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="hover:text-[#FBBF24] transition-colors text-sm">CFTOS – Open Source</a></li>
                <li><a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="hover:text-[#FBBF24] transition-colors text-sm">Docs & Blog</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">AI Tutor</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Code Playground</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Math Games</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="hover:text-[#FBBF24] transition-colors text-sm font-bold text-white/90">About Us</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Getting Started Guide</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">API Documentation</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Community Forum</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Changelog</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FBBF24] transition-colors text-sm">Status Page</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Stay Updated</h4>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">Subscribe to our newsletter for the latest updates, tutorials, and community highlights.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/30 transition-all"
                />
                <button type="submit" className="w-full bg-[#FBBF24] text-[#111827] font-bold py-3 rounded-xl hover:bg-[#f59e0b] transition-all active:scale-[0.98] text-sm">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-3">No spam, unsubscribe anytime.</p>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="container mx-auto px-6 py-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Code for Tomorrow. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <a href="/about" className="text-slate-500 hover:text-[#FBBF24] transition-colors">About Us</a>
              <a href="#" className="text-slate-500 hover:text-[#FBBF24] transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-[#FBBF24] transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-[#FBBF24] transition-colors">Cookie Policy</a>
              <a href="#" className="text-slate-500 hover:text-[#FBBF24] transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-12 h-12 rounded-full bg-[#111827] flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer" aria-label="Scroll to top">
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

      {/* REAL PAYMENT GATEWAY MODAL */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planName={selectedPlanDetails.name}
        planPrice={selectedPlanDetails.price}
        planInterval={selectedPlanDetails.interval}
        onPaymentSuccess={() => {
          setTimeout(() => {
            onGetStarted();
          }, 2000);
        }}
      />

    </div>
  );
};

export default LandingPage;
