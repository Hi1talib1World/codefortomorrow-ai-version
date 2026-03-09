import React, { useState, useEffect } from 'react';
import { Lesson, ProgrammingPath, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import Mascot from '../Mascot';
import { Sparkles } from 'lucide-react';

interface MathGameScreenProps {
    lesson: Lesson;
    onComplete: (lessonId: number, xpGained: number, score?: number) => void;
    onExit: () => void;
    path: ProgrammingPath['id'];
    currentUser: User;
}

const SuccessModal: React.FC<{ lesson: Lesson, onContinue: () => void }> = ({ lesson, onContinue }) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-fade-in backdrop-blur-xl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center max-w-sm w-full relative overflow-hidden animate-pop-in border-b-8 border-green-600 shadow-2xl">
                <div className="w-24 h-24 mx-auto mb-4 relative hover:scale-110 transition-transform cursor-pointer group">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 group-hover:opacity-50 animate-pulse"></div>
                    <Mascot />
                </div>
                <h2 className="text-2xl font-black text-green-500 mb-2 uppercase tracking-tighter italic">{t('genius' as any)}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-base mb-6">{t('mission_complete_msg' as any)} <br /> <span className="text-yellow-500 font-black">+{lesson.xp} {t('star_xp_units' as any)}</span></p>
                <button
                    onClick={onContinue}
                    className="w-full bg-green-500 text-white font-black py-3 px-6 rounded-xl text-base uppercase border-b-4 border-green-700 hover:bg-green-400 active:border-b-2 active:translate-y-1 transition-all shadow-xl bubbly-btn"
                >
                    {t('next_adventure' as any)}
                </button>
            </div>
        </div>
    );
};

const MathGameScreen: React.FC<MathGameScreenProps> = ({ lesson, onComplete, onExit, currentUser }) => {
    const { t, language } = useLanguage();
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [mascotMood, setMascotMood] = useState('idle');

    // Hardcode some specific validation logic based on the lesson
    // In a real scenario, this could be driven by lesson.expectedOutput or a quiz property.
    const validateAnswer = () => {
        let expected = '';
        const descKey = lesson.challengeDescriptionKey;

        // Using English text logic since this is a demo to simulate the Math Game functionality
        if (descKey === 'math_challenge_1') expected = '8'; // What is 5 + 3?
        if (descKey === 'math_challenge_2') expected = '6'; // What is 10 - 4?
        if (descKey === 'math_challenge_3') expected = '10'; // What number comes next? 2, 4, 6, 8, ...
        if (descKey === 'math_challenge_4') expected = '20'; // Solve this: (5 * 2) + 10

        const correct = answer.trim() === expected;
        setIsCorrect(correct);

        if (correct) {
            setMascotMood('happy');
            setTimeout(() => setShowSuccessModal(true), 1200);
        } else {
            setMascotMood('thinking');
        }
    };

    const handleComplete = () => {
        onComplete(lesson.id, lesson.xp, 100);
    };

    const isRTL = language === 'ar';

    return (
        <div className={`fixed inset-0 bg-brand-50 dark:bg-slate-900 font-sans flex flex-col z-50 overflow-hidden select-none transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
            {showSuccessModal && <SuccessModal lesson={lesson} onContinue={handleComplete} />}

            <header className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 border-b-4 border-brand-100 dark:border-slate-700 shadow-lg">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all border-b-2 border-slate-300 active:border-b-0 active:translate-y-1 bubbly-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex-grow mx-6 flex items-center gap-4">
                        <div className="flex-grow bg-brand-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-inner relative">
                            <div
                                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-green-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                style={{ width: isCorrect ? '100%' : '30%' }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border-b-2 border-yellow-500 shadow-md font-black text-yellow-600 text-sm">
                        ⭐ {currentUser?.progress?.xp || 0}
                    </div>
                </div>
            </header>

            <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-4 border-brand-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full text-center relative overflow-hidden">
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-20`}></div>

                    <div className="bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 px-4 py-1.5 rounded-full inline-flex font-black text-sm uppercase tracking-widest mb-6">
                        {t(lesson.titleKey as any)}
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-black text-slate-800 dark:text-white mt-4 mb-8">
                        {t(lesson.challengeDescriptionKey as any)}
                    </h2>

                    <div className="relative w-64 mx-auto mb-8">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="?"
                            className={`w-full text-5xl font-black text-center border-b-8 border-2 border-slate-200 dark:border-slate-600 rounded-2xl p-6 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:border-brand-500 dark:text-white transition-all
                    ${isCorrect === false ? 'border-red-500 animate-shake' : ''}
                    ${isCorrect === true ? 'border-green-500 bg-green-50 dark:bg-green-900/50' : ''}
                  `}
                            autoFocus
                        />
                    </div>

                    <button
                        onClick={validateAnswer}
                        className="w-full max-w-xs bg-brand-500 text-white font-black py-4 rounded-2xl text-xl uppercase border-b-8 border-brand-700 hover:bg-brand-400 active:border-b-2 active:translate-y-2 transition-all bubbly-btn shadow-xl mx-auto block"
                    >
                        {t('check_answer' as any) || 'Check Answer'}
                    </button>
                </div>

                <div className="relative w-32 h-32">
                    <Mascot />
                </div>
            </div>
        </div>
    );
};

export default MathGameScreen;
