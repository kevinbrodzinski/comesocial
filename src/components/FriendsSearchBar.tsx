
import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Clock, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FriendsSearchBarProps {
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  searchHistory: string[];
}

const FriendsSearchBar = ({ 
  isExpanded, 
  onToggle, 
  searchQuery, 
  onSearchChange,
  activeFilters,
  onFilterToggle,
  searchHistory 
}: FriendsSearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const quickFilters = [
    { id: 'active', label: 'Active Now', icon: '🟢' },
    { id: 'nearby', label: 'Nearby', icon: '📍' },
    { id: 'on-plan', label: 'On Plans', icon: '🎯' },
    { id: 'recent', label: 'Recent Activity', icon: '⏰' }
  ];

  const searchShortcuts = [
    { shortcut: '@active', description: 'Find active friends' },
    { shortcut: '@nearby', description: 'Find nearby friends' },
    { shortcut: '@plans', description: 'Find friends on plans' }
  ];

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  const handleShortcutClick = (shortcut: string) => {
    setLocalQuery(shortcut);
    onSearchChange(shortcut);
  };

  const handleHistoryClick = (query: string) => {
    setLocalQuery(query);
    onSearchChange(query);
  };

  return (
    <div className="space-y-3">
      {/* Search Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground p-2 transition-all duration-200"
        >
          <Search size={16} className="mr-2" />
          Search Friends
        </Button>
        {(searchQuery || activeFilters.length > 0) && (
          <Badge variant="outline" className="text-xs animate-pulse">
            {searchQuery ? 'Searching' : `${activeFilters.length} filters`}
          </Badge>
        )}
      </div>

      {/* Expandable Search Bar */}
      <Collapsible open={isExpanded}>
        <CollapsibleContent className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or activity... (try @active, @nearby, @plans)"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-10 pr-10 transition-all duration-200 focus:ring-2"
              autoFocus={isExpanded}
            />
            {localQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10"
              >
                <X size={14} />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                className="cursor-pointer text-xs hover:scale-105 transition-all duration-200 select-none"
                onClick={() => onFilterToggle(filter.id)}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-6 px-2 text-xs"
            >
              <Filter size={12} className="mr-1" />
              Advanced
            </Button>
          </div>

          {/* Advanced Features */}
          <Collapsible open={showAdvanced}>
            <CollapsibleContent className="space-y-3 p-3 bg-muted/30 rounded-lg border animate-in slide-in-from-top-1 duration-150">
              
              {/* Search Shortcuts */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <Zap size={12} className="mr-1" />
                  Quick Shortcuts
                </h4>
                <div className="flex flex-wrap gap-1">
                  {searchShortcuts.map((item) => (
                    <Button
                      key={item.shortcut}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShortcutClick(item.shortcut)}
                      className="h-7 px-2 text-xs bg-primary/5 hover:bg-primary/10"
                      title={item.description}
                    >
                      {item.shortcut}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Recent Searches
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHistoryClick(query)}
                        className="h-7 px-2 text-xs bg-secondary/30 hover:bg-secondary/50 max-w-32 truncate"
                        title={query}
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Tips */}
              <div className="text-xs text-muted-foreground">
                <p className="mb-1">💡 <strong>Pro tips:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Use @ shortcuts for quick filtering</li>
                  <li>Search works with typos and partial matches</li>
                  <li>Combine filters for precise results</li>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FriendsSearchBar;
