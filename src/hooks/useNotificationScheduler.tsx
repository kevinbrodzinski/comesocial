
import { useState } from 'react';
import { useNotificationSystem } from './useNotificationSystem';
import { useDndLogic } from './notifications/useDndLogic';
import { useNotificationGrouping } from './notifications/useNotificationGrouping';
import { useSchedulerCore } from './notifications/useSchedulerCore';
import { NotificationPreferences, ScheduledNotification } from './notifications/types';

export const useNotificationScheduler = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: false, // Changed from true to false
    preEventMinutes: 30,
    friendAlerts: false, // Changed from true to false
    crowdThreshold: false, // Changed from true to false
    dndStart: "23:00",
    dndEnd: "09:00",
    locationAlerts: false // Changed from true to false
  });
  
  const { showNotification } = useNotificationSystem();
  const { isInDndHours } = useDndLogic(preferences);
  const { groupNotifications } = useNotificationGrouping(showNotification);
  const { scheduleNotification } = useSchedulerCore(preferences, isInDndHours);

  const scheduleEventReminder = (eventName: string, eventTime: Date, preMinutes: number = preferences.preEventMinutes) => {
    if (!preferences.enabled) return;

    const reminderTime = new Date(eventTime.getTime() - preMinutes * 60000);
    
    scheduleNotification({
      id: `event-reminder-${Date.now()}`,
      triggerTime: reminderTime,
      notification: {
        type: 'optimal-timing',
        title: '⏰ Event Starting Soon',
        message: `${eventName} starts in ${preMinutes} minutes—ready?`,
        urgency: 'medium',
        actionLabel: 'View Plan',
        autoExpire: 10
      }
    });
  };

  const scheduleFriendCheckin = (friendName: string, venue: string) => {
    if (!preferences.enabled || !preferences.friendAlerts || isInDndHours()) return;

    const notification = {
      id: `friend-checkin-${Date.now()}`,
      type: 'friend-checkin' as const,
      title: '👋 Friend Alert',
      message: `${friendName} just checked in at ${venue}`,
      venue,
      friendName,
      urgency: 'medium' as const,
      actionLabel: 'Join them',
      timestamp: new Date(),
      autoExpire: 8
    };

    // Group friend check-ins by venue
    groupNotifications([notification], `friend-checkin-${venue}`);
  };

  const scheduleCrowdAlert = (venue: string, crowdLevel: number) => {
    if (!preferences.enabled || !preferences.crowdThreshold || isInDndHours()) return;

    showNotification({
      id: `crowd-alert-${Date.now()}`,
      type: 'crowd-threshold',
      title: '🔥 Hot Spot Alert',
      message: `${venue} just hit ${crowdLevel}% capacity—perfect buzz!`,
      venue,
      crowdLevel,
      urgency: 'high',
      actionLabel: 'Check it out',
      timestamp: new Date(),
      autoExpire: 10
    });
  };

  return {
    preferences,
    setPreferences,
    scheduleNotification,
    scheduleEventReminder,
    scheduleFriendCheckin,
    scheduleCrowdAlert,
    isInDndHours
  };
};
