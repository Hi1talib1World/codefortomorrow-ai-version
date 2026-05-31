import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardView } from '../Dashboard';
import Mascot from '../Mascot';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { useToast } from '../ToastNotification';
import { PATHS, LESSONS_BY_PATH } from '../../constants';

interface HomeHubScreenProps {
    onNavigate: (view: DashboardView) => void;
    currentUser: UserType;
    onUpdateUser: (updatedData: Partial<UserType>) => void;
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

const HomeHubScreen: React.FC<HomeHubScreenProps> = ({ onNavigate, currentUser, onUpdateUser }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Chest Opening Animation States
    const [chestState, setChestState] = useState<'closed' | 'shaking' | 'opening' | 'opened'>('closed');
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; tx: number; ty: number; char: string }>>([]);

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
            const initialQuests: Array<{ id: string; type: 'lesson' | 'xp' | 'quiz'; targetValue: number; currentValue: number; titleKey: string; xpReward: number }> = [
                { id: 'q1', type: 'lesson', targetValue: 1, currentValue: 0, titleKey: 'quest_lesson', xpReward: 15 },
                { id: 'q2', type: 'xp', targetValue: 30, currentValue: 0, titleKey: 'quest_xp', xpReward: 20 },
                { id: 'q3', type: 'quiz', targetValue: 1, currentValue: 0, titleKey: 'quest_quiz', xpReward: 15 },
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
            
            // SQLite Edge Sync: api.updateUserProgress maps directly to the Local Storage cache.
            // When offline, this progress state is buffered locally and subsequently synchronized
            // to our Google Cloud / central database as 'learning_events' when connectivity is restored.
            api.updateUserProgress(updatedProgress).then(() => {
                onUpdateUser({
                    ...currentUser,
                    progress: updatedProgress
                });
            }).catch(err => console.error('Failed to init daily quests:', err));
        }
    }, [dailyQuestsDate, dailyQuests.length, todayStr]);

    const allQuestsCompleted = dailyQuests.length > 0 && dailyQuests.every((q: any) => q.currentValue >= q.targetValue);

    const handleOpenChest = async () => {
        if (!allQuestsCompleted) {
            showToast('Complete all 3 Daily Quests to unlock the Moroccan Treasure Chest! 🐪');
            return;
        }
        if (chestOpenedToday) {
            showToast('You have already opened today\'s chest! Come back tomorrow! 🌟');
            return;
        }

        // Start shaking!
        setChestState('shaking');
        
        // Generate random particle angles and offsets
        const burstParticles = Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const distance = 80 + Math.random() * 60;
            return {
                id: i,
                tx: Math.cos(angle) * distance,
                ty: Math.sin(angle) * distance,
                char: ['✨', '⭐', '🪙', '🍬'][Math.floor(Math.random() * 4)]
            };
        });
        setParticles(burstParticles);
        
        // Shake for 1.2s, then transition to opening!
        setTimeout(() => {
            setChestState('opening');
            
            // Wait 1.5s for opening sparks to display, then show reward card
            setTimeout(() => {
                setChestState('opened');
                setShowRewardModal(true);
                
                // Save reward results to DB: +50 XP and unlock Streak Freeze (ID 4)
                const unlocked = skillGraph.unlockedAvatarItems || [];
                const newUnlocked = unlocked.includes(4) ? unlocked : [...unlocked, 4];
                
                const updatedProgress = {
                    ...progress,
                    xp: progress.xp + 50,
                    skillGraph: {
                        ...skillGraph,
                        unlockedAvatarItems: newUnlocked,
                        chestOpenedToday: true,
                        dailyQuests,
                        dailyQuestsDate
                    }
                };

                // SQLite Edge Sync: Updates user XP stars (+50) and equipped items locally.
                // Serialized as a client progress state transaction, this event is recorded by the edge system
                // and synced back to MongoDB and our central GCP database for processing by the Gemini AI Agents.
                api.updateUserProgress(updatedProgress).then(() => {
                    onUpdateUser({
                        ...currentUser,
                        progress: updatedProgress
                    });
                }).catch(err => console.error('Failed to claim chest rewards:', err));

            }, 1500);
        }, 1200);
    };

    const goToLearn = () => {
        if (currentPath) {
            navigate(`/dashboard/learn/${currentPath}`);
        } else {
            onNavigate('learn');
        }
    };

    // Render Daily Quests HUD Component
    const renderDailyQuestsHUD = () => {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-slate-100 dark:border-slate-700 shadow-md transition-colors relative overflow-hidden text-center flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span>🎯</span> {t('daily_quests_title') || 'Daily Quests'}
                        </h3>
                        <span className="text-[9px] bg-cyan-500/10 text-cyan-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Resets Daily
                        </span>
                    </div>
                    
                    <div className="space-y-3.5">
                        {dailyQuests.map((quest: any) => {
                            const isDone = quest.currentValue >= quest.targetValue;
                            const pct = Math.min(100, Math.round((quest.currentValue / quest.targetValue) * 100));
                            
                            return (
                                <div key={quest.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-950 flex flex-col gap-2">
                                    <div className="flex items-start justify-between">
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                                                {t(quest.titleKey) || quest.titleKey}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                                                {quest.currentValue} / {quest.targetValue}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-[10px] bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 font-black px-2 py-0.5 rounded-lg">
                                                +{quest.xpReward} XP
                                            </span>
                                            {isDone && (
                                                <span className="text-xs bg-green-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">✓</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : 'bg-brand-500 animate-pulse'}`}
                                            style={{ width: `${pct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Moroccan Chest Graphic Node */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col items-center relative">
                    <div 
                        id="moroccan-chest-hud"
                        data-agent-track="treasure_chest_click"
                        data-sync-metric="chest_opening"
                        className={`relative cursor-pointer select-none group w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/5 to-yellow-500/5 hover:from-amber-500/10 hover:to-yellow-500/10 border border-yellow-500/20 shadow-inner ${
                            chestState === 'shaking' ? 'animate-chest-shake' : 
                            chestState === 'opening' ? 'scale-110 opacity-75' : 
                            chestState === 'opened' ? 'scale-105' : 'hover:scale-105'
                        }`}
                        onClick={handleOpenChest}
                    >
                        {/* Golden/emerald aura behind chest */}
                        {allQuestsCompleted && !chestOpenedToday && chestState !== 'opened' && (
                            <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-lg animate-pulse z-0"></div>
                        )}
                        
                        {/* Chest Emoji */}
                        <div className="text-5xl drop-shadow-md select-none transition-transform z-10">
                            {chestOpenedToday || chestState === 'opened' ? '🔓' : '🎁'}
                        </div>

                        {/* Particle sparks burst overlay */}
                        {chestState === 'opening' && particles.map(p => (
                            <div 
                                key={p.id}
                                className="absolute text-sm animate-particle-fade z-20 pointer-events-none select-none"
                                style={{
                                    '--tx': `${p.tx}px`,
                                    '--ty': `${p.ty}px`
                                } as React.CSSProperties}
                            >
                                {p.char}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-3">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            {chestOpenedToday ? 'Chest Claimed Today!' : (allQuestsCompleted ? 'Treasure Chest Unlocked!' : 'Moroccan Treasure Chest')}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 max-w-[220px] mx-auto leading-normal">
                            {chestOpenedToday ? 'Completed all daily missions! Great job!' : (allQuestsCompleted ? 'Click the chest to open your daily rewards!' : 'Solve all 3 daily quests to claim chest!')}
                        </p>
                    </div>
                </div>
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
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-brand-500/10 dark:from-cyan-500/5 dark:to-brand-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center space-x-5 flex-1 min-w-0">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                            {isEmoji ? (
                                <span className="text-3xl select-none">{pathInfo.icon}</span>
                            ) : (
                                <img src={pathInfo.icon} alt={t(pathInfo.titleKey)} className="w-10 h-10 object-contain select-none" />
                            )}
                        </div>
                        
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest leading-none">
                                {t('last_visited_course') || 'Last Visited Course'}
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2 truncate">
                                {t(pathInfo.titleKey) || pathInfo.titleKey}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 max-w-[240px] bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-cyan-500 to-brand-500 rounded-full transition-all duration-500"
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
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border-b-4 border-cyan-700 active:border-b-2 active:translate-y-0.5 transition-all shadow-md group/btn cursor-pointer shrink-0"
                    >
                        <span>{t('resume_study') || 'Resume Study'}</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    };

    const renderSuggestedCourses = () => {
        const suggestedPaths = PATHS.filter(p => p.isAvailable && p.id !== currentPath && p.id !== 'math').slice(0, 3);

        if (suggestedPaths.length === 0) return null;

        return (
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
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/5 to-brand-500/5 transition-opacity duration-300"></div>
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform duration-500">
                                    {isEmoji ? (
                                        <span className="text-3xl select-none">{path.icon}</span>
                                    ) : (
                                        <img src={path.icon} alt={t(path.titleKey)} className="w-10 h-10 object-contain select-none" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col justify-between flex-1">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">
                                        {t(path.titleKey) || path.titleKey}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">
                                        {t(path.descriptionKey) || path.descriptionKey}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                    {completionPercent > 0 ? (
                                        <div className="flex flex-col w-full gap-1">
                                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                                                <span>{t('completed') || 'Completed'}</span>
                                                <span>{completionPercent}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-brand-500 rounded-full"
                                                    style={{ width: `${completionPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-[10px] bg-cyan-500/10 text-cyan-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {t('new') || 'New'}
                                            </span>
                                            <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all">
                                                <span className="text-xs">→</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (role === 'student') {
        return (
            <div className="min-h-full w-full bg-transparent overflow-x-hidden relative p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3 tracking-tight">
                            <span>👋</span> Hello, {userName}!
                        </h1>
                        {/* Streak multiplier details */}
                        {streak >= 3 && (
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 border border-orange-500/30 px-3.5 py-1.5 rounded-xl animate-pulse self-start md:self-auto">
                                <span className="text-sm">🔥</span>
                                <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none">
                                    Streak Multiplier: {streak >= 5 ? '1.5x XP Active!' : '1.2x XP Active!'}
                                </p>
                            </div>
                        )}
                    </div>

                    {renderLastCourseVisited()}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Brain Training Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">{t('brain_training')}</h2>
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
                                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
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
                                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                                <span className="text-lg">→</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Suggested Courses */}
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                                    {t('suggested_courses') || 'Suggested Courses'}
                                </h2>
                                {renderSuggestedCourses()}
                            </div>
                        </div>

                        {/* MentalUP & Daily Quests Right Sidebar Section */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">Daily Missions</h2>
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
                                    <div className="aspect-[16/10] bg-[#4285F4] flex items-center justify-center p-8 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                        <div className="text-center space-y-4 relative z-10">
                                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-sm transform group-hover:-translate-y-1 transition-transform">🧠</div>
                                            <p className="text-xl font-bold text-white tracking-widest uppercase">MENTALUP</p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Play MentalUP</p>
                                        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                            <span className="text-sm">↗</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Math Games Section */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">Math Games</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button 
                                id="btn-math-pick"
                                data-agent-track="math_pick_play"
                                data-sync-metric="math_game_select"
                                onClick={() => navigate('/dashboard/learn/math')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                            >
                                <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-8">
                                    <div className="grid grid-cols-2 gap-2 transform group-hover:scale-105 transition-transform">
                                        <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center text-white font-bold text-lg">＋</div>
                                        <div className="w-10 h-10 bg-[#EA4335] rounded-lg flex items-center justify-center text-white font-bold text-lg">－</div>
                                        <div className="w-10 h-10 bg-[#FBBC05] rounded-lg flex items-center justify-center text-white font-bold text-lg">×</div>
                                        <div className="w-10 h-10 bg-[#34A853] rounded-lg flex items-center justify-center text-white font-bold text-lg">＝</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Pick & Play</p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                            <button 
                                id="btn-math-quick"
                                data-agent-track="math_quick_play"
                                data-sync-metric="math_game_select"
                                onClick={() => navigate('/dashboard/learn/math')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                            >
                                <div className="aspect-[16/10] bg-[#f8f9fa] dark:bg-slate-900/50 flex items-center justify-center">
                                    <div className="text-6xl transform group-hover:-translate-y-1 transition-transform">🎮</div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Quick Play</p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                            <button 
                                id="btn-math-arena"
                                data-agent-track="math_arena_play"
                                data-sync-metric="math_game_select"
                                onClick={() => navigate('/dashboard/learn/math')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                            >
                                <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-8">
                                    <div className="text-6xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform">🧮</div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Math Arena</p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">Smart Books</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                id="btn-smart-books"
                                data-agent-track="smart_books_click"
                                data-sync-metric="books_nav"
                                onClick={() => navigate('/smart-books')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-[#fce4ec]">
                                    <img src="/esl_books.png" alt="ESL Books" className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-[#4285F4]">ESL Books</p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[#4285F4] group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Speaking Hub Section */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">Speaking Hub</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                id="btn-speaking-hub"
                                data-agent-track="speaking_hub_click"
                                data-sync-metric="language_practice_nav"
                                onClick={() => navigate('/speaking-hub')} 
                                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left cursor-pointer"
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-[#e3f2fd]">
                                    <img src="/speaking_practice.png" alt="Practice a Language" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-[#4285F4]">Practice a Language</p>
                                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[#4285F4] group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all shadow-sm">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                            <div className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 text-left opacity-75 cursor-default">
                                <div className="aspect-[16/10] overflow-hidden bg-[#e3f2fd]">
                                    <img src="/discover_learn.png" alt="Discover & Learn" className="w-full h-full object-contain p-4" />
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-400">Discover & Learn</p>
                                    <span className="text-xs font-bold text-red-400">Coming soon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reward Reveal Modal Container */}
                {showRewardModal && (
                    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4 animate-fade-in backdrop-blur-xl">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center max-w-sm w-full relative overflow-hidden animate-pop-in border-b-8 border-yellow-500 shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500"></div>
                            <div className="text-6xl my-4 animate-bounce">🎁✨</div>
                            <h2 className="text-2xl font-black text-yellow-500 dark:text-yellow-400 mb-2 uppercase tracking-tighter">Moroccan Reward!</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-6 leading-relaxed">
                                You completed today's daily adventure and unlocked the treasure chest:
                            </p>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-950 mb-6 text-left space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⭐</span>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">+50 XP Stars</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Added to your main balance</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">💧</span>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">Streak Freeze Booster</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Unlocked in the bank booster store</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                id="btn-claim-rewards"
                                data-agent-track="claim_rewards_click"
                                data-sync-metric="modal_dismiss"
                                onClick={() => {
                                    setShowRewardModal(false);
                                    setChestState('closed');
                                }}
                                className="w-full bg-yellow-500 text-white font-black py-3.5 px-6 rounded-xl text-base uppercase border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-2 active:translate-y-1 transition-all shadow-xl bubbly-btn cursor-pointer"
                            >
                                CLAIM REWARDS
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-transparent overflow-x-hidden relative">
            <div className="max-w-5xl mx-auto space-y-12 relative z-10 p-4 md:p-8">

                {/* Hero Greeting Section */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-10">
                    <div className="relative group shrink-0">
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#34A853]/10 dark:bg-[#4285F4]/10 blur-xl rounded-full"></div>
                        <div className="transform transition-all group-hover:scale-105 duration-500 cursor-pointer drop-shadow-md">
                            <Mascot />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4 max-w-lg">
                        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
                                {t('welcome_back').replace('!', '')}, <span className="text-[#4285F4]">{userName}!</span>
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                {t('welcome_message')} {t('magic_found')}
                            </p>
                            {streak >= 3 && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-xl animate-pulse">
                                    <span className="text-sm">🔥</span>
                                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none">
                                        Streak Multiplier: {streak >= 5 ? '1.5x XP Active!' : '1.2x XP Active!'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto md:mx-0">
                            <FloatingStat icon="🔥" value={`${streak} ${streak > 0 ? 'Days' : 'Day'}`} label={t('day_streak')} color="border-[#EA4335]" />
                            <FloatingStat icon="⭐" value={xp.toLocaleString()} label={t('total_xp_label')} color="border-[#FBBC05]" />
                        </div>
                    </div>
                </div>

                {renderLastCourseVisited()}

                {/* Adventure Path Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Learn Card */}
                    <button
                        id="card-guest-learn"
                        data-agent-track="guest_learn_select"
                        data-sync-metric="curriculum_onboarding"
                        onClick={goToLearn}
                        className="group relative bg-[#4285F4] rounded-3xl p-8 text-center transition-all transform hover:-translate-y-2 hover:shadow-xl overflow-hidden cursor-pointer"
                    >
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20 transition-transform group-hover:scale-110 shadow-sm relative z-10">
                            <span className="text-3xl text-white">🚀</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10">
                            {t('learn')}
                        </h2>
                        <p className="text-sm text-blue-100 font-medium mb-8 leading-snug relative z-10">
                            {t('learn_adventure_desc')}
                        </p>
                        <div className="w-full py-4 bg-white text-[#4285F4] rounded-full font-bold text-sm shadow-md group-hover:bg-slate-50 transition-colors uppercase tracking-wide relative z-10">
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
                            <span className="text-3xl">🧩</span>
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
                    <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                        {t('suggested_courses') || 'Suggested Courses'}
                    </h2>
                    {renderSuggestedCourses()}
                </div>

                {/* Quests and Tip Footer Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 items-stretch">
                    {renderDailyQuestsHUD()}
                    
                    <div className="flex flex-col justify-between gap-6">
                        <div className="bg-[#FBBC05]/10 dark:bg-[#FBBC05]/5 p-6 rounded-3xl border border-[#FBBC05]/20 flex items-center space-x-6 shadow-sm transition-all hover:shadow-md group h-full">
                            <div className="bg-[#FBBC05] text-white w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">💡</div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed">
                                "{t('did_you_know')} {t('code_fact')}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reward Reveal Modal Container */}
            {showRewardModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4 animate-fade-in backdrop-blur-xl">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center max-w-sm w-full relative overflow-hidden animate-pop-in border-b-8 border-yellow-500 shadow-2xl">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500"></div>
                        <div className="text-6xl my-4 animate-bounce">🎁✨</div>
                        <h2 className="text-2xl font-black text-yellow-500 dark:text-yellow-400 mb-2 uppercase tracking-tighter">Moroccan Reward!</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-6 leading-relaxed">
                            You completed today's daily adventure and unlocked the treasure chest:
                        </p>
                        
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-950 mb-6 text-left space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">⭐</span>
                                <div className="text-left">
                                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">+50 XP Stars</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Added to your main balance</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">💧</span>
                                <div className="text-left">
                                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">Streak Freeze Booster</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Unlocked in the bank booster store</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowRewardModal(false);
                                setChestState('closed');
                            }}
                            className="w-full bg-yellow-500 text-white font-black py-3.5 px-6 rounded-xl text-base uppercase border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-2 active:translate-y-1 transition-all shadow-xl bubbly-btn cursor-pointer"
                        >
                            CLAIM REWARDS
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeHubScreen;
