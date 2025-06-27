
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronUp, 
  ChevronDown,
  Edit3,
  Trash2
} from 'lucide-react';

interface StopActionButtonsProps {
  index: number;
  totalStops: number;
  showDeleteConfirm: boolean;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const StopActionButtons = ({
  index,
  totalStops,
  showDeleteConfirm,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete
}: StopActionButtonsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="ml-2 hover:bg-primary/10 hover:text-primary transition-all hover:scale-110"
      >
        <Edit3 size={16} />
      </Button>
      
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-8 h-8 p-0 hover:bg-primary/10 hover:border-primary disabled:opacity-50 border-border"
        >
          <ChevronUp size={14} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveDown}
          disabled={index === totalStops - 1}
          className="w-8 h-8 p-0 hover:bg-primary/10 hover:border-primary disabled:opacity-50 border-border"
        >
          <ChevronDown size={14} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className={`w-8 h-8 p-0 transition-all border-border ${
            showDeleteConfirm 
              ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100' 
              : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
          }`}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </>
  );
};

export default StopActionButtons;
