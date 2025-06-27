
import React from 'react';
import { X, MapPin, TrendingUp, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SectionCard } from '@/components/ui/section-card';
import { SearchFilters } from '../hooks/useFeedSearch';

interface FeedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onUpdateFilter: (key: keyof SearchFilters, value: any) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

const FeedFilterModal = ({ 
  isOpen, 
  onClose, 
  filters,
  onUpdateFilter,
  onClearAll,
  activeFilterCount 
}: FeedFilterModalProps) => {
  if (!isOpen) return null;

  const venueTypes = [
    'Rooftop Bar',
    'Nightclub', 
    'Speakeasy',
    'Cocktail Lounge',
    'Wine Bar',
    'Sports Bar'
  ];

  const vibes = [
    'Trendy',
    'Intimate', 
    'High Energy',
    'Relaxed',
    'Sophisticated',
    'Electric'
  ];

  const handleSortSelect = (sort: 'distance' | 'buzz' | 'friends') => {
    onUpdateFilter('sortBy', sort);
  };

  const toggleVenueType = (type: string) => {
    const current = filters.venueTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onUpdateFilter('venueTypes', updated);
  };

  const toggleVibe = (vibe: string) => {
    const current = filters.vibes;
    const updated = current.includes(vibe)
      ? current.filter(v => v !== vibe)
      : [...current, vibe];
    onUpdateFilter('vibes', updated);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in-0"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <div className="flex items-center space-x-2">
            <Filter size={18} />
            <h3 className="font-semibold text-foreground">Filter & Sort</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Sort By Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="space-y-2">
              <button
                onClick={() => handleSortSelect('distance')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  filters.sortBy === 'distance' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-card border-border hover:bg-secondary/50'
                }`}
              >
                <MapPin size={18} />
                <div className="text-left">
                  <p className="font-medium text-sm">Nearby</p>
                  <p className="text-xs text-muted-foreground">Show closest venues first</p>
                </div>
              </button>

              <button
                onClick={() => handleSortSelect('buzz')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  filters.sortBy === 'buzz' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-card border-border hover:bg-secondary/50'
                }`}
              >
                <TrendingUp size={18} />
                <div className="text-left">
                  <p className="font-medium text-sm">Trending</p>
                  <p className="text-xs text-muted-foreground">Hottest spots right now</p>
                </div>
              </button>

              <button
                onClick={() => handleSortSelect('friends')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  filters.sortBy === 'friends' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-card border-border hover:bg-secondary/50'
                }`}
              >
                <Users size={18} />
                <div className="text-left">
                  <p className="font-medium text-sm">Friends Activity</p>
                  <p className="text-xs text-muted-foreground">Where your friends are</p>
                </div>
              </button>
            </div>
          </div>

          <Separator />

          {/* Venue Types Card */}
          <SectionCard title="Venue Types">
            <div className="grid grid-cols-2 gap-3">
              {venueTypes.map((type) => (
                <Badge
                  key={type}
                  variant={filters.venueTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-xs justify-center py-2 px-3"
                  onClick={() => toggleVenueType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </SectionCard>

          {/* Vibes Card */}
          <SectionCard title="Vibes">
            <div className="grid grid-cols-2 gap-3">
              {vibes.map((vibe) => (
                <Badge
                  key={vibe}
                  variant={filters.vibes.includes(vibe) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors text-xs justify-center py-2 px-3"
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </Badge>
              ))}
            </div>
          </SectionCard>

          {/* Crowd Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Crowd Level: {filters.crowdLevel[0]}% - {filters.crowdLevel[1]}%
            </Label>
            <Slider
              value={filters.crowdLevel}
              onValueChange={(value) => onUpdateFilter('crowdLevel', value)}
              max={100}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Chill</span>
              <span>Packed</span>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Distance: {filters.distance === 10 ? '10+ miles' : `${filters.distance} miles`}
            </Label>
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => onUpdateFilter('distance', value[0])}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5 mi</span>
              <span>10+ mi</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClearAll} 
              className="flex-1"
              disabled={activeFilterCount === 0}
            >
              Clear All
            </Button>
            <Button onClick={onClose} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedFilterModal;
