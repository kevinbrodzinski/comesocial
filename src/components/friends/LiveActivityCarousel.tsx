
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface LiveActivityCarouselProps {
  friends: any[];
  onFriendSelect: (friend: any) => void;
}

const LiveActivityCarousel = ({ friends, onFriendSelect }: LiveActivityCarouselProps) => {
  // Filter to only show active friends
  const activeFriends = friends.filter(friend => 
    friend.currentAction !== 'offline' && friend.currentAction !== 'just-left'
  );

  if (activeFriends.length === 0) {
    return null;
  }

  const getStatusColor = (action: string) => {
    switch (action) {
      case 'checked-in': return 'bg-green-500';
      case 'pre-gaming': return 'bg-orange-500';
      case 'on-the-way': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Out Tonight</h2>
        <Badge variant="purple" className="text-xs text-white">
          {activeFriends.length} active
        </Badge>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {activeFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => onFriendSelect(friend)}
          >
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-card/50 hover:bg-card transition-all duration-200 min-w-[100px] group-hover:scale-105">
              {/* Avatar with status ring */}
              <div className="relative">
                <Avatar className={`
                  w-14 h-14 ring-2 transition-all duration-200
                  ${getStatusColor(friend.currentAction)}/50 group-hover:ring-4
                `}>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {friend.avatar}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status dot */}
                <div className={`
                  absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card
                  ${getStatusColor(friend.currentAction)} animate-pulse
                `} />
              </div>
              
              {/* Name */}
              <span className="text-xs font-medium text-foreground text-center truncate w-full">
                {friend.name.split(' ')[0]}
              </span>
              
              {/* Location only */}
              {friend.location && (
                <div className="flex items-center justify-center space-x-1">
                  <MapPin size={10} className="text-primary" />
                  <span className="text-xs font-medium text-primary truncate max-w-[80px]">
                    {friend.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveActivityCarousel;
