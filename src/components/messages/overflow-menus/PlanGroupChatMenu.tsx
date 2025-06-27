
import React from 'react';
import { 
  Bell, 
  BellOff, 
  Calendar, 
  Settings, 
  UserPlus, 
  Share2, 
  LogOut, 
  Archive
} from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface PlanGroupChatMenuProps {
  isMuted: boolean;
  onMuteToggle: () => void;
  onViewPlan?: () => void;
  onEditPlan?: () => void;
  onInviteToPlan?: () => void;
  onSharePlan?: () => void;
  onLeavePlanChat?: () => void;
  onArchivePlan?: () => void;
}

const PlanGroupChatMenu = ({
  isMuted,
  onMuteToggle,
  onViewPlan,
  onEditPlan,
  onInviteToPlan,
  onSharePlan,
  onLeavePlanChat,
  onArchivePlan
}: PlanGroupChatMenuProps) => {
  return (
    <>
      <DropdownMenuItem onClick={onMuteToggle}>
        {isMuted ? <Bell size={16} /> : <BellOff size={16} />}
        <span>{isMuted ? 'Unmute conversation' : 'Mute conversation'}</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onViewPlan}>
        <Calendar size={16} />
        <span>View shared plan</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onEditPlan}>
        <Settings size={16} />
        <span>Edit plan settings</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onInviteToPlan}>
        <UserPlus size={16} />
        <span>Invite friends to plan chat</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onSharePlan}>
        <Share2 size={16} />
        <span>Share plan link</span>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={onLeavePlanChat} className="text-destructive">
        <LogOut size={16} />
        <span>Leave plan chat</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onArchivePlan} className="text-destructive">
        <Archive size={16} />
        <span>Archive old plan</span>
      </DropdownMenuItem>
    </>
  );
};

export default PlanGroupChatMenu;
