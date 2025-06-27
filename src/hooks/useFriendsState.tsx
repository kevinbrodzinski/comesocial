
import { useFriendsStore } from '@/stores/useFriendsStore';

export const useFriendsState = () => {
  const store = useFriendsStore();
  
  return {
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    searchQuery: store.searchQuery,
    setSearchQuery: store.setSearchQuery,
    activeFilters: store.activeFilters,
    setActiveFilters: store.setActiveFilters,
    activeVibeFilters: store.activeVibeFilters,
    setActiveVibeFilters: store.setActiveVibeFilters,
    messageModal: store.messageModal,
    setMessageModal: store.setMessageModal,
    pingModal: store.pingModal,
    setPingModal: store.setPingModal,
    addFriendModal: store.addFriendModal,
    setAddFriendModal: store.setAddFriendModal,
    friendProfileSheet: store.friendProfileSheet,
    setFriendProfileSheet: store.setFriendProfileSheet,
    planPreviewModal: store.planPreviewModal,
    setPlanPreviewModal: store.setPlanPreviewModal,
    friendManagementOpen: store.friendManagementOpen,
    setFriendManagementOpen: store.setFriendManagementOpen,
    searchExpanded: store.searchExpanded,
    setSearchExpanded: store.setSearchExpanded,
    searchHistory: store.searchHistory,
    setSearchHistory: store.setSearchHistory,
    pingStates: store.pingStates,
    setPingStates: store.setPingStates
  };
};
