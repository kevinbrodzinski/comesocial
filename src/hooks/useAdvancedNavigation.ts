
import { useEffect } from 'react';
import NavigationService from '@/services/NavigationService';

export const useAdvancedNavigation = () => {
  const navigationService = NavigationService.getInstance();

  useEffect(() => {
    // Register navigation callbacks
    navigationService.registerCallback('mapNavigation', (data) => {
      // This will be handled by the map component
      const event = new CustomEvent('mapNavigation', { detail: data });
      window.dispatchEvent(event);
    });

    return () => {
      navigationService.unregisterCallback('mapNavigation');
    };
  }, [navigationService]);

  const navigateToMapWithVenue = (venueId: number, venueName?: string) => {
    navigationService.navigateToMapWithVenue(venueId, venueName);
    
    // Switch to map tab
    const event = new CustomEvent('switchTab', { detail: { tab: 'map' } });
    window.dispatchEvent(event);
  };

  const navigateToMapWithNearbyFriends = () => {
    navigationService.navigateToMapWithNearbyFriends();
    
    // Switch to map tab
    const event = new CustomEvent('switchTab', { detail: { tab: 'map' } });
    window.dispatchEvent(event);
  };

  const openDirections = (latitude: number, longitude: number, venueName: string) => {
    navigationService.openDeviceDirections(latitude, longitude, venueName);
  };

  return {
    navigateToMapWithVenue,
    navigateToMapWithNearbyFriends,
    openDirections
  };
};
