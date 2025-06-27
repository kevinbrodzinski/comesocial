
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
}

const FeedSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  placeholder = "Search venues, vibes, or areas..." 
}: FeedSearchBarProps) => {
  const popularSearches = [
    'rooftop bars',
    'nightclubs', 
    'intimate',
    'high energy',
    'speakeasy'
  ];

  const handleQuickSearch = (term: string) => {
    onSearchChange(term);
  };

  return (
    <div className="px-6 pb-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-10 bg-secondary/50 border-border/50 focus:bg-background transition-colors"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-secondary"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Quick search chips - only show when no search query */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2 mt-3">
          {popularSearches.map((term) => (
            <Badge
              key={term}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors text-xs"
              onClick={() => handleQuickSearch(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      )}

      {/* Active search term chip */}
      {searchQuery && (
        <div className="mt-3">
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 w-fit"
          >
            <Search size={12} />
            "{searchQuery}"
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSearch}
              className="h-4 w-4 p-0 ml-1 hover:bg-secondary"
            >
              <X size={10} />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default FeedSearchBar;
