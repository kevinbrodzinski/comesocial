
import React from 'react';
import { MessageCircle, Plus, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ActivityFriendCardProps {
  friend: any;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
}

const ActivityFriendCard = ({ 
  friend, 
  pingStates, 
  onOpenMessage, 
  onFriendProfileOpen, 
  onPingToJoin 
}: ActivityFriendCardProps) => {
  const getActionInfo = (action: string) => {
    switch (action) {
      case 'checked-in':
        return { label: 'Checked In', color: 'bg-green-500', icon: <MapPin size={12} /> };
      case 'on-the-way':
        return { label: 'On the Way', color: 'bg-blue-500', icon: <Clock size={12} /> };
      case 'pre-gaming':
        return { label: 'Pre-Gaming', color: 'bg-purple-500', icon: <Clock size={12} /> };
      case 'just-left':
        return { label: 'Just Left', color: 'bg-orange-500', icon: <Clock size={12} /> };
      default:
        return { label: 'Offline', color: 'bg-gray-500', icon: <Clock size={12} /> };
    }
  };

  const actionInfo = getActionInfo(friend.currentAction);

  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-all duration-200">
      {/* Left side: Avatar + Activity Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          className="relative cursor-pointer"
          onClick={() => onFriendProfileOpen(friend)}
        >
          <Avatar className="w-12 h-12 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {friend.avatar}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {friend.name}
            </h3>
            <Badge 
              className={`${actionInfo.color} text-white text-xs px-2 py-1 border-0 flex items-center space-x-1`}
            >
              {actionInfo.icon}
              <span>{actionInfo.label}</span>
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {friend.location && (
              <>
                <span className="truncate">{friend.location}</span>
                <span>•</span>
              </>
            )}
            <span className="flex items-center space-x-1">
              <Clock size={10} />
              <span>{friend.timeAgo}</span>
            </span>
          </div>
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
          title="Invite"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ActivityFriendCard;
