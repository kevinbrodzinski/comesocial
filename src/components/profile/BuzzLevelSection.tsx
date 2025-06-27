
import React from 'react';
import { TrendingUp, Users, MapPin, Clock, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BuzzLevel } from '../../hooks/useProfileData';

interface BuzzLevelSectionProps {
  buzzLevel: BuzzLevel;
}

const BuzzLevelSection = ({ buzzLevel }: BuzzLevelSectionProps) => {
  const getBuzzLevelTooltip = (score: number) => {
    if (score >= 80) return "You are the party.";
    if (score >= 60) return "Your name's on every list.";
    if (score >= 40) return "You know your way around.";
    if (score >= 20) return "Keeping it chill.";
    return "Time to get out there…";
  };

  const breakdownItems = [
    { label: 'Check-ins', value: buzzLevel.breakdown.checkIns, icon: MapPin, color: 'text-blue-500' },
    { label: 'Friends Pinged', value: buzzLevel.breakdown.friendsPinged, icon: Users, color: 'text-green-500' },
    { label: 'Time Spent', value: buzzLevel.breakdown.timeSpent, icon: Clock, color: 'text-purple-500' },
    { label: 'Engagements', value: buzzLevel.breakdown.engagements, icon: Heart, color: 'text-pink-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-primary mb-2">{buzzLevel.score}</div>
            <div className="text-lg text-muted-foreground">out of 100</div>
            <p className="text-sm text-muted-foreground mt-2 italic">
              "{getBuzzLevelTooltip(buzzLevel.score)}"
            </p>
          </div>

          <Progress value={buzzLevel.score} className="h-3 mb-4" />
          
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp size={16} className="text-green-500" />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              +{buzzLevel.weeklyChange} this week
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          {breakdownItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <IconComponent size={24} className={`${item.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Boost Your Buzz 🚀</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Check in at new venues for bonus points</li>
            <li>• Create and share plans with friends</li>
            <li>• Stay active on weekend nights</li>
            <li>• Upload photos to the feed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuzzLevelSection;
