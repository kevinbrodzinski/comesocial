
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SearchResultsSummaryProps {
  searchQuery: string;
  activeFilters: string[];
  totalResults: number;
  plansCount: number;
  friendsPlansCount: number;
  draftsCount: number;
}

const SearchResultsSummary = ({
  searchQuery,
  activeFilters,
  totalResults,
  plansCount,
  friendsPlansCount,
  draftsCount
}: SearchResultsSummaryProps) => {
  const hasSearchOrFilters = searchQuery.trim() || activeFilters.length > 0;

  if (!hasSearchOrFilters) return null;

  return (
    <div className="mb-4 p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Search Results</h3>
        <Badge variant="secondary" className="text-xs">
          {totalResults} total
        </Badge>
      </div>
      
      {searchQuery && (
        <p className="text-xs text-muted-foreground mb-2">
          Searching for: <span className="font-medium">"{searchQuery}"</span>
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 text-xs">
        {plansCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {plansCount} My Plans
          </Badge>
        )}
        {friendsPlansCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {friendsPlansCount} Friends' Plans
          </Badge>
        )}
        {draftsCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {draftsCount} Drafts
          </Badge>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Active filters:</p>
          <div className="flex flex-wrap gap-1">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="text-xs">
                {filter.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsSummary;
