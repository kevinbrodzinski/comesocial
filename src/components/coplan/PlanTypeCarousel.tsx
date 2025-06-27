
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlanType {
  id: string;
  label: string;
  emoji: string;
}

interface PlanTypeCarouselProps {
  planTypes: PlanType[];
  selectedPlanType: string | null;
  onSelectPlanType: (id: string) => void;
}

const PlanTypeCarousel = ({ planTypes, selectedPlanType, onSelectPlanType }: PlanTypeCarouselProps) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-2 p-1">
        {planTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedPlanType === type.id ? "default" : "outline"}
            onClick={() => onSelectPlanType(type.id)}
            className="flex-shrink-0 h-12 px-4 flex items-center space-x-2 rounded-full"
          >
            <span className="text-base">{type.emoji}</span>
            <span className="text-sm whitespace-nowrap">{type.label}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PlanTypeCarousel;
