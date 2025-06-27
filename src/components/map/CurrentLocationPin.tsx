
import React from 'react';

const CurrentLocationPin = () => {
  return (
    <div className="absolute" style={{ left: '50%', top: '50%' }}>
      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pulse-glow">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
      </div>
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-500 font-medium whitespace-nowrap">
        This is you
      </div>
    </div>
  );
};

export default CurrentLocationPin;
