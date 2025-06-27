
import { useState, useEffect } from 'react';
import { friendsData, generateFriendTabs, type Friend, type FriendTab } from '@/data/friendsData';

export const useFriendsData = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'denied' | 'granted' | 'pending' | null>(null);
  
  // Use centralized friends data
  const friends = friendsData;
  const tabs = generateFriendTabs(friends);

  return {
    friends,
    tabs,
    userLocation,
    setUserLocation,
    locationPermission,
    setLocationPermission
  };
};
