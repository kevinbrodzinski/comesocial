import React, { useState } from 'react';
import { Search, MapPin, Users, Star, Plus, Filter, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileVenueBrowserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVenueSelect?: (venue: any) => void;
}

const MobileVenueBrowserModal = ({ open, onOpenChange, onVenueSelect }: MobileVenueBrowserModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      features: ['Live Music', 'Craft Cocktails', 'Late Night'],
      priceRange: '$$'
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
      features: ['Outdoor Seating', 'Wine Selection', 'Happy Hour'],
      priceRange: '$$$'
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
      features: ['DJ Sets', 'Dance Floor', 'VIP Bottles'],
      priceRange: '$$$$'
    }
  ];

  const filterOptions = [
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'bar', label: 'Bar', icon: '🍸' },
    { id: 'club', label: 'Club', icon: '🎵' },
    { id: 'outdoor', label: 'Outdoor', icon: '🌳' },
    { id: 'live-music', label: 'Live Music', icon: '🎤' },
    { id: 'rooftop', label: 'Rooftop', icon: '🏙️' }
  ];

  const filteredVenues = suggestedVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.vibe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVenue = (venue: typeof suggestedVenues[0]) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
    
    toast({
      title: "Venue Added! ✨",
      description: `${venue.name} has been added to your plan`,
    });
    onOpenChange(false);
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  if (!isMobile) {
    // Use regular modal for desktop - keep existing functionality
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
                          onClick={() => handleAddVenue(venue)}
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
  }

  // Mobile-optimized bottom sheet design
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-full h-[90vh] max-h-[90vh] p-0 bg-background rounded-t-2xl border-t border-border fixed bottom-0 left-0 right-0 top-auto translate-y-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border rounded-t-2xl">
          <div className="flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 p-0"
            >
              <X size={20} />
            </Button>
            <h2 className="font-semibold text-lg">Add Venue</h2>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 w-10 p-0"
            >
              <Filter size={20} />
            </Button>
          </div>
          
          {/* Drag handle */}
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2"></div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search venues, vibes, or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-background border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(filter.id)}
                  className="h-10"
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Venue List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{venue.name}</h3>
                      <p className="text-sm text-muted-foreground">{venue.type}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddVenue(venue)}
                      className="ml-2 h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span>{venue.distance}</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{venue.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={12} className="mr-1" />
                      <span>{venue.crowdLevel}%</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {venue.priceRange}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
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
          
          {/* Bottom padding for safe area */}
          <div className="h-6"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileVenueBrowserModal;
