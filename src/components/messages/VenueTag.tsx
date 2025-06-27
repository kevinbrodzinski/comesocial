
import React from 'react';
import { MapPin } from 'lucide-react';

interface VenueTagProps {
  venueName: string;
  venueId?: number;
  onClick?: () => void;
  className?: string;
}

const VenueTag = ({ venueName, venueId, onClick, className = '' }: VenueTagProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-md 
        bg-primary/10 hover:bg-primary/20 text-primary font-semibold 
        text-sm transition-colors cursor-pointer border border-primary/20
        hover:border-primary/40 ${className}
      `}
      title={`View ${venueName}`}
    >
      <MapPin size={12} />
      <span>@{venueName}</span>
    </button>
  );
};

export default VenueTag;
