import React from 'react';
import { MapViewState } from './MapViewState';
import { useMapViewProviders } from './MapViewProviders';
import { useMapViewHandlers } from './MapViewHandlers';
import { usePlanHandlers } from './handlers/usePlanHandlers';
import { useVenueInteractionHandlers } from './handlers/useVenueInteractionHandlers';
import { Friend } from '@/data/friendsData';
import { Venue } from '@/data/venuesData';

interface MapViewEffectsProps {
  state: MapViewState;
  providers: ReturnType<typeof useMapViewProviders>;
}

export const useMapViewEffects = ({ state, providers }: MapViewEffectsProps) => {
  const handlers = useMapViewHandlers({
    mapSearch: providers.mapSearch,
    mapInteractions: providers.mapInteractions,
    livePlanning: providers.livePlanning,
    venues: providers.venues,
    setTemporarySearchPins: providers.setTemporarySearchPins,
    setCheckInModalOpen: providers.setCheckInModalOpen,
    setCreatePlanModalOpen: providers.setCreatePlanModalOpen,
    setPlanCreationData: providers.setPlanCreationData,
    searchInputRef: providers.searchInputRef,
    setQuickChatFriends: state.setQuickChatFriends,
    setQuickChatVenue: state.setQuickChatVenue
  });

  const planHandlers = usePlanHandlers();
  
  const venueInteractionHandlers = useVenueInteractionHandlers({
    selectedVenueForInteraction: state.selectedVenueForInteraction,
    setQuickChatFriends: state.setQuickChatFriends,
    setQuickChatVenue: state.setQuickChatVenue,
    setVenueInteractionOpen: state.setVenueInteractionOpen
  });

  // Request location on first load
  React.useEffect(() => {
    if (providers.locationPermission === null) {
      providers.requestLocation();
    }
  }, [providers.locationPermission, providers.requestLocation]);

  // Enhanced venue pin click handler
  const handleEnhancedPinClick = (venueId: number) => {
    const venue = providers.venues.find(v => v.id === venueId);
    if (venue) {
      const friendsAtVenue = providers.friendsAtVenues[venueId] || [];
      
      if (friendsAtVenue.length > 0) {
        // If friends are at venue, open interaction sheet
        state.setSelectedVenueForInteraction(venue);
        state.setVenueInteractionOpen(true);
      } else {
        // Otherwise use normal pin interaction
        handlers.onPinClick(venueId);
      }
    }
  };

  // Plan-related handlers
  const handleOpenPlanSheet = () => {
    state.setPlanSheetOpen(true);
  };

  const handleCreatePlan = (planData: any) => {
    console.log('Creating plan with data:', planData);
    const newPlan = providers.addPlan(planData);
    console.log('Plan created:', newPlan);
    
    providers.livePlanning.stopPlanning();
    providers.setCreatePlanModalOpen(false);
    providers.setPlanCreationData(null);
    
    providers.mapSearch.setSearchQuery('');
    providers.setTemporarySearchPins([]);
  };

  // Handle nearby friends navigation
  React.useEffect(() => {
    const handleMapNavigation = (event: CustomEvent) => {
      const { type } = event.detail;
      
      if (type === 'showNearbyFriends') {
        // Request location if not granted
        if (providers.locationPermission !== 'granted') {
          providers.requestLocation();
        }
        
        // Clear any existing search to show all friends
        providers.mapSearch.setSearchQuery('');
        providers.setTemporarySearchPins([]);
        
        // Reset filters to show nearby friends
        providers.mapFilters.resetFilters();
        providers.mapFilters.setDistanceFilter(2); // 2km radius for nearby
        
        console.log('Map switched to nearby friends mode');
      }
    };

    window.addEventListener('mapNavigation', handleMapNavigation as EventListener);

    return () => {
      window.removeEventListener('mapNavigation', handleMapNavigation as EventListener);
    };
  }, [providers.locationPermission, providers.requestLocation, providers.mapSearch, providers.setTemporarySearchPins, providers.mapFilters]);

  return {
    handlers,
    planHandlers,
    venueInteractionHandlers,
    handleEnhancedPinClick,
    handleOpenPlanSheet,
    handleCreatePlan
  };
};
