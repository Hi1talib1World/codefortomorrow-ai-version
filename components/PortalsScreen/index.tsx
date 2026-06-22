import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Terminal, ShieldAlert, ArrowLeft, ExternalLink, Sparkles, Code, Globe, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PortalsScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isAr = language === 'ar';

  const portals = [
    {
      id: 'academy',
      title: isAr ? 'أكاديمية CFT' : 'CFT Academy',
      description: isAr 
        ? 'مغامرات برمجة تفاعلية، دروس ممتعة، ومناهج تعليمية مخصصة لجميع مستويات المهارة.'
        : 'Interactive coding adventures, gamified lessons, and curriculum builders tailored for all skill levels.',
      actionText: isAr ? 'دخول الأكاديمية' : 'Enter Academy',
      route: '/dashboard',
      accentColor: 'amber',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'group-hover:border-amber-500/40',
      btnBg: 'bg-amber-500 hover:bg-amber-600 text-black',
      iconContainer: 'bg-[#0056D2]/10 border border-[#0056D2]/20 text-[#0056D2]',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-inner">
          <img src="/assets/images/logo.png" alt="CFT Academy" className="w-full h-full object-contain" />
        </div>
      )
    },
    {
      id: 'cftos',
      title: isAr ? 'منصة CFTOS' : 'CFTOS',
      description: isAr 
        ? 'بيئة تعاونية لبناء وكلاء الذكاء الاصطناعي المستقلين والمساهمة في البرمجيات مفتوحة المصدر.'
        : 'A collaborative environment for building autonomous AI agents and contributing to open-source software.',
      actionText: isAr ? 'فتح المنصة' : 'Open Platform',
      route: '/cftos',
      accentColor: 'emerald',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'group-hover:border-emerald-500/40',
      btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-[#09090b] border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
          <span className="text-[10px] font-black text-emerald-400 font-mono tracking-tighter">CFTOS</span>
        </div>
      )
    },
    {
      id: 'blog',
      title: isAr ? 'المدونة والوثائق' : 'Docs & Blog',
      description: isAr 
        ? 'أدلة تقنية مفصلة، دروس تعليمية، ورؤى يكتبها مجتمع المهندسين لدينا.'
        : 'In-depth technical guides, tutorials, and insights authored by our community of engineers.',
      actionText: isAr ? 'قراءة المدونة' : 'Read Docs',
      route: '/blog',
      accentColor: 'indigo',
      glowColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'group-hover:border-indigo-500/40',
      btnBg: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      icon: (
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-inner">
          <Terminal className="w-6 h-6" />
        </div>
      )
    }
  ];

  const handlePortalNavigate = (route: string) => {
    navigate(route);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-white flex flex-col font-sans relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic glow backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-emerald-500/5 to-purple-500/5 blur-[120px] pointer-events-none"></div>

      {/* Decorative starry backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">C4T ECOSYSTEM</span>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-800 font-semibold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isAr ? 'العودة' : 'Back'}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 z-10 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'بوابات التعلم والتطوير' : 'Unified Workspace Portals'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-350">
            {isAr ? 'اختر وجهتك المفضلة' : 'Select Your Destination'}
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-medium">
            {isAr 
              ? 'تنقل بسهولة بين أكاديمية التعلم والمنصة المفتوحة ومدونة المطورين لدينا.'
              : 'Easily transition between our gamified learning portal, open-source AI playground, and engineering documentation.'}
          </p>
        </motion.div>

        {/* Portals Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
        >
          {portals.map((portal) => (
            <motion.div
              key={portal.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => handlePortalNavigate(portal.route)}
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-slate-900/60"
              style={{
                boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`
              }}
            >
              {/* Radial glow on card hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle 220px at 50% 10%, ${portal.glowColor}, transparent 70%)`
                }}
              ></div>

              {/* Dynamic decorative light border gradient on hover */}
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent group-hover:via-${portal.accentColor}-500/50 transition-all duration-500`}></div>

              <div className="flex flex-col h-full relative z-10 space-y-6">
                {/* Header of the card */}
                <div className="flex items-center justify-between">
                  {portal.icon}
                  <div className={`w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1`}>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {portal.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800/60">
                  <div className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all duration-300 ${portal.btnBg} shadow-lg shadow-black/10`}>
                    <span>{portal.actionText}</span>
                    <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="w-full py-8 text-center text-slate-600 text-xs font-mono border-t border-slate-900/40 z-10">
        <p>© 2026 Code for Tomorrow. All platforms are seamlessly interconnected.</p>
      </footer>
    </div>
  );
}
