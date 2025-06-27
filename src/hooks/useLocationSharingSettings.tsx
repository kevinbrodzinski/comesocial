
import { useState, useEffect } from 'react';

export type LocationSharingLevel = 'always' | 'friends-only' | 'select-friends' | 'plan-only' | 'never';
export type LocationAccuracy = 'exact' | 'approximate' | 'city-level';
export type LocationTiming = 'always-open' | 'checked-in-only' | 'plan-only' | 'manual-only';

export interface FriendSharingOverride {
  friendId: number;
  setting: 'on' | 'off' | 'plan-only';
}

export interface LocationSharingSettings {
  sharingLevel: LocationSharingLevel;
  accuracy: LocationAccuracy;
  timing: LocationTiming;
  ghostModeEnabled: boolean;
  autoCheckIn: boolean;
  shareETA: boolean;
  allowFriendRequests: boolean;
  selectedFriends: number[];
  friendOverrides: FriendSharingOverride[];
  promptOnFirstCheckIn: boolean;
  promptOnPlanJoin: boolean;
  promptOnMapOpen: boolean;
}

export const useLocationSharingSettings = () => {
  const [settings, setSettings] = useState<LocationSharingSettings>({
    sharingLevel: 'friends-only',
    accuracy: 'approximate',
    timing: 'checked-in-only',
    ghostModeEnabled: false,
    autoCheckIn: true,
    shareETA: true,
    allowFriendRequests: true,
    selectedFriends: [],
    friendOverrides: [],
    promptOnFirstCheckIn: true,
    promptOnPlanJoin: true,
    promptOnMapOpen: true
  });

  const [temporaryShares, setTemporaryShares] = useState<{
    [friendId: number]: { expiresAt: Date; eventName?: string }
  }>({});

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('locationSharingSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Migrate old settings to new format
        if (parsed.sharingLevel === 'ask-each-time') {
          parsed.sharingLevel = 'manual-only';
          parsed.timing = 'manual-only';
        }
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.error('Failed to parse location settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<LocationSharingSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('locationSharingSettings', JSON.stringify(updatedSettings));
  };

  const enableGhostMode = (duration?: number) => {
    updateSettings({ ghostModeEnabled: true });
    
    if (duration) {
      setTimeout(() => {
        updateSettings({ ghostModeEnabled: false });
      }, duration * 60 * 1000); // Convert minutes to milliseconds
    }
  };

  const disableGhostMode = () => {
    updateSettings({ ghostModeEnabled: false });
  };

  const createTemporaryShare = (friendId: number, hours: number, eventName?: string) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    
    setTemporaryShares(prev => ({
      ...prev,
      [friendId]: { expiresAt, eventName }
    }));
  };

  const removeTemporaryShare = (friendId: number) => {
    setTemporaryShares(prev => {
      const updated = { ...prev };
      delete updated[friendId];
      return updated;
    });
  };

  const updateFriendOverride = (friendId: number, setting: 'on' | 'off' | 'plan-only') => {
    const updatedOverrides = settings.friendOverrides.filter(o => o.friendId !== friendId);
    if (setting !== 'on') { // 'on' is the default, so we don't need to store it
      updatedOverrides.push({ friendId, setting });
    }
    updateSettings({ friendOverrides: updatedOverrides });
  };

  const getFriendSharingSetting = (friendId: number): 'on' | 'off' | 'plan-only' => {
    const override = settings.friendOverrides.find(o => o.friendId === friendId);
    return override?.setting || 'on';
  };

  const canShareLocationWith = (friendId: number, isInPlan: boolean = false): boolean => {
    if (settings.ghostModeEnabled) return false;
    if (settings.sharingLevel === 'never') return false;
    
    // Check timing restrictions
    if (settings.timing === 'manual-only') return false;
    if (settings.timing === 'plan-only' && !isInPlan) return false;
    
    // Check friend-specific overrides
    const friendSetting = getFriendSharingSetting(friendId);
    if (friendSetting === 'off') return false;
    if (friendSetting === 'plan-only' && !isInPlan) return false;
    
    // Check temporary shares
    const tempShare = temporaryShares[friendId];
    if (tempShare && tempShare.expiresAt > new Date()) {
      return true;
    }
    
    // Check sharing level
    if (settings.sharingLevel === 'always') return true;
    if (settings.sharingLevel === 'plan-only') return isInPlan;
    if (settings.sharingLevel === 'select-friends') {
      return settings.selectedFriends.includes(friendId);
    }
    
    return settings.sharingLevel === 'friends-only';
  };

  const shouldPromptForSharing = (context: 'check-in' | 'plan-join' | 'map-open'): boolean => {
    if (context === 'check-in') return settings.promptOnFirstCheckIn;
    if (context === 'plan-join') return settings.promptOnPlanJoin;
    if (context === 'map-open') return settings.promptOnMapOpen;
    return false;
  };

  const setPromptShown = (context: 'check-in' | 'plan-join' | 'map-open') => {
    if (context === 'check-in') updateSettings({ promptOnFirstCheckIn: false });
    if (context === 'plan-join') updateSettings({ promptOnPlanJoin: false });
    if (context === 'map-open') updateSettings({ promptOnMapOpen: false });
  };

  return {
    settings,
    updateSettings,
    temporaryShares,
    enableGhostMode,
    disableGhostMode,
    createTemporaryShare,
    removeTemporaryShare,
    updateFriendOverride,
    getFriendSharingSetting,
    canShareLocationWith,
    shouldPromptForSharing,
    setPromptShown
  };
};
