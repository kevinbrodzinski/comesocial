
import { useState } from 'react';

export const useMapInteractions = () => {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [venueDetailModalOpen, setVenueDetailModalOpen] = useState(false);

  const handlePinClick = (venueId: number) => {
    if (selectedPin === venueId) {
      // Second tap - open full venue detail
      setVenueDetailModalOpen(true);
    } else {
      // First tap - show mini preview with bounce animation
      setSelectedPin(venueId);
    }
  };

  const handleFavoritesClick = () => {
    setFavoritesModalOpen(true);
  };

  return {
    selectedPin,
    setSelectedPin,
    favoritesModalOpen,
    setFavoritesModalOpen,
    venueDetailModalOpen,
    setVenueDetailModalOpen,
    handlePinClick,
    handleFavoritesClick
  };
};
