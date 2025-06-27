
import React, { useState } from 'react';
import FavoritesMapModal from '../FavoritesMapModal';
import VenueDetailModal from '../VenueDetailModal';
import MessageModal from '../MessageModal';
import CheckInActivityModal from './CheckInActivityModal';
import { venues } from '@/data/venuesData';
import { useToast } from '@/hooks/use-toast';

interface MapViewModalsProps {
  favoritesModalOpen: boolean;
  setFavoritesModalOpen: (open: boolean) => void;
  venueDetailModalOpen: boolean;
  setVenueDetailModalOpen: (open: boolean) => void;
  checkInModalOpen: boolean;
  setCheckInModalOpen: (open: boolean) => void;
  selectedVenueFromPin: any;
  activities: any[];
  markAllAsRead: () => void;
  onVenueSelect?: (venueId: number) => void;
  onSetSelectedPin?: (venueId: number | null) => void;
}

const MapViewModals = ({
  favoritesModalOpen,
  setFavoritesModalOpen,
  venueDetailModalOpen,
  setVenueDetailModalOpen,
  checkInModalOpen,
  setCheckInModalOpen,
  selectedVenueFromPin,
  activities,
  markAllAsRead,
  onVenueSelect,
  onSetSelectedPin
}: MapViewModalsProps) => {
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const { toast } = useToast();

  const handleOpenVenue = (venueName: string) => {
    // Find venue by name (case-insensitive search)
    const venue = venues.find(v => 
      v.name.toLowerCase().includes(venueName.toLowerCase()) ||
      venueName.toLowerCase().includes(v.name.toLowerCase())
    );

    if (venue) {
      // Close the check-in modal
      setCheckInModalOpen(false);
      
      // Set the selected pin and open venue detail modal
      if (onSetSelectedPin) {
        onSetSelectedPin(venue.id);
      }
      if (onVenueSelect) {
        onVenueSelect(venue.id);
      }
      setVenueDetailModalOpen(true);
      
      toast({
        title: "Opening Venue",
        description: `Showing ${venue.name} on map`,
      });
    } else {
      toast({
        title: "Venue Not Found",
        description: `Could not find ${venueName} on the map`,
        variant: "destructive"
      });
    }
  };

  const handlePingFriend = (friendName: string, friendId?: string) => {
    // Create friend object for MessageModal
    const friend = {
      id: friendId || friendName.toLowerCase().replace(' ', ''),
      name: friendName,
      avatar: friendName.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: 'active',
      location: null, // Could be enhanced to include their current venue
      plan: null
    };

    // Close the check-in modal and open message modal
    setCheckInModalOpen(false);
    setSelectedFriend(friend);
    setMessageModalOpen(true);
  };

  const handleCloseMessage = () => {
    setMessageModalOpen(false);
    setSelectedFriend(null);
  };

  // Convert selectedVenueFromPin to the expected format for CheckInActivityModal
  const checkInVenue = selectedVenueFromPin ? {
    id: selectedVenueFromPin.id || 'unknown',
    name: selectedVenueFromPin.name || 'Unknown Venue',
    address: selectedVenueFromPin.address || '',
    latitude: selectedVenueFromPin.latitude,
    longitude: selectedVenueFromPin.longitude
  } : null;

  // Mock friends data - in a real app this would come from props or a hook
  const mockFriends = [
    { id: '1', name: 'Alex Martinez', avatar: 'AM' },
    { id: '2', name: 'Sarah Chen', avatar: 'SC' },
    { id: '3', name: 'Mike Johnson', avatar: 'MJ' }
  ];

  return (
    <>
      <FavoritesMapModal 
        open={favoritesModalOpen} 
        onOpenChange={setFavoritesModalOpen} 
      />
      
      <VenueDetailModal
        open={venueDetailModalOpen}
        onOpenChange={setVenueDetailModalOpen}
        venue={selectedVenueFromPin}
      />

      <CheckInActivityModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        venue={checkInVenue}
        friends={mockFriends}
      />

      <MessageModal
        isOpen={messageModalOpen}
        onClose={handleCloseMessage}
        friend={selectedFriend}
      />
    </>
  );
};

export default MapViewModals;
