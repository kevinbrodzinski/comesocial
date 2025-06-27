
import React, { useMemo } from 'react';
import QuickVibeSetter from '@/components/vibe/QuickVibeSetter';
import FriendRequestsSection from './FriendRequestsSection';
import SearchResultsSummary from './SearchResultsSummary';
import FriendsMainContent from './FriendsMainContent';

interface FriendsViewContentProps {
  activeTab: string;
  friends: any[];
  sortedFriends: any[];
  individualFriends: any[];
  searchQuery: string;
  activeFilters: string[];
  locationPermission: 'denied' | 'granted' | 'pending' | null;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  friendRequests?: any;
  onFriendProfileOpen: (friend: any) => void;
  onOpenMessage: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
  onGroupMessage: (groupFriends: any[]) => void;
  onGroupPing: (groupFriends: any[]) => void;
  onInviteNearby: () => void;
  onCreatePlan: () => void;
  onAddFriend: () => void;
  onRequestLocation: () => void;
  onVenueClick: (venue: string, friends: any[]) => void;
  onAttendeeListClick: (venue: string, friends: any[]) => void;
  onSoloFriendAction: (friend: any) => void;
  onGroupChat: (friends: any[], venue: string) => void;
  onGroupAction: (friends: any[], venue: string, action: 'ping' | 'plan') => void;
  onLocationInvite: (friend?: any) => void;
}

const FriendsViewContent = React.memo(({
  activeTab,
  friends,
  sortedFriends,
  individualFriends,
  searchQuery,
  activeFilters,
  locationPermission,
  pingStates,
  friendRequests,
  onFriendProfileOpen,
  onOpenMessage,
  onPingToJoin,
  onGroupMessage,
  onGroupPing,
  onInviteNearby,
  onCreatePlan,
  onAddFriend,
  onRequestLocation,
  onVenueClick,
  onAttendeeListClick,
  onSoloFriendAction,
  onGroupChat,
  onGroupAction,
  onLocationInvite
}: FriendsViewContentProps) => {
  const shouldShowQuickVibe = useMemo(() => 
    activeTab === 'activity' && !searchQuery && activeFilters.length === 0,
    [activeTab, searchQuery, activeFilters.length]
  );

  const shouldShowFriendRequests = useMemo(() => 
    activeTab === 'activity',
    [activeTab]
  );

  // Memoize callback handlers to prevent re-renders
  const memoizedCallbacks = useMemo(() => ({
    onFriendProfileOpen,
    onOpenMessage,
    onPingToJoin,
    onGroupMessage,
    onGroupPing,
    onInviteNearby,
    onCreatePlan,
    onAddFriend,
    onRequestLocation,
    onVenueClick,
    onAttendeeListClick,
    onSoloFriendAction,
    onGroupChat,
    onGroupAction,
    onLocationInvite
  }), [
    onFriendProfileOpen,
    onOpenMessage,
    onPingToJoin,
    onGroupMessage,
    onGroupPing,
    onInviteNearby,
    onCreatePlan,
    onAddFriend,
    onRequestLocation,
    onVenueClick,
    onAttendeeListClick,
    onSoloFriendAction,
    onGroupChat,
    onGroupAction,
    onLocationInvite
  ]);

  return (
    <div className="flex flex-col">
      {/* Quick Vibe Setter - Only show on Activity tab when no search/filters */}
      {shouldShowQuickVibe && (
        <QuickVibeSetter />
      )}

      <div className="p-4">
        {/* Friend Requests Section - Only show on Activity tab */}
        {shouldShowFriendRequests && (
          <FriendRequestsSection
            friendRequests={friendRequests}
            searchQuery={searchQuery}
            onFriendProfileOpen={onFriendProfileOpen}
          />
        )}

        {/* Search Results Summary */}
        <SearchResultsSummary
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          sortedFriendsCount={sortedFriends.length}
        />

        {/* Main Friends Content */}
        <FriendsMainContent
          activeTab={activeTab}
          friends={friends}
          sortedFriends={sortedFriends}
          individualFriends={individualFriends}
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          locationPermission={locationPermission}
          pingStates={pingStates}
          memoizedCallbacks={memoizedCallbacks}
        />
      </div>
    </div>
  );
});

FriendsViewContent.displayName = 'FriendsViewContent';

export default FriendsViewContent;
