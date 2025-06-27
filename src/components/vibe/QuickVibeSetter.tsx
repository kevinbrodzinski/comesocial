
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import VibeBadge from './VibeBadge';
import VibeSelector from './VibeSelector';
import { useUserVibe } from '@/hooks/useUserVibe';
import { Moon } from 'lucide-react';

const QuickVibeSetter = () => {
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(false);
  const { currentVibe, setVibe, clearVibe, hasActiveVibe } = useUserVibe();

  const handleSetVibe = (vibe: any, customText?: string) => {
    setVibe(vibe, customText);
  };

  if (hasActiveVibe) {
    return (
      <>
        <div className="px-4 py-3 border-b border-border bg-card/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Your vibe:</span>
              <VibeBadge userVibe={currentVibe} size="md" showCustomText />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVibeModalOpen(true)}
              className="text-xs"
            >
              Change
            </Button>
          </div>
        </div>

        <VibeSelector
          isOpen={isVibeModalOpen}
          onClose={() => setIsVibeModalOpen(false)}
          onSetVibe={handleSetVibe}
          currentVibe={currentVibe?.vibe}
        />
      </>
    );
  }

  return (
    <>
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <Button
          variant="outline"
          onClick={() => setIsVibeModalOpen(true)}
          className="w-full justify-center text-sm font-medium border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Moon className="mr-2 h-4 w-4" />
          What's your vibe tonight?
        </Button>
      </div>

      <VibeSelector
        isOpen={isVibeModalOpen}
        onClose={() => setIsVibeModalOpen(false)}
        onSetVibe={handleSetVibe}
      />
    </>
  );
};

export default QuickVibeSetter;
