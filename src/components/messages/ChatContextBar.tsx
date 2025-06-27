
import React from 'react';
import { MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatContextBarProps {
  friend: any;
}

const ChatContextBar = ({ friend }: ChatContextBarProps) => {
  if (!friend.location && !friend.plan) {
    return null;
  }

  return (
    <div className="p-3 bg-secondary/30 border-b border-border flex-shrink-0">
      <div className="flex items-center space-x-2 text-sm">
        {friend.location && (
          <Badge variant="outline" className="text-xs">
            <MapPin size={10} className="mr-1" />
            At {friend.location}
          </Badge>
        )}
        {friend.plan && (
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            <Zap size={10} className="mr-1" />
            On {friend.plan}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatContextBar;
