import { useCallback } from 'react';
import { Venue } from '@/data/venuesData';
import { Friend } from '@/data/friendsData';

interface UseVenueInteractionHandlersProps {
  selectedVenueForInteraction: Venue | null;
  setQuickChatFriends: (friends: Friend[]) => void;
  setQuickChatVenue: (venue: Venue | undefined) => void;
  setVenueInteractionOpen: (open: boolean) => void;
}

export const useVenueInteractionHandlers = ({
  selectedVenueForInteraction,
  setQuickChatFriends,
  setQuickChatVenue,
  setVenueInteractionOpen
}: UseVenueInteractionHandlersProps) => {
  const handlePingFriends = useCallback(() => {
    if (selectedVenueForInteraction) {
      setQuickChatFriends([]);
      setQuickChatVenue(selectedVenueForInteraction);
      setVenueInteractionOpen(false);
    }
  }, [selectedVenueForInteraction, setQuickChatFriends, setQuickChatVenue, setVenueInteractionOpen]);

  const handleJoinFriends = useCallback(() => {
    // Handle joining friends at venue
    console.log('Joining friends at venue:', selectedVenueForInteraction?.name);
  }, [selectedVenueForInteraction]);

  const handleVenueCheckIn = useCallback(() => {
    // Handle venue check-in
    console.log('Checking in at venue:', selectedVenueForInteraction?.name);
  }, [selectedVenueForInteraction]);

  const handleAddVenueToPlan = useCallback(() => {
    // Handle adding venue to plan
    console.log('Adding venue to plan:', selectedVenueForInteraction?.name);
  }, [selectedVenueForInteraction]);

  return {
    handlePingFriends,
    handleJoinFriends,
    handleVenueCheckIn,
    handleAddVenueToPlan
  };
};
