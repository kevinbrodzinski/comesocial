import React, { useMemo } from 'react';
import EnhancedFriendCard from './EnhancedFriendCard';

interface AllFriendsTabContentProps {
  friends: any[];
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
  onSoloFriendAction: (friend: any) => void;
}

const AllFriendsTabContent = React.memo(({
  friends,
  pingStates,
  onOpenMessage,
  onFriendProfileOpen,
  onPingToJoin,
  onSoloFriendAction
}: AllFriendsTabContentProps) => {
  // Memoize expensive friend filtering and sorting
  const { recentActivityFriends, otherFriends } = useMemo(() => {
    // Filter friends by recent activity - those who have interacted in the last 7 days
    const recentActivityFriends = friends.filter(friend => {
      // Check if they have recent activity or events attended
      return friend.currentAction !== 'offline' || 
             friend.lastActivity === 'today' || 
             friend.lastActivity === 'yesterday' ||
             friend.eventsAttended > 0;
    });

    // Create a Set for efficient lookup to avoid includes() performance issues
    const recentSet = new Set(recentActivityFriends.map(f => f.id));

    // Rest of the friends (alphabetical order) - use Set for filtering
    const otherFriends = friends
      .filter(friend => !recentSet.has(friend.id))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { recentActivityFriends, otherFriends };
  }, [friends]);

  // Memoize sorted recent friends - use spread to avoid array mutation
  const sortedRecentFriends = useMemo(() => {
    return [...recentActivityFriends].sort((a, b) => {
      const actionPriority = { 'checked-in': 4, 'on-the-way': 3, 'pre-gaming': 2, 'just-left': 1, 'offline': 0 };
      const priorityA = actionPriority[a.currentAction] || 0;
      const priorityB = actionPriority[b.currentAction] || 0;
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // Secondary sort by events attended
      return (b.eventsAttended || 0) - (a.eventsAttended || 0);
    });
  }, [recentActivityFriends]);

  // Memoize sections data
  const sections = useMemo(() => [
    {
      title: 'Recent Activity',
      friends: sortedRecentFriends
    },
    {
      title: 'All Friends',
      friends: otherFriends
    }
  ], [sortedRecentFriends, otherFriends]);

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <FriendSection
          key={section.title}
          title={section.title}
          friends={section.friends}
          pingStates={pingStates}
          onOpenMessage={onOpenMessage}
          onFriendProfileOpen={onFriendProfileOpen}
          onPingToJoin={onPingToJoin}
          onSoloFriendAction={onSoloFriendAction}
        />
      ))}
    </div>
  );
});

// Separate memoized component for each section
const FriendSection = React.memo(({
  title,
  friends,
  pingStates,
  onOpenMessage,
  onFriendProfileOpen,
  onPingToJoin,
  onSoloFriendAction
}: {
  title: string;
  friends: any[];
  pingStates: { [key: number]: 'idle' | 'sending' | 'sent' | 'joined' };
  onOpenMessage: (friend: any) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friend: any) => void;
  onSoloFriendAction: (friend: any) => void;
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground px-1">
        {title} ({friends.length})
      </h3>
      <div className="space-y-3">
        {friends.map((friend) => (
          <EnhancedFriendCard
            key={friend.id}
            friend={friend}
            pingStates={pingStates}
            onOpenMessage={onOpenMessage}
            onFriendProfileOpen={onFriendProfileOpen}
            onPingToJoin={onPingToJoin}
            onSoloFriendAction={onSoloFriendAction}
            variant="all"
          />
        ))}
      </div>
    </div>
  );
});

AllFriendsTabContent.displayName = 'AllFriendsTabContent';
FriendSection.displayName = 'FriendSection';

export default AllFriendsTabContent;
