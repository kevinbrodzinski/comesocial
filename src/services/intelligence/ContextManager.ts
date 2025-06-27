
import { eventTracker } from './EventTracker';
import { NovaContext } from '../nova/types';

interface LocalContext {
  userPreferences: {
    venueTypes: Record<string, number>;
    timePreferences: Record<string, number>;
    socialPatterns: Record<string, number>;
    locationPreferences: Record<string, number>;
  };
  recentActivity: {
    venueVisits: any[];
    friendInteractions: any[];
    searchQueries: any[];
  };
  currentSituation: {
    timeContext: string;
    locationContext?: { lat: number; lng: number };
    socialContext: {
      friendsNearby: number;
      groupActivity: boolean;
    };
    weatherContext?: string;
  };
  behaviorPatterns: {
    weeklyPatterns: Record<string, number>;
    timePatterns: Record<string, number>;
    socialPatterns: Record<string, number>;
  };
}

export class ContextManager {
  private cachedContext: LocalContext | null = null;
  private lastContextUpdate: Date | null = null;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Get comprehensive local context for AI decisions
  getLocalContext(): LocalContext {
    if (this.isCacheValid()) {
      return this.cachedContext!;
    }

    const context = this.buildLocalContext();
    this.cachedContext = context;
    this.lastContextUpdate = new Date();
    
    console.log('🧠 Context assembled:', {
      preferences: Object.keys(context.userPreferences),
      recentActivity: Object.keys(context.recentActivity),
      patterns: Object.keys(context.behaviorPatterns)
    });

    return context;
  }

  // Build micro-prompt for LLM with local context
  buildMicroPrompt(intent: string, userMessage: string): string {
    const context = this.getLocalContext();
    
    // Core context elements
    const timeContext = context.currentSituation.timeContext;
    const topVenueTypes = this.getTopPreferences(context.userPreferences.venueTypes, 3);
    const recentSearches = context.recentActivity.searchQueries.slice(0, 3);
    
    // Build focused prompt based on intent
    let microPrompt = `Context: ${timeContext}`;
    
    if (intent === 'venue_search') {
      microPrompt += `\nUser prefers: ${topVenueTypes.join(', ')}`;
      if (context.currentSituation.socialContext.friendsNearby > 0) {
        microPrompt += `\n${context.currentSituation.socialContext.friendsNearby} friends nearby`;
      }
    }
    
    if (intent === 'timing_question') {
      const timePrefs = this.getTopPreferences(context.userPreferences.timePreferences, 2);
      microPrompt += `\nUsual timing: ${timePrefs.join(', ')}`;
    }
    
    if (intent === 'social_planning') {
      const socialPatterns = this.getTopPreferences(context.userPreferences.socialPatterns, 2);
      microPrompt += `\nSocial patterns: ${socialPatterns.join(', ')}`;
    }

    // Add recent context if relevant
    if (recentSearches.length > 0) {
      microPrompt += `\nRecent: ${recentSearches.map(s => s.query).join(', ')}`;
    }

    microPrompt += `\nQuery: "${userMessage}"`;
    
    console.log('🎯 Micro-prompt built:', { intent, promptLength: microPrompt.length });
    
    return microPrompt;
  }

  // Get contextual venue filters based on user patterns
  getContextualVenueFilters(): {
    preferredTypes: string[];
    timeBasedFilters: Record<string, any>;
    socialFilters: Record<string, any>;
    locationBias?: { lat: number; lng: number };
  } {
    const context = this.getLocalContext();
    
    return {
      preferredTypes: this.getTopPreferences(context.userPreferences.venueTypes, 5),
      timeBasedFilters: {
        currentTimePreference: context.userPreferences.timePreferences,
        dayOfWeek: new Date().getDay()
      },
      socialFilters: {
        groupSize: context.currentSituation.socialContext.friendsNearby + 1,
        socialActivity: context.currentSituation.socialContext.groupActivity
      },
      locationBias: context.currentSituation.locationContext
    };
  }

  // Get prediction context for venue recommendations
  getPredictionContext(): {
    venueTypeScores: Record<string, number>;
    timingScores: Record<string, number>;
    socialContextScore: number;
    confidenceLevel: number;
  } {
    const context = this.getLocalContext();
    const patterns = eventTracker.getBehaviorPatterns();
    
    // Calculate confidence based on data availability
    const totalEvents = eventTracker.getEventsInTimeWindow(24 * 7).length; // Last week
    const confidenceLevel = Math.min(totalEvents / 50, 1.0); // Max confidence at 50+ events
    
    return {
      venueTypeScores: context.userPreferences.venueTypes,
      timingScores: context.userPreferences.timePreferences,
      socialContextScore: context.currentSituation.socialContext.friendsNearby * 0.2,
      confidenceLevel
    };
  }

