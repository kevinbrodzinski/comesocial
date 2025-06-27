
import React from 'react';
import { ChevronLeft, ChevronRight, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FriendProfileHeaderProps {
  currentFriend: any;
  allFriendsAtVenue: any[];
  currentFriendIndex: number;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
  onPreviousFriend: () => void;
  onNextFriend: () => void;
  onViewProfile: () => void;
  onClose: () => void;
}

const FriendProfileHeader = ({
  currentFriend,
  allFriendsAtVenue,
  currentFriendIndex,
  canNavigatePrevious,
  canNavigateNext,
  onPreviousFriend,
  onNextFriend,
  onViewProfile,
  onClose
}: FriendProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Lateral Navigation */}
        {allFriendsAtVenue.length > 1 && (
          <div className="flex items-center space-x-2 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousFriend}
              disabled={!canNavigatePrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentFriendIndex + 1} of {allFriendsAtVenue.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextFriend}
              disabled={!canNavigateNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {currentFriend.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-xl font-bold">{currentFriend.name}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewProfile}
              className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
            >
              <User size={12} className="mr-1" />
              View Profile
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{currentFriend.activity}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
        <X size={16} />
      </Button>
    </div>
  );
};

export default FriendProfileHeader;
