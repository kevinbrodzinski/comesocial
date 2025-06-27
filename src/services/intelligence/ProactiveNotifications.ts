import { predictiveEngine } from './PredictiveEngine';
import { contextManager } from './ContextManager';
import { eventTracker } from './EventTracker';

interface ProactiveNotification {
  id: string;
  type: 'friend_proximity' | 'optimal_timing' | 'venue_suggestion' | 'social_opportunity' | 'weather_alternative';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionLabel?: string;
  action?: () => void;
  contextData: Record<string, any>;
  triggerConditions: {
    timeRelevant: boolean;
    locationRelevant: boolean;
    socialRelevant: boolean;
  };
  expiresAt: Date;
  shown: boolean;
}

interface NotificationTrigger {
  id: string;
  type: string;
  condition: (context: any) => boolean;
  cooldownMinutes: number;
  lastTriggered?: Date;
}

export class ProactiveNotifications {
  private notifications: Map<string, ProactiveNotification> = new Map();
  private triggers: NotificationTrigger[] = [];
  private isActive: boolean = true;
  private userPreferences = {
    maxNotificationsPerHour: 3,
    quietHours: { start: 23, end: 7 },
    enabledTypes: ['friend_proximity', 'optimal_timing', 'venue_suggestion', 'social_opportunity']
  };

  constructor() {
    this.initializeTriggers();
    this.startMonitoring();
  }

  // Check for notification opportunities
  checkForNotifications(context: any = null): ProactiveNotification[] {
    if (!this.isActive || this.isQuietHours()) {
      return [];
    }

    const localContext = context || contextManager.getLocalContext();
    const newNotifications: ProactiveNotification[] = [];

    // Check each trigger
    this.triggers.forEach(trigger => {
      if (this.shouldTrigger(trigger) && trigger.condition(localContext)) {
        const notification = this.createNotificationFromTrigger(trigger, localContext);
        if (notification) {
          newNotifications.push(notification);
          this.notifications.set(notification.id, notification);
          trigger.lastTriggered = new Date();
          
          // Track notification generation using correct event type
          eventTracker.trackEvent('notification_action', {
            type: notification.type,
            priority: notification.priority,
            trigger: trigger.id,
            action: 'generated'
          }, 'system_generated');
        }
      }
    });

    this.cleanupOldNotifications();
    
    if (newNotifications.length > 0) {
      console.log('📢 Generated proactive notifications:', newNotifications.length);
    }

    return newNotifications;
  }

  // Create friend proximity notification
  createFriendProximityNotification(friendName: string, venue: string, distance: string): ProactiveNotification {
    return {
      id: `friend_proximity_${Date.now()}`,
      type: 'friend_proximity',
      priority: 'high',
      title: '👋 Friend Nearby!',
      message: `${friendName} is ${distance} away at ${venue}`,
      actionLabel: 'Say Hi',
      contextData: { friendName, venue, distance },
      triggerConditions: {
        timeRelevant: true,
        locationRelevant: true,
        socialRelevant: true
      },
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      shown: false
    };
  }

  // Create optimal timing notification
  createOptimalTimingNotification(venue: string, reason: string, confidence: number): ProactiveNotification {
    const priority = confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low';
    
    return {
      id: `timing_${Date.now()}`,
      type: 'optimal_timing',
      priority,
      title: '⏰ Perfect Timing!',
      message: `Great time to visit ${venue} - ${reason}`,
      actionLabel: 'Check it out',
      contextData: { venue, reason, confidence },
      triggerConditions: {
        timeRelevant: true,
        locationRelevant: true,
        socialRelevant: false
      },
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      shown: false
    };
  }

  // Create venue suggestion notification
  createVenueSuggestionNotification(venueType: string, reason: string): ProactiveNotification {
    return {
      id: `venue_suggestion_${Date.now()}`,
      type: 'venue_suggestion',
      priority: 'medium',
      title: '🎯 Suggestion for You',
      message: `${venueType} might be perfect right now - ${reason}`,
      actionLabel: 'Explore',
      contextData: { venueType, reason },
      triggerConditions: {
        timeRelevant: true,
        locationRelevant: true,
        socialRelevant: false
      },
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      shown: false
    };
  }

  // Create social opportunity notification
  createSocialOpportunityNotification(opportunity: string, context: any): ProactiveNotification {
    return {
      id: `social_${Date.now()}`,
      type: 'social_opportunity',
      priority: 'medium',
      title: '🎉 Social Opportunity',
      message: opportunity,
      actionLabel: 'Join in',
      contextData: context,
      triggerConditions: {
        timeRelevant: true,
        locationRelevant: false,
        socialRelevant: true
      },
      expiresAt: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
      shown: false
    };
  }

  // Create weather alternative notification
  createWeatherAlternativeNotification(weather: string, alternatives: string[]): ProactiveNotification {
    return {
      id: `weather_${Date.now()}`,
      type: 'weather_alternative',
      priority: 'low',
      title: '🌧️ Weather Update',
      message: `${weather} - Here are some indoor alternatives`,
      actionLabel: 'See options',
      contextData: { weather, alternatives },
      triggerConditions: {
        timeRelevant: false,
        locationRelevant: true,
        socialRelevant: false
      },
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
      shown: false
    };
  }

