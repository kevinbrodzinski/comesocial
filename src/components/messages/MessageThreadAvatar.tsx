
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageThread } from '@/services/NotificationService';

interface MessageThreadAvatarProps {
  friend: MessageThread['friend'];
  isActiveAtVenue?: boolean;
}

const MessageThreadAvatar = ({ friend, isActiveAtVenue }: MessageThreadAvatarProps) => {
  return (
    <div className="relative">
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback className="bg-primary/10 text-primary">
          {friend.avatar || friend.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      {isActiveAtVenue && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
      )}
    </div>
  );
};

export default MessageThreadAvatar;
