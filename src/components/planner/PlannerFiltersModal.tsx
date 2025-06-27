
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

interface PlannerFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  searchHistory: string[];
}

const PlannerFiltersModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
  searchHistory
}: PlannerFiltersModalProps) => {
  const quickFilters = [
    { id: 'my-plans', label: 'My Plans', icon: '👤' },
    { id: 'friends-plans', label: "Friends' Plans", icon: '👥' },
    { id: 'tonight', label: 'Tonight', icon: '🌙' },
    { id: 'this-weekend', label: 'This Weekend', icon: '🎉' },
    { id: 'drafts', label: 'Drafts', icon: '📝' },
    { id: 'active-status', label: 'Active Status', icon: '🟢' }
  ];

  const planTypes = [
    { id: 'nightlife', label: 'Nightlife', icon: '🍸' },
    { id: 'dining', label: 'Dining', icon: '🍽️' },
    { id: 'activities', label: 'Activities', icon: '🎯' },
    { id: 'custom', label: 'Custom', icon: '⚡' }
  ];

  const statusFilters = [
    { id: 'planned', label: 'Planned', icon: '📅' },
    { id: 'in-progress', label: 'In Progress', icon: '⏳' },
    { id: 'completed', label: 'Completed', icon: '✅' }
  ];

  const searchShortcuts = [
    { shortcut: '@tonight', description: 'Find plans for tonight' },
    { shortcut: '@weekend', description: 'Find weekend plans' },
    { shortcut: '@mine', description: 'Find my created plans' },
    { shortcut: '@friends', description: 'Find friends\' plans' },
    { shortcut: '@drafts', description: 'Find draft plans' },
    { shortcut: '@active', description: 'Find active plans' }
  ];

  const handleShortcutClick = (shortcut: string) => {
    onSearchChange(shortcut);
  };

  const handleHistoryClick = (query: string) => {
    onSearchChange(query);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search & Filter Plans</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Enhanced Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search by name, venue, description, or attendees..."
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

          {/* Plan Types Card */}
          <SectionCard title="Plan Types">
            <div className="grid grid-cols-2 gap-3">
              {planTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant={activeFilters.includes(type.id) ? "default" : "outline"}
                  className="cursor-pointer text-xs hover:scale-105 transition-all duration-200 justify-center py-2 px-3"
                  onClick={() => onFilterToggle(type.id)}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </Badge>
              ))}
            </div>
          </SectionCard>

          {/* Status Filters Card */}
          <SectionCard title="Status">
            <div className="grid grid-cols-2 gap-3">
              {statusFilters.map((status) => (
                <Badge
                  key={status.id}
                  variant={activeFilters.includes(status.id) ? "default" : "outline"}
                  className="cursor-pointer text-xs hover:scale-105 transition-all duration-200 justify-center py-2 px-3"
                  onClick={() => onFilterToggle(status.id)}
                >
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
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
              <li>Search works across plan names, venues, and attendees</li>
              <li>Combine filters for precise results</li>
              <li>Filter by status to find specific plan states</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlannerFiltersModal;
