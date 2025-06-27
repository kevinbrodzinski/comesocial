
import React from 'react';
import { Plus, GripVertical, X, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface RouteBuilderStepProps {
  planData: any;
  onShowVenueBrowser: () => void;
  onShowCustomVenueModal: () => void;
  onStopRemove: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

const RouteBuilderStep = ({
  planData,
  onShowVenueBrowser,
  onShowCustomVenueModal,
  onStopRemove,
  onDragStart,
  onDragOver,
  onDrop
}: RouteBuilderStepProps) => {
  return (
    <div className="space-y-4 animate-slide-in-right">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Build Your Route</h3>
        <Badge variant="secondary">
          {planData.stops.length} stop{planData.stops.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {planData.stops.map((stop, index) => (
          <Card 
            key={stop.id}
            className="hover:shadow-md transition-shadow cursor-move"
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{stop.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStopRemove(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{stop.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{stop.estimatedTime}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} />
                      <span>${stop.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onShowVenueBrowser}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Browse Venues
        </Button>
        <Button
          variant="outline"
          onClick={onShowCustomVenueModal}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Custom
        </Button>
      </div>

      {planData.stops.length === 0 && (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
          <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-4">No stops added yet</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={onShowVenueBrowser}>
              <Plus size={16} className="mr-2" />
              Add First Stop
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteBuilderStep;
