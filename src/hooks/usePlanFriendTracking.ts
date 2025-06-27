
import { useState, useEffect } from 'react';
import { Friend, friendsData } from '@/data/friendsData';
import { Plan } from '@/data/plansData';
import { FriendStatus, StopAttendance, PlanFriendTracking } from '@/types/planFriendTracking';

export const usePlanFriendTracking = (plan: Plan | null) => {
  const [friendTracking, setFriendTracking] = useState<PlanFriendTracking | null>(null);

  // Simulate friend statuses for the active plan
  const generateFriendStatuses = (plan: Plan): FriendStatus[] => {
    const planFriends = friendsData.slice(0, plan.attendees - 1); // Exclude current user
    
    return planFriends.map((friend, index) => {
      const statusOptions = ['checked-in', 'on-the-way', 'no-response'] as const;
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      let eta: string | undefined;
      if (randomStatus === 'on-the-way') {
        eta = `${Math.floor(Math.random() * 15) + 5}min`;
      }

      return {
        friendId: friend.id,
        status: randomStatus,
        eta,
        lastUpdate: new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString(),
        stopId: randomStatus === 'checked-in' ? plan.stops[0].id : undefined
      };
    });
  };

  // Generate stop attendance data
  const generateStopAttendance = (plan: Plan, friendStatuses: FriendStatus[]): StopAttendance[] => {
    return plan.stops.map(stop => {
      const friendsPresent = friendStatuses
        .filter(fs => fs.status === 'checked-in' && fs.stopId === stop.id)
        .map(fs => friendsData.find(f => f.id === fs.friendId)!)
        .filter(Boolean);

      const friendsEnRoute = friendStatuses
        .filter(fs => fs.status === 'on-the-way')
        .map(fs => friendsData.find(f => f.id === fs.friendId)!)
        .filter(Boolean);

      const friendsNoResponse = friendStatuses
        .filter(fs => fs.status === 'no-response')
        .map(fs => friendsData.find(f => f.id === fs.friendId)!)
        .filter(Boolean);

      const friendsLeftEarly = friendStatuses
        .filter(fs => fs.status === 'left-early')
        .map(fs => friendsData.find(f => f.id === fs.friendId)!)
        .filter(Boolean);

      return {
        stopId: stop.id,
        friendsPresent,
        friendsEnRoute,
        friendsNoResponse,
        friendsLeftEarly
      };
    });
  };

  // Initialize tracking when plan changes
  useEffect(() => {
    if (!plan) {
      setFriendTracking(null);
      return;
    }

    const friendStatuses = generateFriendStatuses(plan);
    const stopAttendance = generateStopAttendance(plan, friendStatuses);

    setFriendTracking({
      planId: plan.id,
      friendStatuses,
      stopAttendance,
      lastUpdated: new Date().toISOString()
    });
  }, [plan?.id]);

  // Listen for user status changes and update tracking
  useEffect(() => {
    const handleUserStatusChange = (event: CustomEvent) => {
      const { status, venueId } = event.detail;
      
      if (!friendTracking || !plan) return;

      // Update the tracking to include current user's effect on attendance
      setFriendTracking(prev => {
        if (!prev) return null;

        const updatedStopAttendance = prev.stopAttendance.map(attendance => {
          if (attendance.stopId === venueId && status.status === 'checked-in') {
            // User checked in - this affects the venue's attendance count
            return {
              ...attendance,
              // Note: In a real app, you'd have a "current user" representation
              // For now, this updates the context that user is present
            };
          }
          return attendance;
        });

        return {
          ...prev,
          stopAttendance: updatedStopAttendance,
          lastUpdated: new Date().toISOString()
        };
      });
    };

    window.addEventListener('userStatusChange', handleUserStatusChange as EventListener);
    return () => {
      window.removeEventListener('userStatusChange', handleUserStatusChange as EventListener);
    };
  }, [friendTracking, plan]);

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    if (!friendTracking || !plan) return;

    const interval = setInterval(() => {
      setFriendTracking(prev => {
        if (!prev) return null;

        // Randomly update some friend statuses
        const updatedStatuses = prev.friendStatuses.map(status => {
          if (Math.random() < 0.2) { // 20% chance to update
            const now = new Date().toISOString();
            
            if (status.status === 'on-the-way' && Math.random() < 0.3) {
              // Sometimes friends arrive
              return {
                ...status,
                status: 'checked-in' as const,
                eta: undefined,
                lastUpdate: now,
                stopId: plan.stops[0].id
              };
            } else if (status.status === 'on-the-way') {
              // Update ETA
              const currentEta = parseInt(status.eta?.replace('min', '') || '10');
              const newEta = Math.max(1, currentEta - Math.floor(Math.random() * 3));
              return {
                ...status,
                eta: `${newEta}min`,
                lastUpdate: now
              };
            }
          }
          return status;
        });

        const updatedStopAttendance = generateStopAttendance(plan, updatedStatuses);

        return {
          ...prev,
          friendStatuses: updatedStatuses,
          stopAttendance: updatedStopAttendance,
          lastUpdated: new Date().toISOString()
        };
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [friendTracking?.planId, plan]);

  const getFriendStatusSummary = () => {
    if (!friendTracking) return { checkedIn: 0, onTheWay: 0, noResponse: 0, leftEarly: 0 };

    return friendTracking.friendStatuses.reduce((acc, status) => {
      switch (status.status) {
        case 'checked-in':
          acc.checkedIn++;
          break;
        case 'on-the-way':
          acc.onTheWay++;
          break;
        case 'no-response':
          acc.noResponse++;
          break;
        case 'left-early':
          acc.leftEarly++;
          break;
      }
      return acc;
    }, { checkedIn: 0, onTheWay: 0, noResponse: 0, leftEarly: 0 });
  };

  return {
    friendTracking,
    getFriendStatusSummary,
    isLoading: plan && !friendTracking
  };
};
