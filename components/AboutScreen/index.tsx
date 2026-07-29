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
    offline_tech_title: 'Offline-First Architecture',
    offline_tech_desc: 'To support schools in remote Atlas Mountain villages, our ecosystem features an offline-first database sync. Lessons and progress are cached locally on tablets, and synchronize seamlessly whenever a network connection is detected, ensuring uninterrupted learning.',

    methodology_title: 'Our Localized Methodology',
    methodology_desc: 'We translate abstract computer science concepts into familiar Moroccan cultural motifs, using storytelling that resonates with rural children.',
    meth_1_title: 'Argan Harvest Variables',
    meth_1_desc: 'Students learn variable declarations by conceptualizing them as baskets sorting argan nuts by size and type.',
    meth_2_title: 'Carpet Pattern Loops',
    meth_2_desc: 'Looping and iteration structures are taught by studying the repetitive geometric shapes in traditional Amazigh weaving designs.',
    meth_3_title: 'Moroccan Bread Functions',
    meth_3_desc: 'Functions and inputs are explained as baking Tafarnout bread, where raw ingredients go in and delicious loaves come out.',

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
    offline_tech_title: 'Architecture Axée sur le Hors-ligne',
    offline_tech_desc: 'Pour desservir les villages isolés du Haut Atlas, notre plateforme fonctionne entièrement hors ligne. Les progrès sont stockés localement sur les tablettes et synchronisés de manière transparente dès qu’une connexion réseau est détectée, garantissant un apprentissage continu.',

    methodology_title: 'Notre Méthodologie Localisée',
    methodology_desc: 'Nous traduisons les concepts informatiques abstraits en métaphores culturelles marocaines familières, favorisant l’assimilation.',
    meth_1_title: 'Variables de la Récolte d’Argan',
    meth_1_desc: 'Les élèves comprennent la déclaration de variables en les visualisant comme des paniers triant les noix d’argan par taille.',
    meth_2_title: 'Boucles des Motifs de Tapis',
    meth_2_desc: 'Les structures répétitives sont enseignées à travers les motifs géométriques des tissages traditionnels amazighs.',
    meth_3_title: 'Fonctions du Pain Tafarnout',
    meth_3_desc: 'Les fonctions et paramètres sont expliqués via la cuisson du pain Tafarnout, transformant les ingrédients bruts en miches cuites.',

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
    sdg_tab_10: 'الهدف 10: الحد من أوجه عدم المساواة',
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
    offline_tech_title: 'بنية تقنية تدعم العمل دون اتصال',
    offline_tech_desc: 'لخدمة المدارس في جبال الأطلس النائية، توفر المنصة ميزة المزامنة دون إنترنت. يتم حفظ الدروس والتقدم محلياً على الألواح الإلكترونية، وتُرفع تلقائياً للسحابة فور رصد شبكة اتصال لنضمن تعلماً مستمراً دون انقطاع.',

    methodology_title: 'منهجيتنا التعليمية المحلية',
    methodology_desc: 'نقوم بربط المفاهيم البرمجية بروافد ثقافية مغربية مألوفة، لتيسير الفهم وتنمية شغف التلاميذ بالابتكار.',
    meth_1_title: 'سلال متغيرات الأركان',
    meth_1_desc: 'يتعلم التلاميذ متغيرات البرمجة بتصورها كسلال تقوم بتخزين وتصنيف ثمار الأركان حسب الحجم والجودة.',
    meth_2_title: 'حلقات نقوش الزربية',
    meth_2_desc: 'تُشرح هياكل التكرار (Loops) من خلال تفكيك الأشكال الهندسية المتكررة والمرسومة على الزرابي الأمازيغية التقليدية.',
    meth_3_title: 'دوال خبز تافرنوت',
    meth_3_desc: 'نشرح الدوال والمدخلات بعملية تحضير خبز تافرنوت التقليدي؛ حيث تدخل المقادير كمدخلات لتنتج خبزاً شهياً كمخرجات.',

    gallery_title: 'نوادينا في عملها',
    gallery_desc: 'لحظات حقيقية مبهجة من نوادي الترميز التفاعلية في مدارسنا القروية بالمملكة.',

    back_button: 'الرجوع للرئيسية',
    scroll_top: 'الرجوع للأعلى',
  }
};

