
import { useState } from 'react';

export interface WatchedEvent {
  id: number;
  venue: string;
  type: string;
  vibe: string;
  image: string;
  crowdLevel: number;
  distance: string;
  timePosted: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'ending-soon' | 'ended';
  friendsCount: number;
  friendsAvatars: string[];
  totalAttendees: number;
  lastUpdate: string;
}

export interface WatchlistNotification {
  id: number;
  eventId: number;
  eventName: string;
  type: 'crowd-threshold' | 'friends-joined' | 'event-starting' | 'status-change' | 'last-call';
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  crowdLevel?: number;
  friendsCount?: number;
}

export const useWatchlistData = () => {
  // Mock data for watched events
  const [watchedEvents] = useState<WatchedEvent[]>([
    {
      id: 1,
      venue: "Sky Lounge",
      type: "Rooftop",
      vibe: "Upscale",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
      crowdLevel: 75,
      distance: "0.8 miles",
      timePosted: "2h ago",
      startTime: "9:00 PM",
      endTime: "2:00 AM",
      status: 'live',
      friendsCount: 3,
      friendsAvatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=40&h=40&fit=crop&crop=face"
      ],
      totalAttendees: 24,
      lastUpdate: "5 min ago"
    },
    {
      id: 2,
      venue: "Underground Club",
      type: "Nightclub",
      vibe: "EDM",
      image: "https://images.unsplash.com/photo-1571266028243-d220c94ac752?w=400&h=300&fit=crop",
      crowdLevel: 45,
      distance: "1.2 miles",
      timePosted: "4h ago",
      startTime: "10:00 PM",
      endTime: "3:00 AM",
      status: 'upcoming',
      friendsCount: 1,
      friendsAvatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      ],
      totalAttendees: 12,
      lastUpdate: "15 min ago"
    }
  ]);

  // Mock data for notifications
  const [notifications] = useState<WatchlistNotification[]>([
    {
      id: 1,
      eventId: 1,
      eventName: "Sky Lounge",
      type: 'friends-joined',
      message: "2 of your friends just joined Sky Lounge",
      timestamp: "5 min ago",
      isRead: false,
      actionRequired: true,
      friendsCount: 3
    },
    {
      id: 2,
      eventId: 1,
      eventName: "Sky Lounge",
      type: 'crowd-threshold',
      message: "Sky Lounge is now 75% full - perfect buzz level!",
      timestamp: "12 min ago",
      isRead: false,
      actionRequired: true,
      crowdLevel: 75
    },
    {
      id: 3,
      eventId: 2,
      eventName: "Underground Club",
      type: 'event-starting',
      message: "Underground Club starts in 30 minutes",
      timestamp: "1h ago",
      isRead: true,
      actionRequired: false
    }
  ]);

  const [currentView, setCurrentView] = useState<'events' | 'notifications'>('events');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  const markNotificationAsRead = (notificationId: number) => {
    // Implementation would update notification read status
    console.log('Mark notification as read:', notificationId);
  };

  const dismissNotification = (notificationId: number) => {
    // Implementation would remove/dismiss notification
    console.log('Dismiss notification:', notificationId);
  };

  const joinFromWatchlist = (eventId: number) => {
    // Implementation would join event from watchlist
    console.log('Join event from watchlist:', eventId);
  };

  const unwatchEvent = (eventId: number) => {
    // Implementation would remove event from watchlist
    console.log('Unwatch event:', eventId);
  };

  return {
    watchedEvents,
    notifications,
    currentView,
    setCurrentView,
    unreadCount,
    actionRequiredCount,
    markNotificationAsRead,
    dismissNotification,
    joinFromWatchlist,
    unwatchEvent
  };
};
