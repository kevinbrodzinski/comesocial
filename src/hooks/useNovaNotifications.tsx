
import { useEffect } from 'react';
import { useNotificationScheduler } from './useNotificationScheduler';
import { usePredictiveEngine } from './usePredictiveEngine';
import { useFriendProximity } from './useFriendProximity';
import { useGroupWatchlist } from './useGroupWatchlist';
import { useFriendsData } from './useFriendsData';
import { useVenuesData } from './useVenuesData';

export const useNovaNotifications = () => {
  const { friends } = useFriendsData();
  const { venues } = useVenuesData();
  const { 
    scheduleEventReminder, 
    scheduleFriendCheckin, 
    scheduleCrowdAlert,
    preferences 
  } = useNotificationScheduler();
  
  const { predictions, isActive } = usePredictiveEngine(venues);
  const { proximityAlerts } = useFriendProximity(friends, venues);
  const { dailySummary } = useGroupWatchlist(friends);

  // Handle predictive notifications
  useEffect(() => {
    if (!isActive || !preferences.enabled) return;

    predictions.forEach(prediction => {
      if (prediction.confidence > 0.8 && prediction.prediction === 'crowd-rising') {
        scheduleCrowdAlert(prediction.venue, 85); // Mock crowd level
      }
    });
  }, [predictions, isActive, preferences.enabled]);

  // Handle friend proximity notifications
  useEffect(() => {
    proximityAlerts.forEach(alert => {
      if (alert.alertType === 'friends-here' && alert.friends.length >= 2) {
        const friendNames = alert.friends.slice(0, 2).map(f => f.name).join(' and ');
        scheduleFriendCheckin(friendNames, alert.venue);
      }
    });
  }, [proximityAlerts]);

  // Trigger notifications based on Nova AI context
  const triggerNovaNotification = (
    type: 'timing' | 'crowd' | 'friend' | 'prediction',
    context: any
  ) => {
    if (!preferences.enabled) return;

    switch (type) {
      case 'timing':
        if (context.eventName && context.eventTime) {
          scheduleEventReminder(context.eventName, new Date(context.eventTime));
        }
        break;
        
      case 'crowd':
        if (context.venue && context.crowdLevel) {
          scheduleCrowdAlert(context.venue, context.crowdLevel);
        }
        break;
        
      case 'friend':
        if (context.friendName && context.venue) {
          scheduleFriendCheckin(context.friendName, context.venue);
        }
        break;
        
      case 'prediction':
        // Handle predictive notifications based on Nova's analysis
        if (context.prediction && context.venue) {
          scheduleCrowdAlert(context.venue, context.crowdLevel || 75);
        }
        break;
    }
  };

  return {
    triggerNovaNotification,
    isNotificationsEnabled: preferences.enabled,
    dailySummary,
    proximityAlerts,
    predictions: predictions.filter(p => p.confidence > 0.7)
  };
};
