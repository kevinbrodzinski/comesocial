
import { useState, useEffect } from 'react';
import { friendsData, Friend } from '@/data/friendsData';

export interface CheckInActivity {
  id: string;
  type: 'check-in' | 'departure' | 'group-summary';
  friendId?: number;
  friendName?: string;
  friendAvatar?: string;
  venue: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export const useCheckInActivity = () => {
  const [activities, setActivities] = useState<CheckInActivity[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Generate initial activities
  useEffect(() => {
    const initialActivities: CheckInActivity[] = [
      {
        id: '1',
        type: 'check-in',
        friendId: 1,
        friendName: 'Alex Martinez',
        friendAvatar: 'AM',
        venue: 'The Rooftop',
        message: 'Alex just checked in at The Rooftop',
        timestamp: new Date(Date.now() - 2 * 60000), // 2 min ago
        isRead: false
      },
      {
        id: '2',
        type: 'group-summary',
        venue: 'The Rooftop',
        message: '3 friends are at The Rooftop',
        timestamp: new Date(Date.now() - 5 * 60000), // 5 min ago
        isRead: false
      },
      {
        id: '3',
        type: 'departure',
        friendId: 7,
        friendName: 'Chris Park',
        friendAvatar: 'CP',
        venue: 'Underground',
        message: 'Chris left Underground 20 min ago',
        timestamp: new Date(Date.now() - 25 * 60000), // 25 min ago
        isRead: false
      },
      {
        id: '4',
        type: 'check-in',
        friendId: 3,
        friendName: 'Mike Johnson',
        friendAvatar: 'MJ',
        venue: 'Sky Bar',
        message: 'Mike checked in at Sky Bar',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 min ago
        isRead: false
      }
    ];

    setActivities(initialActivities);
    setHasUnread(true);
  }, []);

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance to generate new activity every 30 seconds
      if (Math.random() < 0.2) {
        const activeFriends = friendsData.filter(f => f.status === 'active');
        const randomFriend = activeFriends[Math.floor(Math.random() * activeFriends.length)];
        
        if (randomFriend && randomFriend.location) {
          const newActivity: CheckInActivity = {
            id: Date.now().toString(),
            type: 'check-in',
            friendId: randomFriend.id,
            friendName: randomFriend.name,
            friendAvatar: randomFriend.avatar,
            venue: randomFriend.location,
            message: `${randomFriend.name} just checked in at ${randomFriend.location}`,
            timestamp: new Date(),
            isRead: false
          };

          setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
          setHasUnread(true);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setActivities(prev => prev.map(activity => ({ ...activity, isRead: true })));
    setHasUnread(false);
  };

  const getUnreadCount = () => {
    return activities.filter(activity => !activity.isRead).length;
  };

  const getRecentActivities = () => {
    return activities.slice(0, 8); // Show 8 most recent
  };

  return {
    activities: getRecentActivities(),
    hasUnread,
    unreadCount: getUnreadCount(),
    markAllAsRead
  };
};
