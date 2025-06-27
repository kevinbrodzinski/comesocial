// Configuration for Nova app
export const novaConfig = {
  app: {
    name: 'Nova',
    version: '1.0.0',
    description: 'Your AI-powered nightlife companion'
  },
  features: {
    realTimeUpdates: true,
    locationServices: true,
    socialFeatures: true,
    planningTools: true
  },
  ui: {
    theme: 'dark',
    animations: true,
    notifications: true
  }
};

// Enhanced Nova configuration with all required properties
export const NOVA_CONFIG = {
  // Core app settings
  app: {
    name: 'Nova',
    version: '1.0.0',
    description: 'Your AI-powered nightlife companion'
  },
  
  // Feature flags
  features: {
    realTimeUpdates: true,
    locationServices: true,
    socialFeatures: true,
    planningTools: true
  },
  
  // UI configuration
  ui: {
    theme: 'dark',
    animations: true,
    notifications: true
  },

  // API and service configuration
  venueProvider: 'google',
  enableRealVenueData: true,
  enableLocationServices: true,
  defaultSearchRadius: 5000, // 5km in meters
  maxVenueResults: 20,

  // Nova AI configuration
  maxConversationHistory: 10,
  minTypingDelay: 800,
  maxTypingDelay: 2000,

  // Memory and preferences
  maxMemoryEntries: 100,
  memoryRetentionDays: 30
};

export const getAPIKey = (provider: string): string => {
  console.log(`🔑 Requesting API key for service: ${provider}`);
  
  switch (provider) {
    case 'google': {
      const userKey = localStorage.getItem('google_maps_api_key');
      if (userKey && userKey !== '••••••••••••••••') {
        console.log(`🔑 Google Maps API key status: User-provided`);
        return userKey;
      }
      
      // Hardcoded API key for development
      const apiKey = 'AIzaSyCAdbYd5ensyLdVtjxbPbtr0_fG9C8FLQg';
      console.log(`🔑 Google Maps API key status: Available (hardcoded)`);
      return apiKey;
    }
    case 'yelp': {
      const yelpKey = localStorage.getItem('yelp_api_key');
      if (yelpKey && yelpKey !== '••••••••••••••••') {
        console.log(`🔑 Yelp API key status: User-provided`);
        return yelpKey;
      }
      console.log(`🔑 Yelp API key status: Missing`);
      return process.env.VITE_YELP_API_KEY || '';
    }
    default: {
      console.warn(`🔑 Unknown service requested: ${provider}`);
      return '';
    }
  }
};
