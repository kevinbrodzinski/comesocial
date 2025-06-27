
import { StandardVenueData, NovaVenue } from './types';

export class VenueTransformer {
  static toNovaVenue(venue: StandardVenueData): NovaVenue {
    const crowdLevel = VenueTransformer.estimateCrowdLevel(venue);
    const vibe = VenueTransformer.determineVibe(venue);
    const features = VenueTransformer.extractFeatures(venue);

    return {
      name: venue.name,
      type: VenueTransformer.categoryToType(venue.category),
      distance: `${(venue.distance / 1609).toFixed(1)} mi`, // Convert to miles
      vibe,
      features,
      crowdLevel,
      rating: venue.rating,
      priceLevel: venue.price_level,
      isOpen: venue.is_open_now,
      address: venue.address,
      phone: venue.phone,
      reviewCount: venue.review_count,
    };
  }

  private static estimateCrowdLevel(venue: StandardVenueData): number {
    const hour = new Date().getHours();
    const baseLevel = venue.rating * 15; // Higher rated places tend to be busier
    
    // Adjust for time of day
    let timeMultiplier = 1;
    if (hour >= 20 && hour <= 23) timeMultiplier = 1.5; // Peak hours
    else if (hour >= 17 && hour <= 19) timeMultiplier = 1.2; // Early evening
    else if (hour >= 12 && hour <= 16) timeMultiplier = 0.8; // Afternoon
    else timeMultiplier = 0.5; // Early morning/late night

    // Adjust for venue type
    let typeMultiplier = 1;
    if (venue.category.includes('nightclub')) typeMultiplier = 1.3;
    else if (venue.category.includes('bar')) typeMultiplier = 1.1;
    else if (venue.category.includes('restaurant')) typeMultiplier = 0.9;

    return Math.min(100, Math.round(baseLevel * timeMultiplier * typeMultiplier));
  }

  private static determineVibe(venue: StandardVenueData): string {
    if (venue.rating >= 4.5) return 'Trending';
    if (venue.review_count < 50) return 'Underrated Gem';
    if (venue.category.includes('nightclub')) return 'Vibey';
    return 'Chill';
  }

  private static extractFeatures(venue: StandardVenueData): string[] {
    const features: string[] = [];
    
    if (venue.category.includes('nightclub')) {
      features.push('DJ', 'Dancing', 'Late Night');
    } else if (venue.category.includes('cocktail')) {
      features.push('Craft Cocktails', 'Intimate Setting');
    } else if (venue.category.includes('gastropub')) {
      features.push('Craft Beer', 'Food', 'Chill Vibes');
    } else if (venue.category.includes('rooftop')) {
      features.push('Rooftop', 'Views', 'Outdoor');
    }

    if (venue.price_level <= 2) features.push('Affordable');
    if (venue.rating >= 4.5) features.push('Highly Rated');
    if (venue.is_open_now) features.push('Open Now');

    return features;
  }

  private static categoryToType(category: string): string {
    if (category.includes('nightclub')) return 'Nightclub';
    if (category.includes('cocktail') || category.includes('lounge')) return 'Cocktail Lounge';
    if (category.includes('gastropub') || category.includes('pub')) return 'Gastropub';
    if (category.includes('bar')) return 'Bar';
    if (category.includes('restaurant')) return 'Restaurant';
    return 'Venue';
  }
}
