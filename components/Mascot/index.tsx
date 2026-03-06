
import React from 'react';

const Mascot: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .mascot-animation {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      <img 
        src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png" 
        alt="Friendly cat mascot" 
        className="w-full h-full object-contain mascot-animation drop-shadow-2xl"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default Mascot;
