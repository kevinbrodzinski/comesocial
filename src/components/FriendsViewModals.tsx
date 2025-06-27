
import React from 'react';
import FriendsFiltersModal from './FriendsFiltersModal';
import MessageModal from './MessageModal';
import PingModal from './PingModal';
import AddFriendModal from './AddFriendModal';
import FriendProfileSheet from './FriendProfileSheet';
import PlanPreviewModal from './PlanPreviewModal';
import FriendManagementSheet from './FriendManagementSheet';

interface FriendsViewModalsProps {
  messageModal: any;
  onCloseMessage: () => void;
  pingModal: any;
  onClosePing: () => void;
  addFriendModal: boolean;
  onCloseAddFriend: () => void;
  friendProfileSheet: any;
  onCloseFriendProfile: () => void;
  planPreviewModal: any;
  onClosePlanPreview: () => void;
  friendManagementOpen: boolean;
  onCloseFriendManagement: () => void;
  onAddFriend: () => void;
}

const FriendsViewModals = ({
  messageModal,
  onCloseMessage,
  pingModal,
  onClosePing,
  addFriendModal,
  onCloseAddFriend,
  friendProfileSheet,
  onCloseFriendProfile,
  planPreviewModal,
  onClosePlanPreview,
  friendManagementOpen,
  onCloseFriendManagement,
  onAddFriend
}: FriendsViewModalsProps) => {
  return (
    <>
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={onCloseMessage}
        friend={messageModal.friend}
      />

      <PingModal
        isOpen={pingModal.isOpen}
        onClose={onClosePing}
        friend={pingModal.friend}
      />

      <AddFriendModal
        isOpen={addFriendModal}
        onClose={onCloseAddFriend}
      />

      <FriendProfileSheet
        isOpen={friendProfileSheet.isOpen}
        onClose={onCloseFriendProfile}
        friend={friendProfileSheet.friend}
      />

      <PlanPreviewModal
        isOpen={planPreviewModal.isOpen}
        onClose={onClosePlanPreview}
        plan={planPreviewModal.plan}
      />

      <FriendManagementSheet
        isOpen={friendManagementOpen}
        onClose={onCloseFriendManagement}
        onAddFriend={onAddFriend}
      />
    </>
  );
};

export default FriendsViewModals;
