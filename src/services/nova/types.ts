export interface NovaConfig {
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface NovaContext {
  location?: { lat: number; lng: number };
  preferences?: string[];
  conversationHistory?: any[];
  time?: string;
  locationPermission?: string;
  userMemory?: {
    venueTypes: string[];
    atmospherePreference: string[];
    timePatterns: Record<string, string[]>;
    frequentAreas: string[];
  };
}

export interface NovaResponse {
  message: string;
  venues?: any[];
  intent: 'venue_search' | 'general_chat' | 'location_query' | 'recommendation';
  followUp?: string;
  explanation?: string;
}

export interface IntentMapping {
  keywords: string[];
  categories: string[];
  priceRange?: number[];
  crowdLevel?: 'low' | 'medium' | 'high';
  features?: string[];
  timePreference?: 'early' | 'late' | 'any';
  sortBy?: 'distance' | 'rating' | 'crowd' | 'unique';
}
