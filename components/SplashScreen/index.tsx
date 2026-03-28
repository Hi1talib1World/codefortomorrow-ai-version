
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to 100 over ~2.5 seconds
    const duration = 2500;
    const interval = 30;
    const step = (100 / (duration / interval));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => onFinish(), 400); // small pause at 100%
      }
      setProgress(current);
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="bg-white dark:bg-slate-900 h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#4285F4]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-[#34A853]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-48 h-48 bg-[#FBBC05]/5 rounded-full blur-3xl"></div>
      </div>


      {/* Title */}
      <div
        className="relative z-10 mb-10 transition-all duration-500"
        style={{ opacity: Math.min(progress / 40, 1) }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
          Code for <span className="text-[#4285F4]">Tomorrow</span>
        </h1>
        <p className="text-sm font-medium text-slate-400 tracking-widest uppercase">
          Learn · Create · Inspire
        </p>
      </div>

      {/* Loading Bar */}
      <div className="relative z-10 w-72 max-w-[80%]">
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335)'
            }}
          />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
          {progress < 30 ? 'Initializing...' : progress < 60 ? 'Loading resources...' : progress < 90 ? 'Almost ready...' : 'Let\'s go!'}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;