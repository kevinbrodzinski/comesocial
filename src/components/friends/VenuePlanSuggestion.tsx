
import React from 'react';
import { MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VenuePlanSuggestionProps {
  venue: string;
  friendsAtVenue: any[];
  onJoinPlan: () => void;
  onCreatePlan: () => void;
  crowdLevel?: number;
  estimatedTime?: string;
}

const VenuePlanSuggestion = ({
  venue,
  friendsAtVenue,
  onJoinPlan,
  onCreatePlan,
  crowdLevel = 75,
  estimatedTime = "Good time to visit"
}: VenuePlanSuggestionProps) => {
  const getCrowdLabel = (level: number) => {
    if (level > 80) return 'Packed';
    if (level > 60) return 'Buzzing';
    return 'Chill';
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-primary" />
            <h4 className="font-semibold">{venue}</h4>
          </div>
          <Badge variant="outline" className="text-xs">
            {getCrowdLabel(crowdLevel)}
          </Badge>
        </div>

        <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users size={12} />
            <span>{friendsAtVenue.length} friends here</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{estimatedTime}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onJoinPlan} className="flex-1">
            Join Friends
          </Button>
          <Button size="sm" onClick={onCreatePlan} className="flex-1">
            Create Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenuePlanSuggestion;
