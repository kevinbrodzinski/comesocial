
import React from 'react';

const CrowdLevelLegend = () => {
  return (
    <div className="absolute top-4 left-2 bg-card/90 backdrop-blur border border-border rounded-lg p-3 text-xs z-30">
      <h4 className="font-semibold mb-2 text-foreground">Crowd Level</h4>
      <div className="space-y-1">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-muted-foreground">Chill</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-muted-foreground">Moderate</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <span className="text-muted-foreground">Packed</span>
        </div>
      </div>
    </div>
  );
};

export default CrowdLevelLegend;
