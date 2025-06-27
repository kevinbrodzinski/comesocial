
import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FeedCardCrowdBadge from './FeedCardCrowdBadge';

interface FeedCardHeaderProps {
  friend: string;
  friendAvatar: string;
  timePosted: string;
  crowdLevel: number;
  onUserClick: () => void;
  onCrowdClick: () => void;
  onStopPropagation: (e: React.MouseEvent) => void;
  isCrowdTooltipOpen: boolean;
}

const FeedCardHeader = ({
  friend,
  friendAvatar,
  timePosted,
  crowdLevel,
  onUserClick,
  onCrowdClick,
  onStopPropagation,
  isCrowdTooltipOpen
}: FeedCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:opacity-75 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onUserClick();
        }}
      >
        <Avatar className="w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
          <AvatarImage src={friendAvatar} alt={friend} />
          <AvatarFallback>{friend.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm hover:text-primary transition-colors">@{friend}</p>
          <p className="text-xs text-muted-foreground">{timePosted}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <FeedCardCrowdBadge
          crowdLevel={crowdLevel}
          onClick={onCrowdClick}
          isTooltipOpen={isCrowdTooltipOpen}
        />
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted/50"
          onClick={onStopPropagation}
        >
          <MoreHorizontal size={14} />
        </Button>
      </div>
    </div>
  );
};

export default FeedCardHeader;
