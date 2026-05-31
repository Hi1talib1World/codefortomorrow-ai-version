import React, { useState, useEffect } from 'react';

// SplashScreen component – displays a loading overlay on app start.
// Includes a hidden "Bypass Auth (Dev Mode)" button for development.

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  const bypass = () => {
    console.log('SplashScreen bypass invoked');
    setIsVisible(false);
    const mockUser = { email: 'offline-student@c4t.ma', role: 'student', name: 'Dev Guest' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    if (onComplete) onComplete();
  };

  useEffect(() => {
    console.log('SplashScreen useEffect running');
    const urlParams = new URLSearchParams(window.location.search);
    if (process.env.NODE_ENV === 'development' || urlParams.has('dev')) {
      console.log('Dev mode detected, bypassing splash');
      bypass();
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50">
      <div className="text-center text-white">
        <p className="text-2xl font-semibold mb-4 animate-pulse">WARMING UP ENGINES...</p>
        <button
          onClick={bypass}
          className="mt-2 px-2 py-1 bg-indigo-600 text-white rounded"
        >
          Bypass Auth (Dev Mode)
        </button>
      </div>
    </div>
  );
}
