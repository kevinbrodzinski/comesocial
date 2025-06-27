
import React from 'react';
import { MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessageContextBarProps {
  friend: any;
}

const MessageContextBar = ({ friend }: MessageContextBarProps) => {
  if (!friend.location && !friend.plan) return null;

  return (
    <div className="p-3 bg-secondary/30 border-b border-border">
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

export default MessageContextBar;
