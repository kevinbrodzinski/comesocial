
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit3 } from 'lucide-react';
import { DraftPresence } from '@/types/liveDraftTypes';

interface PresenceStripProps {
  presence: DraftPresence[];
  currentUserId: number;
}

const TypingPulse = () => (
  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
  </div>
);

const PresenceStrip = ({ presence, currentUserId }: PresenceStripProps) => {
  const activeUsers = presence.filter(p => p.is_active);
  const currentUser = presence.find(p => p.user_id === currentUserId);

  return (
    <div className="h-12 border-b bg-muted/20 flex items-center px-4 space-x-2">
      <span className="text-sm text-muted-foreground mr-2">
        {activeUsers.length} active
      </span>
      
      <div className="flex items-center space-x-1">
        {/* Current user first */}
        {currentUser && (
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="text-xs">{currentUser.avatar}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
            {currentUser.editing_field && (
              <>
                <Edit3 size={10} className="absolute -top-1 -right-1 text-primary" />
                <TypingPulse />
              </>
            )}
          </div>
        )}

        {/* Other active users */}
        {activeUsers
          .filter(user => user.user_id !== currentUserId)
          .slice(0, 4)
          .map((user) => (
            <div key={user.user_id} className="relative">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
              {user.editing_field && (
                <>
                  <Edit3 size={10} className="absolute -top-1 -right-1 text-blue-500" />
                  <TypingPulse />
                </>
              )}
            </div>
          ))}

        {/* Show count if more users */}
        {activeUsers.length > 5 && (
          <Badge variant="secondary" className="h-8 text-xs">
            +{activeUsers.length - 5}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PresenceStrip;
