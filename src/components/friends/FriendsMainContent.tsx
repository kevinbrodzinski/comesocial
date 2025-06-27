
import React, { useMemo } from 'react';
import LiveActivityCarousel from './LiveActivityCarousel';
import SmartCTABanner from './SmartCTABanner';
import AllFriendsTabContent from './AllFriendsTabContent';
import FriendGroupsAtVenues from './FriendGroupsAtVenues';
import EnhancedFriendCard from './EnhancedFriendCard';
import EmptyStates from '../EmptyStates';

interface FriendsMainContentProps {
  activeTab: string;
  friends: any[];
  sortedFriends: any[];
  individualFriends: any[];
  searchQuery: string;
  activeFilters: string[];
  locationPermission: 'denied' | 'granted' | 'pending' | null;
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  memoizedCallbacks: any;
}

const FriendsMainContent = React.memo(({
  activeTab,
  friends,
  sortedFriends,
  individualFriends,
  searchQuery,
  activeFilters,
  locationPermission,
  pingStates,
  memoizedCallbacks
}: FriendsMainContentProps) => {
  const { activeCount, nearbyCount } = useMemo(() => ({
    activeCount: friends.filter(f => f.currentAction !== 'offline' && f.currentAction !== 'just-left').length,
    nearbyCount: friends.filter(f => f.isNearby).length
  }), [friends]);

  const shouldShowLiveActivity = useMemo(() => 
    activeTab === 'activity',
    [activeTab]
  );

  const shouldShowCTABanner = useMemo(() => 
    activeTab !== 'all',
    [activeTab]
  );

  const shouldShowFriendGroups = useMemo(() => 
    activeTab === 'activity',
    [activeTab]
  );

  const displayedFriends = useMemo(() => 
    activeTab === 'nearby' ? sortedFriends : individualFriends,
    [activeTab, sortedFriends, individualFriends]
  );

  const hasNoFriends = useMemo(() => 
    displayedFriends.length === 0 && sortedFriends.length === 0,
    [displayedFriends.length, sortedFriends.length]
  );

  return (
    <>
      {/* Live Activity Carousel - Only show on Activity tab */}
      {shouldShowLiveActivity && (
        <LiveActivityCarousel
          friends={friends}
          onFriendSelect={memoizedCallbacks.onFriendProfileOpen}
        />
      )}

      {/* Smart CTA Banner - Only show on Activity and Nearby tabs */}
      {shouldShowCTABanner && (
        <SmartCTABanner
          activeTab={activeTab}
          nearbyCount={nearbyCount}
          activeCount={activeCount}
          onInviteNearby={memoizedCallbacks.onInviteNearby}
          onCreatePlan={memoizedCallbacks.onCreatePlan}
        />
      )}

      {/* Friends List or All Tab Content */}
      {activeTab === 'all' ? (
        <AllFriendsTabContent
          friends={sortedFriends}
          pingStates={pingStates}
          onOpenMessage={memoizedCallbacks.onOpenMessage}
          onFriendProfileOpen={memoizedCallbacks.onFriendProfileOpen}
          onPingToJoin={memoizedCallbacks.onPingToJoin}
          onSoloFriendAction={memoizedCallbacks.onSoloFriendAction}
        />
      ) : (
        <div className="space-y-6">
          {/* Friend Groups at Venues - Only show on Activity tab */}
          {shouldShowFriendGroups && (
            <FriendGroupsAtVenues
              friends={sortedFriends}
              onOpenMessage={memoizedCallbacks.onGroupMessage}
              onFriendProfileOpen={memoizedCallbacks.onFriendProfileOpen}
              onPingToJoin={memoizedCallbacks.onGroupPing}
              onVenueClick={memoizedCallbacks.onVenueClick}
              onAttendeeListClick={memoizedCallbacks.onAttendeeListClick}
              onGroupChat={memoizedCallbacks.onGroupChat}
              onGroupAction={memoizedCallbacks.onGroupAction}
              variant={activeTab as 'activity' | 'nearby'}
            />
          )}

          {/* Individual Friend Cards */}
          <div className="space-y-3">
            {displayedFriends.map((friend) => (
              <EnhancedFriendCard
                key={friend.id}
                friend={friend}
                pingStates={pingStates}
                onOpenMessage={memoizedCallbacks.onOpenMessage}
                onFriendProfileOpen={memoizedCallbacks.onFriendProfileOpen}
                onPingToJoin={memoizedCallbacks.onPingToJoin}
                onSoloFriendAction={memoizedCallbacks.onSoloFriendAction}
                variant={activeTab as 'activity' | 'nearby' | 'all'}
              />
            ))}
            
            {hasNoFriends && (
              <EmptyStates
                activeTab={activeTab}
                locationPermission={locationPermission}
                onAddFriend={memoizedCallbacks.onAddFriend}
                onRequestLocation={memoizedCallbacks.onRequestLocation}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
});

FriendsMainContent.displayName = 'FriendsMainContent';

export default FriendsMainContent;
