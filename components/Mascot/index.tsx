
import React from 'react';

const Mascot: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src="/assets/images/cofoto.png"
        alt="Friendly cat mascot"
        className="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
  );
};

export default Mascot;
