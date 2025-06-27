
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getStopTypeColor, getStopTypeAccent } from '@/utils/venueTypeUtils';
import DragHandle from './DragHandle';
import StopActionButtons from './StopActionButtons';
import StopMetrics from './StopMetrics';
import AddAfterButton from './AddAfterButton';

interface PlanStopEditorProps {
  stop: any;
  index: number;
  totalStops: number;
  onEdit: (stop: any) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddAfter: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isDragging?: boolean;
}

const PlanStopEditor = ({
  stop,
  index,
  totalStops,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddAfter,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false
}: PlanStopEditorProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(index);
      toast({
        title: "Stop removed",
        description: `${stop.name} has been removed from your plan`,
      });
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const colors = getStopTypeColor(stop.type);
  const accentColor = getStopTypeAccent(stop.type);

  return (
    <div className="relative mb-6">
      <Card 
        className={`transition-all duration-300 cursor-move border-l-4 ${accentColor} ${
          isDragging ? 'opacity-50 rotate-2 scale-105 ring-2 ring-primary/50' : 'light-card-shadow'
        } ${
          isHovered && !isDragging ? 'light-card-shadow-hover scale-[1.02] ring-1 ring-primary/20' : ''
        } bg-card border`}
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <DragHandle index={index} isDragging={isDragging} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-xl mb-2 text-foreground">{stop.name}</h4>
                  <Badge className={`text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {stop.type || 'Venue'}
                  </Badge>
                </div>
                
                <StopActionButtons
                  index={index}
                  totalStops={totalStops}
                  showDeleteConfirm={showDeleteConfirm}
                  onEdit={() => onEdit(stop)}
                  onMoveUp={() => onMoveUp(index)}
                  onMoveDown={() => onMoveDown(index)}
                  onDelete={handleDelete}
                />
              </div>

              <StopMetrics 
                estimatedTime={stop.estimatedTime}
                cost={stop.cost}
              />

              {stop.notes && (
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <p className="text-sm text-muted-foreground italic">
                    "{stop.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                Click delete again to confirm removal
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddAfterButton onAddAfter={() => onAddAfter(index)} />
    </div>
  );
};

export default PlanStopEditor;
