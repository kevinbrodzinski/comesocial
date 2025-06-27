
import React from 'react';
import { X, MapPin, Users, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any | null;
}

const PlanPreviewModal = ({ isOpen, onClose, plan }: PlanPreviewModalProps) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-background rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>

          {/* Plan Stats */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users size={14} className="mr-1" />
              <span>{plan.participants} people</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>Next: {plan.eta}</span>
            </div>
          </div>

          {/* Current Stop */}
          <Card className="mb-4 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Next Stop</p>
                  <p className="text-lg font-semibold text-primary">{plan.nextStop}</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  ETA {plan.eta}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Route Stops */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <MapPin size={16} className="mr-2" />
              Route
            </h3>
            <div className="space-y-2">
              {plan.stops.map((stop: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    stop === plan.nextStop ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                  }`}></div>
                  <span className={`text-sm ${
                    stop === plan.nextStop ? 'font-medium text-primary' : 'text-muted-foreground'
                  }`}>
                    {stop}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1">
              <Zap size={16} className="mr-2" />
              Request to Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPreviewModal;
