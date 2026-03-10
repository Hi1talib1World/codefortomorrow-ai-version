
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardView } from '../Dashboard';
import Mascot from '../Mascot';
import { useNavigate } from 'react-router-dom';

interface HomeHubScreenProps {
    onNavigate: (view: DashboardView) => void;
    userName?: string;
    role?: 'teacher' | 'student' | null;
    currentPath?: string | null;
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

const HomeHubScreen: React.FC<HomeHubScreenProps> = ({ onNavigate, userName = "Coder", role, currentPath }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const goToLearn = () => {
        if (currentPath) {
            navigate(`/dashboard/learn/${currentPath}`);
        } else {
            onNavigate('learn');
        }
    };

    if (role === 'student') {
        return (
            <div className="min-h-full w-full bg-transparent overflow-x-hidden relative p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-10 relative z-10">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3 tracking-tight">
                        <span>👋</span> Hello, {userName}!
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Brain Training Section */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">{t('brain_training')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => navigate('/brain-training')} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left">
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
                                <button onClick={() => navigate('/brain-training')} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left">
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

                        {/* MentalUP Section */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">MentalUP - Educational Brain Games</h2>
                            <button className="group w-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left">
                                <div className="aspect-[16/10] lg:aspect-square bg-[#4285F4] flex items-center justify-center p-8 relative overflow-hidden">
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

                    {/* Math Games Section */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">Math Games</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left">
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
                            <button className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 text-left">
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
                        </div>
                    </div>
                </div>
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
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto md:mx-0">
                            <FloatingStat icon="🔥" value="7" label={t('day_streak')} color="border-[#EA4335]" />
                            <FloatingStat icon="⭐" value="1,240" label={t('total_xp_label')} color="border-[#FBBC05]" />
                        </div>
                    </div>
                </div>

                {/* Adventure Path Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    {/* Learn Card */}
                    <button
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

                {/* Daily Tip Footer */}
                <div className="bg-[#FBBC05]/10 dark:bg-[#FBBC05]/5 p-6 rounded-3xl border border-[#FBBC05]/20 flex items-center space-x-6 max-w-2xl mx-auto shadow-sm transition-all hover:shadow-md group mt-12">
                    <div className="bg-[#FBBC05] text-white w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">💡</div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed">
                        "{t('did_you_know')} {t('code_fact')}"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomeHubScreen;
