
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface FriendCompanionsProps {
  otherFriendsAtVenue: any[];
  onFriendClick: (friend: any) => void;
}

const FriendCompanions = ({ otherFriendsAtVenue, onFriendClick }: FriendCompanionsProps) => {
  if (otherFriendsAtVenue.length === 0) return null;

  return (
    <div>
      <h3 className="font-medium mb-3 text-sm text-muted-foreground">Who they're with</h3>
      <div className="flex items-center space-x-3">
        <div className="flex -space-x-2">
          {otherFriendsAtVenue.slice(0, 4).map((friendWith, index) => (
            <Avatar 
              key={friendWith.id} 
              className="w-12 h-12 border-2 border-background cursor-pointer hover:scale-105 transition-transform hover:z-10"
              onClick={() => onFriendClick(friendWith)}
            >
              <AvatarImage src={friendWith.avatar} alt={friendWith.name} />
              <AvatarFallback className="text-sm">{friendWith.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {otherFriendsAtVenue.slice(0, 2).map(f => f.name.split(' ')[0]).join(', ')}
          {otherFriendsAtVenue.length > 2 && ` +${otherFriendsAtVenue.length - 2} more`}
        </div>
      </div>
    </div>
  );
};

export default FriendCompanions;
