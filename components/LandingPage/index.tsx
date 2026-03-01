import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'motion/react';
import { ChevronRight, X, Menu, Gamepad2, Brush, Bot, Award, Star, Twitter, Instagram, Facebook, Github, Linkedin, Mail } from 'lucide-react';
import Mascot from '../Mascot';

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

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLink: React.FC<{ href: string, children: React.ReactNode, className?: string }> = ({ href, children, className }) => (
    <a href={href} className={`font-bold transition-colors text-sm ${className}`}>
      {children}
    </a>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans overflow-x-hidden text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg">C</div>
            <span className="text-xl font-black italic tracking-tighter uppercase">Code for Tomorrow</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">Features</NavLink>
            <NavLink href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">How It Works</NavLink>
            <NavLink href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">Testimonials</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="hidden md:block bg-blue-600 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-500/20 transform hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
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
            <nav className="flex flex-col space-y-6 mt-12 text-lg">
              <NavLink href="#features" className="text-slate-700 dark:text-slate-200 hover:text-blue-600">Features</NavLink>
              <NavLink href="#how-it-works" className="text-slate-700 dark:text-slate-200 hover:text-blue-600">How It Works</NavLink>
              <NavLink href="#testimonials" className="text-slate-700 dark:text-slate-200 hover:text-blue-600">Testimonials</NavLink>
              <button 
                onClick={onGetStarted}
                className="w-full bg-blue-600 text-white font-black uppercase tracking-widest px-6 py-4 rounded-xl hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-500/20 transform hover:scale-105 active:scale-95 mt-6"
              >
                Get Started
              </button>
            </nav>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <main className="pt-32 md:pt-40 pb-20 container mx-auto px-6 text-center relative isolate">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
        <AnimatedSection>
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 transform hover:scale-110 transition-transform duration-500 cursor-pointer drop-shadow-2xl">
              <Mascot />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            Learning to Code is a 
            <br />
            <span className="text-blue-600">Great Adventure!</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
            Our platform makes learning fun with interactive games, cool projects, and friendly characters. Start your coding journey today!
          </p>
          <div className="mt-10 flex justify-center items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="bg-green-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/30 flex items-center gap-2 border-b-4 border-green-700 active:border-b-0 transform hover:-translate-y-1 active:translate-y-1"
            >
              Start Your Adventure <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </AnimatedSection>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-800">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black">What's Inside?</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">A world of fun and learning awaits!</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[ { icon: Gamepad2, title: "Fun Games", color: "border-orange-400", text: "Learn coding concepts by playing exciting games and solving puzzles." }, { icon: Brush, title: "Creative Projects", color: "border-purple-400", text: "Build your own animations, stories, and games. Let your imagination run wild!" }, { icon: Bot, title: "AI-Powered Guidance", color: "border-teal-400", text: "Our mascot and other characters will guide you on your learning journey." }, { icon: Award, title: "Rewards & Badges", color: "border-yellow-400", text: "Earn cool badges and rewards as you learn new skills and complete challenges." } ].map(feature => (
              <div key={feature.title} className={`bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-lg border-b-8 ${feature.color} text-center transform hover:-translate-y-2 transition-transform duration-300`}>
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" strokeWidth={2} />
                <h3 className="font-black text-xl mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">Start learning in just a few simple steps!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-200/50 dark:bg-blue-800/50 hidden md:block"></div>
             {[ { icon: '🗺️', title: "1. Pick an Adventure", text: "Choose a coding path that excites you, from web development to game design." }, { icon: '🕹️', title: "2. Play to Learn", text: "Complete fun challenges and interactive lessons to master new skills." }, { icon: '🚀', title: "3. Create & Share", text: "Use your new powers to build amazing projects and share them with friends." } ].map(step => (
              <div key={step.title} className="flex flex-col items-center relative bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                <div className="text-6xl md:text-8xl mb-4 bg-white dark:bg-slate-800 rounded-full p-4 shadow-md">{step.icon}</div>
                <h3 className="font-black text-xl md:text-2xl mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white dark:bg-slate-800">
        <AnimatedSection className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black">Loved by Parents & Kids</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">Don't just take our word for it. Here's what our users are saying.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ { name: "Sarah L.", role: "Parent", quote: "My daughter is so excited about coding now! The games make learning feel like playtime. I've seen her confidence skyrocket.", img: "https://picsum.photos/seed/sarah/100/100" }, { name: "Leo T.", role: "Student, Age 9", quote: "I made my own game! It was hard but the mascot helped me. It's the coolest thing I've ever done on a computer.", img: "https://picsum.photos/seed/leo/100/100" }, { name: "Mr. Davison", role: "Teacher", quote: "An incredible tool for the classroom. It aligns with our curriculum and gets students genuinely engaged with STEM.", img: "https://picsum.photos/seed/dave/100/100" } ].map(t => (
              <div key={t.name} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-black text-lg">{t.name}</h4>
                    <p className="text-blue-500 font-bold text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">"{t.quote}"</p>
                <div className="flex mt-4 text-yellow-400"> {[...Array(5)].map((_,i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)} </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <AnimatedSection className="container mx-auto px-6 text-center">
           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-12 shadow-2xl shadow-blue-500/30">
             <h2 className="text-3xl md:text-5xl font-black text-white">Ready to Start Your Adventure?</h2>
             <p className="text-blue-100 mt-4 max-w-xl mx-auto text-lg">Join thousands of young coders and unlock your creative potential today. It's free to get started!</p>
             <button 
                onClick={onGetStarted}
                className="mt-10 bg-white text-blue-600 font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2 border-b-4 border-slate-200 transform hover:-translate-y-1 active:translate-y-1 mx-auto"
              >
                Join for Free <ChevronRight className="w-5 h-5" />
              </button>
           </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-950 text-slate-400">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Project Info */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg">C</div>
                <span className="text-xl font-black text-white italic tracking-tighter uppercase">Code for Tomorrow</span>
              </div>
              <p className="text-sm pr-4">Our mission is to make coding accessible and fun for kids everywhere, solving the challenge of digital literacy by turning education into an adventure.</p>
            </div>
            
            {/* Navigation Links */}
            <div>
              <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Navigation</h5>
              <nav className="flex flex-col space-y-2">
                <NavLink href="#" className="hover:text-white">Home</NavLink>
                <NavLink href="#features" className="hover:text-white">Features</NavLink>
                <NavLink href="#how-it-works" className="hover:text-white">How It Works</NavLink>
                <NavLink href="#" className="hover:text-white">About</NavLink>
                <NavLink href="#" className="hover:text-white">Contact</NavLink>
              </nav>
            </div>

            {/* Creator Info */}
            <div>
              <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Creator</h5>
              <h6 className="font-bold text-slate-200">Hicham Outaleb</h6>
              <p className="text-xs text-blue-400 mb-2">Founder, Developer, Educator</p>
              <p className="text-sm">My mission is to empower the next generation with the tools to build the future.</p>
            </div>

            {/* Professional Links */}
            <div>
              <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Connect</h5>
              <div className="flex flex-col space-y-3">
                <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9l8 4 8-4"/></svg>
                  <span>Portfolio</span>
                </a>
                <a href="mailto:hichamoutaleb7@gmail.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Email Me</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Code for Tomorrow. Built with passion by Hicham Outaleb.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
