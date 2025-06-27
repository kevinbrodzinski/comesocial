
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageHeaderProps {
  friend: any;
  onClose: () => void;
}

const MessageHeader = ({ friend, onClose }: MessageHeaderProps) => {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
          {friend.avatar}
        </div>
        <div>
          <h2 className="font-semibold">{friend.name}</h2>
          <p className="text-xs text-muted-foreground">
            {friend.status === 'active' ? 'Active now' : friend.lastSeen}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X size={16} />
      </Button>
    </div>
  );
};

export default MessageHeader;
