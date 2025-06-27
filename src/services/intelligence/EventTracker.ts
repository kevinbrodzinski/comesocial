
import { validateEventData } from './schemas/EventSchemas';
import { errorHandler } from './ErrorHandler';
import { eventStorage } from './tracking/EventStorage';
import { patternAnalyzer } from './tracking/PatternAnalyzer';
import { preferenceCalculator } from './tracking/PreferenceCalculator';

interface UserEvent {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'venue_interaction' | 'friend_response' | 'suggestion_feedback' | 'timing_preference' | 'location_pattern' | 'chat_interaction' | 'notification_action' | 'trend_follow' | 'prediction_outcome' | 'notification_generated' | 'notification_shown';
  context: {
    location?: { lat: number; lng: number };
    timeOfDay: string;
    dayOfWeek: string;
    weather?: string;
    friendsNearby?: number;
  };
  data: Record<string, any>;
  source: 'user_action' | 'system_generated' | 'ai_prediction';
}

export class EventTracker {
  private events: UserEvent[] = [];
  private readonly maxEvents = 10000;

  constructor() {
    this.loadEvents();
  }

  trackEvent(
    type: UserEvent['type'],
    data: Record<string, any>,
    source: UserEvent['source'] = 'user_action'
  ): void {
    if (!validateEventData(type, data)) {
      errorHandler.handleError(
        'validation',
        `Invalid event data for type: ${type}`,
        {
          component: 'EventTracker',
          operation: 'trackEvent',
          data: { type, data, source },
          timestamp: new Date()
        },
        false
      );
      console.warn('⚠️ Event tracked with validation warnings');
    }

    try {
      const event: UserEvent = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current_user',
        timestamp: new Date(),
        type,
        context: this.getCurrentContext(),
        data: this.sanitizeEventData(data),
        source
      };

      this.events.push(event);
      this.maintainEventLimit();
      patternAnalyzer.updatePatterns(event);
      this.saveEvents();
      
      console.log('🎯 Event tracked:', { type, data: Object.keys(data), validation: 'passed' });
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to track event',
        {
          component: 'EventTracker',
          operation: 'trackEvent',
          data: { type, error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  getEventsByType(type: UserEvent['type'], limit: number = 100): UserEvent[] {
    return this.events
      .filter(event => event.type === type)
      .slice(-limit)
      .reverse();
  }

  getEventsInTimeWindow(hours: number): UserEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(event => event.timestamp > cutoff);
  }

  getBehaviorPatterns() {
    return patternAnalyzer.getBehaviorPatterns();
  }

  // Convenience methods for specific event types
  trackVenueInteraction(venueId: number, action: string, metadata: Record<string, any> = {}): void {
    if (!venueId || venueId <= 0) {
      errorHandler.handleError(
        'validation',
        'Invalid venue ID for venue interaction',
        {
          component: 'EventTracker',
          operation: 'trackVenueInteraction',
          data: { venueId, action },
          timestamp: new Date()
        },
        false
      );
      return;
    }

    this.trackEvent('venue_interaction', {
      venueId,
      action,
      ...metadata
    });
  }

  trackFriendResponse(friendId: string, responseType: string, context: Record<string, any> = {}): void {
    this.trackEvent('friend_response', {
      friendId,
      responseType,
      ...context
    });
  }

  trackSuggestionFeedback(suggestionId: string, feedback: 'positive' | 'negative' | 'ignored', reason?: string): void {
    this.trackEvent('suggestion_feedback', {
      suggestionId,
      feedback,
      reason
    });
  }

  trackTimingPreference(preferredTime: string, venueType: string, outcome: string): void {
    this.trackEvent('timing_preference', {
      preferredTime,
      venueType,
      outcome
    });
  }

  trackLocationPattern(fromLocation: any, toLocation: any, travelTime: number): void {
    this.trackEvent('location_pattern', {
      fromLocation,
      toLocation,
      travelTime,
      route: 'direct'
    });
  }

  getUserPreferences() {
    try {
      return preferenceCalculator.calculateUserPreferences(this.events);
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to calculate user preferences',
        {
          component: 'EventTracker',
          operation: 'getUserPreferences',
          data: { error },
          timestamp: new Date()
        },
        true
      );
      
      return {
        venueTypes: {},
        timePreferences: {},
        socialPatterns: {},
        locationPreferences: {}
      };
    }
  }

  private getCurrentContext(): UserEvent['context'] {
    const now = new Date();
    return {
      timeOfDay: this.getTimeOfDayCategory(now),
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      friendsNearby: 0
    };
  }

  private getTimeOfDayCategory(date: Date): string {
    const hour = date.getHours();
    if (hour < 6) return 'late_night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private maintainEventLimit(): void {
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  private saveEvents(): void {
    eventStorage.saveEvents(this.events, patternAnalyzer.getBehaviorPatterns());
  }

  private loadEvents(): void {
    const { events, patterns } = eventStorage.loadEvents();
    this.events = events;
    patternAnalyzer.loadPatterns(patterns);
  }

  private sanitizeEventData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        if (value instanceof Date) {
          sanitized[key] = value.toISOString();
        } else if (typeof value === 'number' && !isNaN(value)) {
          sanitized[key] = value;
        } else if (typeof value === 'string' || typeof value === 'object' || typeof value === 'boolean') {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }

  cleanup(): void {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.events = eventStorage.cleanup(this.events, cutoff);
    this.saveEvents();
  }
}

export const eventTracker = new EventTracker();
