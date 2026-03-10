
import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
    value: number | string;
    duration?: number; // ms
    className?: string;
    prefix?: string;
    suffix?: string;
}

/**
 * Animates a number from 0 to the target value.
 * Non-numeric strings are rendered directly.
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 1200,
    className = '',
    prefix = '',
    suffix = '',
}) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    const isNumeric = !isNaN(numericValue);
    const [display, setDisplay] = useState<number>(0);
    const frameRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!isNumeric) return;

        const target = numericValue;
        startTimeRef.current = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - (startTimeRef.current || 0);
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [numericValue, duration, isNumeric]);

    if (!isNumeric) {
        return <span className={className}>{prefix}{value}{suffix}</span>;
    }

    return (
        <span className={className}>
            {prefix}{display.toLocaleString()}{suffix}
        </span>
    );
};

export default AnimatedCounter;
