
import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VenueSuggestion {
  id: number;
  name: string;
  type?: string;
  address?: string;
  rating?: number;
  distance?: string;
}

interface VenueSuggestionDropdownProps {
  suggestions: VenueSuggestion[];
  isVisible: boolean;
  onSelect: (venue: VenueSuggestion) => void;
  selectedIndex: number;
}

const VenueSuggestionDropdown = ({
  suggestions,
  isVisible,
  onSelect,
  selectedIndex
}: VenueSuggestionDropdownProps) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 bg-card border-border shadow-lg z-50 max-h-48 overflow-y-auto">
      <div className="p-2">
        {suggestions.map((venue, index) => (
          <button
            key={venue.id}
            onClick={() => onSelect(venue)}
            className={`
              w-full text-left p-3 rounded-lg transition-colors mb-1 last:mb-0
              ${selectedIndex === index 
                ? 'bg-primary/10 border border-primary/20' 
                : 'hover:bg-accent/50'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{venue.name}</div>
                {venue.type && (
                  <div className="text-xs text-muted-foreground">{venue.type}</div>
                )}
                {venue.address && (
                  <div className="text-xs text-muted-foreground truncate">{venue.address}</div>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  {venue.rating && (
                    <div className="flex items-center space-x-1">
                      <Star size={10} className="text-yellow-500" />
                      <span className="text-xs">{venue.rating}</span>
                    </div>
                  )}
                  {venue.distance && (
                    <span className="text-xs text-muted-foreground">{venue.distance}</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default VenueSuggestionDropdown;
