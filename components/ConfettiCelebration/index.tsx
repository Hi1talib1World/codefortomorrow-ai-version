
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
}

interface ConfettiCelebrationProps {
    isActive: boolean;
    onComplete?: () => void;
    duration?: number; // ms
}

const COLORS = ['#2E2FCE', '#EA4335', '#FBBC05', '#34A853', '#FF6D00', '#AA00FF', '#00BFA5'];

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
    isActive,
    onComplete,
    duration = 3000
}) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (!isActive) {
            setPieces([]);
            return;
        }

        // Generate confetti pieces
        const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            delay: Math.random() * 0.5,
            duration: 2 + Math.random() * 2,
            size: 6 + Math.random() * 8,
            rotation: Math.random() * 360,
        }));
        setPieces(newPieces);

        const timer = setTimeout(() => {
            setPieces([]);
            onComplete?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [isActive, duration, onComplete]);

    if (pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${piece.x}%`,
                        top: '-20px',
                        width: `${piece.size}px`,
                        height: `${piece.size * 0.6}px`,
                        backgroundColor: piece.color,
                        borderRadius: '2px',
                        transform: `rotate(${piece.rotation}deg)`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default ConfettiCelebration;
