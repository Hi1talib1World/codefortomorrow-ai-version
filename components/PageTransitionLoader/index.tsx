
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A thin top-of-page loading bar that animates on every route change,
 * similar to YouTube/GitHub's NProgress style.
 */
const PageTransitionLoader: React.FC = () => {
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const prevPathRef = useRef(location.pathname);

    useEffect(() => {
        // Only trigger on actual route changes
        if (location.pathname === prevPathRef.current) return;
        prevPathRef.current = location.pathname;

        // Reset & start
        setProgress(0);
        setIsVisible(true);

        // Clear any previous timer
        if (timerRef.current) clearInterval(timerRef.current);

        let current = 0;
        timerRef.current = setInterval(() => {
            // Quickly go to ~85%, then slow down, simulating real loading
            if (current < 85) {
                current += Math.random() * 25 + 10;
            } else {
                current += 2;
            }

            if (current >= 100) {
                current = 100;
                if (timerRef.current) clearInterval(timerRef.current);
                // Briefly show 100% before hiding
                setProgress(100);
                setTimeout(() => {
                    setIsVisible(false);
                    setProgress(0);
                }, 300);
                return;
            }
            setProgress(Math.min(current, 98));
        }, 80);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [location.pathname]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
            <div
                className="h-full transition-all duration-100 ease-out"
                style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                    boxShadow: '0 0 10px rgba(66, 133, 244, 0.5), 0 0 5px rgba(66, 133, 244, 0.3)',
                }}
            />
        </div>
    );
};

export default PageTransitionLoader;
