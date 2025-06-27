import React from 'react';
import { MessageThread } from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { WeekdayBadge } from '@/components/ui/weekday-badge';

interface MapThreadCardProps {
  thread: MessageThread;
  onClick: () => void;
  onJumpToMessages?: () => void;
}

const MapThreadCard: React.FC<MapThreadCardProps> = ({ 
  thread, 
  onClick, 
  onJumpToMessages 
}) => {
  const handleJumpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJumpToMessages?.();
  };

  return (
    <div
      className="flex items-start space-x-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {thread.friend.avatar || thread.friend.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {thread.unread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm truncate">
              {thread.friend.name}
            </h4>
            {thread.venue && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin size={12} className="mr-1" />
                <span className="truncate max-w-20">{thread.venue.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {thread.planTime && (
              <WeekdayBadge date={thread.planTime} />
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(thread.timestamp, { addSuffix: true })}
            </span>
            <button
              onClick={handleJumpClick}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Open in full Messages"
            >
              <ExternalLink size={12} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {thread.lastMessage}
        </p>

        {/* Participants for group threads */}
        {thread.participants && thread.participants.length > 1 && (
          <div className="flex items-center mt-2 space-x-1">
            <div className="flex -space-x-2">
              {thread.participants.slice(0, 3).map((participant, index) => (
                <Avatar key={participant.id} className="h-5 w-5 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {participant.avatar || participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {thread.participants.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{thread.participants.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapThreadCard;
