import React, { useState, useEffect } from 'react';

interface PerimeterGridProps {
    onSuccess: () => void;
}

export const PerimeterGrid: React.FC<PerimeterGridProps> = ({ onSuccess }) => {
    const targetPerimeter = 20;
    const GRID_SIZE = 10;
    
    const [startCell, setStartCell] = useState<{ x: number, y: number } | null>(null);
    const [endCell, setEndCell] = useState<{ x: number, y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleMouseDown = (x: number, y: number) => {
        if (isSuccess) return;
        setIsDragging(true);
        setStartCell({ x, y });
        setEndCell({ x, y });
    };

    const handleMouseEnter = (x: number, y: number) => {
        if (!isDragging || isSuccess) return;
        setEndCell({ x, y });
    };

    const handleMouseUp = () => {
        if (!isDragging || isSuccess) return;
        setIsDragging(false);
        checkWin();
    };

    // Calculate current width and height
    let w = 0;
    let h = 0;
    if (startCell && endCell) {
        w = Math.abs(endCell.x - startCell.x) + 1;
        h = Math.abs(endCell.y - startCell.y) + 1;
    }
    const currentPerimeter = (w + h) * 2;

    const checkWin = () => {
        if (currentPerimeter === targetPerimeter && w > 0 && h > 0) {
            setIsSuccess(true);
            setTimeout(onSuccess, 1000);
        } else {
            // Reset if incorrect
            setTimeout(() => {
                setStartCell(null);
                setEndCell(null);
            }, 500);
        }
    };

    return (
        <div 
            className="w-full max-w-2xl mx-auto flex flex-col items-center select-none"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="flex w-full justify-between items-end mb-6 px-4">
                <div className="text-left">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Target</p>
                    <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl text-2xl font-black text-slate-700 dark:text-slate-200 border-b-4 border-slate-300 dark:border-slate-600">
                        {targetPerimeter}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-brand-500 font-bold uppercase tracking-widest text-xs mb-1">Current</p>
                    <div className={`px-6 py-2 rounded-xl text-3xl font-black border-b-4 transition-all ${
                        isSuccess 
                            ? 'bg-green-500 border-green-700 text-white animate-pulse' 
                            : currentPerimeter === targetPerimeter 
                                ? 'bg-yellow-400 border-yellow-600 text-white' 
                                : 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-900/30 dark:border-brand-800'
                    }`}>
                        {currentPerimeter}
                    </div>
                </div>
            </div>

            <div className={`p-4 rounded-3xl border-4 transition-colors ${
                isSuccess ? 'border-green-500 bg-green-50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-brand-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-xl'
            }`}>
                <div 
                    className="grid gap-1"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                    onMouseLeave={handleMouseUp} // fallback
                >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                        const x = idx % GRID_SIZE;
                        const y = Math.floor(idx / GRID_SIZE);
                        
                        let inSelection = false;
                        if (startCell && endCell) {
                            const minX = Math.min(startCell.x, endCell.x);
                            const maxX = Math.max(startCell.x, endCell.x);
                            const minY = Math.min(startCell.y, endCell.y);
                            const maxY = Math.max(startCell.y, endCell.y);
                            inSelection = x >= minX && x <= maxX && y >= minY && y <= maxY;
                        }

                        return (
                            <div
                                key={idx}
                                onMouseDown={() => handleMouseDown(x, y)}
                                onMouseEnter={() => handleMouseEnter(x, y)}
                                className={`w-8 h-8 md:w-12 md:h-12 rounded-lg border-2 cursor-pointer transition-all duration-150 ${
                                    inSelection 
                                        ? isSuccess 
                                            ? 'bg-green-400 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] scale-105 z-10'
                                            : 'bg-brand-400 border-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-105 z-10'
                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600'
                                }`}
                            ></div>
                        );
                    })}
                </div>
            </div>
            <p className="mt-6 text-slate-400 font-bold text-sm">
                Click and drag to draw an energy field.
            </p>
        </div>
    );
};
