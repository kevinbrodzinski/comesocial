
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VibeModalHeaderProps {
  onClose: () => void;
}

const VibeModalHeader = ({ onClose }: VibeModalHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Set Your Vibe</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X size={16} />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Let friends know how you're feeling today
      </p>
    </>
  );
};

export default VibeModalHeader;
