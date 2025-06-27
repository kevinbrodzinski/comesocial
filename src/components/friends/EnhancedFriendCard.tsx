
import React, { useMemo, useCallback } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import VibeBadge from '@/components/vibe/VibeBadge';

interface EnhancedFriendCardProps {
  friend: any;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
  onSoloFriendAction: (friend: any) => void;
  variant: 'activity' | 'nearby' | 'all';
}

const EnhancedFriendCard = React.memo(({
  friend,
  pingStates,
  onOpenMessage,
  onFriendProfileOpen,
  onPingToJoin,
  onSoloFriendAction,
  variant
}: EnhancedFriendCardProps) => {
  const pingState = useMemo(() => pingStates[friend.id] || 'idle', [pingStates, friend.id]);
  const isOffline = useMemo(() => friend.currentAction === 'offline', [friend.currentAction]);

  const statusInfo = useMemo(() => {
    const getStatusColor = (action: string) => {
      switch (action) {
        case 'checked-in': return 'bg-green-500/20 text-green-600 border-green-500/30';
        case 'on-the-way': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
        case 'pre-gaming': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
        case 'just-left': return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
        case 'offline': return 'bg-muted text-muted-foreground border-muted';
        default: return 'bg-primary/20 text-primary border-primary/30';
      }
    };

    const getStatusText = (action: string) => {
      switch (action) {
        case 'checked-in': return 'Checked In';
        case 'on-the-way': return 'On The Way';
        case 'pre-gaming': return 'Pre-Gaming';
        case 'just-left': return 'Just Left';
        case 'offline': return 'Offline';
        default: return 'Active';
      }
    };

    return {
      color: getStatusColor(friend.currentAction),
      text: getStatusText(friend.currentAction)
    };
  }, [friend.currentAction]);

  const cardClassName = useMemo(() => 
    `p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
      isOffline 
        ? 'bg-muted/20 border-muted/30' 
        : 'bg-card/50 border-border hover:border-primary/30'
    }`,
    [isOffline]
  );

  // Memoize callback handlers
  const handleProfileClick = useCallback(() => {
    onFriendProfileOpen(friend);
  }, [onFriendProfileOpen, friend]);

  const handleMessageClick = useCallback(() => {
    onOpenMessage(friend);
  }, [onOpenMessage, friend]);

  const showDistanceInfo = useMemo(() => 
    variant === 'nearby' && friend.distanceFromUser,
    [variant, friend.distanceFromUser]
  );

  return (
    <div className={cardClassName}>
      <div className="flex items-center justify-between">
        {/* Friend Info */}
        <div className="flex items-center space-x-3 flex-1">
          <div 
            className="cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={handleProfileClick}
          >
            <Avatar className="w-12 h-12 border-2 border-card ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {friend.avatar}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{friend.name}</h3>
              <Badge className={`text-xs ${statusInfo.color}`}>
                {statusInfo.text}
              </Badge>
            </div>

            {/* Vibe Display */}
            {friend.currentVibe && (
              <div className="mb-2">
                <VibeBadge userVibe={friend.currentVibe} size="sm" showCustomText />
              </div>
            )}

            {/* Activity and Location */}
            <div className="space-y-1">
              {!isOffline && friend.location && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin size={12} />
                  <span className="truncate">{friend.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock size={12} />
                <span className="truncate">
                  {isOffline ? `Last seen ${friend.timeAgo}` : friend.activity}
                </span>
              </div>

              {showDistanceInfo && (
                <p className="text-xs text-primary font-medium">
                  {friend.distanceFromUser} mi away
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-200"
            onClick={handleMessageClick}
            title="Send message"
          >
            <MessageCircle size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
});

EnhancedFriendCard.displayName = 'EnhancedFriendCard';

export default EnhancedFriendCard;
