import React, { useState, useEffect, useRef } from 'react';
import { User, Language } from '../../types';
import { motion, useInView, useAnimation } from 'motion/react';
import { Terminal, Play, CheckCircle, Menu, X, ArrowRight, BookOpen, Layers, Users, Star, MessageSquare, ChevronUp, Check, Zap, ShieldCheck, Building2, Globe, ChevronDown } from 'lucide-react';
import Mascot from '../Mascot';
import { useLanguage } from '../../contexts/LanguageContext';
import { RadialOrbitalTimelineDemo } from '@/components/ui/demo';
import { GlowCard } from '@/components/ui/spotlight-card';
import { HeroScrollDemo } from '@/components/ui/scroll-demo';
import { PaymentModal } from '../PaymentModal';
import { ContactModal } from '../ContactModal';


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

export type CurrencyCode = 'USD' | 'MAD' | 'EUR';

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  freePrice: string;
  proMonthly: string;
  proYearly: string;
  enterprisePrice: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    flag: '🇺🇸',
    freePrice: '$0',
    proMonthly: '$19',
    proYearly: '$15',
    enterprisePrice: '$499'
  },
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    label: 'MAD (DH)',
    flag: '🇲🇦',
    freePrice: '0 DH',
    proMonthly: '190 DH',
    proYearly: '150 DH',
    enterprisePrice: '4,990 DH'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    flag: '🇪🇺',
    freePrice: '0 €',
    proMonthly: '18 €',
    proYearly: '14 €',
    enterprisePrice: '460 €'
  }
};

