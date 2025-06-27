
import React, { useState } from 'react';
import { MapPin, Clock, Users, Camera, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckInHistoryItem } from '../../hooks/useProfileData';

interface CheckInHistorySectionProps {
  history: CheckInHistoryItem[];
}

const CheckInHistorySection = ({ history }: CheckInHistorySectionProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getCrowdColor = (level: number) => {
    if (level >= 80) return 'text-red-500 bg-red-500/10';
    if (level >= 60) return 'text-orange-500 bg-orange-500/10';
    if (level >= 40) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  const getCrowdLabel = (level: number) => {
    if (level >= 80) return 'Packed';
    if (level >= 60) return 'Busy';
    if (level >= 40) return 'Moderate';
    return 'Chill';
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-6">
        Your nightlife journey • {history.length} check-ins
      </div>

      {history.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        
        return (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div 
                className="cursor-pointer"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{item.venue}</h4>
                    <div className="flex items-center text-sm text-muted-foreground space-x-3">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={`${getCrowdColor(item.crowdLevel)} border-0 text-xs`}>
                    <Users size={12} className="mr-1" />
                    {getCrowdLabel(item.crowdLevel)}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                  {item.memory && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MessageSquare size={14} className="mr-2" />
                        Memory
                      </div>
                      <p className="text-sm bg-muted/30 p-3 rounded-lg">{item.memory}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {!item.memory && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare size={14} className="mr-2" />
                        Add Memory
                      </Button>
                    )}
                    {!item.photo && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Camera size={14} className="mr-2" />
                        Add Photo
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin size={14} className="mr-2" />
                      Visit Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CheckInHistorySection;