  // Get pending notifications
  getPendingNotifications(): ProactiveNotification[] {
    return Array.from(this.notifications.values())
      .filter(notif => !notif.shown && notif.expiresAt > new Date())
      .sort((a, b) => this.getPriorityScore(b.priority) - this.getPriorityScore(a.priority));
  }

  // Mark notification as shown
  markNotificationShown(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.shown = true;
      eventTracker.trackEvent('notification_action', {
        type: notification.type,
        priority: notification.priority,
        action: 'shown'
      }, 'system_generated');
    }
  }

  // Handle notification action
  handleNotificationAction(notificationId: string, action: 'accepted' | 'dismissed'): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      eventTracker.trackEvent('notification_action', {
        type: notification.type,
        action,
        priority: notification.priority
      });
      
      if (notification.action && action === 'accepted') {
        notification.action();
      }
      
      // Remove notification after action
      this.notifications.delete(notificationId);
    }
  }

  // Initialize notification triggers
  private initializeTriggers(): void {
    this.triggers = [
      {
        id: 'friend_proximity_check',
        type: 'friend_proximity',
        condition: (context) => context.currentSituation.socialContext.friendsNearby > 0,
        cooldownMinutes: 60
      },
      {
        id: 'venue_timing_optimal',
        type: 'optimal_timing',
        condition: (context) => {
          // Use the correct method name
          const predictions = predictiveEngine.getPredictionsByType('timing_suggestion');
          return predictions.some(p => p.confidence > 0.7);
        },
        cooldownMinutes: 90
      },
      {
        id: 'venue_preference_match',
        type: 'venue_suggestion',
        condition: (context) => {
          // Use the correct method name
          const predictions = predictiveEngine.getPredictionsByType('venue_recommendation');
          return predictions.some(p => p.confidence > 0.6);
        },
        cooldownMinutes: 120
      },
      {
        id: 'social_activity_spike',
        type: 'social_opportunity',
        condition: (context) => {
          const recentFriendActivity = context.recentActivity.friendInteractions.length;
          return recentFriendActivity >= 2; // 2+ friend interactions recently
        },
        cooldownMinutes: 45
      }
    ];
  }

  // Check if trigger should fire
  private shouldTrigger(trigger: NotificationTrigger): boolean {
    if (!this.userPreferences.enabledTypes.includes(trigger.type)) {
      return false;
    }
    
    if (trigger.lastTriggered) {
      const cooldownMs = trigger.cooldownMinutes * 60 * 1000;
      const timeSinceLastTrigger = Date.now() - trigger.lastTriggered.getTime();
      if (timeSinceLastTrigger < cooldownMs) {
        return false;
      }
    }
    
    return true;
  }

  // Create notification from trigger
  private createNotificationFromTrigger(trigger: NotificationTrigger, context: any): ProactiveNotification | null {
    switch (trigger.type) {
      case 'friend_proximity': {
        // Mock friend proximity - would use real friend data
        return this.createFriendProximityNotification('Alex', 'Sky Lounge', '0.2 miles');
      }
      case 'optimal_timing': {
        // Use the correct method name
        const timingPredictions = predictiveEngine.getPredictionsByType('timing_suggestion');
        if (timingPredictions.length > 0) {
          const prediction = timingPredictions[0];
          return this.createOptimalTimingNotification(
            'nearby venues',
            'based on your patterns',
            prediction.confidence
          );
        }
        break;
      }
      case 'venue_suggestion': {
        // Use the correct method name
        const venuePredictions = predictiveEngine.getPredictionsByType('venue_recommendation');
        if (venuePredictions.length > 0) {
          const prediction = venuePredictions[0];
          return this.createVenueSuggestionNotification(
            (prediction as any).metadata?.venueType || 'venue',
            'matches your usual preferences'
          );
        }
        break;
      }
      case 'social_opportunity': {
        return this.createSocialOpportunityNotification(
          'Multiple friends are active - great time to plan something!',
          { friendActivity: context.recentActivity.friendInteractions.length }
        );
      }
    }
    
    return null;
  }

  // Start monitoring for notification opportunities
  private startMonitoring(): void {
    // Check for notifications every 5 minutes
    setInterval(() => {
      this.checkForNotifications();
    }, 5 * 60 * 1000);
  }

  private isQuietHours(): boolean {
    const hour = new Date().getHours();
    const { start, end } = this.userPreferences.quietHours;
    
    if (start > end) { // Overnight quiet hours (e.g., 23-7)
      return hour >= start || hour < end;
    } else { // Same day quiet hours
      return hour >= start && hour < end;
    }
  }

  private getPriorityScore(priority: string): number {
    const scores = { urgent: 4, high: 3, medium: 2, low: 1 };
    return scores[priority as keyof typeof scores] || 1;
  }

  private cleanupOldNotifications(): void {
    const now = new Date();
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.expiresAt < now) {
        this.notifications.delete(id);
      }
    }
  }

  // Update user preferences
  updatePreferences(preferences: Partial<typeof this.userPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }

  // Enable/disable notifications
  setActive(active: boolean): void {
    this.isActive = active;
  }
}

export const proactiveNotifications = new ProactiveNotifications();
