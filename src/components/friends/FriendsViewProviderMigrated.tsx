import React from 'react';
import { useFriendsDataMigrated } from '@/hooks/useFriendsDataMigrated';
import { useFriendsState } from '@/hooks/useFriendsState';
import { useFriendFiltering } from '@/hooks/useFriendFiltering';
import { useFriendsEventHandlers } from '@/hooks/useFriendsEventHandlers';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import FriendsLoadingSkeleton from './FriendsLoadingSkeleton';
import FriendsErrorState from './FriendsErrorState';

const FriendsViewProviderMigrated = ({ children }: { children: (props: any) => React.ReactNode }) => {
  const { 
    friends, 
    tabs, 
    isLoading, 
    error, 
    refetch 
  } = useFriendsDataMigrated();
  
  const state = useFriendsState();
  const { sortedFriends, individualFriends } = useFriendFiltering(
    friends, 
    state.activeTab, 
    state.searchQuery, 
    state.activeFilters,
    state.activeVibeFilters
  );
  const eventHandlers = useFriendsEventHandlers(state);
  const friendRequests = useFriendRequests();

  // Add location sharing modal states
  const [locationSharingModalOpen, setLocationSharingModalOpen] = React.useState(false);
  const [locationInviteModalOpen, setLocationInviteModalOpen] = React.useState(false);
  const [selectedFriendForLocation, setSelectedFriendForLocation] = React.useState(null);

  const handleLocationSharingOpen = () => {
    setLocationSharingModalOpen(true);
  };

  const handleLocationInviteOpen = (friend = null) => {
    setSelectedFriendForLocation(friend);
    setLocationInviteModalOpen(true);
  };

  // Mock location permission for friends view (will be managed globally later)
  const mockLocationPermission = 'denied';
  const mockRequestLocation = () => {
    console.log('Location request from friends view - should be handled globally');
  };

  // Handle loading state
  if (isLoading) {
    return <FriendsLoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return <FriendsErrorState error={error} onRetry={refetch} />;
  }

  // Return the normal component when data is loaded successfully
  return children({
    friends,
    tabs,
    sortedFriends,
    individualFriends,
    activeTab: state.activeTab,
    searchQuery: state.searchQuery,
    activeFilters: state.activeFilters,
    activeVibeFilters: state.activeVibeFilters,
    locationPermission: mockLocationPermission,
    messageModal: state.messageModal,
    pingModal: state.pingModal,
    addFriendModal: state.addFriendModal,
    friendProfileSheet: state.friendProfileSheet,
    planPreviewModal: state.planPreviewModal,
    friendManagementOpen: state.friendManagementOpen,
    searchExpanded: state.searchExpanded,
    searchHistory: state.searchHistory,
    pingStates: state.pingStates,
    // Friend requests
    friendRequests,
    // Location sharing states
    locationSharingModalOpen,
    locationInviteModalOpen,
    selectedFriendForLocation,
    setActiveTab: state.setActiveTab,
    setAddFriendModal: state.setAddFriendModal,
    setFriendManagementOpen: state.setFriendManagementOpen,
    setSearchExpanded: state.setSearchExpanded,
    setPlanPreviewModal: state.setPlanPreviewModal,
    // Location sharing handlers
    setLocationSharingModalOpen,
    setLocationInviteModalOpen,
    handleLocationSharingOpen,
    handleLocationInviteOpen,
    handleSearchChange: eventHandlers.handleSearchChange,
    handleFilterToggle: eventHandlers.handleFilterToggle,
    handleVibeFilterToggle: eventHandlers.handleVibeFilterToggle,
    handleFriendManagement: eventHandlers.handleFriendManagement,
    handleOpenMessage: eventHandlers.handleOpenMessage,
    handleCloseMessage: eventHandlers.handleCloseMessage,
    handleOpenPing: eventHandlers.handleOpenPing,
    handleClosePing: eventHandlers.handleClosePing,
    handleFriendProfileOpen: eventHandlers.handleFriendProfileOpen,
    handleFriendProfileClose: eventHandlers.handleFriendProfileClose,
    handlePlanPreview: eventHandlers.handlePlanPreview,
    handlePingToJoin: eventHandlers.handlePingToJoin,
    handleGroupMessage: eventHandlers.handleGroupMessage,
    handleGroupPing: eventHandlers.handleGroupPing,
    handleInviteNearby: eventHandlers.handleInviteNearby,
    handleCreatePlan: eventHandlers.handleCreatePlan,
    requestLocation: mockRequestLocation
  });
};

export default FriendsViewProviderMigrated; 