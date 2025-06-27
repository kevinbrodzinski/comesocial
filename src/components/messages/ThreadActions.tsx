import React from 'react';
import { MessageCircle, MapPin, MoreHorizontal, Users, BellOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageThread } from '@/services/NotificationService';

interface ThreadActionsProps {
  thread: MessageThread;
  isHovered: boolean;
  onQuickReply: (thread: MessageThread, event: React.MouseEvent) => void;
  onJoinVenue: (thread: MessageThread, event: React.MouseEvent) => void;
  onMoreActions: (thread: MessageThread, event: React.MouseEvent) => void;
}

const ThreadActions = ({
  thread,
  isHovered,
  onQuickReply,
  onJoinVenue,
  onMoreActions
}: ThreadActionsProps) => {
  const isGroupChat = thread.threadType === 'group';

  return (
    <div className={`
      flex items-center justify-between transition-opacity duration-200
      ${isHovered ? 'opacity-100' : 'opacity-60'}
    `}>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => onQuickReply(thread, e)}
          className="h-7 px-2 text-xs hover:bg-accent"
        >
          <MessageCircle size={12} className="mr-1" />
        </Button>
        {thread.type === 'ping' && thread.venue && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => onJoinVenue(thread, e)}
            className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
          >
            <MapPin size={12} className="mr-1" />
          </Button>
        )}
        {isGroupChat && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              // TODO: Show group participants modal
              console.log('View participants for group:', thread.id);
            }}
            className="h-7 px-2 text-xs hover:bg-indigo-500/10 hover:text-indigo-500"
          >
            <Users size={12} className="mr-1" />
          </Button>
        )}
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        className={`
          h-7 w-7 p-0 transition-opacity duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={(e) => onMoreActions(thread, e)}
      >
        <MoreHorizontal size={12} />
      </Button>
    </div>
  );
};

export default ThreadActions;
