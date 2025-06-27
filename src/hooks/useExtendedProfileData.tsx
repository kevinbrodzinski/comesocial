
import { useState, useEffect } from 'react';
import { useProfileData } from './useProfileData';

export interface ExtendedProfileData {
  // Basic Info
  name: string;
  username: string;
  bio: string;
  profilePhoto: string;
  coverPhoto?: string;
  
  // Location & Status
  currentCity: string;
  currentLocation?: string;
  locationStatus: 'online' | 'at-venue' | 'offline';
  
  // Interests & Preferences
  favoriteVenueTypes: string[];
  activities: string[];
  musicGenres: string[];
  lookingFor: string[];
  
  // Privacy Settings
  locationSharing: 'public' | 'friends' | 'off';
  profileVisibility: 'public' | 'friends' | 'private';
  messagingPermissions: 'anyone' | 'friends' | 'friends-of-friends';
  showActivityStatus: boolean;
  
  // Social Context
  relationshipStatus: string;
  interests: string[];
  reasonForApp: string;
}

export const useExtendedProfileData = () => {
  const { profileData } = useProfileData();
  
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfileData>({
    // Basic Info
    name: profileData.name,
    username: profileData.handle,
    bio: "Love exploring the city's nightlife and meeting new people! Always up for trying new spots.",
    profilePhoto: profileData.avatar,
    coverPhoto: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=300&fit=crop',
    
    // Location & Status
    currentCity: 'New York, NY',
    currentLocation: 'Sky Bar',
    locationStatus: 'at-venue',
    
    // Interests & Preferences
    favoriteVenueTypes: ['Rooftop Bars', 'Dance Clubs', 'Live Music'],
    activities: ['Dancing', 'Live Music', 'Cocktail Tasting', 'Meeting New People'],
    musicGenres: ['Electronic', 'Hip Hop', 'Pop', 'House'],
    lookingFor: ['New Friends', 'Activity Partners', 'Nightlife Crew'],
    
    // Privacy Settings
    locationSharing: 'friends',
    profileVisibility: 'public',
    messagingPermissions: 'friends',
    showActivityStatus: true,
    
    // Social Context
    relationshipStatus: 'Single',
    interests: ['Photography', 'Travel', 'Food', 'Fitness'],
    reasonForApp: 'Discover new venues and meet like-minded people'
  });

  const updateProfile = (updates: Partial<ExtendedProfileData>) => {
    setExtendedProfile(prev => ({ ...prev, ...updates }));
  };

  return {
    extendedProfile,
    updateProfile
  };
};
