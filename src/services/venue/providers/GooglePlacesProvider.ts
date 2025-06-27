
import { VenueProvider, VenueSearchParams, StandardVenueData } from '../types';

export class GooglePlacesProvider implements VenueProvider {
  public readonly name = 'google';

  constructor(private apiKey?: string) {}

  async searchVenues(params: VenueSearchParams): Promise<StandardVenueData[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    const searchParams = new URLSearchParams({
      location: `${params.latitude},${params.longitude}`,
      radius: params.radius.toString(),
      type: params.categories?.[0] || 'bar',
      key: this.apiKey,
    });

    if (params.open_now) {
      searchParams.append('opennow', 'true');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.results?.slice(0, params.limit || 20).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      category: place.types?.[0] || 'venue',
      rating: place.rating || 4.0,
      price_level: place.price_level || 2,
      distance: 0, // Will be calculated elsewhere
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      is_open_now: place.opening_hours?.open_now || false,
      photo_url: place.photos?.[0] 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${this.apiKey}`
        : 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop',
      address: place.vicinity || place.formatted_address || '',
      phone: place.formatted_phone_number || '',
      review_count: place.user_ratings_total || 0,
    })) || [];
  }

  async getVenueDetails(venueId: string): Promise<StandardVenueData> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${venueId}&key=${this.apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    const place = data.result;
    
    return {
      id: place.place_id,
      name: place.name,
      category: place.types?.[0] || 'venue',
      rating: place.rating || 4.0,
      price_level: place.price_level || 2,
      distance: 0,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      is_open_now: place.opening_hours?.open_now || false,
      photo_url: place.photos?.[0] 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${this.apiKey}`
        : 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop',
      address: place.formatted_address || '',
      phone: place.formatted_phone_number || '',
      review_count: place.user_ratings_total || 0,
    };
  }
}
