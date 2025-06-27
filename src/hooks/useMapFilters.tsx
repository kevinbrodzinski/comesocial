
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Venue } from '../data/venuesData';

export const useMapFilters = (venues: Venue[]) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
  const [crowdFilter, setCrowdFilter] = useState([0, 100]);
  const [vibeFilters, setVibeFilters] = useState<string[]>([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(5);
  const { toast } = useToast();

  const toggleFilter = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All']);
    } else {
      const newFilters = selectedFilters.includes(filter)
        ? selectedFilters.filter(f => f !== filter)
        : [...selectedFilters.filter(f => f !== 'All'), filter];
      setSelectedFilters(newFilters.length === 0 ? ['All'] : newFilters);
    }
  };

  const toggleVibeFilter = (vibe: string) => {
    setVibeFilters(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe)
        : [...prev, vibe]
    );
  };

  const resetFilters = () => {
    // Reset all filters to their default values
    setSelectedFilters(['All']); // Default to 'All' selected
    setCrowdFilter([0, 100]); // Default range
    setVibeFilters([]); // No vibes selected
    setOpenNowOnly(false); // Default to false
    setDistanceFilter(5); // Default distance of 5 miles
    
    console.log('Filters reset to defaults'); // Debug log
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  const filteredVenues = venues.filter(venue => {
    // Filter by category
    if (!selectedFilters.includes('All') && !selectedFilters.includes(venue.type)) {
      return false;
    }
    
    // Filter by crowd level
    if (venue.crowdLevel < crowdFilter[0] || venue.crowdLevel > crowdFilter[1]) {
      return false;
    }
    
    // Filter by vibe
    if (vibeFilters.length > 0 && !vibeFilters.some(vibe => venue.vibe.toLowerCase().includes(vibe.toLowerCase()))) {
      return false;
    }
    
    // Filter by distance (mock implementation)
    const venueDistance = parseFloat(venue.distance);
    if (venueDistance > distanceFilter) {
      return false;
    }
    
    return true;
  });

  return {
    selectedFilters,
    crowdFilter,
    setCrowdFilter,
    vibeFilters,
    openNowOnly,
    setOpenNowOnly,
    distanceFilter,
    setDistanceFilter,
    toggleFilter,
    toggleVibeFilter,
    resetFilters,
    filteredVenues
  };
};
