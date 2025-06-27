
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface NotificationAlert {
  id: string;
  type: 'friend-checkin' | 'crowd-threshold' | 'optimal-timing' | 'group-movement' | 'venue-closing';
  title: string;
  message: string;
  venue?: string;
  friendName?: string;
  crowdLevel?: number;
  urgency: 'low' | 'medium' | 'high';
  actionLabel?: string;
  onAction?: () => void;
  timestamp: Date;
  autoExpire?: number; // seconds
}

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [isEnabled, setIsEnabled] = useState(false); // Changed from true to false

  // Disabled the auto-notification interval since it's overwhelming
  // useEffect(() => {
  //   if (!isEnabled) return;

  //   const interval = setInterval(() => {
  //     // Randomly generate notifications for demo
  //     const notificationTypes = [
  //       {
  //         type: 'friend-checkin' as const,
  //         title: '👋 Friend Alert',
  //         message: 'Alex just checked in at Sky Lounge',
  //         venue: 'Sky Lounge',
  //         friendName: 'Alex',
  //         urgency: 'medium' as const,
  //         actionLabel: 'Join them'
  //       },
  //       {
  //         type: 'crowd-threshold' as const,
  //         title: '🔥 Hot Spot Alert',
  //         message: 'Underground Club hit 80% capacity - perfect buzz!',
  //         venue: 'Underground Club',
  //         crowdLevel: 80,
  //         urgency: 'high' as const,
  //         actionLabel: 'Check it out'
  //       },
  //       {
  //         type: 'optimal-timing' as const,
  //         title: '⏰ Perfect Timing',
  //         message: 'Sky Lounge crowd is peaking - great time to head out!',
  //         venue: 'Sky Lounge',
  //         urgency: 'medium' as const,
  //         actionLabel: 'Join the fun'
  //       }
  //     ];

  //     // 30% chance to show a notification every 15 seconds
  //     if (Math.random() < 0.3) {
  //       const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
  //       showNotification({
  //         ...notification,
  //         id: Date.now().toString(),
  //         timestamp: new Date(),
  //         autoExpire: 5
  //       });
  //     }
  //   }, 15000);

  //   return () => clearInterval(interval);
  // }, [isEnabled]);

  const showNotification = (alert: NotificationAlert) => {
    // Only show notifications if explicitly enabled
    if (!isEnabled) return;
    
    setNotifications(prev => [alert, ...prev.slice(0, 4)]); // Keep only 5 most recent

    // Show toast notification
    toast({
      title: alert.title,
      description: alert.message,
      duration: (alert.autoExpire || 5) * 1000,
      action: alert.actionLabel && alert.onAction ? (
        <button onClick={alert.onAction} className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
          {alert.actionLabel}
        </button>
      ) : undefined
    });

    // Auto-expire notification
    if (alert.autoExpire) {
      setTimeout(() => {
        dismissNotification(alert.id);
      }, alert.autoExpire * 1000);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    isEnabled,
    setIsEnabled,
    showNotification,
    dismissNotification,
    clearAllNotifications
  };
};