const LANDING_I18N: Record<Language, Record<string, string>> = {
  en: {
    heroTitle1: 'Building the Tech',
    heroTitle2: 'Ecosystem for Tomorrow.',
    heroDesc: 'An all-in-one platform for interactive learning, open-source collaboration, and advanced technical documentation.',
    navAcademy: 'Academy',
    navOS: 'Open Source',
    navDocs: 'Docs & Blog',
    navPricing: 'Pricing',
    navAbout: 'About',
    launchBtn: 'Launch Ecosystem',
    academyTitle: 'CFT Academy',
    academyDesc: 'Interactive coding adventures, gamified lessons, and curriculum builders tailored for all skill levels.',
    enterAcademy: 'Enter Academy',
    osTitle: 'CFTOS',
    osDesc: 'A collaborative environment for building autonomous AI agents and contributing to open-source software.',
    openPlatform: 'Open Platform',
    docsTitle: 'Docs & Blog',
    docsDesc: 'In-depth technical guides, tutorials, and insights authored by our community of engineers.',
    readDocs: 'Read Docs',
    unifiedTitle: 'Unified Ecosystem',
    unifiedHeading: 'Learn, Build, and Ship together.',
    unifiedSub: 'We remove the friction between learning syntax and deploying real applications. Our platform seamlessly connects interactive education with robust open-source collaboration tools.',
    structuredCurr: 'Structured Curriculum',
    structuredCurrDesc: 'Gamified lessons that build a strong foundation in logic and syntax.',
    realWorldEnv: 'Real-World Environments',
    realWorldEnvDesc: 'Transition from block coding directly into our robust IDE workspaces.',
    communityCollab: 'Community Collaboration',
    communityCollabDesc: 'Join open-source projects and get code reviews from experienced mentors.',
    writeCodeTitle: 'Write code, instantly.',
    writeCodeDesc: 'Our in-browser editor provides a safe, fully-featured sandbox. Experience live syntax highlighting, instant execution, and comprehensive error reporting without configuring a local environment.',
    zeroSetup: 'Zero setup required',
    instantExecution: 'Instant execution feedback',
    safeSandbox: 'Safe sandbox architecture',
    aiAgentsBadge: 'Running 24/7 Every Single Day',
    aiAgentsTitle: 'Powered by 3 Specialized AI Agents',
    aiAgentsDesc: 'Our autonomous AI agents work non-stop 24 hours a day, 7 days a week, 365 days a year to personalize learning, synthesize curriculum, and support school partners every single day.',
    pricingBadge: 'Transparent & Accessible Pricing',
    pricingTitle: 'Flexible Plans for Every Learner & Institution',
    pricingDesc: 'Start learning for free, upgrade for unlimited AI tutoring, or deploy an offline-first CS lab in your school.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save20: 'Save 20%',
    starterTitle: 'Free Explorer',
    starterDesc: 'Essential coding challenges and playground for self-directed learners.',
    proTitle: 'Pro Mastery',
    proDesc: 'Full AI agent suite, 100+ challenges, unlimited diagnostics & multi-language support.',
    enterpriseTitle: 'School & Club Lab',
    enterpriseDesc: 'Complete turn-key CS lab setup for primary & secondary schools.',
    getStartedFree: 'Get Started Free',
    upgradePro: 'Upgrade to Pro',
    contactSales: 'Contact Sales',
  },
  fr: {
    heroTitle1: 'Construire l\'Écosystème',
    heroTitle2: 'Technologique de Demain.',
    heroDesc: 'Une plateforme tout-en-un pour l\'apprentissage interactif, la collaboration open source et la documentation technique avancée.',
    navAcademy: 'Académie',
    navOS: 'Open Source',
    navDocs: 'Docs & Blog',
    navPricing: 'Tarifs',
    navAbout: 'À propos',
    launchBtn: 'Lancer l\'Écosystème',
    academyTitle: 'Académie CFT',
    academyDesc: 'Aventures de code interactives, leçons ludiques et générateurs de programmes adaptés à tous les niveaux.',
    enterAcademy: 'Entrer dans l\'Académie',
    osTitle: 'CFTOS',
    osDesc: 'Un environnement collaboratif pour créer des agents IA autonomes et contribuer à des logiciels open source.',
    openPlatform: 'Ouvrir la Plateforme',
    docsTitle: 'Docs & Blog',
    docsDesc: 'Guides techniques approfondis, tutoriels et analyses rédigés par notre communauté d\'ingénieurs.',
    readDocs: 'Lire les Docs',
    unifiedTitle: 'Écosystème Unifié',
    unifiedHeading: 'Apprendre, Construire et Déployer ensemble.',
    unifiedSub: 'Nous éliminons la friction entre l\'apprentissage de la syntaxe et le déploiement d\'applications réelles.',
    structuredCurr: 'Programme Structuré',
    structuredCurrDesc: 'Des leçons ludiques qui construisent une base solide en logique et syntaxe.',
    realWorldEnv: 'Environnements Réels',
    realWorldEnvDesc: 'Passez directement du code en bloc à nos espaces de travail IDE complets.',
    communityCollab: 'Collaboration Communautaire',
    communityCollabDesc: 'Rejoignez des projets open source et obtenez des révisions de code par des mentors expérimentés.',
    writeCodeTitle: 'Écrivez du code, instantanément.',
    writeCodeDesc: 'Notre éditeur dans le navigateur offre un environnement sécurisé et complet sans configuration.',
    zeroSetup: 'Aucune configuration requise',
    instantExecution: 'Retour d\'exécution instantané',
    safeSandbox: 'Architecture sandbox sécurisée',
    aiAgentsBadge: 'En fonctionnement 24/7 tous les jours',
    aiAgentsTitle: 'Propulsé par 3 Agents IA Spécialisés',
    aiAgentsDesc: 'Nos agents IA autonomes travaillent 24h/24 et 7j/7 pour personnaliser l\'apprentissage et soutenir nos partenaires.',
    pricingBadge: 'Tarifs Transparents & Accessibles',
    pricingTitle: 'Des Offres Flexibles pour Chaque Apprenant & Établissement',
    pricingDesc: 'Commencez gratuitement, passez au niveau supérieur avec un tutorat IA illimité.',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    save20: 'Économisez 20%',
    starterTitle: 'Explorateur Gratuit',
    starterDesc: 'Défis de code essentiels et environnement pour apprenants autonomes.',
    proTitle: 'Maîtrise Pro',
    proDesc: 'Suite complète d\'agents IA, +100 défis et support multilingue.',
    enterpriseTitle: 'Lab École & Club',
    enterpriseDesc: 'Installation clé en main de laboratoire informatique pour écoles.',
    getStartedFree: 'Commencer Gratuitement',
    upgradePro: 'Passer à Pro',
    contactSales: 'Contacter les Ventes',
  },
  ar: {
    heroTitle1: 'بناء منظومة التكنولوجيا',
    heroTitle2: 'من أجل الغد.',
    heroDesc: 'منصة متكاملة للتعلم التفاعلي، والتعاون في المشاريع مفتوحة المصدر، والتوثيق التقني المتقدم.',
    navAcademy: 'الأكاديمية',
    navOS: 'المصدر المفتوح',
    navDocs: 'الوثائق والمدونة',
    navPricing: 'الأسعار',
    navAbout: 'عن المنصة',
    launchBtn: 'إطلاق المنظومة',
    academyTitle: 'أكاديمية Code for Tomorrow',
    academyDesc: 'مغامرات برمجة تفاعلية، دروس ممتعة، ومولدات مناهج مخصصة لكل المستويات.',
    enterAcademy: 'دخول الأكاديمية',
    osTitle: 'CFTOS',
    osDesc: 'بيئة تعاونية لبناء وكلاء الذكاء الاصطناعي والمساهمة في البرمجيات مفتوحة المصدر.',
    openPlatform: 'فتح المنصة',
    docsTitle: 'الوثائق والمدونة',
    docsDesc: 'أدلة تقنية متعمقة، دروس معمارية، ورؤى من مجتمع مهندسينا.',
    readDocs: 'قراءة الوثائق',
    unifiedTitle: 'منظومة موحدة',
    unifiedHeading: 'تعلم، وابنِ، وانشر تطبيقك معًا.',
    unifiedSub: 'نزيل العقبات بين تعلم قواعد البرمجة ونشر التطبيقات الفعليه بسهولة ويسر.',
    structuredCurr: 'منهج مخصص ومبسط',
    structuredCurrDesc: 'دروس ممتعة تبني أساسًا قويًا في المنطق والبرمجة.',
    realWorldEnv: 'بيئات عمل حقيقية',
    realWorldEnvDesc: 'الانتقال المباشر من البرمجة بالكتل إلى محرر الكود الاحترافي.',
    communityCollab: 'تعاون مجتمعي',
    communityCollabDesc: 'انضم لمشاريع مفتوحة المصدر واحصل على مراجعات الكود من موجهين خبراء.',
    writeCodeTitle: 'اكتب الكود، فوراً.',
    writeCodeDesc: 'يوفر محررنا في المتصفح بيئة تفاعلية آمنة كاملة الميزات مع تشغيل فوري وتنبيهات الأخطاء.',
    zeroSetup: 'بدون الحاجة لأي إعدادات',
    instantExecution: 'نتائج تشغيل فورية',
    safeSandbox: 'بنية بيئة تشغيل آمنة',
    aiAgentsBadge: 'يعمل 24/7 كل يوم بدون توقف',
    aiAgentsTitle: 'مدعوم بـ 3 وكلاء ذكاء اصطناعي متخصصين',
    aiAgentsDesc: 'يعمل وكلاء الذكاء الاصطناعي المستقلون لدينا على مدار 24 ساعة يوميًا لتخصيص التعلم ودعم الشركاء.',
    pricingBadge: 'أسعار شفافة ومتاحة للجميع',
    pricingTitle: 'خطط مرنة لكل متعلم ومؤسسة تعليمية',
    pricingDesc: 'ابدأ التعلم مجانًا، وقم بالترقية للحصول على معلم ذكاء اصطناعي غير محدود.',
    monthly: 'شهري',
    yearly: 'سنوي',
    save20: 'وفر 20%',
    starterTitle: 'المستكشف المجاني',
    starterDesc: 'تحديات برمجة أساسية وتجربة تفاعلية للمتعلمين الذاتيين.',
    proTitle: 'الاحترافي Pro',
    proDesc: 'مجموعة وكلاء الذكاء الاصطناعي الكاملة، +100 تحدي ودعم لغات متعددة.',
    enterpriseTitle: 'مختبر المدارس والأندية',
    enterpriseDesc: 'إعداد مختبر برمجيات كامل ومتاح بدون إنترنت للمدارس.',
    getStartedFree: 'ابدأ مجانًا',
    upgradePro: 'الترقية إلى Pro',
    contactSales: 'تواصل مع المبيعات',
  }
};

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: Language.EN, label: 'English', flag: '🇺🇸' },
  { code: Language.FR, label: 'Français', flag: '🇫🇷' },
  { code: Language.AR, label: 'العربية', flag: '🇲🇦' },
];

