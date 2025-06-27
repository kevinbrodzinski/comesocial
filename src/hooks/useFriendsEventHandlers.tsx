
import { useCallback } from 'react';

export const useFriendsEventHandlers = (state: any) => {
  const handleSearchChange = useCallback((query: string) => {
    state.setSearchQuery(query);
    
    // Add to search history if it's a meaningful search
    if (query.trim() && query.length > 2 && !state.searchHistory.includes(query)) {
      state.setSearchHistory((prev: string[]) => [query, ...prev.slice(0, 9)]);
    }
  }, [state]);

  const handleFilterToggle = useCallback((filter: string) => {
    state.setActiveFilters((prev: string[]) => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, [state]);

  const handleVibeFilterToggle = useCallback((vibeId: string) => {
    state.setActiveVibeFilters((prev: string[]) => 
      prev.includes(vibeId) 
        ? prev.filter(f => f !== vibeId)
        : [...prev, vibeId]
    );
  }, [state]);

  const handleFriendManagement = useCallback(() => {
    state.setFriendManagementOpen(true);
  }, [state]);

  const handleOpenMessage = useCallback((friend: any, groupFriends?: any[]) => {
    state.setMessageModal({ isOpen: true, friend, groupFriends });
  }, [state]);

  const handleCloseMessage = useCallback(() => {
    state.setMessageModal({ isOpen: false, friend: null });
  }, [state]);

  const handleOpenPing = useCallback((friend: any, groupFriends?: any[]) => {
    state.setPingModal({ isOpen: true, friend, groupFriends });
  }, [state]);

  const handleClosePing = useCallback(() => {
    state.setPingModal({ isOpen: false, friend: null });
  }, [state]);

  const handleFriendProfileOpen = useCallback((friend: any) => {
    state.setFriendProfileSheet({ isOpen: true, friend });
  }, [state]);

  const handleFriendProfileClose = useCallback(() => {
    state.setFriendProfileSheet({ isOpen: false, friend: null });
  }, [state]);

  const handlePlanPreview = useCallback((plan: any) => {
    state.setPlanPreviewModal({ isOpen: true, plan });
  }, [state]);

  const handlePingToJoin = useCallback((friend: any) => {
    state.setPingStates((prev: any) => ({ ...prev, [friend.id]: 'sending' }));
    
    setTimeout(() => {
      state.setPingStates((prev: any) => ({ ...prev, [friend.id]: 'sent' }));
    }, 1000);

    setTimeout(() => {
      state.setPingStates((prev: any) => ({ ...prev, [friend.id]: 'idle' }));
    }, 3000);
  }, [state]);

  const handleGroupMessage = useCallback((groupFriends: any[]) => {
    const primaryFriend = groupFriends[0];
    state.setMessageModal({ isOpen: true, friend: primaryFriend, groupFriends });
  }, [state]);

  const handleGroupPing = useCallback((groupFriends: any[]) => {
    const primaryFriend = groupFriends[0];
    state.setPingModal({ isOpen: true, friend: primaryFriend, groupFriends });
  }, [state]);

  const handleInviteNearby = useCallback(() => {
    console.log('Inviting nearby friends');
  }, []);

  const handleCreatePlan = useCallback(() => {
    console.log('Creating new plan');
  }, []);

  return {
    handleSearchChange,
    handleFilterToggle,
    handleVibeFilterToggle,
    handleFriendManagement,
    handleOpenMessage,
    handleCloseMessage,
    handleOpenPing,
    handleClosePing,
    handleFriendProfileOpen,
    handleFriendProfileClose,
    handlePlanPreview,
    handlePingToJoin,
    handleGroupMessage,
    handleGroupPing,
    handleInviteNearby,
    handleCreatePlan
  };
};
