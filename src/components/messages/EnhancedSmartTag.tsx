
import React from 'react';
import { MapPin, User, Calendar } from 'lucide-react';
import { SmartReference } from '@/types/smartLinking';
import SmartTagActions from './SmartTagActions';
import { useSmartTagActions } from '@/hooks/useSmartTagActions';

interface EnhancedSmartTagProps {
  reference: SmartReference;
  className?: string;
}

const EnhancedSmartTag = ({ reference, className = '' }: EnhancedSmartTagProps) => {
  const { handleVenueAction, handleFriendAction, handlePlanAction } = useSmartTagActions();

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

  const handleAction = (action: string) => {
    switch (reference.type) {
      case 'venue':
        handleVenueAction(action, reference);
        break;
      case 'friend':
        handleFriendAction(action, reference);
        break;
      case 'plan':
        handlePlanAction(action, reference);
        break;
    }
  };

  return (
    <SmartTagActions reference={reference} onAction={handleAction}>
      <button
        className={`
          inline-flex items-center space-x-1 px-2 py-1 rounded-md 
          font-semibold text-sm transition-colors cursor-pointer border
          hover:shadow-sm ${getTagStyle(reference.type)} ${className}
        `}
        title={`${reference.name} (${reference.type}) - Click for actions`}
      >
        {getIcon(reference.type)}
        <span>@{reference.name}</span>
      </button>
    </SmartTagActions>
  );
};

export default EnhancedSmartTag;
