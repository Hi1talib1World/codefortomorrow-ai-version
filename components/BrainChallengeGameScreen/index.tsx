import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

/* ─── Sample question bank (20 questions per challenge) ─────────── */
interface Question {
    id: number;
    image?: string;
    questionText: string;
    options: { label: string; value: string }[];
    correctAnswer: string;
}

const generateQuestions = (challengeId: number): Question[] =>
    Array.from({ length: 20 }, (_, i) => {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        const correct = a + b;
        const wrongSet = new Set<number>();
        while (wrongSet.size < 3) {
            const w = correct + (Math.floor(Math.random() * 7) - 3);
            if (w !== correct && w > 0) wrongSet.add(w);
        }
        const wrong = [...wrongSet];
        const allOptions = [correct, ...wrong].sort(() => Math.random() - 0.5);
        return {
            id: i + 1,
            questionText: `What is ${a} + ${b}?`,
            options: allOptions.map((v, idx) => ({
                label: String.fromCharCode(65 + idx),
                value: String(v),
            })),
            correctAnswer: String(correct),
        };
    });

/* ─── Component ─────────────────────────────────────────────────── */
export default function BrainChallengeGameScreen() {
    const navigate = useNavigate();
    const { challengeId } = useParams<{ challengeId: string }>();
    const cId = Number(challengeId) || 1;

    const [questions] = useState<Question[]>(() => generateQuestions(cId));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const current = questions[currentIndex];
    const totalQuestions = questions.length;

    const selectAnswer = useCallback(
        (questionId: number, value: string) => {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        },
        []
    );

    const goTo = (idx: number) => {
        if (idx >= 0 && idx < totalQuestions) setCurrentIndex(idx);
    };

    return (
        <div className="h-screen flex bg-white dark:bg-slate-900 font-sans overflow-hidden">
            {/* ── Left sidebar: question navigator ────────────────────── */}
            <aside className="w-44 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col overflow-hidden">
                <h2 className="px-4 py-4 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    Questions
                </h2>
                <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                    {questions.map((q, idx) => {
                        const isActive = idx === currentIndex;
                        const answered = answers[q.id] !== undefined;
                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-sm ${isActive
                                        ? 'bg-violet-100 dark:bg-violet-900/40 border-2 border-violet-400 dark:border-violet-500'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-transparent'
                                    }`}
                            >
                                <span className={`font-black text-xs w-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {q.id}
                                </span>
                                <div className="flex gap-1">
                                    {q.options.map((opt) => {
                                        const isSelected = answers[q.id] === opt.value;
                                        return (
                                            <span
                                                key={opt.label}
                                                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${isSelected
                                                        ? 'bg-violet-500 text-white'
                                                        : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                                                    }`}
                                            >
                                                {opt.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* ── Main content ────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
                    <button
                        onClick={() => navigate('/brain-training')}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 inline -mt-0.5" /> Back
                    </button>
                    <h1 className="text-lg font-black text-slate-800 dark:text-white">
                        Brain Challenge {cId}
                    </h1>
                    <div className="w-16" />
                </div>

                {/* Question area */}
                <div className="flex-1 overflow-y-auto px-6 md:px-16 lg:px-28 py-8 flex flex-col items-center">
                    {/* Question visual / text */}
                    <div className="w-full max-w-3xl mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 md:p-12 flex items-center justify-center min-h-[180px] shadow-inner border border-slate-200 dark:border-slate-700">
                            <p className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white text-center tracking-tight">
                                {current.questionText}
                            </p>
                        </div>
                    </div>

                    {/* Answer options */}
                    <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
                        {current.options.map((opt) => {
                            const isSelected = answers[current.id] === opt.value;
                            return (
                                <button
                                    key={opt.label}
                                    onClick={() => selectAnswer(current.id, opt.value)}
                                    className={`relative rounded-2xl p-6 text-center transition-all border-2 ${isSelected
                                            ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-400 dark:border-violet-500 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30 scale-[1.02]'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md'
                                        }`}
                                >
                                    <span className={`absolute top-3 left-4 text-xs font-bold ${isSelected ? 'text-violet-500 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'
                                        }`}>
                                        {opt.label}
                                    </span>
                                    <span className={`text-4xl md:text-5xl font-black ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-200'
                                        }`}>
                                        {opt.value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="px-6 md:px-16 lg:px-28 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div className="flex gap-3">
                            <button
                                onClick={() => goTo(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <button
                                onClick={() => goTo(currentIndex + 1)}
                                disabled={currentIndex === totalQuestions - 1}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                // Future: submit & show results
                                navigate('/brain-training');
                            }}
                            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors shadow-md"
                        >
                            Finish
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="max-w-3xl mx-auto mt-3">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                            {currentIndex + 1}/{totalQuestions}
                        </p>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
