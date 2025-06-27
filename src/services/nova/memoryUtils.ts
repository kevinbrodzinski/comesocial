import { LocalMemoryStore } from './localMemoryStore';

export interface UserPreferences {
  venueTypes: string[];
  pricePreference: number[];
  atmospherePreference: string[];
  timePatterns: Record<string, string[]>;
  frequentAreas: string[];
}

export class MemoryUtils {
  static inferPreferencesFromHistory(): UserPreferences {
    const memory = LocalMemoryStore.getMemory();
    const { searchHistory, venueInteractions } = memory.behaviorPatterns;

    // Infer venue types from search patterns
    const venueTypes = this.extractVenueTypesFromSearches(searchHistory);
    
    // Infer atmosphere preferences
    const atmospherePreference = this.extractAtmospherePreferences(searchHistory);
    
    // Infer time-based patterns
    const timePatterns = this.extractTimePatterns(searchHistory, venueInteractions);
    
    return {
      venueTypes,
      pricePreference: memory.venuePreferences.priceRange,
      atmospherePreference,
      timePatterns,
      frequentAreas: memory.venuePreferences.frequentAreas,
    };
  }

  private static extractVenueTypesFromSearches(searchHistory: any[]): string[] {
    const typeKeywords = {
      'bars': ['bar', 'drink', 'cocktail', 'beer'],
      'restaurants': ['food', 'eat', 'dinner', 'lunch'],
      'clubs': ['club', 'dance', 'party', 'music'],
      'lounges': ['chill', 'lounge', 'quiet', 'relaxed'],
    };

    const typeCounts: Record<string, number> = {};
    
    searchHistory.forEach(search => {
      const query = search.query.toLowerCase();
      Object.entries(typeKeywords).forEach(([type, keywords]) => {
        if (keywords.some(keyword => query.includes(keyword))) {
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        }
      });
    });

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  private static extractAtmospherePreferences(searchHistory: any[]): string[] {
    const atmosphereKeywords = {
      'chill': ['chill', 'relaxed', 'quiet', 'calm'],
      'energetic': ['party', 'lively', 'energetic', 'buzzing'],
      'intimate': ['intimate', 'cozy', 'romantic', 'small'],
      'trendy': ['trendy', 'hip', 'cool', 'modern'],
    };

    const atmosphereCounts: Record<string, number> = {};
    
    searchHistory.forEach(search => {
      const query = search.query.toLowerCase();
      Object.entries(atmosphereKeywords).forEach(([atmosphere, keywords]) => {
        if (keywords.some(keyword => query.includes(keyword))) {
          atmosphereCounts[atmosphere] = (atmosphereCounts[atmosphere] || 0) + 1;
        }
      });
    });

    return Object.entries(atmosphereCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([atmosphere]) => atmosphere);
  }

  private static extractTimePatterns(searchHistory: any[], venueInteractions: any[]): Record<string, string[]> {
    const patterns: Record<string, string[]> = {};
    
    const allInteractions = [...searchHistory, ...venueInteractions];
    
    allInteractions.forEach(interaction => {
      const date = new Date(interaction.timestamp);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();
      
      let timeOfDay = 'evening';
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 22) timeOfDay = 'late_night';
      
      const key = `${dayOfWeek.toLowerCase()}_${timeOfDay}`;
      if (!patterns[key]) patterns[key] = [];
      
      // Extract venue types or intents from the interaction
      if (interaction.intents) {
        patterns[key].push(...interaction.intents);
      }
    });

    return patterns;
  }

  static generatePersonalizedPrompts(preferences: UserPreferences): string[] {
    const prompts: string[] = [];
    
    // Time-based suggestions
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hour = now.getHours();
    
    let timeOfDay = 'evening';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 22) timeOfDay = 'late_night';
    
    const timeKey = `${dayOfWeek}_${timeOfDay}`;
    if (preferences.timePatterns[timeKey]) {
      prompts.push(`Your usual ${dayOfWeek} spots`);
    }

    // Venue type preferences
    if (preferences.venueTypes.length > 0) {
      const topType = preferences.venueTypes[0];
      prompts.push(`More ${topType} like you like`);
    }

    // Atmosphere preferences
    if (preferences.atmospherePreference.length > 0) {
      const topAtmosphere = preferences.atmospherePreference[0];
      prompts.push(`${topAtmosphere.charAt(0).toUpperCase() + topAtmosphere.slice(1)} vibes tonight`);
    }

    // Discovery suggestions
    prompts.push("Surprise me with something new");

    return prompts.slice(0, 4); // Limit to 4 suggestions
  }

  static recordSearch(query: string, intents: string[]): void {
    const memory = LocalMemoryStore.getMemory();
    
    memory.behaviorPatterns.searchHistory.push({
      query,
      timestamp: new Date(),
      intents,
    });

    // Keep only last 50 searches
    if (memory.behaviorPatterns.searchHistory.length > 50) {
      memory.behaviorPatterns.searchHistory = memory.behaviorPatterns.searchHistory.slice(-50);
    }

    LocalMemoryStore.saveMemory(memory);
  }

  static recordVenueInteraction(venueType: string, context: string): void {
    const memory = LocalMemoryStore.getMemory();
    
    memory.behaviorPatterns.venueInteractions.push({
      venueType,
      timestamp: new Date(),
      context,
    });

    // Keep only last 100 interactions
    if (memory.behaviorPatterns.venueInteractions.length > 100) {
      memory.behaviorPatterns.venueInteractions = memory.behaviorPatterns.venueInteractions.slice(-100);
    }

    LocalMemoryStore.saveMemory(memory);
  }
}
