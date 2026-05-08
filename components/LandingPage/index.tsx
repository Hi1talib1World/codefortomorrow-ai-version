import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'motion/react';
import { ChevronRight, X, Menu, Gamepad2, Brush, Bot, Award, Star, Twitter, Instagram, Facebook, Github, Linkedin, Mail, Code, Terminal, Cpu, ChevronDown, CheckCircle, Play, Users, Rocket, Globe, Languages, ShieldCheck, Zap, Users2, Send } from 'lucide-react';
import Mascot from '../Mascot';
import { ImageCarousel } from '../ImageCarousel';

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
  <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 ${isPopular ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-2xl shadow-brand-500/10 scale-105 z-10' : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:scale-[1.02]'}`}>
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

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
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
      <header className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-50 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <img src="/assets/images/cofoto.png" alt="Code for Tomorrow Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold tracking-tight uppercase">Code for Tomorrow</span>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink href="#features" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Features</NavLink>
            <NavLink href="#how-it-works" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium">How It Works</NavLink>
            <NavLink href="#testimonials" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Testimonials</NavLink>
            <Link to="/blog" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-colors text-sm">Blog</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={onGetStarted}
              className="hidden md:flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-brand-500 transition-all text-sm shadow-xl shadow-brand-500/25 active:scale-95"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
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
            <div className="flex items-center space-x-3 cursor-pointer group">
              <img src="/assets/images/cofoto.png" alt="Code for Tomorrow Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold tracking-tight uppercase">Code for Tomorrow</span>
            </div>
            <nav className="hidden md:flex items-center space-x-10">
              <NavLink href="#features" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Features</NavLink>
              <NavLink href="#how-it-works" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium">How It Works</NavLink>
              <NavLink href="#testimonials" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Testimonials</NavLink>
              <Link to="/blog" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-colors text-sm">Blog</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="hidden md:flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-brand-500 transition-all text-sm shadow-xl shadow-brand-500/25 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <main className="pt-32 md:pt-48 pb-24 container mx-auto px-6 text-center relative isolate">
        {/* Decorative background elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <AnimatedSection>
          <div className="relative inline-block mb-10">
            <div className="absolute -inset-4 bg-[#4285F4]/10 rounded-full blur-2xl"></div>
            <div className="w-32 h-32 md:w-44 md:h-44 transform hover:scale-105 transition-all duration-700 cursor-pointer drop-shadow-[0_20px_50px_rgba(66,133,244,0.3)] relative">
              <Mascot />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            Learning to Code is a
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] dark:from-[#8ab4f8] dark:to-[#fdd663]">Great Adventure.</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-8 text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
            Empower your child with the language of the future. Our platform turns complex concepts into interactive play.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-brand-600 text-white font-semibold px-10 py-4 rounded-full hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95"
            >
              Start Learning Now <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 rounded-full border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              View Curriculum
            </button>
          </div>
        </AnimatedSection>

        {/* Trusted Partners */}
        <AnimatedSection className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800/50">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Trusted by families and educators from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2 font-black text-xl"><Globe className="w-6 h-6" /> GLOBAL ACADEMY</div>
            <div className="flex items-center gap-2 font-black text-xl"><Cpu className="w-6 h-6" /> TECH KIDS</div>
            <div className="flex items-center gap-2 font-black text-xl"><Bot className="w-6 h-6" /> Junior</div>
            <div className="flex items-center gap-2 font-black text-xl"><Zap className="w-6 h-6" /> FUTURE LABS</div>
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
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-3.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2 transform hover:-translate-y-1"
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

          {/* Stats Grid */}
          <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <StatCard icon={Users} value="50k+" label="Active Students" color="bg-blue-500" />
            <StatCard icon={Code} value="1M+" label="Lines of Code" color="bg-emerald-500" />
            <StatCard icon={Rocket} value="500+" label="Lessons" color="bg-orange-500" />
            <StatCard icon={Star} value="4.9/5" label="User Rating" color="bg-amber-500" />
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
              { icon: Gamepad2, title: "Fun Games", color: "bg-[#4285F4]", text: "Learn coding logic through immersive puzzles and interactive challenges." },
              { icon: Brush, title: "Creative Projects", color: "bg-[#EA4335]", text: "Design your own digital worlds, from simple animations to complex games." },
              { icon: Bot, title: "Mentorship", color: "bg-[#34A853]", text: "Personalized guidance that adapts to your child's unique learning pace." },
              { icon: Award, title: "Skill Certification", color: "bg-[#FBBC05]", text: "Earn verifiable badges and certificates as you master new technologies." }
            ].map(feature => (
              <div key={feature.title} className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-500`}>
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
                <div className="w-20 h-20 mb-8 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500 text-brand-600 dark:text-brand-400">
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
              { id: "block", title: "Block Coding", icon: Gamepad2, desc: "Drag and drop blocks to learn logic. Perfect for beginners mapping out their first games.", iconBg: "bg-[#EA4335]/10 dark:bg-[#EA4335]/20", iconColor: "text-[#EA4335]", glow: "bg-[#EA4335]/10 group-hover:bg-[#EA4335]/20", border: 'border-[#EA4335]/20 dark:border-[#EA4335]/30', age: "Ages 7-9" },
              { id: "js", title: "JavaScript", icon: Code, desc: "The language of the web. Build interactive websites and web-based games.", iconBg: "bg-[#FBBC05]/10 dark:bg-[#FBBC05]/20", iconColor: "text-[#FBBC05] dark:text-[#FDE293]", glow: "bg-[#FBBC05]/10 group-hover:bg-[#FBBC05]/20", border: 'border-[#FBBC05]/20 dark:border-[#FBBC05]/30', age: "Ages 10-14" },
              { id: "python", title: "Python", icon: Cpu, desc: "Powerful yet easy to read. Dive into data, back-end logic, and AI concepts.", iconBg: "bg-[#34A853]/10 dark:bg-[#34A853]/20", iconColor: "text-[#34A853]", glow: "bg-[#34A853]/10 group-hover:bg-[#34A853]/20", border: 'border-[#34A853]/20 dark:border-[#34A853]/30', age: "Ages 12-16+" }
            ].map(path => (
              <div key={path.id} className={`bg-white dark:bg-slate-800 rounded-3xl p-8 border hover:border-transparent ${path.border} hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden`}>
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl transition-all ${path.glow}`}></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl font-bold flex items-center justify-center p-3 ${path.iconBg} ${path.iconColor}`}>
                    <path.icon className="w-full h-full" strokeWidth={2} />
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
                  className="w-full sm:w-auto bg-white text-brand-600 font-bold px-12 py-5 rounded-full hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95"
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
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {/* Project Info */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-8">
                <img src="/assets/images/cofoto.png" alt="Code for Tomorrow Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg" />
                <span className="text-lg font-bold text-white tracking-tight uppercase">Code for Tomorrow</span>
              </div>
              <p className="text-base leading-relaxed mb-6">Empowering the next generation with the tools to build the future. We turn coding into a lifelong passion through play and creativity.</p>
              <div className="flex items-center gap-4 mb-8">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="https://github.com/hichamoutaleb" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Github className="w-5 h-5" /></a>
                <a href="https://www.linkedin.com/in/hicham-outaleb-04a49319a/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                <a href="#" className="flex flex-1 items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all w-full sm:w-auto">
                  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 font-medium leading-none mb-1">Download on the</span>
                    <span className="text-sm font-bold leading-none">App Store</span>
                  </div>
                </a>
                <a href="#" className="flex flex-1 items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all w-full sm:w-auto">
                  <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current"><path d="M325.3 234.3L104.6 13.6C100.9 9.8 96 11.2 96 16v480c0 4.8 4.9 6.2 8.6 2.4l220.7-220.7c3.1-3.1 3.1-8.2 0-11.3z"/><path d="M104.6 13.6l220.7 220.7 75.7-75.7L116 19.5c-4.3-2.5-9.4-1.2-11.4-5.9z"/><path d="M325.3 277.7l-220.7 220.7c2 4.7 7.1 6 11.4 3.5l285-139.1-75.7-85.1z"/><path d="M401 158.6l-75.7 75.7 75.7 85.1 79.5-38.8c4.6-2.2 4.6-9.1 0-11.3l-79.5-50.7z"/></svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 font-medium leading-none mb-1">GET IT ON</span>
                    <span className="text-sm font-bold leading-none">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h5 className="font-bold text-white mb-8 uppercase tracking-widest text-xs">Platform</h5>
              <nav className="flex flex-col space-y-4">
                <NavLink href="#" className="hover:text-white font-medium">Curriculum</NavLink>
                <NavLink href="#features" className="hover:text-white font-medium">Features</NavLink>
                <NavLink href="#how-it-works" className="hover:text-white font-medium">How It Works</NavLink>
                <NavLink href="#pricing" className="hover:text-white font-medium">Pricing</NavLink>
                <Link to="/blog" className="hover:text-white font-medium text-sm transition-colors">Blog</Link>
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h5 className="font-bold text-white mb-8 uppercase tracking-widest text-xs">Resources</h5>
              <nav className="flex flex-col space-y-4">
                <NavLink href="#" className="hover:text-white font-medium">Documentation</NavLink>
                <NavLink href="#" className="hover:text-white font-medium">Parent Guide</NavLink>
                <NavLink href="#" className="hover:text-white font-medium">Educator Portal</NavLink>
                <NavLink href="#" className="hover:text-white font-medium">Community</NavLink>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-bold text-white mb-8 uppercase tracking-widest text-xs">Get in Touch</h5>
              <div className="flex flex-col space-y-4">
                <a href="mailto:hichamoutaleb7@gmail.com" className="flex items-center space-x-3 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-brand-500" />
                  <span className="font-medium">hichamoutaleb7@gmail.com</span>
                </a>
                <div className="pt-4">
                  <p className="text-sm font-semibold text-slate-300">Hicham Outaleb</p>
                  <p className="text-xs text-slate-500">Founder & Lead Developer</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} Code for Tomorrow. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div >
  );
};

export default LandingPage;
