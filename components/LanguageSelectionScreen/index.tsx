import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';
import { Globe, ChevronRight } from 'lucide-react';

const LanguageSelectionScreen: React.FC = () => {
    const { setLanguage, completeLanguageSelection } = useLanguage();
    const navigate = useNavigate();

    const handleSelectLanguage = (lang: Language) => {
        setLanguage(lang);
        completeLanguageSelection();
        navigate('/welcome');
    };

    const languages = [
        { code: Language.EN, name: 'English', flag: '🇬🇧', welcomeMsg: 'Welcome to' },
        { code: Language.FR, name: 'Français', flag: '🇫🇷', welcomeMsg: 'Bienvenue à' },
        { code: Language.AR, name: 'العربية', flag: '🇲🇦', welcomeMsg: 'مرحباً بكم في' }
    ];

    return (
        <div className="min-h-screen bg-brand-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/50 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center transform transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-brand-500/20">
                <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Globe className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Choose Language</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Please select your preferred language to continue</p>

                <div className="space-y-4">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelectLanguage(lang.code)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-300 group shadow-sm hover:shadow active:scale-95"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{lang.flag}</span>
                                <span className="font-bold text-lg text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">{lang.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelectionScreen;
