
import { VenueProvider, VenueSearchParams, StandardVenueData } from '../types';

export class YelpVenueProvider implements VenueProvider {
  public readonly name = 'yelp';

  constructor(private apiKey?: string) {}

  async searchVenues(params: VenueSearchParams): Promise<StandardVenueData[]> {
    if (!this.apiKey) {
      throw new Error('Yelp API key not configured');
    }

    const searchParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius: params.radius.toString(),
      categories: params.categories?.join(',') || 'bars,nightlife',
      open_now: params.open_now?.toString() || 'false',
      limit: (params.limit || 20).toString(),
    });

    const response = await fetch(`https://api.yelp.com/v3/businesses/search?${searchParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return data.businesses?.map((business: any) => ({
      id: business.id,
      name: business.name,
      category: business.categories?.[0]?.alias || 'venue',
      rating: business.rating,
      price_level: business.price?.length || 2,
      distance: business.distance,
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude,
      is_open_now: business.hours?.[0]?.is_open_now || false,
      photo_url: business.image_url,
      address: business.location.display_address.join(', '),
      phone: business.phone,
      review_count: business.review_count,
    })) || [];
  }

  async getVenueDetails(venueId: string): Promise<StandardVenueData> {
    if (!this.apiKey) {
      throw new Error('Yelp API key not configured');
    }

    const response = await fetch(`https://api.yelp.com/v3/businesses/${venueId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const business = await response.json();
    
    return {
      id: business.id,
      name: business.name,
      category: business.categories?.[0]?.alias || 'venue',
      rating: business.rating,
      price_level: business.price?.length || 2,
      distance: 0, // Will be calculated elsewhere
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude,
      is_open_now: business.hours?.[0]?.is_open_now || false,
      photo_url: business.image_url,
      address: business.location.display_address.join(', '),
      phone: business.phone,
      review_count: business.review_count,
    };
  }
}
