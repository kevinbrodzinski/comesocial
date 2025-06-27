
import React from 'react';
import LayoutManager from '../layout/LayoutManager';
import FriendsViewHeader from '../FriendsViewHeader';
import FriendsViewContent from './FriendsViewContent';
import QuickActionsMenu from './QuickActionsMenu';
import FriendsModalsManager from './FriendsModalsManager';

interface FriendsViewPresentationProps {
  // Friends data and state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  friends: any[];
  sortedFriends: any[];
  individualFriends: any[];
  searchQuery: string;
  searchExpanded: boolean;
  setSearchExpanded: (expanded: boolean) => void;
  activeFilters: string[];
  activeVibeFilters: string[];
  locationPermission: 'denied' | 'granted' | 'pending' | null;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  friendRequests: any;
  searchHistory: string[];
  tabs: any[];
  
  // Modal states
  messageModal: any;
  pingModal: any;
  friendProfileSheet: any;
  planPreviewModal: any;
  friendManagementOpen: boolean;
  locationSharingModalOpen: boolean;
  locationInviteModalOpen: boolean;
  selectedFriendForLocation: any;
  
  // Handlers
  handleFriendManagement: () => void;
  handleSearchChange: (query: string) => void;
  handleFilterToggle: (filter: string) => void;
  handleVibeFilterToggle: (vibeId: string) => void;
  handleLocationSharingOpen: () => void;
  handleFriendProfileOpen: (friend: any) => void;
  handleOpenMessage: (friend: any) => void;
  handlePingToJoin: (friend: any) => void;
  handleGroupMessage: (groupFriends: any[]) => void;
  handleGroupPing: (groupFriends: any[]) => void;
  handleInviteNearby: () => void;
  requestLocation: () => void;
  handleLocationInviteOpen: (friend?: any) => void;
  handleCloseMessage: () => void;
  handleClosePing: () => void;
  handleFriendProfileClose: () => void;
  setFriendManagementOpen: (open: boolean) => void;
  setLocationSharingModalOpen: (open: boolean) => void;
  setLocationInviteModalOpen: (open: boolean) => void;
  setPlanPreviewModal: (modal: { isOpen: boolean; plan: any }) => void;
  
  // Additional props from container
  actionModals: any;
  userDiscoveryModal: boolean;
  setUserDiscoveryModal: (open: boolean) => void;
  createPlanModal: boolean;
  handleCreatePlanClose: () => void;
  handleCreatePlanOpen: () => void;
  handleCreatePlan: (planData: any) => void;
  handleMessagesNavigation: () => void;
}

const FriendsViewPresentation = ({
  activeTab,
  setActiveTab,
  friends,
  sortedFriends,
  individualFriends,
  searchQuery,
  searchExpanded,
  setSearchExpanded,
  activeFilters,
  activeVibeFilters,
  locationPermission,
  pingStates,
  friendRequests,
  searchHistory,
  tabs,
  messageModal,
  pingModal,
  friendProfileSheet,
  planPreviewModal,
  friendManagementOpen,
  locationSharingModalOpen,
  locationInviteModalOpen,
  selectedFriendForLocation,
  handleFriendManagement,
  handleSearchChange,
  handleFilterToggle,
  handleVibeFilterToggle,
  handleLocationSharingOpen,
  handleFriendProfileOpen,
  handleOpenMessage,
  handlePingToJoin,
  handleGroupMessage,
  handleGroupPing,
  handleInviteNearby,
  requestLocation,
  handleLocationInviteOpen,
  handleCloseMessage,
  handleClosePing,
  handleFriendProfileClose,
  setFriendManagementOpen,
  setLocationSharingModalOpen,
  setLocationInviteModalOpen,
  setPlanPreviewModal,
  actionModals,
  userDiscoveryModal,
  setUserDiscoveryModal,
  createPlanModal,
  handleCreatePlanClose,
  handleCreatePlanOpen,
  handleCreatePlan,
  handleMessagesNavigation
}: FriendsViewPresentationProps) => {
  const header = (
    <FriendsViewHeader
      onFriendManagement={handleFriendManagement}
      onAddFriend={() => setUserDiscoveryModal(true)}
      searchExpanded={searchExpanded}
      onSearchToggle={() => setSearchExpanded(!searchExpanded)}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      activeFilters={activeFilters}
      onFilterToggle={handleFilterToggle}
      activeVibeFilters={activeVibeFilters}
      onVibeFilterToggle={handleVibeFilterToggle}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchHistory={searchHistory}
      onLocationSharingOpen={handleLocationSharingOpen}
    />
  );

  const content = (
    <FriendsViewContent
      activeTab={activeTab}
      friends={friends}
      sortedFriends={sortedFriends}
      individualFriends={individualFriends}
      searchQuery={searchQuery}
      activeFilters={activeFilters}
      locationPermission={locationPermission}
      pingStates={pingStates}
      friendRequests={friendRequests}
      onFriendProfileOpen={handleFriendProfileOpen}
      onOpenMessage={handleOpenMessage}
      onPingToJoin={handlePingToJoin}
      onGroupMessage={handleGroupMessage}
      onGroupPing={handleGroupPing}
      onInviteNearby={handleInviteNearby}
      onCreatePlan={handleCreatePlanOpen}
      onAddFriend={() => setUserDiscoveryModal(true)}
      onRequestLocation={requestLocation}
      onVenueClick={actionModals.handleVenueDetail}
      onAttendeeListClick={actionModals.handleAttendeeList}
      onSoloFriendAction={actionModals.handleSoloFriendAction}
      onGroupChat={actionModals.handleGroupChat}
      onGroupAction={actionModals.handleGroupAction}
      onLocationInvite={handleLocationInviteOpen}
    />
  );

  return (
    <>
      <LayoutManager header={header}>
        {content}
      </LayoutManager>

      {/* Enhanced Quick Actions Bar */}
      <QuickActionsMenu
        onInviteToPlan={() => actionModals.handleInviteToPlan()}
        onMessages={handleMessagesNavigation}
        onLocationSharing={handleLocationSharingOpen}
      />

      {/* All Modals */}
      <FriendsModalsManager
        messageModal={messageModal}
        pingModal={pingModal}
        friendProfileSheet={friendProfileSheet}
        planPreviewModal={planPreviewModal}
        friendManagementOpen={friendManagementOpen}
        locationSharingModalOpen={locationSharingModalOpen}
        locationInviteModalOpen={locationInviteModalOpen}
        selectedFriendForLocation={selectedFriendForLocation}
        friends={friends}
        onCloseMessage={handleCloseMessage}
        onClosePing={handleClosePing}
        onCloseFriendProfile={handleFriendProfileClose}
        onClosePlanPreview={() => setPlanPreviewModal({ isOpen: false, plan: null })}
        setFriendManagementOpen={setFriendManagementOpen}
        setLocationSharingModalOpen={setLocationSharingModalOpen}
        setLocationInviteModalOpen={setLocationInviteModalOpen}
        actionModals={actionModals}
        userDiscoveryModal={userDiscoveryModal}
        setUserDiscoveryModal={setUserDiscoveryModal}
        createPlanModal={createPlanModal}
        handleCreatePlanClose={handleCreatePlanClose}
        handleCreatePlan={handleCreatePlan}
        handleCreatePlanOpen={handleCreatePlanOpen}
      />
    </>
  );
};

export default FriendsViewPresentation;
