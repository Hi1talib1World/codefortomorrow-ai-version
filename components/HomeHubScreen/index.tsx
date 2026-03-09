
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardView } from '../Dashboard';
import Mascot from '../Mascot';
import { useNavigate } from 'react-router-dom';

interface HomeHubScreenProps {
    onNavigate: (view: DashboardView) => void;
    userName?: string;
    role?: 'teacher' | 'student' | null;
}

const FloatingStat: React.FC<{ icon: string, value: string | number, label: string, color: string }> = ({ icon, value, label, color }) => (
    <div className={`bg-white dark:bg-slate-800 p-3 rounded-2xl border-b-4 ${color} shadow-lg flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 cursor-default group kid-card`}>
        <span className="text-xl animate-bounce drop-shadow-sm group-hover:animate-pulse">{icon}</span>
        <div className="text-left">
            <p className="text-base font-black text-slate-800 dark:text-white leading-none tracking-tighter italic">{value}</p>
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
        </div>
    </div>
);

const HomeHubScreen: React.FC<HomeHubScreenProps> = ({ onNavigate, userName = "Coder", role }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    if (role === 'student') {
        return (
            <div className="min-h-full w-full bg-transparent overflow-x-hidden relative p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-10 animate-pop-in relative z-10">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <span>👋</span> Hello, {userName}!
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Brain Training Section */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">Brain Training</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => navigate('/brain-training')} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 text-left">
                                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                        <img src="/brain_training_challenges.png" alt="Challenges" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-rose-400 uppercase">Brain Training</p>
                                            <p className="text-sm font-black text-brand-500 dark:text-brand-400">Challenges</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-brand-100 dark:border-slate-700 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                                            <span className="text-lg">→</span>
                                        </div>
                                    </div>
                                </button>
                                <button onClick={() => navigate('/brain-training')} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 text-left">
                                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                        <img src="/brain_training_workouts.png" alt="Workouts" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-rose-400 uppercase">Brain Training</p>
                                            <p className="text-sm font-black text-brand-500 dark:text-brand-400">Workouts</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-brand-100 dark:border-slate-700 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                                            <span className="text-lg">→</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* MentalUP Section */}
                        <div className="space-y-4">
                            <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">MentalUP - Educational Brain Games</h2>
                            <button className="group w-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 text-left">
                                <div className="aspect-[16/10] lg:aspect-square bg-brand-700 flex items-center justify-center p-8 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                    <div className="text-center space-y-4 relative z-10">
                                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-12 transition-transform">🧠</div>
                                        <p className="text-xl font-black text-white tracking-widest uppercase">MENTALUP</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-black text-brand-500 dark:text-brand-400">Play MentalUP</p>
                                    <div className="w-8 h-8 rounded-full border-2 border-brand-100 dark:border-slate-700 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                                        <span className="text-sm">↗</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Math Games Section */}
                    <div className="space-y-4">
                        <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">Math Games</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 text-left">
                                <div className="aspect-[16/10] bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center p-8">
                                    <div className="grid grid-cols-2 gap-2 transform group-hover:scale-110 transition-transform">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black">＋</div>
                                        <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white font-black">－</div>
                                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-black">×</div>
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-black">＝</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-black text-brand-500 dark:text-brand-400">Pick & Play</p>
                                    <div className="w-8 h-8 rounded-full border-2 border-brand-100 dark:border-slate-700 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                            <button className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 text-left">
                                <div className="aspect-[16/10] bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                                    <div className="text-6xl transform group-hover:rotate-12 transition-transform">🎮</div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <p className="text-sm font-black text-brand-500 dark:text-brand-400">Quick Play</p>
                                    <div className="w-8 h-8 rounded-full border-2 border-brand-100 dark:border-slate-700 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-10 left-5 opacity-20 animate-float pointer-events-none text-4xl">☁️</div>
                <div className="absolute top-20 right-10 opacity-20 animate-float-delayed pointer-events-none text-4xl">☁️</div>
                <div className="absolute bottom-20 left-1/4 opacity-10 animate-pulse pointer-events-none text-3xl">⭐</div>
                <div className="absolute top-1/3 right-5 opacity-10 animate-pulse pointer-events-none text-3xl">✨</div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        50% { transform: translateY(-15px) translateX(10px); }
                    }
                    @keyframes float-delayed {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        50% { transform: translateY(-10px) translateX(-10px); }
                    }
                    .animate-float { animation: float 8s ease-in-out infinite; }
                    .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-transparent overflow-x-hidden relative">

            {/* Animated Background Elements */}
            <div className="absolute top-10 left-5 opacity-20 animate-float pointer-events-none text-4xl">☁️</div>
            <div className="absolute top-20 right-10 opacity-20 animate-float-delayed pointer-events-none text-4xl">☁️</div>
            <div className="absolute bottom-20 left-1/4 opacity-10 animate-pulse pointer-events-none text-3xl">⭐</div>
            <div className="absolute top-1/3 right-5 opacity-10 animate-pulse pointer-events-none text-3xl">✨</div>

            <div className="max-w-5xl mx-auto space-y-12 relative z-10">

                {/* Hero Greeting Section */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-10">
                    <div className="relative group shrink-0">
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-green-500/20 dark:bg-blue-500/10 blur-xl rounded-full"></div>
                        <div className="transform scale-110 transition-all group-hover:scale-125 duration-500 cursor-pointer drop-shadow-2xl">
                            <Mascot />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4 max-w-lg">
                        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl rounded-bl-none shadow-xl border-2 border-brand-100 dark:border-slate-700 animate-pop-in">
                            <div className="absolute -bottom-3 left-0 w-6 h-6 bg-white dark:bg-slate-800 border-l-2 border-b-2 border-brand-100 dark:border-slate-700 rotate-45"></div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight italic tracking-tight uppercase">
                                {t('welcome_back').replace('!', '')}, <span className="text-brand-500">{userName}!</span>
                            </h1>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {t('welcome_message')} {t('magic_found')}
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto md:mx-0">
                            <FloatingStat icon="🔥" value="7" label={t('day_streak')} color="border-orange-500" />
                            <FloatingStat icon="⭐" value="1,240" label={t('total_xp_label')} color="border-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Adventure Path Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    {/* Learn Card */}
                    <button
                        onClick={() => onNavigate('learn')}
                        className="group relative bg-white dark:bg-slate-800 border-b-[8px] border-brand-600 dark:border-brand-900 rounded-2xl p-6 text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-2 overflow-hidden kid-card bubbly-btn"
                    >
                        <div className="absolute -top-6 -right-6 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="text-[8rem]">📖</span>
                        </div>
                        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:rotate-12 group-hover:scale-105 shadow-inner">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase italic tracking-tighter">
                            {t('learn')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-6 leading-snug">
                            {t('learn_adventure_desc')}
                        </p>
                        <div className="py-3 px-6 bg-brand-500 text-white rounded-xl font-black text-base shadow-lg group-hover:bg-brand-400 transition-colors uppercase tracking-widest border-b-4 border-brand-700">
                            {t('start')}
                        </div>
                    </button>

                    {/* Create Card */}
                    <button
                        onClick={() => onNavigate('creations')}
                        className="group relative bg-white dark:bg-slate-800 border-b-[8px] border-brand-600 dark:border-brand-900 rounded-2xl p-6 text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-2 overflow-hidden kid-card bubbly-btn"
                    >
                        <div className="absolute -top-6 -right-6 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="text-[8rem]">🧪</span>
                        </div>
                        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:-rotate-12 group-hover:scale-105 shadow-inner">
                            <span className="text-4xl">🎨</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase italic tracking-tighter">
                            {t('creations')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-6 leading-snug">
                            {t('create_adventure_desc')}
                        </p>
                        <div className="py-3 px-6 bg-brand-600 text-white rounded-xl font-black text-base shadow-lg group-hover:bg-brand-500 transition-colors uppercase tracking-widest border-b-4 border-brand-800">
                            {t('create')}
                        </div>
                    </button>

                    {/* Brain Training Card */}
                    <button
                        onClick={() => navigate('/brain-training')}
                        className="group relative bg-white dark:bg-slate-800 border-b-[8px] border-violet-600 dark:border-violet-900 rounded-2xl p-6 text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-2 overflow-hidden kid-card bubbly-btn"
                    >
                        <div className="absolute -top-6 -right-6 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="text-[8rem]">🧠</span>
                        </div>
                        <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:-rotate-12 group-hover:scale-105 shadow-inner">
                            <span className="text-4xl">🧩</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase italic tracking-tighter">
                            Brain Training
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-6 leading-snug">
                            Train your mind with fun challenges!
                        </p>
                        <div className="py-3 px-6 bg-violet-600 text-white rounded-xl font-black text-base shadow-lg group-hover:bg-violet-500 transition-colors uppercase tracking-widest border-b-4 border-violet-800">
                            Play
                        </div>
                    </button>

                </div>

                {/* Daily Tip Footer */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-4 rounded-2xl border-2 border-yellow-200 dark:border-slate-700 flex items-center space-x-4 max-w-2xl mx-auto shadow-lg transition-all hover:shadow-xl group">
                    <div className="bg-yellow-400 text-white w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl shadow-md group-hover:animate-bounce transition-transform">💡</div>
                    <p className="text-slate-700 dark:text-slate-300 font-black italic text-sm leading-snug">
                        "{t('did_you_know')} {t('code_fact')}"
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(10px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-10px) translateX(-10px); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default HomeHubScreen;
