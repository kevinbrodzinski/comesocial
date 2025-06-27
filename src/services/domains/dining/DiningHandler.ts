import { venueApi } from '../../venueApi';

export interface DiningVenue {
  id: number;
  name: string;
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  ambiance: string;
  dietaryOptions: string[];
  reservationRequired: boolean;
  distance: string;
  features: string[];
  specialties?: string[];
  averageMealCost?: number;
}

export class DiningHandler {
  async findRestaurants(
    query: string,
    location?: { lat: number; lng: number },
    filters: {
      cuisine?: string;
      priceRange?: string;
      dietary?: string[];
      ambiance?: string;
      mealType?: 'breakfast' | 'lunch' | 'dinner' | 'brunch';
    } = {}
  ): Promise<DiningVenue[]> {
    try {
      const searchParams = {
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        radius: 3000, // 3km for dining
        categories: ['restaurant', 'food', 'cafe', 'dining'],
        limit: 12
      };

      const venues = await venueApi.searchVenues(searchParams);
      
      const diningVenues = venues
        .map(venue => this.convertToDiningVenue(venue))
        .filter(venue => this.matchesDiningFilters(venue, filters));

      return this.sortDiningVenues(diningVenues, query, filters);

    } catch (error) {
      console.error('Dining search error:', error);
      return this.getFallbackRestaurants();
    }
  }

  private convertToDiningVenue(venue: any): DiningVenue {
    return {
      id: venue.id,
      name: venue.name,
      cuisine: this.inferCuisine(venue),
      priceRange: this.convertPriceLevel(venue.price_level),
      rating: venue.rating || 4.0,
      ambiance: this.inferAmbiance(venue),
      dietaryOptions: this.inferDietaryOptions(venue),
      reservationRequired: this.inferReservationRequirement(venue),
      distance: venue.distance || '0.5 mi',
      features: venue.features || [],
      specialties: this.inferSpecialties(venue),
      averageMealCost: this.estimateMealCost(venue.price_level)
    };
  }

  private inferCuisine(venue: any): string {
    const name = venue.name?.toLowerCase() || '';
    const features = venue.features?.join(' ').toLowerCase() || '';
    const description = (venue.description || '').toLowerCase();
    
    const text = `${name} ${features} ${description}`;

    // Common cuisine patterns
    const cuisinePatterns = {
      'Italian': ['italian', 'pizza', 'pasta', 'risotto'],
      'Mexican': ['mexican', 'taco', 'burrito', 'quesadilla'],
      'Chinese': ['chinese', 'dim sum', 'noodle', 'wok'],
      'Japanese': ['japanese', 'sushi', 'ramen', 'sake'],
      'Indian': ['indian', 'curry', 'tandoor', 'naan'],
      'Thai': ['thai', 'pad thai', 'coconut', 'lemongrass'],
      'French': ['french', 'bistro', 'brasserie', 'croissant'],
      'Mediterranean': ['mediterranean', 'greek', 'hummus', 'olive'],
      'American': ['burger', 'steak', 'bbq', 'grill'],
      'Seafood': ['seafood', 'fish', 'oyster', 'lobster'],
      'Vegetarian': ['vegetarian', 'vegan', 'plant-based']
    };

    for (const [cuisine, keywords] of Object.entries(cuisinePatterns)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return cuisine;
      }
    }

