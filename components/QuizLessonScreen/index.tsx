/**
 * QuizLessonScreen.tsx
 * ---------------------
 * A quiz-based lesson screen that replaces the code editor for theory lessons.
 *
 * Flow:
 *  1. READING PHASE  — Student reads the concept explanation, learning objectives, and a pro tip.
 *  2. QUIZ PHASE     — Student answers multiple-choice questions (4 options each).
 *  3. DONE           — A success overlay appears and calls onComplete() to save progress.
 *
 * This component is automatically rendered by App.tsx when a lesson has a `questions` array.
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

// ─── SUCCESS OVERLAY ────────────────────────────────────────────────────────
// Shown after the last question is answered.
// SuccessModal is defined inline in LessonScreen and not exported, so we have
// our own lightweight version here.
const SuccessOverlay: React.FC<{ lesson: Lesson; onContinue: () => void }> = ({ lesson, onContinue }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl flex flex-col items-center gap-4 text-center"
        >
            <div className="text-7xl animate-bounce"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Great Job!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                You completed this lesson and earned <span className="text-[#FBBC05] font-bold">+{lesson.xp} XP</span>!
            </p>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full py-3 rounded-full bg-[#2E2FCE] hover:bg-[#2E2FCE] text-white font-bold text-base tracking-wide transition-colors shadow-sm"
            >
                Continue →
            </motion.button>
        </motion.div>
    </div>
);

// ─── PROP TYPES ──────────────────────────────────────────────────────────────
interface QuizLessonScreenProps {
    lesson: Lesson;
    /** Called when the student clicks "Continue" on the success overlay. Passes score (0-100). */
    onComplete: (lessonId: number, xp: number, score: number) => void;
    /** Called when the student clicks the × button to exit without completing. */
    onExit: () => void;
    currentUser: User | null;
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
/** The two main UI states: reading the theory, or answering the quiz. */
type Phase = 'reading' | 'quiz' | 'done';
/** State of the currently selected answer option. */
type AnswerState = 'idle' | 'correct' | 'wrong';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
/** Tailwind classes for the difficulty badge based on difficulty level. */
const DIFFICULTY_COLORS: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    Expert: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
};

