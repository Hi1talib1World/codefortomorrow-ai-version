
import React, { useEffect } from 'react';
import Mascot from './Mascot';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="bg-blue-500 h-screen flex flex-col items-center justify-center text-white">
      <div className="transform scale-150 mb-4">
        <Mascot />
      </div>
      <h1 className="text-5xl font-black mb-4 animate-pulse">Code Cubs</h1>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
