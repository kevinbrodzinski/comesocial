
import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FriendCardProps {
  friend: any;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPlanPreview: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
}

const FriendCard = ({ 
  friend, 
  pingStates, 
  onOpenMessage, 
  onFriendProfileOpen, 
  onPlanPreview, 
  onPingToJoin 
}: FriendCardProps) => {
  const getStatusInfo = (friend: any) => {
    if (friend.status === 'active' && friend.plan) {
      return { label: 'Out Tonight', color: 'bg-yellow-500', textColor: 'text-yellow-100' };
    } else if (friend.status === 'active' && friend.location && !friend.plan) {
      return { label: 'Available', color: 'bg-green-500', textColor: 'text-green-100' };
    } else if (friend.status === 'active' && friend.location) {
      return { label: 'Busy', color: 'bg-red-500', textColor: 'text-red-100' };
    } else {
      return { label: 'Offline', color: 'bg-gray-500', textColor: 'text-gray-100' };
    }
  };

  const statusInfo = getStatusInfo(friend);

  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-all duration-200">
      {/* Left side: Avatar + Name + Status */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          className="relative cursor-pointer"
          onClick={() => onFriendProfileOpen(friend)}
        >
          <Avatar className="w-10 h-10 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {friend.avatar}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate mb-1">
            {friend.name}
          </h3>
          <Badge 
            className={`${statusInfo.color} ${statusInfo.textColor} text-xs px-2 py-1 border-0`}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={() => onOpenMessage(friend)}
          title="Message"
        >
          <MessageCircle size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={() => onPingToJoin(friend)}
          title="Invite to plan"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FriendCard;
