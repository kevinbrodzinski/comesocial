
import React, { useMemo } from 'react';

interface SearchResultsSummaryProps {
  searchQuery: string;
  activeFilters: string[];
  sortedFriendsCount: number;
}

const SearchResultsSummary = React.memo(({
  searchQuery,
  activeFilters,
  sortedFriendsCount
}: SearchResultsSummaryProps) => {
  const hasSearchOrFilters = useMemo(() => 
    searchQuery || activeFilters.length > 0, 
    [searchQuery, activeFilters.length]
  );

  const searchResultsSummary = useMemo(() => {
    if (!hasSearchOrFilters) return null;
    
    const count = sortedFriendsCount;
    const friendText = count === 1 ? 'friend' : 'friends';
    const foundText = count === 0 ? 'No friends found' : `${count} ${friendText} found`;
    const searchText = searchQuery ? ` matching "${searchQuery}"` : '';
    const filterText = activeFilters.length > 0 ? 
      ` with ${activeFilters.length} filter${activeFilters.length === 1 ? '' : 's'}` : '';
    
    return `${foundText}${searchText}${filterText}`;
  }, [hasSearchOrFilters, sortedFriendsCount, searchQuery, activeFilters.length]);

  if (!hasSearchOrFilters) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-secondary/20 rounded-lg border border-secondary">
      <p className="text-sm text-muted-foreground">
        {searchResultsSummary}
      </p>
    </div>
  );
});

SearchResultsSummary.displayName = 'SearchResultsSummary';

export default SearchResultsSummary;
