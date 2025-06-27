
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import PlanStopEditor from './PlanStopEditor';

interface RouteTimelineProps {
  planStops: any[];
  draggedIndex: number | null;
  onStopEdit: (stop: any) => void;
  onStopDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddAfter: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onShowVenueBrowser: () => void;
}

const RouteTimeline = ({
  planStops,
  draggedIndex,
  onStopEdit,
  onStopDelete,
  onMoveUp,
  onMoveDown,
  onAddAfter,
  onDragStart,
  onDragOver,
  onDrop,
  onShowVenueBrowser
}: RouteTimelineProps) => {
  return (
    <Card className="light-card-shadow border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
            <MapPin size={18} className="text-white" />
          </div>
          Route Builder
        </CardTitle>
        <p className="text-muted-foreground">
          Drag stops to reorder, click to edit details, or use arrows to move stops up/down
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Timeline Connector */}
        <div className="relative">
          {planStops.length > 1 && (
            <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-primary opacity-20 z-0"></div>
          )}
          
          {planStops.map((stop: any, index: number) => (
            <div key={stop.id} className="relative z-10">
              <PlanStopEditor
                stop={stop}
                index={index}
                totalStops={planStops.length}
                onEdit={onStopEdit}
                onDelete={onStopDelete}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onAddAfter={onAddAfter}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                isDragging={draggedIndex === index}
              />
            </div>
          ))}
        </div>
        
        {planStops.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin size={32} className="text-primary" />
            </div>
            <p className="text-muted-foreground mb-6 text-lg">No stops in this plan yet</p>
            <Button 
              onClick={onShowVenueBrowser}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white light-card-shadow hover:light-card-shadow-hover transition-all hover:scale-105"
              size="lg"
            >
              <Plus size={20} className="mr-2" />
              Add First Stop
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTimeline;
