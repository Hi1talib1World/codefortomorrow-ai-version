
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Lesson, ProgrammingPath } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PATHS } from '../constants';
import Mascot from './Mascot';

interface LessonScreenProps {
  lesson: Lesson;
  onComplete: (lessonId: number, xpGained: number, score?: number) => void;
  onExit: () => void;
  path: ProgrammingPath['id'];
  onSwitchPath: (pathId: ProgrammingPath['id']) => void;
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
                <h2 className="text-2xl font-black text-green-500 mb-2 uppercase tracking-tighter italic animate-bounce">{t('genius')}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-base mb-6">{t('mission_complete_msg')} <br/> <span className="text-yellow-500 font-black">+{lesson.xp} {t('star_xp_units')}</span></p>
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
                        <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-700 p-1.5 rounded-lg shadow-lg border border-sky-200 dark:border-sky-800 animate-bounce">
                           <span className="text-sm">💬</span>
                        </div>
                    )}
                    {output && (
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-2 rounded-xl rounded-bl-none shadow-xl min-w-[100px] animate-pop-in border-2 border-sky-400">
                            <p className="text-slate-800 dark:text-slate-100 font-black text-sm text-center whitespace-pre-wrap italic tracking-tighter">{output}</p>
                            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-l-2 border-sky-400 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete, onExit, path, onSwitchPath }) => {
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    setShowHint(false);
    setCode(lesson.starterCode);
    setIsCorrect(null);
    setOutput('');
    setAiHint(null);
    setMascotMood('idle');
  }, [lesson]);

  const runMagicScanner = async (failedCode: string) => {
    setIsScanning(true);
    setAiHint(null);
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are CodeBuddy, a robot teaching a child. 
            The child's code: "${failedCode}"
            Expected output: "${lesson.expectedOutput}"
            Find the mistake and explain it in 1 very simple, funny sentence. 
            Use emojis.`
        });
        setAiHint(response.text || "Something is fishy here! 🐟");
    } catch (e) {
        setAiHint("Let's check the quotes together! 🕵️");
    } finally {
        setIsScanning(false);
    }
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
  
  return (
    <div className="fixed inset-0 bg-sky-50 dark:bg-slate-900 font-sans flex flex-col z-50 overflow-hidden select-none transition-colors">
      {showSuccessModal && <SuccessModal lesson={lesson} onContinue={() => onComplete(lesson.id, lesson.xp, 100)} />}
      
      <header className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 border-b-4 border-sky-100 dark:border-slate-700 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
              <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all border-b-2 border-slate-300 active:border-b-0 active:translate-y-1 bubbly-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
              
              <div className="flex-grow mx-6">
                  <div className="bg-sky-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-inner relative">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 via-orange-500 to-green-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                        style={{ width: isCorrect ? '100%' : '30%' }}
                      ></div>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border-b-2 border-yellow-500 shadow-md font-black text-yellow-600 text-sm">
                ⭐ 190
              </div>
          </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-4 flex flex-col border-r-2 dark:border-slate-700 overflow-y-auto space-y-4">
            <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm">
                    {lesson.level}
                </div>
                <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                    {t(lesson.titleKey as any)}
                </h2>
            </div>

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
                                    className="mt-2 text-[8px] font-black text-blue-600 uppercase hover:underline"
                                >
                                    {t('use_this_code' as any) || 'Use this code'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {aiHint && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-100 dark:border-blue-800 animate-pop-in">
                    <p className="text-blue-600 dark:text-blue-300 font-bold italic text-xs">
                        <span className="text-lg mr-2">🤖</span>
                        {aiHint}
                    </p>
                </div>
            )}
            
            <div className="flex-grow"></div>
            
            <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="w-full bg-blue-600 text-white font-black py-3 rounded-xl text-base uppercase border-b-4 border-blue-800 hover:bg-blue-500 active:border-b-2 active:translate-y-1 transition-all disabled:opacity-50 bubbly-btn shadow-xl"
            >
                {isRunning ? t('running') : t('run_code')}
            </button>
        </aside>

        <main className="flex-grow p-4 overflow-y-auto bg-sky-50 dark:bg-slate-900 flex flex-col transition-colors">
            <VisualStage output={output} isCorrect={isCorrect} mood={mascotMood} code={code} />
            
            <div className="flex-grow flex flex-col bg-white dark:bg-slate-800 rounded-2xl border-2 border-white dark:border-slate-700 shadow-xl overflow-hidden kid-card">
                <div className="bg-slate-100 dark:bg-slate-700 p-2 border-b-2 dark:border-slate-600 flex items-center justify-between">
                    <span className="font-black text-slate-400 text-[8px] uppercase tracking-widest">{t('code_editor_title')}</span>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                </div>
                <textarea
                    ref={textAreaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-grow p-4 font-mono text-sm bg-transparent focus:outline-none resize-none dark:text-slate-200"
                    spellCheck={false}
                />
            </div>
        </main>
      </div>
    </div>
  );
};

export default LessonScreen;