const LandingPage: React.FC<{ currentUser: User | null, onGetStarted: () => void }> = ({ currentUser, onGetStarted }) => {
  const { language, setLanguage } = useLanguage();
  const txt = LANDING_I18N[language] || LANDING_I18N.en;
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detectUserCurrency = (): CurrencyCode => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = navigator.language || '';
      if (tz.includes('Casablanca') || tz.includes('Africa/El_Aaiun') || lang.includes('MA') || language === 'ar') {
        return 'MAD';
      }
      if (tz.includes('Europe') || lang.includes('fr') || lang.includes('de') || lang.includes('es') || lang.includes('it')) {
        return 'EUR';
      }
    } catch (err) {}
    return 'USD';
  };

  const [currency, setCurrency] = useState<CurrencyCode>(detectUserCurrency);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [pilotSubmitted, setPilotSubmitted] = useState(false);
  const [pilotForm, setPilotForm] = useState({ schoolName: '', contactName: '', email: '', phone: '', studentCount: '100-500', lang: 'fr' });

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
      <header className="fixed top-0 left-0 right-0 bg-[#060b19]/85 backdrop-blur-md z-50 border-b border-sky-900/30 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group shrink-0 gap-3">
            <img 
              src="/assets/code-for-tomorrow-logo.png" 
              alt="Code for Tomorrow" 
              className="w-[42px] h-[42px] object-contain block shrink-0 transition-transform group-hover:scale-105" 
            />
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">Code for Tomorrow</span>
          </div>

          <nav className="hidden lg:flex items-center gap-4">
            <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="text-white hover:text-sky-400 transition-colors text-sm font-bold tracking-wide">
              {txt.navAcademy}
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="text-white hover:text-sky-400 transition-colors text-sm font-bold tracking-wide">
              {txt.navOS}
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="text-white hover:text-sky-400 transition-colors text-sm font-bold tracking-wide">
              {txt.navDocs}
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href="#pricing" className="text-white hover:text-sky-400 transition-colors text-sm font-bold tracking-wide">
              {txt.navPricing}
            </a>
            <div className="w-[1px] h-4 bg-slate-800 self-center" />
            <a href="/about" className="text-white hover:text-sky-400 transition-colors text-sm font-bold tracking-wide">
              {txt.navAbout}
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Top-Right Language Switcher */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 bg-[#0b132b] hover:bg-[#121c3d] text-slate-200 border border-sky-500/30 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{LANGUAGES.find(l => l.code === language)?.flag} {language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0b132b] border border-sky-500/40 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-xl">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between hover:bg-sky-500/20 transition-colors cursor-pointer ${language === lang.code ? 'text-sky-400 bg-sky-500/10' : 'text-slate-200'}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold px-6 py-2.5 rounded-full hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-sky-500/25 cursor-pointer">
              {txt.launchBtn}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                const nextLang = language === Language.EN ? Language.FR : language === Language.FR ? Language.AR : Language.EN;
                setLanguage(nextLang);
              }}
              className="flex items-center gap-1.5 bg-[#0b132b] text-slate-200 border border-sky-500/30 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button className="p-1 text-white hover:text-sky-400" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#060b19]/95 backdrop-blur-sm z-50 md:hidden flex flex-col p-8">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-1 text-white hover:text-sky-400">
            <X className="w-8 h-8" />
          </button>
          <nav className="flex flex-col space-y-6 mt-16 text-center">
            <a href={getPlatformHref('academy', '/dashboard')} className="text-2xl font-bold text-white hover:text-sky-400">{txt.navAcademy}</a>
            <a href={getPlatformHref('os', '/cftos')} className="text-2xl font-bold text-white hover:text-sky-400">{txt.navOS}</a>
            <a href={getPlatformHref('docs', '/blog')} className="text-2xl font-bold text-white hover:text-sky-400">{txt.navDocs}</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white hover:text-sky-400">{txt.navPricing}</a>
            <a href="/about" className="text-2xl font-bold text-white hover:text-sky-400">{txt.navAbout}</a>
            <button onClick={() => { setIsMenuOpen(false); onGetStarted(); }} className="mt-8 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold px-8 py-4 rounded-full text-xl hover:brightness-110 shadow-lg shadow-sky-500/30">
              {txt.launchBtn}
            </button>
            <div className="flex justify-center items-center gap-3 pt-6 mt-4 border-t border-slate-800/80">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${language === lang.code ? 'bg-sky-500/20 text-sky-300 border-sky-400' : 'bg-slate-900/60 text-slate-300 border-slate-700'}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* 2. Premium Hero Section with Built-in Portal Grid */}
      <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 bg-[#060b19] text-white overflow-hidden">
        {/* Ambient Brand Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              {txt.heroTitle1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400">{txt.heroTitle2}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed mb-8 font-medium">
              {txt.heroDesc}
            </p>

            {/* Built-in Portal Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
              <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
                <GlowCard glowColor="blue" customSize={true} className="p-8 h-full flex flex-col justify-between">
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-[#0b132b] border border-sky-500/20 flex items-center justify-center overflow-hidden mb-6">
                      <img src="/assets/code-for-tomorrow-logo.png" alt="CFT Academy" className="w-full h-full object-contain p-1" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-sky-400 transition-colors">{txt.academyTitle}</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">{txt.academyDesc}</p>
                  </div>
                  <span className="inline-flex items-center text-sky-400 font-bold text-sm">{txt.enterAcademy} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                </GlowCard>
              </a>

              <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
                <GlowCard glowColor="blue" customSize={true} className="p-8 h-full flex flex-col justify-between">
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-[#0b132b] border border-sky-500/20 flex items-center justify-center overflow-hidden mb-6">
                      <img src="/assets/images/cftos_logo.jpg" alt="CFTOS" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-sky-400 transition-colors">{txt.osTitle}</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">{txt.osDesc}</p>
                  </div>
                  <span className="inline-flex items-center text-sky-400 font-bold text-sm">{txt.openPlatform} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                </GlowCard>
              </a>

              <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
                <GlowCard glowColor="blue" customSize={true} className="p-8 h-full flex flex-col justify-between">
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-[#0b132b] border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-sky-400 transition-colors">{txt.docsTitle}</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">{txt.docsDesc}</p>
                  </div>
                  <span className="inline-flex items-center text-sky-400 font-bold text-sm">{txt.readDocs} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold mb-6 text-sm border border-blue-100">
                <Layers className="w-4 h-4 text-sky-500" /> Unified Ecosystem
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
                <div key={idx} className="flex items-start gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-400 hover:shadow-md transition-all">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#060b19] flex items-center justify-center text-sky-400">
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
              <div className="bg-[#060b19] rounded-2xl p-4 shadow-2xl border border-slate-800 font-mono text-sm relative">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <span className="text-slate-400 ml-4 font-semibold text-xs">hello.js</span>
                </div>
                <div className="bg-[#0b132b] p-6 rounded-xl text-slate-300 h-56 overflow-hidden relative">
                  <pre className="whitespace-pre-wrap"><code className="text-sky-300">{demoCode}</code><span className="animate-pulse">_</span></pre>
                  {demoCode.length === fullCode.length && !showOutput && (
                    <button onClick={() => setShowOutput(true)} className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 text-white font-bold py-2 px-6 rounded-md flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20">
                      <Play className="w-4 h-4 fill-current" /> Run
                    </button>
                  )}
                </div>
                <div className={`mt-4 bg-[#0b132b] rounded-xl border border-slate-800 transition-all overflow-hidden ${showOutput ? 'h-24 opacity-100 p-4' : 'h-0 opacity-0 py-0 border-transparent p-0'}`}>
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
                    <CheckCircle className="w-6 h-6 text-sky-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 24/7 AI Agents Presentation */}
      <section className="pt-16 pb-8 bg-[#060b19] text-white overflow-hidden relative border-t border-sky-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <AnimatedSection className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Running 24/7 Every Single Day</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">3 Specialized AI Agents</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed">
              Our autonomous AI agents work non-stop 24 hours a day, 7 days a week, 365 days a year to personalize learning, synthesize curriculum, and support school partners every single day.
            </p>
          </AnimatedSection>

          <AnimatedSection className="w-full">
            <RadialOrbitalTimelineDemo />
          </AnimatedSection>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-[#060b19] text-white relative overflow-hidden border-t border-sky-900/30">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-sky-400/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">
              <span>Transparent & Accessible Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
              Flexible Plans for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Every Learner & Institution</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              Start learning for free, upgrade for unlimited AI tutoring, or deploy an offline-first CS lab in your school.
            </p>

            {/* Monthly / Yearly Billing Toggle + Local Currency Selector */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              {/* Monthly / Yearly Toggle */}
              <div className="flex items-center gap-3 bg-[#0b132b] border border-slate-800 px-4 py-2 rounded-full">
                <span className={`text-xs font-bold ${!isYearlyBilling ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
                <button
                  onClick={() => setIsYearlyBilling(!isYearlyBilling)}
                  className="w-12 h-6 rounded-full bg-slate-900 border border-slate-700 p-0.5 flex items-center transition-colors cursor-pointer relative"
                >
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md transform transition-transform ${isYearlyBilling ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isYearlyBilling ? 'text-white' : 'text-slate-400'}`}>
                  <span>Yearly</span>
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </span>
              </div>

              {/* Local Currency Switcher */}
              <div className="flex items-center gap-1 bg-[#0b132b] border border-slate-800 p-1 rounded-full text-xs font-bold">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => {
                  const c = CURRENCIES[cCode];
                  const isActive = currency === cCode;
                  return (
                    <button
                      key={cCode}
                      onClick={() => setCurrency(cCode)}
                      className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-extrabold shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* TIER 1: STARTER FREE */}
            <AnimatedSection className="h-full">
              <div className="bg-[#0b132b]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-sky-500/40 transition-all shadow-xl">
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
                    <span className="text-5xl font-black text-white">
                      {CURRENCIES[currency].freePrice}
                    </span>
                    <span className="text-slate-400 text-sm font-medium ml-2">/ forever</span>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800/80 pt-6 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Access to 60+ Basic CS & Logic Challenges</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Standard AI Tutor (10 queries/day)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Public Code Sandbox & Playground</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Community Discussion Forum</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckout('Free Explorer', CURRENCIES[currency].freePrice)}
                  className="w-full py-4 mt-8 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all cursor-pointer border border-slate-700"
                >
                  Get Started Free
                </button>
              </div>
            </AnimatedSection>

            {/* TIER 2: PIONEER PRO (MOST POPULAR) */}
            <AnimatedSection className="h-full">
              <div className="bg-gradient-to-b from-[#0b132b] via-[#091536] to-[#0b132b] border-2 border-sky-400/80 rounded-3xl p-8 flex flex-col justify-between h-full relative shadow-2xl shadow-sky-500/15 transform lg:-translate-y-2">
                {/* Popular Pill */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-black text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  🔥 Most Popular
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4 mt-1">
                    <span className="text-xs font-black uppercase tracking-widest text-sky-400">Pioneer Pro</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro Mastery</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Full AI agent suite, 100+ challenges, unlimited diagnostics & multi-language support.
                  </p>

                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">
                      {isYearlyBilling ? CURRENCIES[currency].proYearly : CURRENCIES[currency].proMonthly}
                    </span>
                    <span className="text-slate-400 text-sm font-medium ml-2">
                      / month {isYearlyBilling && '(billed yearly)'}
                    </span>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800/80 pt-6 text-sm text-white">
                    <div className="flex items-center gap-3 font-semibold">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>All 100+ CS, Python, Web & Kids Challenges</span>
                    </div>
                    <div className="flex items-center gap-3 font-semibold">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Unlimited AI Tutor & Real-time Diagnostics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Multi-Language Support (EN, FR, AR)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>3 Specialized Autonomous AI Agents Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Interactive Math & Speaking Voice Labs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Priority Support & Certifications</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckout('Pioneer Pro', isYearlyBilling ? CURRENCIES[currency].proYearly : CURRENCIES[currency].proMonthly)}
                  className="w-full py-4 mt-8 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:brightness-110 text-white font-black text-sm transition-all shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </AnimatedSection>

            {/* TIER 3: ENTERPRISE & SCHOOLS */}
            <AnimatedSection className="h-full">
              <div className="bg-[#0b132b]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-blue-500/40 transition-all shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-400">Institutional</span>
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Schools & B2G</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Offline-first classroom deployment, seat management & custom curriculum engineering.
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-black text-white">
                      {CURRENCIES[currency].enterprisePrice}
                    </span>
                    <span className="text-slate-400 text-sm font-medium ml-2">/ school license</span>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800/80 pt-6 text-sm text-slate-300">
                    <div className="flex items-center gap-3 font-semibold text-white">
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Offline Hotspot & Ollama Local Server Setup</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Curriculum Factory Agent Customization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Student Analytics & Teacher Mastery Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Bulk Seat Allocations & NGO Grant Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Dedicated Account Manager & 24/7 SLA</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsPilotModalOpen(true)}
                  className="w-full py-4 mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" /> Request 14-Day School Pilot
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
          <button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold px-10 py-5 rounded-full text-lg hover:brightness-110 transition-all shadow-xl shadow-sky-500/25 active:scale-95 inline-flex items-center gap-3">
            Launch Ecosystem <ArrowRight className="w-6 h-6" />
          </button>
        </AnimatedSection>
      </section>

      {/* Scroll Animation Showcase */}
      <HeroScrollDemo />

      {/* Footer */}
      <footer className="bg-[#060b19] text-slate-400 border-t border-white/5">
        {/* Top CTA Banner */}
        <div className="border-b border-white/5">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Ready to start your journey?</h3>
              <p className="text-slate-400 text-lg">Join thousands of learners building the future of technology.</p>
            </div>
            <button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-bold px-8 py-4 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-sky-500/20 whitespace-nowrap text-lg">
              Get Started Free
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

            {/* Column 1: Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src="/assets/code-for-tomorrow-logo.png" alt="Code for Tomorrow" className="w-[42px] h-[42px] object-contain block shrink-0" />
                <span className="font-black text-2xl text-white tracking-tight">Code for Tomorrow</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                An all-in-one ecosystem for interactive learning, open-source collaboration, and technical documentation. Empowering the next generation of developers.
              </p>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=100094388425195" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/10 transition-all" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/@Code4TomorrowProject" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/10 transition-all" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/110087342/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/10 transition-all" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="hover:text-sky-400 transition-colors text-sm">CFT Academy</a></li>
                <li><a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="hover:text-sky-400 transition-colors text-sm">CFTOS – Open Source</a></li>
                <li><a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="hover:text-sky-400 transition-colors text-sm">Docs & Blog</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">AI Tutor</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Code Playground</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Math Games</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="hover:text-sky-400 transition-colors text-sm font-bold text-white/90">About Us</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Getting Started Guide</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">API Documentation</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Community Forum</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Changelog</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors text-sm">Status Page</a></li>
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/30 transition-all"
                />
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-sm shadow-md shadow-sky-500/20">
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
              <a href="/about" className="text-slate-500 hover:text-sky-400 transition-colors">About Us</a>
              <a href="#" className="text-slate-500 hover:text-sky-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-sky-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-sky-400 transition-colors">Cookie Policy</a>
              <button 
                onClick={() => setIsContactModalOpen(true)} 
                className="text-slate-300 hover:text-sky-400 transition-colors font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
              >
                <span>Contact Us Form</span>
              </button>
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

      {/* 🏛️ B2B 14-DAY INSTITUTIONAL SCHOOL PILOT MODAL */}
      {isPilotModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[120] p-4">
          <div className="bg-[#0b132b] border border-blue-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-left animate-pop-in">
            <button
              onClick={() => {
                setIsPilotModalOpen(false);
                setPilotSubmitted(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">14-Day Free School Pilot</h3>
                <p className="text-xs text-slate-400">Turnkey CS & AI curriculum for Private & International Schools</p>
              </div>
            </div>

            {pilotSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <h4 className="text-lg font-bold text-white">Pilot Application Received!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our academic partnership team will activate your institutional class codes and send onboarding materials to <strong className="text-emerald-400">{pilotForm.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsPilotModalOpen(false);
                    setPilotSubmitted(false);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close & Return to Site
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPilotSubmitted(true);
                }}
                className="space-y-4 text-xs text-slate-300"
              >
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">School / Institution Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Groupe Scolaire Al Madina / Lycée Descartes"
                    value={pilotForm.schoolName}
                    onChange={e => setPilotForm({ ...pilotForm, schoolName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Contact Person</label>
                    <input
                      required
                      type="text"
                      placeholder="Director / Teacher Name"
                      value={pilotForm.contactName}
                      onChange={e => setPilotForm({ ...pilotForm, contactName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Work Email</label>
                    <input
                      required
                      type="email"
                      placeholder="director@school.ma"
                      value={pilotForm.email}
                      onChange={e => setPilotForm({ ...pilotForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Phone / WhatsApp</label>
                    <input
                      required
                      type="tel"
                      placeholder="+212 600-000000"
                      value={pilotForm.phone}
                      onChange={e => setPilotForm({ ...pilotForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Target Students</label>
                    <select
                      value={pilotForm.studentCount}
                      onChange={e => setPilotForm({ ...pilotForm, studentCount: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="50-100">50 - 100 Students</option>
                      <option value="100-500">100 - 500 Students</option>
                      <option value="500+">500+ Students (School-wide)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-500/25 active:scale-98 cursor-pointer mt-2"
                >
                  🚀 Activate 14-Day Free Pilot
                </button>
                <p className="text-[10px] text-slate-500 text-center">
                  Includes 2 pilot class rosters, automated code grading & 15-minute teacher onboarding briefing.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 📧 CONTACT US FORM MODAL */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

    </div>
  );
};

export default LandingPage;
