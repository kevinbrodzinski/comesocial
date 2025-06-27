import { IntentMapping } from './types';

const intentMap: IntentMapping[] = [
  {
    keywords: ['party', 'club', 'nightlife', 'dancing', 'drinks', 'loud', 'crowded'],
    categories: ['nightlife', 'bars', 'clubs'],
    priceRange: [2, 3, 4],
    crowdLevel: 'high',
    features: ['dj', 'dancing', 'live music'],
  },
  {
    keywords: ['chill', 'relaxed', 'quiet', 'casual', 'low-key', 'mellow'],
    categories: ['bars', 'restaurants', 'lounges'],
    priceRange: [1, 2, 3],
    crowdLevel: 'low',
    features: ['lounge', 'outdoor seating', 'happy hour'],
  },
  {
    keywords: ['unique', 'hidden gem', 'local', 'authentic', 'off the beaten path'],
    categories: [],
    features: ['local artists', 'unique decor', 'specialty cocktails'],
    sortBy: 'unique',
  },
  {
    keywords: ['date night', 'romantic', 'intimate', 'fancy', 'upscale'],
    categories: ['restaurants', 'bars'],
    priceRange: [3, 4],
    features: ['candlelit', 'wine list', 'reservations'],
  },
  {
    keywords: ['live music', 'concert', 'band', 'acoustic', 'jazz'],
    categories: ['music venues', 'bars', 'restaurants'],
    features: ['live music', 'stage', 'sound system'],
  },
  {
    keywords: ['cheap', 'deals', 'happy hour', 'affordable', 'budget'],
    categories: ['bars', 'restaurants'],
    priceRange: [1, 2],
    timePreference: 'early',
  },
  {
    keywords: ['late night', 'open late', 'after hours', 'midnight'],
    categories: ['bars', 'restaurants', 'clubs'],
     timePreference: 'late',
  },
];

export const classifyVenueIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check for venue-related keywords
  const venueKeywords = ['bar', 'club', 'restaurant', 'spot', 'place', 'venue', 'find', 'looking for', 'show me'];
  const hasVenueKeywords = venueKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (hasVenueKeywords) {
    return 'venue_search';
  }
  
  return 'general_chat';
};

export const buildEnhancedSearchParams = (message: string, context: any) => {
  const intents = detectMultipleIntents(message);
  const radius = getSmartRadius(intents);
  
  // Base search parameters
  const searchParams: any = {
    location: context.location,
    radius,
    limit: 20,
  };

  // Apply intent-based enhancements
  const relevantMapping = intentMap.find(mapping => 
    mapping.keywords.some(keyword => message.toLowerCase().includes(keyword))
  );

  if (relevantMapping) {
    if (relevantMapping.categories.length > 0) {
      searchParams.categories = relevantMapping.categories;
    }
    if (relevantMapping.priceRange) {
      searchParams.priceRange = relevantMapping.priceRange;
    }
  }

  // Apply open now filter if requested
  if (shouldFilterOpenNow(message)) {
    searchParams.openNow = true;
  }

  return searchParams;
};

export const detectMultipleIntents = (message: string): string[] => {
  const lowerMessage = message.toLowerCase();
  return intentMap.filter(intent =>
    intent.keywords.some(keyword => lowerMessage.includes(keyword))
  ).map(intent => intent.keywords[0]);
};

export const getSmartRadius = (intents: string[]): number => {
  if (intents.includes('unique')) {
    return 8000;
  }
  if (intents.includes('chill')) {
    return 6000;
  }
  if (intents.includes('party')) {
    return 3000;
  }
  return 5000;
};

export const shouldFilterOpenNow = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('open now') || lowerMessage.includes('open tonight') || lowerMessage.includes('currently available');
};

export const applyEnhancedIntentFiltering = (
  venues: any[], 
  message: string, 
  userMemory?: any
): any[] => {
  const intents = detectMultipleIntents(message);
  
  const scoredVenues = venues.map(venue => ({
    venue,
    score: calculateIntentScore(venue, intents, userMemory)
  }));

  // Sort by score (higher is better)
  scoredVenues.sort((a, b) => b.score - a.score);

  return scoredVenues;
};

export const calculateIntentScore = (venue: any, intents: string[], userMemory?: any): number => {
  let score = 0;

  // Base scoring logic (existing)
  const { crowdLevel = 50, priceLevel = 2, features = [], type = '', rating = 0 } = venue;

  // Intent-based scoring
  intents.forEach(intent => {
    switch (intent) {
      case 'party':
        score += crowdLevel > 70 ? 30 : 10;
        score += features.some((f: string) => ['DJ', 'Dancing', 'Music'].includes(f)) ? 20 : 0;
        break;
      case 'chill':
        score += crowdLevel < 50 ? 25 : 5;
        score += features.some((f: string) => ['Quiet', 'Lounge', 'Outdoor'].includes(f)) ? 15 : 0;
        break;
      case 'unique':
        score += rating > 4.5 ? 20 : 0;
        score += features.length > 3 ? 15 : 0;
        break;
    }
  });

  // Memory-based scoring boost
  if (userMemory) {
    // Boost score for preferred venue types
    if (userMemory.venueTypes.includes(type.toLowerCase())) {
      score += 25;
    }

    // Boost score for preferred atmospheres
    const venueAtmosphere = inferVenueAtmosphere(venue);
    if (userMemory.atmospherePreference.includes(venueAtmosphere)) {
      score += 20;
    }
  }

  // Base rating contribution
  score += rating * 5;

  return score;
};

const inferVenueAtmosphere = (venue: any): string => {
  const { features = [], crowdLevel = 50 } = venue;
  
  if (features.some((f: string) => ['DJ', 'Dancing', 'Music'].includes(f)) || crowdLevel > 70) {
    return 'energetic';
  }
  
  if (features.some((f: string) => ['Quiet', 'Lounge'].includes(f)) || crowdLevel < 40) {
    return 'chill';
  }
  
  if (features.some((f: string) => ['Romantic', 'Intimate'].includes(f))) {
    return 'intimate';
  }
  
  return 'trendy';
};
