
import React from 'react';
import { ChevronDown, ChevronUp, Clock, DollarSign, Users, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stop } from '@/data/plansData';

interface ExpandableStopCardProps {
  stop: Stop;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandableStopCard = ({ stop, index, isExpanded, onToggle }: ExpandableStopCardProps) => {
  const getTypeColor = (type: string) => {
    const colors = {
      'restaurant': 'bg-orange-100 text-orange-700 border-orange-200',
      'bar': 'bg-blue-100 text-blue-700 border-blue-200',
      'club': 'bg-purple-100 text-purple-700 border-purple-200',
      'lounge': 'bg-green-100 text-green-700 border-green-200',
      'cafe': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'rooftop': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'live music': 'bg-pink-100 text-pink-700 border-pink-200',
      'sports bar': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getBookingStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'none': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="border border-border/30 rounded-lg bg-card/50 overflow-hidden">
      {/* Collapsed View - Always Visible */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-base leading-tight mb-2">{stop.name}</h4>
              <div className="flex items-center space-x-3 mb-3">
                <Badge className={`text-xs px-2 py-1 ${getTypeColor(stop.type)}`}>
                  {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={14} className="mr-1" />
                  <span>{stop.estimatedTime}m</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign size={14} className="mr-1" />
                  <span>${stop.cost}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="flex-shrink-0 ml-2"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 border-t border-border/20 bg-muted/10">
          <div className="pt-4 space-y-4">
            {/* Timing Details */}
            {(stop.startTime || stop.endTime) && (
              <div className="grid grid-cols-2 gap-3">
                {stop.startTime && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Start Time</div>
                      <div className="text-sm font-medium">{stop.startTime}</div>
                    </div>
                  </div>
                )}
                {stop.endTime && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">End Time</div>
                      <div className="text-sm font-medium">{stop.endTime}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Address */}
            {stop.address && (
              <div className="flex items-start space-x-2">
                <MapPin size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div className="text-sm font-medium">{stop.address}</div>
                </div>
              </div>
            )}

            {/* Capacity and Booking */}
            <div className="grid grid-cols-2 gap-3">
              {stop.maxCapacity && (
                <div className="flex items-center space-x-2">
                  <Users size={14} className="text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Capacity</div>
                    <div className="text-sm font-medium">{stop.maxCapacity} people</div>
                  </div>
                </div>
              )}
              {stop.bookingStatus && (
                <div className="flex items-center space-x-2">
                  <AlertCircle size={14} className="text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Booking</div>
                    <Badge className={`text-xs px-2 py-1 ${getBookingStatusColor(stop.bookingStatus)}`}>
                      {stop.bookingStatus.charAt(0).toUpperCase() + stop.bookingStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Dress Code */}
            {stop.dresscode && (
              <div className="flex items-start space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-muted-foreground/30 flex-shrink-0 mt-0.5"></div>
                <div>
                  <div className="text-xs text-muted-foreground">Dress Code</div>
                  <div className="text-sm font-medium">{stop.dresscode}</div>
                </div>
              </div>
            )}

            {/* Notes */}
            {stop.notes && (
              <div className="flex items-start space-x-2">
                <AlertCircle size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Notes</div>
                  <div className="text-sm font-medium text-muted-foreground">{stop.notes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableStopCard;
