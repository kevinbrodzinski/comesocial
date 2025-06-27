
import { useState, useEffect } from 'react';
import { Friend } from '@/data/friendsData';
import { useWatchlistData } from './useWatchlistData';
import { useNotificationScheduler } from './useNotificationScheduler';

interface GroupWatchlistEvent {
  id: number;
  venue: string;
  eventName: string;
  date: string;
  time: string;
  friendsWatching: Friend[];
  totalWatchers: number;
  category: 'tonight' | 'weekend' | 'upcoming';
}

interface DailySummary {
  date: string;
  totalEvents: number;
  friendsInvolved: Friend[];
  topEvents: GroupWatchlistEvent[];
  summary: string;
}

export const useGroupWatchlist = (friends: Friend[]) => {
  const [groupEvents, setGroupEvents] = useState<GroupWatchlistEvent[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const { scheduleNotification } = useNotificationScheduler();

  // Mock group watchlist data
  const mockGroupEvents: GroupWatchlistEvent[] = [
    {
      id: 1,
      venue: 'Sky Lounge',
      eventName: 'Rooftop Fridays',
      date: 'Tonight',
      time: '9:00 PM',
      friendsWatching: friends.slice(0, 3),
      totalWatchers: 8,
      category: 'tonight'
    },
    {
      id: 2,
      venue: 'Underground Club',
      eventName: 'Saturday Sessions',
      date: 'Tomorrow',
      time: '10:00 PM',
      friendsWatching: friends.slice(1, 4),
      totalWatchers: 12,
      category: 'weekend'
    },
    {
      id: 3,
      venue: 'Pulse Nightclub',
      eventName: 'Sunday Funday',
      date: 'This Sunday',
      time: '7:00 PM',
      friendsWatching: friends.slice(2, 5),
      totalWatchers: 6,
      category: 'weekend'
    }
  ];

  const generateDailySummary = (): DailySummary => {
    const today = new Date().toLocaleDateString();
    const tonightEvents = groupEvents.filter(e => e.category === 'tonight');
    const weekendEvents = groupEvents.filter(e => e.category === 'weekend');
    
    const allWatchingFriends = Array.from(
      new Set(
        groupEvents.flatMap(e => e.friendsWatching.map(f => f.id))
      )
    ).map(id => friends.find(f => f.id === id)).filter(Boolean) as Friend[];

    let summary = '';
    if (tonightEvents.length > 0) {
      summary = `Your crew is watching ${tonightEvents.length} event${tonightEvents.length > 1 ? 's' : ''} tonight`;
    } else if (weekendEvents.length > 0) {
      summary = `${weekendEvents.length} weekend event${weekendEvents.length > 1 ? 's' : ''} on your friends' radar`;
    } else {
      summary = 'Your crew is keeping it low-key today';
    }

    return {
      date: today,
      totalEvents: groupEvents.length,
      friendsInvolved: allWatchingFriends,
      topEvents: groupEvents.slice(0, 3),
      summary
    };
  };

  const scheduleDailySummary = () => {
    const today = new Date();
    const summaryTime = new Date();
    summaryTime.setHours(18, 0, 0, 0); // 6:00 PM

    // If it's already past 6 PM, schedule for tomorrow
    if (today.getTime() > summaryTime.getTime()) {
      summaryTime.setDate(summaryTime.getDate() + 1);
    }

    const summary = generateDailySummary();
    
    scheduleNotification({
      id: `daily-watchlist-${summaryTime.getTime()}`,
      triggerTime: summaryTime,
      notification: {
        type: 'group-movement',
        title: '👥 Your Crew Tonight',
        message: summary.summary,
        urgency: 'low',
        actionLabel: 'See events',
        autoExpire: 15
      },
      recurring: true,
      interval: 24 * 60 * 60 * 1000 // Daily
    });
  };

  const addToGroupWatchlist = (venueId: number, venue: string, eventName: string, friendId: number) => {
    setGroupEvents(prev => {
      const existing = prev.find(e => e.venue === venue && e.eventName === eventName);
      const friend = friends.find(f => f.id === friendId);
      
      if (!friend) return prev;
      
      if (existing) {
        // Add friend to existing event if not already watching
        if (!existing.friendsWatching.some(f => f.id === friendId)) {
          return prev.map(e => 
            e.id === existing.id 
              ? {
                  ...e,
                  friendsWatching: [...e.friendsWatching, friend],
                  totalWatchers: e.totalWatchers + 1
                }
              : e
          );
        }
        return prev;
      } else {
        // Create new group event
        const newEvent: GroupWatchlistEvent = {
          id: Date.now(),
          venue,
          eventName,
          date: 'Tonight', // Simplified for demo
          time: '9:00 PM',
          friendsWatching: [friend],
          totalWatchers: 1,
          category: 'tonight'
        };
        return [...prev, newEvent];
      }
    });
  };

  const removeFromGroupWatchlist = (eventId: number, friendId: number) => {
    setGroupEvents(prev => 
      prev.map(event => {
        if (event.id === eventId) {
          const updatedFriends = event.friendsWatching.filter(f => f.id !== friendId);
          return {
            ...event,
            friendsWatching: updatedFriends,
            totalWatchers: Math.max(0, event.totalWatchers - 1)
          };
        }
        return event;
      }).filter(event => event.friendsWatching.length > 0) // Remove events with no watchers
    );
  };

  // Initialize with mock data and schedule daily summary
  useEffect(() => {
    setGroupEvents(mockGroupEvents);
    const summary = generateDailySummary();
    setDailySummary(summary);
    
    // Schedule daily summary notification
    scheduleDailySummary();
  }, []);

  // Update daily summary when events change
  useEffect(() => {
    if (groupEvents.length > 0) {
      const summary = generateDailySummary();
      setDailySummary(summary);
    }
  }, [groupEvents]);

  return {
    groupEvents,
    dailySummary,
    addToGroupWatchlist,
    removeFromGroupWatchlist,
    generateDailySummary
  };
};
