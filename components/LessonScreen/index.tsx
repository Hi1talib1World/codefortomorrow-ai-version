
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Lesson, ProgrammingPath, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';
import api from '../../services/api';
import { Sparkles, Brain, Zap, RotateCcw, Play, Terminal } from 'lucide-react';

interface LessonScreenProps {
    lesson: Lesson;
    onComplete: (lessonId: number, xpGained: number, score?: number) => void;
    onExit: () => void;
    path: ProgrammingPath['id'];
    onSwitchPath: (pathId: ProgrammingPath['id']) => void;
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
                <h2 className="text-2xl font-black text-green-500 mb-2 uppercase tracking-tighter italic">{t('genius')}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-base mb-6">{t('mission_complete_msg')} <br /> <span className="text-yellow-500 font-black">+{lesson.xp} {t('star_xp_units')}</span></p>
                <button
                    onClick={onContinue}
                    className="w-full bg-green-500 text-white font-black py-3 px-6 rounded-xl text-base uppercase border-b-4 border-green-700 hover:bg-green-400 active:border-b-2 active:translate-y-1 transition-all shadow-xl bubbly-btn"
                >
                    {t('next_adventure')}
                </button>
            </div>
        </div>
    );
};

const VisualStage: React.FC<{ output: string, isCorrect: boolean | null, mood: string, code: string }> = ({ output, isCorrect, mood, code }) => {
    const hasLog = code.includes('console.log') || code.includes('print');

    return (
        <div className="h-40 lg:h-48 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl relative overflow-hidden border-2 border-white dark:border-slate-600 shadow-xl mb-4 group kid-card">
            <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-full blur-xl animate-pulse"></div>

            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 ease-out transform ${mood === 'happy' ? 'scale-105' : 'scale-95'} ${isCorrect ? 'animate-bounce' : ''}`}>
                <div className="relative">
                    <div className="w-20 h-20">
                        <Mascot />
                    </div>
                    {hasLog && !output && (
                        <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-700 p-1.5 rounded-lg shadow-lg border border-brand-200 dark:border-brand-800 animate-bounce">
                            <span className="text-sm">💬</span>
                        </div>
                    )}
                    {output && (
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-2 rounded-xl rounded-bl-none shadow-xl min-w-[100px] animate-pop-in border-2 border-brand-400">
                            <p className="text-slate-800 dark:text-slate-100 font-black text-sm text-center whitespace-pre-wrap italic tracking-tighter">{output}</p>
                            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-l-2 border-brand-400 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete, onExit, path, onSwitchPath, currentUser }) => {
    const { t } = useLanguage();
    const [code, setCode] = useState(lesson.starterCode);
    const [output, setOutput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [aiHint, setAiHint] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [mascotMood, setMascotMood] = useState('idle');
    const [aiContext, setAiContext] = useState<any>(null);
    const [outputHistory, setOutputHistory] = useState<{ id: number, text: string, type: 'info' | 'error' | 'success' }[]>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [historyCounter, setHistoryCounter] = useState(0);

    useEffect(() => {
        const fetchContext = async () => {
            try {
                const profile = await api.getAILearningProfile();
                setAiContext(profile);
            } catch (e) {
                console.error(e);
            }
        };
        fetchContext();
    }, []);

    useEffect(() => {
        setShowHint(false);
        setCode(lesson.starterCode);
        setIsCorrect(null);
        setOutput('');
        setOutputHistory([]);
        setAiHint(null);
        setMascotMood('idle');
    }, [lesson]);

    const handleResetCode = () => {
        setCode(lesson.starterCode);
        setOutputHistory(prev => [...prev, { id: historyCounter + 1, text: 'Code reset to starter template.', type: 'info' }]);
        setHistoryCounter(prev => prev + 1);
        setIsCorrect(null);
        setMascotMood('idle');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRunCode();
        }
        // Basic Tab indentation support
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;

            const newCode = code.substring(0, start) + "  " + code.substring(end);
            setCode(newCode);

            // Move cursor gracefully (using setTimeout to ensure state is updated)
            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + 2;
                }
            }, 0);
        }
    };

    const runMagicScanner = async (failedCode: string) => {
        setIsScanning(true);
        setAiHint(null);
        try {
            // Use backend AI for hints via generateQuiz endpoint (repurposed for simple text generation if needed)
            // Or we can just use a placeholder since we moved Gemini to backend
            setAiHint("Check your brackets! 🤖");
        } catch (e) {
            setAiHint("Let's check the quotes together! 🕵️");
        } finally {
            setIsScanning(false);
        }
    };

    const handleComplete = async () => {
        // Update skill mastery on completion
        const concept = lesson.titleKey.split('_')[0];
        try {
            await api.updateUserProgress({
                xp: lesson.xp,
                skillMastery: { [concept]: 85 }
            });
        } catch (e) {
            console.error(e);
        }
        onComplete(lesson.id, lesson.xp, 100);
    };

    const handleRunCode = () => {
        setIsRunning(true);
        setAiHint(null);
        setIsCorrect(null);
        setOutput('');
        setMascotMood('thinking');

        const originalConsoleLog = console.log;
        let capturedOutput = '';
        console.log = (...args) => {
            capturedOutput += args.map(arg => String(arg)).join(' ') + '\n';
        };

        setTimeout(() => {
            try {
                new Function(code)();
            } catch (e) {
                capturedOutput = "Error! 🛠️";
            } finally {
                console.log = originalConsoleLog;
            }

            const finalOutput = capturedOutput.trim().replace(/"/g, '');
            const expected = lesson.expectedOutput.trim().replace(/"/g, '');
            const correct = finalOutput === expected;

            setOutput(finalOutput || '(Silence...)');

            // Update Output History
            const newHistoryItem = {
                id: historyCounter + 2,
                text: finalOutput || '(Empty Output)',
                type: capturedOutput.includes('Error! 🛠️') ? 'error' as const : (correct ? 'success' as const : 'info' as const)
            };
            setOutputHistory(prev => [...prev, newHistoryItem]);
            setHistoryCounter(prev => prev + 2);

            setIsCorrect(correct);
            setIsRunning(false);

            if (correct) {
                setMascotMood('happy');
                setTimeout(() => setShowSuccessModal(true), 1200);
            } else {
                setMascotMood('thinking');
                runMagicScanner(code);
            }
        }, 1200);
    };

    const lineCount = code.split('\n').length || 1;

    return (
        <div className="fixed inset-0 bg-brand-50 dark:bg-slate-900 font-sans flex flex-col z-50 overflow-hidden select-none transition-colors">
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
                        {aiContext?.recommendation && (
                            <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-800">
                                <Sparkles className="w-3 h-3 text-brand-600" />
                                <span className="text-[8px] font-black text-brand-700 uppercase italic">AI Adaptive Mode</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border-b-2 border-yellow-500 shadow-md font-black text-yellow-600 text-sm">
                        ⭐ {currentUser?.progress?.xp || 0}
                    </div>
                </div>
            </header>

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                <aside className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-4 flex flex-col border-r-2 dark:border-slate-700 overflow-y-auto space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="bg-brand-500 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm">
                            {lesson.level}
                        </div>
                        <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                            {t(lesson.titleKey as any)}
                        </h2>
                    </div>

                    {/* Metadata Bar */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {lesson.difficulty && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider 
                                ${lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                    lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                                {lesson.difficulty}
                            </span>
                        )}
                        {lesson.estimatedMinutes && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1">
                                <span>⏱️</span> {lesson.estimatedMinutes} min
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                            <span>⭐</span> {lesson.xp} XP
                        </span>
                        {lesson.tags?.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[9px] font-bold uppercase tracking-wider">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {lesson.explanationKey && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-800/50 animate-pop-in shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-indigo-100 dark:text-indigo-900/40 text-6xl transform rotate-12 transition-transform group-hover:scale-110">💡</div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Concept</h3>
                                    <div className="w-full h-0.5 bg-indigo-100 dark:bg-indigo-800/50 rounded flex-grow"></div>
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {t(lesson.explanationKey as any)}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('challenge')}</h3>
                            {(lesson.hintKey || lesson.solutionCode) && (
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className={`text-[10px] font-black uppercase tracking-tighter flex items-center space-x-1 transition-colors ${showHint ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                                >
                                    <span>💡</span>
                                    <span>{showHint ? t('hide_hint') : t('show_hint')}</span>
                                </button>
                            )}
                        </div>
                        <div className="prose dark:prose-invert">
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                {t(lesson.challengeDescriptionKey as any)}
                            </p>
                        </div>

                        {lesson.objectivesKey && (
                            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-sm mt-3">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <span>🎯</span> {t('learning_objectives' as any) || 'Objectives'}
                                </h3>
                                <ul className="space-y-2">
                                    {((t(lesson.objectivesKey as any) as string) || '').split('|').map((objective, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${isCorrect ? 'bg-green-100 border-green-500 text-green-500 dark:bg-green-900/30' : 'bg-slate-50 border-slate-300 text-transparent dark:bg-slate-700 dark:border-slate-600'}`}>
                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className={`text-xs font-bold ${isCorrect ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {lesson.proTipKey && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-3 rounded-r-xl mt-3">
                                <h3 className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                                    <span>💡</span> Pro Tip!
                                </h3>
                                <p className="text-xs font-bold text-amber-900/70 dark:text-amber-100/70">
                                    {t(lesson.proTipKey as any)}
                                </p>
                            </div>
                        )}

                        {showHint && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-100 dark:border-yellow-800/50 animate-pop-in space-y-2">
                                {lesson.hintKey && (
                                    <p className="text-yellow-700 dark:text-yellow-400 text-xs font-bold italic">
                                        {t(lesson.hintKey as any)}
                                    </p>
                                )}
                                {lesson.solutionCode && (
                                    <div className="mt-2">
                                        <p className="text-[8px] font-black text-yellow-600 uppercase mb-1">{t('solution' as any) || 'Solution'}:</p>
                                        <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-yellow-200 dark:border-yellow-700 overflow-x-auto">
                                            {lesson.solutionCode}
                                        </div>
                                        <button
                                            onClick={() => setCode(lesson.solutionCode)}
                                            className="mt-2 text-[8px] font-black text-brand-500 uppercase hover:underline"
                                        >
                                            {t('use_this_code' as any) || 'Use this code'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {aiHint && (
                        <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-xl border border-brand-100 dark:border-brand-800 animate-pop-in">
                            <p className="text-brand-500 dark:text-brand-300 font-bold italic text-xs">
                                <span className="text-lg mr-2">🤖</span>
                                {aiHint}
                            </p>
                        </div>
                    )}

                    <div className="flex-grow"></div>

                    <div className="space-y-3">
                        <button
                            onClick={handleResetCode}
                            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black py-3 rounded-xl text-sm uppercase hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset Code
                        </button>
                        <button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className="w-full bg-brand-500 text-white font-black py-3 rounded-xl text-base uppercase border-b-4 border-brand-700 hover:bg-brand-400 active:border-b-2 active:translate-y-1 transition-all disabled:opacity-50 bubbly-btn shadow-xl flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            {isRunning ? t('running') : t('run_code')}
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded ml-2 hidden lg:inline-block border border-white/30">Cmd/Ctrl + Enter</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-grow p-4 overflow-y-auto bg-brand-50 dark:bg-slate-900 flex flex-col gap-4 transition-colors">
                    <VisualStage output={output} isCorrect={isCorrect} mood={mascotMood} code={code} />

                    <div className="flex-grow flex flex-col lg:flex-row gap-4 h-full min-h-[300px]">
                        {/* Code Editor */}
                        <div className="flex-[2] flex flex-col bg-white dark:bg-slate-950 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden kid-card relative">
                            <div className="bg-slate-100 dark:bg-slate-900 p-2 border-b-2 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-black text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <Terminal className="w-3 h-3" /> {t('code_editor_title')}
                                </span>
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-inner"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-inner"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-inner"></div>
                                </div>
                            </div>
                            <div className="flex-grow flex relative">
                                {/* Line Numbers Gutter */}
                                <div className="w-10 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-4 select-none font-mono text-xs text-slate-300 dark:text-slate-600">
                                    {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
                                        <div key={i} className="leading-6 opacity-70">{i + 1}</div>
                                    ))}
                                </div>
                                <textarea
                                    ref={textAreaRef}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-grow p-4 leading-6 font-mono text-sm bg-transparent focus:outline-none resize-none dark:text-slate-300 text-slate-800 selection:bg-brand-200 dark:selection:bg-brand-900/50"
                                    spellCheck={false}
                                    placeholder="Type your code here..."
                                />
                            </div>
                        </div>

                        {/* Console Output Terminal */}
                        <div className="flex-1 flex flex-col bg-slate-900 dark:bg-black rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden font-mono text-xs text-slate-300 kid-card">
                            <div className="bg-slate-800 dark:bg-slate-900 p-2 border-b border-slate-700 flex items-center justify-between">
                                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    Console Output
                                </span>
                                <div className="px-2 py-0.5 bg-slate-700 rounded text-[9px] text-brand-400">Live</div>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto space-y-2">
                                {outputHistory.length === 0 ? (
                                    <div className="opacity-50 italic">Waiting for execution...</div>
                                ) : (
                                    outputHistory.map((item) => (
                                        <div key={item.id} className="border-b border-white/5 pb-2 mb-2 last:border-0 last:mb-0">
                                            <div className="flex items-center gap-2 text-[10px] opacity-50 mb-1">
                                                <span>❯</span>
                                                <span>Run #{item.id}</span>
                                            </div>
                                            <div className={`whitespace-pre-wrap ${item.type === 'error' ? 'text-red-400' :
                                                item.type === 'success' ? 'text-green-400' : 'text-slate-200'
                                                }`}>
                                                {item.text}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LessonScreen;
