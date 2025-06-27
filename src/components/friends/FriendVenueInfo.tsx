
import React from 'react';
import { MapPin, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FriendVenueInfoProps {
  currentFriend: any;
  onViewVenueOnMap: () => void;
}

const FriendVenueInfo = ({ currentFriend, onViewVenueOnMap }: FriendVenueInfoProps) => {
  // Mock venue data
  const crowdLevel = 75;
  const venueDistance = '1.2 mi away';
  const checkedInTime = 'Arrived 20 min ago';
  const lastUpdate = 'Last updated 3 min ago';
  const venueTags = ['Rooftop', 'Chill', 'Cocktails'];

  const getCrowdLabel = (level: number) => {
    if (level > 80) return 'Packed';
    if (level > 60) return 'Moderate';
    return 'Chill';
  };

  const getCrowdColor = (level: number) => {
    if (level > 80) return 'text-red-400';
    if (level > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-primary" />
            <h3 
              className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
              onClick={onViewVenueOnMap}
            >
              Currently at {currentFriend.location || 'Sky Lounge'}
            </h3>
          </div>
          <span className={`text-sm font-medium ${getCrowdColor(crowdLevel)}`}>
            {getCrowdLabel(crowdLevel)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users size={12} />
            <span>{crowdLevel}% full</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin size={12} />
            <span>{venueDistance}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{checkedInTime}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {lastUpdate}
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-1">
          {venueTags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-background/50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendVenueInfo;
