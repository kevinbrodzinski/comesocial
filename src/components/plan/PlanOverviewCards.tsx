
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Users } from 'lucide-react';

interface PlanOverviewCardsProps {
  stopsCount: number;
  totalTime: number;
  totalCost: number;
  attendees: number;
}

const PlanOverviewCards = ({ stopsCount, totalTime, totalCost, attendees }: PlanOverviewCardsProps) => {
  return (
    <Card className="light-card-shadow border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin size={18} className="text-primary" />
          </div>
          Plan Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Stops</p>
                <p className="text-2xl font-bold text-blue-600">{stopsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Clock size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Duration</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(totalTime / 60)}h {totalTime % 60}m</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <DollarSign size={18} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Est. Cost</p>
                <p className="text-2xl font-bold text-yellow-600">${totalCost}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Attendees</p>
                <p className="text-2xl font-bold text-purple-600">{attendees}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanOverviewCards;
