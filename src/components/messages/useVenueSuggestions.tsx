
import { useState, useEffect, useCallback } from 'react';
import { searchFallbackVenues } from '@/services/fallbackVenueSearch';
import { googlePlacesSearch } from '@/services/googlePlacesSearch';

interface VenueSuggestion {
  id: number;
  name: string;
  type?: string;
  address?: string;
  rating?: number;
  distance?: string;
}

export const useVenueSuggestions = () => {
  const [suggestions, setSuggestions] = useState<VenueSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchVenues = useCallback(async (query: string): Promise<VenueSuggestion[]> => {
    if (!query || query.length < 2) return [];

    setIsLoading(true);
    try {
      // Try Google Places first
      const googleResults = await googlePlacesSearch.searchPlaces(query);
      
      if (googleResults.length > 0) {
        return googleResults.slice(0, 5).map((result, index) => ({
          id: parseInt(result.place_id.replace(/\D/g, '')) || index + 1000,
          name: result.name,
          type: result.types?.[0]?.replace(/_/g, ' ') || 'Venue',
          address: result.formatted_address,
          rating: result.rating,
          distance: '0.3 mi' // Would calculate from user location
        }));
      }

      // Fallback to local venues
      const fallbackResults = searchFallbackVenues(query);
      return fallbackResults.slice(0, 5).map((result, index) => ({
        id: parseInt(result.id.replace('fb-', '')) || index,
        name: result.name,
        type: result.type,
        address: result.address,
        rating: result.rating,
        distance: result.distance
      }));
    } catch (error) {
      console.error('Venue search error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    const results = await searchVenues(query);
    setSuggestions(results);
  }, [searchVenues]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    getSuggestions,
    clearSuggestions
  };
};
