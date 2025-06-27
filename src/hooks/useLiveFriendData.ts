
import { useState, useEffect } from 'react';
import { friendsData } from '@/data/friendsData';

export const useLiveFriendData = () => {
  const [friends, setFriends] = useState(friendsData);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setFriends(prevFriends => 
        prevFriends.map(friend => ({
          ...friend,
          // Simulate small changes in crowd levels, timing, etc.
          lastSeen: friend.currentAction !== 'offline' ? 
            `${Math.floor(Math.random() * 45) + 1} min ago` : 
            friend.lastSeen
        }))
      );
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getFriendsAtVenue = (venueName: string) => {
    return friends.filter(friend => 
      friend.location && friend.location.toLowerCase().includes(venueName.toLowerCase())
    );
  };

  const updateFriendLocation = (friendId: number, location: string) => {
    setFriends(prevFriends =>
      prevFriends.map(friend =>
        friend.id === friendId
          ? { ...friend, location, lastSeen: 'Just now' }
          : friend
      )
    );
  };

  return {
    friends,
    lastUpdate,
    getFriendsAtVenue,
    updateFriendLocation
  };
};
