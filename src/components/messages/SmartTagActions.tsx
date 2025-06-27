
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MapPin, MessageSquare, User, Calendar, Heart, Navigation, UserPlus, Share2, Eye, Plus } from 'lucide-react';
import { SmartReference, SmartTagAction } from '@/types/smartLinking';

interface SmartTagActionsProps {
  reference: SmartReference;
  children: React.ReactNode;
  onAction: (action: string) => void;
}

const SmartTagActions = ({ reference, children, onAction }: SmartTagActionsProps) => {
  const getActions = (ref: SmartReference): SmartTagAction[] => {
    switch (ref.type) {
      case 'venue':
        return [
          { id: 'add-to-plan', label: 'Add to plan', icon: 'plus' },
          { id: 'get-directions', label: 'Get directions', icon: 'navigation' },
          { id: 'save-favorite', label: 'Save to favorites', icon: 'heart' }
        ];
      case 'friend':
        return [
          { id: 'message', label: 'Message', icon: 'message-square' },
          { id: 'invite-to-plan', label: 'Invite to current plan', icon: 'user-plus' },
          { id: 'view-profile', label: 'View profile', icon: 'eye' }
        ];
      case 'plan':
        return [
          { 
            id: 'join-plan', 
            label: 'Join plan', 
            icon: 'user-plus',
            disabled: ref.metadata?.isJoined || !ref.metadata?.canJoin
          },
          { id: 'view-details', label: 'View details', icon: 'eye' },
          { id: 'share', label: 'Share', icon: 'share-2' }
        ];
      default:
        return [];
    }
  };

  const getIcon = (iconName: string) => {
    const iconProps = { size: 14 };
    switch (iconName) {
      case 'plus': return <Plus {...iconProps} />;
      case 'navigation': return <Navigation {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      case 'message-square': return <MessageSquare {...iconProps} />;
      case 'user-plus': return <UserPlus {...iconProps} />;
      case 'eye': return <Eye {...iconProps} />;
      case 'share-2': return <Share2 {...iconProps} />;
      default: return null;
    }
  };

  const actions = getActions(reference);

  if (actions.length === 0) {
    return <>{children}</>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-background border shadow-lg">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={action.disabled}
            className="flex items-center space-x-2 cursor-pointer"
          >
            {action.icon && getIcon(action.icon)}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SmartTagActions;
