
import { useMemo } from 'react';
import { friendsData, Friend } from '@/data/friendsData';
import { Venue } from '@/data/venuesData';

export interface FriendAtVenue {
  friend: Friend;
  venue: Venue;
}

export const useFriendVenueMapping = (venues: Venue[]) => {
  const friendsAtVenues = useMemo(() => {
    const activeStatuses = ['checked-in', 'pre-gaming', 'on-the-way'];
    const activeFriends = friendsData.filter(friend => 
      friend.status === 'active' && 
      activeStatuses.includes(friend.currentAction) &&
      friend.location
    );

    const mapping: { [venueId: number]: Friend[] } = {};
    
    activeFriends.forEach(friend => {
      const venue = venues.find(v => v.name === friend.location);
      if (venue) {
        if (!mapping[venue.id]) {
          mapping[venue.id] = [];
        }
        mapping[venue.id].push(friend);
      }
    });

    return mapping;
  }, [venues]);

  return friendsAtVenues;
};
