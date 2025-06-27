
import React from 'react';
import { Vibe } from '@/types/vibeTypes';

interface VibeTabContentProps {
  vibes: Vibe[];
  selectedVibe: Vibe | null;
  onVibeSelect: (vibe: Vibe) => void;
}

const VibeTabContent = ({ vibes, selectedVibe, onVibeSelect }: VibeTabContentProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 mb-6">
      {vibes.map((vibe) => (
        <button
          key={vibe.id}
          onClick={() => onVibeSelect(vibe)}
          className={`
            flex items-center p-3 rounded-lg border-2 transition-all text-left
            ${selectedVibe?.id === vibe.id 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/30 hover:bg-accent/50'
            }
          `}
        >
          <span className="text-2xl mr-3">{vibe.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-sm">{vibe.label}</div>
            <div className="text-xs text-muted-foreground">{vibe.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default VibeTabContent;
