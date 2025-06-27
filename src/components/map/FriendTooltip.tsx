
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, MapPin, Navigation } from 'lucide-react';

import { sendMapMessage } from '@/services/chat/sendMapMessage';
import { isFeatureEnabled } from '@/utils/featureFlags';

interface FriendTooltipProps {
  friend: any;
  onClose: () => void;
  onMessage: () => void;
  onJoinPlan: () => void;
}

const FriendTooltip = ({ friend, onClose, onMessage, onJoinPlan }: FriendTooltipProps) => {
  const handlePing = () => {
    const message = `👋 Hey ${friend.name}! Just pinged you from the map.`;
    
    if (isFeatureEnabled('map_message_center_v1')) {
      sendMapMessage({
        recipients: [{ id: friend.id, name: friend.name, avatar: friend.avatar }],
        text: message,
        venue: friend.location ? { name: friend.location, address: friend.location } : undefined
      });
      
      // Show a toast or feedback that the message was sent
      console.log(`Map ping sent to ${friend.name}`);
    } else {
      // Fallback to existing ping logic
      console.log(`Ping sent to ${friend.name}: ${message}`);
    }
    
    onClose();
  };

  return (
    <div className="bg-background border border-border rounded-md shadow-md p-4 w-64">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {friend.avatar || friend.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{friend.name}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X size={16} />
        </Button>
      </div>

      {friend.location && (
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <MapPin size={12} className="mr-1" />
          {friend.location}
        </div>
      )}

      <div className="flex items-center justify-between space-x-2">
        <Button variant="outline" size="sm" onClick={handlePing}>
          Ping
        </Button>
        <Button variant="secondary" size="sm" onClick={onMessage}>
          Message
        </Button>
        <Button variant="secondary" size="sm" onClick={onJoinPlan}>
          <Navigation size={12} className="mr-1" />
          Join
        </Button>
      </div>
    </div>
  );
};

export default FriendTooltip;
