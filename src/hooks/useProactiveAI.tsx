import { useState, useEffect, useCallback } from 'react';
import { predictiveEngine } from '../services/intelligence/PredictiveEngine';
import { proactiveNotifications } from '../services/intelligence/ProactiveNotifications';
import { trendAnalyzer } from '../services/intelligence/TrendAnalyzer';
import { contextManager } from '../services/intelligence/ContextManager';
import { eventTracker } from '../services/intelligence/EventTracker';
import { useRealTimeIntelligence } from './useRealTimeIntelligence';

interface ProactiveState {
  predictions: any[];
  notifications: any[];
  trends: any;
  suggestions: any[];
  isActive: boolean;
  confidence: number;
}

interface ProactiveSuggestion {
  id: string;
  type: 'venue' | 'timing' | 'social' | 'trend';
  title: string;
  message: string;
  confidence: number;
  actionLabel?: string;
  onAction?: () => void;
  metadata: Record<string, any>;
}

export const useProactiveAI = () => {
  const [state, setState] = useState<ProactiveState>({
    predictions: [],
    notifications: [],
    trends: null,
    suggestions: [],
    isActive: true,
    confidence: 0
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateInterval] = useState(5 * 60 * 1000); // 5 minutes

  // Integration with real-time services
  const { 
    liveVenues, 
    activeEvents, 
    friendActivities,
    proximityAlerts,
    getLiveVenueData,
    getEnhancedVenueData 
  } = useRealTimeIntelligence();

  // Enhanced updateProactiveIntelligence with real-time data
  const updateProactiveIntelligence = useCallback(() => {
    if (!state.isActive) return;

    console.log('🧠 Updating proactive intelligence with real-time data...');

    try {
      // Get predictions with real-time context
      const contextWithRealTime = {
        liveVenues,
        activeEvents,
        friendActivities,
        proximityAlerts
      };
      
      // Use the correct method name
      const predictions = predictiveEngine.generatePredictions(contextWithRealTime);
      
      // Check for proactive notifications with real-time data
      const notifications = proactiveNotifications.checkForNotifications();
      
      // Analyze current trends with live data
      const trends = trendAnalyzer.analyzeTrends();
      
      // Generate contextual suggestions with real-time intelligence
      const suggestions = generateContextualSuggestions(predictions, trends, contextWithRealTime);
      
      // Calculate overall confidence with real-time data quality
      const confidence = calculateOverallConfidence(predictions, trends, contextWithRealTime);

      setState(prev => ({
        ...prev,
        predictions,
        notifications,
        trends,
        suggestions,
        confidence
      }));

      setLastUpdate(new Date());
      
      console.log('🎯 Proactive intelligence updated with real-time data:', {
        predictions: predictions.length,
        notifications: notifications.length,
        suggestions: suggestions.length,
        liveVenues: liveVenues.length,
        activeEvents: activeEvents.length,
        confidence: Math.round(confidence * 100) + '%'
      });

    } catch (error) {
      console.error('Failed to update proactive intelligence:', error);
    }
  }, [state.isActive, liveVenues, activeEvents, friendActivities, proximityAlerts]);

  // Enhanced suggestion generation with real-time data
  const generateContextualSuggestions = (predictions: any[], trends: any, realTimeContext: any): ProactiveSuggestion[] => {
    const suggestions: ProactiveSuggestion[] = [];

    // Venue suggestions from predictions
    predictions
      .filter(p => p.type === 'venue_recommendation' && p.confidence > 0.6)
      .forEach(prediction => {
        suggestions.push({
          id: `venue_${prediction.id}`,
          type: 'venue',
          title: 'Perfect Venue Match',
          message: prediction.prediction,
          confidence: prediction.confidence,
          actionLabel: 'Explore',
          onAction: () => handleVenueSuggestionAction(prediction),
          metadata: prediction.metadata
        });
      });

    // Timing suggestions
    predictions
      .filter(p => p.type === 'timing_suggestion' && p.confidence > 0.7)
      .forEach(prediction => {
        suggestions.push({
          id: `timing_${prediction.id}`,
          type: 'timing',
          title: 'Optimal Timing',
          message: prediction.prediction,
          confidence: prediction.confidence,
          actionLabel: 'Plan now',
          onAction: () => handleTimingSuggestionAction(prediction),
          metadata: prediction.metadata
        });
      });

    // Social suggestions
    predictions
      .filter(p => p.type === 'social_opportunity' && p.confidence > 0.5)
      .forEach(prediction => {
        suggestions.push({
          id: `social_${prediction.id}`,
          type: 'social',
          title: 'Social Opportunity',
          message: prediction.prediction,
          confidence: prediction.confidence,
          actionLabel: 'Connect',
          onAction: () => handleSocialSuggestionAction(prediction),
          metadata: prediction.metadata
        });
      });

    // Trend-based suggestions
    if (trends?.emergingTrends) {
      trends.emergingTrends
        .filter((trend: any) => trend.confidence > 0.6)
        .slice(0, 2) // Limit trend suggestions
        .forEach((trend: any) => {
          suggestions.push({
            id: `trend_${trend.id}`,
            type: 'trend',
            title: 'Trending Now',
            message: `${trend.data.pattern} is trending - jump on it!`,
            confidence: trend.confidence,
            actionLabel: 'Check it out',
            onAction: () => handleTrendSuggestionAction(trend),
            metadata: trend.data
          });
        });
    }

    // Real-time venue suggestions based on live data
    realTimeContext.liveVenues?.forEach((venue: any) => {
      if (venue.crowdLevel > 60 && venue.crowdLevel < 85 && venue.availability.hasSpace) {
        suggestions.push({
          id: `live_venue_${venue.venueId}`,
          type: 'venue',
          title: 'Perfect Timing!',
          message: `${venue.venueId} is buzzing but still has space (${venue.crowdLevel}% full)`,
          confidence: 0.8,
          actionLabel: 'Check it out',
          onAction: () => handleLiveVenueSuggestionAction(venue),
          metadata: { venueId: venue.venueId, crowdLevel: venue.crowdLevel, liveData: true }
        });
      }
    });

    // Active event suggestions
    realTimeContext.activeEvents?.forEach((event: any) => {
      if (event.isActive && event.popularity > 0.7) {
        suggestions.push({
          id: `live_event_${event.eventId}`,
          type: 'trend',
          title: 'Live Event Happening Now',
          message: `${event.description} - ${event.attendance} people there!`,
          confidence: event.popularity,
          actionLabel: 'Join now',
          onAction: () => handleLiveEventSuggestionAction(event),
          metadata: { eventId: event.eventId, venueId: event.venueId, liveEvent: true }
        });
      }
    });

    // Proximity-based suggestions
    realTimeContext.proximityAlerts?.forEach((alert: any) => {
      if (alert.isUrgent) {
        suggestions.push({
          id: `proximity_${alert.friendId}`,
          type: 'social',
          title: 'Friend Nearby!',
          message: `${alert.friendName} is only ${Math.round(alert.distance)}m away`,
          confidence: 0.9,
          actionLabel: 'Say hi',
          onAction: () => handleProximitySuggestionAction(alert),
          metadata: { friendId: alert.friendId, distance: alert.distance, urgent: true }
        });
      }
    });

    return suggestions.slice(0, 8); // Increased limit for real-time suggestions
  };

  // Enhanced confidence calculation with real-time data
  const calculateOverallConfidence = (predictions: any[], trends: any, realTimeContext: any): number => {
    if (predictions.length === 0) return 0.2;

    const avgPredictionConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    const dataQuality = Math.min(eventTracker.getEventsInTimeWindow(24).length / 20, 1.0);
    const trendConfidence = trends?.venueTrends?.length > 0 ? 0.8 : 0.4;
    
    // Real-time data quality bonus
    const realTimeBonus = Math.min(
      (realTimeContext.liveVenues?.length || 0) / 10 + 
      (realTimeContext.activeEvents?.length || 0) / 5 +
      (realTimeContext.friendActivities?.length || 0) / 10,
      0.3
    );

    return (avgPredictionConfidence * 0.4 + dataQuality * 0.2 + trendConfidence * 0.2 + realTimeBonus * 0.2);
  };

  // Track user interaction with suggestions
  const trackSuggestionInteraction = (suggestionId: string, action: 'accepted' | 'dismissed' | 'viewed') => {
    eventTracker.trackEvent('suggestion_feedback', {
      suggestionId,
      action,
      timestamp: new Date()
    });

    // Update prediction accuracy with correct method name
    if (action === 'accepted') {
      const suggestion = state.suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        predictiveEngine.updatePredictionAccuracy(suggestionId, true);
      }
    }
  };

  // Handle venue suggestion actions
  const handleVenueSuggestionAction = (prediction: any) => {
    console.log('🎯 Venue suggestion accepted:', prediction.metadata.venueType);
    trackSuggestionInteraction(prediction.id, 'accepted');
    
    // Track that user is looking for this venue type
    eventTracker.trackVenueInteraction(0, 'search', {
      venueType: prediction.metadata.venueType,
      source: 'ai_suggestion'
    });
  };

  // Handle timing suggestion actions
  const handleTimingSuggestionAction = (prediction: any) => {
    console.log('⏰ Timing suggestion accepted:', prediction.metadata);
    trackSuggestionInteraction(prediction.id, 'accepted');
    
    eventTracker.trackTimingPreference(
      new Date().toISOString(),
      'general',
      'ai_suggested'
    );
  };

  // Handle social suggestion actions
  const handleSocialSuggestionAction = (prediction: any) => {
    console.log('👥 Social suggestion accepted:', prediction.metadata);
    trackSuggestionInteraction(prediction.id, 'accepted');
    
    eventTracker.trackFriendResponse('ai_suggestion', 'explore', {
      context: 'proactive_suggestion'
    });
  };

  // Handle trend suggestion actions
  const handleTrendSuggestionAction = (trend: any) => {
    console.log('📈 Trend suggestion accepted:', trend.data.pattern);
    trackSuggestionInteraction(trend.id, 'accepted');
    
    eventTracker.trackEvent('chat_interaction', {
      pattern: trend.data.pattern,
      strength: trend.strength,
      action: 'trend_follow'
    });
  };

  // New action handlers for real-time suggestions
  const handleLiveVenueSuggestionAction = (venue: any) => {
    console.log('🏢 Live venue suggestion accepted:', venue);
    trackSuggestionInteraction(`live_venue_${venue.venueId}`, 'accepted');
    
    eventTracker.trackVenueInteraction(venue.venueId, 'live_suggestion_accept', {
      crowdLevel: venue.crowdLevel,
      liveData: true,
      source: 'real_time_ai'
    });
  };

  const handleLiveEventSuggestionAction = (event: any) => {
    console.log('🎉 Live event suggestion accepted:', event);
    trackSuggestionInteraction(`live_event_${event.eventId}`, 'accepted');
    
    eventTracker.trackEvent('venue_interaction', {
      venueId: event.venueId,
      action: 'live_event_accept',
      eventId: event.eventId,
      eventType: event.eventType,
      source: 'real_time_ai'
    });
  };

  const handleProximitySuggestionAction = (alert: any) => {
    console.log('📍 Proximity suggestion accepted:', alert);
    trackSuggestionInteraction(`proximity_${alert.friendId}`, 'accepted');
    
    eventTracker.trackFriendResponse(alert.friendId, 'proximity_connect', {
      distance: alert.distance,
      venue: alert.venue?.name,
      source: 'real_time_ai'
    });
  };

  // Get suggestions by type
  const getSuggestionsByType = (type: ProactiveSuggestion['type']): ProactiveSuggestion[] => {
    return state.suggestions.filter(s => s.type === type);
  };

  // Get high-priority notifications
  const getHighPriorityNotifications = () => {
    return state.notifications.filter(n => n.priority === 'high' || n.priority === 'urgent');
  };

  // Get trending venues
  const getTrendingVenues = () => {
    return state.trends?.venueTrends?.slice(0, 3) || [];
  };

  // Get social opportunities
  const getSocialOpportunities = () => {
    return state.predictions.filter(p => p.type === 'social_opportunity');
  };

  // Toggle proactive AI
  const toggleProactiveAI = (active: boolean) => {
    setState(prev => ({ ...prev, isActive: active }));
    proactiveNotifications.setActive(active);
  };

  // Force refresh of intelligence
  const refreshIntelligence = () => {
    updateProactiveIntelligence();
  };

  // Context-aware suggestion generation
  const generateContextualSuggestion = (userQuery: string, intent: string): string | null => {
    const localContext = contextManager.getLocalContext();
    
    // Check if we can answer locally before calling LLM
    if (contextManager.shouldUseLLM(intent, state.confidence)) {
      return null; // Use LLM
    }
    
    return contextManager.generateLocalResponse(intent, userQuery);
  };

  // Build micro-prompt for LLM calls
  const buildMicroPrompt = (intent: string, userMessage: string): string => {
    return contextManager.buildMicroPrompt(intent, userMessage);
  };

  // Get enhanced venue data for suggestions
  const getEnhancedSuggestionData = async (venueId: number) => {
    try {
      const enhancedData = await getEnhancedVenueData(venueId);
      return enhancedData;
    } catch (error) {
      console.error('Failed to get enhanced suggestion data:', error);
      return null;
    }
  };

  // Auto-update intelligence periodically
  useEffect(() => {
    if (!state.isActive) return;

    // Initial update
    updateProactiveIntelligence();

    // Set up periodic updates
    const interval = setInterval(updateProactiveIntelligence, updateInterval);

    return () => clearInterval(interval);
  }, [state.isActive, updateProactiveIntelligence, updateInterval]);

  return {
    // State
    predictions: state.predictions,
    notifications: state.notifications,
    trends: state.trends,
    suggestions: state.suggestions,
    isActive: state.isActive,
    confidence: state.confidence,
    lastUpdate,
    
    // Enhanced real-time data
    liveVenues,
    activeEvents,
    friendActivities,
    proximityAlerts,

    // Actions
    trackSuggestionInteraction,
    toggleProactiveAI,
    refreshIntelligence,
    generateContextualSuggestion,
    buildMicroPrompt,
    
    // Enhanced actions
    getEnhancedSuggestionData,

    // Getters
    getSuggestionsByType,
    getHighPriorityNotifications,
    getTrendingVenues,
    getSocialOpportunities,

    // Stats
    stats: {
      totalPredictions: state.predictions.length,
      highConfidencePredictions: state.predictions.filter(p => p.confidence > 0.7).length,
      activeNotifications: state.notifications.filter(n => !n.shown).length,
      systemConfidence: state.confidence,
      liveDataPoints: (liveVenues?.length || 0) + (activeEvents?.length || 0),
      realTimeAlerts: proximityAlerts?.length || 0
    }
  };
};
