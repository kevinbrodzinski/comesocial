import React from 'react';
import { MapPin, Star, Clock, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VenueDetailCardProps {
  venue: {
    id: string;
    name: string;
    address: string;
    rating?: number;
    priceLevel?: number;
    photos?: string[];
    estimatedTime?: number;
    cost?: number;
  };
  onAddToPlan: () => void;
  onClose: () => void;
}

const VenueDetailCard = ({ venue, onAddToPlan, onClose }: VenueDetailCardProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-auto">
      <div className="bg-background border-t border-border rounded-t-lg shadow-xl animate-slide-up">
        <Card className="border-0 rounded-t-lg">
          <CardContent className="p-4 space-y-4">
            {/* Venue Image Placeholder */}
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
              <MapPin size={24} className="text-muted-foreground" />
            </div>

            {/* Venue Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">{venue.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{venue.address}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4">
                {venue.rating && (
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm">{venue.rating}</span>
                  </div>
                )}
                
                {venue.priceLevel && (
                  <div className="flex items-center space-x-1">
                    <DollarSign size={14} className="text-muted-foreground" />
                    <span className="text-sm">{'$'.repeat(venue.priceLevel)}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-sm">{venue.estimatedTime || 90}m</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Open Now</Badge>
                <Badge variant="outline">Popular</Badge>
              </div>
            </div>

            {/* Add to Plan Button */}
            <Button 
              onClick={onAddToPlan}
              className="w-full"
              size="lg"
            >
              <Plus size={16} className="mr-2" />
              Add to Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueDetailCard;