/** Letter labels shown on the option buttons before an answer is revealed. */
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const QuizLessonScreen: React.FC<QuizLessonScreenProps> = ({ lesson, onComplete, onExit, currentUser }) => {
    const { t } = useLanguage();

    // ── State ────────────────────────────────────────────────────────────────
    /** Controls which UI "step" is visible: reading the article, or taking the quiz. */
    const [phase, setPhase] = useState<Phase>('reading');
    /** Index (0-based) of the current question being displayed. */
    const [questionIndex, setQuestionIndex] = useState(0);
    /** Index of the option the student clicked, or null if not yet answered. */
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    /** Whether the last selected answer was correct, wrong, or not yet answered. */
    const [answerState, setAnswerState] = useState<AnswerState>('idle');
    /** Running total of correctly answered questions in this session. */
    const [correctCount, setCorrectCount] = useState(0);
    /** Whether to show the final completion overlay. */
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // ── Derived values ───────────────────────────────────────────────────────
    const questions = lesson.questions || [];
    const currentQuestion = questions[questionIndex];
    const totalQuestions = questions.length;

    // ─── HANDLERS ────────────────────────────────────────────────────────────

    /** Moves the UI from the reading article to the quiz questions. */
    const handleStartQuiz = useCallback(() => {

        setPhase('quiz');
    }, []);

    const handleSelectOption = useCallback((idx: number) => {
        if (answerState !== 'idle') return;
        setSelectedIndex(idx);
        const isCorrect = idx === currentQuestion?.correctIndex;
        setAnswerState(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) setCorrectCount(c => c + 1);
    }, [answerState, currentQuestion]);

    const handleNext = useCallback(() => {
        if (questionIndex < totalQuestions - 1) {
            setQuestionIndex(q => q + 1);
            setSelectedIndex(null);
            setAnswerState('idle');
        } else {
            setPhase('done');
            const score = Math.round(correctCount / totalQuestions * 100);
            setTimeout(() => setShowSuccessModal(true), 600);
        }
    }, [questionIndex, totalQuestions, correctCount, answerState]);

    const handleComplete = useCallback(() => {
        const score = Math.round(correctCount / totalQuestions * 100);
        onComplete(lesson.id, lesson.xp, score);
    }, [correctCount, totalQuestions, lesson, onComplete]);

    // --- META BADGES ---
    const MetaBadges = (
        <div className="flex flex-wrap items-center gap-2">
            {lesson.difficulty && (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-transparent ${DIFFICULTY_COLORS[lesson.difficulty] || ''}`}>
                    {lesson.difficulty}
                </span>
            )}
            {lesson.estimatedMinutes && (
                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-600">
                    ️ {lesson.estimatedMinutes} min
                </span>
            )}
            <span className="px-2 py-1 rounded-md bg-[#FBBC05]/10 dark:bg-[#FBBC05]/20 text-[#F29900] dark:text-[#fde293] text-[10px] font-bold flex items-center gap-1 border border-[#FBBC05]/30">
                 {lesson.xp} XP
            </span>
            {lesson.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-[#2E2FCE]/10 dark:bg-[#2E2FCE]/20 text-[#2E2FCE] dark:text-[#a3aaeb] text-[10px] font-bold tracking-wide border border-[#2E2FCE]/30">
                    #{tag}
                </span>
            ))}
        </div>
    );

    // --- READING PHASE ---
    const ReadingPhase = (
        <motion.div
            key="reading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-5 pb-6"
        >
            {/* Concept */}
            {lesson.explanationKey && (
                <div className="bg-[#2E2FCE]/5 dark:bg-[#2E2FCE]/10 p-6 rounded-3xl border border-[#2E2FCE]/20 dark:border-[#2E2FCE]/30 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-[#2E2FCE]/10 dark:text-[#2E2FCE]/20 text-7xl transform rotate-12 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-[#2E2FCE] dark:text-[#a3aaeb] uppercase tracking-wide mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Concept
                        </h3>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                            {t(lesson.explanationKey as any)}
                        </p>
                    </div>
                </div>
            )}

            {/* Objectives */}
            {lesson.objectivesKey && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                         Learning Objectives
                    </h3>
                    <ul className="space-y-3">
                        {((t(lesson.objectivesKey as any) as string) || '').split('|').map((obj, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-[#34A853]/10 dark:bg-[#34A853]/20 text-[#2e9347] dark:text-[#a8dab5] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                    {i + 1}
                                </div>
                                <span className="leading-snug">{obj}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Pro Tip */}
            {lesson.proTipKey && (
                <div className="bg-[#FBBC05]/10 dark:bg-[#FBBC05]/5 border-l-4 border-[#F29900] p-5 rounded-r-2xl">
                    <h3 className="text-xs font-bold text-[#F29900] dark:text-[#fde293] uppercase tracking-wide mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Pro Tip
                    </h3>
                    <p className="text-sm font-medium text-[#c07c00] dark:text-[#fde293]/80 leading-relaxed">{t(lesson.proTipKey as any)}</p>
                </div>
            )}

            {/* CTA */}
            {totalQuestions > 0 ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartQuiz}
                    className="w-full py-4 rounded-full bg-[#2E2FCE] hover:bg-[#2E2FCE] text-white font-bold text-sm tracking-wide shadow-sm transition-colors flex items-center justify-center gap-3 mt-4"
                >
                    <span></span> Take the Quiz!
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(lesson.id, lesson.xp, 100)}
                    className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-base uppercase tracking-widest shadow-lg shadow-green-500/30 transition-colors flex items-center justify-center gap-3"
                >
                    <span></span> Complete Lesson
                </motion.button>
            )}
        </motion.div>
    );

    // --- QUIZ PHASE ---
    const QuizPhase = currentQuestion ? (
        <motion.div
            key={`q-${questionIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col gap-5"
        >
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
                <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#2E2FCE] rounded-full"
                        initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
                        animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide shrink-0">
                    {questionIndex + 1} / {totalQuestions}
                </span>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#2E2FCE]/10 dark:bg-slate-700 flex items-center justify-center text-[#2E2FCE] dark:text-[#a3aaeb] font-bold text-sm mb-4 border border-[#2E2FCE]/20">Q</div>
                <p className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
                    {t(currentQuestion.questionKey as any)}
                </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
                {currentQuestion.optionKeys.map((optKey, idx) => {
                    const isSelected = selectedIndex === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const revealed = answerState !== 'idle';

                    let bg = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#2E2FCE]/40 hover:bg-[#2E2FCE]/5 dark:hover:border-[#2E2FCE]/40 dark:hover:bg-slate-700';
                    if (revealed && isCorrect) bg = 'bg-[#34A853]/10 dark:bg-[#34A853]/20 border-[#34A853]/40 dark:border-[#34A853]/40';
                    else if (revealed && isSelected && !isCorrect) bg = 'bg-[#EA4335]/10 dark:bg-[#EA4335]/20 border-[#EA4335]/40 dark:border-[#EA4335]/40';

                    return (
                        <motion.button
                            key={idx}
                            whileHover={answerState === 'idle' ? { scale: 1.01 } : {}}
                            whileTap={answerState === 'idle' ? { scale: 0.98 } : {}}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${bg} ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border transition-colors
                ${revealed && isCorrect ? 'bg-[#34A853] border-[#34A853] text-white' : ''}
                ${revealed && isSelected && !isCorrect ? 'bg-[#EA4335] border-[#EA4335] text-white' : ''}
                ${!revealed ? 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700' : ''}
                ${revealed && !isCorrect && !isSelected ? 'border-slate-200 text-slate-400 bg-slate-50 dark:bg-slate-800 opacity-50' : ''}
              `}>
                                {revealed && isCorrect ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : revealed && isSelected && !isCorrect ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : OPTION_LABELS[idx]}
                            </div>
                            <span className={`text-sm font-medium transition-colors
                ${revealed && isCorrect ? 'text-[#2e9347] dark:text-[#a8dab5]' : ''}
                ${revealed && isSelected && !isCorrect ? 'text-[#c5221f] dark:text-[#f28b82]' : ''}
                ${!revealed ? 'text-slate-700 dark:text-slate-200' : ''}
                ${revealed && !isCorrect && !isSelected ? 'text-slate-400 opacity-50' : ''}
              `}>
                                {t(optKey as any)}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Feedback & Next */}
            <AnimatePresence>
                {answerState !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-2xl p-5 border ${answerState === 'correct'
                            ? 'bg-[#34A853]/10 dark:bg-[#34A853]/20 border-[#34A853]/20 dark:border-[#34A853]/30'
                            : 'bg-[#EA4335]/10 dark:bg-[#EA4335]/20 border-[#EA4335]/20 dark:border-[#EA4335]/30'
                            }`}
                    >
                        <p className={`text-sm font-bold mb-2 flex items-center gap-2 ${answerState === 'correct' ? 'text-[#2e9347] dark:text-[#a8dab5]' : 'text-[#c5221f] dark:text-[#f28b82]'}`}>
                            {answerState === 'correct' ? <><span className="text-xl"></span> Correct!</> : <><span className="text-xl"></span> Not quite!</>}
                        </p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t(currentQuestion.feedbackKey as any)}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {answerState !== 'idle' && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="w-full py-4 rounded-full bg-[#2E2FCE] hover:bg-[#2E2FCE] text-white font-bold text-sm tracking-wide shadow-sm transition-colors mt-4"
                >
                    {questionIndex < totalQuestions - 1 ? 'Next Question →' : ' Finish Quiz!'}
                </motion.button>
            )}
        </motion.div>
    ) : null;

    return (
        <div className="fixed inset-0 bg-brand-50 dark:bg-slate-900 flex flex-col z-50 overflow-hidden font-sans transition-colors">
            {showSuccessModal && <SuccessOverlay lesson={lesson} onContinue={handleComplete} />}

            {/* HEADER */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 px-4 py-4 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10 relative">
                <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
                    <button
                        onClick={onExit}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#EA4335] hover:bg-[#EA4335]/10 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {phase === 'reading' ? ' Read & Learn' : `Quiz · Q${questionIndex + 1}`}
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                            {t(lesson.titleKey as any)}
                        </span>
                    </div>

                    <div className="bg-[#FBBC05]/10 dark:bg-[#FBBC05]/20 px-3 py-1.5 rounded-full border border-[#FBBC05]/30 shadow-sm font-bold text-[#F29900] dark:text-[#fde293] text-sm flex items-center gap-1">
                         {currentUser?.progress?.xp || 0}
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex-grow overflow-y-auto bg-[#f8f9fa] dark:bg-slate-900">
                <div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-12">
                    {/* Title + badges */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-[#2E2FCE] text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                                {lesson.level}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                                {t(lesson.titleKey as any)}
                            </h2>
                        </div>
                        {MetaBadges}
                    </div>

                    {/* Challenge description */}
                    {lesson.challengeDescriptionKey && (
                        <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {t(lesson.challengeDescriptionKey as any)}
                        </p>
                    )}

                    {/* Phase content */}
                    <AnimatePresence mode="wait">
                        {phase === 'reading' && ReadingPhase}
                        {phase === 'quiz' && QuizPhase}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default QuizLessonScreen;
