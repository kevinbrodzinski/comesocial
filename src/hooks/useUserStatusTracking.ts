
import { useState, useEffect } from 'react';
import { UserStatus, UserStatusType } from '@/types/userStatus';
import { Plan } from '@/data/plansData';
import StatusActionService from '@/services/StatusActionService';

export const useUserStatusTracking = (plan: Plan | null) => {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    status: 'on-my-way',
    timestamp: new Date().toISOString()
  });

  const statusActionService = StatusActionService.getInstance();

  // Initialize status when plan changes
  useEffect(() => {
    if (plan) {
      setUserStatus({
        status: 'on-my-way',
        timestamp: new Date().toISOString(),
        venueId: plan.stops[0]?.id
      });
    }
  }, [plan?.id]);

  const updateUserStatus = async (status: UserStatusType, venueId?: number, context?: any) => {
    const newStatus: UserStatus = {
      status,
      timestamp: new Date().toISOString(),
      venueId,
      eta: context?.eta,
      note: context?.note,
      delayReason: context?.delayReason,
      estimatedArrival: context?.estimatedArrival
    };

    setUserStatus(newStatus);

    // Execute status-specific actions
    const actionContext = {
      ...context,
      plan,
      venueId,
      hasNextStop: plan?.stops && plan.stops.length > 1,
      currentVenue: plan?.stops.find(s => s.id === venueId)
    };

    try {
      await statusActionService.executeStatusActions(status, actionContext);
    } catch (error) {
      console.error('Error executing status actions:', error);
    }

    // Emit event for other components to listen to
    const event = new CustomEvent('userStatusChange', {
      detail: {
        status: newStatus,
        plan,
        venueId,
        context: actionContext
      }
    });
    window.dispatchEvent(event);

    console.log('User status updated with actions:', newStatus, actionContext);
    return newStatus;
  };

  const getCurrentVenueStatus = (venueId: number) => {
    if (userStatus.venueId === venueId) {
      return userStatus;
    }
    return null;
  };

  const getStatusHistory = () => {
    // This could be enhanced to track status history
    return [userStatus];
  };

  const getEstimatedArrival = () => {
    if (userStatus.eta) {
      const now = new Date();
      const etaMinutes = parseInt(userStatus.eta);
      return new Date(now.getTime() + etaMinutes * 60000);
    }
    return null;
  };

  return {
    userStatus,
    updateUserStatus,
    getCurrentVenueStatus,
    getStatusHistory,
    getEstimatedArrival
  };
};
