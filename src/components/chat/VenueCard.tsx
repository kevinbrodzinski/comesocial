
import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNovaPlanActions } from '@/hooks/useNovaPlanActions';

interface Venue {
  name: string;
  type: string;
  distance: string;
  vibe: string;
  features: string[];
  crowdLevel: number;
}

interface VenueCardProps {
  venue: Venue;
}

const VenueCard = ({ venue }: VenueCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { triggerAddToPlan } = useNovaPlanActions();

  const getCrowdInfo = (level: number) => {
    if (level >= 80) return { label: 'Packed', color: 'text-red-400' };
    if (level >= 60) return { label: 'Moderate', color: 'text-yellow-400' };
    if (level >= 40) return { label: 'Chill', color: 'text-green-400' };
    return { label: 'Quiet', color: 'text-blue-400' };
  };

  const crowdInfo = getCrowdInfo(venue.crowdLevel);

  const getVibeColor = (vibe: string) => {
    switch (vibe.toLowerCase()) {
      case 'vibey': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'trending': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'underrated gem': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const handleAddToPlan = () => {
    triggerAddToPlan(venue, 'create_new');
  };

  return (
    <div className="mb-3 bg-secondary/30 border border-border/50 rounded-lg overflow-hidden">
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left hover:bg-secondary/20 transition-colors flex items-center justify-between"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground text-sm truncate">{venue.name}</h4>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{venue.type}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={12} />
              <span>{venue.distance}</span>
            </div>
            <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getVibeColor(venue.vibe)}`}>
              {venue.vibe}
            </div>
            <div className={`${crowdInfo.color} font-medium`}>
              {venue.crowdLevel}% • {crowdInfo.label}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-border/30">
          <div className="flex flex-wrap gap-2 mb-3">
            {venue.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
          
          {/* Crowd Level Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Crowd Level</span>
              <span className={crowdInfo.color}>{crowdInfo.label}</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  venue.crowdLevel >= 80 ? 'bg-red-500' :
                  venue.crowdLevel >= 60 ? 'bg-yellow-500' :
                  venue.crowdLevel >= 40 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${venue.crowdLevel}%` }}
              />
            </div>
          </div>

          {/* Add to Plan Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToPlan}
              className="flex-1 text-xs h-8 bg-primary/10 hover:bg-primary/20 border-primary/30"
            >
              <Plus size={12} className="mr-1" />
              Add to Plan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-xs h-8"
            >
              <Calendar size={12} className="mr-1" />
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueCard;
