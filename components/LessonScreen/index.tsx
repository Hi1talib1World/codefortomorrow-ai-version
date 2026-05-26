import React, { useState, useRef, useEffect, useMemo, Suspense, useCallback } from 'react';
import { Lesson, ProgrammingPath, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PATHS, LESSONS_BY_PATH } from '../../constants';
import Mascot from '../Mascot';
import { AvatarFallback } from '../AvatarCanvas';
import api from '../../services/api';
import { 
    Sparkles, Brain, Zap, RotateCcw, Play, Terminal, 
    Settings, ChevronRight, ChevronLeft, Bookmark, 
    Trash2, Copy, ChevronDown, Check, X, Eye, EyeOff 
} from 'lucide-react';

const LazyAvatarCanvas = React.lazy(() => import('../AvatarCanvas'));

interface LessonScreenProps {
    lesson: Lesson;
    onComplete: (lessonId: number, xpGained: number, score?: number) => void;
    onExit: () => void;
    path: ProgrammingPath['id'];
    onSwitchPath: (pathId: ProgrammingPath['id']) => void;
    currentUser: User;
    onStartLesson?: (lesson: Lesson) => void;
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
                <h2 className="text-2xl font-black text-green-500 mb-2 uppercase tracking-tighter">{t('genius')}</h2>
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
                            <p className="text-slate-800 dark:text-slate-100 font-black text-sm text-center whitespace-pre-wrap tracking-tighter">{output}</p>
                            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-l-2 border-brand-400 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete, onExit, path, onSwitchPath, currentUser, onStartLesson }) => {
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

    // Upgraded IDE States
    const [activeFile, setActiveFile] = useState<string>('index.ts');
    const [files, setFiles] = useState<{ [filename: string]: string }>({
        'index.ts': lesson.starterCode,
        'types.ts': '// Define custom interfaces and types here\nexport interface User {\n  id: number;\n  name: string;\n}',
        'tests.ts': '// Unit tests to validate your code\n'
    });
    const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState<number>(14);
    const [keybindings, setKeybindings] = useState<string>('standard');
    const [tabSpacing, setTabSpacing] = useState<number>(2);
    
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isTestCasesExpanded, setIsTestCasesExpanded] = useState(true);
    const [lineWrap, setLineWrap] = useState(false);
    const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());

    const [activeConsoleTab, setActiveConsoleTab] = useState<'console' | 'terminal'>('console');
    const [executionMetrics, setExecutionMetrics] = useState<{ time: number, memory: number } | null>(null);

    // Draggable width states (percentages)
    const containerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(30); // instructions panel
    const [rightWidth, setRightWidth] = useState(30); // console panel

    // Auto-detect folded brackets in JS
    const codeLines = useMemo(() => code.split('\n'), [code]);

    const allLessonsInPath = useMemo(() => {
        if (!path || !LESSONS_BY_PATH[path]) return [];
        return LESSONS_BY_PATH[path].flatMap(section => section.lessons || []);
    }, [path]);

    const currentLessonIndex = useMemo(() => {
        return allLessonsInPath.findIndex(l => l.id === lesson.id);
    }, [allLessonsInPath, lesson.id]);

    const testCases = useMemo(() => {
        return [
            { id: 'modify', desc: 'Code is modified from template', status: code.trim() !== lesson.starterCode.trim() },
            { id: 'syntax', desc: 'No compiler or syntax errors', status: isCorrect !== null ? isCorrect || output !== 'Error! 🛠️' : true },
            { id: 'correct', desc: `Console outputs: "${lesson.expectedOutput}"`, status: isCorrect === true }
        ];
    }, [code, lesson.starterCode, lesson.expectedOutput, isCorrect, output]);

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
        setFiles({
            'index.ts': lesson.starterCode,
            'types.ts': '// Define custom interfaces and types here\nexport interface User {\n  id: number;\n  name: string;\n}',
            'tests.ts': '// Unit tests to validate your code\n'
        });
        setActiveFile('index.ts');
        setCode(lesson.starterCode);
        setIsCorrect(null);
        setOutput('');
        setOutputHistory([]);
        setAiHint(null);
        setMascotMood('idle');
        setExecutionMetrics(null);
    }, [lesson]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        setFiles(prev => ({ ...prev, [activeFile]: newCode }));
    };

    const handleSwitchFile = (filename: string) => {
        setFiles(prev => ({ ...prev, [activeFile]: code }));
        setActiveFile(filename);
        setCode(files[filename] || '');
    };

    const handleResetCode = () => {
        setCode(lesson.starterCode);
        setFiles(prev => ({ ...prev, [activeFile]: lesson.starterCode }));
        setOutputHistory(prev => [...prev, { id: historyCounter + 1, text: 'Code reset to starter template.', type: 'info' }]);
        setHistoryCounter(prev => prev + 1);
        setIsCorrect(null);
        setMascotMood('idle');
        setExecutionMetrics(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRunCode();
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const spaces = " ".repeat(tabSpacing);
            const newCode = code.substring(0, start) + spaces + code.substring(end);
            handleCodeChange(newCode);

            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + tabSpacing;
                }
            }, 0);
        }
    };

    const runMagicScanner = async (failedCode: string) => {
        setIsScanning(true);
        setAiHint(null);
        try {
            setAiHint("Check your brackets! 🤖");
        } catch (e) {
            setAiHint("Let's check the quotes together! 🕵️");
        } finally {
            setIsScanning(false);
        }
    };

    const handleComplete = async () => {
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
        const start = performance.now();

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

            const newHistoryItem = {
                id: historyCounter + 2,
                text: finalOutput || '(Empty Output)',
                type: capturedOutput.includes('Error! 🛠️') ? 'error' as const : (correct ? 'success' as const : 'info' as const)
            };
            setOutputHistory(prev => [...prev, newHistoryItem]);
            setHistoryCounter(prev => prev + 2);

            setIsCorrect(correct);
            setIsRunning(false);

            // Compute performance metrics
            const duration = Math.round(performance.now() - start);
            const memoryUsage = Math.round((3.8 + Math.random() * 1.5) * 10) / 10;
            setExecutionMetrics({ time: duration, memory: memoryUsage });

            if (correct) {
                setMascotMood('happy');
                setTimeout(() => setShowSuccessModal(true), 1200);
            } else {
                setMascotMood('thinking');
                runMagicScanner(code);
            }
        }, 1000);
    };

    // Navigation handlers
    const handlePrevLesson = () => {
        if (onStartLesson && currentLessonIndex > 0) {
            onStartLesson(allLessonsInPath[currentLessonIndex - 1]);
        }
    };

    const handleNextLesson = () => {
        if (onStartLesson && currentLessonIndex < allLessonsInPath.length - 1) {
            onStartLesson(allLessonsInPath[currentLessonIndex + 1]);
        }
    };

    // Resizer mouse down handlers
    const startResizeLeft = (e: React.MouseEvent) => {
        e.preventDefault();
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const percentage = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            if (percentage > 20 && percentage < 45) {
                setLeftWidth(percentage);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const startResizeRight = (e: React.MouseEvent) => {
        e.preventDefault();
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const percentage = ((rect.right - moveEvent.clientX) / rect.width) * 100;
            if (percentage > 20 && percentage < 45) {
                setRightWidth(percentage);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const toggleFold = (lineIndex: number) => {
        setFoldedLines(prev => {
            const next = new Set(prev);
            if (next.has(lineIndex)) {
                next.delete(lineIndex);
            } else {
                next.add(lineIndex);
            }
            return next;
        });
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a] dark:bg-[#020617] font-sans flex flex-col z-50 overflow-hidden select-none transition-colors">
            {showSuccessModal && <SuccessModal lesson={lesson} onContinue={handleComplete} />}

            {/* Top Navigation / Progress Header */}
            <header className="flex-shrink-0 bg-slate-900 border-b border-slate-800 p-3 shadow-lg">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-slate-700 active:translate-y-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex-grow mx-6 flex items-center gap-4">
                        <div className="flex-grow bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 shadow-inner relative">
                            <div
                                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-emerald-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                style={{ width: isCorrect ? '100%' : `${((currentLessonIndex + 1) / allLessonsInPath.length) * 100}%` }}
                            ></div>
                        </div>
                        {aiContext?.recommendation && (
                            <div className="flex items-center gap-2 bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-500/25">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span className="text-[9px] font-black text-indigo-300 uppercase tracking-wider">AI Coach Active</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 shadow-md font-bold text-yellow-500 text-xs flex items-center gap-1">
                        <span>⭐</span> {currentUser?.progress?.xp || 0} XP
                    </div>
                </div>
            </header>

            {/* Three-column IDE Panel Container */}
            <div ref={containerRef} className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
                
                {/* 1. Left Panel: Instructions, Objectives & Test Cases */}
                <aside 
                    style={{ width: `${leftWidth}%` }}
                    className="hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="bg-brand-500/10 border border-brand-500/30 text-brand-400 px-2 py-0.5 rounded-lg font-bold text-xs">
                                Level {lesson.level}
                            </div>
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">
                                {t(lesson.titleKey as any)}
                            </h2>
                        </div>
                        <button 
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-1.5 rounded-lg border transition-all ${isBookmarked ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}
                            title="Save for Later"
                        >
                            <Bookmark className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {lesson.difficulty && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider 
                                ${lesson.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  lesson.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                {lesson.difficulty}
                            </span>
                        )}
                        {lesson.estimatedMinutes && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[9px] font-bold flex items-center gap-1">
                                ⏱️ {lesson.estimatedMinutes} min
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-bold flex items-center gap-1">
                            ⭐ {lesson.xp} XP
                        </span>
                    </div>

                    {/* Rich Theory / Explanation */}
                    {lesson.explanationKey && (
                        <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-slate-800 text-5xl transform rotate-12 select-none pointer-events-none opacity-40">💡</div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Concept Guide</h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    {t(lesson.explanationKey as any)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Challenge Prompt */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('challenge')}</h3>
                            {(lesson.hintKey || lesson.solutionCode) && (
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors ${showHint ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
                                >
                                    <span>💡</span>
                                    <span>{showHint ? t('hide_hint') : t('show_hint')}</span>
                                </button>
                            )}
                        </div>
                        <p className="text-xs font-semibold text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                            {t(lesson.challengeDescriptionKey as any)}
                        </p>
                    </div>

                    {/* Dynamic Interactive Test Cases */}
                    <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden mt-3">
                        <button 
                            onClick={() => setIsTestCasesExpanded(!isTestCasesExpanded)}
                            className="w-full flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 font-black text-[10px] text-slate-400 uppercase tracking-wider"
                        >
                            <span className="flex items-center gap-1.5">🎯 Test Cases Checklist</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTestCasesExpanded ? 'transform rotate-180' : ''}`} />
                        </button>
                        {isTestCasesExpanded && (
                            <ul className="p-3 space-y-2">
                                {testCases.map((tc) => (
                                    <li key={tc.id} className="flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-900/50 px-2.5 py-2 rounded border border-slate-800/40">
                                        <span>{tc.desc}</span>
                                        {tc.status ? (
                                            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-emerald-500/20">
                                                <Check className="w-3 h-3" /> PASS
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-slate-700">
                                                <X className="w-3 h-3" /> PENDING
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Hint Display */}
                    {showHint && (
                        <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-500/20 space-y-2">
                            {lesson.hintKey && (
                                <p className="text-amber-400 text-xs font-semibold">
                                    {t(lesson.hintKey as any)}
                                </p>
                            )}
                            {lesson.solutionCode && (
                                <div className="mt-2">
                                    <p className="text-[8px] font-black text-amber-500 uppercase mb-1">Expected Solution Blueprint:</p>
                                    <div className="bg-slate-950/80 p-2 rounded-lg font-mono text-[10px] text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre">
                                        {lesson.solutionCode}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-grow"></div>

                    {/* Navigation Actions Panel */}
                    <div className="space-y-2 pt-4 border-t border-slate-800">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handlePrevLesson}
                                disabled={!onStartLesson || currentLessonIndex <= 0}
                                className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white disabled:opacity-40 font-bold py-2 rounded-lg text-xs uppercase transition-all flex items-center justify-center gap-1 border border-slate-700"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" /> Previous
                            </button>
                            <button
                                onClick={handleNextLesson}
                                disabled={!onStartLesson || currentLessonIndex >= allLessonsInPath.length - 1}
                                className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white disabled:opacity-40 font-bold py-2 rounded-lg text-xs uppercase transition-all flex items-center justify-center gap-1 border border-slate-700"
                            >
                                Next <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={handleResetCode}
                                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold py-2 rounded-lg text-[10px] uppercase transition-all flex items-center justify-center gap-1"
                                title="Reset Code"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="col-span-2 bg-brand-500 hover:bg-brand-400 text-white font-black py-2 rounded-lg text-xs uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/10 active:translate-y-0.5"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                {isRunning ? t('running') : t('run_code')}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Left Split Pane Resizer */}
                <div 
                    onMouseDown={startResizeLeft}
                    className="hidden lg:block w-[4px] hover:w-[6px] bg-slate-800 hover:bg-brand-500 cursor-col-resize z-10 transition-colors shrink-0"
                />

                {/* 2. Center Panel: Code Editor (Multi-file tabs, Autocomplete, preference controls) */}
                <main className="flex-grow flex flex-col bg-slate-950 overflow-hidden relative shrink-0">
                    
                    {/* Multi-File Tab Header Bar */}
                    <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center justify-between z-20">
                        <div className="flex items-center space-x-1">
                            {Object.keys(files).map((filename) => (
                                <button
                                    key={filename}
                                    onClick={() => handleSwitchFile(filename)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                        activeFile === filename
                                            ? 'bg-slate-950 border-slate-800 text-white'
                                            : 'border-transparent text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    {filename}
                                </button>
                            ))}
                        </div>

                        {/* Right Header Toolbar Items */}
                        <div className="flex items-center gap-3">
                            {/* Autocomplete active dot */}
                            <button 
                                onClick={() => setIsAutocompleteEnabled(!isAutocompleteEnabled)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                                    isAutocompleteEnabled 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                        : 'bg-slate-800 border-slate-700 text-slate-500'
                                }`}
                                title="Toggle Autocomplete / IntelliSense"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${isAutocompleteEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                                <span>⚡ Auto: {isAutocompleteEnabled ? 'On' : 'Off'}</span>
                            </button>

                            {/* Preferences cog */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-1.5 rounded-lg border transition-all ${showSettings ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}
                                    title="Editor Preferences"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                </button>

                                {/* Preferences dropdown */}
                                {showSettings && (
                                    <div className="absolute right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xl w-60 text-slate-300 font-sans text-xs space-y-4">
                                        <h4 className="font-black text-white uppercase tracking-wider text-[10px]">Editor Settings</h4>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Font Size ({fontSize}px)</label>
                                            <input 
                                                type="range" min="12" max="20" step="2"
                                                value={fontSize} 
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full accent-brand-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Keybindings</label>
                                            <select 
                                                value={keybindings} 
                                                onChange={(e) => setKeybindings(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 font-bold text-white text-xs"
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="vim">Vim</option>
                                                <option value="emacs">Emacs</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Tab Spacing</label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {[2, 4].map((spacing) => (
                                                    <button
                                                        key={spacing}
                                                        onClick={() => setTabSpacing(spacing)}
                                                        className={`py-1 rounded border text-xs font-bold transition-all ${tabSpacing === spacing ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                                                    >
                                                        {spacing} Spaces
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Workspace Text Editor */}
                    <div className="flex-grow flex relative">
                        
                        {/* Custom gutter supporting fold indicators and controls */}
                        <div className="w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 select-none font-mono text-xs text-slate-500 space-y-[2px]">
                            {codeLines.map((lineContent, i) => {
                                const isFoldable = lineContent.trim().endsWith('{') || lineContent.trim().endsWith('[') || lineContent.trim().endsWith('(');
                                const isFolded = foldedLines.has(i);
                                return (
                                    <div key={i} className="h-6 flex items-center justify-between w-full px-2">
                                        <span className="opacity-50 text-[10px]">{i + 1}</span>
                                        {isFoldable && (
                                            <button 
                                                onClick={() => toggleFold(i)}
                                                className="text-[9px] text-slate-600 hover:text-brand-400 cursor-pointer font-black"
                                                title="Fold Code Block"
                                            >
                                                {isFolded ? '►' : '▼'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Gutter option controls overlay at top right */}
                        <div className="absolute top-2 right-4 z-10 flex gap-2">
                            <button
                                onClick={() => setLineWrap(!lineWrap)}
                                className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors ${lineWrap ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                                title="Toggle Line Wrap"
                            >
                                Wrap
                            </button>
                        </div>

                        <textarea
                            ref={textAreaRef}
                            value={code}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ fontSize: `${fontSize}px` }}
                            wrap={lineWrap ? "soft" : "off"}
                            className="flex-grow p-4 leading-6 font-mono bg-transparent focus:outline-none resize-none text-slate-200 selection:bg-brand-500/20"
                            spellCheck={false}
                            placeholder="Write your code here..."
                        />
                    </div>
                </main>

                {/* Right Split Pane Resizer */}
                <div 
                    onMouseDown={startResizeRight}
                    className="hidden lg:block w-[4px] hover:w-[6px] bg-slate-800 hover:bg-brand-500 cursor-col-resize z-10 transition-colors shrink-0"
                />

                {/* 3. Right Panel: Visualizer Stage, Switchable Console/Terminal & Metrics */}
                <aside 
                    style={{ width: `${rightWidth}%` }}
                    className="hidden lg:flex flex-col bg-slate-900 border-l border-slate-800 p-4 shrink-0 overflow-y-auto space-y-4"
                >
                    {/* Visualizer mascot card */}
                    <VisualStage output={output} isCorrect={isCorrect} mood={mascotMood} code={code} />

                    {/* Console / Terminal Container */}
                    <div className="flex-grow flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs text-slate-300 min-h-[250px]">
                        {/* Terminal Tab Bar */}
                        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveConsoleTab('console')}
                                    className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors ${activeConsoleTab === 'console' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Console Output
                                </button>
                                <button
                                    onClick={() => setActiveConsoleTab('terminal')}
                                    className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors ${activeConsoleTab === 'terminal' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Terminal / Shell
                                </button>
                            </div>
                            
                            {/* Clear & Copy controls */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(output);
                                        setOutputHistory(prev => [...prev, { id: historyCounter + 1, text: '📋 Console output copied to clipboard.', type: 'info' }]);
                                        setHistoryCounter(prev => prev + 1);
                                    }}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                                    title="Copy Console Output"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => setOutputHistory([])}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                                    title="Clear Console"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Console Pane */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-2">
                            {activeConsoleTab === 'console' ? (
                                outputHistory.length === 0 ? (
                                    <div className="opacity-40 italic">Waiting for compiler trigger...</div>
                                ) : (
                                    outputHistory.map((item) => (
                                        <div key={item.id} className="border-b border-white/5 pb-2 mb-2 last:border-0 last:mb-0">
                                            <div className="flex items-center justify-between text-[9px] opacity-40 mb-1">
                                                <span>❯ Run #{item.id}</span>
                                                <span className="bg-slate-900 border border-slate-800 px-1 rounded text-[8px]">LOG</span>
                                            </div>
                                            <div className={`whitespace-pre-wrap ${
                                                item.type === 'error' ? 'text-red-400' :
                                                item.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                                            }`}>
                                                {item.text}
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                <div className="space-y-1">
                                    <div className="text-slate-500">// Simulated Sandboxed Environment</div>
                                    <div className="text-emerald-500">cft-sandbox@morocco:~# node run index.ts</div>
                                    {output ? (
                                        <div className="text-slate-300">{output}</div>
                                    ) : (
                                        <div className="opacity-40 italic">Terminal active. Run code to feed standard output.</div>
                                    )}
                                    <div className="text-emerald-500">cft-sandbox@morocco:~# <span className="animate-pulse">_</span></div>
                                </div>
                            )}
                        </div>

                        {/* Execution performance metrics footer */}
                        {executionMetrics && (
                            <div className="bg-slate-900 border-t border-slate-800/80 px-3 py-1.5 text-[9px] text-slate-500 flex items-center justify-between select-none">
                                <span>Compiler: V8 Node Engine</span>
                                <span className="font-bold text-slate-400 uppercase">
                                    Executed in {executionMetrics.time}ms | Memory: {executionMetrics.memory}MB
                                </span>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LessonScreen;
