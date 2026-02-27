
import React, { useState } from 'react';
import { Creation, QuizQuestion } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Mascot from './Mascot';

interface QuizPlayScreenProps {
    creation: Creation;
    onClose: () => void;
}

const QuizPlayScreen: React.FC<QuizPlayScreenProps> = ({ creation, onClose }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const questions = creation.data;
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    const handleCheck = () => {
        if (!selectedOption) return;
        
        const isCorrect = selectedOption === currentQuestion.answer;
        if (isCorrect) setScore(s => s + 1);
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    if (showResults) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col items-center justify-center p-6 text-center transition-colors">
                <div className="max-w-md w-full">
                    <div className="w-40 h-40 mx-auto mb-8 transform hover:scale-110 transition-transform">
                        <Mascot />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-4">
                        {score === questions.length ? t('perfect_score') : t('well_done')}
                    </h2>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-[2rem] p-8 border-b-8 border-slate-200 dark:border-slate-950 mb-8">
                        <p className="text-xl font-bold text-slate-600 dark:text-slate-300">{t('mission_accomplished')}</p>
                        <p className="text-4xl font-black text-blue-500 mt-2">{score} / {questions.length}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-4">{t('questions_correct')}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-full bg-green-500 text-white font-black py-4 rounded-2xl text-xl uppercase border-b-8 border-green-700 hover:bg-green-400 active:border-b-4 active:translate-y-1 transition-all"
                    >
                        {t('return_to_hub')}
                    </button>
                </div>
            </div>
        );
    }

    const isCorrect = selectedOption === currentQuestion.answer;

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col transition-colors">
            {/* Header / Progress */}
            <div className="p-4 md:p-8 flex items-center space-x-4 max-w-5xl mx-auto w-full">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex-grow h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-yellow-500 font-black text-lg flex items-center space-x-1.5">
                    <span>❤️</span>
                    <span>5</span>
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-grow flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
                <div className="w-full mb-10 animate-pop-in">
                    <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight mb-8">
                        {currentQuestion.question}
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((opt, idx) => {
                            const isSelected = selectedOption === opt;
                            let btnClasses = "w-full text-left p-5 rounded-2xl border-2 border-b-8 font-bold text-lg transition-all transform active:scale-95 ";
                            
                            if (isAnswered) {
                                if (opt === currentQuestion.answer) {
                                    btnClasses += "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                                } else if (isSelected) {
                                    btnClasses += "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300";
                                } else {
                                    btnClasses += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-50";
                                }
                            } else {
                                btnClasses += isSelected 
                                    ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" 
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-300";
                            }

                            return (
                                <button 
                                    key={idx} 
                                    onClick={() => !isAnswered && setSelectedOption(opt)}
                                    disabled={isAnswered}
                                    className={btnClasses}
                                >
                                    <span className="inline-block w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs mr-3 text-center leading-7 border border-slate-200 dark:border-slate-600">
                                        {idx + 1}
                                    </span>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className={`p-6 md:p-8 border-t-2 transition-colors ${
                !isAnswered ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 
                isCorrect ? 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800' : 
                'bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800'
            }`}>
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        {isAnswered && (
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg animate-bounce ${isCorrect ? 'bg-white text-green-500' : 'bg-white text-red-500'}`}>
                                {isCorrect ? '✓' : '✗'}
                            </div>
                        )}
                        <div>
                            {isAnswered ? (
                                <>
                                    <h3 className={`text-lg font-black uppercase tracking-tight ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                        {isCorrect ? t('amazing_feedback') : t('correct_answer_label')}
                                    </h3>
                                    <p className={`text-sm font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {isCorrect ? t('keep_up_magic') : currentQuestion.answer}
                                    </p>
                                </>
                            ) : (
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs hidden md:block">
                                    {t('choose_magic_spell')}
                                </p>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={isAnswered ? handleNext : handleCheck}
                        disabled={!selectedOption}
                        className={`w-full md:w-44 py-3.5 rounded-2xl font-black text-lg uppercase border-b-8 transition-all active:border-b-0 active:translate-y-1 ${
                            !isAnswered 
                                ? 'bg-blue-600 border-blue-800 text-white hover:bg-blue-500 disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-400' 
                                : isCorrect 
                                    ? 'bg-green-500 border-green-700 text-white hover:bg-green-400' 
                                    : 'bg-red-500 border-red-700 text-white hover:bg-red-400'
                        }`}
                    >
                        {isAnswered ? t('continue_button') : t('check_answer')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPlayScreen;
