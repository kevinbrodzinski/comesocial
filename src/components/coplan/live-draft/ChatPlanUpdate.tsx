
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '@/services/ChatService';
import { Badge } from '@/components/ui/badge';

interface ChatPlanUpdateProps {
  message: ChatMessage;
}

const ChatPlanUpdate = ({ message }: ChatPlanUpdateProps) => {
  const getUpdateIcon = (updateType: string) => {
    switch (updateType) {
      case 'stop_added': return '📍';
      case 'stop_removed': return '🗑️';
      case 'stop_edited': return '✏️';
      case 'title_changed': return '📝';
      case 'description_changed': return '📄';
      case 'plan_locked': return '🔒';
      case 'plan_unlocked': return '🔓';
      default: return '📋';
    }
  };

  const getUpdateColor = (updateType: string) => {
    switch (updateType) {
      case 'stop_added': return 'bg-green-100 text-green-800';
      case 'stop_removed': return 'bg-red-100 text-red-800';
      case 'stop_edited': return 'bg-blue-100 text-blue-800';
      case 'title_changed': return 'bg-purple-100 text-purple-800';
      case 'description_changed': return 'bg-purple-100 text-purple-800';
      case 'plan_locked': return 'bg-orange-100 text-orange-800';
      case 'plan_unlocked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-start space-x-2 py-2">
      <Avatar className="h-6 w-6 mt-1">
        <AvatarFallback className="text-xs">{message.senderAvatar}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium">{message.senderName}</span>
          <Badge variant="secondary" className={`text-xs ${getUpdateColor(message.updateType || '')}`}>
            {getUpdateIcon(message.updateType || '')} Update
          </Badge>
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatPlanUpdate;
