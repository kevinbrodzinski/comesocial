
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import DirectChatMenu from './overflow-menus/DirectChatMenu';
import GroupChatMenu from './overflow-menus/GroupChatMenu';
import PlanGroupChatMenu from './overflow-menus/PlanGroupChatMenu';

interface ChatOverflowMenuProps {
  chatType: 'direct' | 'group' | 'plan-group';
  isGroupChat: boolean;
  isMuted: boolean;
  isPinned: boolean;
  onMuteToggle: () => void;
  onPinToggle: () => void;
  onViewProfile?: () => void;
  onBlockReport?: () => void;
  onSearchInChat: () => void;
  onDeleteThread: () => void;
  // Group chat specific
  onManageMembers?: () => void;
  onRenameGroup?: () => void;
  onLeaveGroup?: () => void;
  onReportChat?: () => void;
  // Plan-linked chat specific
  onViewPlan?: () => void;
  onEditPlan?: () => void;
  onInviteToPlan?: () => void;
  onSharePlan?: () => void;
  onLeavePlanChat?: () => void;
  onArchivePlan?: () => void;
}

const ChatOverflowMenu = ({
  chatType,
  isMuted,
  isPinned,
  onMuteToggle,
  onPinToggle,
  onViewProfile,
  onBlockReport,
  onSearchInChat,
  onDeleteThread,
  onManageMembers,
  onRenameGroup,
  onLeaveGroup,
  onReportChat,
  onViewPlan,
  onEditPlan,
  onInviteToPlan,
  onSharePlan,
  onLeavePlanChat,
  onArchivePlan
}: ChatOverflowMenuProps) => {
  const getMenuContent = () => {
    switch (chatType) {
      case 'direct':
        return (
          <DirectChatMenu
            isMuted={isMuted}
            isPinned={isPinned}
            onMuteToggle={onMuteToggle}
            onPinToggle={onPinToggle}
            onViewProfile={onViewProfile}
            onBlockReport={onBlockReport}
            onSearchInChat={onSearchInChat}
            onDeleteThread={onDeleteThread}
          />
        );
      case 'group':
        return (
          <GroupChatMenu
            isMuted={isMuted}
            isPinned={isPinned}
            onMuteToggle={onMuteToggle}
            onPinToggle={onPinToggle}
            onManageMembers={onManageMembers}
            onRenameGroup={onRenameGroup}
            onSearchInChat={onSearchInChat}
            onLeaveGroup={onLeaveGroup}
            onReportChat={onReportChat}
          />
        );
      case 'plan-group':
        return (
          <PlanGroupChatMenu
            isMuted={isMuted}
            onMuteToggle={onMuteToggle}
            onViewPlan={onViewPlan}
            onEditPlan={onEditPlan}
            onInviteToPlan={onInviteToPlan}
            onSharePlan={onSharePlan}
            onLeavePlanChat={onLeavePlanChat}
            onArchivePlan={onArchivePlan}
          />
        );
      default:
        return (
          <DirectChatMenu
            isMuted={isMuted}
            isPinned={isPinned}
            onMuteToggle={onMuteToggle}
            onPinToggle={onPinToggle}
            onViewProfile={onViewProfile}
            onBlockReport={onBlockReport}
            onSearchInChat={onSearchInChat}
            onDeleteThread={onDeleteThread}
          />
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {getMenuContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatOverflowMenu;
