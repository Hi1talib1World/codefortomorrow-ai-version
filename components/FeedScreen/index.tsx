import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../ToastNotification';
import GuestLoginBanner from '../GuestLoginBanner';
import { motion } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Send, 
  Flame, 
  Trophy, 
  Share2, 
  Zap,
  ChevronDown,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  X,
  Link,
  Code,
  Bot,
  Search,
  Filter
} from 'lucide-react';

interface FeedScreenProps {
  currentUser: User;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
}

interface PostAuthor {
  _id: string;
  name: string;
  profilePictureUrl: string;
  role: 'student' | 'teacher' | 'admin';
  professionalTitle?: string;
  city?: string;
}

interface Milestone {
  type: 'lesson' | 'streak' | 'xp' | 'level' | 'general';
  title: string;
  value: string | number;
}

interface Comment {
  _id?: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  author: PostAuthor;
  content: string;
  codeSnippet?: string;
  tag?: string;
  milestone?: Milestone;
  likes: string[]; // User IDs
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const feedTranslations = {
  en: {
    hubBadge: 'Google AI Community Hub',
    feedTitlePrefix: 'Student ',
    feedTitleSuffix: 'Community Feed',
    subtitle: 'Connect with fellow learners, share your code projects, ask questions, and celebrate your coding milestones!',
    streak: 'Streak',
    totalXp: 'Total XP',
    postPlaceholder: 'Share a code snippet, ask a question, or post your latest project...',
    noBadge: 'No Badge',
    sharePost: 'Share Post',
    publishing: 'Publishing...',
    all: 'All',
    studentProjects: 'Student Projects',
    qAndA: 'Q&A',
    milestones: 'Milestones',
    mentors: 'Mentors',
    mentorRole: 'Mentor',
    studentRole: 'Student',
    studentCoder: 'Student Coder',
    like: 'Like',
    likes: 'Likes',
    comments: 'Comments',
    writeComment: 'Write a comment...',
    reply: 'Reply',
    codeSnippet: 'Code Snippet',
    guestBannerTitle: 'Sign in to post code snippets & interact with classmates',
    guestBannerDesc: 'You are currently exploring in Guest Mode. Log in or create a free account to publish posts, like student code projects, and write comments!'
  },
  fr: {
    hubBadge: 'Centre Communautaire Google AI',
    feedTitlePrefix: 'Fil de ',
    feedTitleSuffix: 'la Communauté Étudiante',
    subtitle: 'Connectez-vous avec d\'autres apprenants, partagez vos projets de code, posez des questions et célébrez vos étapes !',
    streak: 'Série',
    totalXp: 'XP Total',
    postPlaceholder: 'Partagez un extrait de code, posez une question ou publiez votre dernier projet...',
    noBadge: 'Sans Badge',
    sharePost: 'Partager',
    publishing: 'Publication...',
    all: 'Tous',
    studentProjects: 'Projets Étudiants',
    qAndA: 'Q&R',
    milestones: 'Réalisations',
    mentors: 'Mentors',
    mentorRole: 'Mentor',
    studentRole: 'Étudiant',
    studentCoder: 'Codeur Étudiant',
    like: 'J\'aime',
    likes: 'J\'aime',
    comments: 'Commentaires',
    writeComment: 'Écrire un commentaire...',
    reply: 'Répondre',
    codeSnippet: 'Extrait de code',
    guestBannerTitle: 'Connectez-vous pour publier du code et interagir avec vos camarades',
    guestBannerDesc: 'Vous explorez actuellement en mode Invité. Connectez-vous ou créez un compte gratuit pour publier et commenter !'
  },
  ar: {
    hubBadge: 'مركز مجتمع الذكاء الاصطناعي من جوجل',
    feedTitlePrefix: 'موجز ',
    feedTitleSuffix: 'مجتمع الطلاب',
    subtitle: 'تواصل مع زملائك المتعلمين، وشارك مشاريعك البرمجية، واطرح الأسئلة، واحتفل بإنجازاتك البرمجية!',
    streak: 'سلسلة الأيام',
    totalXp: 'مجموع النقاط',
    postPlaceholder: 'شارك مقطع كود، اطرح سؤالاً، أو انشر أحدث مشاريعك...',
    noBadge: 'بدون وسام',
    sharePost: 'نشر المشاركة',
    publishing: 'جاري النشر...',
    all: 'الكل',
    studentProjects: 'مشاريع الطلاب',
    qAndA: 'أسئلة وأجوبة',
    milestones: 'الإنجازات',
    mentors: 'الموجهون',
    mentorRole: 'موجه',
    studentRole: 'طالب',
    studentCoder: 'طالب برمجة',
    like: 'إعجاب',
    likes: 'إعجابات',
    comments: 'تعليقات',
    writeComment: 'اكتب تعليقاً...',
    reply: 'رد',
    codeSnippet: 'مقطع كود',
    guestBannerTitle: 'تسجيل الدخول لنشر المقاطع البرمجية والتفاعل مع الزملاء',
    guestBannerDesc: 'أنت تتصفح حالياً في وضع الزائر. سجل الدخول أو أنشئ حساباً مجانياً لنشر المشاركات والإعجاب بمشاريع الطلاب والتعليق عليها!'
  }
};

const AUTHENTIC_COMMUNITY_POSTS = (lang: string): Post[] => {
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  const authors: PostAuthor[] = [
    { _id: 'author_adam', name: 'Adam El Kadi', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Adam+El+Kadi&background=1A73E8&color=fff', role: 'student', professionalTitle: isAr ? 'طالب بايثون • الصويرة' : isFr ? 'Étudiant Python • Essaouira' : 'Python Student • Essaouira' },
    { _id: 'author_sara', name: 'Sara Berrada', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Sara+Berrada&background=34A853&color=fff', role: 'student', professionalTitle: isAr ? 'طالبة تطوير الويب • الصويرة' : isFr ? 'Étudiante Web Dev • Essaouira' : 'Web Dev Student • Essaouira' },
    { _id: 'author_youssef', name: 'Youssef Mansouri', city: 'Casablanca', profilePictureUrl: 'https://ui-avatars.com/api/?name=Youssef+Mansouri&background=EA4335&color=fff', role: 'student', professionalTitle: isAr ? 'متعلم جافاسكريبت • كازابلانكا' : isFr ? 'Apprenant JavaScript • Casablanca' : 'JavaScript Learner • Casablanca' },
    { _id: 'author_mohamed', name: isAr ? 'الموجه محمد' : 'Mentor Mohamed', city: 'Essaouira', profilePictureUrl: 'https://ui-avatars.com/api/?name=Mohamed+Fassi&background=8E24AA&color=fff', role: 'teacher', professionalTitle: isAr ? 'كبير موجهي البرمجة • مركز الصويرة' : isFr ? 'Mentor de Code • Essaouira Hub' : 'Lead Coding Mentor • Essaouira Hub' },
    { _id: 'author_ghita', name: 'Ghita Benjelloun', city: 'Marrakech', profilePictureUrl: 'https://ui-avatars.com/api/?name=Ghita+Benjelloun&background=FBBC04&color=fff', role: 'student', professionalTitle: isAr ? 'مستكشفة واجهات • مراكش' : isFr ? 'Exploratrice Front-End • Marrakech' : 'Front-End Explorer • Marrakech' },
    { _id: 'author_karim', name: 'Karim Alami', city: 'Rabat', profilePictureUrl: 'https://ui-avatars.com/api/?name=Karim+Alami&background=00D2D3&color=fff', role: 'student', professionalTitle: isAr ? 'طالب C++ والخوارزميات • الرباط' : isFr ? 'Étudiant C++ & Algorithmes • Rabat' : 'C++ & Algo Student • Rabat' },
    { _id: 'author_lina', name: 'Lina Tazi', city: 'Tanger', profilePictureUrl: 'https://ui-avatars.com/api/?name=Lina+Tazi&background=E84393&color=fff', role: 'student', professionalTitle: isAr ? 'مطورة جافا وأندرويد • طنجة' : isFr ? 'Développeuse Java & Android • Tanger' : 'Java & Android Dev • Tanger' },
    { _id: 'author_ines', name: 'Inès Chraïbi', city: 'Agadir', profilePictureUrl: 'https://ui-avatars.com/api/?name=Ines+Chraibi&background=6C5CE7&color=fff', role: 'student', professionalTitle: isAr ? 'مطورة Node.js • أغادير' : isFr ? 'Développeuse Full-Stack • Agadir' : 'Full-Stack Dev • Agadir' },
  ];

  const postsData: Omit<Post, '_id' | 'updatedAt'>[] = [
    {
      author: authors[0],
      content: isAr
        ? 'نجحت أخيرًا في تشغيل لعبة الثعبان بـ Pygame! 🐍 أضفت نظام حفظ أعلى نتيجة في ملف محلي. سعيد جدًا بحركة الثعبان المنسابة الآن!'
        : 'J\'ai enfin réussi à faire fonctionner mon jeu de serpent Pygame ! 🐍 Ajout d\'un système de meilleur score avec sauvegarde de fichier local. Très satisfait de la fluidité de la boucle de jeu.',
      codeSnippet: `def save_high_score(score):\n    with open("highscore.txt", "w") as f:\n        f.write(str(score))\nprint("Meilleur score sauvegardé avec succès !")`,
      tag: isAr ? 'مشروع بايثون' : 'Projet Python',
      milestone: {
        type: 'xp',
        title: isAr ? 'وصل إلى مجموع 1,450 نقطة خبرة!' : 'Atteint 1 450 XP Total !',
        value: 1450
      },
      likes: ['author_sara', 'author_mohamed', 'author_youssef', 'author_karim'],
      comments: [
        {
          author: authors[3],
          content: isAr ? 'كود ممتاز ونظيف يا آدم! الخطوة التالية: أضف كتلة try-except لحماية الملف عند القراءة 👍' : 'Gestion de fichier très propre Adam ! Prochaine étape : ajoute un bloc try-except au cas où le fichier n\'existe pas encore à la lecture.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          author: authors[0],
          content: isAr ? 'ملاحظة ممتازة أستاذ محمد! جاري إضافة try-except FileNotFoundError الآن 👍' : 'Excellente remarque Mentor Mohamed ! J\'ajoute le try-except FileNotFoundError de ce pas 👍',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'سؤال سريع لمحتصفي HTML/CSS: كيف تحافظ على شريط التنقل (Navbar) ثابتاً في الهاتف بدون مشاكل z-index؟'
        : 'Petite question pour les passionnés de HTML/CSS : Comment gardez-vous la barre de navigation (Navbar) fixe sur mobile sans créer de conflits d\'empilement z-index ?',
      tag: isAr ? 'مساعدة CSS' : 'Aide CSS',
      likes: ['author_adam', 'author_ghita', 'author_ines'],
      comments: [
        {
          author: authors[4],
          content: isAr ? 'جربي إضافة position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px);!' : 'Essaie d\'ajouter position: sticky; top: 0; z-index: 50; backdrop-filter: blur(10px); ! Ça a parfaitement fonctionné sur mon portfolio.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'حققت 14 يوماً متواصلة على Code for Tomorrow! 🎯 اجتزت اختبار مصفوفات JavaScript بنسبة 100%.'
        : 'Série de 14 jours consécutifs sur Code for Tomorrow ! 🎯 J\'ai obtenu 100% au quiz sur les méthodes de tableaux JavaScript.',
      tag: isAr ? 'إنجاز السلسلة' : 'Série de jours',
      milestone: {
        type: 'streak',
        title: isAr ? 'حقق سلسلة 14 يوماً متواصلة!' : 'Série de 14 jours atteinte !',
        value: 14
      },
      likes: ['author_adam', 'author_sara', 'author_mohamed', 'author_ghita'],
      comments: [
        {
          author: authors[1],
          content: isAr ? 'مبروك يوسف! 14 يوماً إنجاز رائع 🔥 واصل تقدمك!' : 'Félicitations Youssef ! 14 jours d\'affilée c\'est super impressionnant 🔥 Continue comme ça !',
          createdAt: new Date(Date.now() - 3600000 * 7).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'طاقة رائعة في ورشة المنطق اليوم! 🚀 تذكر: لا تحفظ الكود سطرًا بسطر—ركز على فهم نمط حل المشكلة.'
        : 'Superbe énergie lors de notre atelier de logique du week-end ! 🚀 Rappelez-vous : ne mémorisez jamais le code ligne par ligne, concentrez-vous sur la compréhension du pattern de résolution.',
      tag: isAr ? 'نصيحة موجه' : 'Conseil de Mentor',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita', 'author_karim', 'author_lina'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      author: authors[4],
      content: isAr
        ? 'قمت بنشر أول موقع شخصي لي متجاوب مع الهواتف! تم بناؤه بـ HTML5 و CSS Flexbox 🎨'
        : 'Je viens de publier mon tout premier site portfolio responsive ! Développé avec du HTML5 sémantique et CSS Flexbox. Stylisé avec des variables CSS et Google Fonts 🎨',
      tag: isAr ? 'معرض الويب' : 'Vitrine Web',
      milestone: {
        type: 'level',
        title: isAr ? 'أكمل المستوى 4 في مسار الويب!' : 'Niveau 4 du parcours Web validé !',
        value: 4
      },
      likes: ['author_sara', 'author_mohamed', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      author: authors[5],
      content: isAr
        ? 'أخيرًا فهمت الفرق بين التمرير بالقيمة والتمرير بالمرجع في C++! 💡 الإشارات والمؤشرات لم تعد مخيفة.'
        : 'Aujourd\'hui, j\'ai enfin assimilé la différence entre le passage par valeur et le passage par référence en C++ ! 💡 Les pointeurs ne me font plus peur.',
      codeSnippet: `void doubler(int* ptr) {\n    *ptr = *ptr * 2;\n}\nint val = 10;\ndoubler(&val); // val vaut désormais 20`,
      tag: isAr ? 'مفهوم C++' : 'Concept C++',
      likes: ['author_mohamed', 'author_adam', 'author_lina'],
      comments: [
        {
          author: authors[3],
          content: isAr ? 'ممتاز كريم! الفهم العميق للذاكرة والمؤشرات يجعل منك مبرمجاً قوياً جدًا 💪' : 'Bravo Karim ! La maîtrise de la mémoire et des pointeurs est ce qui distingue les grands développeurs 💪',
          createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
    },
    {
      author: authors[6],
      content: isAr
        ? 'أول واجهة تطبيق أنشئها بـ Java Swing تعمل بنجاح! 📱 الخطوة التالية الانتقال إلى Kotlin و Android Studio.'
        : 'Mon premier composant d\'interface graphique en Java Swing fonctionne à la perfection ! 📱 Prochaine étape : la transition vers Kotlin et Android Studio.',
      tag: isAr ? 'مشروع جافا' : 'Projet Java',
      likes: ['author_sara', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 25).toISOString()
    },
    {
      author: authors[7],
      content: isAr
        ? 'من يستخدم async/await لجلب البيانات من APIs في جافاسكريبت؟ أسهل بكثير في القراءة مقارنة بـ .then() المتسلسلة!'
        : 'Qui d\'autre utilise async/await pour les appels API en JavaScript ? La lisibilité est tellement supérieure par rapport aux chaînes de .then() !',
      codeSnippet: `async function fetchUserData(userId) {\n  const res = await fetch(\`/api/users/\${userId}\`);\n  const data = await res.json();\n  return data;\n}`,
      tag: isAr ? 'تطوير جافاسكريبت' : 'Astuce JS',
      likes: ['author_youssef', 'author_ghita', 'author_adam'],
      comments: [
        {
          author: authors[2],
          content: isAr ? 'متفق معك 100%! الكود يبدو كأنه يتنفذ بشكل متزامن وبسيط 👌' : 'Totalement d\'accord ! Le code devient tellement plus simple à lire et à déboguer 👌',
          createdAt: new Date(Date.now() - 3600000 * 27).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
    },
    {
      author: authors[0],
      content: isAr
        ? 'إنجاز جديد: الوصول إلى 2,000 نقطة خبرة XP! 🏆 شكراً للمجتمع على الدعم والتشجيع اليومي.'
        : 'Nouveau cap franchi : 2 000 XP accumulés ! 🏆 Un grand merci à toute la communauté pour les retours quotidiens et les encouragements.',
      tag: isAr ? 'إنجاز نقاط' : 'Réalisation XP',
      milestone: {
        type: 'xp',
        title: isAr ? 'وصل إلى مجموع 2,000 نقطة خبرة!' : 'Atteint 2 000 XP Total !',
        value: 2000
      },
      likes: ['author_sara', 'author_mohamed', 'author_youssef', 'author_karim', 'author_lina', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 30).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'نصيحة سريعة في CSS: استخدم دالة clamp() للحصول على أحجام خطوط مرنة وتجاوبية بدون استخدام media queries كثيرة!'
        : 'Astuce CSS du jour : Utilisez la fonction clamp() pour créer des typographies fluides et réactives sans multiplier les media queries !',
      codeSnippet: `font-size: clamp(1rem, 2.5vw, 2rem);`,
      tag: isAr ? 'نصيحة CSS' : 'Astuce CSS',
      likes: ['author_ghita', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 34).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'صممت حاسبة تفاعلية باستخدام Vanilla JavaScript مع دعم كامل للوحة المفاتيح. الكود مقسم إلى وحدات ES6 نظيفة 🧮'
        : 'J\'ai conçu une calculatrice interactive en Vanilla JavaScript avec prise en charge complète du clavier. Tout le code est structuré en modules ES6 🧮',
      tag: isAr ? 'مشروع جافاسكريبت' : 'Projet JS',
      likes: ['author_adam', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 38).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'نصيحة لكل المبتدئين: اعتادوا على كتابة التعليقات واستخدام أسماء متغيرات واضحة. ستشكرون أنفسكم مستقبلاً!'
        : 'Conseil bienveillant pour tous les débutants : Prenez l\'habitude de documenter votre code et d\'utiliser des noms de variables explicites. Votre "moi du futur" vous en sera très reconnaissant !',
      tag: isAr ? 'نصيحة موجه' : 'Conseil de Mentor',
      likes: ['author_sara', 'author_youssef', 'author_karim', 'author_lina'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 42).toISOString()
    },
    {
      author: authors[4],
      content: isAr
        ? 'أنهيت وحدة CSS Grid بنجاح. بناء الشبكات المعقدة المكونة من 3 أعمدة أصبح ممتعاً وسريعاً 📐'
        : 'Je viens de terminer le module complet sur CSS Grid Layout. La conception de grilles complexes à 3 colonnes est devenue tellement intuitive 📐',
      tag: isAr ? 'تعلم الويب' : 'Apprentissage Web',
      likes: ['author_sara', 'author_adam'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 46).toISOString()
    },
    {
      author: authors[5],
      content: isAr
        ? 'مشروع عطلة نهاية الأسبوع: محاكاة مرئية لخوارزمية Tri par Sélection في C++. رؤية التبادل المباشر للعناصر تساعد في الفهم.'
        : 'Projet du week-end : Un visualiseur d\'algorithme de tri par sélection développé en C++. Observer les permutations d\'éléments en direct aide énormément à comprendre.',
      tag: isAr ? 'خوارزميات' : 'Algorithmique',
      likes: ['author_mohamed', 'author_lina'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 50).toISOString()
    },
    {
      author: authors[6],
      content: isAr
        ? 'تحقيق هدف كبير: 30 يوماً متواصلة على المنصة! 🚀 الاستمرارية هي السر الحقيقي للتميز في البرمجة.'
        : 'Objectif majeur atteint : 30 jours consécutifs d\'apprentissage sur Code for Tomorrow ! 🚀 La régularité est la véritable clé de la réussite.',
      tag: isAr ? 'إنجاز السلسلة' : 'Série de jours',
      milestone: {
        type: 'streak',
        title: isAr ? 'حقق سلسلة 30 يوماً متواصلة!' : 'Série de 30 jours atteinte !',
        value: 30
      },
      likes: ['author_adam', 'author_sara', 'author_mohamed', 'author_youssef', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 54).toISOString()
    },
    {
      author: authors[7],
      content: isAr
        ? 'سؤال للمطورين: ما هي أفضل طريقة لإدارة متغيرات البيئة (.env) في تطبيقات Node.js/Express عند النشر؟'
        : 'Question pour les développeurs backend : Quelle est la meilleure pratique pour gérer les variables d\'environnement (.env) dans une application Node.js / Express ?',
      tag: isAr ? 'أسئلة بايند' : 'Question Backend',
      likes: ['author_youssef', 'author_karim'],
      comments: [
        {
          author: authors[3],
          content: isAr ? 'استخدمي مكتبة dotenv ولا تقومي مطلقاً برفع ملف .env إلى dجداول Git. أضيفي .env إلى .gitignore!' : 'Utilise le module dotenv et ne commite jamais le fichier .env sur Git. N\'oublie pas d\'ajouter .env dans ton fichier .gitignore !',
          createdAt: new Date(Date.now() - 3600000 * 56).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 58).toISOString()
    },
    {
      author: authors[0],
      content: isAr
        ? 'قمت بكتابة سكربت بايثون لأتمتة إعادة تسمية الملفات في المجلد. معالجة 50 ملفاً في 0.2 ثانية فقط! ⚡'
        : 'J\'ai écrit un script Python pour automatiser le renommage de mes fichiers dans un dossier. 50 fichiers traités en seulement 0,2 seconde ! ⚡',
      codeSnippet: `import os\nfor idx, filename in enumerate(os.listdir(".")):\n    if filename.endswith(".png"):\n        os.rename(filename, f"image_\${idx}.png")`,
      tag: isAr ? 'أتمتة بايثون' : 'Automatisation',
      likes: ['author_ines', 'author_karim'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 62).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'أطلقت تطبيقي الأول بـ React: تطبيق طقس حي يستجلب البيانات من OpenWeather API مع إعادة التحديث التلقائي! ⛅'
        : 'Je viens d\'inaugurer mon projet React : Un tableau de bord météo en temps réel interrogeant l\'API OpenWeather avec mise à jour dynamique ! ⛅',
      tag: isAr ? 'مشروع رياكت' : 'Projet React',
      likes: ['author_youssef', 'author_ghita', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 66).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'طريقة التعامل مع المصفوفات باستخدام .map() و .filter() و .reduce() في جافاسكريبت تغير طريقة التفكير تماماً!'
        : 'La manipulation des tableaux avec .map(), .filter() et .reduce() en JavaScript transforme complètement la façon d\'écrire un code propre et déclaratif !',
      codeSnippet: `const nombres = [1, 2, 3, 4, 5];\nconst pairsDoubles = nombres.filter(n => n % 2 === 0).map(n => n * 2);\nconsole.log(pairsDoubles); // [4, 8]`,
      tag: isAr ? 'نصيحة جافاسكريبت' : 'Astuce JS',
      likes: ['author_adam', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 70).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'تذكير للجميع: ورشة الهاكاثون البرمجي هذا السبت في مركز الصويرة! جهزوا فرقكم ومحررات الكود 🏆'
        : 'Rappel à toute la communauté : Le Hackathon de programmation aura lieu ce samedi au Hub d\'Essaouira ! Préparez vos équipes et vos éditeurs de code 🏆',
      tag: isAr ? 'فعالية' : 'Événement',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita', 'author_karim', 'author_lina', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 74).toISOString()
    },
    {
      author: authors[4],
      content: isAr
        ? 'اكتشفت خاصية الوضع الداكن التلقائي باستخدام @media (prefers-color-scheme: dark). أصبح موقعي يتكيف تلقائياً مع نظام المستخدم!'
        : 'J\'ai implémenté le mode sombre automatique avec @media (prefers-color-scheme: dark). Mon site s\'adapte désormais instantanément aux préférences du système !',
      tag: isAr ? 'تطوير الويب' : 'Astuce Web',
      likes: ['author_sara', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 78).toISOString()
    },
    {
      author: authors[5],
      content: isAr
        ? 'بناء هيكل بيانات شجرة البحث الثنائية (BST) في C++. استخدام الدوال العودية أمر في غاية الأناقة والجمال.'
        : 'Implémentation d\'un arbre binaire de recherche (BST) en C++. L\'utilisation des fonctions récursives rend la structure élégante et fluide.',
      tag: isAr ? 'هياكل البيانات' : 'Structure de Données',
      likes: ['author_mohamed', 'author_adam'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 82).toISOString()
    },
    {
      author: authors[6],
      content: isAr
        ? 'نجحت في اختبار البرمجة الكائنية (OOP)! 🎓 شكراً للموجهين على الأسئلة والتمارين العملية الممتازة.'
        : 'J\'ai réussi l\'évaluation sur la Programmation Orientée Objet (POO) avec succès ! 🎓 Un grand merci aux mentors pour les exercices pratiques.',
      tag: isAr ? 'شهادة' : 'Certification',
      milestone: {
        type: 'level',
        title: isAr ? 'أكمل المستوى 5 في مسار جافا!' : 'Niveau 5 du parcours Java validé !',
        value: 5
      },
      likes: ['author_mohamed', 'author_sara', 'author_karim'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 86).toISOString()
    },
    {
      author: authors[7],
      content: isAr
        ? 'أنشأت أول خادم HTTP مخصص باستخدام Node.js بدون أي مكتبات خارجية! فهم كيفية عمل الطلبات والاستجابات مفيد جداً.'
        : 'J\'ai créé mon tout premier serveur HTTP avec Node.js pur sans utiliser aucun framework ! Comprendre le fonctionnement sous le capot est extrêmement enrichissant.',
      codeSnippet: `const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, {'Content-Type': 'text/plain'});\n  res.end('Serveur Node.js actif !');\n});\nserver.listen(3000);`,
      tag: isAr ? 'باك إند' : 'Backend JS',
      likes: ['author_youssef', 'author_karim', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 90).toISOString()
    },
    {
      author: authors[0],
      content: isAr
        ? 'استكشاف القواميس في بايثون ودوال Dictionary Comprehension. يجعل الكود مختصراً ونظيفاً للغاية!'
        : 'Exploration des compréhensions de dictionnaires en Python. La syntaxe permet de rendre le traitement de données extrêmement concis !',
      codeSnippet: `carres = {x: x**2 for x in range(6)}\nprint(carres) # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`,
      tag: isAr ? 'بايثون' : 'Astuce Python',
      likes: ['author_sara', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 94).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'مشروع مكتمل: صفحة هبوط التفاعلية مع حركات CSS أنيقة وتاثيرات عند التمرير ✨'
        : 'Projet finalisé : Une landing page responsive sublimée par des animations CSS @keyframes et des transitions fluides au survol ✨',
      tag: isAr ? 'معرض الويب' : 'Vitrine Web',
      likes: ['author_ghita', 'author_youssef'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 98).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'الوصول إلى 2,500 نقطة خبرة! 🥇 الهدف القادم الحصول على وسام المطور المتكامل.'
        : 'Cap des 2 500 XP franchi ! 🥇 Prochain objectif : Obtenir le badge de Développeur Full-Stack.',
      tag: isAr ? 'إنجاز نقاط' : 'Réalisation XP',
      milestone: {
        type: 'xp',
        title: isAr ? 'وصل إلى مجموع 2,500 نقطة خبرة!' : 'Atteint 2 500 XP Total !',
        value: 2500
      },
      likes: ['author_adam', 'author_sara', 'author_mohamed', 'author_karim', 'author_lina'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 102).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'تهنئة لكل الطلاب الذين سلموا مشاريعهم البرمجية هذا الأسبوع. تنظيم الكود وبنية مستودعات Git تتطور بشكل ملحوظ يومياً!'
        : 'Bravo à l\'ensemble des étudiants pour les projets soumis cette semaine. La structure des dépôts Git et la clarté des commits progressent chaque jour !',
      tag: isAr ? 'تشجيع' : 'Encouragement',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita', 'author_karim', 'author_lina', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 106).toISOString()
    },
    {
      author: authors[4],
      content: isAr
        ? 'كيف تطبقون معايير إمكانية الوصول ARIA على النماذج والأزرار؟ موضوع مهم لضمان سهولة الاستخدام للجميع.'
        : 'Comment intégrez-vous les bonnes pratiques d\'accessibilité (ARIA) sur vos formulaires et boutons ? C\'est un sujet essentiel pour garantir l\'inclusivité du Web.',
      tag: isAr ? 'إمكانية الوصول' : 'Accessibilité',
      likes: ['author_sara', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 110).toISOString()
    },
    {
      author: authors[5],
      content: isAr
        ? 'أنهيت قراءة دليل Git و GitHub. أولى الـ Commits والـ Pull Requests جاهزة للمراجعة مع الفريق! 🐙'
        : 'Je viens d\'achever le guide sur Git & GitHub. Mes premiers commits, branches et Pull Requests sont prêts pour la revue de code ! 🐙',
      tag: isAr ? 'أدوات المطور' : 'Git & GitHub',
      likes: ['author_mohamed', 'author_youssef', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 114).toISOString()
    },
    {
      author: authors[0],
      content: isAr
        ? 'أكملت اليوم أول ساعة من التركيز المتواصل بأسلوب البومودورو أثناء دراسة البرمجة. التفكير المنظم يضاعف استيعاب المفاهيم! 🍅'
        : 'J\'ai terminé ma première session de travail Pomodoro de 25 minutes sans aucune distraction ! La concentration par blocs améliore vraiment l\'assimilation des concepts. 🍅',
      tag: isAr ? 'عادات التعلم' : 'Habitudes d\'étude',
      likes: ['author_sara', 'author_mohamed', 'author_ghita'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 118).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'ما هي أفضل ممارسة لتنظيم مسافات الأبعاد والمكونات في المخطط الشجري؟ هل تبدؤون دائماً بتصميم شاشات الهاتف أولاً (Mobile-First)؟'
        : 'Quelle est votre approche préférée pour structurer la hiérarchie visuelle d\'un site ? Préférez-vous concevoir d\'abord pour mobile (Mobile-First) ou pour ordinateur ?',
      tag: isAr ? 'مناقشة تصميم' : 'Discussion Design',
      likes: ['author_ghita', 'author_ines', 'author_adam'],
      comments: [
        {
          author: authors[4],
          content: isAr ? 'التصميم للهاتف أولاً يسهل التوسع للشاشات الكبيرة لاحقاً بدون فوضى في CSS!' : 'Le Mobile-First simplifie énormément la mise en page responsive ultérieure sur grand écran !',
          createdAt: new Date(Date.now() - 3600000 * 120).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 122).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'التحدي اليومي أصبح جزءاً أساسياً من روتيني الصباحي مع قهوة الصباح ☕ التكرار اليومي هو السر لبناء عادة برمجية متينة.'
        : 'Résoudre un défi de code au réveil avec mon café du matin est devenu mon meilleur rituel ☕ Rien de tel pour démarrer la journée en pleine forme !',
      tag: isAr ? 'روتيني البرمجي' : 'Routine de Code',
      likes: ['author_adam', 'author_mohamed', 'author_karim'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 126).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'عندما يظهر لك خطأ في البرنامج، لا تشعر بالإحباط! الأخطاء هي الوسيلة الوحيدة التي تعلم المبرمج كيف تفكر الآلة وكيف تعالج منطق البيانات.'
        : 'Rappelez-vous : les erreurs et les messages de débogage ne sont pas des échecs, ce sont des indices précieux laissés par l\'ordinateur pour vous guider.',
      tag: isAr ? 'نصيحة موجه' : 'Conseil de Mentor',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita', 'author_karim', 'author_lina', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 130).toISOString()
    },
    {
      author: authors[4],
      content: isAr
        ? 'البساطة في تصميم الواجهات تمنح تجربة مستخدم أسرع وأكثر سلاسة. التخلص من التشتت يجعل التطبيق راقياً ومريحاً للعين.'
        : 'Le minimalisme en UI/UX rend les applications tellement plus agréables et intuitives à utiliser. Moins d\'éléments superflus = plus de clarté !',
      tag: isAr ? 'تجربة المستخدم' : 'Design UX/UI',
      likes: ['author_sara', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 134).toISOString()
    },
    {
      author: authors[5],
      content: isAr
        ? 'قبل كتابة أي سطر كود، أصبحت أقضي 10 دقائق في رسم الخوارزمية على ورقة خارجية. التخطيط المسبق يوفر ساعات من التصحيح والتجربة!'
        : 'Désormais, je passe 10 minutes à dessiner l\'algorithme sur papier avant de toucher au clavier. Une excellente habitude qui économise des heures de débogage !',
      tag: isAr ? 'تخطيط وتفكير' : 'Méthodologie',
      likes: ['author_mohamed', 'author_adam', 'author_lina'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 138).toISOString()
    },
    {
      author: authors[6],
      content: isAr
        ? 'مناقشة المفاهيم مع زملاء المسار في المجموعة التفاعلية ساعدتني في فهم استدعاء الدوال والشروط بشكل أعمق وأوضح بكثير.'
        : 'Expliquer une notion à un camarade de classe est la meilleure façon de vérifier qu\'on l\'a soi-même parfaitement comprise !',
      tag: isAr ? 'تعلم جماعي' : 'Entraide',
      likes: ['author_sara', 'author_youssef'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 142).toISOString()
    },
    {
      author: authors[7],
      content: isAr
        ? 'تسمية المجلدات والمتغيرات بأسماء واضحة ومفهومة تجعل العودة للمشروع بعد أسبوع أمراً ممتعاً وسهلاً للغاية بدون ضياع الوقت.'
        : 'Donner des noms explicites aux variables et découper son projet en modules clairs rend le travail en équipe d\'une simplicité remarquable.',
      tag: isAr ? 'جودة الكود' : 'Code Propre',
      likes: ['author_karim', 'author_mohamed', 'author_adam'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 146).toISOString()
    },
    {
      author: authors[0],
      content: isAr
        ? 'سعيد بتجاوز المستوى 6 في مسار التفكير البرمجي! كل درس جديد يفتح آفاقاً لبناء مشاريع أكثر ذكاءً وتفاعلية 🚀'
        : 'Très heureux d\'avoir validé le Niveau 6 ! Chaque chapitre débloque de nouvelles compétences passionnantes pour mes futurs projets 🚀',
      tag: isAr ? 'تقدم وتطور' : 'Progression',
      likes: ['author_sara', 'author_mohamed', 'author_youssef'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 150).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'تناسق الخطوط والألوان يمنح المشروع روحاً احترافية. التباين الجيد يدعم القراءة المريحة لجميع المستخدمين على مختلف الشاشات.'
        : 'Le choix de la typographie et des contrastes de couleurs change du tout au tout l\'élégance et l\'accessibilité d\'une interface.',
      tag: isAr ? 'تصميم جرافيك' : 'Typographie & Design',
      likes: ['author_ghita', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 154).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'اختصارات محرر الكود توفر الكثير من الوقت! التنقل بين الملفات ونسخ الأسطر بنقرة واحدة يجعل تجربة الكتابة ممتعة ومريحة.'
        : 'Apprendre à maîtriser les raccourcis clavier de son éditeur fait gagner un temps précieux au quotidien ! Quel est votre raccourci préféré ?',
      tag: isAr ? 'إنتاجية' : 'Productivité',
      likes: ['author_adam', 'author_karim'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 158).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'مراجعة الأكواد بين الأقران (Code Review) هي خطوة أساسية لتبادل الخبرات وتحديد النقاط التحسينية مبكراً في رحلة المطور.'
        : 'La revue de code entre pairs est un exercice formidable pour apprendre à lire du code d\'autrui et découvrir d\'autres approches élégantes.',
      tag: isAr ? 'نصيحة موجه' : 'Conseil de Mentor',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita', 'author_karim', 'author_lina', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 162).toISOString()
    },
    {
      author: authors[4],
      content: isAr
        ? 'الوضع الداكن يريح العينين أثناء جلسات البرمجة المسائية 🌙 هل تفضلون الواجهات الداكنة أم الفاتحة أثناء العمل؟'
        : 'Le mode sombre est définitivement indispensable pour les sessions de programmation en soirée 🌙 Team mode sombre ou team mode clair ?',
      tag: isAr ? 'استطلاع رأي' : 'Sondage UI',
      likes: ['author_sara', 'author_ines', 'author_adam'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 166).toISOString()
    },
    {
      author: authors[5],
      content: isAr
        ? 'عند التعثر في منطق معين، أخذ استراحة لمدة 15 دقيقة والمشي بعيداً عن الشاشة يساعد المخ في إيجاد الحل تلقائياً!'
        : 'S\'éloigner de l\'écran 15 minutes quand on bloque sur un problème permet souvent de trouver la solution instantanément au retour !',
      tag: isAr ? 'تصفية الذهن' : 'Bien-être',
      likes: ['author_mohamed', 'author_lina'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 170).toISOString()
    },
    {
      author: authors[6],
      content: isAr
        ? 'تقسيم المشروع الكبير إلى مهام صغيرة محددة يجعل الهدف ممكناً ويمنح شعوراً مستمراً بالحماس عند إنجاز كل خطوة.'
        : 'Découper un grand projet en micro-tâches quotidiennes élimine le stress et donne un sentiment de progression constant !',
      tag: isAr ? 'إدارة المشاريع' : 'Gestion de Projet',
      likes: ['author_sara', 'author_youssef'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 174).toISOString()
    },
    {
      author: authors[7],
      content: isAr
        ? 'فهم كيفية تبادل البيانات بين العميل والسيرفر يفتح الأبواب لبناء تطبيقات ويب ديناميكية وقوية تستجيب في لحظات.'
        : 'Comprendre le flux des données entre le client et le serveur est la clé pour concevoir des applications web réactives et robustes.',
      tag: isAr ? 'هندسة التطبيقات' : 'Architecture Web',
      likes: ['author_youssef', 'author_karim', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 178).toISOString()
    },
    {
      author: authors[0],
      content: isAr
        ? 'العثور على خطأ صغير في الفاصلة أو علامة الاقتباس بعد ساعة بحث يمنح شعوراً رائعاً من الراحة والنصر! 😅'
        : 'Trouver cette fameuse coquille de syntaxe après 45 minutes de recherche procure un soulagement absolu ! 😅',
      tag: isAr ? 'لحظات المطور' : 'Vie de Développeur',
      likes: ['author_sara', 'author_ines', 'author_ghita'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 182).toISOString()
    },
    {
      author: authors[1],
      content: isAr
        ? 'الالتزام بنصف ساعة برمجة يومياً أفضل بكثير من المحاولة المكثفة ليوم واحد فقط في الأسبوع. الإستمرارية تصنع المهارة.'
        : 'Consacrer 30 minutes chaque jour à la pratique du code est infiniment plus efficace que d\'y passer 5 heures une fois par mois.',
      tag: isAr ? 'تطور مستمر' : 'Discipline',
      likes: ['author_adam', 'author_mohamed'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 186).toISOString()
    },
    {
      author: authors[2],
      content: isAr
        ? 'إعادة ترتيب وتنظيف الكود المكتوب سابقاً وتبسيطه يجعل القراءة سهلة جداً ويقلل من الأخطاء المستقبليّة أثناء التعديل.'
        : 'Refactoriser son propre code d\'il y a un mois et le rendre 2 fois plus court est la meilleure preuve de sa propre progression !',
      tag: isAr ? 'تحسين الكود' : 'Refactoring',
      likes: ['author_karim', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 190).toISOString()
    },
    {
      author: authors[3],
      content: isAr
        ? 'مجتمعنا البرمجي ينمو يومياً بفضل تعاونكم وتشجيعكم المتبادل. واصلوا طرح الأسئلة وتبادل المعرفة والتجارب!'
        : 'Notre communauté grandit chaque jour grâce à votre entraide et votre bienveillance. Continuez à partager vos découvertes !',
      tag: isAr ? 'مجتمعنا' : 'Communaute',
      likes: ['author_adam', 'author_sara', 'author_youssef', 'author_ghita', 'author_karim', 'author_lina', 'author_ines'],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 194).toISOString()
    }
  ];

  return postsData.map((post, idx) => ({
    _id: `community_post_${idx}`,
    ...post,
    updatedAt: post.createdAt
  }));
};

const FeedScreen: React.FC<FeedScreenProps> = ({ currentUser }) => {
  const { language } = useLanguage();
  const tFeed = feedTranslations[language] || feedTranslations.en;
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('General');
  const [selectedMilestone, setSelectedMilestone] = useState<'none' | 'streak' | 'xp'>('none');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const userStreak = currentUser.progress?.streak || 0;
  const userXp = currentUser.progress?.xp || 0;

  const categoryFilters = ['All', 'Student Projects', 'Q&A', 'Milestones', 'Mentors'];
  const categoryFilterLabels: { [key: string]: { [lang: string]: string } } = {
    'All': { en: 'All', fr: 'Tous', ar: 'الكل' },
    'Student Projects': { en: 'Student Projects', fr: 'Projets Étudiants', ar: 'مشاريع الطلاب' },
    'Q&A': { en: 'Q&A', fr: 'Q&R', ar: 'أسئلة وأجوبة' },
    'Milestones': { en: 'Milestones', fr: 'Réalisations', ar: 'الإنجازات' },
    'Mentors': { en: 'Mentors', fr: 'Mentors', ar: 'الموجهون' },
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let backendPosts: Post[] = [];
      try {
        backendPosts = await api.getPosts();
      } catch (e) {
        console.warn('Backend getPosts warning:', e);
      }
      
      const storedLocalPosts = localStorage.getItem('user_feed_posts');
      const localPosts: Post[] = storedLocalPosts ? JSON.parse(storedLocalPosts) : [];

      const authenticPosts = AUTHENTIC_COMMUNITY_POSTS(language);
      const combined = [...backendPosts, ...localPosts, ...authenticPosts];
      
      const seen = new Set<string>();
      const uniquePosts: Post[] = [];
      for (const post of combined) {
        if (post && post._id && !seen.has(post._id)) {
          seen.add(post._id);
          uniquePosts.push(post);
        }
      }

      uniquePosts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(uniquePosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      const storedLocalPosts = localStorage.getItem('user_feed_posts');
      const localPosts: Post[] = storedLocalPosts ? JSON.parse(storedLocalPosts) : [];
      setPosts([...localPosts, ...AUTHENTIC_COMMUNITY_POSTS(language)]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [language]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      let milestone: Milestone | undefined;
      
      if (selectedMilestone === 'streak' && userStreak > 0) {
        milestone = {
          type: 'streak',
          title: language === 'ar' ? `حقق سلسلة ${userStreak} يوماً!` : `Hit a ${userStreak}-Day Streak!`,
          value: userStreak
        };
      } else if (selectedMilestone === 'xp' && userXp > 0) {
        milestone = {
          type: 'xp',
          title: language === 'ar' ? `وصل إلى مجموع ${userXp} نقطة خبرة!` : `Reached ${userXp} Total XP!`,
          value: userXp
        };
      }

      let newPost: Post;
      try {
        newPost = await api.createPost(content.trim(), milestone, selectedTag !== 'General' ? selectedTag : 'general');
      } catch (err) {
        newPost = {
          _id: `local_post_${Date.now()}`,
          author: {
            _id: currentUser._id,
            name: currentUser.name,
            profilePictureUrl: currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1A73E8&color=fff`,
            role: currentUser.role || 'student',
            professionalTitle: tFeed.studentCoder
          },
          content: content.trim(),
          tag: selectedTag !== 'General' ? selectedTag : 'Student Project',
          milestone,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      // Save to local storage for persistence across reloads/sessions
      const stored = localStorage.getItem('user_feed_posts');
      const existing: Post[] = stored ? JSON.parse(stored) : [];
      const updated = [newPost, ...existing];
      localStorage.setItem('user_feed_posts', JSON.stringify(updated));

      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setSelectedMilestone('none');
      showToast(language === 'ar' ? 'تم حفظ ونشر المشاركة في مجتمع الطلاب!' : 'Saved and published to community feed!', 'success');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const hasLiked = p.likes.includes(currentUser._id);
        const newLikes = hasLiked
          ? p.likes.filter(id => id !== currentUser._id)
          : [...p.likes, currentUser._id];
        return { ...p, likes: newLikes };
      }
      return p;
    }));

    try {
      await api.likePost(postId);
    } catch (e) {
      // Handled in optimistic UI
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      _id: `comment_${Date.now()}`,
      author: {
        _id: currentUser._id,
        name: currentUser.name,
        profilePictureUrl: currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`,
        role: currentUser.role || 'student'
      },
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    try {
      await api.commentPost(postId, text.trim());
    } catch (e) {
      // Handled in optimistic UI
    }
  };

  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/dashboard/feed?post=${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedPostId(postId);
    showToast(language === 'ar' ? 'تم نسخ رابط المشاركة إلى الحافظة!' : 'Post link copied to clipboard!', 'info');
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const filteredPosts = posts.filter(post => {
    if (activeCategoryFilter === 'All') return true;
    if (activeCategoryFilter === 'Student Projects') return post.tag?.includes('Project') || post.tag?.includes('مشروع') || post.codeSnippet;
    if (activeCategoryFilter === 'Q&A') return post.tag?.includes('Help') || post.tag?.includes('مساعدة') || post.content.includes('?');
    if (activeCategoryFilter === 'Milestones') return !!post.milestone || post.tag?.includes('Streak') || post.tag?.includes('إنجاز');
    if (activeCategoryFilter === 'Mentors') return post.author.role === 'teacher' || post.author.role === 'admin';
    return true;
  });

  const isGuest = !currentUser || currentUser._id.startsWith('guest_') || currentUser.email.includes('guest');

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Guest Banner */}
        {isGuest && (
          <GuestLoginBanner 
            title={tFeed.guestBannerTitle}
            description={tFeed.guestBannerDesc}
          />
        )}

        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-medium">
                <Bot className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span className="font-semibold tracking-wide">{tFeed.hubBadge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                {tFeed.feedTitlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">{tFeed.feedTitleSuffix}</span>
              </h1>
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl leading-relaxed">
                {tFeed.subtitle}
              </p>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-4 flex items-center gap-4">
              <div className="text-center font-mono">
                <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] uppercase block">{tFeed.streak}</span>
                <span className="text-sm font-bold text-[#EA4335] flex items-center gap-1 justify-center">
                  <Flame className="w-4 h-4 fill-[#EA4335]" /> {userStreak}d
                </span>
              </div>
              <div className="w-px h-8 bg-[#E8EAED] dark:bg-[#3C4043]"></div>
              <div className="text-center font-mono">
                <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] uppercase block">{tFeed.totalXp}</span>
                <span className="text-sm font-bold text-[#1A73E8] dark:text-[#8AB4F8]">
                  {userXp} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Composer Box */}
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-4 transition-all">
          <div className="flex gap-4 items-start">
            <img 
              src={currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1A73E8&color=fff`} 
              alt={currentUser.name} 
              className="w-11 h-11 rounded-full object-cover border border-[#E8EAED] dark:border-[#3C4043] shrink-0"
            />
            <div className="flex-1 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={tFeed.postPlaceholder}
                rows={3}
                className="w-full bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-2xl p-4 text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none transition-all font-sans resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F3F4] dark:border-[#3C4043]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-full px-3 py-1 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-[#FBBC04]" />
                    <select 
                      value={selectedMilestone}
                      onChange={(e) => setSelectedMilestone(e.target.value as any)}
                      className="bg-transparent text-xs font-medium text-[#202124] dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="none">{tFeed.noBadge}</option>
                      {userStreak > 0 && <option value="streak">🔥 Streak ({userStreak}d)</option>}
                      {userXp > 0 && <option value="xp">🏆 XP ({userXp} XP)</option>}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                    content.trim() 
                      ? 'bg-[#1A73E8] text-white hover:bg-[#1557B0] shadow-sm' 
                      : 'bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? tFeed.publishing : tFeed.sharePost}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categoryFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveCategoryFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === filter
                  ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30 font-semibold'
                  : 'bg-white dark:bg-[#292A2D] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#3C4043]'
              }`}
            >
              {categoryFilterLabels[filter]?.[language] || filter}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {filteredPosts.map(post => {
            const hasLiked = post.likes.includes(currentUser._id);
            const isCommentsOpen = activeCommentsPostId === post._id;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-4 transition-all"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.author.profilePictureUrl} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#E8EAED] dark:border-[#3C4043]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#202124] dark:text-white">{post.author.name}</h4>
                        {post.author.city && (
                          <span className="text-[10px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                            • {post.author.city}
                          </span>
                        )}
                        <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#3C4043] ${
                          post.author.role === 'teacher'
                            ? 'bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995]'
                            : 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]'
                        }`}>
                          {post.author.role === 'teacher' ? tFeed.mentorRole : tFeed.studentRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">
                        {post.author.professionalTitle || tFeed.studentCoder}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyLink(post._id)}
                    className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white transition cursor-pointer"
                    title="Copy Post Link"
                  >
                    {copiedPostId === post._id ? <Check className="w-4 h-4 text-[#34A853]" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Milestone Badge */}
                {post.milestone && (
                  <div className="bg-[#E8F0FE] dark:bg-[#3C4043] border border-[#1A73E8]/20 rounded-2xl p-3 flex items-center gap-3 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8]">
                    {post.milestone.type === 'streak' ? <Flame className="w-4 h-4 text-[#EA4335] fill-[#EA4335]" /> : <Trophy className="w-4 h-4 text-[#FBBC04]" />}
                    <span>{post.milestone.title}</span>
                  </div>
                )}

                {/* Post Content */}
                <p className="text-xs sm:text-sm text-[#202124] dark:text-[#E8EAED] leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Code Snippet Card */}
                {post.codeSnippet && (
                  <div className="bg-[#1E1E1E] text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>{tFeed.codeSnippet}</span>
                      <Code className="w-3.5 h-3.5" />
                    </div>
                    <pre>{post.codeSnippet}</pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-6 pt-2 border-t border-[#F1F3F4] dark:border-[#3C4043] text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6]">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className={`flex items-center gap-1.5 hover:text-[#EA4335] transition cursor-pointer ${
                      hasLiked ? 'text-[#EA4335] font-bold' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-[#EA4335] text-[#EA4335]' : ''}`} />
                    <span>{post.likes.length} {post.likes.length === 1 ? tFeed.like : tFeed.likes}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post._id)}
                    className="flex items-center gap-1.5 hover:text-[#1A73E8] dark:hover:text-[#8AB4F8] transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} {tFeed.comments}</span>
                  </button>
                </div>

                {/* Comments Drawer */}
                {isCommentsOpen && (
                  <div className="pt-4 border-t border-[#F1F3F4] dark:border-[#3C4043] space-y-3">
                    <div className="space-y-2">
                      {post.comments.map((comment, i) => (
                        <div key={i} className="bg-[#F8F9FA] dark:bg-[#202124] p-3 rounded-2xl border border-[#E8EAED] dark:border-[#3C4043] text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-[#202124] dark:text-white">
                            <span>{comment.author.name}</span>
                            <span className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">{comment.author.role === 'teacher' ? tFeed.mentorRole : tFeed.studentRole}</span>
                          </div>
                          <p className="text-[#5F6368] dark:text-[#9AA0A6] font-normal">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder={tFeed.writeComment}
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                        className="flex-1 px-4 py-2 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-full text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none focus:border-[#1A73E8]"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-4 py-2 bg-[#1A73E8] text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-[#1557B0]"
                      >
                        {tFeed.reply}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FeedScreen;
