
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';

interface Suggestion {
  name: string;
  description: string;
  venues: string[];
  duration: string;
}

interface PlanSuggestionsProps {
  suggestions: Suggestion[];
}

const PlanSuggestions = ({ suggestions }: PlanSuggestionsProps) => {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground flex items-center">
          <Heart size={18} className="mr-2 text-primary" />
          Suggested Plans
        </h2>
        <p className="text-xs text-muted-foreground">Based on what's buzzing tonight.</p>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="flex-none w-80 border-border/50 shadow-sm hover:shadow-md transition-all hover:border-primary/30 cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{suggestion.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-muted/50 ml-2 flex-shrink-0">
                    {suggestion.duration}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {suggestion.venues.join(' → ')}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full h-9 hover:bg-primary hover:text-primary-foreground transition-colors relative overflow-hidden group"
                  title="Lock it in and invite your crew."
                >
                  <span className="group-hover:opacity-0 transition-opacity">Use This Plan</span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    Lock it in and invite your crew.
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSuggestions;
