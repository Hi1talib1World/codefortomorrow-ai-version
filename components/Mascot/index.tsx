
import React from 'react';

const Mascot: React.FC = () => {
  return (
    <>
      {/*
        Animations for the mascot to make it feel more alive.
        - float: A gentle up-and-down hovering motion for the body.
        - blink: A periodic blinking animation for the eyes.
      */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .mascot-hover-group {
          animation: float 4s ease-in-out infinite;
        }
        .mascot-pupil {
          transform-origin: center;
          animation: blink 3.5s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="0 0 100 100" className="w-32 h-32" aria-label="Friendly cat mascot">
        {/* Group for the hovering parts */}
        <g className="mascot-hover-group">
          {/* Ears */}
          <path d="M 25 35 L 35 15 L 45 35 Z" fill="#f39c12" />
          <path d="M 55 35 L 65 15 L 75 35 Z" fill="#f39c12" />
          <path d="M 28 33 L 35 20 L 42 33 Z" fill="#ffccd5" />
          <path d="M 58 33 L 65 20 L 72 33 Z" fill="#ffccd5" />

          {/* Head */}
          <circle cx="50" cy="45" r="25" fill="#f39c12" />

          {/* Eyes */}
          <circle cx="40" cy="42" r="6" fill="white" />
          <circle cx="40" cy="42" r="3" fill="#222" className="mascot-pupil" style={{ animationDelay: '0.2s' }}/>
          <circle cx="60" cy="42" r="6" fill="white" />
          <circle cx="60" cy="42" r="3" fill="#222" className="mascot-pupil" />

          {/* Nose */}
          <path d="M 48 50 L 52 50 L 50 53 Z" fill="#e74c3c" />

          {/* Whiskers */}
          <line x1="35" y1="52" x2="20" y2="50" stroke="#222" strokeWidth="1" />
          <line x1="35" y1="55" x2="20" y2="58" stroke="#222" strokeWidth="1" />
          <line x1="65" y1="52" x2="80" y2="50" stroke="#222" strokeWidth="1" />
          <line x1="65" y1="55" x2="80" y2="58" stroke="#222" strokeWidth="1" />

          {/* Mouth */}
          <path d="M 45 55 Q 50 60 55 55" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Body */}
          <rect x="30" y="65" width="40" height="30" rx="15" fill="#f39c12" />
          
          {/* Paws */}
          <circle cx="40" cy="90" r="5" fill="#f39c12" />
          <circle cx="60" cy="90" r="5" fill="#f39c12" />
        </g>

        {/* Tail (static) */}
        <path d="M 70 80 Q 85 80 85 65" stroke="#f39c12" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
};

export default Mascot;
