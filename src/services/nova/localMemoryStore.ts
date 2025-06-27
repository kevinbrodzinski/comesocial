
interface MemoryData {
  version: string;
  lastUpdated: Date;
  venuePreferences: {
    types: string[];
    priceRange: number[];
    atmosphere: string[];
    frequentAreas: string[];
  };
  behaviorPatterns: {
    timePreferences: Record<string, any>;
    searchHistory: Array<{
      query: string;
      timestamp: Date;
      intents: string[];
    }>;
    venueInteractions: Array<{
      venueType: string;
      timestamp: Date;
      context: string;
    }>;
  };
}

const MEMORY_VERSION = '1.0.0';
const MEMORY_KEY = 'nova_user_memory';
const MEMORY_EXPIRY_DAYS = 30;

export class LocalMemoryStore {
  private static isDataValid(data: any): data is MemoryData {
    return (
      data &&
      data.version === MEMORY_VERSION &&
      data.lastUpdated &&
      new Date(data.lastUpdated) > new Date(Date.now() - MEMORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    );
  }

  private static getDefaultMemory(): MemoryData {
    return {
      version: MEMORY_VERSION,
      lastUpdated: new Date(),
      venuePreferences: {
        types: [],
        priceRange: [],
        atmosphere: [],
        frequentAreas: [],
      },
      behaviorPatterns: {
        timePreferences: {},
        searchHistory: [],
        venueInteractions: [],
      },
    };
  }

  static getMemory(): MemoryData {
    try {
      const stored = localStorage.getItem(MEMORY_KEY);
      if (!stored) return this.getDefaultMemory();

      const parsed = JSON.parse(stored);
      if (this.isDataValid(parsed)) {
        // Convert date strings back to Date objects
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.behaviorPatterns.searchHistory = parsed.behaviorPatterns.searchHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        parsed.behaviorPatterns.venueInteractions = parsed.behaviorPatterns.venueInteractions.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load Nova memory, using defaults:', error);
    }
    
    return this.getDefaultMemory();
  }

  static saveMemory(memory: MemoryData): void {
    try {
      memory.lastUpdated = new Date();
      localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
    } catch (error) {
      console.warn('Failed to save Nova memory:', error);
    }
  }

  static clearMemory(): void {
    try {
      localStorage.removeItem(MEMORY_KEY);
    } catch (error) {
      console.warn('Failed to clear Nova memory:', error);
    }
  }
}
