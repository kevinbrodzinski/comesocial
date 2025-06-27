
import React, { useState } from 'react';
import { Plus, UserPlus, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FriendsActionsMenuProps {
  onFriendManagement: () => void;
  onAddFriend: () => void;
  onCreateGroupPlan?: () => void;
}

const FriendsActionsMenu = ({
  onFriendManagement,
  onAddFriend,
  onCreateGroupPlan
}: FriendsActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-primary hover:bg-primary/80 text-primary-foreground h-9 px-3"
          size="sm"
        >
          <Plus size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onAddFriend} className="cursor-pointer">
          <UserPlus size={16} className="mr-2" />
          Discover People
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onFriendManagement} className="cursor-pointer">
          <Users size={16} className="mr-2" />
          Manage Friends
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateGroupPlan} className="cursor-pointer">
          <Calendar size={16} className="mr-2" />
          Create Group Plan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FriendsActionsMenu;
