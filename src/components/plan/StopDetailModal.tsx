
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, DollarSign, Calendar, Navigation, CheckCircle, AlertCircle, Shirt } from 'lucide-react';

interface StopDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: any;
  onNavigate?: () => void;
  onCheckIn?: () => void;
}

const StopDetailModal = ({ isOpen, onClose, stop, onNavigate, onCheckIn }: StopDetailModalProps) => {
  if (!stop) return null;

  const getTypeColor = (type: string) => {
    const colors = {
      'restaurant': 'bg-orange-100 text-orange-700 border-orange-200',
      'bar': 'bg-blue-100 text-blue-700 border-blue-200',
      'club': 'bg-purple-100 text-purple-700 border-purple-200',
      'lounge': 'bg-green-100 text-green-700 border-green-200',
      'cafe': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'rooftop': 'bg-indigo-100 text-indigo-700 border-indigo-200'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'current': return <MapPin size={16} className="text-primary animate-pulse" />;
      case 'upcoming': return <Clock size={16} className="text-muted-foreground" />;
      default: return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background border border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {getStatusIcon(stop.status)}
            {stop.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className={`text-xs px-3 py-1 ${getTypeColor(stop.type)}`}>
                {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
              </Badge>
              {stop.status && (
                <Badge 
                  variant={stop.status === 'current' ? 'default' : 'outline'}
                  className={`text-xs px-3 py-1 ${
                    stop.status === 'current' ? 'bg-primary text-primary-foreground' :
                    stop.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {stop.status.charAt(0).toUpperCase() + stop.status.slice(1)}
                </Badge>
              )}
            </div>

            {stop.address && (
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{stop.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timing & Cost Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Duration</p>
              </div>
              <p className="text-lg font-semibold">{stop.estimatedTime || 90} mins</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium">Cost</p>
              </div>
              <p className="text-lg font-semibold">${stop.cost || 25}</p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            {(stop.startTime || stop.endTime) && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Timing
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {stop.startTime && (
                    <div>
                      <p className="text-xs text-muted-foreground">Start</p>
                      <p className="text-sm font-medium">{stop.startTime}</p>
                    </div>
                  )}
                  {stop.endTime && (
                    <div>
                      <p className="text-xs text-muted-foreground">End</p>
                      <p className="text-sm font-medium">{stop.endTime}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(stop.maxCapacity || stop.bookingStatus) && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Capacity & Booking
                </h4>
                <div className="space-y-2">
                  {stop.maxCapacity && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Max Capacity</span>
                      <span className="text-sm font-medium">{stop.maxCapacity} people</span>
                    </div>
                  )}
                  {stop.bookingStatus && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Booking Status</span>
                      <Badge className={`text-xs px-2 py-1 ${getBookingStatusColor(stop.bookingStatus)}`}>
                        {stop.bookingStatus.charAt(0).toUpperCase() + stop.bookingStatus.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stop.dresscode && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shirt size={16} className="text-primary" />
                  Dress Code
                </h4>
                <p className="text-sm text-muted-foreground">{stop.dresscode}</p>
              </div>
            )}

            {(stop.distance || stop.eta) && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Navigation size={16} className="text-primary" />
                  Navigation
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {stop.distance && (
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-sm font-medium">{stop.distance}</p>
                    </div>
                  )}
                  {stop.eta && (
                    <div>
                      <p className="text-xs text-muted-foreground">ETA</p>
                      <p className="text-sm font-medium">{stop.eta}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stop.notes && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertCircle size={16} className="text-primary" />
                  Notes
                </h4>
                <p className="text-sm text-muted-foreground">{stop.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {stop.status === 'current' && onCheckIn && (
              <Button onClick={onCheckIn} className="flex-1" size="sm">
                <CheckCircle size={16} className="mr-2" />
                Check In
              </Button>
            )}
            {stop.status !== 'completed' && onNavigate && (
              <Button 
                onClick={onNavigate} 
                variant="outline" 
                className="flex-1" 
                size="sm"
              >
                <Navigation size={16} className="mr-2" />
                Navigate
              </Button>
            )}
            {!onCheckIn && !onNavigate && (
              <Button onClick={onClose} className="flex-1" size="sm">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StopDetailModal;
