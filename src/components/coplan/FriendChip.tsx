
import React from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Friend } from '@/data/friendsData';
import { cn } from '@/lib/utils';

interface FriendChipProps {
  friend: Friend;
  onRemove: (friend: Friend) => void;
  className?: string;
}

const FriendChip = ({ friend, onRemove, className }: FriendChipProps) => {
  return (
    <div className={cn(
      "flex items-center space-x-2 bg-muted rounded-lg p-2 pr-1",
      className
    )}>
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">{friend.avatar}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{friend.name}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(friend)}
        className="h-5 w-5 rounded-full hover:bg-destructive/20 hover:text-destructive"
      >
        <X size={12} />
      </Button>
    </div>
  );
};

export default FriendChip;
