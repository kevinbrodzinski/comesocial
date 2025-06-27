
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AddStopCardProps {
  onAddStopClick: () => void;
  isLocked: boolean;
}

const AddStopCard = ({ onAddStopClick, isLocked }: AddStopCardProps) => {
  if (isLocked) return null;

  return (
    <Card 
      className="border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 cursor-pointer transition-colors"
      onClick={onAddStopClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
          <Plus size={20} />
          <span className="font-medium">Add Stop</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddStopCard;
