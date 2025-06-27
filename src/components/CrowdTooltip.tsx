
import React from 'react';

interface CrowdTooltipProps {
  level: number;
  onClose: () => void;
}

const CrowdTooltip = ({ level, onClose }: CrowdTooltipProps) => {
  const getDescription = (level: number) => {
    if (level > 80) return 'Packed - Over 85% capacity';
    if (level > 60) return 'Buzzing - Moderate crowd';
    return 'Chill - Under 60% capacity';
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute top-full mt-2 right-0 bg-black text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap animate-in fade-in-0">
        {getDescription(level)}
        <div className="absolute -top-1 right-4 w-2 h-2 bg-black transform rotate-45"></div>
      </div>
    </>
  );
};

export default CrowdTooltip;
