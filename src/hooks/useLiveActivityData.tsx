
import { useState } from 'react';

export interface LiveActivity {
  id: number;
  type: 'friend-arrived' | 'group-forming' | 'check-in' | 'group-move' | 'watchlist-alert' | 'milestone';
  friendName?: string;
  friendAvatar?: string;
  venue: string;
  timeAgo: string;
  action: string;
  message: string;
  groupSize?: number;
  crowdLevel?: number;
  isUrgent?: boolean;
}

export const useLiveActivityData = () => {
  const [currentView, setCurrentView] = useState<'discover' | 'blasts' | 'live'>('discover');

  const activities: LiveActivity[] = [
    {
      id: 1,
      type: 'friend-arrived',
      friendName: 'Alex',
      friendAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      venue: 'Sky Lounge',
      timeAgo: '2 min ago',
      action: 'Join them',
      message: 'just arrived at'
    },
    {
      id: 2,
      type: 'group-forming',
      friendName: 'Group',
      venue: 'Underground Club',
      timeAgo: '5 min ago',
      action: 'Join group',
      message: 'group forming at',
      groupSize: 4
    }
  ];

  return {
    activities,
    currentView,
    setCurrentView
  };
};
