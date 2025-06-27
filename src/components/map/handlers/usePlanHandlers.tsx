
import { useCallback } from 'react';
import PlanStateService from '@/services/PlanStateService';

export const usePlanHandlers = () => {
  const handleStartNight = useCallback(() => {
    console.log('Starting night');
    const service = PlanStateService.getInstance();
    service.startNight();
  }, []);

  const handlePlanCheckIn = useCallback(() => {
    console.log('Checking in to current stop');
    const service = PlanStateService.getInstance();
    service.checkInToVenue();
  }, []);

  const handleMoveToNext = useCallback(() => {
    console.log('Moving to next stop');
    const service = PlanStateService.getInstance();
    service.moveToNextStop();
  }, []);

  const handlePlanOptions = useCallback(() => {
    console.log('Show plan options');
  }, []);

  const handlePingGroup = useCallback((activePlan: any) => {
    if (activePlan) {
      console.log('Pinging group for plan:', activePlan.name);
    }
  }, []);

  const handleLeaveVenue = useCallback(() => {
    console.log('Leaving current venue');
  }, []);

  const handleMessageFriends = useCallback(() => {
    console.log('Opening messages with plan friends');
  }, []);

  const handleNavigateToVenue = useCallback((stopId: number) => {
    console.log('Navigating to venue with stop ID:', stopId);
  }, []);

  return {
    handleStartNight,
    handlePlanCheckIn,
    handleMoveToNext,
    handlePlanOptions,
    handlePingGroup,
    handleLeaveVenue,
    handleMessageFriends,
    handleNavigateToVenue
  };
};
