
import { useMemo } from 'react';

interface UseFriendFilteringProps {
  friendsAtVenues: { [venueId: number]: any[] };
  activePlan?: any | null;
}

export const useFriendFiltering = ({ friendsAtVenues, activePlan }: UseFriendFilteringProps) => {
  return useMemo(() => {
    if (!activePlan || !activePlan.stops || !activePlan.friends) {
      return friendsAtVenues;
    }

    const planVenueIds = new Set(activePlan.stops.map((stop: any) => stop.venueId));
    const planMemberIds = new Set([...activePlan.friends.map((f: any) => f.id), activePlan.createdBy]);
    
    const filtered: { [venueId: number]: any[] } = {};
    
    Object.entries(friendsAtVenues).forEach(([venueId, friends]) => {
      const venueIdNum = parseInt(venueId);
      
      if (planVenueIds.has(venueIdNum)) {
        const planFriends = friends.filter(friend => planMemberIds.has(friend.id));
        if (planFriends.length > 0) {
          filtered[venueIdNum] = planFriends;
        }
      }
    });
    
    return filtered;
  }, [friendsAtVenues, activePlan]);
};
