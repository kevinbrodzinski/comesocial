
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DraftEmptyHintProps {
  onAddStop: () => void;
  showReorderTip: boolean;
}

const DraftEmptyHint = ({ onAddStop, showReorderTip }: DraftEmptyHintProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {/* Dashed Add Stop Card */}
      <Card 
        className="border-2 border-dashed border-primary/30 bg-primary/5 cursor-pointer hover:border-primary/50 transition-colors w-full max-w-sm"
        onClick={onAddStop}
      >
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus size={24} className="text-primary" />
            </div>
            <span className="font-medium text-primary">Add Stop</span>
            <p className="text-sm text-muted-foreground">
              Start building your plan together
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reorder Tip */}
      <div className={cn(
        "text-sm text-muted-foreground text-center transition-opacity duration-300",
        showReorderTip ? "opacity-100" : "opacity-0"
      )}>
        Drag to reorder stops
      </div>
    </div>
  );
};

export default DraftEmptyHint;
