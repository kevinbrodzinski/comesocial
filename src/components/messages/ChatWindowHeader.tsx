
import React from 'react';
import { ChevronLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatOverflowMenu from './ChatOverflowMenu';

interface ChatWindowHeaderProps {
  friend: any;
  isGroupChat: boolean;
  participantCount: number;
  chatType: 'direct' | 'group' | 'plan-group';
  isMuted: boolean;
  isPinned: boolean;
  onClose: () => void;
  onMuteToggle: () => void;
  onPinToggle: () => void;
  onViewProfile: () => void;
  onBlockReport: () => void;
  onSearchInChat: () => void;
  onDeleteThread: () => void;
  onManageMembers?: () => void;
  onRenameGroup?: () => void;
  onLeaveGroup?: () => void;
  onReportChat?: () => void;
  onViewPlan?: () => void;
  onEditPlan?: () => void;
  onInviteToPlan?: () => void;
  onSharePlan?: () => void;
  onLeavePlanChat?: () => void;
  onArchivePlan?: () => void;
}

const ChatWindowHeader = ({
  friend,
  isGroupChat,
  participantCount,
  chatType,
  isMuted,
  isPinned,
  onClose,
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
}: ChatWindowHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <ChevronLeft size={16} />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={friend.avatar} />
            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">{friend.name}</h3>
            {isGroupChat && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users size={10} className="mr-1" />
                <span>{participantCount} participants</span>
              </div>
            )}
            {!isGroupChat && friend.location && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users size={10} className="mr-1" />
                <span>{friend.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {isGroupChat && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              console.log('View group participants');
            }}
          >
            <Users size={16} />
          </Button>
        )}
        
        <ChatOverflowMenu
          chatType={chatType}
          isGroupChat={isGroupChat}
          isMuted={isMuted}
          isPinned={isPinned}
          onMuteToggle={onMuteToggle}
          onPinToggle={onPinToggle}
          onViewProfile={onViewProfile}
          onBlockReport={onBlockReport}
          onSearchInChat={onSearchInChat}
          onDeleteThread={onDeleteThread}
          onManageMembers={onManageMembers}
          onRenameGroup={onRenameGroup}
          onLeaveGroup={onLeaveGroup}
          onReportChat={onReportChat}
          onViewPlan={onViewPlan}
          onEditPlan={onEditPlan}
          onInviteToPlan={onInviteToPlan}
          onSharePlan={onSharePlan}
          onLeavePlanChat={onLeavePlanChat}
          onArchivePlan={onArchivePlan}
        />
      </div>
    </div>
  );
};

export default ChatWindowHeader;
