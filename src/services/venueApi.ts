
import { VenueProviderFactory } from './venue';
import { VenueTransformer } from './venue';
import { getAPIKey, NOVA_CONFIG } from '../config/novaConfig';
import type { VenueProvider, VenueSearchParams, StandardVenueData } from './venue/types';

interface VenueApiConfig {
  provider: 'yelp' | 'google' | 'foursquare';
  apiKey?: string;
}

// 10-minute cache for venue searches
const venueSearchCache = new Map<string, { ts: number; data: StandardVenueData[] }>();
const CACHE_TTL = 10 * 60 * 1_000; // 10 min in ms

export class VenueApiService {
  private venueProvider: VenueProvider;

  constructor(config: VenueApiConfig) {
    // Get API key from config
    const apiKey = config.apiKey || getAPIKey(config.provider);
    
    // Use the factory to create the appropriate provider
    this.venueProvider = VenueProviderFactory.createProvider(
      config.provider,
      apiKey
    );
  }

  async searchVenues(params: VenueSearchParams): Promise<StandardVenueData[]> {
    try {
      const cacheKey = `${this.venueProvider.name}|${JSON.stringify(params)}`;
      const cached = venueSearchCache.get(cacheKey);

      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return cached.data;                    // ✅ hit
      }

      const data = await this.venueProvider.searchVenues(params);
      venueSearchCache.set(cacheKey, { ts: Date.now(), data });
      return data;
    } catch (error) {
      console.error(`Venue search error @${this.venueProvider.name}`, error);
      // Fallback to default provider
      const fallbackProvider = VenueProviderFactory.createProvider('fallback');
      return await fallbackProvider.searchVenues(params);
    }
  }

  async getVenueDetails(venueId: string): Promise<StandardVenueData> {
    return await this.venueProvider.getVenueDetails(venueId);
  }

  // Convert API venue data to Nova's expected format
  convertToNovaVenue(venue: StandardVenueData): any {
    return VenueTransformer.toNovaVenue(venue);
  }
}

export const venueApi = new VenueApiService({
  provider: NOVA_CONFIG.venueProvider as 'google',
  // API key will be loaded from config automatically
});

// Re-export types for backward compatibility
export type { VenueSearchParams, StandardVenueData };
