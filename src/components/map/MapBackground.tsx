
import React from 'react';

const MapBackground = () => {
  return (
    <>
      {/* Grid overlay for map feel */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-slate-600"></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MapBackground;
