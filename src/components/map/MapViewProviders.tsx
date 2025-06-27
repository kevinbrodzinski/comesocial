
import { useState, useRef, useMemo } from 'react';
import { useVenuesData } from '../../hooks/useVenuesData';
import { useMapFilters } from '../../hooks/useMapFilters';
import { useMapSearch } from '../../hooks/useMapSearch';
import { useMapInteractions } from '../../hooks/useMapInteractions';
import { useFriendVenueMapping } from '../../hooks/useFriendVenueMapping';
import { useCheckInActivity } from '../../hooks/useCheckInActivity';
import { usePlansData } from '../../hooks/usePlansData';
import { useLocationPermission } from '../../hooks/useLocationPermission';
import { useLivePlanning } from '../../hooks/useLivePlanning';
import { usePlanState } from '../../hooks/usePlanState';

export const useMapViewProviders = () => {
  const { venues, getVenueColor } = useVenuesData();
  const { plans, addPlan } = usePlansData();
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedPlanForMap, setSelectedPlanForMap] = useState<any>(null);
  const [temporarySearchPins, setTemporarySearchPins] = useState<any[]>([]);
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const [planCreationData, setPlanCreationData] = useState<any>(null);
  const { userLocation, locationPermission, requestLocation } = useLocationPermission();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize hooks without memoization to avoid circular dependencies
  const mapFilters = useMapFilters(venues);
  const mapSearch = useMapSearch(venues);
  const mapInteractions = useMapInteractions();
  const checkInActivity = useCheckInActivity();
  const livePlanning = useLivePlanning();
  const planState = usePlanState();
  
  // Simple memoization for friend venue mapping
  const friendsAtVenues = useFriendVenueMapping(venues);

  // Return object without complex memoization that was causing React queue issues
  return {
    venues,
    getVenueColor,
    plans,
    addPlan,
    checkInModalOpen,
    setCheckInModalOpen,
    selectedPlanForMap,
    setSelectedPlanForMap,
    temporarySearchPins,
    setTemporarySearchPins,
    createPlanModalOpen,
    setCreatePlanModalOpen,
    planCreationData,
    setPlanCreationData,
    userLocation,
    locationPermission,
    requestLocation,
    searchInputRef,
    mapFilters,
    mapSearch,
    mapInteractions,
    checkInActivity,
    livePlanning,
    friendsAtVenues,
    planState
  };
};
