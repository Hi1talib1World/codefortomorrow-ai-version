import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardView } from '../Dashboard';
import Mascot from '../Mascot';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { useToast } from '../ToastNotification';
import { PATHS, LESSONS_BY_PATH } from '../../constants';
import { Flame, Trophy, Target, Compass, BookOpen, ArrowRight, Zap, ChevronDown } from 'lucide-react';

import { Lesson } from '../../types';

interface HomeHubScreenProps {
    onNavigate: (view: DashboardView) => void;
    currentUser: UserType;
    onUpdateUser: (updatedData: Partial<UserType>) => void;
    onStartLesson?: (lesson: Lesson) => void;
}

const FloatingStat: React.FC<{ icon: string, value: string | number, label: string, color: string }> = ({ icon, value, label, color }) => (
    <div className={`bg-white dark:bg-slate-800 p-3 rounded-2xl border-l-4 ${color} shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-3 transition-transform hover:shadow-md cursor-default group`}>
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <div className="text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{value}</p>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{label}</p>
        </div>
    </div>
);

const HomeHubScreen: React.FC<HomeHubScreenProps> = ({ onNavigate, currentUser, onUpdateUser, onStartLesson }) => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const isFr = language === 'fr';
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isQuestsExpanded, setIsQuestsExpanded] = useState(false);

    const howToLearnTexts = {
        en: {
            title: "How Do I Learn?",
            desc: "Follow these 4 simple steps to master coding and earn daily rewards on Code for Tomorrow!",
            step1_title: "Choose your Path",
            step1_desc: "Hover over the Learn menu to choose Python, JavaScript, Web Dev, or Math.",
            step2_title: "Complete Lessons",
            step2_desc: "Read theory explanation cards, solve interactive coding tasks in the live editor, or pass quizzes.",
            step3_title: "Solve Daily Missions",
            step3_desc: "Complete your 3 daily quests: do a lesson, earn 30 XP, and complete 1 quiz to unlock the treasure.",
            step4_title: "Unlock Rewards",
            step4_desc: "Complete your missions to claim your +50 XP stars bonus and unlock streak freeze items!",
        },
        fr: {
            title: "Comment apprendre ?",
            desc: "Suivez ces 4 étapes simples pour maîtriser le code et gagner des récompenses quotidiennes !",
            step1_title: "Choisissez votre parcours",
            step1_desc: "Survolez le menu Apprendre pour choisir Python, JavaScript, le développement Web ou les Mathématiques.",
            step2_title: "Complétez les leçons",
            step2_desc: "Lisez les fiches d'explications théoriques, résolvez des exercices de codage interactifs ou passez des quiz.",
            step3_title: "Missions quotidiennes",
            step3_desc: "Terminez vos 3 quêtes quotidiennes : faites une leçon, gagnez 30 XP et complétez 1 quiz pour débloquer les récompenses.",
            step4_title: "Débloquez les récompenses",
            step4_desc: "Terminez les missions pour réclamer votre bonus de +50 étoiles XP et débloquer des gel-streaks !",
        },
        ar: {
            title: "كيف أتعلم؟",
            desc: "اتبع هذه الخطوات الأربع البسيطة لاحتراف البرمجة وكسب مكافآت يومية في برنامج Code for Tomorrow!",
            step1_title: "اختر مسارك",
            step1_desc: "قم بتمرير الفأرة فوق قائمة (تعلم) لاختيار لغة البرمجة (بايثون، جافا سكريبت، إلخ) أو الرياضيات.",
            step2_title: "أكمل الدروس",
            step2_desc: "اقرأ بطاقات الشرح النظري، وحل مهام البرمجة التفاعلية في المحرر المباشر، أو اجتز الاختبارات القصيرة.",
            step3_title: "حل المهام اليومية",
            step3_desc: "أكمل مهامك اليومية الثلاث: درس واحد، واكسب 30 نقطة خبرة، واجتز اختبارًا واحدًا لفتح المكافآت.",
            step4_title: "افتح المكافآت",
            step4_desc: "أكمل المهام للحصول على مكافأة +50 نجمة خبرة وفك تجميد الحماس!",
        }
    };

    const guideTexts = howToLearnTexts[language as 'en' | 'fr' | 'ar'] || howToLearnTexts.en;


    const progress = currentUser.progress;
    const skillGraph = progress.skillGraph || {};
    const dailyQuests = skillGraph.dailyQuests || [];
    const dailyQuestsDate = skillGraph.dailyQuestsDate || '';
    const chestOpenedToday = skillGraph.chestOpenedToday || false;
    const streak = progress.streak || 0;
    const xp = progress.xp || 0;
    const role = currentUser.role;
    const currentPath = currentUser.currentPath;
    const userName = currentUser.name || "Coder";

    // Local today formatted date string YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];

    // Trigger auto-initialization of daily quests if not present for today
    useEffect(() => {
        if (dailyQuestsDate !== todayStr || dailyQuests.length === 0) {
            const initialQuests: Array<{ id: string; type: string; targetValue: number; currentValue: number; titleKey: string; xpReward: number }> = [
                { id: 'q1', type: 'lesson', targetValue: 1, currentValue: 0, titleKey: 'quest_lesson', xpReward: 15 },
                { id: 'q2', type: 'xp', targetValue: 30, currentValue: 0, titleKey: 'quest_xp', xpReward: 20 },
                { id: 'q3', type: 'quiz', targetValue: 1, currentValue: 0, titleKey: 'quest_quiz', xpReward: 15 },
                { id: 'q4', type: 'ai_tool', targetValue: 1, currentValue: 0, titleKey: 'quest_ai_tool', xpReward: 25 },
                { id: 'q5', type: 'code_editor', targetValue: 3, currentValue: 0, titleKey: 'quest_code_editor', xpReward: 20 },
            ];
            
            const updatedProgress = {
                ...progress,
                skillGraph: {
                    ...skillGraph,
                    dailyQuests: initialQuests,
                    dailyQuestsDate: todayStr,
                    chestOpenedToday: false,
                }
            };
            
            if (currentUser._id.startsWith('guest_')) {
                onUpdateUser({
                    ...currentUser,
                    progress: updatedProgress
                });
            } else {
                api.updateUserProgress(updatedProgress).then(() => {
                    onUpdateUser({
                        ...currentUser,
                        progress: updatedProgress
                    });
                }).catch(err => console.error('Failed to init daily quests:', err));
            }
        }
    }, [dailyQuestsDate, dailyQuests.length, todayStr]);

    const goToLearn = () => {
        if (currentPath) {
            navigate(`/dashboard/learn/${currentPath}`);
        } else {
            onNavigate('learn');
        }
    };

    const handleClaimChest = () => {
        if (chestOpenedToday) return;

        const bonusXp = 50;
        const updatedProgress = {
            ...progress,
            xp: xp + bonusXp,
            skillGraph: {
                ...skillGraph,
                chestOpenedToday: true,
            }
        };

        if (currentUser._id.startsWith('guest_')) {
            onUpdateUser({ ...currentUser, progress: updatedProgress });
        } else {
            api.updateUserProgress(updatedProgress).then(() => {
                onUpdateUser({ ...currentUser, progress: updatedProgress });
            }).catch(err => console.error('Failed to claim chest:', err));
        }

        showToast(`🎉 Daily Bonus Claimed! +${bonusXp} XP Stars!`, 'success');
    };

    // Render Daily Quests HUD Component
    const renderDailyQuestsHUD = () => {
        const isAr = language === 'ar';
        const isFr = language === 'fr';

        const questTitles: Record<string, string> = {
            quest_lesson: isAr ? 'أكمل درساً واحداً' : isFr ? 'Terminer 1 leçon' : (t('quest_lesson' as any) || 'Complete 1 Lesson'),
            quest_xp: isAr ? 'اكسب 30 نقطة خبرة XP' : isFr ? 'Gagner 30 XP' : (t('quest_xp' as any) || 'Earn 30 XP'),
            quest_quiz: isAr ? 'اجتز اختباراً قصيراً واحداً' : isFr ? 'Réussir 1 quiz' : (t('quest_quiz' as any) || 'Pass 1 Quiz'),
            quest_ai_tool: isAr ? 'استخدم أداة ذكاء اصطناعي واحدة' : isFr ? 'Utiliser 1 outil IA / Générateur' : 'Use 1 AI Tool / Generator',
            quest_code_editor: isAr ? 'نفذ الكود 3 مرات في المحرر' : isFr ? 'Exécuter 3 fois du code' : 'Run code 3 times in editor',
        };

        const allCompleted = dailyQuests.length > 0 && dailyQuests.every((q: any) => q.currentValue >= q.targetValue);
        const visibleQuests = isQuestsExpanded ? dailyQuests : dailyQuests.slice(0, 1);

        return (
            <div className="relative bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-cyan-400 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#0f172a] dark:shadow-[5px_5px_0px_0px_#06b6d4] space-y-5 overflow-visible text-left" dir={isAr ? 'rtl' : 'ltr'}>
                
                {/* Floating Corner Sticker */}
                <div className={`absolute -top-3.5 ${isAr ? '-left-3.5' : '-right-3.5'} bg-[#FFE87C] border-2 border-slate-900 rounded-full w-9 h-9 flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_#0f172a] rotate-12 z-20`}>
                    🎯
                </div>

                <div className="flex items-center justify-between border-b-2 border-slate-900/10 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#FFE87C] text-slate-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                            {isAr ? 'المهام اليومية' : 'DAILY HUD'}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                            {t('daily_quests_title' as any) || (isAr ? 'المهام اليومية' : isFr ? 'Quêtes Quotidiennes' : 'Daily Quests')}
                        </h3>
                    </div>

                    {allCompleted && !chestOpenedToday && (
                        <button
                            onClick={handleClaimChest}
                            className="bg-[#00D2D3] hover:bg-[#FFE87C] text-slate-900 font-black text-xs px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1"
                        >
                            <span>🎁 {isAr ? 'استلام +50 XP' : isFr ? 'Réclamer +50 XP' : 'Claim +50 XP'}</span>
                        </button>
                    )}
                </div>

                <div className="space-y-3.5">
                    {visibleQuests.map((quest: any) => {
                        const isDone = quest.currentValue >= quest.targetValue;
                        const pct = Math.min(100, Math.round((quest.currentValue / quest.targetValue) * 100));

                        return (
                            <div key={quest.id} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border-2 border-slate-900 dark:border-slate-800 shadow-[2.5px_2.5px_0px_0px_#0f172a] flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                                            {questTitles[quest.titleKey] || quest.titleKey}
                                        </p>
                                        <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                                            {quest.currentValue} / {quest.targetValue}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[10px] bg-[#FFE87C] text-slate-900 font-black px-2 py-0.5 rounded-md border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                                            +{quest.xpReward} XP
                                        </span>
                                        {isDone && (
                                            <span className="text-xs bg-[#00D2D3] text-slate-900 font-black border border-slate-900 rounded-full w-5 h-5 flex items-center justify-center shadow-[1px_1px_0px_0px_#0f172a]">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-white dark:bg-slate-900 border-2 border-slate-900 h-3 rounded-full overflow-hidden shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-[#00D2D3]' : 'bg-[#FFE87C]'}`}
                                        style={{ width: `${pct}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {dailyQuests.length > 1 && (
                    <button
                        onClick={() => setIsQuestsExpanded(!isQuestsExpanded)}
                        className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 font-black text-xs uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_#0f172a] hover:bg-[#FFE87C] hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span>{isQuestsExpanded ? (isAr ? 'تقليص' : isFr ? 'Réduire' : 'Show less') : (isAr ? `عرض جميع المهام (${dailyQuests.length})` : isFr ? `Voir toutes les quêtes (${dailyQuests.length})` : `Show all quests (${dailyQuests.length})`)}</span>
                        <ChevronDown className={`w-4 h-4 stroke-[3] transition-transform duration-300 ${isQuestsExpanded ? 'rotate-180' : ''}`} />
                    </button>
                )}

                {allCompleted && (
                    <div className="pt-1">
                        <div className="p-3 rounded-2xl bg-[#FFE87C] border-2 border-slate-900 text-slate-900 text-xs font-black text-center shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center gap-2">
                            <span>🎉 {isAr ? 'اكتملت جميع المهام اليومية! تم استلام المكافأة!' : isFr ? 'Toutes les quêtes quotidiennes sont terminées ! Bonus réclamé !' : 'All Daily Quests Completed! Bonus Claimed!'}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderLastCourseVisited = () => {
        if (!currentPath) return null;
        
        const pathInfo = PATHS.find(p => p.id === currentPath);
        if (!pathInfo) return null;

        const pathSections = LESSONS_BY_PATH[currentPath] || [];
        const totalLessons = pathSections.reduce((sum, sec) => sum + sec.lessons.length, 0);
        const completedLessonIds = progress.completedLessons?.[currentPath] || [];
        const completedLessonsCount = completedLessonIds.length;
        const completionPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
        
        const isEmoji = !pathInfo.icon.startsWith('/');

        return (
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all relative overflow-hidden group z-0">
                <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-[#FBBF24]/10 to-brand-500/10 dark:from-[#FBBF24]/5 dark:to-brand-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-1">
                    <div className="flex items-center space-x-5 flex-1 min-w-0">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                            {isEmoji ? (
                                <span className="text-3xl select-none">{pathInfo.icon}</span>
                            ) : (
                                <img 
                                  src={pathInfo.icon} 
                                  alt={t(pathInfo.titleKey as any)} 
                                  className="w-10 h-10 object-contain select-none" 
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).onerror = null;
                                    (e.currentTarget as HTMLImageElement).src = '/assets/code-for-tomorrow-logo.png';
                                  }}
                                />
                            )}
                        </div>
                        
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-[10px] font-black text-[#111827] dark:text-[#FBBF24] uppercase tracking-widest leading-none">
                                {t('last_visited_course') || 'Last Visited Course'}
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2 truncate">
                                {t(pathInfo.titleKey as any) || pathInfo.titleKey}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 max-w-[240px] bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#FBBF24] to-[#111827] dark:to-indigo-950 rounded-full transition-all duration-500"
                                        style={{ width: `${completionPercent}%` }}
                                    ></div>
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold shrink-0">
                                    {completionPercent}% ({completedLessonsCount}/{totalLessons})
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        id="btn-resume-last-course"
                        data-agent-track="resume_last_course_click"
                        data-sync-metric="path_resume"
                        onClick={goToLearn}
                        className="bg-[#111827] hover:bg-[#1f2937] text-white font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border-b-4 border-slate-900 active:border-b-2 active:translate-y-0.5 transition-all shadow-md group/btn cursor-pointer shrink-0"
                    >
                        <span>{t('resume_study') || 'Resume Study'}</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    };

    const renderSuggestedCourses = () => {
        const suggestedPaths = PATHS.filter(p => p.isAvailable && p.id !== currentPath && p.id !== 'math').slice(0, 6);

        if (suggestedPaths.length === 0) return null;

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suggestedPaths.map(path => {
                        const pathSections = LESSONS_BY_PATH[path.id] || [];
                        const totalLessons = pathSections.reduce((sum, sec) => sum + sec.lessons.length, 0);
                        const completedLessonIds = progress.completedLessons?.[path.id] || [];
                        const completedLessonsCount = completedLessonIds.length;
                        const completionPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
                        
                        const isEmoji = !path.icon.startsWith('/');

                        return (
                            <div
                                key={path.id}
                                id={`suggested-course-card-${path.id}`}
                                data-agent-track={`suggested_course_click_${path.id}`}
                                data-sync-metric="curriculum_selection"
                                onClick={() => navigate(`/dashboard/learn/${path.id}`)}
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer flex flex-col justify-between h-full"
                            >
                                <div className="aspect-[16/10] w-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#FBBF24]/5 to-brand-500/5 transition-opacity duration-300"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform duration-500">
                                        {isEmoji ? (
                                            <span className="text-3xl select-none">{path.icon}</span>
                                        ) : (
                                            <img src={path.icon} alt={t(path.titleKey as any)} className="w-10 h-10 object-contain select-none" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#FBBF24] transition-colors">
                                            {t(path.titleKey as any) || path.titleKey}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">
                                            {t(path.descriptionKey as any) || path.descriptionKey}
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                            {completionPercent > 0 ? (
                                                <div className="flex flex-col w-full gap-1">
                                                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                                                        <span>{t('completed') || 'Completed'}</span>
                                                        <span>{completionPercent}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-[#FBBF24] to-[#111827] rounded-full"
                                                            style={{ width: `${completionPercent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-[10px] bg-[#FBBF24]/20 text-[#111827] dark:text-[#FBBF24] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {t('new' as any)}
                                                    </span>
                                                    <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all">
                                                        <span className="text-xs">→</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-2 flex justify-center">
                    <button
                        onClick={() => navigate('/dashboard/learn')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-[#FBBF24] dark:hover:border-[#FBBF24] text-slate-800 dark:text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <span>Load More Courses</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#FBBF24] group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>
        );
    };

    if (role === 'student') {
        return (
            <div className="min-h-full w-full bg-transparent overflow-x-hidden relative p-3 md:p-6">
                <div className="max-w-6xl mx-auto space-y-6 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div className="flex flex-col gap-2.5 text-left">
                            <div className="flex flex-wrap items-center gap-3">
                                <img src="/assets/images/logo.png" alt="Code for Tomorrow" className="h-12 w-auto object-contain" />
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center flex-wrap gap-2">
                                    <span>Hello, {userName}!</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-500/20 select-none">
                                        Level {Math.floor(xp / 100) + 1}
                                    </span>
                                </h1>
                            </div>
                            {streak >= 3 && (
                                <div className="inline-flex items-center gap-1.5 self-start">
                                    <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none">
                                        Streak Multiplier: {streak >= 5 ? '1.5x XP Active!' : '1.2x XP Active!'}
                                    </p>
                                </div>
                            )}
                            {/* Level Progress Bar */}
                            <div className="w-64 mt-1">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 dark:text-slate-400 mb-1 select-none">
                                    <span>Level {Math.floor(xp / 100) + 1} Progress</span>
                                    <span>{xp % 100} / 100 XP</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500 rounded-full" 
                                        style={{ width: `${xp % 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Streak & Points display on Home Page */}
                        <div className="flex items-center gap-3.5 self-start sm:self-auto">
                            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-black text-sm bg-red-500/10 px-4 py-2.5 rounded-2xl border border-red-500/20 shadow-xs transition-transform hover:scale-105 duration-200">
                                <Flame className="w-5 h-5 text-red-500" />
                                <div className="text-left leading-none">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{streak}</p>
                                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">Day Streak</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-black text-sm bg-amber-500/10 px-4 py-2.5 rounded-2xl border border-amber-500/20 shadow-xs transition-transform hover:scale-105 duration-200">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                <div className="text-left leading-none">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{xp}</p>
                                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">Total XP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {renderLastCourseVisited()}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Brain Training Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide">{t('brain_training')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button onClick={() => navigate('/brain-training')} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer">
                                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                            <img src="/brain_training_challenges.png" alt="Challenges" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#EA4335] uppercase">{t('brain_training')}</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t('brain_training_challenges')}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                                <span className="text-lg">→</span>
                                            </div>
                                        </div>
                                    </button>
                                    <button onClick={() => navigate('/brain-training')} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer">
                                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                            <img src="/brain_training_workouts.png" alt="Workouts" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#EA4335] uppercase">{t('brain_training')}</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t('brain_training_workouts')}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                                <span className="text-lg">→</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Suggested Courses */}
                            <div className="space-y-4">
                                <h2 className="text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide">
                                    {t('suggested_courses') || 'Suggested Courses'}
                                </h2>
                                {renderSuggestedCourses()}
                            </div>
                        </div>

                        {/* MentalUP & Daily Quests Right Sidebar Section */}
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <div className="space-y-4">
                                <h2 className="text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide">My Profile</h2>
                                <div 
                                    onClick={() => onNavigate('profile')}
                                    className="group bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm hover:border-[#111827]/25 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all cursor-pointer text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FBBF24]/10 to-transparent rounded-full blur-xl"></div>
                                    <div className="flex flex-col items-center gap-3.5 relative z-10">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 aspect-square">
                                            <img 
                                                src={currentUser.profilePictureUrl || 'https://ui-avatars.com/api/?name=U&background=random'} 
                                                alt={userName} 
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-none">
                                                {userName}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1">
                                                <span></span> {currentUser.role === 'teacher' ? 'Instructor' : 'Student'}
                                            </p>
                                        </div>
                                        <div className="w-full grid grid-cols-2 gap-3 mt-1.5 pt-3.5 border-t border-slate-100 dark:border-slate-700/50 text-left">
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-850">
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">XP</p>
                                                <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-1"> {xp}</p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-850">
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">Streak</p>
                                                <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-1"> {streak} days</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-[#111827] dark:text-[#FBBF24] uppercase tracking-wider mt-1 group-hover:underline flex items-center justify-center gap-1">
                                            View Full Profile <span>→</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Personalized Quest Card - Neo-Brutalism & Bento Floating UI Collage */}
                            <div className="space-y-4">
                                <h2 className="text-xs font-black text-slate-800 dark:text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-yellow-400 border-2 border-slate-900 rounded-sm"></span>
                                    AI Custom Generator
                                </h2>
                                
                                <div 
                                    onClick={() => navigate('/dashboard/ai-tools')}
                                    className="group relative bg-[#FFE500] dark:bg-[#0d1527] border-3 border-slate-900 dark:border-cyan-400 rounded-2xl p-5 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#06b6d4] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#0f172a] dark:hover:shadow-[8px_8px_0px_0px_#06b6d4] transition-all duration-200 cursor-pointer overflow-hidden"
                                >
                                    {/* Decorative Dotted Grid Pattern Background */}
                                    <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"></div>

                                    {/* Bento Floating Collage Items */}
                                    <div className="relative z-10 space-y-4">
                                        
                                        {/* Top Collage Row: Neo-Brutalist Badges */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-black uppercase text-slate-900 dark:text-slate-950 bg-cyan-400 dark:bg-cyan-400 px-3 py-1 rounded-md border-2 border-slate-900 dark:border-cyan-200 shadow-[2px_2px_0px_0px_#0f172a] tracking-wider">
                                                COFOTO AI
                                            </span>

                                            {/* Floating Micro Sticker Pill */}
                                            <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-cyan-300 px-2.5 py-1 rounded-md border-2 border-slate-900 dark:border-cyan-400 shadow-[2px_2px_0px_0px_#0f172a] group-hover:rotate-1 transition-transform">
                                                <span>def quest()</span>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                                                Generate Custom Lesson with COFOTO
                                            </h3>
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-300 leading-snug">
                                                Personalized AI challenges built live from your favorite topics (Game Dev, Robotics, Space, Cybersecurity).
                                            </p>
                                        </div>

                                        {/* Bento Grid Mini Interactive Floating Chips Collage */}
                                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                                            <div className="bg-emerald-400 dark:bg-emerald-500/20 text-slate-950 dark:text-emerald-300 text-[10px] font-black px-2 py-1.5 rounded-lg border-2 border-slate-900 dark:border-emerald-400 shadow-[2px_2px_0px_0px_#0f172a] text-center truncate">
                                                🎮 Game Dev
                                            </div>
                                            <div className="bg-pink-400 dark:bg-pink-500/20 text-slate-950 dark:text-pink-300 text-[10px] font-black px-2 py-1.5 rounded-lg border-2 border-slate-900 dark:border-pink-400 shadow-[2px_2px_0px_0px_#0f172a] text-center truncate">
                                                🤖 Robotics
                                            </div>
                                            <div className="bg-sky-400 dark:bg-sky-500/20 text-slate-950 dark:text-sky-300 text-[10px] font-black px-2 py-1.5 rounded-lg border-2 border-slate-900 dark:border-sky-400 shadow-[2px_2px_0px_0px_#0f172a] text-center truncate">
                                                🚀 Space
                                            </div>
                                        </div>

                                        {/* Neo-Brutalist Call To Action Button */}
                                        <div className="pt-2">
                                            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-cyan-400 text-white dark:text-slate-950 font-black text-xs uppercase tracking-wider border-2 border-slate-900 dark:border-cyan-300 shadow-[3px_3px_0px_0px_#FFE500] dark:shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-between group-hover:bg-cyan-400 dark:group-hover:bg-cyan-300 group-hover:text-slate-950 transition-all">
                                                <span>Start Generator</span>
                                                <span className="font-extrabold text-sm group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide">Daily Missions</h2>
                                {renderDailyQuestsHUD()}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">Educational Brain Games</h2>
                                <button 
                                    id="card-mentalup"
                                    data-agent-track="mentalup_click"
                                    data-sync-metric="third_party_redirect"
                                    className="group w-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                                >
                                    <div className="aspect-[16/10] bg-[#2E2FCE] flex items-center justify-center p-8 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                        <div className="text-center space-y-4 relative z-10">
                                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                                🧠
                                            </div>
                                            <p className="text-xl font-bold text-white tracking-widest uppercase">MENTALUP</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {isAr ? 'لعبة MentalUP لتمارين العقل' : isFr ? 'Jouer à MentalUP' : 'Play MentalUP'}
                                        </p>
                                        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#2E2FCE] group-hover:text-white group-hover:border-[#2E2FCE] transition-all shadow-sm">
                                            <span className={`text-lg ${isAr ? 'rotate-180' : ''}`}>→</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Math Games Section */}
                    <div className="space-y-4">
                        <h2 className={`text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide ${isAr ? 'text-right' : 'text-left'}`}>
                            {isAr ? 'ألعاب الرياضيات التفاعلية' : isFr ? 'Jeux de Mathématiques' : 'Math Games'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button 
                                id="btn-math-pick"
                                data-agent-track="math_pick_play"
                                data-sync-metric="math_game_select"
                                onClick={() => navigate('/dashboard/learn/math')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                                dir={isAr ? 'rtl' : 'ltr'}
                            >
                                <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-8">
                                    <div className="grid grid-cols-2 gap-2 transform group-hover:scale-105 transition-transform">
                                        <div className="w-10 h-10 bg-[#111827] rounded-lg flex items-center justify-center text-white font-bold text-lg">＋</div>
                                        <div className="w-10 h-10 bg-[#EA4335] rounded-lg flex items-center justify-center text-white font-bold text-lg">－</div>
                                        <div className="w-10 h-10 bg-[#FBBC05] rounded-lg flex items-center justify-center text-white font-bold text-lg">×</div>
                                        <div className="w-10 h-10 bg-[#34A853] rounded-lg flex items-center justify-center text-white font-bold text-lg">＝</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {isAr ? 'اختر والعب' : isFr ? 'Choisir & Jouer' : 'Pick & Play'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                        <span className={`text-lg ${isAr ? 'rotate-180' : ''}`}>→</span>
                                    </div>
                                </div>
                            </button>
                            <button 
                                id="btn-math-quick"
                                data-agent-track="math_quick_play"
                                data-sync-metric="math_game_select"
                                onClick={() => navigate('/dashboard/learn/math')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                                dir={isAr ? 'rtl' : 'ltr'}
                            >
                                <div className="aspect-[16/10] bg-[#F8F9FA] dark:bg-slate-900/50 flex items-center justify-center p-6">
                                    <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform">
                                        <div className="w-14 h-14 bg-[#1A73E8] rounded-2xl flex items-center justify-center text-white text-3xl shadow-md font-extrabold -rotate-6">
                                            ⚡
                                        </div>
                                        <div className="absolute -top-2 -right-3 w-8 h-8 bg-[#FBBC05] rounded-xl flex items-center justify-center text-[#111827] font-black text-xs shadow-sm rotate-12">
                                            30s
                                        </div>
                                        <div className="absolute -bottom-2 -left-3 w-8 h-8 bg-[#34A853] rounded-xl flex items-center justify-center text-white font-black text-[11px] shadow-sm -rotate-12">
                                            +50
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {isAr ? 'تحدي اللعب السريع' : isFr ? 'Jeu Rapide (30s)' : 'Quick Play'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                        <span className={`text-lg ${isAr ? 'rotate-180' : ''}`}>→</span>
                                    </div>
                                </div>
                            </button>
                            <button 
                                id="btn-math-arena"
                                data-agent-track="math_arena_play"
                                data-sync-metric="math_game_select"
                                onClick={() => navigate('/dashboard/learn/math')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                                dir={isAr ? 'rtl' : 'ltr'}
                            >
                                <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-6">
                                    <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform">
                                        <div className="w-14 h-14 bg-[#EA4335] rounded-2xl flex items-center justify-center text-white text-3xl shadow-md font-extrabold rotate-6">
                                            🏆
                                        </div>
                                        <div className="absolute -top-2 -left-3 w-8 h-8 bg-[#111827] rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-sm -rotate-12">
                                            VS
                                        </div>
                                        <div className="absolute -bottom-2 -right-3 w-8 h-8 bg-[#FBBC05] rounded-xl flex items-center justify-center text-[#111827] font-black text-xs shadow-sm rotate-12">
                                            👑
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {isAr ? 'حلبة التنافس الرياضياتية' : isFr ? 'Arène de Mathématiques' : 'Math Arena'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                        <span className={`text-lg ${isAr ? 'rotate-180' : ''}`}>→</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Books Section */}
                    <div className="space-y-4">
                        <h2 className={`text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide ${isAr ? 'text-right' : 'text-left'}`}>
                            {isAr ? 'الكتب والقصص التفاعلية' : isFr ? 'Livres & Récits' : 'Books'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                id="btn-smart-books"
                                data-agent-track="smart_books_click"
                                data-sync-metric="books_nav"
                                onClick={() => navigate('/smart-books')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                                dir={isAr ? 'rtl' : 'ltr'}
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-[#fce4ec]">
                                    <img src="/esl_books.png" alt="ESL Books" className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-[#111827] dark:text-indigo-300">
                                        {isAr ? 'كتب تعليم الإنجليزية ESL' : isFr ? 'Livres d\'apprentissage ESL' : 'ESL Books'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[#111827] dark:text-indigo-300 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                        <span className={`text-lg ${isAr ? 'rotate-180' : ''}`}>→</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Speaking Hub Section */}
                    <div className="space-y-4">
                        <h2 className={`text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide ${isAr ? 'text-right' : 'text-left'}`}>
                            {isAr ? 'مركز المحادثة والتحدث' : isFr ? 'Hub d\'Oral & Langues' : 'Speaking Hub'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                id="btn-speaking-hub"
                                data-agent-track="speaking_hub_click"
                                data-sync-metric="language_practice_nav"
                                onClick={() => navigate('/speaking-hub')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                                dir={isAr ? 'rtl' : 'ltr'}
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-[#e3f2fd]">
                                    <img src="/speaking_practice.png" alt="Practice a Language" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-[#111827] dark:text-indigo-300">
                                        {isAr ? 'ممارسة اللغات بصوتك' : isFr ? 'Pratiquer une Langue à l\'Oral' : 'Practice a Language'}
                                    </p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[#111827] dark:text-indigo-300 group-hover:bg-[#111827] group-hover:text-white group-hover:border-[#111827] transition-all shadow-sm">
                                        <span className={`text-lg ${isAr ? 'rotate-180' : ''}`}>→</span>
                                    </div>
                                </div>
                            </button>
                            <div className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 text-left opacity-75 cursor-default" dir={isAr ? 'rtl' : 'ltr'}>
                                <div className="aspect-[16/10] overflow-hidden bg-[#e3f2fd]">
                                    <img src="/discover_learn.png" alt="Discover & Learn" className="w-full h-full object-contain p-4" />
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-400">
                                        {isAr ? 'اكتشف وتعلم' : isFr ? 'Découvrir & Apprendre' : 'Discover & Learn'}
                                    </p>
                                    <span className="text-xs font-bold text-red-400">
                                        {isAr ? 'قريباً' : isFr ? 'Bientôt disponible' : 'Coming soon'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How to Learn Section */}
                    <div id="how-to-learn" className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800 scroll-mt-24">
                        <div className="text-left space-y-2">
                            <h2 className="text-2xl font-black text-[#111827] dark:text-indigo-200 uppercase tracking-tight flex items-center gap-2">
                                <span></span> {guideTexts.title}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {guideTexts.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                            {/* Step 1 */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-md"></div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                                    1
                                </div>
                                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step1_title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                    {guideTexts.step1_desc}
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-md"></div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                                    2
                                </div>
                                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step2_title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                    {guideTexts.step2_desc}
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-md"></div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-2xl font-black text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                                    3
                                </div>
                                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step3_title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                    {guideTexts.step3_desc}
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#FBBF24]/10 to-transparent rounded-full blur-md"></div>
                                <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/10 dark:bg-[#FBBF24]/25 flex items-center justify-center text-2xl font-black text-[#111827] dark:text-[#FBBF24] mb-4 group-hover:scale-105 transition-transform">
                                    4
                                </div>
                                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step4_title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                    {guideTexts.step4_desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-transparent overflow-x-hidden relative">
            <div className="max-w-5xl mx-auto space-y-6 relative z-10 p-3 md:p-6">

                {/* Hero Greeting Section */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-10">
                    <div className="relative group shrink-0">
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#34A853]/10 dark:bg-indigo-500/10 blur-xl rounded-full"></div>
                        <div className="transform transition-all group-hover:scale-105 duration-500 cursor-pointer drop-shadow-md">
                            <Mascot />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4 max-w-lg">
                        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
                                {t('welcome_back').replace('!', '')}, <span className="text-[#111827] dark:text-[#FBBF24] font-black">{userName}!</span>
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                {t('welcome_message')} {t('magic_found')}
                            </p>
                            {streak >= 3 && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-xl animate-pulse">
                                    <span className="text-sm"></span>
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none">
                                        Streak Multiplier: {streak >= 5 ? '1.5x XP Active!' : '1.2x XP Active!'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto md:mx-0">
                            <FloatingStat icon="" value={`${streak} ${streak > 0 ? 'Days' : 'Day'}`} label={t('day_streak')} color="border-[#EA4335]" />
                            <FloatingStat icon="" value={xp.toLocaleString()} label={t('total_xp_label')} color="border-[#FBBC05]" />
                        </div>
                    </div>
                </div>

                {renderLastCourseVisited()}

                {/* Adventure Path Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {/* Learn Card */}
                    <button
                        id="card-guest-learn"
                        data-agent-track="guest_learn_select"
                        data-sync-metric="curriculum_onboarding"
                        onClick={goToLearn}
                        className="group relative bg-[#111827] rounded-3xl p-8 text-center transition-all transform hover:-translate-y-2 hover:shadow-xl overflow-hidden cursor-pointer"
                    >
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20 transition-transform group-hover:scale-110 shadow-sm relative z-10">
                            <span className="text-3xl text-white">🚀</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10">
                            {t('learn')}
                        </h2>
                        <p className="text-sm text-indigo-100 font-medium mb-8 leading-snug relative z-10">
                            {t('learn_adventure_desc')}
                        </p>
                        <div className="w-full py-4 bg-white text-[#111827] rounded-full font-bold text-sm shadow-md group-hover:bg-slate-50 transition-colors uppercase tracking-wide relative z-10">
                            {t('start')}
                        </div>
                    </button>

                    {/* Create Card */}
                    <button
                        id="card-guest-create"
                        data-agent-track="guest_create_select"
                        data-sync-metric="creations_onboarding"
                        onClick={() => onNavigate('creations')}
                        className="group relative bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center transition-all transform hover:-translate-y-2 hover:shadow-md overflow-hidden cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-[#EA4335]/10 dark:bg-[#EA4335]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 relative z-10">
                            <span className="text-3xl">🎨</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 relative z-10">
                            {t('creations')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-snug relative z-10">
                            {t('create_adventure_desc')}
                        </p>
                        <div className="w-full py-4 bg-[#EA4335] text-white rounded-full font-bold text-sm shadow-sm group-hover:bg-[#d93025] transition-colors uppercase tracking-wide relative z-10">
                            {t('create')}
                        </div>
                    </button>

                    {/* Brain Training Card */}
                    <button
                        id="card-guest-brain"
                        data-agent-track="guest_brain_select"
                        data-sync-metric="brain_training_onboarding"
                        onClick={() => navigate('/brain-training')}
                        className="group relative bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center transition-all transform hover:-translate-y-2 hover:shadow-md overflow-hidden cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-[#34A853]/10 dark:bg-[#34A853]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 relative z-10">
                            <span className="text-3xl">🧠</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 relative z-10">
                            {t('brain_training')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-snug relative z-10">
                            {t('brain_training_desc')}
                        </p>
                        <div className="w-full py-4 bg-[#34A853] text-white rounded-full font-bold text-sm shadow-sm group-hover:bg-[#2e9347] transition-colors uppercase tracking-wide relative z-10">
                            {t('brain_training_play')}
                        </div>
                    </button>
                </div>

                {/* Suggested Courses */}
                <div className="space-y-4">
                    <h2 className="text-base font-black text-[#111827] dark:text-indigo-200 uppercase tracking-wide">
                        {t('suggested_courses') || 'Suggested Courses'}
                    </h2>
                    {renderSuggestedCourses()}
                </div>

                {/* Quests and Tip Footer Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-stretch">
                    {renderDailyQuestsHUD()}
                    
                    <div className="flex flex-col justify-between gap-6">
                        <div className="bg-[#FBBC05]/10 dark:bg-[#FBBC05]/5 p-6 rounded-3xl border border-[#FBBC05]/20 flex items-center space-x-6 shadow-sm transition-all hover:shadow-md group h-full">
                            <div className="bg-[#FBBC05] text-white w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                                💡
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed">
                                "{t('did_you_know')} {t('code_fact')}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* How to Learn Section */}
                <div id="how-to-learn" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 scroll-mt-24">
                    <div className="text-left space-y-2">
                        <h2 className="text-2xl font-black text-[#111827] dark:text-indigo-200 uppercase tracking-tight flex items-center gap-2">
                            <span></span> {guideTexts.title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {guideTexts.desc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                        {/* Step 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-md"></div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                                1
                            </div>
                            <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step1_title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                {guideTexts.step1_desc}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-md"></div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                                2
                            </div>
                            <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step2_title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                {guideTexts.step2_desc}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-md"></div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-2xl font-black text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                                3
                            </div>
                            <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step3_title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                {guideTexts.step3_desc}
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-[#111827]/10 dark:border-[#FBBF24]/20 shadow-sm relative overflow-hidden group hover:border-[#111827]/30 dark:hover:border-[#FBBF24]/40 hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#FBBF24]/10 to-transparent rounded-full blur-md"></div>
                            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/10 dark:bg-[#FBBF24]/25 flex items-center justify-center text-2xl font-black text-[#111827] dark:text-[#FBBF24] mb-4 group-hover:scale-105 transition-transform">
                                4
                            </div>
                            <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-2">{guideTexts.step4_title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                {guideTexts.step4_desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomeHubScreen;
