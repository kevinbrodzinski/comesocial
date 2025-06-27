
import { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { googlePlacesSearch, PlaceSearchResult } from '../../services/googlePlacesSearch';
import { searchFallbackVenues, FallbackVenue } from '../../services/fallbackVenueSearch';
import { generateStableCoordinates, getFallbackVenueCoordinates } from '../../utils/coordinateUtils';

interface SearchResult {
  id: string;
  type: 'venue' | 'tag' | 'area' | 'plan' | 'place' | 'fallback';
  name: string;
  subtitle?: string;
  icon: React.ReactNode;
  placeData?: PlaceSearchResult;
  fallbackData?: FallbackVenue;
}

export const useSearchResults = (query: string, onShowTemporaryPins?: (results: SearchResult[]) => void) => {
  const [rawGoogleResults, setRawGoogleResults] = useState<PlaceSearchResult[]>([]);
  const [rawFallbackResults, setRawFallbackResults] = useState<FallbackVenue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Transform raw results into SearchResult format
  const googleResults = useMemo(() => {
    return rawGoogleResults.map(place => {
      const coords = generateStableCoordinates(place.place_id, place.name);
      return {
        id: place.place_id,
        type: 'place' as const,
        name: place.name,
        subtitle: place.formatted_address,
        icon: <MapPin size={16} className="text-blue-500" />,
        placeData: {
          ...place,
          geometry: {
            ...place.geometry,
            location: coords
          }
        }
      };
    });
  }, [rawGoogleResults]);

  const fallbackResults = useMemo(() => {
    return rawFallbackResults.map(venue => {
      const coords = getFallbackVenueCoordinates(venue.id, venue.name);
      return {
        id: venue.id,
        type: 'fallback' as const,
        name: venue.name,
        subtitle: venue.address,
        icon: <MapPin size={16} className="text-green-500" />,
        fallbackData: {
          ...venue,
          coordinates: coords
        }
      };
    });
  }, [rawFallbackResults]);

  // Combined stable results for temporary pins
  const stableResults = useMemo(() => {
    return [...googleResults, ...fallbackResults];
  }, [googleResults, fallbackResults]);

  // Debounced search effect
  useEffect(() => {
    const searchPlaces = async () => {
      if (!query.trim() || query.length < 2) {
        setRawGoogleResults([]);
        setRawFallbackResults([]);
        onShowTemporaryPins?.([]);
        setLastQuery('');
        return;
      }

      // Skip if query hasn't changed
      if (query === lastQuery) return;

      setIsLoading(true);
      setLastQuery(query);
      
      try {
        const userLocation = { lat: 40.7128, lng: -74.0060 };
        
        // Try Google Places API first
        const googleData = await googlePlacesSearch.searchPlaces(query, userLocation);
        setRawGoogleResults(googleData.slice(0, 3));
        
        // Always get fallback results as well
        const fallbackData = searchFallbackVenues(query);
        setRawFallbackResults(fallbackData.slice(0, 3));
        
      } catch (error) {
        console.error('Search failed:', error);
        // If Google fails, use only fallback
        const fallbackData = searchFallbackVenues(query);
        setRawFallbackResults(fallbackData.slice(0, 5));
        setRawGoogleResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(searchPlaces, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, lastQuery, onShowTemporaryPins]);

  // Update temporary pins only when stable results change
  useEffect(() => {
    if (stableResults.length > 0) {
      onShowTemporaryPins?.(stableResults);
    } else {
      onShowTemporaryPins?.([]);
    }
  }, [stableResults, onShowTemporaryPins]);

  return {
    googleResults,
    fallbackResults,
    stableResults,
    isLoading
  };
};