  // Check if we need LLM call or can use local patterns
  shouldUseLLM(intent: string, confidence: number): boolean {
    // Use local patterns for high-confidence, simple intents
    const localCapableIntents = ['venue_search', 'timing_question', 'preference_query'];
    
    if (localCapableIntents.includes(intent) && confidence > 0.7) {
      console.log('🚀 Using local context, skipping LLM');
      return false;
    }
    
    console.log('🤖 Calling LLM for complex reasoning');
    return true;
  }

  // Generate local response without LLM for simple queries
  generateLocalResponse(intent: string, userMessage: string): string | null {
    const context = this.getLocalContext();
    
    if (intent === 'venue_search') {
      const topTypes = this.getTopPreferences(context.userPreferences.venueTypes, 3);
      const timeContext = context.currentSituation.timeContext;
      
      if (topTypes.length > 0) {
        return `Based on your preferences, I'd recommend ${topTypes[0]} venues. Given it's ${timeContext}, let me find the best options nearby.`;
      }
    }
    
    if (intent === 'timing_question') {
      const timePrefs = this.getTopPreferences(context.userPreferences.timePreferences, 2);
      if (timePrefs.length > 0) {
        return `You usually prefer ${timePrefs[0]} timing. Let me check current conditions for that time.`;
      }
    }
    
    return null; // Use LLM for complex responses
  }

  // Update context with new information
  updateContext(updates: Partial<LocalContext>): void {
    if (this.cachedContext) {
      this.cachedContext = { ...this.cachedContext, ...updates };
      this.lastContextUpdate = new Date();
    }
  }

  private buildLocalContext(): LocalContext {
    const userPreferences = eventTracker.getUserPreferences();
    const recentEvents = eventTracker.getEventsInTimeWindow(24); // Last 24 hours
    const patterns = eventTracker.getBehaviorPatterns();
    
    return {
      userPreferences,
      recentActivity: {
        venueVisits: recentEvents.filter(e => e.type === 'venue_interaction'),
        friendInteractions: recentEvents.filter(e => e.type === 'friend_response'),
        searchQueries: recentEvents.filter(e => e.type === 'chat_interaction')
      },
      currentSituation: {
        timeContext: this.getCurrentTimeContext(),
        socialContext: {
          friendsNearby: 0, // Would be populated from real friend data
          groupActivity: false
        }
      },
      behaviorPatterns: {
        weeklyPatterns: this.extractWeeklyPatterns(patterns),
        timePatterns: this.extractTimePatterns(patterns),
        socialPatterns: this.extractSocialPatterns(patterns)
      }
    };
  }

  private getCurrentTimeContext(): string {
    const now = new Date();
    const hour = now.getHours();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    let timeOfDay: string;
    if (hour < 6) timeOfDay = 'late night';
    else if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    return `${day} ${timeOfDay}`;
  }

  private getTopPreferences(preferences: Record<string, number>, limit: number): string[] {
    return Object.entries(preferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([key]) => key);
  }

  private extractWeeklyPatterns(patterns: Map<string, any>): Record<string, number> {
    const weekly: Record<string, number> = {};
    patterns.forEach((pattern, key) => {
      if (key.includes('Monday') || key.includes('Tuesday') || key.includes('Wednesday') || 
          key.includes('Thursday') || key.includes('Friday') || key.includes('Saturday') || 
          key.includes('Sunday')) {
        weekly[key] = pattern.frequency;
      }
    });
    return weekly;
  }

  private extractTimePatterns(patterns: Map<string, any>): Record<string, number> {
    const time: Record<string, number> = {};
    patterns.forEach((pattern, key) => {
      if (key.includes('morning') || key.includes('afternoon') || 
          key.includes('evening') || key.includes('night')) {
        time[key] = pattern.frequency;
      }
    });
    return time;
  }

  private extractSocialPatterns(patterns: Map<string, any>): Record<string, number> {
    const social: Record<string, number> = {};
    patterns.forEach((pattern, key) => {
      if (key.includes('friend_response') || key.includes('social')) {
        social[key] = pattern.frequency;
      }
    });
    return social;
  }

  private isCacheValid(): boolean {
    if (!this.cachedContext || !this.lastContextUpdate) {
      return false;
    }
    
    return Date.now() - this.lastContextUpdate.getTime() < this.cacheTimeout;
  }
}

export const contextManager = new ContextManager();
