
import React from 'react';
import { X, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SectionCard } from '@/components/ui/section-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VIBE_OPTIONS } from '@/types/vibeTypes';

interface FriendsFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  activeVibeFilters: string[];
  onVibeFilterToggle: (vibeId: string) => void;
  searchHistory: string[];
}

const FriendsFiltersModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
  activeVibeFilters,
  onVibeFilterToggle,
  searchHistory
}: FriendsFiltersModalProps) => {
  const quickFilters = [
    { id: 'active', label: 'Active Now', icon: '🟢' },
    { id: 'nearby', label: 'Nearby', icon: '📍' },
    { id: 'on-plan', label: 'On Plans', icon: '🎯' },
    { id: 'recent', label: 'Recent Activity', icon: '⏰' }
  ];

  const searchShortcuts = [
    { shortcut: '@active', description: 'Find active friends' },
    { shortcut: '@nearby', description: 'Find nearby friends' },
    { shortcut: '@plans', description: 'Find friends on plans' },
    { shortcut: '@going-out', description: 'Find friends going out' },
    { shortcut: '@hype', description: 'Find friends in hype mode' },
    { shortcut: '@open', description: 'Find friends open to plans' }
  ];

  const handleShortcutClick = (shortcut: string) => {
    onSearchChange(shortcut);
  };

  const handleHistoryClick = (query: string) => {
    onSearchChange(query);
  };

  const handleClearVibeFilters = () => {
    activeVibeFilters.forEach(vibeId => onVibeFilterToggle(vibeId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search & Filters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Enhanced Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search by name, location, or activity..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Quick Filters Card */}
          <SectionCard title="Quick Filters">
            <div className="grid grid-cols-2 gap-3">
              {quickFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                  className="cursor-pointer text-xs hover:scale-105 transition-all duration-200 justify-center py-2 px-3"
                  onClick={() => onFilterToggle(filter.id)}
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </Badge>
              ))}
            </div>
          </SectionCard>

          {/* Vibe Match Card */}
          <SectionCard title="Vibe Match">
            <div className="flex items-center justify-between mb-2">
              {activeVibeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearVibeFilters}
                  className="h-6 text-xs text-muted-foreground hover:text-foreground ml-auto"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {VIBE_OPTIONS.map((vibe) => (
                <Badge
                  key={vibe.id}
                  variant={activeVibeFilters.includes(vibe.id) ? "default" : "outline"}
                  className={`cursor-pointer text-xs hover:scale-105 transition-all duration-200 justify-center py-2 px-3 ${
                    activeVibeFilters.includes(vibe.id) ? vibe.bgColor + ' ' + vibe.textColor : ''
                  }`}
                  onClick={() => onVibeFilterToggle(vibe.id)}
                >
                  <span className="mr-1">{vibe.icon}</span>
                  {vibe.label}
                </Badge>
              ))}
            </div>

            {/* Quick Shortcuts Footer */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center mb-2">
                <Zap size={12} className="mr-1" />
                <span className="text-xs font-medium">Quick Shortcuts</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchShortcuts.map((item) => (
                  <Button
                    key={item.shortcut}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShortcutClick(item.shortcut)}
                    className="h-6 px-2 text-xs bg-primary/5 hover:bg-primary/10"
                    title={item.description}
                  >
                    {item.shortcut}
                  </Button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <SectionCard title="Recent Searches">
              <div className="flex items-center mb-2">
                <Clock size={12} className="mr-1" />
                <span className="text-xs font-medium">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHistoryClick(query)}
                    className="h-6 px-2 text-xs bg-secondary/30 hover:bg-secondary/50 max-w-32 truncate"
                    title={query}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Pro Tips */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p className="mb-1">💡 <strong>Pro tips:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Use @ shortcuts for quick filtering</li>
              <li>Filter by vibe to find friends with matching energy</li>
              <li>Combine filters for precise results</li>
              <li>Search works with typos and partial matches</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendsFiltersModal;
