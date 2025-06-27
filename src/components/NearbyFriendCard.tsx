
import React from 'react';
import { MessageCircle, Plus, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NearbyFriendCardProps {
  friend: any;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
  onLocationInvite?: (friend: any) => void;
}

const NearbyFriendCard = ({ 
  friend, 
  pingStates, 
  onOpenMessage, 
  onFriendProfileOpen, 
  onPingToJoin,
  onLocationInvite 
}: NearbyFriendCardProps) => {
  const getWalkTime = (distance: number) => {
    const minutes = Math.round(distance * 20); // ~20 min per mile walking
    return `${minutes} min walk`;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-all duration-200">
      {/* Left side: Avatar + Location Info */}
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
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {friend.location ? (
              <span className="truncate">At {friend.location}</span>
            ) : (
              <span>Nearby</span>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0">
              {friend.distanceFromUser} mi • {getWalkTime(friend.distanceFromUser)}
            </Badge>
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground"
              title="More options"
            >
              <Plus size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPingToJoin(friend)}>
              <Navigation size={14} className="mr-2" />
              Invite to join
            </DropdownMenuItem>
            {onLocationInvite && (
              <DropdownMenuItem onClick={() => onLocationInvite(friend)}>
                <MapPin size={14} className="mr-2" />
                Share location
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NearbyFriendCard;
