import React, { useState } from 'react';
import { Venue } from '@/data/venuesData';
import { Friend } from '@/data/friendsData';
import FriendAvatarCluster from '@/components/social/FriendAvatarCluster';
import FriendTooltip from './FriendTooltip';
import { FriendPresence } from '@/hooks/useSocialIntelligence';

interface FriendAvatarsOverlayProps {
  friendsAtVenues: { [venueId: number]: Friend[] };
  venues: Venue[];
  onMessage: (friends: Friend[], venue?: string) => void;
  onJoinPlan: (friend: Friend) => void;
}

const FriendAvatarsOverlay: React.FC<FriendAvatarsOverlayProps> = ({ friendsAtVenues, venues, onMessage, onJoinPlan }: FriendAvatarsOverlayProps) => {
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const convertToFriendPresence = (friends: Friend[], venue: Venue): FriendPresence[] => {
    return friends.map(friend => ({
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      venue: venue.name,
      venueId: venue.id,
      checkedInAt: new Date().toISOString(),
      status: friend.currentAction as 'checked-in' | 'on-the-way'
    }));
  };

  const getPinPosition = (venue: Venue) => {
    // Use the venue's x, y coordinates for positioning
    // These are percentage-based and should stay locked to the map
    return {
      left: `${venue.x || 50}%`,
      top: `${venue.y || 50}%`,
      transform: 'translate(-50%, -50%) translate(20px, -20px)',
      position: 'absolute' as const
    };
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      {Object.entries(friendsAtVenues).map(([venueId, friends]) => {
        const venue = venues.find(v => v.id === parseInt(venueId));
        if (!venue || !friends.length) return null;

        const friendPresences = convertToFriendPresence(friends, venue);
        const isSelected = selectedVenueId === venue.id;
        const pinStyle = getPinPosition(venue);

        return (
          <div
            key={venueId}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 pointer-events-auto"
            style={pinStyle}
            onClick={() => {
              if (isSelected) {
                setSelectedVenueId(null);
                setSelectedFriend(null);
              } else {
                setSelectedVenueId(venue.id);
                setSelectedFriend(friends[0]); // Select first friend for tooltip
              }
            }}
          >
            <div className="animate-in fade-in-0">
              <FriendAvatarCluster 
                friends={friendPresences}
                maxDisplay={3}
                showStatus={true}
                size="sm"
              />
            </div>
            {isSelected && selectedFriend && (
              <FriendTooltip
                friend={selectedFriend}
                onMessage={() => onMessage(friends, venue.name)}
                onJoinPlan={() => onJoinPlan(selectedFriend)}
                onClose={() => {
                  setSelectedVenueId(null);
                  setSelectedFriend(null);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FriendAvatarsOverlay;
