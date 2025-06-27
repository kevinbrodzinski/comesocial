
import { useState, useEffect, useCallback } from 'react';
import { liveDataAggregator } from '../services/realtime/LiveDataAggregator';
import { eventStreamManager } from '../services/realtime/EventStreamManager';
import { socialIntelligence } from '../services/realtime/SocialIntelligence';
import { multiProviderAPI } from '../services/apis/MultiProviderAPI';
import { eventTracker } from '../services/intelligence/EventTracker';

export const useRealTimeIntelligence = () => {
  const [isActive, setIsActive] = useState(false);
  const [liveVenues, setLiveVenues] = useState<any[]>([]);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [friendActivities, setFriendActivities] = useState<any[]>([]);
  const [proximityAlerts, setProximityAlerts] = useState<any[]>([]);
  const [socialTrends, setSocialTrends] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize real-time services
  const initializeServices = useCallback(() => {
    if (isActive) return;

    console.log('🚀 Initializing Real-Time Intelligence');
    
    // Start live data aggregation
    liveDataAggregator.start();
    
    // Start social intelligence
    socialIntelligence.start();
    
    // Subscribe to event streams
    const subscriptionId = eventStreamManager.subscribe(
      ['venue_update', 'friend_activity', 'social_intelligence'],
      handleEventStreamUpdate,
      undefined,
      2 // High priority
    );

    setIsActive(true);
    
    return () => {
      liveDataAggregator.stop();
      socialIntelligence.stop();
      eventStreamManager.unsubscribe(subscriptionId);
      setIsActive(false);
    };
  }, [isActive]);

  // Handle event stream updates
  const handleEventStreamUpdate = useCallback((event: any) => {
    console.log('📡 Real-time event received:', event.type);
    
    switch (event.type) {
      case 'venue_update':
        updateVenueData();
        break;
      case 'friend_activity':
        updateFriendActivities();
        break;
      case 'social_intelligence':
        updateSocialIntelligence();
        break;
    }
    
    setLastUpdate(new Date());
  }, []);

  // Update venue data
  const updateVenueData = useCallback(() => {
    const venues = liveDataAggregator.getAllVenueData();
    const events = liveDataAggregator.getActiveEvents();
    
    setLiveVenues(venues);
    setActiveEvents(events);
    
    // Track venue data updates
    eventTracker.trackEvent('notification_generated', {
      type: 'venue_data_update',
      venueCount: venues.length,
      eventCount: events.length
    }, 'system_generated');
  }, []);

  // Update friend activities
  const updateFriendActivities = useCallback(() => {
    const activities = socialIntelligence.getFriendActivities(undefined, 20);
    const alerts = socialIntelligence.getProximityAlerts(true);
    
    setFriendActivities(activities);
    setProximityAlerts(alerts);
  }, []);

  // Update social intelligence
  const updateSocialIntelligence = useCallback(() => {
    const trends = socialIntelligence.getSocialTrends();
    setSocialTrends(trends);
  }, []);

  // Get live venue data
  const getLiveVenueData = useCallback((venueId: number) => {
    return liveDataAggregator.getVenueData(venueId);
  }, []);

  // Get venue events
  const getVenueEvents = useCallback((venueId: number) => {
    return liveDataAggregator.getVenueEvents(venueId);
  }, []);

  // Get friends at venue
  const getFriendsAtVenue = useCallback((venueId: number) => {
    return socialIntelligence.getFriendsAtVenue(venueId);
  }, []);

  // Track friend activity
  const trackFriendActivity = useCallback((activity: any) => {
    socialIntelligence.trackFriendActivity(activity);
  }, []);

  // Get venue insights from multiple providers
  const getVenueInsights = useCallback(async (venueIds: number[]) => {
    try {
      const response = await multiProviderAPI.getVenueInsights(venueIds);
      
      if (response.success) {
        eventTracker.trackEvent('venue_interaction', {
          venueIds,
          action: 'insights_fetched',
          source: 'multi_provider_api',
          insights: Object.keys(response.data?.venues || {}).length
        }, 'system_generated');
        
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get venue insights:', error);
      return null;
    }
  }, []);

  // Get enhanced venue data
  const getEnhancedVenueData = useCallback(async (venueId: number) => {
    try {
      const [liveData, apiData, events, friends] = await Promise.all([
        liveDataAggregator.getVenueData(venueId),
        multiProviderAPI.getVenueData(venueId),
        liveDataAggregator.getVenueEvents(venueId),
        socialIntelligence.getFriendsAtVenue(venueId)
      ]);

      return {
        liveData,
        apiData: apiData.success ? apiData.data : null,
        events,
        friends,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to get enhanced venue data:', error);
      return null;
    }
  }, []);

  // Force refresh all data
  const refreshAllData = useCallback(() => {
    updateVenueData();
    updateFriendActivities();
    updateSocialIntelligence();
    setLastUpdate(new Date());
  }, [updateVenueData, updateFriendActivities, updateSocialIntelligence]);

  // Initialize on mount
  useEffect(() => {
    const cleanup = initializeServices();
    
    // Update data immediately
    setTimeout(() => {
      updateVenueData();
      updateFriendActivities();
      updateSocialIntelligence();
    }, 1000);

    return cleanup;
  }, [initializeServices, updateVenueData, updateFriendActivities, updateSocialIntelligence]);

  // Get system statistics
  const getSystemStats = useCallback(() => {
    return {
      liveData: liveDataAggregator.getStatistics(),
      socialIntelligence: socialIntelligence.getStatistics(),
      eventStream: eventStreamManager.getQueueStats(),
      apiProviders: multiProviderAPI.getProviderStats(),
      lastUpdate,
      isActive
    };
  }, [lastUpdate, isActive]);

  return {
    // State
    isActive,
    liveVenues,
    activeEvents,
    friendActivities,
    proximityAlerts,
    socialTrends,
    lastUpdate,

    // Actions
    initializeServices,
    refreshAllData,
    trackFriendActivity,

    // Data getters
    getLiveVenueData,
    getVenueEvents,
    getFriendsAtVenue,
    getVenueInsights,
    getEnhancedVenueData,

    // System
    getSystemStats,

    // Stats
    stats: {
      liveVenues: liveVenues.length,
      activeEvents: activeEvents.length,
      friendActivities: friendActivities.length,
      proximityAlerts: proximityAlerts.length,
      socialTrends: socialTrends.length,
      systemHealth: isActive ? 'active' : 'inactive'
    }
  };
};
