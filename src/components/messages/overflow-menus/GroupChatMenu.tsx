
import React from 'react';
import { 
  Bell, 
  BellOff, 
  Users, 
  Edit, 
  Search, 
  Pin, 
  PinOff, 
  LogOut, 
  Flag
} from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface GroupChatMenuProps {
  isMuted: boolean;
  isPinned: boolean;
  onMuteToggle: () => void;
  onPinToggle: () => void;
  onManageMembers?: () => void;
  onRenameGroup?: () => void;
  onSearchInChat: () => void;
  onLeaveGroup?: () => void;
  onReportChat?: () => void;
}

const GroupChatMenu = ({
  isMuted,
  isPinned,
  onMuteToggle,
  onPinToggle,
  onManageMembers,
  onRenameGroup,
  onSearchInChat,
  onLeaveGroup,
  onReportChat
}: GroupChatMenuProps) => {
  return (
    <>
      <DropdownMenuItem onClick={onMuteToggle}>
        {isMuted ? <Bell size={16} /> : <BellOff size={16} />}
        <span>{isMuted ? 'Unmute conversation' : 'Mute conversation'}</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onManageMembers}>
        <Users size={16} />
        <span>Manage members</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onRenameGroup}>
        <Edit size={16} />
        <span>Rename group</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onSearchInChat}>
        <Search size={16} />
        <span>Search in chat</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onPinToggle}>
        {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
        <span>{isPinned ? 'Unpin' : 'Pin'}</span>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={onLeaveGroup} className="text-destructive">
        <LogOut size={16} />
        <span>Leave group</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onReportChat} className="text-destructive">
        <Flag size={16} />
        <span>Report chat</span>
      </DropdownMenuItem>
    </>
  );
};

export default GroupChatMenu;
