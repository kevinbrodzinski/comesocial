
import React from 'react';
import { Navigation, X, AlertCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SmartAlertProps {
  alert: {
    id: number;
    message: string;
    action: string;
    type: 'navigation' | 'checkin' | 'timing';
  };
  onDismiss: () => void;
  onAction: () => void;
}

const SmartAlert = ({ alert, onDismiss, onAction }: SmartAlertProps) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'navigation': return <Navigation size={16} className="text-blue-500" />;
      case 'checkin': return <MapPin size={16} className="text-green-500" />;
      case 'timing': return <AlertCircle size={16} className="text-orange-500" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case 'navigation': return 'border-blue-500/30 bg-blue-500/5';
      case 'checkin': return 'border-green-500/30 bg-green-500/5';
      case 'timing': return 'border-orange-500/30 bg-orange-500/5';
    }
  };

  return (
    <Card className={`mx-4 mb-2 ${getAlertColor()} animate-slide-in-bottom`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAlertIcon()}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onAction}
              className="h-7 text-xs"
            >
              {alert.action}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="h-7 w-7 p-0"
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartAlert;
