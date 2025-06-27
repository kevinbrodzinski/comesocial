
import { useState, useMemo } from 'react';
import { venues, getVenueById, getVenuesByType, getVenuesByVibe, getVenuesByCrowdLevel, type Venue } from '../data/venuesData';

export const useVenuesData = () => {
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 4]); // Default favorite venue IDs
  const [notifications, setNotifications] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: false,
    4: true
  });

  const allVenues = useMemo(() => venues, []);
  
  const favoriteVenues = useMemo(() => {
    return venues.filter(venue => favorites.includes(venue.id));
  }, [favorites]);

  const addToFavorites = (venueId: number) => {
    setFavorites(prev => [...prev, venueId]);
  };

  const removeFromFavorites = (venueId: number) => {
    setFavorites(prev => prev.filter(id => id !== venueId));
  };

  const toggleFavorite = (venueId: number) => {
    if (favorites.includes(venueId)) {
      removeFromFavorites(venueId);
    } else {
      addToFavorites(venueId);
    }
  };

  const toggleNotification = (venueId: number) => {
    setNotifications(prev => ({
      ...prev,
      [venueId]: !prev[venueId]
    }));
  };

  const getCrowdColor = (level: number) => {
    if (level > 80) return 'text-red-400';
    if (level > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCrowdLabel = (level: number) => {
    if (level > 80) return 'Packed';
    if (level > 60) return 'Moderate';
    return 'Chill';
  };

  const getVenueColor = (crowd: number) => {
    if (crowd > 80) return 'bg-red-500';
    if (crowd > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return {
    venues: allVenues,
    favoriteVenues,
    favorites,
    notifications,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    toggleNotification,
    getCrowdColor,
    getCrowdLabel,
    getVenueColor,
    getVenueById,
    getVenuesByType,
    getVenuesByVibe,
    getVenuesByCrowdLevel
  };
};
