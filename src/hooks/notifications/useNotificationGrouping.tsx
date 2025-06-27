
import { useState, useRef } from 'react';
import { NotificationAlert } from './types';

export const useNotificationGrouping = (showNotification: (notification: NotificationAlert) => void) => {
  const pendingGroups = useRef<{ [key: string]: NotificationAlert[] }>({});
  const groupTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const groupNotifications = (notifications: NotificationAlert[], groupKey: string) => {
    if (!pendingGroups.current[groupKey]) {
      pendingGroups.current[groupKey] = [];
    }
    
    pendingGroups.current[groupKey].push(...notifications);
    
    // Clear existing timeout for this group
    if (groupTimeouts.current[groupKey]) {
      clearTimeout(groupTimeouts.current[groupKey]);
    }
    
    // Set new timeout to process group after 5 seconds
    groupTimeouts.current[groupKey] = setTimeout(() => {
      const groupedNotifications = pendingGroups.current[groupKey];
      if (groupedNotifications.length > 0) {
        processGroupedNotifications(groupedNotifications, groupKey);
        delete pendingGroups.current[groupKey];
        delete groupTimeouts.current[groupKey];
      }
    }, 5000);
  };

  const processGroupedNotifications = (notifications: NotificationAlert[], groupKey: string) => {
    if (notifications.length === 1) {
      showNotification(notifications[0]);
      return;
    }

    // Group friend check-ins
    if (groupKey.startsWith('friend-checkin')) {
      const venue = notifications[0].venue;
      const friends = notifications.map(n => n.friendName).filter(Boolean);
      const friendsText = friends.length > 2 
        ? `${friends.slice(0, 2).join(', ')} and ${friends.length - 2} others`
        : friends.join(' and ');

      showNotification({
        id: `grouped-${Date.now()}`,
        type: 'friend-checkin',
        title: '👋 Friends Alert',
        message: `${friendsText} just checked in at ${venue}`,
        venue,
        urgency: 'medium',
        actionLabel: 'Join them',
        timestamp: new Date(),
        autoExpire: 10
      });
    }
  };

  return {
    groupNotifications
  };
};
