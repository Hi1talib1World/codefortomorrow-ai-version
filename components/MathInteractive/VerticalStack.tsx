import React, { useState, useEffect } from 'react';

interface VerticalStackProps {
    onSuccess: () => void;
}

export const VerticalStack: React.FC<VerticalStackProps> = ({ onSuccess }) => {
    // We'll simulate:
    //   1 0
    // - 0 4
    // -----
    //   0 6 (represented as 2 inputs)
    const [digit1, setDigit1] = useState<string>(''); // Tens
    const [digit2, setDigit2] = useState<string>(''); // Ones
    const [selectedInput, setSelectedInput] = useState<1 | 2>(2);
    const [isShaking, setIsShaking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleKeypadPress = (num: string) => {
        if (selectedInput === 1) {
            setDigit1(num);
            setSelectedInput(2);
        } else {
            setDigit2(num);
            // Auto check when filled
            checkAnswer(digit1, num);
        }
    };

    const checkAnswer = (d1: string, d2: string) => {
        // Correct answer for 10 - 4 is 0 6, but maybe they just type 6 for the second digit and leave first blank.
        const d1Val = d1 || '0';
        const d2Val = d2 || '0';
        
        if (d1Val === '0' && d2Val === '6') {
            setIsSuccess(true);
            setTimeout(onSuccess, 800);
        } else if (d1Val !== '' && d2Val !== '') {
            // Full but wrong
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setDigit1('');
                setDigit2('');
                setSelectedInput(2); // reset to ones column
            }, 600);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center select-none gap-8">
            {/* The Stack */}
            <div className={`bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-4 ${isSuccess ? 'border-green-500 bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'border-slate-200 dark:border-slate-700'} ${isShaking ? 'animate-shake border-red-500' : ''} transition-all duration-300`}>
                <div className="font-mono text-5xl font-black text-slate-700 dark:text-slate-200 tracking-[1em] text-right pr-4">
                    <div className="mb-2 tracking-[0.5em] ml-8">10</div>
                    <div className="flex items-center justify-end">
                        <span className="text-red-500 mr-4 tracking-normal">-</span>
                        <span className="tracking-[0.5em]">04</span>
                    </div>
                </div>
                <div className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-full my-4"></div>
                <div className="flex justify-end gap-4 mt-4">
                    <div 
                        onClick={() => !isSuccess && setSelectedInput(1)}
                        className={`w-14 h-16 rounded-xl border-4 flex items-center justify-center text-4xl font-black cursor-pointer transition-all ${
                            isSuccess 
                                ? 'border-green-500 text-green-600 bg-white pointer-events-none' 
                                : selectedInput === 1 
                                    ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300'
                        }`}
                    >
                        {digit1}
                    </div>
                    <div 
                        onClick={() => !isSuccess && setSelectedInput(2)}
                        className={`w-14 h-16 rounded-xl border-4 flex items-center justify-center text-4xl font-black cursor-pointer transition-all ${
                            isSuccess 
                                ? 'border-green-500 text-green-600 bg-white pointer-events-none' 
                                : selectedInput === 2 
                                    ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300'
                        }`}
                    >
                        {digit2}
                    </div>
                </div>
            </div>

            {/* Numerical Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleKeypadPress(num.toString())}
                        disabled={isSuccess}
                        className="bg-white dark:bg-slate-700 h-16 rounded-2xl shadow-md border-b-4 border-slate-200 dark:border-slate-600 text-2xl font-black text-slate-700 dark:text-white hover:bg-slate-50 hover:-translate-y-1 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
                    >
                        {num}
                    </button>
                ))}
                <div className="col-start-2">
                    <button
                        onClick={() => handleKeypadPress('0')}
                        disabled={isSuccess}
                        className="w-full bg-white dark:bg-slate-700 h-16 rounded-2xl shadow-md border-b-4 border-slate-200 dark:border-slate-600 text-2xl font-black text-slate-700 dark:text-white hover:bg-slate-50 hover:-translate-y-1 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
                    >
                        0
                    </button>
                </div>
            </div>
        </div>
    );
};
