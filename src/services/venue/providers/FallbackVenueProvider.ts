
import { VenueProvider, VenueSearchParams, StandardVenueData } from '../types';

export class FallbackVenueProvider implements VenueProvider {
  public readonly name = 'fallback';

  private fallbackVenues: StandardVenueData[] = [
    {
      id: 'fallback-1',
      name: 'Pulsar',
      category: 'nightclub',
      rating: 4.2,
      price_level: 3,
      distance: 800,
      latitude: 37.7749,
      longitude: -122.4194,
      is_open_now: true,
      address: '123 Mission St, San Francisco, CA',
      review_count: 245,
    },
    {
      id: 'fallback-2',
      name: 'The Green Room',
      category: 'cocktail_bar',
      rating: 4.5,
      price_level: 2,
      distance: 1200,
      latitude: 37.7849,
      longitude: -122.4094,
      is_open_now: true,
      address: '456 Valencia St, San Francisco, CA',
      review_count: 189,
    },
    {
      id: 'fallback-3',
      name: 'Orbit Taphouse',
      category: 'gastropub',
      rating: 4.0,
      price_level: 2,
      distance: 1600,
      latitude: 37.7649,
      longitude: -122.4294,
      is_open_now: true,
      address: '789 Fillmore St, San Francisco, CA',
      review_count: 156,
    },
  ];

  async searchVenues(params: VenueSearchParams): Promise<StandardVenueData[]> {
    let venues = [...this.fallbackVenues];

    // Calculate distances from user location
    venues = venues.map(venue => ({
      ...venue,
      distance: this.calculateDistance(
        params.latitude,
        params.longitude,
        venue.latitude,
        venue.longitude
      )
    }));

    // Apply filters
    if (params.categories && params.categories.length > 0) {
      venues = venues.filter(venue => 
        params.categories!.some(cat => venue.category.includes(cat))
      );
    }

    if (params.open_now) {
      venues = venues.filter(venue => venue.is_open_now);
    }

    if (params.price_levels && params.price_levels.length > 0) {
      venues = venues.filter(venue => 
        params.price_levels!.includes(venue.price_level)
      );
    }

    // Sort by distance and apply limit
    venues.sort((a, b) => a.distance - b.distance);
    
    if (params.limit) {
      venues = venues.slice(0, params.limit);
    }

    return venues;
  }

  async getVenueDetails(venueId: string): Promise<StandardVenueData> {
    const venue = this.fallbackVenues.find(v => v.id === venueId);
    if (!venue) {
      throw new Error(`Venue with id ${venueId} not found`);
    }
    return venue;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Return distance in meters
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
