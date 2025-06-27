
import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AllFriendCardProps {
  friend: any;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
}

const AllFriendCard = ({ 
  friend, 
  pingStates, 
  onOpenMessage, 
  onFriendProfileOpen, 
  onPingToJoin 
}: AllFriendCardProps) => {
  const getCompactStatus = (friend: any) => {
    if (friend.status === 'active' && friend.plan) {
      return { label: 'Out Tonight', color: 'bg-yellow-500' };
    } else if (friend.status === 'active') {
      return { label: 'Available', color: 'bg-green-500' };
    } else {
      return { label: 'Offline', color: 'bg-gray-500' };
    }
  };

  const statusInfo = getCompactStatus(friend);

  return (
    <div className="flex items-center justify-between p-2 bg-card border border-border rounded-lg hover:border-primary/30 transition-all duration-200">
      {/* Compact Layout: Avatar + Name + Status */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          className="cursor-pointer"
          onClick={() => onFriendProfileOpen(friend)}
        >
          <Avatar className="w-8 h-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {friend.avatar}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground text-sm truncate">
              {friend.name}
            </span>
            <span className="text-muted-foreground text-xs">—</span>
            <Badge 
              className={`${statusInfo.color} text-white text-xs px-2 py-0 border-0`}
            >
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Compact Action buttons */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-7 h-7 p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={() => onOpenMessage(friend)}
          title="Message"
        >
          <MessageCircle size={14} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-7 h-7 p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={() => onPingToJoin(friend)}
          title="Invite"
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
};

export default AllFriendCard;
