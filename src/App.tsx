import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeDashboard from './components/HomeDashboard.jsx';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <HomeDashboard />
    </>
  );
}

