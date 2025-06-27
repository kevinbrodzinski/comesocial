
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FavoritesSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoritesSettingsModal = ({ open, onOpenChange }: FavoritesSettingsModalProps) => {
  const [sortBy, setSortBy] = useState('distance');
  const [filterVibes, setFilterVibes] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const { toast } = useToast();

  const sortOptions = [
    { id: 'distance', label: 'Distance', description: 'Closest first' },
    { id: 'crowd', label: 'Crowd Level', description: 'Least crowded first' },
    { id: 'vibe', label: 'Vibe Match', description: 'Best match for your style' },
    { id: 'recent', label: 'Recently Visited', description: 'Most recent first' }
  ];

  const vibeOptions = ['Trendy', 'Intimate', 'High Energy', 'Sophisticated', 'Relaxed', 'Casual'];
  const typeOptions = ['Rooftop Bar', 'Speakeasy', 'Nightclub', 'Cocktail Lounge', 'Wine Bar', 'Sports Bar'];

  const toggleFilter = (item: string, filterArray: string[], setFilter: (items: string[]) => void) => {
    if (filterArray.includes(item)) {
      setFilter(filterArray.filter(i => i !== item));
    } else {
      setFilter([...filterArray, item]);
    }
  };

  const handleApplySettings = () => {
    toast({
      title: "Settings Applied",
      description: `Favorites sorted by ${sortOptions.find(o => o.id === sortBy)?.label.toLowerCase()}`,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setSortBy('distance');
    setFilterVibes([]);
    setFilterTypes([]);
    toast({
      title: "Settings Reset",
      description: "All filters and sorting options have been cleared",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sort & Filter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sort Options */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Sort by</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    sortBy === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSortBy(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    {sortBy === option.id && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vibe Filters */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Filter by Vibe</h3>
            <div className="flex flex-wrap gap-2">
              {vibeOptions.map((vibe) => (
                <Badge
                  key={vibe}
                  variant={filterVibes.includes(vibe) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter(vibe, filterVibes, setFilterVibes)}
                >
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <Badge
                  key={type}
                  variant={filterTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleFilter(type, filterTypes, setFilterTypes)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplySettings}
              className="flex-1"
            >
              Apply Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesSettingsModal;
