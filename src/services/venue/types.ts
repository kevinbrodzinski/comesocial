
export interface VenueProvider {
  name: string;
  searchVenues(params: VenueSearchParams): Promise<StandardVenueData[]>;
  getVenueDetails(venueId: string): Promise<StandardVenueData>;
}

export interface VenueSearchParams {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  categories?: string[];
  open_now?: boolean;
  price_levels?: number[]; // 1-4 scale
  limit?: number;
}

export interface StandardVenueData {
  id: string;
  name: string;
  category: string;
  rating: number;
  price_level: number;
  distance: number;
  latitude: number;
  longitude: number;
  is_open_now: boolean;
  photo_url?: string;
  address: string;
  phone?: string;
  review_count: number;
}

export interface NovaVenue {
  name: string;
  type: string;
  distance: string;
  vibe: string;
  features: string[];
  crowdLevel: number;
  rating: number;
  priceLevel: number;
  isOpen: boolean;
  address: string;
  phone?: string;
  reviewCount: number;
}
