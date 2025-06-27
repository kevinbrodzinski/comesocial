
import React from 'react';
import ChatWindowHeader from './ChatWindowHeader';
import ChatContextBar from './ChatContextBar';
import ChatMessages from './ChatMessages';
import ChatMessageInput from './ChatMessageInput';
import ChatSearchModal from './ChatSearchModal';
import { useChatWindowLogic } from './useChatWindowLogic';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  friend: any | null;
  threadId?: string;
}

const ChatWindow = ({ isOpen, onClose, friend, threadId }: ChatWindowProps) => {
  const {
    thread,
    messages,
    isGroupChat,
    participantCount,
    isTyping,
    isMuted,
    isSearchModalOpen,
    setIsSearchModalOpen,
    setIsMuted,
    getChatType,
    handleSendMessage
  } = useChatWindowLogic(isOpen, friend, threadId);

  if (!isOpen || !friend) return null;

  const chatType = getChatType();
  const isPinned = thread?.isPinned || false;

  // Chat overflow menu handlers
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    console.log('Toggle mute:', !isMuted);
  };

  const handlePinToggle = () => {
    if (threadId) {
      console.log('Toggle pin for thread:', threadId);
    }
  };

  const handleViewProfile = () => {
    console.log('View profile for friend:', friend?.id);
  };

  const handleBlockReport = () => {
    console.log('Block/report friend:', friend?.id);
  };

  const handleSearchInChat = () => {
    setIsSearchModalOpen(true);
  };

  const handleDeleteThread = () => {
    console.log('Delete thread:', threadId);
  };

  // Group chat handlers
  const handleManageMembers = () => {
    console.log('Manage members for group:', threadId);
  };

  const handleRenameGroup = () => {
    console.log('Rename group:', threadId);
  };

  const handleLeaveGroup = () => {
    console.log('Leave group:', threadId);
  };

  const handleReportChat = () => {
    console.log('Report chat:', threadId);
  };

  // Plan-linked chat handlers
  const handleViewPlan = () => {
    console.log('View plan for thread:', threadId);
  };

  const handleEditPlan = () => {
    console.log('Edit plan for thread:', threadId);
  };

  const handleInviteToPlan = () => {
    console.log('Invite to plan:', threadId);
  };

  const handleSharePlan = () => {
    console.log('Share plan link:', threadId);
  };

  const handleLeavePlanChat = () => {
    console.log('Leave plan chat:', threadId);
  };

  const handleArchivePlan = () => {
    console.log('Archive plan:', threadId);
  };

  const handleMessageSelect = (messageId: string) => {
    console.log('Jump to message:', messageId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center md:items-center">
      <div className="bg-background rounded-t-2xl md:rounded-2xl w-full max-w-lg mx-4 h-[90vh] md:h-[80vh] flex flex-col animate-slide-in-right md:animate-scale-in">
        {/* Header */}
        <ChatWindowHeader
          friend={friend}
          isGroupChat={isGroupChat}
          participantCount={participantCount}
          chatType={chatType}
          isMuted={isMuted}
          isPinned={isPinned}
          onClose={onClose}
          onMuteToggle={handleMuteToggle}
          onPinToggle={handlePinToggle}
          onViewProfile={handleViewProfile}
          onBlockReport={handleBlockReport}
          onSearchInChat={handleSearchInChat}
          onDeleteThread={handleDeleteThread}
          onManageMembers={handleManageMembers}
          onRenameGroup={handleRenameGroup}
          onLeaveGroup={handleLeaveGroup}
          onReportChat={handleReportChat}
          onViewPlan={handleViewPlan}
          onEditPlan={handleEditPlan}
          onInviteToPlan={handleInviteToPlan}
          onSharePlan={handleSharePlan}
          onLeavePlanChat={handleLeavePlanChat}
          onArchivePlan={handleArchivePlan}
        />

        {/* Context Bar */}
        <ChatContextBar friend={friend} />

        {/* Messages */}
        <ChatMessages
          messages={messages}
          friend={friend}
          isGroupChat={isGroupChat}
          isTyping={isTyping}
        />

        {/* Message Input */}
        <ChatMessageInput onSendMessage={handleSendMessage} />
      </div>

      {/* Search Modal */}
      <ChatSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        messages={messages}
        onMessageSelect={handleMessageSelect}
      />
    </div>
  );
};

export default ChatWindow;
