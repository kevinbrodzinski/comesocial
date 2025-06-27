
import React from 'react';
import { Minus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableStopItemProps {
  stop: string;
  index: number;
  onRemove: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
}

const DraggableStopItem = ({ 
  stop, 
  index, 
  onRemove, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: DraggableStopItemProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
    >
      <div className="flex items-center">
        <GripVertical size={16} className="mr-2 text-muted-foreground" />
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mr-3">
          {index + 1}
        </div>
        <span>{stop}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
      >
        <Minus size={16} />
      </Button>
    </div>
  );
};

export default DraggableStopItem;
