
import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CrowdTooltip from '../CrowdTooltip';

interface FeedCardCrowdBadgeProps {
  crowdLevel: number;
  onClick: () => void;
  isTooltipOpen: boolean;
}

const FeedCardCrowdBadge = ({ crowdLevel, onClick, isTooltipOpen }: FeedCardCrowdBadgeProps) => {
  const getCrowdColor = (level: number) => {
    if (level > 80) return 'text-red-400 bg-red-50';
    if (level > 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getCrowdLabel = (level: number) => {
    if (level > 80) return 'Packed';
    if (level > 60) return 'Buzzing';
    return 'Chill';
  };

  return (
    <div className="relative">
      <Badge 
        className={`text-xs px-2 py-1 cursor-pointer ${getCrowdColor(crowdLevel)} hover:opacity-75 transition-opacity`}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Users size={10} className="mr-1" />
        {getCrowdLabel(crowdLevel)}
      </Badge>
      {isTooltipOpen && (
        <CrowdTooltip 
          level={crowdLevel} 
          onClose={onClick} 
        />
      )}
    </div>
  );
};

export default FeedCardCrowdBadge;
