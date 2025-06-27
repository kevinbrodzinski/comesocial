
import React from 'react';
import { Button } from '@/components/ui/button';

interface VibeActionButtonsProps {
  hasSelectedVibe: boolean;
  onClearVibe: () => void;
  onSetVibe: () => void;
}

const VibeActionButtons = ({ hasSelectedVibe, onClearVibe, onSetVibe }: VibeActionButtonsProps) => {
  return (
    <div className="flex space-x-3">
      <Button
        variant="outline"
        onClick={onClearVibe}
        className="flex-1"
      >
        Clear Vibe
      </Button>
      <Button
        onClick={onSetVibe}
        disabled={!hasSelectedVibe}
        className="flex-1"
      >
        Set Vibe
      </Button>
    </div>
  );
};

export default VibeActionButtons;
