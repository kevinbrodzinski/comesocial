
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { venues, type Venue } from '@/data/venuesData';

interface VenueSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenue: (venue: Venue) => void;
}

const VenueSearchModal = ({ isOpen, onClose, onSelectVenue }: VenueSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter venues based on search query
  const filteredVenues = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return venues.filter(venue =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.vibe.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get suggested venues (top 3 by rating)
  const suggestedVenues = useMemo(() => {
    return venues
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, []);

  const handleVenueSelect = (venue: Venue) => {
    onSelectVenue(venue);
    onClose();
    setSearchQuery('');
  };

  const VenueCard = ({ venue }: { venue: Venue }) => (
    <Card 
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={() => handleVenueSelect(venue)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <MapPin size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm truncate">{venue.name}</h3>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{venue.rating}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{venue.type} • {venue.distance}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">{venue.vibe}</Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{venue.averageWait}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Venues</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search venues, bars, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="flex-1">
            {/* Search Results */}
            {searchQuery.trim() && (
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-sm">Search Results</h3>
                {filteredVenues.length > 0 ? (
                  <div className="space-y-2">
                    {filteredVenues.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No venues found for "{searchQuery}"
                  </p>
                )}
              </div>
            )}

            {/* Suggested Venues */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Suggested Venues</h3>
              <div className="space-y-2">
                {suggestedVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueSearchModal;
