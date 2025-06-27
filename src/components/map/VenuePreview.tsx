
import React from 'react';
import { Users, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Venue } from '../../data/venuesData';

interface VenuePreviewProps {
  venue: Venue;
  onClose: () => void;
  onViewDetails: () => void;
}

const VenuePreview = ({ venue, onClose, onViewDetails }: VenuePreviewProps) => {
  const { toast } = useToast();

  const handleStartPlan = () => {
    toast({
      title: "Plan Started",
      description: `Starting plan at ${venue.name}`,
    });
    onClose();
  };

  return (
    <div className="absolute bottom-4 left-2 right-2 z-30 animate-slide-up">
      <Card className="bg-card/95 backdrop-blur border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{venue.name}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{venue.type} • {venue.vibe}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="ml-2 flex-shrink-0"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm line-clamp-2">{venue.description}</p>
          
          {/* Stats Row - Mobile Optimized */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Users size={14} className="mr-1 text-muted-foreground" />
                <span>{venue.crowdLevel}%</span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="mr-1 text-yellow-400 fill-current" />
                <span>{venue.rating}</span>
              </div>
              <span className="text-muted-foreground">{venue.distance}</span>
            </div>
          </div>
          
          {/* Action Buttons - Mobile Optimized */}
          <div className="flex space-x-2">
            <Button 
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleStartPlan}
            >
              Start Plan Here
            </Button>
            <Button 
              size="sm"
              className="flex-1"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Tap again for full details
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VenuePreview;
