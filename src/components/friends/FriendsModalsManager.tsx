
import React from 'react';
import FriendsViewModals from '../FriendsViewModals';
import FriendsActionModals from './FriendsActionModals';
import UserDiscoveryModal from '../UserDiscoveryModal';
import EnhancedFriendManagement from '../EnhancedFriendManagement';
import LocationSharingModal from '../location/LocationSharingModal';
import LocationSharingInvite from '../location/LocationSharingInvite';
import CreatePlanModal from '../CreatePlanModal';

interface FriendsModalsManagerProps {
  // Friends state
  messageModal: any;
  pingModal: any;
  friendProfileSheet: any;
  planPreviewModal: any;
  friendManagementOpen: boolean;
  locationSharingModalOpen: boolean;
  locationInviteModalOpen: boolean;
  selectedFriendForLocation: any;
  friends: any[];
  
  // Modal handlers
  onCloseMessage: () => void;
  onClosePing: () => void;
  onCloseFriendProfile: () => void;
  onClosePlanPreview: () => void;
  setFriendManagementOpen: (open: boolean) => void;
  setLocationSharingModalOpen: (open: boolean) => void;
  setLocationInviteModalOpen: (open: boolean) => void;
  
  // Action modals
  actionModals: any;
  
  // UI state
  userDiscoveryModal: boolean;
  setUserDiscoveryModal: (open: boolean) => void;
  createPlanModal: boolean;
  handleCreatePlanClose: () => void;
  handleCreatePlan: (planData: any) => void;
  handleCreatePlanOpen: () => void;
}

const FriendsModalsManager = ({
  messageModal,
  pingModal,
  friendProfileSheet,
  planPreviewModal,
  friendManagementOpen,
  locationSharingModalOpen,
  locationInviteModalOpen,
  selectedFriendForLocation,
  friends,
  onCloseMessage,
  onClosePing,
  onCloseFriendProfile,
  onClosePlanPreview,
  setFriendManagementOpen,
  setLocationSharingModalOpen,
  setLocationInviteModalOpen,
  actionModals,
  userDiscoveryModal,
  setUserDiscoveryModal,
  createPlanModal,
  handleCreatePlanClose,
  handleCreatePlan,
  handleCreatePlanOpen
}: FriendsModalsManagerProps) => {
  return (
    <>
      {/* Original Friends Modals */}
      <FriendsViewModals
        messageModal={messageModal}
        onCloseMessage={onCloseMessage}
        pingModal={pingModal}
        onClosePing={onClosePing}
        addFriendModal={false}
        onCloseAddFriend={() => {}}
        friendProfileSheet={friendProfileSheet}
        onCloseFriendProfile={onCloseFriendProfile}
        planPreviewModal={planPreviewModal}
        onClosePlanPreview={onClosePlanPreview}
        friendManagementOpen={false}
        onCloseFriendManagement={() => {}}
        onAddFriend={() => setUserDiscoveryModal(true)}
      />

      {/* Enhanced User Discovery Modal */}
      <UserDiscoveryModal
        isOpen={userDiscoveryModal}
        onClose={() => setUserDiscoveryModal(false)}
      />

      {/* Enhanced Friend Management */}
      <EnhancedFriendManagement
        isOpen={friendManagementOpen}
        onClose={() => setFriendManagementOpen(false)}
        onOpenUserDiscovery={() => {
          setFriendManagementOpen(false);
          setUserDiscoveryModal(true);
        }}
      />

      {/* Location Sharing Modals */}
      <LocationSharingModal
        isOpen={locationSharingModalOpen}
        onClose={() => setLocationSharingModalOpen(false)}
        friends={friends}
      />

      <LocationSharingInvite
        isOpen={locationInviteModalOpen}
        onClose={() => setLocationInviteModalOpen(false)}
        friends={friends}
        selectedFriend={selectedFriendForLocation}
      />

      {/* Action Modals */}
      <FriendsActionModals
        inviteToPlanModal={actionModals.inviteToPlanModal}
        onCloseInviteToPlan={actionModals.onCloseInviteToPlan}
        onCreateNewPlan={handleCreatePlanOpen}
        friendGroupJoinModal={actionModals.friendGroupJoinModal}
        onCloseFriendGroupJoin={actionModals.onCloseFriendGroupJoin}
        onJoinGroup={actionModals.handleJoinGroup}
        onPingGroup={actionModals.handlePingGroup}
        attendeeListModal={actionModals.attendeeListModal}
        onCloseAttendeeList={actionModals.onCloseAttendeeList}
        onMessageAll={actionModals.handleMessageAll}
        onPingAll={actionModals.handlePingAll}
        soloFriendModal={actionModals.soloFriendModal}
        onCloseSoloFriend={actionModals.onCloseSoloFriend}
        onMessageFriend={actionModals.handleMessageFriend}
        onInviteFriendToPlan={actionModals.handleInviteFriendToPlan}
        onPingFriend={actionModals.handlePingFriend}
        venueDetailModal={actionModals.venueDetailModal}
        onCloseVenueDetail={actionModals.onCloseVenueDetail}
        onJoinVenuePlan={actionModals.handleJoinVenuePlan}
        onPingVenueFriends={actionModals.handlePingVenueFriends}
        groupActionModal={actionModals.groupActionModal}
        onCloseGroupAction={actionModals.onCloseGroupAction}
        onGroupChat={actionModals.handleGroupPing}
        onStartGroupPlan={actionModals.handleStartGroupPlan}
      />

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={createPlanModal}
        onClose={handleCreatePlanClose}
        onCreatePlan={handleCreatePlan}
      />
    </>
  );
};

export default FriendsModalsManager;
