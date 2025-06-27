
import { getFallbackVenueCoordinates } from '../utils/coordinateUtils';

export interface FallbackVenue {
  id: string;
  name: string;
  type: string;
  address: string;
  rating: number;
  distance: string;
  coordinates?: { lat: number; lng: number };
}

const fallbackVenues: FallbackVenue[] = [
  {
    id: 'fb-1',
    name: 'The Underground',
    type: 'club',
    address: '123 Main St, New York, NY',
    rating: 4.2,
    distance: '0.3 mi'
  },
  {
    id: 'fb-2',
    name: 'Rooftop Lounge',
    type: 'lounge',
    address: '456 Broadway, New York, NY',
    rating: 4.5,
    distance: '0.5 mi'
  },
  {
    id: 'fb-3',
    name: 'Great White Shark Bar',
    type: 'bar',
    address: '789 5th Ave, New York, NY',
    rating: 4.1,
    distance: '0.7 mi'
  },
  {
    id: 'fb-4',
    name: 'Green Garden Restaurant',
    type: 'restaurant',
    address: '321 Park Ave, New York, NY',
    rating: 4.3,
    distance: '0.4 mi'
  },
  {
    id: 'fb-5',
    name: 'Great Gatsby Speakeasy',
    type: 'bar',
    address: '654 Wall St, New York, NY',
    rating: 4.6,
    distance: '0.6 mi'
  }
];

export const searchFallbackVenues = (query: string): FallbackVenue[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return fallbackVenues
    .filter(venue => 
      venue.name.toLowerCase().includes(searchTerm) ||
      venue.type.toLowerCase().includes(searchTerm) ||
      venue.address.toLowerCase().includes(searchTerm)
    )
    .map(venue => ({
      ...venue,
      coordinates: getFallbackVenueCoordinates(venue.id, venue.name)
    }));
};
