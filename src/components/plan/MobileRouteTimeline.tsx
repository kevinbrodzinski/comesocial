
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Clock, DollarSign, GripVertical, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileRouteTimelineProps {
  planStops: any[];
  onStopEdit: (stop: any) => void;
  onStopDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddAfter: (index: number) => void;
  onShowVenueBrowser: () => void;
}

const MobileRouteTimeline = ({
  planStops,
  onStopEdit,
  onStopDelete,
  onMoveUp,
  onMoveDown,
  onAddAfter,
  onShowVenueBrowser
}: MobileRouteTimelineProps) => {
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const toggleStopExpansion = (stopId: string) => {
    const newExpanded = new Set(expandedStops);
    if (newExpanded.has(stopId)) {
      newExpanded.delete(stopId);
    } else {
      newExpanded.add(stopId);
    }
    setExpandedStops(newExpanded);
  };

  return (
    <div className="w-full">
      <div className="space-y-4 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <MapPin size={14} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Route</h3>
          </div>
          <Badge variant="outline" className="bg-card">
            {planStops.length} stops
          </Badge>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {planStops.length > 0 && (
            <div className="relative">
              {/* Connecting line for mobile */}
              {planStops.length > 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border opacity-50"></div>
              )}
              
              {planStops.map((stop: any, index: number) => {
                const isExpanded = expandedStops.has(stop.id);
                
                return (
                  <div key={stop.id} className="relative" id={`stop-${stop.id}`}>
                    <Card className="bg-card border light-card-shadow">
                      <CardContent className="p-4">
                        {/* Stop Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold z-10 bg-background border-2 border-primary">
                              {index + 1}
                            </div>
                          </div>
                          
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => toggleStopExpansion(stop.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base mb-1 truncate">
                                  {stop.name}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{stop.estimatedTime}m</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign size={12} />
                                    <span>${stop.cost}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="space-y-3 animate-fade-in">
                            {stop.notes && (
                              <div className="bg-muted/50 rounded-lg p-3 border">
                                <p className="text-sm text-muted-foreground italic">
                                  "{stop.notes}"
                                </p>
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onMoveUp(index)}
                                  disabled={index === 0}
                                  className="h-8 px-2"
                                >
                                  <ChevronUp size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onMoveDown(index)}
                                  disabled={index === planStops.length - 1}
                                  className="h-8 px-2"
                                >
                                  <ChevronDown size={14} />
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onStopEdit(stop)}
                                  className="h-8 px-2"
                                >
                                  <Edit2 size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onStopDelete(index)}
                                  className="h-8 px-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Add After Button */}
                    <div className="flex justify-center my-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddAfter(index)}
                        className="h-8 w-8 p-0 rounded-full border-2 border-dashed border-muted-foreground hover:border-primary"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {planStops.length === 0 && (
            <Card className="border-2 border-dashed border-border">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">No stops yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add your first stop to start building your route
                </p>
                <Button 
                  onClick={onShowVenueBrowser}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Plus size={18} className="mr-2" />
                  Add First Stop
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      {planStops.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <Button
            onClick={onShowVenueBrowser}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus size={24} />
          </Button>
        </div>
      )}

      {/* Safe-area bottom padding */}
      <div className="h-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
};

export default MobileRouteTimeline;
