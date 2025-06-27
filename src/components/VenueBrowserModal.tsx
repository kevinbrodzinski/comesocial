
import React, { useState } from 'react';
import { Search, MapPin, Users, Star, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface VenueBrowserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVenueSelect?: (venue: any) => void;
}

const VenueBrowserModal = ({ open, onOpenChange, onVenueSelect }: VenueBrowserModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Mock venue data for suggestions
  const suggestedVenues = [
    {
      id: 5,
      name: 'Neon Lounge',
      type: 'Cocktail Bar',
      image: 'https://images.unsplash.com/photo-1546171753-97d7676cd5d8?w=400&h=200&fit=crop',
      distance: '0.3 mi',
      rating: 4.5,
      crowdLevel: 65,
      vibe: 'Trendy',
      features: ['Live Music', 'Craft Cocktails', 'Late Night']
    },
    {
      id: 6,
      name: 'Garden Terrace',
      type: 'Wine Bar',
      image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=200&fit=crop',
      distance: '0.7 mi',
      rating: 4.3,
      crowdLevel: 40,
      vibe: 'Relaxed',
      features: ['Outdoor Seating', 'Wine Selection', 'Happy Hour']
    },
    {
      id: 7,
      name: 'Electric Club',
      type: 'Nightclub',
      image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3fad2?w=400&h=200&fit=crop',
      distance: '1.1 mi',
      rating: 4.7,
      crowdLevel: 85,
      vibe: 'High Energy',
      features: ['DJ Sets', 'Dance Floor', 'VIP Bottles']
    }
  ];

  const filteredVenues = suggestedVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.vibe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToFavorites = (venue: typeof suggestedVenues[0]) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
    
    toast({
      title: "Added to Favorites! ⭐",
      description: `${venue.name} has been added to your favorites`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Pick a new favorite spot</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues, vibes, or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Venue List */}
          <div className="overflow-y-auto max-h-[60vh] space-y-3">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">{venue.type}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToFavorites(venue)}
                        className="flex-shrink-0"
                      >
                        <Plus size={16} className="mr-1" />
                        Add
                      </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        <span>{venue.distance}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{venue.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{venue.crowdLevel}%</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {venue.vibe}
                      </Badge>
                      {venue.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueBrowserModal;
