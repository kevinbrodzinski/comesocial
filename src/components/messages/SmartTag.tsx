
import React from 'react';
import { MapPin, User, Calendar } from 'lucide-react';
import { SmartReference } from '@/types/smartLinking';

interface SmartTagProps {
  reference: SmartReference;
  onClick?: () => void;
  className?: string;
}

const SmartTag = ({ reference, onClick, className = '' }: SmartTagProps) => {
  const getTagStyle = (type: string) => {
    switch (type) {
      case 'venue':
        return 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 hover:border-purple-300';
      case 'friend':
        return 'bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-200 hover:border-teal-300';
      case 'plan':
        return 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200 hover:border-orange-300';
      default:
        return 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/40';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'venue': return <MapPin size={12} />;
      case 'friend': return <User size={12} />;
      case 'plan': return <Calendar size={12} />;
      default: return null;
    }
  };

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
        font-semibold text-sm transition-colors cursor-pointer border
        ${getTagStyle(reference.type)} ${className}
      `}
      title={`View ${reference.name} (${reference.type})`}
    >
      {getIcon(reference.type)}
      <span>@{reference.name}</span>
    </button>
  );
};

export default SmartTag;
