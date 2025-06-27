
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface MapFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
  crowdFilter: number[];
  setCrowdFilter: (filter: number[]) => void;
  vibeFilters: string[];
  onToggleVibeFilter: (vibe: string) => void;
  openNowOnly: boolean;
  setOpenNowOnly: (value: boolean) => void;
  distanceFilter: number;
  setDistanceFilter: (distance: number) => void;
  onResetFilters: () => void;
}

const MapFiltersModal = ({
  open,
  onOpenChange,
  selectedFilters,
  onToggleFilter,
  crowdFilter,
  setCrowdFilter,
  vibeFilters,
  onToggleVibeFilter,
  openNowOnly,
  setOpenNowOnly,
  distanceFilter,
  setDistanceFilter,
  onResetFilters
}: MapFiltersModalProps) => {
  const venueTypes = ['restaurant', 'bar', 'club', 'lounge', 'cafe', 'rooftop'];
  const vibes = ['trendy', 'casual', 'upscale', 'dive', 'craft', 'live music'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Venues</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Venue Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Venue Types</Label>
            <div className="flex flex-wrap gap-2">
              {venueTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedFilters.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onToggleFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Vibes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Vibes</Label>
            <div className="flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <Badge
                  key={vibe}
                  variant={vibeFilters.includes(vibe) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onToggleVibeFilter(vibe)}
                >
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Crowd Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Crowd Level: {crowdFilter[0]}% - {crowdFilter[1]}%
            </Label>
            <Slider
              value={crowdFilter}
              onValueChange={setCrowdFilter}
              max={100}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Distance: {distanceFilter} miles
            </Label>
            <Slider
              value={[distanceFilter]}
              onValueChange={(value) => setDistanceFilter(value[0])}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Open Now */}
          <div className="flex items-center justify-between">
            <Label htmlFor="open-now" className="text-sm font-medium">
              Open Now Only
            </Label>
            <Switch
              id="open-now"
              checked={openNowOnly}
              onCheckedChange={setOpenNowOnly}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onResetFilters} className="flex-1">
              Reset All
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapFiltersModal;
