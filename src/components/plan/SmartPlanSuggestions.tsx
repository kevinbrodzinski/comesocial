
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SuggestedVenue {
  id: number;
  name: string;
  type: string;
  distance: string;
  rating: number;
  estimatedTime: string;
  why: string;
}

interface SmartPlanSuggestionsProps {
  baseVenue: {
    id: number;
    name: string;
    type: string;
  };
  onAddVenue: (venue: any) => void;
  onCreateFullPlan: (venues: any[]) => void;
}

const SmartPlanSuggestions = ({ baseVenue, onAddVenue, onCreateFullPlan }: SmartPlanSuggestionsProps) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]);
  const { toast } = useToast();

  // Smart suggestions based on venue type
  const getSuggestions = (): SuggestedVenue[] => {
    const baseType = baseVenue.type.toLowerCase();
    
    if (baseType.includes('bar') || baseType.includes('lounge')) {
      return [
        {
          id: 101,
          name: "Pulse Dance Club",
          type: "nightclub",
          distance: "0.3 mi",
          rating: 4.2,
          estimatedTime: "11:00 PM - 2:00 AM",
          why: "Perfect for dancing after drinks"
        },
        {
          id: 102,
          name: "Late Night Eats",
          type: "restaurant",
          distance: "0.5 mi",
          rating: 4.5,
          estimatedTime: "2:00 AM - 3:00 AM",
          why: "Great for post-club food"
        }
      ];
    }
    
    if (baseType.includes('restaurant')) {
      return [
        {
          id: 103,
          name: "Sky Lounge",
          type: "rooftop bar",
          distance: "0.2 mi",
          rating: 4.3,
          estimatedTime: "9:00 PM - 11:00 PM",
          why: "Perfect for after-dinner drinks"
        },
        {
          id: 104,
          name: "Jazz Corner",
          type: "live music",
          distance: "0.4 mi",
          rating: 4.1,
          estimatedTime: "9:30 PM - 11:30 PM",
          why: "Live music complements dinner"
        }
      ];
    }

    return [
      {
        id: 105,
        name: "Underground Lounge",
        type: "cocktail bar",
        distance: "0.6 mi",
        rating: 4.4,
        estimatedTime: "10:00 PM - 12:00 AM",
        why: "Great addition to any night out"
      }
    ];
  };

  const suggestions = getSuggestions();

  const toggleSuggestion = (id: number) => {
    setSelectedSuggestions(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleCreateFullPlan = () => {
    const selectedVenues = [
      baseVenue,
      ...suggestions.filter(s => selectedSuggestions.includes(s.id))
    ];
    
    onCreateFullPlan(selectedVenues);
    toast({
      title: "Smart Plan Created!",
      description: `Created plan with ${selectedVenues.length} stops`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Complete your night out</h3>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          AI Suggested
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Based on {baseVenue.name}, here are some great additions:
      </p>

      <div className="grid gap-3">
        {suggestions.map((venue) => (
          <Card 
            key={venue.id}
            className={`cursor-pointer transition-all ${
              selectedSuggestions.includes(venue.id) 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => toggleSuggestion(venue.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{venue.name}</h4>
                  <p className="text-xs text-muted-foreground">{venue.type}</p>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Star size={12} className="text-yellow-500" />
                  <span>{venue.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin size={12} />
                  <span>{venue.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{venue.estimatedTime}</span>
                </div>
              </div>
              
              <p className="text-xs text-primary mt-2 italic">
                {venue.why}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => selectedSuggestions.forEach(id => {
            const venue = suggestions.find(s => s.id === id);
            if (venue) onAddVenue(venue);
          })}
          disabled={selectedSuggestions.length === 0}
          className="flex-1"
        >
          Add Selected ({selectedSuggestions.length})
        </Button>
        <Button
          onClick={handleCreateFullPlan}
          disabled={selectedSuggestions.length === 0}
          className="flex-1"
        >
          Create Full Plan
        </Button>
      </div>
    </div>
  );
};

export default SmartPlanSuggestions;
