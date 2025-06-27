
import { VenueProvider } from './types';
import { YelpVenueProvider } from './providers/YelpVenueProvider';
import { GooglePlacesProvider } from './providers/GooglePlacesProvider';
import { FallbackVenueProvider } from './providers/FallbackVenueProvider';

export type ProviderType = 'yelp' | 'google' | 'foursquare' | 'fallback';

export class VenueProviderFactory {
  static createProvider(type: ProviderType, apiKey?: string): VenueProvider {
    switch (type) {
      case 'yelp':
        return new YelpVenueProvider(apiKey);
      case 'google':
        return new GooglePlacesProvider(apiKey);
      case 'fallback':
      default:
        return new FallbackVenueProvider();
    }
  }
}
