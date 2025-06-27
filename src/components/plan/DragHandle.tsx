
import React from 'react';
import { GripVertical } from 'lucide-react';

interface DragHandleProps {
  index: number;
  isDragging?: boolean;
}

const DragHandle = ({ index, isDragging = false }: DragHandleProps) => {
  return (
    <div className="flex flex-col items-center mt-1">
      <GripVertical 
        size={18} 
        className="text-muted-foreground cursor-grab active:cursor-grabbing hover:text-primary transition-colors" 
      />
      <div className="mt-3 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm light-card-shadow">
        {index + 1}
      </div>
    </div>
  );
};

export default DragHandle;
