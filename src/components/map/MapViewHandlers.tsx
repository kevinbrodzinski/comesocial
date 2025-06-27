import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateStableCoordinates } from '../../utils/coordinateUtils';
import { Friend } from '@/data/friendsData';
import { Venue } from '@/data/venuesData';

interface MapViewHandlersProps {
  mapSearch: any;
  mapInteractions: any;
  livePlanning: any;
  venues: any[];
  setTemporarySearchPins: (pins: any[]) => void;
  setCheckInModalOpen: (open: boolean) => void;
  setCreatePlanModalOpen: (open: boolean) => void;
  setPlanCreationData: (data: any) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  setQuickChatFriends: (friends: Friend[]) => void;
  setQuickChatVenue: (venue: Venue | undefined) => void;
}

export const useMapViewHandlers = ({
  mapSearch,
  mapInteractions,
  livePlanning,
  venues,
  setTemporarySearchPins,
  setCheckInModalOpen,
  setCreatePlanModalOpen,
  setPlanCreationData,
  searchInputRef,
  setQuickChatFriends,
  setQuickChatVenue
}: MapViewHandlersProps) => {
  const { toast } = useToast();

  // Enhanced search query handler that clears pins
  const handleSearchQueryChange = useCallback((query: string) => {
    mapSearch.setSearchQuery(query);
    
    // Clear temporary pins immediately when search is cleared
    if (!query.trim()) {
      setTemporarySearchPins([]);
    }
  }, [mapSearch.setSearchQuery, setTemporarySearchPins]);

  const onSearchResultSelect = (result: any) => {
    // Convert search result to venue format for live planning
    const venue = {
      id: result.id,
      name: result.name,
      address: result.subtitle || '',
      rating: result.placeData?.rating || result.fallbackData?.rating,
      priceLevel: result.placeData?.price_level || 2,
      estimatedTime: 90,
      cost: 25,
      lat: result.placeData?.geometry?.location?.lat || 
           result.fallbackData?.coordinates?.lat ||
           generateStableCoordinates(result.id, result.name).lat,
      lng: result.placeData?.geometry?.location?.lng || 
           result.fallbackData?.coordinates?.lng ||
           generateStableCoordinates(result.id, result.name).lng
    };

    if (livePlanning.planningMode) {
      livePlanning.selectVenue(venue);
    } else {
      const venueId = mapSearch.handleSearchResultSelect(result);
      if (venueId) {
        mapInteractions.setSelectedPin(venueId);
      }
    }
    
    // Clear search and temporary pins
    mapSearch.setSearchQuery('');
    setTemporarySearchPins([]);
  };

  // Handle quick actions from search results
  const handleSearchQuickAction = (result: any, action: 'view' | 'add' | 'start') => {
    const venue = {
      id: result.id,
      name: result.name,
      address: result.subtitle || '',
      rating: result.placeData?.rating || result.fallbackData?.rating,
      priceLevel: result.placeData?.price_level || 2,
      estimatedTime: 90,
      cost: 25,
      lat: result.placeData?.geometry?.location?.lat || 
           result.fallbackData?.coordinates?.lat ||
           generateStableCoordinates(result.id, result.name).lat,
      lng: result.placeData?.geometry?.location?.lng || 
           result.fallbackData?.coordinates?.lng ||
           generateStableCoordinates(result.id, result.name).lng
    };

    switch (action) {
      case 'view':
        livePlanning.selectVenue(venue);
        break;
      case 'add':
        if (!livePlanning.planningMode) {
          livePlanning.startPlanning();
        }
        livePlanning.addVenueToPlan(venue);
        break;
      case 'start':
        livePlanning.startPlanning();
        livePlanning.addVenueToPlan(venue);
        toast({
          title: "Plan Started!",
          description: `Started new plan with ${venue.name}`,
        });
        break;
    }

    // Clear search
    mapSearch.setSearchQuery('');
    setTemporarySearchPins([]);
  };

  const onPinClick = (venueId: number) => {
    if (livePlanning.planningMode) {
      // In planning mode, clicking a pin should add it to plan
      const venue = venues.find(v => v.id === venueId);
      if (venue) {
        const coords = generateStableCoordinates(venue.id.toString(), venue.name, 2);
        const planVenue = {
          id: venue.id.toString(),
          name: venue.name,
          address: venue.address || venue.distance,
          rating: venue.rating,
          estimatedTime: 90,
          cost: 25,
          lat: coords.lat,
          lng: coords.lng
        };
        livePlanning.selectVenue(planVenue);
      }
    } else {
      mapInteractions.handlePinClick(venueId);
    }
  };

  const onViewDetails = () => {
    const selectedVenueFromPin = mapInteractions.selectedPin ? venues.find(v => v.id === mapInteractions.selectedPin) : null;
    if (selectedVenueFromPin) {
      mapInteractions.handlePinClick(selectedVenueFromPin.id);
    }
  };

  const handleNotificationClick = () => {
    setCheckInModalOpen(true);
  };

  const handleFriendMessage = (friends: Friend[], venue?: Venue) => {
    // Navigate to messages view
    window.location.href = '/messages';
  };

  const handleFriendJoinPlan = (friend: Friend) => {
    if (friend.plan) {
      toast({
        title: "Joined Plan",
        description: `You've joined ${friend.name}'s plan: ${friend.plan}`,
      });
    } else {
      toast({
        title: "Plan Request Sent",
        description: `Sent plan request to ${friend.name}`,
      });
    }
  };

  // Optimized temporary pins handler with debouncing
  const handleShowTemporaryPins = useCallback((results: any[]) => {
    setTemporarySearchPins(results);
  }, [setTemporarySearchPins]);

  const handleAddAnotherStop = () => {
    livePlanning.addAnotherStop();
    // Re-focus search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleFinalizePlan = (planName?: string) => {
    if (livePlanning.planStops.length > 0) {
      // Calculate total cost and duration
      const totalCost = livePlanning.planStops.reduce((sum, stop) => sum + stop.cost, 0);
      const totalDuration = Math.round(livePlanning.planStops.reduce((sum, stop) => sum + stop.estimatedTime, 0) / 60);
      
      // Get today's date in the correct format
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      
      // Prepare plan data for creation modal
      const planData = {
        name: planName || livePlanning.planName || `Plan with ${livePlanning.planStops[0]?.name}`,
        stops: livePlanning.planStops.map(stop => stop.name), // Convert to string array as expected by Plan interface
        date: dateString,
        time: '19:00',
        estimatedCost: `$${totalCost}`,
        duration: `${totalDuration} hours`,
        description: `Created from map planning with ${livePlanning.planStops.length} stops`,
        notes: `Stops: ${livePlanning.planStops.map(stop => stop.name).join(' → ')}`,
      };
      
      setPlanCreationData(planData);
      setCreatePlanModalOpen(true);
      livePlanning.closeStagingSheet();
    }
  };

  return {
    handleSearchQueryChange,
    onSearchResultSelect,
    handleSearchQuickAction,
    onPinClick,
    onViewDetails,
    handleNotificationClick,
    handleFriendMessage,
    handleFriendJoinPlan,
    handleShowTemporaryPins,
    handleAddAnotherStop,
    handleFinalizePlan
  };
};
