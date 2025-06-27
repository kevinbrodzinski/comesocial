
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';

interface MobilePlanOverviewCardsProps {
  stopsCount: number;
  totalTime: number;
  totalCost: number;
  attendees: number;
  planStops?: any[];
}

const MobilePlanOverviewCards = ({ 
  stopsCount, 
  totalTime, 
  totalCost, 
  attendees,
  planStops = []
}: MobilePlanOverviewCardsProps) => {
  // Calculate confirmed bookings
  const confirmedBookings = planStops.filter(stop => stop.bookingStatus === 'confirmed').length;
  
  // Get earliest start time
  const startTimes = planStops.filter(stop => stop.startTime).map(stop => stop.startTime);
  const earliestStart = startTimes.length > 0 ? Math.min(...startTimes.map(time => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  })) : null;
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const overviewItems = [
    {
      icon: MapPin,
      label: 'Stops',
      value: stopsCount.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      icon: Clock,
      label: earliestStart ? 'Starts' : 'Duration',
      value: earliestStart ? formatTime(earliestStart) : `${Math.round(totalTime / 60)}h ${totalTime % 60}m`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100'
    },
    {
      icon: DollarSign,
      label: 'Est. Cost',
      value: `$${totalCost}`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100'
    },
    {
      icon: confirmedBookings > 0 ? CheckCircle : Users,
      label: confirmedBookings > 0 ? 'Confirmed' : 'Attendees',
      value: confirmedBookings > 0 ? `${confirmedBookings}/${stopsCount}` : attendees.toString(),
      color: confirmedBookings > 0 ? 'text-green-600' : 'text-purple-600',
      bgColor: confirmedBookings > 0 ? 'bg-green-50' : 'bg-purple-50',
      borderColor: confirmedBookings > 0 ? 'border-green-100' : 'border-purple-100'
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {overviewItems.map((item, index) => (
          <Card key={index} className={`${item.bgColor} ${item.borderColor} border`}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-white/50 flex items-center justify-center`}>
                  <item.icon size={16} className={item.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    {item.label}
                  </p>
                  <p className={`text-lg font-bold ${item.color} truncate`}>
                    {item.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MobilePlanOverviewCards;