const GALLERY_PHOTOS = [
  { 
    src: '/assets/images/about_media_1.jpg', 
    alt: 'Students learning', 
    span: '1 / 7', 
    desc: 'Students learning with tablets in rural Morocco' 
  },
  { 
    src: '/assets/images/about_media_2.jpg', 
    alt: 'Outdoors session', 
    span: '7 / 13', 
    desc: 'Outdoor interactive session under trees' 
  },
  { 
    src: '/assets/images/about_media_3.jpg', 
    alt: 'Classroom coding', 
    span: '1 / 7', 
    desc: 'Classroom digital lesson engagement' 
  },
  { 
    src: '/assets/images/about_media_4.jpg', 
    alt: 'Partner school group', 
    span: '7 / 13', 
    desc: 'Moroccan school coding club group' 
  }
];

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
  const [gridOn, setGridOn] = useState(false);

  const isDashboard = window.location.pathname.startsWith('/dashboard');
  const port = window.location.port ? `:${window.location.port}` : '';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setGridOn(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gridOn) {
      document.body.classList.add('grid-on');
    } else {
      document.body.classList.remove('grid-on');
    }
  }, [gridOn]);

  useEffect(() => {
    const alignOptics = () => {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      if (!ctx) return;
      
      document.querySelectorAll('.opt-align').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.marginLeft = '0px';
        const cs = window.getComputedStyle(htmlEl);
        let ch = (htmlEl.textContent || '').trim().charAt(0);
        if (!ch) return;
        if (cs.textTransform === 'uppercase') ch = ch.toUpperCase();
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.textAlign = 'left';
        const abl = ctx.measureText(ch).actualBoundingBoxLeft;
        if (isFinite(abl)) {
          htmlEl.style.marginLeft = `-${abl.toFixed(2)}px`;
        }
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(alignOptics);
    }
    alignOptics();
    window.addEventListener('resize', alignOptics);
    return () => window.removeEventListener('resize', alignOptics);
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

  const renderGuides = () => (
    <div className="guides" aria-hidden="true">
      <div className="cols">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="col">
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="rows" />
      <div className="mline l" />
      <div className="mline r" />
    </div>
  );

  return (
    <div className={`muller-grid-root min-h-screen pb-24 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Scope-contained style block for the Müller-Brockmann layout */}
      <style>{`
        .muller-grid-root {
          --cols: 12;
          --bl: 8px;
          --lh: 24px;
          --gutter: 24px;
          --margin: 72px;
          --pad: 96px;
          --maxw: 1296px;
          
          --paper: #0a0f1d;
          --ink: #ffffff;
          --ink-soft: #94a3b8;
          --accent: #FBBF24;
          
          --g-col: rgba(251, 191, 36, 0.03);
          --g-edge: rgba(251, 191, 36, 0.2);
          --g-base: rgba(99, 102, 241, 0.15);
          --g-base-min: rgba(99, 102, 241, 0.05);
          
          background-color: var(--paper);
          color: var(--ink);
          font-family: "Inter", system-ui, sans-serif;
          line-height: var(--lh);
          -webkit-font-smoothing: antialiased;
        }

        .muller-grid-root,
        .muller-grid-root * {
          box-sizing: border-box;
        }

        /* Responsive Margins & Gutters to prevent horizontal scroll on mobile */
        @media (max-width: 992px) {
          .muller-grid-root {
            --margin: 40px;
            --gutter: 16px;
            --pad: 64px;
          }
        }

        @media (max-width: 640px) {
          .muller-grid-root {
            --margin: 20px;
            --gutter: 12px;
            --pad: 40px;
          }
        }

        /* Spreads & Wrappers */
        .muller-grid-root .spread {
          position: relative;
          width: 100%;
          border-bottom: 1px solid rgba(17, 19, 21, 0.08);
        }

        .muller-grid-root .wrap {
          position: relative;
          max-width: var(--maxw);
          margin: 0 auto;
          padding: var(--pad) var(--margin);
        }

        /* 12-Column Modular Grid template */
        .muller-grid-root .muller-grid {
          display: grid;
          grid-template-columns: repeat(var(--cols), 1fr);
          column-gap: var(--gutter);
          row-gap: var(--lh);
        }

        /* Subgrid bands */
        .muller-grid-root .band {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: subgrid;
          column-gap: var(--gutter);
          row-gap: var(--lh);
          align-items: start;
        }

        @supports not (grid-template-columns: subgrid) {
          .muller-grid-root .band {
            grid-template-columns: repeat(var(--cols), 1fr);
          }
        }

        /* Toggleable Overlay Guides */
        .muller-grid-root .guides {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 60;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        body.grid-on .muller-grid-root .guides {
          opacity: 1;
        }

        .muller-grid-root .guides .cols {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--margin);
          right: var(--margin);
          display: grid;
          grid-template-columns: repeat(var(--cols), 1fr);
          column-gap: var(--gutter);
        }

        .muller-grid-root .guides .col {
          background: var(--g-col);
          box-shadow: inset 1px 0 0 var(--g-edge), inset -1px 0 0 var(--g-edge);
          position: relative;
        }

        .muller-grid-root .guides .col span {
          position: absolute;
          top: 32px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: "Space Mono", monospace;
          font-size: 10px;
          line-height: 1;
          color: var(--accent);
        }

        .muller-grid-root .guides .rows {
          position: absolute;
          left: var(--margin);
          right: var(--margin);
          top: var(--pad);
          bottom: 0;
          background-image: 
            repeating-linear-gradient(to bottom, var(--g-base) 0 1px, transparent 1px var(--lh)),
            repeating-linear-gradient(to bottom, var(--g-base-min) 0 1px, transparent 1px var(--bl));
        }

        .muller-grid-root .guides .mline {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--g-edge);
        }

        .muller-grid-root .guides .mline.l {
          left: var(--margin);
        }

        .muller-grid-root .guides .mline.r {
          right: var(--margin);
        }

        /* Swiss Sizzle Toggle Button */
        .grid-sizzle-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--ink);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer;
          font-family: "Space Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 14px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        body.grid-on .grid-sizzle-toggle {
          background: var(--accent);
          color: #111827;
          border-color: var(--accent);
        }

        .grid-sizzle-toggle .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #555;
          transition: background 0.2s ease;
        }

        body.grid-on .grid-sizzle-toggle .dot {
          background: #111827;
        }

        /* Typography & Layout snapping */
        .muller-grid-root h1.masthead {
          font-family: "Inter", sans-serif;
          font-weight: 900;
          font-size: 64px;
          line-height: 64px;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          margin: 0;
          color: var(--ink);
        }

        .muller-grid-root .shead h2 {
          font-family: "Inter", sans-serif;
          font-weight: 850;
          font-size: 32px;
          line-height: 32px;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin: 0;
          color: var(--ink);
        }

        .muller-grid-root .numeral {
          font-family: "Inter", sans-serif;
          font-weight: 900;
          font-size: 56px;
          line-height: 56px;
          letter-spacing: -0.03em;
          color: var(--accent);
          margin: 0;
        }

        .muller-grid-root .mono-label {
          font-family: "Space Mono", monospace;
          font-size: 11px;
          line-height: 16px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent);
          font-weight: bold;
          margin: 0;
        }

        .muller-grid-root .caption {
          font-family: "Space Mono", monospace;
          font-size: 11px;
          line-height: 16px;
          color: var(--ink-soft);
        }

        /* Grid Alignment overrides */
        .muller-grid-root .lead-text {
          font-size: 18px;
          line-height: 28px;
          font-weight: 500;
          color: var(--ink);
        }

        .muller-grid-root .body-text {
          font-size: 14px;
          line-height: 22px;
          color: var(--ink-soft);
          text-align: justify;
        }

        .muller-grid-root .hr-grid {
          grid-column: 1 / -1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0;
          border: none;
        }

        /* Tabs & interactive cards */
        .muller-grid-root .pill-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.01);
          padding: 24px;
          transition: all 0.2s ease;
        }
        .muller-grid-root .pill-card:hover {
          border-color: var(--accent);
          background: rgba(251, 191, 36, 0.02);
        }
      `}</style>

      {/* 1. Floating Header (grotesque alignment) */}
      {!isDashboard && (
        <header className="fixed top-0 left-0 right-0 bg-[#0a0f1d]/90 backdrop-blur-md z-50 border-b border-slate-800 transition-all duration-300">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center cursor-pointer shrink-0" onClick={() => navigate('/')}>
              <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-8 w-auto object-contain" />
            </div>

            <nav className={`hidden lg:flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <a href={getPlatformHref('academy', '/dashboard')} onClick={(e) => handleCardClick(e, 'academy', '/dashboard')} className="text-white hover:text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                Academy
              </a>
              <div className="w-[1px] h-3 bg-slate-350 self-center" />
              <a href={getPlatformHref('os', '/cftos')} onClick={(e) => handleCardClick(e, 'os', '/cftos')} className="text-white hover:text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                Open Source
              </a>
              <div className="w-[1px] h-3 bg-slate-350 self-center" />
              <a href={getPlatformHref('docs', '/blog')} onClick={(e) => handleCardClick(e, 'docs', '/blog')} className="text-white hover:text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                Docs & Blog
              </a>
              <div className="w-[1px] h-3 bg-slate-350 self-center" />
              <a href="/about" className="text-[#FBBF24] transition-colors text-xs font-bold uppercase tracking-wider">
                About
              </a>
            </nav>

            <div className="hidden md:flex items-center">
              <button onClick={onGetStarted} className="bg-[#FBBF24] text-[#111827] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-[#f59e0b] transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-[#FBBF24]/20">
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
        <div className="fixed inset-0 bg-[#111827]/95 z-50 md:hidden flex flex-col p-8">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-1 text-white hover:text-[#FBBF24]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <nav className="flex flex-col space-y-6 mt-16 text-center">
            <a href={getPlatformHref('academy', '/dashboard')} className="text-xl font-black uppercase text-white hover:text-[#FBBF24]">Academy</a>
            <a href={getPlatformHref('os', '/cftos')} className="text-xl font-black uppercase text-white hover:text-[#FBBF24]">Open Source</a>
            <a href={getPlatformHref('docs', '/blog')} className="text-xl font-black uppercase text-white hover:text-[#FBBF24]">Docs & Blog</a>
            <a href="/about" className="text-xl font-black uppercase text-[#FBBF24]">About</a>
            <button onClick={onGetStarted} className="mt-8 bg-[#FBBF24] text-[#111827] font-bold px-8 py-4 rounded text-lg hover:bg-[#f59e0b]">
              Launch Ecosystem
            </button>
          </nav>
        </div>
      )}

      {/* SPREAD 1: HERO / INTRODUCTION */}
      <section className="spread pt-16">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align" style={{ gridColumn: '1 / 13' }}>Code for Tomorrow</span>
              <h1 className="masthead opt-align mt-4" style={{ gridColumn: '1 / 13' }}>
                {tContent.title}
              </h1>
            </div>
            
            <div className="band mt-6">
              <p className="lead-text" style={{ gridColumn: '1 / 9' }}>
                {tContent.subtitle}
              </p>
            </div>

            <div className="band mt-6">
              <hr className="hr-grid mb-4" />
              <p className="body-text" style={{ gridColumn: '1 / 7' }}>
                {tContent.tagline}
              </p>
              <div style={{ gridColumn: '8 / 13' }} className="flex justify-center items-center">
                <img src="/assets/images/logo.png" alt="Logo" className="h-12 w-auto opacity-75" />
              </div>
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* SPREAD 2: MISSION & VISION */}
      <section className="spread">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align">Foundational Ethic</span>
              <h2 className="numeral opt-align mt-2" style={{ gridColumn: '1 / 13' }}>01</h2>
            </div>
            
            <div className="band mt-8">
              <div style={{ gridColumn: '1 / 6' }} className="pill-card">
                <div className="w-8 h-8 flex items-center justify-center text-[#FBBF24] mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black uppercase text-white mb-3">{tContent.our_mission}</h3>
                <p className="body-text">{tContent.mission_desc}</p>
              </div>

              <div style={{ gridColumn: '7 / 12' }} className="pill-card">
                <div className="w-8 h-8 flex items-center justify-center text-[#FBBF24] mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black uppercase text-white mb-3">{tContent.our_vision}</h3>
                <p className="body-text">{tContent.vision_desc}</p>
              </div>
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* SPREAD 3: PILLARS & SDG ALIGNMENT */}
      <section className="spread">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align">Pillars of Action</span>
              <h2 className="numeral opt-align mt-2" style={{ gridColumn: '1 / 13' }}>02</h2>
            </div>

            <div className="band mt-8">
              <div style={{ gridColumn: '1 / 5' }} className="pill-card">
                <div className="w-8 h-8 text-[#FBBF24] mb-4"><GraduationCap className="w-5 h-5" /></div>
                <h4 className="text-base font-black uppercase text-white mb-2">{tContent.pillar_students_title}</h4>
                <p className="body-text">{tContent.pillar_students_desc}</p>
              </div>

              <div style={{ gridColumn: '5 / 9' }} className="pill-card">
                <div className="w-8 h-8 text-[#FBBF24] mb-4"><Users className="w-5 h-5" /></div>
                <h4 className="text-base font-black uppercase text-white mb-2">{tContent.pillar_teachers_title}</h4>
                <p className="body-text">{tContent.pillar_teachers_desc}</p>
              </div>

              <div style={{ gridColumn: '9 / 13' }} className="pill-card">
                <div className="w-8 h-8 text-[#FBBF24] mb-4"><Network className="w-5 h-5" /></div>
                <h4 className="text-base font-black uppercase text-white mb-2">{tContent.pillar_community_title}</h4>
                <p className="body-text">{tContent.pillar_community_desc}</p>
              </div>
            </div>

            <hr className="hr-grid my-8" />

            {/* SDG Sub-Section */}
            <div className="band">
              <div style={{ gridColumn: '1 / 5' }}>
                <span className="mono-label">UN SDG ALIGNMENT</span>
                <h3 className="text-lg font-black uppercase text-white mt-2">{tContent.sdg_title}</h3>
                <p className="body-text mt-3">{tContent.sdg_desc}</p>
              </div>

              <div style={{ gridColumn: '6 / 13' }} className="pill-card">
                <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3 justify-start">
                  {[4, 5, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setActiveSdg(num)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSdg === num
                          ? 'bg-[#FBBF24] text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      SDG {num}
                    </button>
                  ))}
                </div>

                <div className="min-h-[100px]">
                  <h4 className="text-base font-black text-white mb-2">
                    {activeSdg === 4 && tContent.sdg_tab_4}
                    {activeSdg === 5 && tContent.sdg_tab_5}
                    {activeSdg === 9 && tContent.sdg_tab_9}
                    {activeSdg === 10 && tContent.sdg_tab_10}
                  </h4>
                  <p className="body-text">
                    {activeSdg === 4 && tContent.sdg_tab_4_desc}
                    {activeSdg === 5 && tContent.sdg_tab_5_desc}
                    {activeSdg === 9 && tContent.sdg_tab_9_desc}
                    {activeSdg === 10 && tContent.sdg_tab_10_desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* SPREAD 4: MEASURABLE OUTCOMES */}
      <section className="spread">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align">Measurable Impact</span>
              <h2 className="numeral opt-align mt-2" style={{ gridColumn: '1 / 13' }}>03</h2>
            </div>

            <div className="band mt-8">
              {[
                { val: tContent.metric_students, sub: tContent.metric_students_sub, span: '1 / 4' },
                { val: tContent.metric_schools, sub: tContent.metric_schools_sub, span: '4 / 7' },
                { val: tContent.metric_courses, sub: tContent.metric_courses_sub, span: '7 / 10' },
                { val: tContent.metric_cost, sub: tContent.metric_cost_sub, span: '10 / 13' }
              ].map((m, i) => (
                <div key={i} style={{ gridColumn: m.span }} className="pill-card text-center">
                  <p className="numeral opt-align">{m.val}</p>
                  <p className="caption mt-2 font-bold uppercase tracking-wider">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* SPREAD 5: MOROCCAN CONTEXT & OFFLINE TECH */}
      <section className="spread">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align">Local Context</span>
              <h2 className="numeral opt-align mt-2" style={{ gridColumn: '1 / 13' }}>04</h2>
            </div>

            <div className="band mt-8">
              <div style={{ gridColumn: '1 / 7' }}>
                <h3 className="text-xl font-black uppercase text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FBBF24]" />
                  {tContent.moroccan_context_title}
                </h3>
                <p className="body-text mb-4">{tContent.moroccan_context_desc1}</p>
                <p className="body-text">{tContent.moroccan_context_desc2}</p>
              </div>

              <div style={{ gridColumn: '8 / 13' }} className="pill-card border-l-4 border-l-[#FBBF24]">
                <h3 className="text-base font-black uppercase text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FBBF24]" />
                  {tContent.offline_tech_title}
                </h3>
                <p className="body-text">{tContent.offline_tech_desc}</p>
              </div>
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* SPREAD 6: LOCALIZED METHODOLOGY */}
      <section className="spread">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align">Localized Pedagogy</span>
              <h2 className="numeral opt-align mt-2" style={{ gridColumn: '1 / 13' }}>05</h2>
            </div>
            
            <div className="band mt-4">
              <p className="lead-text" style={{ gridColumn: '1 / 9' }}>
                {tContent.methodology_desc}
              </p>
            </div>

            <div className="band mt-8">
              {[
                { title: tContent.meth_1_title, desc: tContent.meth_1_desc, span: '1 / 5', icon: Layers },
                { title: tContent.meth_2_title, desc: tContent.meth_2_desc, span: '5 / 9', icon: Network },
                { title: tContent.meth_3_title, desc: tContent.meth_3_desc, span: '9 / 13', icon: Target }
              ].map((m, i) => (
                <div key={i} style={{ gridColumn: m.span }} className="pill-card">
                  <div className="w-8 h-8 rounded bg-slate-800/40 flex items-center justify-center text-[#FBBF24] mb-4">
                    <m.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2">{m.title}</h3>
                  <p className="body-text text-xs">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* SPREAD 7: PHOTO GALLERY */}
      <section className="spread">
        <div className="wrap">
          <div className="muller-grid">
            <div className="band">
              <span className="mono-label opt-align">Clubs in Action</span>
              <h2 className="numeral opt-align mt-2" style={{ gridColumn: '1 / 13' }}>06</h2>
            </div>
            
            <div className="band mt-4">
              <p className="lead-text" style={{ gridColumn: '1 / 9' }}>
                {tContent.gallery_desc}
              </p>
            </div>

            <div className="band mt-8">
              {GALLERY_PHOTOS.map((img, idx) => (
                <div
                  key={idx}
                  style={{ gridColumn: img.span }}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="relative aspect-[4/3] rounded overflow-hidden border border-slate-200 shadow-md group cursor-pointer"
                >
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-[10px] font-bold text-white tracking-wide uppercase">{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {renderGuides()}
        </div>
      </section>

      {/* FOOTER BAND */}
      <section className="spread border-none">
        <div className="wrap py-12">
          <div className="muller-grid">
            <div className="band justify-center">
              <button
                type="button"
                onClick={() => {
                  window.location.href = isDashboard ? '/dashboard' : '/';
                }}
                className="bg-[#FBBF24] text-slate-950 font-black text-xs uppercase tracking-wider px-8 py-3 rounded hover:bg-[#f59e0b] active:scale-95 transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {tContent.back_button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button 
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition-all border border-slate-700 cursor-pointer z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length : null));
            }}
            className="absolute left-6 p-3 text-white/70 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition-all border border-slate-700 cursor-pointer z-10"
            aria-label="Previous photo"
          >
            {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {selectedPhotoIndex !== null && GALLERY_PHOTOS[selectedPhotoIndex] && (
              <>
                <img 
                  src={GALLERY_PHOTOS[selectedPhotoIndex].src} 
                  alt="Fullscreen view" 
                  className="max-w-full max-h-[75vh] object-contain rounded-lg border border-slate-800 shadow-2xl"
                />
                <p className="text-slate-300 mt-4 text-xs font-bold bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800 text-center max-w-lg">
                  {GALLERY_PHOTOS[selectedPhotoIndex].desc}
                </p>
              </>
            )}
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_PHOTOS.length : null));
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
