
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyMapStateProps {
  onResetFilters: () => void;
}

const EmptyMapState = ({ onResetFilters }: EmptyMapStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center p-8 bg-card/90 backdrop-blur border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-2">No venues found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Try widening your distance or changing your vibe.
        </p>
        <Button onClick={onResetFilters} variant="outline">
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default EmptyMapState;
