
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddAfterButtonProps {
  onAddAfter: () => void;
}

const AddAfterButton = ({ onAddAfter }: AddAfterButtonProps) => {
  return (
    <div className="flex justify-center -my-3 relative z-10">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddAfter}
        className="h-10 w-10 rounded-full bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all hover:scale-110 light-card-shadow"
      >
        <Plus size={16} className="text-primary" />
      </Button>
    </div>
  );
};

export default AddAfterButton;
