import { venueApi } from '../../venueApi';

export interface NightlifeVenue {
  id: number;
  name: string;
  type: 'bar' | 'club' | 'lounge' | 'pub' | 'rooftop' | 'speakeasy';
  atmosphere: string;
  crowdLevel: number;
  musicType?: string;
  drinkSpecialties?: string[];
  coverCharge?: number;
  dresscode?: string;
  distance: string;
  features: string[];
}

export class NightlifeHandler {
  async findVenues(
    query: string,
    location?: { lat: number; lng: number },
    filters: {
      atmosphere?: string;
      venueType?: string;
      priceRange?: string;
      crowdLevel?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<NightlifeVenue[]> {
    try {
      // Build search parameters with correct format
      const searchParams = {
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        radius: 5000, // 5km
        categories: ['bar', 'nightlife', 'club', 'lounge'],
        limit: 10
      };

      // Get venues from API
      const venues = await venueApi.searchVenues(searchParams);
      
      // Convert and filter venues
      const nightlifeVenues = venues
        .map(venue => this.convertToNightlifeVenue(venue))
        .filter(venue => this.matchesFilters(venue, filters));

      // Sort by relevance and distance
      return this.sortVenues(nightlifeVenues, query, filters);

    } catch (error) {
      console.error('Nightlife search error:', error);
      return this.getFallbackVenues();
    }
  }

  private convertToNightlifeVenue(venue: any): NightlifeVenue {
    return {
      id: venue.id,
      name: venue.name,
      type: this.categorizeVenueType(venue.venue_type, venue.features),
      atmosphere: venue.vibe || this.inferAtmosphere(venue),
      crowdLevel: venue.crowd_level || 50,
      distance: venue.distance || '0.5 mi',
      features: venue.features || [],
      musicType: this.inferMusicType(venue),
      drinkSpecialties: this.inferDrinkSpecialties(venue),
      coverCharge: this.inferCoverCharge(venue),
      dresscode: this.inferDresscode(venue)
    };
  }

  private categorizeVenueType(venueType: string, features: string[] = []): NightlifeVenue['type'] {
    const type = venueType?.toLowerCase() || '';
    const featureText = features.join(' ').toLowerCase();

    if (type.includes('club') || featureText.includes('dancing')) return 'club';
    if (type.includes('lounge') || featureText.includes('lounge')) return 'lounge';
    if (type.includes('pub') || featureText.includes('pub')) return 'pub';
    if (featureText.includes('rooftop') || featureText.includes('outdoor')) return 'rooftop';
    if (featureText.includes('speakeasy') || featureText.includes('hidden')) return 'speakeasy';
    
    return 'bar'; // Default
  }

  private inferAtmosphere(venue: any): string {
    const features = venue.features?.join(' ').toLowerCase() || '';
    const name = venue.name?.toLowerCase() || '';

    if (features.includes('intimate') || features.includes('cozy')) return 'intimate';
    if (features.includes('upscale') || features.includes('elegant')) return 'upscale';
    if (features.includes('casual') || features.includes('laid-back')) return 'casual';
    if (features.includes('energetic') || features.includes('lively')) return 'energetic';
    if (name.includes('lounge')) return 'sophisticated';
    if (name.includes('pub')) return 'casual';
    
    return 'vibrant';
  }

  private inferMusicType(venue: any): string | undefined {
    const features = venue.features?.join(' ').toLowerCase() || '';
    
    if (features.includes('live music')) return 'Live Music';
    if (features.includes('dj')) return 'DJ Sets';
    if (features.includes('jazz')) return 'Jazz';
    if (features.includes('rock')) return 'Rock';
    if (features.includes('electronic')) return 'Electronic';
    
    return undefined;
  }

  private inferDrinkSpecialties(venue: any): string[] | undefined {
    const features = venue.features?.join(' ').toLowerCase() || '';
    const specialties: string[] = [];
    
    if (features.includes('craft beer')) specialties.push('Craft Beer');
    if (features.includes('cocktail')) specialties.push('Craft Cocktails');
    if (features.includes('wine')) specialties.push('Wine Selection');
    if (features.includes('whiskey')) specialties.push('Whiskey');
    if (features.includes('tequila')) specialties.push('Tequila/Mezcal');
    
    return specialties.length > 0 ? specialties : undefined;
  }

  private inferCoverCharge(venue: any): number | undefined {
    const priceLevel = venue.price_level || 1;
    if (priceLevel >= 3) return 15; // Upscale venues might have cover
    return undefined;
  }

  private inferDresscode(venue: any): string | undefined {
    const atmosphere = this.inferAtmosphere(venue);
    if (atmosphere === 'upscale') return 'Smart Casual';
    if (atmosphere === 'sophisticated') return 'Business Casual';
    return undefined;
  }

  private matchesFilters(venue: NightlifeVenue, filters: any): boolean {
    if (filters.atmosphere && venue.atmosphere !== filters.atmosphere) {
      return false;
    }
    
    if (filters.venueType && venue.type !== filters.venueType) {
      return false;
    }
    
    if (filters.crowdLevel) {
      const crowdRanges = {
        low: [0, 40],
        medium: [40, 70],
        high: [70, 100]
      };
      const [min, max] = crowdRanges[filters.crowdLevel];
      if (venue.crowdLevel < min || venue.crowdLevel > max) {
        return false;
      }
    }
    
    return true;
  }

  private sortVenues(venues: NightlifeVenue[], query: string, filters: any): NightlifeVenue[] {
    return venues.sort((a, b) => {
      // Score based on query relevance
      const scoreA = this.calculateRelevanceScore(a, query, filters);
      const scoreB = this.calculateRelevanceScore(b, query, filters);
      
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(venue: NightlifeVenue, query: string, filters: any): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Name match
    if (venue.name.toLowerCase().includes(queryLower)) score += 20;
    
    // Type match
    if (queryLower.includes(venue.type)) score += 15;
    
    // Atmosphere match
    if (queryLower.includes(venue.atmosphere.toLowerCase())) score += 10;
    
    // Features match
    venue.features.forEach(feature => {
      if (queryLower.includes(feature.toLowerCase())) score += 5;
    });
    
    // Filter preference bonus
    if (filters.atmosphere === venue.atmosphere) score += 8;
    if (filters.venueType === venue.type) score += 8;
    
    return score;
  }

  private getFallbackVenues(): NightlifeVenue[] {
    return [
      {
        id: 1,
        name: 'The Local Pub',
        type: 'pub',
        atmosphere: 'casual',
        crowdLevel: 60,
        distance: '0.3 mi',
        features: ['Live Sports', 'Craft Beer', 'Pool Table'],
        musicType: 'Background Music',
        drinkSpecialties: ['Craft Beer', 'Classic Cocktails']
      },
      {
        id: 2,
        name: 'Skyline Lounge',
        type: 'rooftop',
        atmosphere: 'upscale',
        crowdLevel: 75,
        distance: '0.8 mi',
        features: ['City Views', 'Craft Cocktails', 'Outdoor Seating'],
        musicType: 'Jazz',
        drinkSpecialties: ['Craft Cocktails', 'Wine Selection'],
        dresscode: 'Smart Casual'
      }
    ];
  }
}

export const nightlifeHandler = new NightlifeHandler();
