
import React from 'react';
import { Clock, TrendingUp, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TimingSuggestionProps {
  venue: string;
  currentCrowd: number;
  peakTime: string;
  recommendation: 'go-now' | 'wait' | 'perfect-time';
  friendsPresent: number;
  onAction: () => void;
}

const TimingSuggestion = ({
  venue,
  currentCrowd,
  peakTime,
  recommendation,
  friendsPresent,
  onAction
}: TimingSuggestionProps) => {
  const getRecommendationData = () => {
    switch (recommendation) {
      case 'go-now':
        return {
          title: '🚀 Perfect Time to Go!',
          message: `${venue} is at the ideal buzz level`,
          color: 'bg-green-50 border-green-200',
          buttonText: 'Head out now',
          buttonStyle: 'bg-green-600 hover:bg-green-700'
        };
      case 'wait':
        return {
          title: '⏳ Peak Coming Soon',
          message: `Wait for ${peakTime} for optimal vibes`,
          color: 'bg-blue-50 border-blue-200',
          buttonText: 'Set reminder',
          buttonStyle: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'perfect-time':
        return {
          title: '🎯 Peak Hours Active',
          message: `${venue} is perfectly buzzing right now`,
          color: 'bg-orange-50 border-orange-200',
          buttonText: 'Join the scene',
          buttonStyle: 'bg-orange-600 hover:bg-orange-700'
        };
    }
  };

  const data = getRecommendationData();

  return (
    <Card className={`${data.color} animate-fade-in`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3 flex-1">
            <Clock size={20} className="text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{data.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{data.message}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin size={12} />
                  <span className="font-medium">{venue}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={12} />
                  <span>{currentCrowd}% full</span>
                </div>
                {friendsPresent > 0 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {friendsPresent} friends there
                  </Badge>
                )}
              </div>

              {recommendation === 'wait' && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-2">
                  <TrendingUp size={12} />
                  <span>Peak expected: {peakTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={onAction}
            className={`${data.buttonStyle} text-white hover:scale-105 transition-all`}
          >
            {data.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimingSuggestion;
