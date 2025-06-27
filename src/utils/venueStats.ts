
import { Venue } from '@/data/venuesData';

export interface VenueStats {
  capacity?: string;
  vibe?: string;
  cover?: string;
}

export const getVenueStats = (venue: Venue): VenueStats => {
  const stats: VenueStats = {};

  // Convert crowd level to capacity percentage
  if (venue.crowdLevel !== undefined) {
    stats.capacity = `${venue.crowdLevel}% full`;
  }

  // Use existing vibe data
  if (venue.vibe) {
    stats.vibe = venue.vibe;
  }

  // Add cover charge based on price level
  if (venue.priceLevel) {
    const coverCharges = {
      '$': '$5 cover',
      '$$': '$10 cover', 
      '$$$': '$15 cover',
      '$$$$': '$25 cover'
    };
    stats.cover = coverCharges[venue.priceLevel as keyof typeof coverCharges] || undefined;
  }

  return stats;
};

export const getVenueByName = (venueName: string, venues: Venue[]): Venue | undefined => {
  return venues.find(venue => venue.name === venueName);
};
