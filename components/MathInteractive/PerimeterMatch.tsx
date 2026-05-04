import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PerimeterMatchProps {
    onSuccess: () => void;
}

const shapes = [
    { id: 's1', w: 3, h: 3, perimeter: 12, isCorrect: true },
    { id: 's2', w: 4, h: 3, perimeter: 14, isCorrect: false },
    { id: 's3', w: 5, h: 2, perimeter: 14, isCorrect: false }
];

export const PerimeterMatch: React.FC<PerimeterMatchProps> = ({ onSuccess }) => {
    const { t, language } = useLanguage();
    const isRTL = language === 'ar';

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const targetPerimeter = 12;

    const handleSelect = (shape: typeof shapes[0]) => {
        if (selectedId) return; // prevent multiple clicks while animating
        
        setSelectedId(shape.id);
        if (shape.isCorrect) {
            setTimeout(onSuccess, 800);
        } else {
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setSelectedId(null);
            }, 600);
        }
    };

    return (
        <div dir="ltr" className="w-full max-w-3xl mx-auto flex flex-col items-center select-none gap-8">
            <div className="bg-white dark:bg-slate-800 px-8 py-4 rounded-3xl border-4 border-dashed border-brand-300 dark:border-brand-700 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-1">{t('math_target_perimeter' as any)}</p>
                <h3 className="text-5xl font-black text-brand-500">{targetPerimeter}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {shapes.map(shape => {
                    const isSelected = selectedId === shape.id;
                    const shakingThis = isSelected && isShaking;
                    const successThis = isSelected && shape.isCorrect;

                    // Compute generic size ratio for visuals
                    // 1 unit = 20px
                    const widthPx = shape.w * 24;
                    const heightPx = shape.h * 24;

                    return (
                        <div 
                            key={shape.id}
                            onClick={() => handleSelect(shape)}
                            className={`relative bg-white dark:bg-slate-800 p-6 rounded-3xl border-4 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 group min-h-[200px] ${
                                successThis 
                                    ? 'border-green-500 bg-green-50 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)] pointer-events-none' 
                                    : shakingThis 
                                        ? 'border-red-500 bg-red-50 animate-shake pointer-events-none' 
                                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:shadow-2xl hover:-translate-y-2'
                            }`}
                        >
                            <div className="relative flex items-center justify-center w-full h-32">
                                {/* The physical shape */}
                                <div 
                                    className={`border-4 border-dashed transition-colors ${successThis ? 'border-green-500 bg-green-100' : shakingThis ? 'border-red-500 bg-red-100' : 'border-slate-400 bg-slate-100 group-hover:border-brand-500 group-hover:bg-brand-50'}`}
                                    style={{ width: widthPx, height: heightPx }}
                                ></div>
                                
                                {/* Dimension labels */}
                                <div className={`absolute top-0 font-black text-sm transition-colors ${successThis ? 'text-green-600' : shakingThis ? 'text-red-600' : 'text-slate-500 group-hover:text-brand-600'}`}>
                                    {shape.w}
                                </div>
                                <div className={`absolute right-4 font-black text-sm transition-colors ${successThis ? 'text-green-600' : shakingThis ? 'text-red-600' : 'text-slate-500 group-hover:text-brand-600'}`}>
                                    {shape.h}
                                </div>
                            </div>
                            
                            <div className={`mt-4 font-bold rounded-full px-4 py-1 border-2 transition-all ${
                                successThis ? 'bg-green-100 border-green-500 text-green-700' :
                                shakingThis ? 'bg-red-100 border-red-500 text-red-700' :
                                'bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-brand-100 group-hover:border-brand-300 group-hover:text-brand-700'
                            }`}>
                                {t('math_select' as any)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
