
import { create } from 'zustand';
import { Friend } from '@/data/friendsData';

interface FriendsState {
  // Core state
  friends: Friend[];
  activeTab: string;
  searchQuery: string;
  activeFilters: string[];
  activeVibeFilters: string[];
  searchExpanded: boolean;
  searchHistory: string[];
  
  // Modal states
  messageModal: { isOpen: boolean; friend: any; groupFriends?: any[] };
  pingModal: { isOpen: boolean; friend: any; groupFriends?: any[] };
  addFriendModal: boolean;
  friendProfileSheet: { isOpen: boolean; friend: any };
  planPreviewModal: { isOpen: boolean; plan: any };
  friendManagementOpen: boolean;
  locationSharingModalOpen: boolean;
  locationInviteModalOpen: boolean;
  selectedFriendForLocation: any;
  
  // Interaction states
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
}

interface FriendsActions {
  // Core actions
  setFriends: (friends: Friend[]) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilters: (filters: string[]) => void;
  setActiveVibeFilters: (filters: string[]) => void;
  setSearchExpanded: (expanded: boolean) => void;
  setSearchHistory: (history: string[]) => void;
  
  // Modal actions
  setMessageModal: (modal: { isOpen: boolean; friend: any; groupFriends?: any[] }) => void;
  setPingModal: (modal: { isOpen: boolean; friend: any; groupFriends?: any[] }) => void;
  setAddFriendModal: (open: boolean) => void;
  setFriendProfileSheet: (sheet: { isOpen: boolean; friend: any }) => void;
  setPlanPreviewModal: (modal: { isOpen: boolean; plan: any }) => void;
  setFriendManagementOpen: (open: boolean) => void;
  setLocationSharingModalOpen: (open: boolean) => void;
  setLocationInviteModalOpen: (open: boolean) => void;
  setSelectedFriendForLocation: (friend: any) => void;
  
  // Interaction actions
  setPingStates: (states: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' }) => void;
  toggleFilter: (filter: string) => void;
  toggleVibeFilter: (vibeId: string) => void;
  addToSearchHistory: (query: string) => void;
  closeAllModals: () => void;
}

export const useFriendsStore = create<FriendsState & FriendsActions>((set, get) => ({
  // State
  friends: [],
  activeTab: 'activity',
  searchQuery: '',
  activeFilters: [],
  activeVibeFilters: [],
  searchExpanded: false,
  searchHistory: [],
  messageModal: { isOpen: false, friend: null },
  pingModal: { isOpen: false, friend: null },
  addFriendModal: false,
  friendProfileSheet: { isOpen: false, friend: null },
  planPreviewModal: { isOpen: false, plan: null },
  friendManagementOpen: false,
  locationSharingModalOpen: false,
  locationInviteModalOpen: false,
  selectedFriendForLocation: null,
  pingStates: {},

  // Actions
  setFriends: (friends) => set({ friends }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveFilters: (activeFilters) => set({ activeFilters }),
  setActiveVibeFilters: (activeVibeFilters) => set({ activeVibeFilters }),
  setSearchExpanded: (searchExpanded) => set({ searchExpanded }),
  setSearchHistory: (searchHistory) => set({ searchHistory }),
  setMessageModal: (messageModal) => set({ messageModal }),
  setPingModal: (pingModal) => set({ pingModal }),
  setAddFriendModal: (addFriendModal) => set({ addFriendModal }),
  setFriendProfileSheet: (friendProfileSheet) => set({ friendProfileSheet }),
  setPlanPreviewModal: (planPreviewModal) => set({ planPreviewModal }),
  setFriendManagementOpen: (friendManagementOpen) => set({ friendManagementOpen }),
  setLocationSharingModalOpen: (locationSharingModalOpen) => set({ locationSharingModalOpen }),
  setLocationInviteModalOpen: (locationInviteModalOpen) => set({ locationInviteModalOpen }),
  setSelectedFriendForLocation: (selectedFriendForLocation) => set({ selectedFriendForLocation }),
  setPingStates: (pingStates) => set({ pingStates }),

  toggleFilter: (filter) => {
    const { activeFilters } = get();
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    set({ activeFilters: newFilters });
  },

  toggleVibeFilter: (vibeId) => {
    const { activeVibeFilters } = get();
    const newFilters = activeVibeFilters.includes(vibeId)
      ? activeVibeFilters.filter(v => v !== vibeId)
      : [...activeVibeFilters, vibeId];
    set({ activeVibeFilters: newFilters });
  },

  addToSearchHistory: (query) => {
    if (!query.trim()) return;
    const { searchHistory } = get();
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    set({ searchHistory: newHistory });
  },

  closeAllModals: () => set({
    messageModal: { isOpen: false, friend: null },
    pingModal: { isOpen: false, friend: null },
    addFriendModal: false,
    friendProfileSheet: { isOpen: false, friend: null },
    planPreviewModal: { isOpen: false, plan: null },
    friendManagementOpen: false,
    locationSharingModalOpen: false,
    locationInviteModalOpen: false,
    selectedFriendForLocation: null
  })
}));
