
import React from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanReviewStepProps {
  planData: any;
}

const PlanReviewStep = ({ planData }: PlanReviewStepProps) => {
  const totalCost = planData.stops.reduce((sum, stop) => sum + (stop.cost || 0), 0);
  const totalDuration = planData.stops.reduce((sum, stop) => sum + (stop.estimatedTime || 0), 0);

  return (
    <div className="space-y-4 animate-slide-in-right">
      <h3 className="text-lg font-semibold">Review Your Plan</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {planData.name}
            <Badge variant="secondary">Ready to go!</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-sm">{planData.date} at {planData.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-sm">{planData.meetupLocation || 'No meetup location'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <span className="text-sm">{planData.invitedFriends.length + 1} attending</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-sm">~{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
            </div>
          </div>

          {planData.notes && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">{planData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route ({planData.stops.length} stops)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {planData.stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{stop.name}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{stop.type}</span>
                    <span>{stop.estimatedTime}m</span>
                    <span>${stop.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Estimated total per person:</span>
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span className="font-semibold">${totalCost}</span>
            </div>
          </div>
          {planData.splitPayment && (
            <p className="text-sm text-muted-foreground mt-2">
              ✓ Payment splitting is enabled
            </p>
          )}
        </CardContent>
      </Card>

      {planData.invitedFriends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invited Friends ({planData.invitedFriends.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {planData.invitedFriends.map((friend) => (
                <Badge key={friend.id} variant="outline">
                  {friend.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanReviewStep;
