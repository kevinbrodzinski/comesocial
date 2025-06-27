
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChatParticipant } from '@/services/ChatService';

interface ChatParticipantsProps {
  participants: ChatParticipant[];
}

const ChatParticipants = ({ participants }: ChatParticipantsProps) => {
  const onlineCount = participants.filter(p => p.isOnline).length;
  const typingUsers = participants.filter(p => p.isTyping);

  return (
    <div className="border-b p-3 bg-muted/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Participants</span>
          <Badge variant="secondary" className="text-xs">
            {onlineCount} of {participants.length} online
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto">
        {participants.map((participant) => (
          <div key={participant.id} className="flex flex-col items-center space-y-1 min-w-0">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
              </Avatar>
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-background ${
                  participant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} 
              />
              {participant.isTyping && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-12">
              {participant.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {typingUsers.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {typingUsers.length === 1 
            ? `${typingUsers[0].name} is typing...`
            : `${typingUsers.length} people are typing...`
          }
        </div>
      )}
    </div>
  );
};

export default ChatParticipants;
