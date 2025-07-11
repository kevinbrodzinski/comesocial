
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlannerSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onOpenFilters: () => void;
}

const PlannerSearchBar = ({
  searchQuery,
  onSearchChange,
  activeFilters,
  onOpenFilters
}: PlannerSearchBarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search plans, drafts, or venues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-9"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenFilters}
        className="h-9 px-3 relative"
      >
        <Filter size={16} />
        {activeFilters.length > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {activeFilters.length}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default PlannerSearchBar;
