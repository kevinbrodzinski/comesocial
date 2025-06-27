
import { useState, useMemo } from 'react';

export interface SearchFilters {
  venueTypes: string[];
  vibes: string[];
  crowdLevel: [number, number];
  distance: number;
  sortBy: 'distance' | 'buzz' | 'friends';
}

export const useFeedSearch = (feedPosts: any[] = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    venueTypes: [],
    vibes: [],
    crowdLevel: [0, 100],
    distance: 10,
    sortBy: 'buzz'
  });

  const filteredPosts = useMemo(() => {
    // Ensure feedPosts is an array before filtering
    if (!Array.isArray(feedPosts)) {
      return [];
    }

    let filtered = [...feedPosts];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.venue.toLowerCase().includes(query) ||
        post.type.toLowerCase().includes(query) ||
        post.vibe.toLowerCase().includes(query)
      );
    }

    // Apply venue type filter
    if (activeFilters.venueTypes.length > 0) {
      filtered = filtered.filter(post =>
        activeFilters.venueTypes.some(type => 
          post.type.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Apply vibe filter
    if (activeFilters.vibes.length > 0) {
      filtered = filtered.filter(post =>
        activeFilters.vibes.some(vibe => 
          post.vibe.toLowerCase().includes(vibe.toLowerCase())
        )
      );
    }

    // Apply crowd level filter
    filtered = filtered.filter(post =>
      post.crowdLevel >= activeFilters.crowdLevel[0] &&
      post.crowdLevel <= activeFilters.crowdLevel[1]
    );

    // Apply distance filter
    filtered = filtered.filter(post => {
      const distance = parseFloat(post.distance.replace(' mi', ''));
      return distance <= activeFilters.distance;
    });

    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'distance':
        filtered.sort((a, b) => 
          parseFloat(a.distance.replace(' mi', '')) - parseFloat(b.distance.replace(' mi', ''))
        );
        break;
      case 'buzz':
        filtered.sort((a, b) => b.crowdLevel - a.crowdLevel);
        break;
      case 'friends':
        // For now, sort by likes as a proxy for friend activity
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    return filtered;
  }, [feedPosts, searchQuery, activeFilters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilters({
      venueTypes: [],
      vibes: [],
      crowdLevel: [0, 100],
      distance: 10,
      sortBy: 'buzz'
    });
  };

  const hasActiveFilters = () => {
    return searchQuery.trim() !== '' ||
           activeFilters.venueTypes.length > 0 ||
           activeFilters.vibes.length > 0 ||
           activeFilters.crowdLevel[0] > 0 ||
           activeFilters.crowdLevel[1] < 100 ||
           activeFilters.distance < 10;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (activeFilters.venueTypes.length > 0) count++;
    if (activeFilters.vibes.length > 0) count++;
    if (activeFilters.crowdLevel[0] > 0 || activeFilters.crowdLevel[1] < 100) count++;
    if (activeFilters.distance < 10) count++;
    return count;
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    updateFilter,
    filteredPosts,
    clearAllFilters,
    hasActiveFilters,
    getActiveFilterCount
  };
};
