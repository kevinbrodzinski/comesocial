
import { supabase } from './supabaseClient';

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  types: string[];
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
}

export class GooglePlacesSearchService {
  async searchPlaces(query: string, location?: { lat: number; lng: number }): Promise<PlaceSearchResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('google-places-search', {
        body: { query, location }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return [];
      }

      if (data.status === 'OK') {
        return data.candidates || [];
      } else {
        console.warn('Places search failed:', data.status);
        return [];
      }
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
    try {
      const { data, error } = await supabase.functions.invoke('google-places-details', {
        body: { placeId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return null;
      }

      if (data.status === 'OK') {
        return data.result;
      }
      
      return null;
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }
}

export const googlePlacesSearch = new GooglePlacesSearchService();
