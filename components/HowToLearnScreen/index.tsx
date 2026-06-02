import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Target, Trophy, Sparkles, Code, Play, Star, Flame, Gift, ArrowRight, BookOpenCheck, Volume2, Gamepad2 } from 'lucide-react';

const HowToLearnScreen: React.FC = () => {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'basics' | 'lessons' | 'quests' | 'games'>('basics');

    const localTexts = {
        en: {
            title: "How Do I Learn?",
            subtitle: "Master coding, play brain games, and earn epic Moroccan Chest rewards step-by-step!",
            tab_basics: "1. The Roadmap",
            tab_lessons: "2. The Code Editor",
            tab_quests: "3. Daily Missions",
            tab_games: "4. Extra Activities",
            basics_title: "Choose Your Path & Follow the Roadmap",
            basics_desc: "Your learning journey is structured around visual path roadmaps. Select your programming track and level up systematically.",
            roadmap_step1: "Select a Path",
            roadmap_step1_detail: "Hover over the 'Learn' tab in the navbar and pick a track (e.g. Python, JavaScript, HTML/CSS, or Math).",
            roadmap_step2: "Visual Progress Map",
            roadmap_step2_detail: "Follow the circular road node bubbles. Completed nodes turn solid dark color, while your current target pulses.",
            roadmap_step3: "Unlocking Lessons",
            roadmap_step3_detail: "Lessons must be unlocked in order. Solve previous challenges to reveal advanced concepts.",
            
            lessons_title: "Study Theory & Write Live Code",
            lessons_desc: "Lessons combine concept reading with interactive execution. You write code and check output dynamically.",
            lesson_theory: "Interactive Theory",
            lesson_theory_detail: "Each lesson starts with an explanation of a coding concept, learning objectives, and code syntax snippets.",
            lesson_editor: "The Sandbox Editor",
            lesson_editor_detail: "Write code directly in the code editor box. Pre-filled starter templates are provided to get you started.",
            lesson_compiler: "Terminal Output & Validation",
            lesson_compiler_detail: "Click 'Run Code' to test your code. The engine runs it and validates if the output matches the expected result.",
            
            quests_title: "Complete Missions & Claim Chests",
            quests_desc: "Consistently learning boosts your streak and rewards you with Moroccan treasure chests filled with XP and power-ups.",
            quest_daily: "Three Daily Quests",
            quest_daily_detail: "Solve a lesson, gain 30 XP, and complete 1 quiz. Progress counters reset every midnight.",
            quest_chest: "Opening the Moroccan Chest",
            quest_chest_detail: "When all 3 daily missions are complete, the gift chest on your Home screen unlocks. Click it to claim +50 XP stars and freeze items.",
            quest_streak: "Keep the Flame Burning",
            quest_streak_detail: "Solve at least one lesson daily to increase your Day Streak. Streaks of 3+ days trigger 1.2x or 1.5x XP multipliers!",

            games_title: "Educational Games, Smart Books & Speaking Hub",
            games_desc: "Extend your skills beyond typical syntax. Practice mathematics, read ESL books, and practice speaking speaking activities.",
            game_math: "Math Arena & Games",
            game_math_detail: "Solve custom math curriculum questions and play speed math trials directly from the math selection page.",
            game_books: "Smart Books Catalog",
            game_books_detail: "Enhance reading and vocabulary with interactive ESL children books and audio visual media.",
            game_speaking: "Speaking & Pronunciation",
            game_speaking_detail: "Practice conversations and speak sentences aloud to check pronunciation accuracy via interactive sound tools."
        },
        fr: {
            title: "Comment apprendre ?",
            subtitle: "Maîtrisez le code, jouez à des jeux cérébraux et gagnez des récompenses dans le coffre marocain !",
            tab_basics: "1. Le Parcours",
            tab_lessons: "2. L'Éditeur",
            tab_quests: "3. Missions",
            tab_games: "4. Activités",
            basics_title: "Choisissez votre chemin et suivez le parcours",
            basics_desc: "Votre apprentissage est structuré autour de parcours visuels. Sélectionnez votre langage et progressez systématiquement.",
            roadmap_step1: "Sélectionner un parcours",
            roadmap_step1_detail: "Survolez l'onglet 'Apprendre' dans la barre de navigation et choisissez une langue (ex. Python, JavaScript, Math).",
            roadmap_step2: "Carte de progression visuelle",
            roadmap_step2_detail: "Suivez les bulles du parcours. Les nœuds terminés changent de couleur tandis que votre cible actuelle clignote.",
            roadmap_step3: "Déblocage des leçons",
            roadmap_step3_detail: "Les leçons doivent être débloquées dans l'ordre. Résolvez les défis précédents pour révéler les concepts avancés.",

            lessons_title: "Étudiez la théorie et écrivez du code en direct",
            lessons_desc: "Les cours associent explications et exécution interactive. Écrivez et testez votre code en temps réel.",
            lesson_theory: "Théorie interactive",
            lesson_theory_detail: "Chaque cours commence par une explication, des objectifs d'apprentissage et des astuces d'experts.",
            lesson_editor: "Éditeur de code intégré",
            lesson_editor_detail: "Écrivez votre code directement dans la boîte d'édition. Des modèles de démarrage pré-remplis sont fournis.",
            lesson_compiler: "Sortie Terminal & Validation",
            lesson_compiler_detail: "Cliquez sur 'Exécuter' pour tester. Notre système valide si votre sortie correspond au résultat attendu.",

            quests_title: "Terminez des missions et ouvrez des coffres",
            quests_desc: "Un apprentissage régulier augmente votre série et vous récompense avec des coffres aux trésors marocains.",
            quest_daily: "Trois quêtes quotidiennes",
            quest_daily_detail: "Faire une leçon, gagner 30 XP et réussir 1 quiz. Les compteurs se réinitialisent à minuit.",
            quest_chest: "Ouverture du coffre marocain",
            quest_chest_detail: "Une fois les 3 missions terminées, le coffre s'active. Cliquez pour réclamer +50 étoiles XP et des bonus.",
            quest_streak: "Maintenez la flamme active",
            quest_streak_detail: "Résolvez au moins une leçon par jour. Une série de 3 jours ou plus déclenche des multiplicateurs d'XP (1.2x / 1.5x) !",

            games_title: "Jeux éducatifs, livres intelligents et pôle oral",
            games_desc: "Développez vos compétences au-delà de la syntaxe. Pratiquez le calcul, lisez des livres ESL et parlez.",
            game_math: "Math Arena & Jeux",
            game_math_detail: "Résolvez des équations et jouez à des défis de rapidité directement depuis le panneau des mathématiques.",
            game_books: "Catalogue de livres intelligents",
            game_books_detail: "Améliorez votre lecture et votre vocabulaire avec des livres d'histoires ESL interactifs.",
            game_speaking: "Expression orale et prononciation",
            game_speaking_detail: "Pratiquez des dialogues et prononcez des phrases pour tester votre prononciation à voix haute."
        },
        ar: {
            title: "كيف أتعلم؟",
            subtitle: "احترف البرمجة، والعب الألعاب الذهنية، واكسب مكافآت الصندوق المغربي خطوة بخطوة!",
            tab_basics: "١. خريطة الطريق",
            tab_lessons: "٢. محرر الأكواد",
            tab_quests: "٣. المهام اليومية",
            tab_games: "٤. الأنشطة الإضافية",
            basics_title: "اختر مسارك واتبع خريطة الطريق التعليمية",
            basics_desc: "رحلتك التعليمية منظمة حول خرائط طريق بصرية. اختر لغة البرمجة التي تريد تعلمها وابدأ رحلتك.",
            roadmap_step1: "تحديد المسار",
            roadmap_step1_detail: "قم بتمرير مؤشر الفأرة فوق زر 'تعلم' في الشريط العلوي واختر لغة البرمجة المفضلة لديك.",
            roadmap_step2: "خريطة التقدم البصرية",
            roadmap_step2_detail: "اتبع فقاعات الدروس الدائرية. تتحول الدروس المكتملة إلى لون غامق، بينما يومض درسك الحالي.",
            roadmap_step3: "فتح الدروس المتتالية",
            roadmap_step3_detail: "يتم فتح الدروس بالتتابع. قم بحل التحديات السابقة للكشف عن المفاهيم المتقدمة.",

            lessons_title: "ادرس الشرح النظري واكتب الكود مباشرة",
            lessons_desc: "تجمع الدروس بين قراءة الشرح والتطبيق العملي. اكتب الكود واختبر نتيجته في نفس الصفحة.",
            lesson_theory: "الشرح النظري التفاعلي",
            lesson_theory_detail: "يبدأ كل درس بشرح مبسط لمفهوم البرمجة مع أهداف الدرس ونصائح مفيدة.",
            lesson_editor: "محرر الأكواد المباشر",
            lesson_editor_detail: "اكتب الكود البرمجي في الصندوق المخصص. نوفر لك نموذج كود مبدئي لمساعدتك في البداية.",
            lesson_compiler: "مخرجات الشاشة والتحقق",
            lesson_compiler_detail: "اضغط على زر 'تشغيل الكود' للاختبار. يقوم النظام بتشغيل الكود والتحقق من صحة المخرجات.",

            quests_title: "أكمل المهام اليومية وافتح صناديق الكنز",
            quests_desc: "التعلم المستمر يحافظ على حماسك ويمنحك مكافآت صناديق الكنوز المغربية القيمة.",
            quest_daily: "ثلاث مهام يومية",
            quest_daily_detail: "حل درس واحد، واكسب ٣٠ نقطة خبرة، واجتز اختبارًا واحدًا. تصفر العدادات عند منتصف الليل.",
            quest_chest: "فتح الصندوق المغربي",
            quest_chest_detail: "عند إكمال المهام الثلاث، يفتح صندوق الهدايا في صفحتك الرئيسية. اضغط عليه لكسب +٥٠ نقطة خبرة.",
            quest_streak: "حافظ على لهيب حماسك",
            quest_streak_detail: "حل درسًا واحدًا على الأقل يوميًا لزيادة سلسلة الأيام. السلسلة من ٣+ أيام تمنحك مضاعف نقاط ١.٢x أو ١.٥x!",

            games_title: "الألعاب التعليمية، الكتب الذكية، والمنصة الصوتية",
            games_desc: "وسع مهاراتك خارج حدود البرمجة المعتادة. تدرب على الرياضيات، اقرأ القصص، وتدرب على المحادثة الصوتية.",
            game_math: "حلبة وألعاب الرياضيات",
            game_math_detail: "حل مسائل المنهج الدراسي للرياضيات والعب ألعاب السرعة الحسابية التفاعلية.",
            game_books: "كتالوج الكتب الذكية",
            game_books_detail: "حسن مهارات القراءة والمفردات اللغوية لديك عبر القصص والكتب التفاعلية باللغة الإنجليزية.",
            game_speaking: "المحادثة وتحسين النطق",
            game_speaking_detail: "تدرب على نطق الجمل والكلمات الإنجليزية بشكل صحيح واختبر نطقك باستخدام الميكروفون المباشر."
        }
    };

    const texts = localTexts[language as 'en' | 'fr' | 'ar'] || localTexts.en;

    const tabClasses = (tab: typeof activeTab) => 
        `px-4 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer border-2 ${
            activeTab === tab 
                ? 'bg-[#111827] text-white border-[#111827] dark:bg-[#FBBF24] dark:text-slate-900 dark:border-[#FBBF24] shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`;

    return (
        <div className="bg-brand-50 dark:bg-slate-900 min-h-full text-slate-800 dark:text-white font-sans transition-colors p-2 sm:p-4">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header Title Section */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-[#FBBF24]/10 dark:bg-[#FBBF24]/20 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-sm border border-[#FBBF24]/30 animate-pulse">
                        🚀
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-slate-800 dark:text-white">
                        {texts.title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        {texts.subtitle}
                    </p>
                </div>

                {/* Navigation Stepper Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => setActiveTab('basics')} className={tabClasses('basics')}>
                        {texts.tab_basics}
                    </button>
                    <button onClick={() => setActiveTab('lessons')} className={tabClasses('lessons')}>
                        {texts.tab_lessons}
                    </button>
                    <button onClick={() => setActiveTab('quests')} className={tabClasses('quests')}>
                        {texts.tab_quests}
                    </button>
                    <button onClick={() => setActiveTab('games')} className={tabClasses('games')}>
                        {texts.tab_games}
                    </button>
                </div>

                {/* Active Tab Panel Details */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                    {activeTab === 'basics' && (
                        <div className="space-y-8">
                            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
                                <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-indigo-200 uppercase tracking-tight flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    {texts.basics_title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                                    {texts.basics_desc}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">📂</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.roadmap_step1}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.roadmap_step1_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">🗺️</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.roadmap_step2}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.roadmap_step2_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">🔒</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.roadmap_step3}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.roadmap_step3_detail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'lessons' && (
                        <div className="space-y-8">
                            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
                                <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-indigo-200 uppercase tracking-tight flex items-center gap-2">
                                    <Code className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    {texts.lessons_title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                                    {texts.lessons_desc}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">📄</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.lesson_theory}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.lesson_theory_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">💻</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.lesson_editor}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.lesson_editor_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">🖥️</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.lesson_compiler}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.lesson_compiler_detail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quests' && (
                        <div className="space-y-8">
                            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
                                <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-indigo-200 uppercase tracking-tight flex items-center gap-2">
                                    <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    {texts.quests_title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                                    {texts.quests_desc}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">🎯</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.quest_daily}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.quest_daily_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">🎁</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.quest_chest}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.quest_chest_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <span className="text-3xl shrink-0 mt-0.5">🔥</span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.quest_streak}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.quest_streak_detail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'games' && (
                        <div className="space-y-8">
                            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
                                <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-indigo-200 uppercase tracking-tight flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                    {texts.games_title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                                    {texts.games_desc}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <Gamepad2 className="w-8 h-8 text-[#111827] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.game_math}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.game_math_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <BookOpenCheck className="w-8 h-8 text-[#111827] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.game_books}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.game_books_detail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-950">
                                    <Volume2 className="w-8 h-8 text-[#111827] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 dark:text-white text-base leading-snug">{texts.game_speaking}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1">{texts.game_speaking_detail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HowToLearnScreen;
