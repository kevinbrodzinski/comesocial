import React, { useState, useRef } from 'react';
import { Pin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NotificationService, { MessageThread } from '@/services/NotificationService';
import MessageThreadAvatar from './MessageThreadAvatar';
import MessageThreadContent from './MessageThreadContent';

interface MessageThreadCardProps {
  thread: MessageThread;
  variant?: 'direct' | 'group';
  isHovered?: boolean;
  onClick?: () => void;
  onQuickReply?: (event: React.MouseEvent) => void;
  onJoinVenue?: (event: React.MouseEvent) => void;
  onMoreActions?: (event: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const MessageThreadCard = ({
  thread,
  variant = 'direct',
  isHovered = false,
  onClick,
  onQuickReply,
  onJoinVenue,
  onMoreActions,
  onMouseEnter,
  onMouseLeave
}: MessageThreadCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const notificationService = NotificationService.getInstance();

  const handleDeleteThread = (threadId: string) => {
    console.log('Delete thread:', threadId);
  };

  const handleArchiveThread = (threadId: string) => {
    console.log('Archive thread:', threadId);
  };

  const handleMuteThread = (threadId: string) => {
    console.log('Mute thread:', threadId);
  };

  const handleSearchInThread = (threadId: string) => {
    console.log('Search in thread:', threadId);
  };

  const handlePinToggle = (threadId: string, isPinned: boolean) => {
    console.log('Pin toggle:', threadId, isPinned);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow left swipe (positive offset) and limit the distance
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 80));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If swiped far enough, toggle pin
    if (swipeOffset > 40) {
      notificationService.toggleThreadPin(thread.id);
    }
    
    // Reset position
    setSwipeOffset(0);
  };

  const isGroupChat = thread.threadType === 'group' || thread.threadType === 'map-group' || variant === 'group';
  const participantCount = thread.participants?.length || 0;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 border-l-4 ${
        thread.isPinned
          ? 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10'
          : thread.unread 
            ? 'border-l-primary bg-primary/5 hover:bg-primary/10' 
            : 'border-l-transparent hover:bg-muted/50'
      } ${isHovered ? 'shadow-md' : ''} ${isGroupChat ? 'bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3 flex-1 min-w-0">
            <div className="relative">
              <MessageThreadAvatar 
                friend={thread.friend}
                isActiveAtVenue={thread.isActiveAtVenue}
              />
              {isGroupChat && participantCount > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  <Users size={8} />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center">
                <MessageThreadContent thread={thread} />
                {variant === 'group' && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Group
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Group chat indicators */}
          {isGroupChat && (
            <div className="flex-shrink-0 ml-2">
              <div className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400">
                <Users size={12} />
                <span>{participantCount}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Enhanced swipe hint overlay */}
      {swipeOffset > 10 && (
        <div 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white rounded-full p-2 shadow-lg"
          style={{ opacity: swipeOffset / 80 }}
        >
          <Pin size={16} />
        </div>
      )}
    </Card>
  );
};

export default MessageThreadCard;
