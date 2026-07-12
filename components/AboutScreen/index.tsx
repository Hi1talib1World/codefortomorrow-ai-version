import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  GraduationCap, 
  Users, 
  Globe, 
  MapPin, 
  BookOpen, 
  CheckCircle,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Zap,
  Network,
  X,
  ChevronLeft,
  ChevronRight,
  Smile
} from 'lucide-react';

const content = {
  en: {
    title: 'About Us',
    subtitle: 'Bridging the digital divide in rural Morocco through AI-powered, inclusive education.',
    tagline: 'Code for Tomorrow is a gamified EdTech platform designed for students (ages 8-15) and educators in underserved public schools.',
    
    // Mission & Vision
    our_mission: 'Our Mission',
    mission_desc: 'To establish sustainable coding clubs in primary schools and make high-quality digital education accessible both online and offline.',
    our_vision: 'Our Vision',
    vision_desc: 'A future where technology is a basic utility, not a privilege, and where every Moroccan child has the tools to create, innovate, and thrive.',
    
    // Key Pillars
    key_pillars: 'Our Pillars of Action',
    pillar_students_title: 'For Students',
    pillar_students_desc: 'Personalized coding pathways, visual feedback, and game-making toolkits that turn learning logic into an adventure.',
    pillar_teachers_title: 'For Teachers',
    pillar_teachers_desc: 'AI-assisted lesson planner, auto-generated quizzes, and progress analytics to reduce administrative overhead.',
    pillar_community_title: 'For Community',
    pillar_community_desc: 'Offline sync capability for remote schools with poor connection, localized content, and local student mentorship.',

    // SDG Section
    sdg_title: 'Aligned with UN Sustainable Development Goals',
    sdg_desc: 'Code for Tomorrow directly addresses critical global challenges to foster a more equitable and innovation-driven education landscape.',
    sdg_tab_4: 'SDG 4: Quality Education',
    sdg_tab_4_desc: 'Providing standard curriculum content and logic exercises that democratize programming knowledge for children who lack IT laboratories.',
    sdg_tab_5: 'SDG 5: Gender Equality',
    sdg_tab_5_desc: 'Our gamified theme and inclusive coding clubs ensure girls and boys participate equally, defying tech stereotypes.',
    sdg_tab_9: 'SDG 9: Innovation & Infra',
    sdg_tab_9_desc: 'Building cloud-synced, lightweight software platforms that run on low-end hardware, introducing modern tech infrastructure locally.',
    sdg_tab_10: 'SDG 10: Reduced Inequalities',
    sdg_tab_10_desc: 'Bridging the educational gap between rural communities and urban centers, ensuring talent everywhere gets an equal start.',

    // Metrics
    impact_metrics: 'Measurable Outcomes',
    metric_students: '200+ Students',
    metric_students_sub: 'Equipped with coding skills annually',
    metric_schools: '10+ Partner Schools',
    metric_schools_sub: 'In rural regions and villages',
    metric_courses: '15+ Courses',
    metric_courses_sub: 'From block coding to Python & Web Dev',
    metric_cost: '100% Free',
    metric_cost_sub: 'Open source & non-profit ecosystem',

    // Moroccan Context
    moroccan_context_title: 'Local Impact in Morocco',
    moroccan_context_desc1: 'In rural Morocco, schools face structural challenges, including a lack of computer labs and internet connectivity. Code for Tomorrow addresses this by building software designed to sync offline and run efficiently on limited school hardware.',
    moroccan_context_desc2: 'By integrating dialectal Arabic (Darija), French, and English, we remove language barriers so that any student can learn syntax and logic concepts in a natural, welcoming environment.',

    gallery_title: 'Our Clubs in Action',
    gallery_desc: 'Real moments from our interactive coding clubs in rural Moroccan schools, bringing digital literacy to the next generation.',

    back_button: 'Back to Home',
    scroll_top: 'Scroll to top',
  },
  fr: {
    title: 'À Propos de Nous',
    subtitle: 'Réduire la fracture numérique dans le Maroc rural grâce à une éducation inclusive propulsée par l’IA.',
    tagline: 'Code for Tomorrow est une plateforme EdTech ludique conçue pour les élèves (de 8 à 15 ans) et les enseignants des écoles publiques défavorisées.',
    
    our_mission: 'Notre Mission',
    mission_desc: 'Créer des clubs de codage durables dans les écoles primaires et rendre une éducation numérique de haute qualité accessible en ligne et hors ligne.',
    our_vision: 'Notre Vision',
    vision_desc: 'Un avenir où la technologie est une nécessité de base, non un privilège, et où chaque enfant marocain dispose des outils nécessaires pour créer, innover et s’épanouir.',
    
    key_pillars: 'Nos Piliers d’Action',
    pillar_students_title: 'Pour les Élèves',
    pillar_students_desc: 'Parcours d’apprentissage personnalisés, rétroaction visuelle et ateliers de création de jeux pour faire de l’apprentissage de la logique une aventure.',
    pillar_teachers_title: 'Pour les Enseignants',
    pillar_teachers_desc: 'Planificateur de cours assisté par IA, quiz générés automatiquement et suivi analytique pour réduire la charge de travail administrative.',
    pillar_community_title: 'Pour la Communauté',
    pillar_community_desc: 'Synchronisation hors ligne pour les écoles isolées ayant peu de réseau, contenu localisé et tutorat pour les étudiants.',

    sdg_title: 'Aligné sur les Objectifs de Développement Durable de l’ONU',
    sdg_desc: 'Code for Tomorrow répond directement à des défis mondiaux majeurs pour encourager un système éducatif plus équitable et axé sur l’innovation.',
    sdg_tab_4: 'ODD 4 : Éducation de Qualité',
    sdg_tab_4_desc: 'Fourniture de programmes standardisés et d’exercices de logique qui démocratisent les connaissances en programmation pour les enfants privés de salles d’informatique.',
    sdg_tab_5: 'ODD 5 : Égalité des Sexes',
    sdg_tab_5_desc: 'Nos thèmes ludiques et nos clubs inclusifs garantissent une participation égale des filles et des garçons, défiant les stéréotypes technologiques.',
    sdg_tab_9: 'ODD 9 : Innovation & Infra',
    sdg_tab_9_desc: 'Développement de plateformes légères et synchronisées sur le cloud qui fonctionnent sur du matériel ancien, introduisant ainsi une infrastructure moderne localement.',
    sdg_tab_10: 'ODD 10 : Inégalités Réduites',
    sdg_tab_10_desc: 'Réduction de l’écart éducatif entre les communautés rurales et les centres urbains, garantissant un départ équitable pour tous les talents.',

    impact_metrics: 'Impact en Chiffres',
    metric_students: '200+ Élèves',
    metric_students_sub: 'Formés au codage chaque année',
    metric_schools: '10+ Écoles Partenaires',
    metric_schools_sub: 'Dans les régions rurales et les villages',
    metric_courses: '15+ Cours',
    metric_courses_sub: 'Du codage par blocs à Python & Web Dev',
    metric_cost: '100% Gratuit',
    metric_cost_sub: 'Écosystème open source et à but non lucratif',

    moroccan_context_title: 'Impact Local au Maroc',
    moroccan_context_desc1: 'Dans les régions rurales du Maroc, les écoles font face à des défis structurels, notamment l’absence de salles informatiques et de connexion internet. Code for Tomorrow résout cela avec une solution légère conçue pour fonctionner hors ligne.',
    moroccan_context_desc2: 'En combinant l’arabe dialectal (Darija), le français et l’anglais, nous éliminons les barrières linguistiques pour que chaque élève apprenne la syntaxe et la logique dans un environnement accueillant.',

    gallery_title: 'Nos Clubs en Action',
    gallery_desc: 'Des moments réels capturés au sein de nos clubs de codage dans les écoles rurales marocaines.',

    back_button: 'Retour à l’accueil',
    scroll_top: 'Haut de page',
  },
  ar: {
    title: 'من نحن',
    subtitle: 'جسر الفجوة الرقمية في المغرب القروي من خلال تعليم دامج ومدعوم بالذكاء الاصطناعي.',
    tagline: 'Code for Tomorrow هي منصة تعليمية تفاعلية مصممة للتلاميذ (من سن 8 إلى 15 عاماً) والمعلمين في المدارس العمومية بالمناطق القروية.',
    
    our_mission: 'مهمتنا',
    mission_desc: 'تأسيس نوادي ترميز مستدامة في المدارس الابتدائية وجعل التعليم الرقمي عالي الجودة متاحاً بالإنترنت وبدونه.',
    our_vision: 'رؤيتنا',
    vision_desc: 'مستقبل تكون فيه التكنولوجيا خدمة أساسية وليست امتيازاً، ويمتلك فيه كل طفل مغربي الأدوات اللازمة للابتكار والتطور.',
    
    key_pillars: 'ركائز عملنا الرئيسية',
    pillar_students_title: 'للتلاميذ',
    pillar_students_desc: 'مسارات برمجية مخصصة، ملاحظات تفاعلية، وأدوات تصميم الألعاب لتحويل تعلم المنطق إلى مغامرة ممتعة.',
    pillar_teachers_title: 'للمعلمين',
    pillar_teachers_desc: 'مخطط دروس مدعوم بالذكاء الاصطناعي، اختبارات مولدة تلقائياً، وإحصاءات تقدم التلاميذ لتقليل العبء الإداري.',
    pillar_community_title: 'للمجتمع',
    pillar_community_desc: 'إمكانية المزامنة بدون إنترنت للمدارس النائية، محتوى محلي ملائم، وبرامج إرشادية للتلاميذ.',

    sdg_title: 'التوافق مع أهداف التنمية المستدامة للأمم المتحدة',
    sdg_desc: 'تساهم منصتنا بشكل مباشر في معالجة التحديات العالمية الحرجة لبناء نظام تعليمي أكثر عدالة وابتكاراً.',
    sdg_tab_4: 'الهدف 4: التعليم الجيد',
    sdg_tab_4_desc: 'توفير مناهج تعليمية وتمارين منطقية تتيح فرصة تعلم البرمجة للأطفال الذين يفتقرون لقاعات تكنولوجيا المعلومات.',
    sdg_tab_5: 'الهدف 5: المساواة بين الجنسين',
    sdg_tab_5_desc: 'تضمن نوادي الترميز وتصميماتنا الدامجة مشاركة متساوية للبنات والبنين لكسر الصور النمطية في مجال التكنولوجيا.',
    sdg_tab_9: 'الهدف 9: الابتكار والبنية التحتية',
    sdg_tab_9_desc: 'تطوير تطبيقات خفيفة متزامنة مع السحاب تعمل بكفاءة على أجهزة الكمبيوتر القديمة، مما يطور البنية التحتية التقنية محلياً.',
    sdg_tab_10: 'الالهدف 10: الحد من أوجه عدم المساواة',
    sdg_tab_10_desc: 'تقليص الفجوة التعليمية بين المناطق القروية والمراكز الحضرية، مما يضمن بداية عادلة لكل المواهب الصاعدة.',

    impact_metrics: 'نتائج قابلة للقياس',
    metric_students: '+200 تلميذ',
    metric_students_sub: 'يكتسبون مهارات الترميز سنوياً',
    metric_schools: '+10 مدارس شريكة',
    metric_schools_sub: 'في المناطق والقرى القروية',
    metric_courses: '+15 مساراً دراسياً',
    metric_courses_sub: 'من الترميز اللبني إلى بايثون وتطوير الويب',
    metric_cost: 'مشاريع مجانية 100%',
    metric_cost_sub: 'إكوسيستم مفتوح المصدر وغير ربحي',

    moroccan_context_title: 'الأثر المحلي بالمغرب',
    moroccan_context_desc1: 'تواجه المدارس في المناطق القروية بالمغرب تحديات هيكلية، منها غياب قاعات الحواسيب وضعف الاتصال بالإنترنت. لهذا صممنا منصتنا لتعمل دون إنترنت على أجهزة الحاسوب البسيطة والمحدودة.',
    moroccan_context_desc2: 'عبر توفير المناهج باللغة العربية (الدارجة)، الفرنسية، والإنجليزية، نزيل الحواجز اللغوية لتمكين جميع التلاميذ من استيعاب المفاهيم البرمجية بسلاسة.',

    gallery_title: 'نوادينا في عملها',
    gallery_desc: 'لحظات حقيقية مبهجة من نوادي الترميز التفاعلية في مدارسنا القروية بالمملكة.',

    back_button: 'الرجوع للرئيسية',
    scroll_top: 'الرجوع للأعلى',
  }
};

