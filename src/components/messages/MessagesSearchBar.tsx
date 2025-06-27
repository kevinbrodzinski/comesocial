
import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessagesSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  resultsCount?: number;
  activeTab: string;
}

const MessagesSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  resultsCount,
  activeTab
}: MessagesSearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const searchPlaceholders = {
    plans: "Search plans by name, venue, or friends...",
    messages: "Search conversations by friend name...",
    groups: "Search group chats by venue or participants...",
    pings: "Search pings by location or friend..."
  };

  const placeholder = searchPlaceholders[activeTab as keyof typeof searchPlaceholders] || "Search all messages...";

  return (
    <div className="px-4 pt-6 pb-3">
      <div className="relative bg-card rounded-lg border border-border shadow-sm p-1">
        <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-11 pr-10 bg-transparent border-0 focus:ring-0 focus:ring-offset-0 shadow-none"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalQuery('');
              onClearSearch();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-secondary"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            <Search size={10} className="mr-1" />
            {resultsCount || 0} results for "{searchQuery}"
          </Badge>
          {resultsCount === 0 && (
            <span className="text-xs text-muted-foreground">
              Try searching across all tabs
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesSearchBar;
