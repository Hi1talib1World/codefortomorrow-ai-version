
import React from 'react';

const Mascot: React.FC = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32" aria-label="Friendly robot mascot">
      {/* Head */}
      <rect x="25" y="20" width="50" height="40" rx="10" fill="#4a90e2" />
      <rect x="35" y="15" width="5" height="10" rx="2.5" fill="#3468a3" transform="rotate(-30 37.5 20)" />
      <rect x="60" y="15" width="5" height="10" rx="2.5" fill="#3468a3" transform="rotate(30 62.5 20)" />

      {/* Eyes */}
      <circle cx="42" cy="40" r="7" fill="white" />
      <circle cx="43" cy="41" r="3" fill="#222" className="animate-pulse" />
      <circle cx="58" cy="40" r="7" fill="white" />
      <circle cx="59"cy="41" r="3" fill="#222" className="animate-pulse" />

      {/* Mouth */}
      <path d="M 40 50 Q 50 58 60 50" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Body */}
      <rect x="20" y="60" width="60" height="30" rx="15" fill="#d0d0d0" />
      <circle cx="50" cy="75" r="10" fill="#4a90e2" />
      <circle cx="50" cy="75" r="5" fill="#3468a3" />

      {/* Treads/Legs */}
      <rect x="20" y="85" width="20" height="10" rx="5" fill="#333" />
      <rect x="60" y="85" width="20" height="10" rx="5" fill="#333" />
    </svg>
  );
};

export default Mascot;
