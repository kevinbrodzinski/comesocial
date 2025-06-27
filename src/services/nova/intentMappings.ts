
import { IntentMapping } from './types';

export const intentMappings: Record<string, IntentMapping> = {
  chill: {
    keywords: ['chill', 'relax', 'quiet', 'calm', 'mellow', 'laid back', 'cozy'],
    categories: ['lounges', 'cocktailbars', 'wine_bars'],
    priceRange: [1, 2, 3],
    crowdLevel: 'low',
    features: ['intimate', 'quiet', 'conversation'],
    sortBy: 'rating'
  },
  party: {
    keywords: ['party', 'vibey', 'energy', 'wild', 'crazy', 'lit', 'hype', 'turn up'],
    categories: ['nightlife', 'danceclubs', 'bars'],
    priceRange: [2, 3, 4],
    crowdLevel: 'high',
    features: ['dj', 'dancing', 'music', 'late night'],
    timePreference: 'late',
    sortBy: 'crowd'
  },
  unique: {
    keywords: ['unique', 'hidden', 'secret', 'underground', 'different', 'special', 'gem'],
    categories: ['bars', 'lounges', 'speakeasy'],
    priceRange: [2, 3, 4],
    crowdLevel: 'medium',
    features: ['unique', 'special', 'artisanal'],
    sortBy: 'unique'
  },
  date: {
    keywords: ['date', 'romantic', 'intimate', 'couple', 'romance', 'dinner'],
    categories: ['restaurants', 'cocktailbars', 'lounges'],
    priceRange: [2, 3, 4],
    crowdLevel: 'low',
    features: ['romantic', 'intimate', 'dinner'],
    timePreference: 'early'
  },
  food: {
    keywords: ['food', 'eat', 'hungry', 'dinner', 'gastropub', 'kitchen'],
    categories: ['restaurants', 'gastropubs', 'breweries'],
    priceRange: [1, 2, 3],
    features: ['food', 'kitchen', 'menu'],
    sortBy: 'rating'
  },
  music: {
    keywords: ['music', 'live', 'band', 'concert', 'dj', 'sound', 'acoustic'],
    categories: ['musicvenues', 'bars', 'nightlife'],
    features: ['live music', 'dj', 'sound system'],
    sortBy: 'rating'
  },
  cheap: {
    keywords: ['cheap', 'affordable', 'budget', 'inexpensive', 'deals', 'happy hour'],
    categories: ['bars', 'pubs', 'divebars'],
    priceRange: [1, 2],
    features: ['affordable', 'deals', 'happy hour']
  },
  upscale: {
    keywords: ['upscale', 'fancy', 'classy', 'elegant', 'high end', 'luxury', 'premium'],
    categories: ['cocktailbars', 'lounges', 'restaurants'],
    priceRange: [3, 4],
    features: ['upscale', 'craft cocktails', 'premium'],
    sortBy: 'rating'
  }
};
