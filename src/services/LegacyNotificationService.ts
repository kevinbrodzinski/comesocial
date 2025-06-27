
import { Notification } from '../types/messaging';

export class LegacyNotificationService {
  private notifications: Notification[] = [];
  private listeners: Set<(notifications: Notification[]) => void> = new Set();

  // Notification listeners
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Legacy notification methods (for plan updates, etc.)
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);

    // Auto-expire if specified (only for non-persistent notifications)
    if (notification.autoExpire && notification.type !== 'friend-ping' && notification.type !== 'message') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, notification.autoExpire * 1000);
    }

    this.notify();
    return newNotification.id;
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clearAll() {
    this.notifications = [];
    this.notify();
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Friend request notifications
  addFriendRequestNotification(friendName: string, type: 'received' | 'accepted' | 'declined') {
    const notificationTypes = {
      received: {
        title: '👥 New Friend Request',
        message: `${friendName} wants to be friends!`,
        autoExpire: undefined // Persistent
      },
      accepted: {
        title: '🎉 Friend Request Accepted',
        message: `${friendName} accepted your friend request!`,
        autoExpire: 8
      },
      declined: {
        title: 'Friend Request Declined',
        message: `${friendName} declined your friend request`,
        autoExpire: 5
      }
    };

    const config = notificationTypes[type];
    return this.addNotification({
      type: 'friend-ping', // Reuse existing type for now
      title: config.title,
      message: config.message,
      autoExpire: config.autoExpire
    });
  }

  sendPlanInvitation(planId: number, planName: string, recipientIds: number[]) {
    return this.addNotification({
      type: 'plan-invite',
      title: 'Invitations Sent!',
      message: `Invited ${recipientIds.length} friends to "${planName}"`,
      planId,
      autoExpire: 8
    });
  }
}
