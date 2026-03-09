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
            <div className="text-7xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Great Job!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                You completed this lesson and earned <span className="text-yellow-500 font-black">+{lesson.xp} XP</span>!
            </p>
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onContinue}
                className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-base uppercase tracking-widest transition-colors shadow-lg shadow-brand-500/30"
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
            const score = Math.round((correctCount + (answerState === 'correct' ? 1 : 0)) / totalQuestions * 100);
            setTimeout(() => setShowSuccessModal(true), 600);
        }
    }, [questionIndex, totalQuestions, correctCount, answerState]);

    const handleComplete = useCallback(() => {
        const finalCorrect = correctCount + (answerState === 'correct' ? 1 : 0);
        const score = Math.round(finalCorrect / totalQuestions * 100);
        onComplete(lesson.id, lesson.xp, score);
    }, [correctCount, answerState, totalQuestions, lesson, onComplete]);

    // --- META BADGES ---
    const MetaBadges = (
        <div className="flex flex-wrap items-center gap-2">
            {lesson.difficulty && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[lesson.difficulty] || ''}`}>
                    {lesson.difficulty}
                </span>
            )}
            {lesson.estimatedMinutes && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1">
                    ⏱️ {lesson.estimatedMinutes} min
                </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                ⭐ {lesson.xp} XP
            </span>
            {lesson.tags?.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[9px] font-bold uppercase tracking-wider">
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
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border-2 border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-indigo-100 dark:text-indigo-900/40 text-7xl transform rotate-12 group-hover:scale-110 transition-transform">💡</div>
                    <div className="relative z-10">
                        <h3 className="text-[11px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">Concept</h3>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                            {t(lesson.explanationKey as any)}
                        </p>
                    </div>
                </div>
            )}

            {/* Objectives */}
            {lesson.objectivesKey && (
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                        🎯 Learning Objectives
                    </h3>
                    <ul className="space-y-2">
                        {((t(lesson.objectivesKey as any) as string) || '').split('|').map((obj, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[9px] font-black shrink-0">
                                    {i + 1}
                                </div>
                                {obj}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Pro Tip */}
            {lesson.proTipKey && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 rounded-r-xl">
                    <h3 className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">💡 Pro Tip!</h3>
                    <p className="text-sm font-semibold text-amber-900/80 dark:text-amber-100/70">{t(lesson.proTipKey as any)}</p>
                </div>
            )}

            {/* CTA */}
            {totalQuestions > 0 ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartQuiz}
                    className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-base uppercase tracking-widest shadow-lg shadow-brand-500/30 transition-colors flex items-center justify-center gap-3"
                >
                    <span>🎓</span> Take the Quiz!
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(lesson.id, lesson.xp, 100)}
                    className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-base uppercase tracking-widest shadow-lg shadow-green-500/30 transition-colors flex items-center justify-center gap-3"
                >
                    <span>✅</span> Complete Lesson
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
            <div className="flex items-center gap-3">
                <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
                        initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
                        animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                    {questionIndex + 1} / {totalQuestions}
                </span>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 font-black text-sm mb-3">Q</div>
                <p className="text-base font-black text-slate-800 dark:text-white leading-snug">
                    {t(currentQuestion.questionKey as any)}
                </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
                {currentQuestion.optionKeys.map((optKey, idx) => {
                    const isSelected = selectedIndex === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const revealed = answerState !== 'idle';

                    let bg = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:bg-brand-50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20';
                    if (revealed && isCorrect) bg = 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-500';
                    else if (revealed && isSelected && !isCorrect) bg = 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-500';

                    return (
                        <motion.button
                            key={idx}
                            whileHover={answerState === 'idle' ? { scale: 1.01 } : {}}
                            whileTap={answerState === 'idle' ? { scale: 0.98 } : {}}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${bg} ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 transition-colors
                ${revealed && isCorrect ? 'bg-green-500 border-green-500 text-white' : ''}
                ${revealed && isSelected && !isCorrect ? 'bg-red-500 border-red-500 text-white' : ''}
                ${!revealed ? 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400' : ''}
                ${revealed && !isCorrect && !isSelected ? 'border-slate-200 text-slate-400' : ''}
              `}>
                                {revealed && isCorrect ? '✓' : revealed && isSelected && !isCorrect ? '✗' : OPTION_LABELS[idx]}
                            </div>
                            <span className={`text-sm font-bold transition-colors
                ${revealed && isCorrect ? 'text-green-700 dark:text-green-300' : ''}
                ${revealed && isSelected && !isCorrect ? 'text-red-700 dark:text-red-300' : ''}
                ${!revealed ? 'text-slate-700 dark:text-slate-200' : ''}
                ${revealed && !isCorrect && !isSelected ? 'text-slate-400' : ''}
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
                        className={`rounded-xl p-4 border-2 ${answerState === 'correct'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                            }`}
                    >
                        <p className={`text-sm font-black mb-1 ${answerState === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {answerState === 'correct' ? '🎉 Correct!' : '❌ Not quite!'}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
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
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-base uppercase tracking-widest shadow-lg shadow-brand-500/30 transition-colors"
                >
                    {questionIndex < totalQuestions - 1 ? 'Next Question →' : '🎓 Finish Quiz!'}
                </motion.button>
            )}
        </motion.div>
    ) : null;

    return (
        <div className="fixed inset-0 bg-brand-50 dark:bg-slate-900 flex flex-col z-50 overflow-hidden font-sans transition-colors">
            {showSuccessModal && <SuccessOverlay lesson={lesson} onContinue={handleComplete} />}

            {/* HEADER */}
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 px-4 py-3 border-b-4 border-brand-100 dark:border-slate-700 shadow-lg">
                <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
                    <button
                        onClick={onExit}
                        className="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-b-2 border-slate-300 active:border-b-0 active:translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {phase === 'reading' ? '📖 Read & Learn' : `Quiz · Q${questionIndex + 1}`}
                        </span>
                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            {t(lesson.titleKey as any)}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border-b-2 border-yellow-500 shadow-md font-black text-yellow-600 text-sm">
                        ⭐ {currentUser?.progress?.xp || 0}
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex-grow overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full px-4 pt-5">
                    {/* Title + badges */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-brand-500 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm shrink-0">
                                {lesson.level}
                            </div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                                {t(lesson.titleKey as any)}
                            </h2>
                        </div>
                        {MetaBadges}
                    </div>

                    {/* Challenge description */}
                    {lesson.challengeDescriptionKey && (
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-4 italic">
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