    return 'International';
  }

  private convertPriceLevel(priceLevel: number = 2): DiningVenue['priceRange'] {
    switch (priceLevel) {
      case 1: return '$';
      case 2: return '$$';
      case 3: return '$$$';
      case 4: return '$$$$';
      default: return '$$';
    }
  }

  private inferAmbiance(venue: any): string {
    const features = venue.features?.join(' ').toLowerCase() || '';
    const name = venue.name?.toLowerCase() || '';

    if (features.includes('romantic') || features.includes('intimate')) return 'romantic';
    if (features.includes('family') || features.includes('kid')) return 'family-friendly';
    if (features.includes('casual') || features.includes('relaxed')) return 'casual';
    if (features.includes('upscale') || features.includes('fine dining')) return 'upscale';
    if (features.includes('trendy') || features.includes('modern')) return 'trendy';
    if (name.includes('bistro') || name.includes('cafe')) return 'cozy';
    
    return 'welcoming';
  }

  private inferDietaryOptions(venue: any): string[] {
    const features = venue.features?.join(' ').toLowerCase() || '';
    const options: string[] = [];

    if (features.includes('vegetarian')) options.push('Vegetarian');
    if (features.includes('vegan')) options.push('Vegan');
    if (features.includes('gluten-free')) options.push('Gluten-Free');
    if (features.includes('halal')) options.push('Halal');
    if (features.includes('kosher')) options.push('Kosher');
    if (features.includes('keto')) options.push('Keto-Friendly');

    return options;
  }

  private inferReservationRequirement(venue: any): boolean {
    const priceLevel = venue.price_level || 2;
    const features = venue.features?.join(' ').toLowerCase() || '';
    
    // High-end restaurants typically require reservations
    if (priceLevel >= 3) return true;
    if (features.includes('fine dining')) return true;
    if (features.includes('reservation')) return true;
    
    return false;
  }

  private inferSpecialties(venue: any): string[] | undefined {
    const features = venue.features?.join(' ').toLowerCase() || '';
    const specialties: string[] = [];

    if (features.includes('wine')) specialties.push('Wine Selection');
    if (features.includes('craft beer')) specialties.push('Craft Beer');
    if (features.includes('cocktail')) specialties.push('Craft Cocktails');
    if (features.includes('dessert')) specialties.push('House-made Desserts');
    if (features.includes('local')) specialties.push('Local Ingredients');
    if (features.includes('organic')) specialties.push('Organic Options');

    return specialties.length > 0 ? specialties : undefined;
  }

  private estimateMealCost(priceLevel: number = 2): number {
    const costRanges = {
      1: 15,  // $
      2: 35,  // $$
      3: 65,  // $$$
      4: 120  // $$$$
    };
    return costRanges[priceLevel as keyof typeof costRanges] || 35;
  }

  private matchesDiningFilters(venue: DiningVenue, filters: any): boolean {
    if (filters.cuisine && venue.cuisine !== filters.cuisine) {
      return false;
    }
    
    if (filters.priceRange && venue.priceRange !== filters.priceRange) {
      return false;
    }
    
    if (filters.dietary && filters.dietary.length > 0) {
      const hasRequiredDietary = filters.dietary.some((diet: string) =>
        venue.dietaryOptions.includes(diet)
      );
      if (!hasRequiredDietary) return false;
    }
    
    if (filters.ambiance && venue.ambiance !== filters.ambiance) {
      return false;
    }
    
    return true;
  }

  private sortDiningVenues(venues: DiningVenue[], query: string, filters: any): DiningVenue[] {
    return venues.sort((a, b) => {
      const scoreA = this.calculateDiningScore(a, query, filters);
      const scoreB = this.calculateDiningScore(b, query, filters);
      
      return scoreB - scoreA;
    });
  }

  private calculateDiningScore(venue: DiningVenue, query: string, filters: any): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Name and cuisine match
    if (venue.name.toLowerCase().includes(queryLower)) score += 20;
    if (venue.cuisine.toLowerCase().includes(queryLower)) score += 15;
    
    // Rating bonus
    score += venue.rating * 2;
    
    // Features match
    venue.features.forEach(feature => {
      if (queryLower.includes(feature.toLowerCase())) score += 5;
    });
    
    // Filter preference bonus
    if (filters.cuisine === venue.cuisine) score += 10;
    if (filters.ambiance === venue.ambiance) score += 8;
    
    return score;
  }

  private getFallbackRestaurants(): DiningVenue[] {
    return [
      {
        id: 1,
        name: 'Local Bistro',
        cuisine: 'French',
        priceRange: '$$',
        rating: 4.2,
        ambiance: 'cozy',
        dietaryOptions: ['Vegetarian'],
        reservationRequired: true,
        distance: '0.4 mi',
        features: ['Wine Selection', 'Outdoor Seating'],
        specialties: ['Wine Selection', 'House-made Desserts']
      },
      {
        id: 2,
        name: 'Sakura Sushi',
        cuisine: 'Japanese',
        priceRange: '$$$',
        rating: 4.5,
        ambiance: 'upscale',
        dietaryOptions: ['Gluten-Free'],
        reservationRequired: true,
        distance: '0.7 mi',
        features: ['Fresh Fish', 'Sake Selection'],
        specialties: ['Omakase', 'Sake Selection']
      }
    ];
  }
}

export const diningHandler = new DiningHandler();