interface AboutScreenProps {
  currentUser?: any;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const tContent = content[language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'];

  const [activeSdg, setActiveSdg] = useState<number>(4);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const isDashboard = window.location.pathname.startsWith('/dashboard');
  const port = window.location.port ? `:${window.location.port}` : '';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const onGetStarted = () => {
    navigate(currentUser ? '/dashboard' : '/auth');
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#FBBF24] selection:text-slate-950 pb-20 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Sleek Floating Header */}
      {!isDashboard && (
        <header className="fixed top-0 left-0 right-0 bg-[#0a0f1d]/90 backdrop-blur-md z-50 border-b border-slate-800 transition-all duration-300">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center cursor-pointer group shrink-0" onClick={() => navigate('/')}>
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
              <a href="/about" className="text-[#FBBF24] transition-colors text-sm font-bold tracking-wide">
                About
              </a>
            </nav>

            <div className="hidden md:flex items-center">
              <button onClick={onGetStarted} className="bg-[#FBBF24] text-[#111827] font-bold px-6 py-2.5 rounded-full hover:bg-[#f59e0b] transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-[#FBBF24]/20">
                Launch Ecosystem
              </button>
            </div>

            <div className="flex md:hidden items-center">
              <button className="p-1 text-white hover:text-[#FBBF24]" onClick={() => setIsMenuOpen(true)}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Menu */}
      {!isDashboard && isMenuOpen && (
        <div className="fixed inset-0 bg-[#111827]/95 backdrop-blur-sm z-50 md:hidden flex flex-col p-8">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-1 text-white hover:text-[#FBBF24]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <nav className="flex flex-col space-y-6 mt-16 text-center">
            <a href={getPlatformHref('academy', '/dashboard')} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Academy</a>
            <a href={getPlatformHref('os', '/cftos')} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Open Source</a>
            <a href={getPlatformHref('docs', '/blog')} className="text-2xl font-bold text-white hover:text-[#FBBF24]">Docs & Blog</a>
            <a href="/about" className="text-2xl font-bold text-[#FBBF24]">About</a>
            <button onClick={onGetStarted} className="mt-8 bg-[#FBBF24] text-[#111827] font-bold px-8 py-4 rounded-full text-xl hover:bg-[#f59e0b]">
              Launch Ecosystem
            </button>
          </nav>
        </div>
      )}
      
      {/* Hero section */}
      <section className="relative pt-24 pb-16 bg-[#0a0f1d] overflow-hidden border-b border-slate-800">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#FBBF24]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              {tContent.title}
            </h1>
            <div className="mb-8">
              <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-16 mx-auto object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.2)]" />
            </div>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-semibold max-w-3xl mx-auto mb-8">
              {tContent.subtitle}
            </p>
            <div className="w-24 h-1 bg-[#FBBF24] mx-auto rounded-full mb-8"></div>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {tContent.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-[#FBBF24] flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black mb-4 uppercase tracking-wide">{tContent.our_mission}</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {tContent.mission_desc}
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-[#FBBF24] flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black mb-4 uppercase tracking-wide">{tContent.our_vision}</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {tContent.vision_desc}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-12 bg-slate-900/60">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-wide">
            {tContent.key_pillars}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: tContent.pillar_students_title, desc: tContent.pillar_students_desc },
              { icon: Users, title: tContent.pillar_teachers_title, desc: tContent.pillar_teachers_desc },
              { icon: Network, title: tContent.pillar_community_title, desc: tContent.pillar_community_desc }
            ].map((pillar, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-slate-800/20 border border-slate-700/30 hover:border-indigo-500/40 hover:bg-slate-800/40 transition-all shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 flex items-center justify-center text-[#FBBF24] mb-4">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold mb-2">{pillar.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive SDG Toggles */}
      <section className="py-16 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-wide">
            {tContent.sdg_title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            {tContent.sdg_desc}
          </p>
        </div>

        <div className="bg-slate-800/30 rounded-3xl border border-slate-700/50 p-6 md:p-8 backdrop-blur-sm shadow-xl">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/50 pb-4 justify-center md:justify-start">
            {[4, 5, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setActiveSdg(num)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeSdg === num
                    ? 'bg-[#FBBF24] text-slate-950 shadow-md shadow-[#FBBF24]/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                SDG {num}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[140px] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                {activeSdg === 4 && tContent.sdg_tab_4}
                {activeSdg === 5 && tContent.sdg_tab_5}
                {activeSdg === 9 && tContent.sdg_tab_9}
                {activeSdg === 10 && tContent.sdg_tab_10}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {activeSdg === 4 && tContent.sdg_tab_4_desc}
                {activeSdg === 5 && tContent.sdg_tab_5_desc}
                {activeSdg === 9 && tContent.sdg_tab_9_desc}
                {activeSdg === 10 && tContent.sdg_tab_10_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-16 bg-[#0a0f1d] border-t border-b border-slate-800">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-wide">
            {tContent.impact_metrics}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { metric: tContent.metric_students, label: tContent.metric_students_sub },
              { metric: tContent.metric_schools, label: tContent.metric_schools_sub },
              { metric: m => typeof m === 'object' ? tContent.metric_courses : '', label: tContent.metric_courses_sub }, // Safe check
              { metric: m => typeof m === 'object' ? tContent.metric_cost : '', label: tContent.metric_cost_sub }
            ].map((m, i) => {
              // Map index values directly to avoid any type problems
              const val = i === 0 ? tContent.metric_students : i === 1 ? tContent.metric_schools : i === 2 ? tContent.metric_courses : tContent.metric_cost;
              const sub = i === 0 ? tContent.metric_students_sub : i === 1 ? tContent.metric_schools_sub : i === 2 ? tContent.metric_courses_sub : tContent.metric_cost_sub;
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-850/50 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
                  <p className="text-2xl md:text-3xl font-black text-[#FBBF24] mb-2">{val}</p>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">{sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Moroccan Context Section */}
      <section className="py-16 container mx-auto px-6 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-500/20 text-[#FBBF24] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Globe className="w-12 h-12 md:w-16 md:h-16" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#FBBF24]" />
              {tContent.moroccan_context_title}
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {tContent.moroccan_context_desc1}
            </p>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {tContent.moroccan_context_desc2}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 text-indigo-400">
                <Zap className="w-4 h-4" />
                {tContent.offline_tech_title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-xs md:text-sm font-semibold">
                {tContent.offline_tech_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-wide flex items-center justify-center gap-2">
              <Smile className="w-8 h-8 text-[#FBBF24]" />
              {tContent.gallery_title}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              {tContent.gallery_desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: '/assets/images/about_media_1.jpg', alt: 'Students learning' },
              { src: '/assets/images/about_media_2.jpg', alt: 'Outdoors session' },
              { src: '/assets/images/about_media_3.jpg', alt: 'Classroom coding' },
              { src: '/assets/images/about_media_4.jpg', alt: 'Partner school group' }
            ].map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setSelectedPhotoIndex(idx)}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700/50 shadow-lg group cursor-pointer"
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs font-bold text-[#FBBF24] tracking-wide uppercase">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Back button */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            const hasDashboard = window.location.pathname.startsWith('/dashboard');
            window.location.href = hasDashboard ? '/dashboard' : '/';
          }}
          className="bg-[#FBBF24] text-slate-950 font-black px-8 py-3 rounded-full hover:bg-[#f59e0b] active:scale-95 transition-all shadow-lg shadow-[#FBBF24]/20 flex items-center gap-2 mx-auto cursor-pointer"
        >
          {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {tContent.back_button}
        </button>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all active:scale-90 flex items-center justify-center z-40 cursor-pointer"
          aria-label={tContent.scroll_top}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 bg-[#000000]/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button 
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition-all border border-slate-700 cursor-pointer z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + 4) % 4 : null));
            }}
            className="absolute left-6 p-3 text-white/70 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition-all border border-slate-700 cursor-pointer z-10"
            aria-label="Previous photo"
          >
            {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={[
                '/assets/images/about_media_1.jpg',
                '/assets/images/about_media_2.jpg',
                '/assets/images/about_media_3.jpg',
                '/assets/images/about_media_4.jpg'
              ][selectedPhotoIndex]} 
              alt="Fullscreen view" 
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
            <p className="text-slate-300 mt-4 text-sm font-bold bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
              {[
                'Students learning with tablets in rural Morocco',
                'Outdoor interactive session under trees',
                'Classroom digital lesson engagement',
                'Moroccan school coding club group'
              ][selectedPhotoIndex]}
            </p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % 4 : null));
            }}
            className="absolute right-6 p-3 text-white/70 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition-all border border-slate-700 cursor-pointer z-10"
            aria-label="Next photo"
          >
            {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutScreen;
