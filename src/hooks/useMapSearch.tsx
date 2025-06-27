
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Venue } from '../data/venuesData';
import { PlaceSearchResult } from '../services/googlePlacesSearch';

export const useMapSearch = (venues: Venue[]) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { toast } = useToast();

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setShowSearch(true);
  };

  const handleSearchBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      setSearchFocused(false);
    }, 200);
  };

  const handleSearchResultSelect = (result: any) => {
    setSearchQuery(result.name);
    setSearchFocused(false);
    
    let selectedVenueId = null;
    
    if (result.type === 'place' && result.placeData) {
      // Handle Google Places result
      const place = result.placeData as PlaceSearchResult;
      toast({
        title: "Place Selected",
        description: `Selected ${place.name} - you can now add it to plans or favorites`,
      });
      
      // TODO: Convert place to venue format and add to map
      console.log('Selected Google Place:', place);
    } else if (result.type === 'venue') {
      // Handle existing venue result
      const venue = venues.find(v => v.name.includes(result.name));
      if (venue) {
        selectedVenueId = venue.id;
        toast({
          title: "Venue Selected",
          description: `Selected ${result.name}`,
        });
      }
    } else {
      toast({
        title: "Search Result Selected",
        description: `Selected ${result.name}`,
      });
    }

    return selectedVenueId;
  };

  return {
    showSearch,
    searchQuery,
    setSearchQuery,
    searchFocused,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchResultSelect
  };
};
