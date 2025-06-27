import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MessageThread } from '@/services/NotificationService';

interface MessageThreadContentProps {
  thread: MessageThread;
}

const MessageThreadContent = ({ thread }: MessageThreadContentProps) => {
  const timeAgo = formatDistanceToNow(thread.timestamp, { addSuffix: true });

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          {thread.isPinned && (
            <Pin size={12} className="text-yellow-600 fill-current" />
          )}
          <p className="font-medium text-sm truncate">{thread.friend.name}</p>
          <Badge 
            variant={thread.type === 'ping' ? 'default' : 'secondary'} 
            className="text-xs"
          >
            {thread.type}
          </Badge>
          {thread.threadType === 'group' && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Group
            </span>
          )}
          {thread.threadType === 'group' && thread.participants && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({thread.participants.length})
            </span>
          )}
          {thread.unread && (
            <div className="w-2 h-2 bg-primary rounded-full" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>

      {/* Venue info for pings */}
      {thread.venue && (
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <MapPin size={10} className="mr-1" />
          <span className="truncate">{thread.venue.name}</span>
          {thread.threadType === 'group' && (
            <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">
              • venue chat
            </span>
          )}
        </div>
      )}

      {/* Last message */}
      <p className="text-sm text-muted-foreground truncate">
        {thread.lastMessage}
      </p>
    </div>
  );
};

export default MessageThreadContent;
