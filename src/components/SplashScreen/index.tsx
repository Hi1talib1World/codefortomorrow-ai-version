import React, { useState, useEffect } from 'react';

// SplashScreen component – displays a loading overlay on app start.
// Includes a hidden "Bypass Auth (Dev Mode)" button for development.

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  // Development bypass: automatically skip splash in dev mode.
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      bypass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bypass = () => {
    setIsLoading(false);
    // Inject mock user session for offline dev testing.
    const mockUser = {
      email: 'offline-student@c4t.ma',
      role: 'student',
      name: 'Dev Guest',
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    // Optionally, you could trigger any app‑wide state updates here.
  };

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50">
      <div className="text-center text-white">
        <p className="text-2xl font-semibold mb-4 animate-pulse">WARMING UP ENGINES...</p>
        {/* Hidden dev‑bypass button – appears on hover for discoverability */}
        <button
          onClick={bypass}
          className="absolute top-2 right-2 text-xs opacity-0 hover:opacity-100 transition-opacity"
        >
          Bypass Auth (Dev Mode)
        </button>
      </div>
    </div>
  );
}
