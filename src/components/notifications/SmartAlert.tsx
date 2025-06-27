
import React from 'react';
import { Clock, Users, TrendingUp, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SmartAlertProps {
  alert: {
    id: string;
    type: 'timing' | 'crowd' | 'friend-activity' | 'venue-recommendation';
    title: string;
    message: string;
    venue?: string;
    urgency: 'low' | 'medium' | 'high';
    actionLabel?: string;
    crowdLevel?: number;
    friendsCount?: number;
  };
  onAction: () => void;
  onDismiss: () => void;
}

const SmartAlert = ({ alert, onAction, onDismiss }: SmartAlertProps) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'timing': return <Clock size={16} className="text-blue-500" />;
      case 'crowd': return <Users size={16} className="text-orange-500" />;
      case 'friend-activity': return <MapPin size={16} className="text-green-500" />;
      case 'venue-recommendation': return <TrendingUp size={16} className="text-purple-500" />;
    }
  };

  const getUrgencyColor = () => {
    switch (alert.urgency) {
      case 'high': return 'border-red-400/50 bg-red-50/80';
      case 'medium': return 'border-orange-400/50 bg-orange-50/80';
      case 'low': return 'border-blue-400/50 bg-blue-50/80';
    }
  };

  const getActionButtonStyle = () => {
    switch (alert.urgency) {
      case 'high': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'medium': return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'low': return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Card className={`${getUrgencyColor()} border animate-slide-in-top`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3 flex-1">
            {getAlertIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {alert.urgency}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
              
              {alert.venue && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <MapPin size={12} />
                  <span className="font-medium">{alert.venue}</span>
                  {alert.crowdLevel && (
                    <>
                      <span>•</span>
                      <span>{alert.crowdLevel}% full</span>
                    </>
                  )}
                  {alert.friendsCount && (
                    <>
                      <span>•</span>
                      <span>{alert.friendsCount} friends</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {alert.actionLabel && (
              <Button
                size="sm"
                onClick={onAction}
                className={`${getActionButtonStyle()} hover:scale-105 transition-all`}
              >
                {alert.actionLabel}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartAlert;
