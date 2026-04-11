import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BrainTrainingScreen() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [completedIds, setCompletedIds] = useState<number[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('completedBrainChallenges');
            if (stored) {
                setCompletedIds(JSON.parse(stored));
            }
        } catch (e) {}
    }, []);

    // Generate 100 challenges
    const challenges = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `${t('brain_training_challenges')} ${i + 1}`,
        unlocked: true,
    }));

    const features = [
        { emoji: '💯', key: 'brain_training_unlimited_access' as const },
        { emoji: '💪', key: 'brain_training_unlimited_workouts' as const },
        { emoji: '📊', key: 'brain_training_strengths' as const },
        { emoji: '🤖', key: 'brain_training_ai_tips' as const },
        { emoji: '🎯', key: 'brain_training_new_puzzles' as const },
        { emoji: '✨', key: 'brain_training_premium' as const },
    ];

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors group px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm">{t('brain_training_back')}</span>
                </button>
            </div>

            {/* Hero Banner */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 shadow-2xl shadow-violet-500/20">
                    <div className="flex flex-col lg:flex-row items-stretch">

                        {/* Left – Info Cards */}
                        <div className="flex-1 p-6 md:p-8 space-y-4">
                            {/* Challenges Card */}
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                    🏆
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm md:text-base leading-snug">
                                        <span className="font-black underline decoration-2 underline-offset-2">{t('brain_training_challenges')}</span> {t('brain_training_challenges_info')}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
                                    <span className="text-lg">→</span>
                                </div>
                            </div>

                            {/* Brain Workouts Card */}
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                    🧠
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm md:text-base leading-snug">
                                        <span className="font-black underline decoration-2 underline-offset-2">{t('brain_training_workouts')}</span> {t('brain_training_workouts_info')}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
                                    <span className="text-lg">→</span>
                                </div>
                            </div>
                        </div>

                        {/* Right – Premium Upsell */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10">
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">
                                {t('brain_training_next_level')}
                            </h2>
                            <ul className="space-y-3 mb-8">
                                {features.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-white/90 text-sm md:text-base">
                                        <span className="text-lg shrink-0">{item.emoji}</span>
                                        <span>{t(item.key)}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="self-start px-8 py-3 bg-white text-violet-700 font-black rounded-2xl text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:bg-violet-50 transition-all transform hover:scale-105 active:scale-95">
                                {t('brain_training_unlock')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenges Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                        {t('brain_training_all_challenges')} <span className="text-slate-400 dark:text-slate-500">({challenges.length})</span>
                    </h3>
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
                    {t('brain_training_free_tries')}: <span className="text-violet-600 dark:text-violet-400">1</span>
                </p>

                {/* Challenge Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {challenges.map((challenge) => {
                        const isCompleted = completedIds.includes(challenge.id);
                        return (
                        <div
                            key={challenge.id}
                            onClick={() => navigate(`/brain-training/${challenge.id}`)}
                            className={`group rounded-2xl p-5 transition-all cursor-pointer ${
                                isCompleted
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-500 shadow-lg shadow-emerald-200/50'
                                : challenge.unlocked
                                ? 'bg-violet-100 dark:bg-violet-900/30 border-2 border-violet-400 dark:border-violet-500 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600'
                                }`}
                        >
                            <p className={`text-sm font-black mb-1 ${
                                isCompleted ? 'text-emerald-700 dark:text-emerald-300' :
                                challenge.unlocked
                                ? 'text-violet-700 dark:text-violet-300'
                                : 'text-slate-400 dark:text-slate-500'
                                }`}>
                                {challenge.title}
                            </p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                                5 {t('brain_training_questions')}
                            </p>
                            <div
                                className={`w-full h-10 rounded-xl flex items-center justify-center transition-all ${
                                    isCompleted ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md' :
                                    challenge.unlocked
                                    ? 'bg-violet-500 hover:bg-violet-600 shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg
                                        className={`w-5 h-5 ${challenge.unlocked
                                            ? 'text-white'
                                            : 'text-slate-400 dark:text-slate-500 group-hover:text-violet-500 dark:group-hover:text-violet-400'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
}
