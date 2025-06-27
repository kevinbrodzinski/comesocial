
import { useState, useEffect } from 'react';
import { ScheduledNotification, NotificationPreferences } from './types';
import { useNotificationSystem } from '../useNotificationSystem';

export const useSchedulerCore = (preferences: NotificationPreferences, isInDndHours: () => boolean) => {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const { showNotification } = useNotificationSystem();

  const scheduleNotification = (notification: ScheduledNotification) => {
    setScheduledNotifications(prev => [...prev, notification]);
  };

  // Process scheduled notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      scheduledNotifications.forEach((scheduled) => {
        if (now >= scheduled.triggerTime) {
          if (!isInDndHours()) {
            // Create complete notification object with required properties
            showNotification({
              ...scheduled.notification,
              id: scheduled.id,
              timestamp: now
            });
          }
          
          // Remove or reschedule
          setScheduledNotifications(prev => {
            if (scheduled.recurring && scheduled.interval) {
              const newTriggerTime = new Date(scheduled.triggerTime.getTime() + scheduled.interval);
              return prev.map(s => 
                s.id === scheduled.id 
                  ? { ...s, triggerTime: newTriggerTime }
                  : s
              );
            } else {
              return prev.filter(s => s.id !== scheduled.id);
            }
          });
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [scheduledNotifications, preferences, showNotification, isInDndHours]);

  return {
    scheduledNotifications,
    scheduleNotification
  };
};
