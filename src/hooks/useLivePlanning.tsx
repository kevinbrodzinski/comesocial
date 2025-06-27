
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PlanStop {
  id: string;
  name: string;
  address: string;
  estimatedTime: number;
  cost: number;
  lat: number;
  lng: number;
}

interface SelectedVenue {
  id: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: number;
  photos?: string[];
  estimatedTime?: number;
  cost?: number;
  lat: number;
  lng: number;
}

export const useLivePlanning = () => {
  const [planningMode, setPlanningMode] = useState(false);
  const [stagingSheetOpen, setStagingSheetOpen] = useState(false);
  const [stagingSheetMinimized, setStagingSheetMinimized] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<SelectedVenue | null>(null);
  const [planStops, setPlanStops] = useState<PlanStop[]>([]);
  const [planName, setPlanName] = useState('');
  const { toast } = useToast();

  const startPlanning = useCallback(() => {
    setPlanningMode(true);
  }, []);

  const stopPlanning = useCallback(() => {
    setPlanningMode(false);
    setStagingSheetOpen(false);
    setStagingSheetMinimized(false);
    setPlanStops([]);
    setSelectedVenue(null);
    setPlanName('');
  }, []);

  const selectVenue = useCallback((venue: SelectedVenue) => {
    setSelectedVenue(venue);
  }, []);

  const closeVenueDetail = useCallback(() => {
    setSelectedVenue(null);
  }, []);

  const addVenueToPlan = useCallback((venue: SelectedVenue) => {
    const newStop: PlanStop = {
      id: venue.id,
      name: venue.name,
      address: venue.address,
      estimatedTime: venue.estimatedTime || 90,
      cost: venue.cost || 25,
      lat: venue.lat,
      lng: venue.lng
    };

    setPlanStops(prev => [...prev, newStop]);
    setStagingSheetOpen(true);
    setStagingSheetMinimized(false);
    setSelectedVenue(null);
    
    toast({
      title: "Added to Plan",
      description: `${venue.name} has been added to your plan`,
    });
  }, [toast]);

  const removeStopFromPlan = useCallback((stopId: string) => {
    setPlanStops(prev => prev.filter(stop => stop.id !== stopId));
  }, []);

  const reorderPlanStops = useCallback((startIndex: number, endIndex: number) => {
    setPlanStops(prev => {
      const newStops = [...prev];
      const [removed] = newStops.splice(startIndex, 1);
      newStops.splice(endIndex, 0, removed);
      return newStops;
    });
  }, []);

  const minimizeStagingSheet = useCallback(() => {
    setStagingSheetMinimized(true);
  }, []);

  const maximizeStagingSheet = useCallback(() => {
    setStagingSheetMinimized(false);
  }, []);

  const closeStagingSheet = useCallback(() => {
    setStagingSheetOpen(false);
    setStagingSheetMinimized(false);
    setPlanStops([]);
    setPlanningMode(false);
    setPlanName('');
  }, []);

  const addAnotherStop = useCallback(() => {
    setStagingSheetMinimized(true);
    // This will signal to the parent to re-focus the search
  }, []);

  return {
    planningMode,
    stagingSheetOpen,
    stagingSheetMinimized,
    selectedVenue,
    planStops,
    planName,
    setPlanName,
    startPlanning,
    stopPlanning,
    selectVenue,
    closeVenueDetail,
    addVenueToPlan,
    removeStopFromPlan,
    reorderPlanStops,
    minimizeStagingSheet,
    maximizeStagingSheet,
    closeStagingSheet,
    addAnotherStop
  };
};
