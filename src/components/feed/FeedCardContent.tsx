
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FeedCardSocialIntelligence from './FeedCardSocialIntelligence';

interface FeedCardContentProps {
  venue: string;
  type: string;
  vibe: string;
  distance: string;
  caption: string;
  friendsAtVenue: any[];
  friendsHeadingHere: any[];
  venueMomentum: any;
  onVenueClick: () => void;
  onTagClick: (tag: string) => void;
}

const FeedCardContent = ({
  venue,
  type,
  vibe,
  distance,
  caption,
  friendsAtVenue,
  friendsHeadingHere,
  venueMomentum,
  onVenueClick,
  onTagClick
}: FeedCardContentProps) => {
  return (
    <div className="mb-3">
      <h2 
        className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={(e) => {
          e.stopPropagation();
          onVenueClick();
        }}
      >
        {venue}
      </h2>
      <div className="flex items-center space-x-3 mt-1">
        <Badge 
          variant="outline" 
          className="bg-primary/5 text-primary border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onTagClick(type);
          }}
        >
          {type}
        </Badge>
        <Badge 
          variant="outline" 
          className="text-xs cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onTagClick(vibe);
          }}
        >
          {vibe}
        </Badge>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin size={10} className="mr-1" />
          {distance}
        </div>
      </div>

      {/* Social Intelligence Section */}
      <FeedCardSocialIntelligence
        friendsAtVenue={friendsAtVenue}
        friendsHeadingHere={friendsHeadingHere}
        venueMomentum={venueMomentum}
      />

      <p className="text-sm text-foreground mb-3 leading-relaxed">
        {caption}
      </p>
    </div>
  );
};

export default FeedCardContent;
