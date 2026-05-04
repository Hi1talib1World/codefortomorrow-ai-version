import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MatchPairsProps {
    onSuccess: () => void;
}

const leftItems = [
    { id: 'l1', text: '6 + 5' },
    { id: 'l2', text: '10 - 4' },
    { id: 'l3', text: '7 + 7' },
    { id: 'l4', text: '12 - 3' }
];

const rightItems = [
    { id: 'r1', text: '11', matchId: 'l1' },
    { id: 'r2', text: '6', matchId: 'l2' },
    { id: 'r3', text: '14', matchId: 'l3' },
    { id: 'r4', text: '9', matchId: 'l4' }
];

// Shuffle right items to make it a game
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

export const MatchPairs: React.FC<MatchPairsProps> = ({ onSuccess }) => {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    const [shuffledRight, setShuffledRight] = useState(rightItems);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [shakeId, setShakeId] = useState<string | null>(null);

    useEffect(() => {
        setShuffledRight(shuffleArray([...rightItems]));
    }, []);

    useEffect(() => {
        if (selectedLeft && selectedRight) {
            const rightItem = shuffledRight.find(r => r.id === selectedRight);
            if (rightItem && rightItem.matchId === selectedLeft) {
                // Match!
                setMatchedPairs(prev => [...prev, selectedLeft]);
                setSelectedLeft(null);
                setSelectedRight(null);
            } else {
                // Incorrect
                setShakeId(selectedLeft + '-' + selectedRight);
                setTimeout(() => {
                    setShakeId(null);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                }, 600);
            }
        }
    }, [selectedLeft, selectedRight, shuffledRight]);

    useEffect(() => {
        if (matchedPairs.length === leftItems.length) {
            setTimeout(onSuccess, 500);
        }
    }, [matchedPairs, onSuccess]);

    return (
        <div dir="ltr" className="w-full max-w-2xl mx-auto flex gap-8 select-none relative">
            {/* Left Column — expressions */}
            <div className="flex-1 flex flex-col gap-4">
                {leftItems.map(item => {
                    const isMatched = matchedPairs.includes(item.id);
                    const isSelected = selectedLeft === item.id;
                    const isShaking = shakeId?.startsWith(item.id + '-');

                    return (
                        <div
                            key={item.id}
                            onClick={() => !isMatched && setSelectedLeft(item.id)}
                            className={`p-6 rounded-2xl text-center text-xl font-black cursor-pointer transition-all duration-300 border-4 shadow-lg ${
                                isMatched 
                                    ? 'opacity-0 scale-95 pointer-events-none' 
                                    : isSelected 
                                        ? 'border-brand-500 bg-brand-100 text-brand-700 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105' 
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:shadow-xl hover:-translate-y-1'
                            } ${isShaking ? 'animate-shake border-red-500 text-red-500 bg-red-50' : ''}`}
                        >
                            {item.text}
                        </div>
                    );
                })}
            </div>

            {/* Right Column — answers */}
            <div className="flex-1 flex flex-col gap-4">
                {shuffledRight.map(item => {
                    const isMatched = matchedPairs.includes(item.matchId);
                    const isSelected = selectedRight === item.id;
                    const isShaking = shakeId?.endsWith('-' + item.id);

                    return (
                        <div
                            key={item.id}
                            onClick={() => !isMatched && setSelectedRight(item.id)}
                            className={`p-6 rounded-2xl text-center text-xl font-black cursor-pointer transition-all duration-300 border-4 shadow-lg ${
                                isMatched 
                                    ? 'opacity-0 scale-95 pointer-events-none' 
                                    : isSelected 
                                        ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105' 
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1'
                            } ${isShaking ? 'animate-shake border-red-500 text-red-500 bg-red-50' : ''}`}
                        >
                            {item.text}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
