
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FriendPresence } from '@/hooks/useSocialIntelligence';

interface FriendAvatarClusterProps {
  friends: FriendPresence[];
  maxDisplay?: number;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const FriendAvatarCluster = ({ 
  friends, 
  maxDisplay = 3, 
  showStatus = false,
  size = 'sm' 
}: FriendAvatarClusterProps) => {
  const displayFriends = friends.slice(0, maxDisplay);
  const remainingCount = friends.length - maxDisplay;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  };

  const offsetClasses = {
    sm: '-ml-1',
    md: '-ml-2',
    lg: '-ml-2'
  };

  if (friends.length === 0) return null;

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {displayFriends.map((friend, index) => (
          <div 
            key={friend.id} 
            className={`relative ${index > 0 ? offsetClasses[size] : ''}`}
            style={{ zIndex: displayFriends.length - index }}
          >
            <Avatar className={`${sizeClasses[size]} ring-2 ring-background`}>
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback className="text-xs">{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {showStatus && friend.status === 'on-the-way' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full ring-2 ring-background" />
            )}
            {showStatus && friend.status === 'checked-in' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full ring-2 ring-background" />
            )}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <Badge 
            variant="outline" 
            className={`${offsetClasses[size]} ${sizeClasses[size]} rounded-full text-xs bg-muted/80 border-2 border-background px-0 flex items-center justify-center`}
          >
            +{remainingCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FriendAvatarCluster;
