
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FavoritesMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoritesMapModal = ({ open, onOpenChange }: FavoritesMapModalProps) => {
  const { toast } = useToast();

  const nearbyFavorites = [
    {
      id: 1,
      name: 'Pulse Nightclub',
      type: 'Nightclub',
      distance: '0.5 mi',
      crowdLevel: 90,
      vibe: 'High Energy',
      isActive: true
    },
    {
      id: 2,
      name: 'The Rooftop',
      type: 'Rooftop Bar',
      distance: '0.8 mi',
      crowdLevel: 75,
      vibe: 'Trendy',
      isActive: true
    },
    {
      id: 3,
      name: 'Underground',
      type: 'Speakeasy',
      distance: '1.2 mi',
      crowdLevel: 45,
      vibe: 'Intimate',
      isActive: false
    },
    {
      id: 4,
      name: 'Sky Bar',
      type: 'Cocktail Lounge',
      distance: '1.5 mi',
      crowdLevel: 60,
      vibe: 'Sophisticated',
      isActive: true
    }
  ];

  const getCrowdColor = (level: number) => {
    if (level > 80) return 'text-red-400';
    if (level > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const handleNavigateToVenue = (venue: typeof nearbyFavorites[0]) => {
    toast({
      title: "Navigating to venue",
      description: `Getting directions to ${venue.name}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0 bg-card border-border shadow-xl ring-1 ring-border">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl">Nearby Favorites</DialogTitle>
          <p className="text-sm text-muted-foreground">Your saved venues sorted by distance</p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            {nearbyFavorites.map((venue) => (
              <div
                key={venue.id}
                className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors bg-card/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{venue.name}</h3>
                    <p className="text-sm text-muted-foreground">{venue.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin size={12} className="mr-1" />
                      <span>{venue.distance}</span>
                    </div>
                    <div className={`text-sm font-medium ${getCrowdColor(venue.crowdLevel)}`}>
                      <Users size={12} className="inline mr-1" />
                      {venue.crowdLevel}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs border-border">
                      {venue.vibe}
                    </Badge>
                    {venue.isActive && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleNavigateToVenue(venue)}
                    className="flex items-center"
                  >
                    <Navigation size={14} className="mr-1" />
                    Go
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesMapModal;
