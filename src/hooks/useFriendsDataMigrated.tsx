import { useState, useEffect } from 'react';
import { useFriends } from '@/hooks/useDataService';
import { generateFriendTabs, type Friend, type FriendTab } from '@/data/friendsData';

export const useFriendsDataMigrated = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'denied' | 'granted' | 'pending' | null>(null);
  
  // Use React Query hook instead of direct mock data
  const { 
    data: friends = [], 
    isLoading, 
    error, 
    refetch 
  } = useFriends();
  
  // Generate tabs from the fetched friends data
  const tabs = generateFriendTabs(friends);

  return {
    friends,
    tabs,
    userLocation,
    setUserLocation,
    locationPermission,
    setLocationPermission,
    // New properties for migration
    isLoading,
    error,
    refetch
  };
}; 