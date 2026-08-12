import React, { useState, useRef, useEffect, useMemo, Suspense, useCallback } from 'react';
import { Lesson, ProgrammingPath, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PATHS, LESSONS_BY_PATH } from '../../constants';
import Mascot from '../Mascot';
import { AvatarFallback } from '../AvatarCanvas';
import api from '../../services/api';
import { 
    Brain, Zap, RotateCcw, Play, Terminal, 
    Settings, ChevronRight, ChevronLeft, Bookmark, 
    Trash2, Copy, ChevronDown, Check, X, Eye, EyeOff,
    Cpu, Layers, Activity
} from 'lucide-react';
import { useToast } from '../ToastNotification';

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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 animate-fade-in backdrop-blur-md">
            <div className="bg-[#181818] border-2 border-emerald-500/40 rounded-3xl p-6 text-center max-w-sm w-full relative overflow-hidden animate-pop-in shadow-[0_0_50px_rgba(16,185,129,0.3)] text-white space-y-4">
                
                {/* Glowing Background Radial */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="w-24 h-24 mx-auto relative hover:scale-110 transition-transform cursor-pointer group">
                    <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-2xl group-hover:opacity-100 animate-pulse"></div>
                    <Mascot />
                </div>

                <div className="space-y-1">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        🎉 Challenge Completed!
                    </span>
                    <h2 className="text-2xl font-black text-white tracking-tight pt-1">
                        {t('genius') || 'Awesome Job!'}
                    </h2>
                </div>

                {/* Earning Points Card */}
                <div className="bg-[#141414] border border-[#282828] p-4 rounded-2xl space-y-1 shadow-inner">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP Points Earned</p>
                    <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-2 animate-bounce">
                        <span>⚡</span>
                        <span>+{lesson.xp} XP</span>
                    </div>
                </div>

                {/* Next Lesson Button */}
                <button
                    onClick={onContinue}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>🚀 Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const VisualStage: React.FC<{ output: string, isCorrect: boolean | null, mood: string, code: string }> = ({ output, isCorrect, mood, code }) => {
    const hasLog = code.includes('console.log') || code.includes('print') || code.includes('System.out');

    return (
        <div className="h-44 bg-[#0a0f1d] rounded-2xl relative overflow-hidden border border-cyan-500/35 shadow-[0_0_30px_rgba(6,182,212,0.12)] mb-3 group">
            {/* Ambient holographic blue grid background */}
            <div 
                className="absolute inset-0 opacity-[0.1]"
                style={{ 
                    backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
                    backgroundSize: '10px 10px' 
                }}
            />

            {/* Glowing holographic projector light beam cone */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-28 bg-gradient-to-t from-cyan-500/20 via-cyan-500/5 to-transparent opacity-60 animate-pulse-glow" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}></div>

            {/* Holographic projection rings at base */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full blur-[1px] transform -rotate-1 opacity-70"></div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-cyan-500/5 border border-cyan-500/15 rounded-full blur-[2px] transform -rotate-1 opacity-40"></div>

            {/* Glowing orb behind mascot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>

            {/* Floating holo particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <span className="absolute w-[2px] h-[2px] bg-cyan-400 rounded-full animate-float-1 bottom-4 left-1/4" />
                <span className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full animate-float-2 bottom-6 left-[40%]" />
                <span className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float-3 bottom-5 right-[35%]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-cyan-300 rounded-full animate-float-1 bottom-2 right-[20%]" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Horizontal scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-15 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent bg-[length:100%_4px] animate-pulse" />

            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 ease-out transform ${mood === 'happy' ? 'scale-105' : 'scale-95'} ${isCorrect ? 'animate-bounce' : ''}`}>
                <div className="relative">
                    {/* Semi-transparent Holographic Cyan filter */}
                    <div className="w-20 h-20 filter hue-rotate-[160deg] saturate-[2.5] brightness-[1.25] drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] opacity-80 hover:opacity-95 transition-opacity duration-300">
                        <Mascot />
                    </div>
                    
                    {hasLog && !output && (
                        <div className="absolute -top-7 -right-8 bg-slate-950/90 border border-cyan-500/50 px-2 py-1 rounded text-[8px] font-mono text-cyan-400 font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse">
                             CONNECTING...
                        </div>
                    )}
                    
                    {output && (
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-cyan-500/50 p-2.5 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] min-w-[140px] animate-pop-in backdrop-blur-md">
                            {/* HUD corners */}
                            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400"></div>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400"></div>
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyan-400"></div>
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400"></div>
                            
                            <p className="text-cyan-400 font-mono text-[8px] font-black tracking-widest text-center whitespace-pre-wrap flex items-center justify-center gap-1 uppercase border-b border-cyan-500/20 pb-1 mb-1">
                                <span className={output.includes('Error') ? 'text-rose-455 font-bold' : 'text-cyan-400'}>
                                    {output.includes('Error') ? ' SYSTEM_ERR : ERROR' : '️ RUN_STDOUT : SUCCESS'}
                                </span>
                            </p>
                            <p className="text-slate-100 font-mono text-[11px] font-bold text-center mt-1 truncate max-w-[160px]">{output}</p>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45 border-r border-b border-cyan-500/50"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete, onExit, path, onSwitchPath, currentUser, onStartLesson }) => {
    const { t } = useLanguage();
    const [code, setCode] = useState("");
    const [output, setOutput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const { showToast } = useToast();
    const [isRunning, setIsRunning] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [aiHint, setAiHint] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [mascotMood, setMascotMood] = useState('idle');
    const [aiContext, setAiContext] = useState<any>(null);
    const [outputHistory, setOutputHistory] = useState<{ id: number, text: string, type: 'info' | 'error' | 'success' }[]>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [historyCounter, setHistoryCounter] = useState(0);

    // Upgraded IDE States
    const [activeFile, setActiveFile] = useState<string>('index.ts');
    const [files, setFiles] = useState<{ [filename: string]: string }>({});
    const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState<number>(14);
    const [keybindings, setKeybindings] = useState<string>('standard');
    const [tabSpacing, setTabSpacing] = useState<number>(2);
    
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isTestCasesExpanded, setIsTestCasesExpanded] = useState(true);
    const [isObjectivesExpanded, setIsObjectivesExpanded] = useState(false);
    const [lineWrap, setLineWrap] = useState(false);
    const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());
    const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
    const [isXpHovered, setIsXpHovered] = useState(false);

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
            { id: 'syntax', desc: 'No compiler or syntax errors', status: isCorrect !== null ? isCorrect || output !== 'Error! ️' : true },
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

    // Set files dynamically on lesson change to match path languages
    useEffect(() => {
        let mainFile = 'index.ts';
        if (path === 'python') mainFile = 'main.py';
        else if (path === 'java') mainFile = 'Main.java';
        else if (path === 'c++') mainFile = 'main.cpp';
        else if (path === 'c_sharp') mainFile = 'Program.cs';
        else if (path === 'ruby') mainFile = 'main.rb';
        else if (path === 'rust') mainFile = 'main.rs';
        else if (path === 'web_dev') mainFile = 'index.html';

        const initialFiles = {
            [mainFile]: "",
            'types.ts': '// Define custom interfaces and types here\n',
            'tests.ts': '// Unit tests to validate your code\n'
        };
        setFiles(initialFiles);
        setActiveFile(mainFile);
        setCode("");
        setIsCorrect(null);
        setOutput('');
        setOutputHistory([]);
        setAiHint(null);
        setMascotMood('idle');
        setExecutionMetrics(null);
        setBreakpoints(new Set());
    }, [lesson, path]);

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
            const res = await api.generateHint(lesson.titleKey, lesson.expectedOutput, failedCode);
            setAiHint(res.hint);
        } catch (e) {
            console.error('Magic Scanner Error:', e);
            setAiHint("Let's review the code logic together! ");
        } finally {
            setIsScanning(false);
        }
    };

    const handleComplete = async () => {
        const concept = lesson.titleKey.split('_')[0];
        try {
            await api.updateUserProgress({
                skillMastery: { [concept]: 85 }
            });
        } catch (e) {
            console.error(e);
        }
        onComplete(lesson.id, lesson.xp, 100);
    };

    const executeLanguageCode = (codeText: string, pathName: string): string => {
        let logs: string[] = [];

        // 1. JavaScript / TypeScript / Block Coding execution
        if (pathName === 'javascript' || pathName === 'typescript' || pathName === 'block_coding' || pathName === 'web_dev') {
            try {
                let captured = '';
                const customConsole = {
                    log: (...args: any[]) => { captured += args.map(a => String(a)).join(' ') + '\n'; },
                    error: (...args: any[]) => { captured += args.map(a => String(a)).join(' ') + '\n'; },
                    warn: (...args: any[]) => { captured += args.map(a => String(a)).join(' ') + '\n'; }
                };
                const safeRun = new Function('console', codeText);
                safeRun(customConsole);
                if (captured) return captured.trim();
            } catch (e) {
                // If JS execution fails, proceed to fallback regex parsing
            }
        }

        // 2. C++ / C / Java / C# / Rust / Go / Swift / Kotlin execution simulation
        // Match std::cout << "..."
        const coutMatches = codeText.match(/std::cout\s*<<\s*("[^"]*"|'[^']*'|[\w\d_]+)/g);
        if (coutMatches) {
            coutMatches.forEach(m => {
                const val = m.replace(/std::cout\s*<<\s*/, '').replace(/^["']|["']$/g, '');
                logs.push(val);
            });
        }
        
        // Match System.out.println("...") or System.out.print("...")
        const sysOutMatches = codeText.match(/System\.out\.print(?:ln)?\s*\(\s*("[^"]*"|'[^']*'|[\w\d_]+)\s*\)/g);
        if (sysOutMatches) {
            sysOutMatches.forEach(m => {
                const val = m.replace(/System\.out\.print(?:ln)?\s*\(\s*/, '').replace(/\s*\)$/, '').replace(/^["']|["']$/g, '');
                logs.push(val);
            });
        }

        // Match Python print(...) / Console.WriteLine("...") / printf("...") / println!("...") / fmt.Println("...")
        const printFuncMatches = codeText.match(/(?:Console\.WriteLine|printf|println!|print|fmt\.Println|echo)\s*\(?\s*("[^"]*"|'[^']*'|[\w\d_]+)\s*\)?/g);
        if (printFuncMatches && logs.length === 0) {
            printFuncMatches.forEach(m => {
                const val = m.replace(/(?:Console\.WriteLine|printf|println!|print|fmt\.Println|echo)\s*\(?\s*/, '').replace(/\s*\)?$/, '').replace(/^["']|["']$/g, '');
                if (val && !val.startsWith('//') && !val.startsWith('#')) {
                    logs.push(val);
                }
            });
        }

        if (logs.length > 0) {
            return logs.join('\n').trim();
        }

        // 3. Fallback: Extract string literals from code
        const stringMatches = codeText.match(/"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/g);
        if (stringMatches && stringMatches.length > 0) {
            const validStrings = stringMatches
                .map(s => s.replace(/^["']|["']$/g, ''))
                .filter(s => !s.endsWith('.h') && !s.endsWith('.hpp') && !s.startsWith('http') && s.length > 0);
            if (validStrings.length > 0) {
                return validStrings.join('\n').trim();
            }
        }

        return '';
    };

    const handleRunCode = () => {
        setIsRunning(true);
        setAiHint(null);
        setIsCorrect(null);
        setOutput('');
        setMascotMood('thinking');
        const start = performance.now();

        setTimeout(() => {
            let capturedOutput = executeLanguageCode(code, path);
            
            // Normalize quotes and spaces for comparison
            const finalOutput = capturedOutput.trim().replace(/"/g, '');
            const expected = (lesson.expectedOutput || '').trim().replace(/"/g, '');
            
            // Check if correct: either exact match or output contains expected output
            const correct = expected ? (finalOutput === expected || finalOutput.includes(expected)) : true;

            setOutput(capturedOutput || '(Silence...)');

            const newHistoryItem = {
                id: historyCounter + 2,
                text: capturedOutput || '(Empty Output)',
                type: correct ? 'success' as const : 'info' as const
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
                setTimeout(() => setShowSuccessModal(true), 500);
            } else {
                setMascotMood('thinking');
                runMagicScanner(code);
            }
        }, 600);
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

    // Auto-scroll sync for transparent textarea overlay syntax highlighting
    const editorScrollRef = useRef<HTMLDivElement>(null);
    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (editorScrollRef.current) {
            editorScrollRef.current.scrollTop = e.currentTarget.scrollTop;
            editorScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    // Simple robust regex syntax highligher for code overlay
    const highlightCode = (rawCode: string) => {
        const placeholders: string[] = [];

        const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        let html = rawCode || '';
        
        // 1. Extract Comments (block comments and line comments)
        html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/.*|#.*)/g, (match) => {
            placeholders.push(`<span class="text-slate-500 italic font-mono">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });
        
        // 2. Extract Strings
        html = html.replace(/(["'`])((?:\\.|[^\\])*?)\1/g, (match) => {
            placeholders.push(`<span class="text-emerald-300 font-mono">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 3. Highlight Annotations
        html = html.replace(/(@\w+)/g, (match) => {
            placeholders.push(`<span class="text-indigo-400 font-bold">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 4. Highlight Java / C++ / Python / JS keywords
        const keywords = /\b(class|public|private|protected|static|final|void|int|double|float|long|short|byte|boolean|char|if|else|for|while|do|switch|case|default|break|continue|return|new|this|super|extends|implements|try|catch|finally|throw|throws|import|package|const|let|var|function|def|elif|from|as|include|using|namespace|std|cout|cin|endl)\b/g;
        html = html.replace(keywords, (match) => {
            placeholders.push(`<span class="text-sky-400 font-bold">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 5. Highlight Common Types & Predefined Classes
        const types = /\b(System|String|Math|Object|Scanner|List|ArrayList|Map|HashMap|Integer|Double|Float|Boolean|Character|Byte|Short|Long|Void|Exception|Thread|iostream|vector|string)\b/g;
        html = html.replace(types, (match) => {
            placeholders.push(`<span class="text-rose-400 font-bold">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 6. Highlight Method Calls (word followed by open parenthesis)
        html = html.replace(/\b(\w+)(?=\()/g, (match) => {
            placeholders.push(`<span class="text-cyan-400 font-semibold">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 7. Highlight Numbers
        html = html.replace(/\b(\d+(\.\d+)?)\b/g, (match) => {
            placeholders.push(`<span class="text-amber-400 font-medium">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 8. Highlight Operators (including C++ <<, >>, <, >)
        html = html.replace(/([+\-*/%=!&|<>:?^~]+)/g, (match) => {
            placeholders.push(`<span class="text-slate-400">${escapeHtml(match)}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 9. Escape any remaining non-placeholder code text
        html = escapeHtml(html);

        // 10. Re-insert placeholders
        let lastHtml = '';
        while (html !== lastHtml) {
            lastHtml = html;
            html = html.replace(/___PH_(\d+)___/g, (_, index) => placeholders[parseInt(index)]);
        }
        
        return { __html: html };
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
        <div className="fixed inset-0 bg-[#070b13] font-sans flex flex-col z-50 overflow-hidden select-none transition-colors text-slate-100">
            {/* Inline keyframe style block for high-immersion animations */}
            <style>{`
                @keyframes floatHolo {
                    0% { transform: translateY(40px) scale(0.6); opacity: 0; }
                    50% { opacity: 0.7; }
                    100% { transform: translateY(-70px) scale(1.1); opacity: 0; }
                }
                .animate-float-1 { animation: floatHolo 3.2s infinite ease-in-out; }
                .animate-float-2 { animation: floatHolo 4.8s infinite ease-in-out 1.2s; }
                .animate-float-3 { animation: floatHolo 3.9s infinite ease-in-out 0.6s; }
                
                @keyframes sparkAnim {
                    0% { transform: scale(0.8) rotate(0deg); opacity: 0.8; }
                    50% { transform: scale(1.25) rotate(180deg); opacity: 1; }
                    100% { transform: scale(0.8) rotate(360deg); opacity: 0.8; }
                }
                .animate-spark { animation: sparkAnim 2.5s infinite linear; }

                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 8px rgba(6, 182, 212, 0.25); border-color: rgba(6, 182, 212, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.65); border-color: rgba(6, 182, 212, 0.75); }
                }
                .animate-pulse-glow { animation: pulseGlow 2s infinite ease-in-out; }
            `}</style>

            {showSuccessModal && <SuccessModal lesson={lesson} onContinue={handleComplete} />}

            {/* Top Navigation / Coddy-style Header */}
            <header className="flex-shrink-0 h-14 bg-white dark:bg-[#181818] border-b-3 border-slate-900 dark:border-[#282828] px-4 flex items-center justify-between z-30 select-none shadow-[0_4px_0_0_#0F172A]">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="bg-rose-100 hover:bg-rose-200 border-2 border-slate-900 text-slate-900 p-1.5 rounded-full shadow-[2px_2px_0px_0px_#0F172A] transition-all cursor-pointer" title="Exit Lesson">
                        <X className="w-4 h-4 stroke-[3]" />
                    </button>
                    <span className="bg-[#FFE87C] border-2 border-slate-900 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#0F172A] flex items-center gap-1.5">
                        <span>⚡ +{lesson.xp || 150} XP</span>
                        <span>•</span>
                        <span>{path.toUpperCase()} Path</span>
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-wide hidden sm:inline">
                        {t(lesson.titleKey as any) || lesson.titleKey || 'Introduction'}
                    </span>
                </div>

                {/* Top Progress Bar */}
                <div className="flex-grow max-w-md mx-6 hidden md:flex items-center gap-3">
                    <div className="flex-grow bg-slate-100 dark:bg-[#262626] border-2 border-slate-900 h-3 rounded-full overflow-hidden shadow-[2px_2px_0px_0px_#0F172A]">
                        <div
                            className="bg-[#00D2D3] h-full transition-all duration-500 border-r-2 border-slate-900"
                            style={{ width: isCorrect ? '100%' : `${((currentLessonIndex + 1) / allLessonsInPath.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Right Header Badges & Profile */}
                <div className="flex items-center gap-3 text-xs font-black text-slate-900 dark:text-slate-200">
                    <div className="flex items-center gap-1 bg-amber-100 border-2 border-slate-900 px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#0F172A]" title="Streak Flame">
                        <span>🔥</span> <span>{(currentUser as any)?.streak || 19}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-cyan-100 border-2 border-slate-900 px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#0F172A]" title="Energy XP">
                        <span>⚡</span> <span>{currentUser?.progress?.xp || 5}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FFE87C] border-2 border-slate-900 text-slate-900 font-black text-xs flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
            </header>

            {/* Coddy Main Workspace Container */}
            <div ref={containerRef} className="flex-grow flex flex-col lg:flex-row overflow-hidden relative bg-[#1e1e1e]">
                
                {/* 0. Leftmost Narrow Icon Sidebar */}
                <aside className="hidden lg:flex w-12 bg-[#141414] border-r border-[#262626] flex-col items-center py-4 space-y-6 text-slate-500 shrink-0 select-none z-10">
                    <button 
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`hover:text-white transition-colors ${isBookmarked ? 'text-amber-400' : ''}`}
                        title="Bookmark Lesson"
                    >
                        <Bookmark className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleResetCode}
                        className="hover:text-white transition-colors"
                        title="Reset Code"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="hover:text-white transition-colors"
                        title="Editor Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <div className="flex-grow" />
                    <button 
                        onClick={() => setShowHintModal(true)}
                        className="hover:text-amber-400 text-slate-500 transition-colors text-xs font-black"
                        title="Help & Hints"
                    >
                        ?
                    </button>
                </aside>

                {/* 1. Left Panel: Theory, Instructions & Challenge */}
                <aside 
                    style={{ width: `${leftWidth}%` }}
                    className="hidden lg:flex flex-col bg-[#181818] border-r border-[#282828] p-6 overflow-y-auto space-y-6 shrink-0 text-slate-300 text-sm leading-relaxed"
                >
                    {/* Path & Expanded Detailed Lesson Introduction Header */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                                {t(lesson.titleKey as any) || lesson.titleKey || path.toUpperCase()}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#262626] text-slate-400 border border-[#333]">TL;DR</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#262626] text-slate-400 border border-[#333] cursor-pointer hover:text-white">Hide</span>
                            </div>
                        </div>

                        {/* Multi-Paragraph Detailed Concept Overview */}
                        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-normal">
                            <p>
                                {lesson.introduction || (lesson.explanationKey ? t(lesson.explanationKey as any) : `${path.toUpperCase()} is a powerful, high-performance programming language used in everything from game development and operating systems to scientific computing and artificial intelligence. It is known worldwide for its efficiency, precision, and flexibility.`)}
                            </p>
                            <p>
                                In computer science, mastering {t(lesson.titleKey as any) || lesson.titleKey || 'this concept'} builds the foundation for algorithmic thinking and structured software design. When you write and execute code in {path.toUpperCase()}, the engine compiles your statements into ordered machine instructions.
                            </p>
                            <p>
                                Understanding how syntax rules govern program state, how data is declared in memory, and how output streams interface with the system console enables you to build robust, scalable applications.
                            </p>
                        </div>

                        {/* Key Concepts Learning Card */}
                        <div className="bg-[#141414] p-3.5 rounded-xl border border-[#282828] space-y-2">
                            <h3 className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                📌 Key Concepts:
                            </h3>
                            <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                                <li><strong className="text-slate-200">Syntax & Rules:</strong> Structuring keywords and expressions correctly.</li>
                                <li><strong className="text-slate-200">Execution Flow:</strong> How control passes sequentially through statements.</li>
                                <li><strong className="text-slate-200">Console I/O:</strong> Streaming text outputs and values to standard output.</li>
                            </ul>
                        </div>

                        {/* "Here is what the starter code does:" Comprehensive Breakdown */}
                        {lesson.starterCode && lesson.starterCode.trim() && (
                            <div className="space-y-3 pt-2">
                                <h3 className="text-xs font-bold text-slate-200">Here is what the starter code does:</h3>
                                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                                    {lesson.starterCode.trim().split('\n').filter(line => line.trim().length > 0).map((line, idx) => {
                                        const trimmed = line.trim();
                                        let explanation = "executes a foundational command statement in this program.";
                                        if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
                                            explanation = "code comment explaining the objective of this step.";
                                        } else if (trimmed.startsWith('#include') || trimmed.startsWith('import ') || trimmed.startsWith('require(') || trimmed.startsWith('using ')) {
                                            explanation = "loads the library header that enables console I/O and utility functions.";
                                        } else if (trimmed.includes('main()') || trimmed.startsWith('def main') || trimmed.startsWith('fn main') || trimmed.includes('int main')) {
                                            explanation = "this is the main function, where every program starts running.";
                                        } else if (trimmed.includes('print') || trimmed.includes('cout') || trimmed.includes('console.log') || trimmed.includes('System.out')) {
                                            explanation = "prints the text or numerical values directly to the screen console.";
                                        } else if (trimmed.includes('return 0') || trimmed.includes('return;')) {
                                            explanation = "returns exit status code 0, signaling clean program completion.";
                                        } else if (trimmed.includes('=')) {
                                            explanation = "declares and initializes a variable with data in memory.";
                                        } else if (trimmed.includes('{') || trimmed.includes('}')) {
                                            explanation = "defines scope boundaries for function blocks and control logic.";
                                        }
                                        return (
                                            <div key={idx} className="flex items-start gap-2">
                                                <code className="bg-[#262626] text-amber-300 font-mono text-[11px] px-2 py-0.5 rounded border border-[#383838] shrink-0 max-w-[210px] truncate" title={trimmed}>
                                                    {trimmed}
                                                </code>
                                                <span className="text-slate-300 text-[11px] leading-tight flex-grow pt-0.5">
                                                    — {explanation}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Outcome & Execution Preview */}
                        {lesson.expectedOutput && (
                            <div className="pt-2 text-xs text-slate-300 leading-relaxed space-y-1">
                                <p className="font-semibold text-slate-200">Execution Output Preview:</p>
                                <p>
                                    When you run the code, you will see <code className="bg-[#262626] text-emerald-400 font-mono px-2 py-0.5 rounded border border-[#383838]">{lesson.expectedOutput.replace(/\n/g, ' ')}</code> appear in the output.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Challenge Section */}
                    <div className="pt-4 border-t border-[#282828] space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-base">💡</span>
                            <h2 className="text-base font-bold text-white">Challenge</h2>
                            {lesson.difficulty && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                                    {lesson.difficulty}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            {t(lesson.challengeDescriptionKey as any)}
                        </p>

                        <button 
                            onClick={() => setShowHintModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#333] border border-[#383838] text-cyan-400 text-xs font-bold transition-all cursor-pointer"
                        >
                            <span>🤖 Explain challenge</span>
                        </button>
                    </div>

                    {/* Solution Dropdown */}
                    {lesson.solutionCode && (
                        <div className="pt-2">
                            <details className="group border border-[#282828] bg-[#141414] rounded-lg overflow-hidden">
                                <summary className="px-4 py-2.5 text-xs font-bold text-slate-400 cursor-pointer flex items-center justify-between hover:text-white select-none">
                                    <span>💡 Solution</span>
                                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="p-3 bg-[#1a1a1a] font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre border-t border-[#282828]">
                                    {lesson.solutionCode}
                                </div>
                            </details>
                        </div>
                    )}
                </aside>

                {/* Left Split Pane Resizer */}
                <div 
                    onMouseDown={startResizeLeft}
                    className="hidden lg:block w-[4px] hover:w-[6px] bg-[#262626] hover:bg-cyan-500 cursor-col-resize z-10 transition-colors shrink-0"
                />

                {/* 2. Center Panel: Code Editor (Coddy style) */}
                <main className="flex-grow flex flex-col bg-[#1e1e1e] overflow-hidden relative shrink-0">
                    
                    {/* Editor File Tab Bar */}
                    <div className="h-10 bg-[#181818] border-b border-[#282828] px-4 flex items-center justify-between text-xs font-bold text-slate-400 select-none">
                        <div className="flex items-center gap-2 text-white">
                            <span className="text-cyan-400">{activeFile || 'main.ts'}</span>
                        </div>
                    </div>

                    {/* Code Editor Body */}
                    <div className="flex-grow flex relative overflow-hidden bg-[#1e1e1e]">
                        
                        {/* Editor Line Numbers Gutter */}
                        <div className="w-12 bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col items-center py-4 select-none font-mono text-xs text-slate-500 space-y-0 z-10">
                            {codeLines.map((_, i) => (
                                <div key={i} className="h-6 flex items-center justify-end w-full px-2 text-slate-500 font-mono text-xs select-none">
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Interactive Textarea & Syntax Highlight Layer */}
                        <div className="flex-grow h-full relative overflow-hidden bg-[#1e1e1e]">
                            <div 
                                ref={editorScrollRef}
                                className="absolute inset-0 p-4 pointer-events-none overflow-auto font-mono text-sm leading-6 whitespace-pre select-none bg-[#1e1e1e] text-slate-200"
                                style={{ fontSize: `${fontSize}px` }}
                                dangerouslySetInnerHTML={highlightCode(code)}
                            />
                            {!code.trim() && (
                                <div className="absolute top-4 left-4 text-slate-500/70 font-mono text-sm pointer-events-none select-none italic">
                                    // Write your solution code here...
                                </div>
                            )}
                            <textarea
                                ref={textAreaRef}
                                value={code}
                                onChange={(e) => handleCodeChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onScroll={handleScroll}
                                style={{ fontSize: `${fontSize}px` }}
                                wrap={lineWrap ? "soft" : "off"}
                                className="absolute inset-0 p-4 font-mono bg-transparent focus:outline-none resize-none text-transparent caret-cyan-400 selection:bg-cyan-500/30 overflow-auto leading-6 whitespace-pre text-sm"
                                spellCheck={false}
                            />
                        </div>

                        {/* Bottom-Right Floating Editor Action Buttons */}
                        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-3">
                            <button
                                onClick={() => setShowHintModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 border-2 border-slate-900 text-xs font-black flex items-center gap-1.5 shadow-[3px_3px_0px_0px_#0F172A] hover:bg-[#FFE87C] transition-all cursor-pointer"
                            >
                                <span>💡 Need a hint?</span>
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="px-6 py-2.5 rounded-xl bg-[#00D2D3] hover:bg-[#00c0c1] text-slate-900 border-2 border-slate-900 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_0px_#0F172A] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                            >
                                <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                                <span>{isRunning ? t('running') : t('run_code')}</span>
                            </button>
                        </div>
                    </div>

                    {/* 3. Bottom Panel: Test Cases & Console */}
                    <div className="h-48 bg-[#181818] border-t border-[#282828] flex flex-col font-mono text-xs text-slate-300">
                        <div className="h-9 bg-[#141414] border-b border-[#282828] px-4 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveConsoleTab('console')}
                                    className={`h-9 flex items-center border-b-2 ${activeConsoleTab === 'console' ? 'border-cyan-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    TEST CASES
                                </button>
                                <button 
                                    onClick={() => setActiveConsoleTab('terminal')}
                                    className={`h-9 flex items-center border-b-2 ${activeConsoleTab === 'terminal' ? 'border-cyan-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    CONSOLE
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow p-4 grid grid-cols-2 gap-4 overflow-y-auto">
                            <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Output</span>
                                <div className="text-slate-300 whitespace-pre-wrap font-mono">
                                    {output || 'No output yet. Click "Run Code" to execute.'}
                                </div>
                            </div>
                            <div className="border-l border-[#282828] pl-4">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Expected Output</span>
                                <div className="text-emerald-400 font-bold font-mono">
                                    {lesson.solutionCode ? 'Output matches expected result' : 'Ready'}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Hint Modal Overlay */}
            {showHintModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-6 text-left animate-pop-in">
                        <button
                            onClick={() => setShowHintModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2.5">
                            <span className="text-3xl"></span>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Lesson Hint & Sample</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Need a hand? Here is a sample code pattern to help you solve this lesson!</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Instruction recap */}
                            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Challenge Instruction</h4>
                                <p className="text-xs text-slate-350 font-semibold leading-relaxed">
                                    {t(lesson.challengeDescriptionKey as any)}
                                </p>
                            </div>

                            {/* Dynamic AI / DB Hint */}
                            {(lesson.hintKey || aiHint) && (
                                <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Coach Tip</h4>
                                    <p className="text-xs text-amber-300 font-semibold leading-relaxed">
                                        {aiHint || t(lesson.hintKey as any)}
                                    </p>
                                </div>
                            )}

                            {/* solutionCode blueprint */}
                            {lesson.solutionCode && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sample Code Blueprint</h4>
                                        <span className="text-[9px] text-amber-500 font-bold uppercase">Ready to use</span>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-350 border border-slate-850 overflow-x-auto whitespace-pre max-h-48 scrollbar-thin">
                                        {lesson.solutionCode}
                                    </div>
                                </div>
                            )}
                        </div>

                        {lesson.solutionCode && (
                            <button
                                onClick={() => {
                                    handleCodeChange(lesson.solutionCode);
                                    setShowHintModal(false);
                                    showToast('Sample blueprint inserted! ', 'success');
                                }}
                                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:translate-y-0.5 border-b-4 border-amber-700 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                            >
                                <span></span> Insert Sample into Editor
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonScreen;
