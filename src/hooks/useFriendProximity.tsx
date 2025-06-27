
import { useState, useEffect } from 'react';
import { Friend } from '@/data/friendsData';
import { useGeofenceMonitor } from './useGeofenceMonitor';
import { useNotificationScheduler } from './useNotificationScheduler';
import { Venue } from '@/data/venuesData';

interface FriendProximityAlert {
  venueId: number;
  venue: string;
  friends: Friend[];
  alertType: 'friends-here' | 'friends-arriving';
  timestamp: Date;
}

export const useFriendProximity = (friends: Friend[], venues: Venue[]) => {
  const [proximityAlerts, setProximityAlerts] = useState<FriendProximityAlert[]>([]);
  const { currentVenue, geofenceEvents } = useGeofenceMonitor(venues);
  const { scheduleFriendCheckin } = useNotificationScheduler();

  const getFriendsAtVenue = (venueId: number): Friend[] => {
    return friends.filter(friend => 
      friend.status === 'active' && 
      friend.location && 
      friend.coordinates &&
      // Mock venue matching based on friend location
      friend.location.toLowerCase().includes(venues.find(v => v.id === venueId)?.name.toLowerCase() || '')
    );
  };

  const checkFriendProximity = (venueId: number) => {
    const friendsAtVenue = getFriendsAtVenue(venueId);
    const venue = venues.find(v => v.id === venueId);
    
    if (!venue || friendsAtVenue.length < 2) return;

    const alert: FriendProximityAlert = {
      venueId,
      venue: venue.name,
      friends: friendsAtVenue,
      alertType: 'friends-here',
      timestamp: new Date()
    };

    setProximityAlerts(prev => {
      // Don't duplicate alerts for same venue within 30 minutes
      const recentAlert = prev.find(a => 
        a.venueId === venueId && 
        (Date.now() - a.timestamp.getTime()) < 30 * 60000
      );
      
      if (recentAlert) return prev;
      
      return [...prev, alert];
    });

    // Send grouped notification
    const friendNames = friendsAtVenue.slice(0, 2).map(f => f.name);
    const message = friendsAtVenue.length === 2 
      ? `${friendNames.join(' and ')} are here—want to join?`
      : `${friendNames.join(', ')} and ${friendsAtVenue.length - 2} others are here—want to join?`;

    scheduleFriendCheckin(message, venue.name);
  };

  // Monitor venue entry events
  useEffect(() => {
    geofenceEvents.forEach(event => {
      if (event.eventType === 'enter') {
        // Small delay to allow friend data to update
        setTimeout(() => {
          checkFriendProximity(event.venueId);
        }, 2000);
      }
    });
  }, [geofenceEvents]);

  // Periodic friend check for current venue
  useEffect(() => {
    if (!currentVenue) return;

    const interval = setInterval(() => {
      checkFriendProximity(currentVenue);
    }, 5 * 60000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [currentVenue, friends]);

  const dismissAlert = (alertId: string) => {
    setProximityAlerts(prev => prev.filter(a => a.timestamp.toISOString() !== alertId));
  };

  return {
    proximityAlerts,
    currentVenue,
    dismissAlert,
    getFriendsAtVenue
  };
};
