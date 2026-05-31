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
    Trash2, Copy, ChevronDown, Check, X, Eye, EyeOff,
    Cpu, Layers, Activity
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

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
                            ⚡ CONNECTING...
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
                                    {output.includes('Error') ? '⚡ SYSTEM_ERR : ERROR' : '⚙️ RUN_STDOUT : SUCCESS'}
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
        
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
        const isSimulation = !apiKey || apiKey === 'your-gemini-api-key-here';

        try {
            if (isSimulation) {
                // Let's run a smart local regex diagnostics rule set
                await new Promise(resolve => setTimeout(resolve, 800)); // simulation delay
                
                const lower = failedCode.toLowerCase();
                
                // 1. Check brackets mismatch
                const openCurly = (failedCode.match(/\{/g) || []).length;
                const closeCurly = (failedCode.match(/\}/g) || []).length;
                if (openCurly !== closeCurly) {
                    setAiHint(`It looks like you have a bracket mismatch! You have ${openCurly} open curly braces '{' and ${closeCurly} closing braces '}'. Double check that every block is closed properly! 🧩`);
                    return;
                }
                
                // 2. Check parenthesis mismatch
                const openParen = (failedCode.match(/\(/g) || []).length;
                const closeParen = (failedCode.match(/\)/g) || []).length;
                if (openParen !== closeParen) {
                    setAiHint(`Parenthesis mismatch detected! Make sure every open '(' has a matching closing ')' in your code. 🔍`);
                    return;
                }

                // 3. Check for quotes mismatch
                const singleQuotes = (failedCode.match(/'/g) || []).length;
                const doubleQuotes = (failedCode.match(/"/g) || []).length;
                if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
                    setAiHint(`You have an unclosed string value! Check your quotation marks ('' or "") to ensure strings are fully closed. 💬`);
                    return;
                }

                // 4. Check for print statement in Python
                if (path === 'python' && !failedCode.includes('print(')) {
                    setAiHint(`In Python, you need to output results using print(). Example:\n\`print("your_output")\`\nMake sure you are calling the print function! 🔁`);
                    return;
                }

                // 5. Check for console.log in JavaScript
                if (path === 'javascript' && !failedCode.includes('console.log(')) {
                    setAiHint(`In JavaScript, you need to output results using console.log(). Example:\n\`console.log(your_result);\`\nMake sure to call console.log! ⚡`);
                    return;
                }

                // Generic fallback
                setAiHint(`The output did not match "${lesson.expectedOutput}". Double-check your logic to make sure you are calculating and printing the correct result! 💡`);
            } else {
                // Call Google GenAI directly
                const ai = new GoogleGenAI({ apiKey });
                const promptText = `You are a helpful and encouraging coding teacher for children (ages 8-15) on the "Code for Tomorrow" platform. 
The student is working on a lesson about: "${lesson.titleKey}".
Their goal is to write code that outputs EXACTLY: "${lesson.expectedOutput}".
They wrote the following code which failed:
\`\`\`
${failedCode}
\`\`\`
Provide a concise, encouraging hint (1-2 sentences) of what is wrong and how they can fix it.
Do not give them the complete solution code directly. Focus on guidance and debug clues.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [{ role: 'user', parts: [{ text: promptText }] }],
                });
                
                setAiHint(response.text || "Let's review the code logic together! 💡");
            }
        } catch (e) {
            console.error('Magic Scanner Error:', e);
            setAiHint("Let's review the code logic together! 💡");
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
        let html = rawCode
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        const placeholders: string[] = [];
        
        // 1. Extract Comments (block comments and line comments) to protect them from regex highlighting
        html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/.*|#.*)/g, (match) => {
            placeholders.push(`<span class="text-slate-500 italic font-mono">${match}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });
        
        // 2. Extract Strings
        html = html.replace(/(["'`])((?:\\.|[^\\])*?)\1/g, (match) => {
            placeholders.push(`<span class="text-emerald-300 font-mono">${match}</span>`);
            return `___PH_${placeholders.length - 1}___`;
        });

        // 3. Highlight Annotations
        html = html.replace(/(@\w+)/g, '<span class="text-indigo-400 font-bold">$1</span>');

        // 4. Highlight Java / standard keywords
        const keywords = /\b(class|public|private|protected|static|final|void|int|double|float|long|short|byte|boolean|char|if|else|for|while|do|switch|case|default|break|continue|return|new|this|super|extends|implements|try|catch|finally|throw|throws|import|package|const|let|var|function|def|elif|from|as)\b/g;
        html = html.replace(keywords, '<span class="text-sky-400 font-bold">$1</span>');

        // 5. Highlight Common Types & Predefined Classes (capitalized words like System, String, Math, etc.)
        const types = /\b(System|String|Math|Object|Scanner|List|ArrayList|Map|HashMap|Integer|Double|Float|Boolean|Character|Byte|Short|Long|Void|Exception|Thread)\b/g;
        html = html.replace(types, '<span class="text-rose-400 font-bold">$1</span>');

        // 6. Highlight Method Calls (word followed by open parenthesis)
        html = html.replace(/\b(\w+)(?=\()/g, '<span class="text-cyan-400 font-semibold">$1</span>');

        // 7. Highlight Numbers
        html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-amber-400 font-medium">$1</span>');

        // 8. Highlight Operators
        html = html.replace(/([+\-*/%=!&|<>:?^~]+)/g, '<span class="text-slate-400">$1</span>');

        // 9. Re-insert strings and comments in reverse order
        html = html.replace(/___PH_(\d+)___/g, (_, index) => placeholders[parseInt(index)]);
        
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

            {/* Top Navigation / Progress Header */}
            <header className="flex-shrink-0 bg-[#0b0f19] border-b border-slate-800 p-3 shadow-lg">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-slate-900 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-slate-850 active:translate-y-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex-grow mx-6 flex items-center gap-4">
                        <div className="flex-grow bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 shadow-inner relative">
                            <div
                                className="bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-500 h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                                style={{ width: isCorrect ? '100%' : `${((currentLessonIndex + 1) / allLessonsInPath.length) * 100}%` }}
                            ></div>
                        </div>
                        {aiContext?.recommendation && (
                            <div className="flex items-center gap-2 bg-cyan-950/20 px-3 py-1 rounded-full border border-cyan-500/30 animate-pulse">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span className="text-[9px] font-black text-cyan-300 uppercase tracking-wider">HOLO ASSISTANT</span>
                            </div>
                        )}
                    </div>

                    <div 
                        onMouseEnter={() => setIsXpHovered(true)}
                        onMouseLeave={() => setIsXpHovered(false)}
                        className="relative bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shadow-md font-bold text-yellow-500 text-xs flex items-center gap-1 cursor-pointer transition-all hover:scale-105 hover:border-yellow-500/20"
                    >
                        <span>⭐</span> {currentUser?.progress?.xp || 0} XP
                        {isXpHovered && (
                            <>
                                <span className="absolute -top-1 -right-1 text-xs animate-spark select-none pointer-events-none">✨</span>
                                <span className="absolute -bottom-1 -left-1 text-[10px] animate-spark select-none pointer-events-none" style={{ animationDelay: '0.6s' }}>✨</span>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Three-column IDE Panel Container */}
            <div ref={containerRef} className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
                
                {/* 1. Left Panel: Instructions, Objectives & Test Cases */}
                <aside 
                    style={{ width: `${leftWidth}%` }}
                    className="hidden lg:flex flex-col bg-[#0b0f19]/90 border-r border-slate-850 p-4 overflow-y-auto space-y-4 shrink-0"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 px-2.5 py-1 rounded-lg font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.25)] animate-pulse-glow">
                                Level {lesson.level}
                            </div>
                            <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                                {t(lesson.titleKey as any)}
                            </h2>
                        </div>
                        <button 
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-1.5 rounded-lg border transition-all ${isBookmarked ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'border-slate-850 hover:border-slate-700 text-slate-500 hover:text-white'}`}
                            title="Save for Later"
                        >
                            <Bookmark className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {lesson.difficulty && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border 
                                ${lesson.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  lesson.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                {lesson.difficulty}
                            </span>
                        )}
                        {lesson.estimatedMinutes && (
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[9px] font-bold flex items-center gap-1">
                                ⏱️ {lesson.estimatedMinutes} min
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-bold flex items-center gap-1">
                            ⭐ {lesson.xp} XP
                        </span>
                    </div>

                    {/* Rich Theory / Explanation */}
                    {lesson.explanationKey && (
                        <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-slate-800 text-5xl transform rotate-12 select-none pointer-events-none opacity-20">💡</div>
                            <div className="relative z-10 flex flex-col gap-2">
                                <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Concept Guide
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    {t(lesson.explanationKey as any)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Challenge Prompt */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('challenge')}</h3>
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
                        <p className="text-xs font-semibold text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-850">
                            {t(lesson.challengeDescriptionKey as any)}
                        </p>
                    </div>

                    {/* Dynamic Interactive Test Cases */}
                    <div className="border border-slate-850 rounded-xl bg-slate-950/85 overflow-hidden">
                        <button 
                            onClick={() => setIsTestCasesExpanded(!isTestCasesExpanded)}
                            className="w-full flex items-center justify-between p-3 bg-[#0b0f19] border-b border-slate-850 font-black text-[10px] text-slate-400 uppercase tracking-wider"
                        >
                            <span className="flex items-center gap-1.5">🎯 Test Cases Checklist</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTestCasesExpanded ? 'transform rotate-180' : ''}`} />
                        </button>
                        {isTestCasesExpanded && (
                            <ul className="p-3 space-y-2">
                                {testCases.map((tc) => (
                                    <li key={tc.id} className="flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-900/50 px-2.5 py-2 rounded border border-slate-850/40">
                                        <span>{tc.desc}</span>
                                        {tc.status ? (
                                            <span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-cyan-500/20">
                                                <Check className="w-3 h-3" /> PASS
                                            </span>
                                        ) : (
                                            <span className="text-slate-555 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-slate-700">
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
                    <div className="space-y-3 pt-4 border-t border-slate-800/80">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handlePrevLesson}
                                disabled={!onStartLesson || currentLessonIndex <= 0}
                                className="bg-slate-900/40 hover:bg-cyan-500/10 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-white disabled:opacity-20 font-bold py-2.5 rounded-xl text-xs uppercase transition-all flex items-center justify-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.07)]"
                            >
                                <ChevronLeft className="w-4 h-4 text-cyan-400" /> Previous
                            </button>
                            <button
                                onClick={handleNextLesson}
                                disabled={!onStartLesson || currentLessonIndex >= allLessonsInPath.length - 1}
                                className="bg-slate-900/40 hover:bg-cyan-500/10 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-white disabled:opacity-20 font-bold py-2.5 rounded-xl text-xs uppercase transition-all flex items-center justify-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.07)]"
                            >
                                Next <ChevronRight className="w-4 h-4 text-cyan-400" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={handleResetCode}
                                className="bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white font-bold py-2 rounded-xl text-[10px] uppercase transition-all flex items-center justify-center gap-1"
                                title="Reset Code"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="col-span-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-2 rounded-xl text-xs uppercase transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] active:translate-y-0.5"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                {isRunning ? t('running') : t('run_code')}
                            </button>
                        </div>

                        {/* Relocated Expandable Learning Objectives Accordion with icons */}
                        {lesson.objectivesKey && (
                            <div className="border border-slate-850 rounded-xl bg-slate-950/60 overflow-hidden mt-2">
                                <button 
                                    onClick={() => setIsObjectivesExpanded(!isObjectivesExpanded)}
                                    className="w-full flex items-center justify-between p-3 bg-[#0b0f19] border-b border-slate-850 font-black text-[10px] text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
                                >
                                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyan-400" /> Learning Objectives</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isObjectivesExpanded ? 'transform rotate-180' : ''}`} />
                                </button>
                                {isObjectivesExpanded && (
                                    <ul className="p-3 space-y-2.5">
                                        {((t(lesson.objectivesKey as any) as string) || '').split('|').map((objective, idx) => {
                                            let icon = "⚙️"; // default
                                            const lowercaseObj = objective.toLowerCase();
                                            if (lowercaseObj.includes('jvm') || lowercaseObj.includes('compile') || lowercaseObj.includes('run') || lowercaseObj.includes('execut')) {
                                                icon = "⚙️";
                                            } else if (lowercaseObj.includes('variable') || lowercaseObj.includes('data') || lowercaseObj.includes('type')) {
                                                icon = "📦";
                                            } else if (lowercaseObj.includes('syntax') || lowercaseObj.includes('code') || lowercaseObj.includes('error') || lowercaseObj.includes('trace')) {
                                                icon = "🔍";
                                            } else if (lowercaseObj.includes('class') || lowercaseObj.includes('method') || lowercaseObj.includes('object') || lowercaseObj.includes('main')) {
                                                icon = "🎛️";
                                            } else if (lowercaseObj.includes('print') || lowercaseObj.includes('output') || lowercaseObj.includes('console')) {
                                                icon = "🖥️";
                                            }
                                            return (
                                                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                                    <span className="text-sm shrink-0 leading-none">{icon}</span>
                                                    <span className="font-semibold leading-relaxed">{objective}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Left Split Pane Resizer */}
                <div 
                    onMouseDown={startResizeLeft}
                    className="hidden lg:block w-[4px] hover:w-[6px] bg-slate-850 hover:bg-cyan-500 cursor-col-resize z-10 transition-colors shrink-0"
                />

                {/* 2. Center Panel: Code Editor (Multi-file tabs, Autocomplete, preference controls) */}
                <main className="flex-grow flex flex-col bg-[#070b13] overflow-hidden relative shrink-0">
                    
                    {/* Multi-File Tab Header Bar */}
                    <div className="bg-[#0b0f19] border-b border-slate-850 p-2 flex items-center justify-between z-20">
                        <div className="flex items-center space-x-1">
                            {Object.keys(files).map((filename) => (
                                <button
                                    key={filename}
                                    onClick={() => handleSwitchFile(filename)}
                                    className={`px-5 py-2.5 rounded-t-lg text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
                                        activeFile === filename
                                            ? 'bg-slate-950 border-cyan-400 text-cyan-300 shadow-[0_-4px_12px_rgba(6,182,212,0.12)]'
                                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
                                    }`}
                                >
                                    <span>{filename}</span>
                                    <span 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="text-[10px] text-slate-600 hover:text-rose-450 hover:bg-rose-500/10 p-0.5 rounded transition-all ml-1 w-3.5 h-3.5 flex items-center justify-center font-bold"
                                    >
                                        ×
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Right Header Toolbar Items */}
                        <div className="flex items-center gap-3">
                            {/* Autocomplete active dot */}
                            <button 
                                onClick={() => setIsAutocompleteEnabled(!isAutocompleteEnabled)}
                                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold border transition-colors ${
                                    isAutocompleteEnabled 
                                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
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
                                    className={`p-1.5 rounded-lg border transition-all ${showSettings ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white'}`}
                                    title="Editor Preferences"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                </button>

                                {/* Preferences dropdown */}
                                {showSettings && (
                                    <div className="absolute right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-xl w-60 text-slate-300 font-sans text-xs space-y-4">
                                        <h4 className="font-black text-white uppercase tracking-wider text-[10px]">Editor Settings</h4>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Font Size ({fontSize}px)</label>
                                            <input 
                                                type="range" min="12" max="20" step="2"
                                                value={fontSize} 
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full accent-cyan-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Keybindings</label>
                                            <select 
                                                value={keybindings} 
                                                onChange={(e) => setKeybindings(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-850 rounded p-1.5 font-bold text-white text-xs"
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
                                                        className={`py-1 rounded border text-xs font-bold transition-all ${tabSpacing === spacing ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400' : 'bg-slate-950 border-slate-850 text-slate-400'}`}
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

                    {/* Main Workspace Text Editor with Synchronized Highlight Layer */}
                    <div className="flex-grow flex relative overflow-hidden bg-slate-950/80">
                        
                        {/* Custom gutter supporting fold indicators and active breakpoints */}
                        <div className="w-14 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col items-center py-4 select-none font-mono text-xs text-slate-500 space-y-0 z-10">
                            {codeLines.map((lineContent, i) => {
                                const isFoldable = lineContent.trim().endsWith('{') || lineContent.trim().endsWith('[') || lineContent.trim().endsWith('(');
                                const isFolded = foldedLines.has(i);
                                const hasBreakpoint = breakpoints.has(i);
                                return (
                                    <div key={i} className="h-6 flex items-center justify-between w-full px-2 relative group/gutter cursor-pointer select-none">
                                        <button
                                            onClick={() => {
                                                setBreakpoints(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(i)) {
                                                        next.delete(i);
                                                    } else {
                                                        next.add(i);
                                                    }
                                                    return next;
                                                });
                                            }}
                                            className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                                                hasBreakpoint 
                                                    ? 'bg-rose-500 border-rose-455 shadow-[0_0_10px_#ef4444] animate-pulse scale-110' 
                                                    : 'border-transparent bg-transparent group-hover/gutter:bg-rose-500/20 group-hover/gutter:border-rose-500/40'
                                            }`}
                                            title="Toggle Breakpoint"
                                        />
                                        <span className={`text-[10px] text-right w-full font-bold select-none tracking-tighter ${hasBreakpoint ? 'text-rose-400 font-extrabold shadow-sm' : 'text-slate-500 opacity-40 group-hover/gutter:opacity-85 transition-opacity'}`}>
                                            {i + 1}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Gutter option controls overlay at top right */}
                        <div className="absolute top-2 right-4 z-10 flex gap-2">
                            <button
                                onClick={() => setLineWrap(!lineWrap)}
                                className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors ${lineWrap ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                                title="Toggle Line Wrap"
                            >
                                Wrap
                            </button>
                        </div>

                        {/* Interactive scroll-synchronized layers */}
                        <div className="flex-grow h-full relative overflow-hidden">
                            {/* Syntax Highlighting Layer */}
                            <div 
                                ref={editorScrollRef}
                                className="absolute inset-0 p-4 pointer-events-none overflow-auto font-mono text-sm leading-6 whitespace-pre select-none bg-transparent"
                                style={{ 
                                    fontSize: `${fontSize}px`,
                                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px), radial-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
                                    backgroundSize: '24px 24px, 24px 24px, 12px 12px'
                                }}
                                dangerouslySetInnerHTML={highlightCode(code)}
                            />
                            {/* Input text-area layer (text invisible, caret active) */}
                            <textarea
                                ref={textAreaRef}
                                value={code}
                                onChange={(e) => handleCodeChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onScroll={handleScroll}
                                style={{ fontSize: `${fontSize}px` }}
                                wrap={lineWrap ? "soft" : "off"}
                                className="absolute inset-0 p-4 font-mono bg-transparent focus:outline-none resize-none text-transparent caret-cyan-400 selection:bg-cyan-500/20 overflow-auto leading-6 whitespace-pre font-mono text-sm"
                                spellCheck={false}
                                placeholder="Write your code here..."
                            />
                        </div>
                    </div>
                </main>

                {/* Right Split Pane Resizer */}
                <div 
                    onMouseDown={startResizeRight}
                    className="hidden lg:block w-[4px] hover:w-[6px] bg-slate-850 hover:bg-cyan-500 cursor-col-resize z-10 transition-colors shrink-0"
                />

                {/* 3. Right Panel: Visualizer Stage, Switchable Console/Terminal & Metrics */}
                <aside 
                    style={{ width: `${rightWidth}%` }}
                    className="hidden lg:flex flex-col bg-[#0b0f19]/90 border-l border-slate-850 p-4 shrink-0 overflow-y-auto space-y-4"
                >
                    {/* Visualizer mascot card */}
                    <VisualStage output={output} isCorrect={isCorrect} mood={mascotMood} code={code} />

                    {/* AI Hint Card */}
                    {aiHint && (
                        <div className="bg-slate-950 border border-cyan-500/50 p-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pop-in relative overflow-hidden backdrop-blur-md">
                            <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                            <div className="flex gap-2.5 items-start">
                                <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-cyan-400 text-[10px] font-black uppercase tracking-wider mb-0.5">AI Code Doctor</h4>
                                    <p className="text-slate-200 text-[11px] leading-relaxed whitespace-pre-line">{aiHint}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setAiHint(null)} 
                                className="absolute top-2 right-2 text-slate-500 hover:text-white p-0.5 rounded cursor-pointer border-0 bg-transparent"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Console / Terminal Container */}
                    <div className="flex-grow flex flex-col bg-slate-950 border border-slate-850 rounded-xl overflow-hidden font-mono text-xs text-slate-350 min-h-[250px] shadow-inner">
                        {/* Terminal Tab Bar */}
                        <div className="bg-[#0b0f19] p-2 border-b border-slate-850 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveConsoleTab('console')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${activeConsoleTab === 'console' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Console Output
                                </button>
                                <button
                                    onClick={() => setActiveConsoleTab('terminal')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${activeConsoleTab === 'terminal' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                    className="p-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-white transition-colors"
                                    title="Copy Console Output"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setOutputHistory([])}
                                    className="p-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-white transition-colors"
                                    title="Clear Console"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Console Pane */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-3">
                            {activeConsoleTab === 'console' ? (
                                outputHistory.length === 0 ? (
                                    <div className="opacity-40 italic">Waiting for compiler trigger...</div>
                                ) : (
                                    outputHistory.map((item) => (
                                        <div key={item.id} className="border-b border-white/5 pb-2.5 mb-2.5 last:border-0 last:mb-0">
                                            <div className="flex items-center justify-between text-[9px] opacity-40 mb-1">
                                                <span>❯ Run #{item.id}</span>
                                                <span className="bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-[8px] tracking-widest font-black text-cyan-500">LOG</span>
                                            </div>
                                            {item.text.includes('Error') ? (
                                                <div className="border-l-4 border-red-500/80 bg-gradient-to-r from-red-950/20 to-transparent p-3 rounded-r-lg flex items-start gap-2.5 text-red-400 font-mono text-[11px] leading-relaxed shadow-[0_2px_8px_rgba(239,68,68,0.05)] border-t border-b border-r border-slate-900/50">
                                                    <span className="shrink-0 text-red-500 font-black animate-pulse flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                                                        SYS_ERR:
                                                    </span>
                                                    <span className="whitespace-pre-wrap">{item.text}</span>
                                                </div>
                                            ) : (
                                                <div className={`whitespace-pre-wrap text-[11px] font-medium ${
                                                    item.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                                                }`}>
                                                    {item.text}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )
                            ) : (
                                <div className="space-y-1.5 font-mono text-xs">
                                    <div className="text-slate-500">// Simulated Sandboxed Environment</div>
                                    <div className="text-cyan-400">cft-sandbox@main:~# node run index.ts</div>
                                    {output ? (
                                        <div className="text-slate-200 font-semibold">{output}</div>
                                    ) : (
                                        <div className="opacity-45 italic text-[11px]">Terminal active. Run code to feed standard output.</div>
                                    )}
                                    <div className="text-cyan-400">cft-sandbox@main:~# <span className="animate-pulse">_</span></div>
                                </div>
                            )}
                        </div>

                        {/* Execution performance metrics footer with small bar graphs */}
                        {executionMetrics && (
                            <div className="bg-[#0b0f19] border-t border-slate-850 px-3 py-2 text-[10px] text-slate-500 flex items-center justify-between select-none">
                                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" /> V8 Engine Status</span>
                                <span className="font-bold text-slate-400 uppercase flex flex-wrap items-center gap-3">
                                    <span className="flex items-center gap-1.5">
                                        ⏱️ Runtime: <strong className="text-cyan-400 font-mono font-black">{executionMetrics.time}ms</strong>
                                        <svg className="w-6 h-3 text-cyan-500/80" viewBox="0 0 24 12" fill="none">
                                            <rect x="1" y="8" width="3" height="4" fill="currentColor" opacity="0.3" />
                                            <rect x="5" y="6" width="3" height="6" fill="currentColor" opacity="0.5" />
                                            <rect x="9" y="4" width="3" height="8" fill="currentColor" opacity="0.7" />
                                            <rect x="13" y="2" width="3" height="10" fill="currentColor" />
                                            <line x1="1" y1="2" x2="20" y2="2" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" opacity="0.4" />
                                        </svg>
                                    </span>
                                    <span className="w-[1px] h-3 bg-slate-800" />
                                    <span className="flex items-center gap-1.5">
                                        💾 RAM: <strong className="text-cyan-400 font-mono font-black">{executionMetrics.memory}MB</strong>
                                        <svg className="w-6 h-3 text-cyan-500/80" viewBox="0 0 24 12" fill="none">
                                            <rect x="1" y="9" width="3" height="3" fill="currentColor" opacity="0.4" />
                                            <rect x="5" y="7" width="3" height="5" fill="currentColor" opacity="0.4" />
                                            <rect x="9" y="8" width="3" height="4" fill="currentColor" opacity="0.4" />
                                            <rect x="13" y="5" width="3" height="7" fill="currentColor" />
                                            <path d="M1 9 L5 7 L9 8 L13 5" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                    </span>
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
