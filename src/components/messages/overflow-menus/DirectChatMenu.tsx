
import React from 'react';
import { 
  Bell, 
  BellOff, 
  User, 
  Flag, 
  Search, 
  Pin, 
  PinOff, 
  Trash2
} from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DirectChatMenuProps {
  isMuted: boolean;
  isPinned: boolean;
  onMuteToggle: () => void;
  onPinToggle: () => void;
  onViewProfile?: () => void;
  onBlockReport?: () => void;
  onSearchInChat: () => void;
  onDeleteThread: () => void;
}

const DirectChatMenu = ({
  isMuted,
  isPinned,
  onMuteToggle,
  onPinToggle,
  onViewProfile,
  onBlockReport,
  onSearchInChat,
  onDeleteThread
}: DirectChatMenuProps) => {
  return (
    <>
      <DropdownMenuItem onClick={onMuteToggle}>
        {isMuted ? <Bell size={16} /> : <BellOff size={16} />}
        <span>{isMuted ? 'Unmute conversation' : 'Mute conversation'}</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onViewProfile}>
        <User size={16} />
        <span>View profile / add contact</span>
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
      
      <DropdownMenuItem onClick={onBlockReport} className="text-destructive">
        <Flag size={16} />
        <span>Block / report</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onDeleteThread} className="text-destructive">
        <Trash2 size={16} />
        <span>Delete thread</span>
      </DropdownMenuItem>
    </>
  );
};

export default DirectChatMenu;
