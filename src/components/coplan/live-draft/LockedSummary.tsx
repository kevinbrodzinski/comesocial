
import React from 'react';
import { Calendar, Clock, Users, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DraftStop } from '@/types/liveDraftTypes';

interface LockedSummaryProps {
  title: string;
  date: string;
  stops: DraftStop[];
  participantCount: number;
  isHost: boolean;
  onGoLive: () => void;
}

const LockedSummary = ({
  title,
  date,
  stops,
  participantCount,
  isHost,
  onGoLive
}: LockedSummaryProps) => {
  const totalDuration = stops.reduce((sum, stop) => sum + stop.duration, 0);
  const startTime = stops.length > 0 ? stops[0].time : '';
  
  return (
    <div className="p-4 space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Play size={20} />
            <span>Plan Ready to Launch</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-green-600" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-green-600" />
              <span>{startTime} • {Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-green-600" />
              <span>{participantCount} participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{stops.length} stops</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stops Summary */}
      <div className="space-y-3">
        <h3 className="font-semibold">Final Itinerary</h3>
        {stops.map((stop, index) => (
          <Card key={stop.id} className="bg-muted/20">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <h4 className="font-medium">{stop.venue}</h4>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <span>{stop.time}</span>
                    <span>{stop.duration}min</span>
                  </div>
                  {stop.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{stop.notes}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Go Live Button */}
      {isHost && (
        <Button
          onClick={onGoLive}
          className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
        >
          <Play size={20} className="mr-2" />
          Go Live
        </Button>
      )}

      {!isHost && (
        <div className="text-center text-muted-foreground">
          Waiting for host to launch the plan...
        </div>
      )}
    </div>
  );
};

export default LockedSummary;
