
import React from 'react';
import { User, Calendar, MapPin, Bell, AlertTriangle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getFeatureFlag } from '@/utils/featureFlags';

interface FriendPingOverflowMenuProps {
  children: React.ReactNode;
  friend: {
    id: string;
    name: string;
  };
  threadId?: string;
  isLocationShared?: boolean;
  isMuted?: boolean;
  hasActivePlans?: boolean;
  onViewProfile: () => void;
  onInviteToPlan: () => void;
  onToggleLocation: () => void;
  onToggleMute: () => void;
  onReportBlock: () => void;
  onDeleteConversation: () => void;
}

const FriendPingOverflowMenu = ({
  children,
  friend,
  threadId,
  isLocationShared = false,
  isMuted = false,
  hasActivePlans = false,
  onViewProfile,
  onInviteToPlan,
  onToggleLocation,
  onToggleMute,
  onReportBlock,
  onDeleteConversation,
}: FriendPingOverflowMenuProps) => {
  // Check feature flag
  if (!getFeatureFlag('overflow-menu-pass-01')) {
    return <>{children}</>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background border border-border shadow-md rounded-xl p-1"
        sideOffset={8}
      >
        <DropdownMenuItem onClick={onViewProfile} className="cursor-pointer">
          <User size={16} className="mr-2" />
          View Profile
        </DropdownMenuItem>
        
        {hasActivePlans && (
          <DropdownMenuItem onClick={onInviteToPlan} className="cursor-pointer">
            <Calendar size={16} className="mr-2" />
            Invite to Plan…
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={onToggleLocation} className="cursor-pointer">
          <MapPin size={16} className="mr-2" />
          {isLocationShared ? 'Stop Sharing' : 'Share My Location'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onToggleMute} className="cursor-pointer">
          <Bell size={16} className="mr-2" />
          {isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onReportBlock} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <AlertTriangle size={16} className="mr-2" />
          Report / Block
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onDeleteConversation} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FriendPingOverflowMenu;
