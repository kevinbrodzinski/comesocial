
import React, { useState } from 'react';
import { X, Plus, GripVertical, MapPin, Clock, DollarSign, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface PlanStop {
  id: string;
  name: string;
  address: string;
  estimatedTime: number;
  cost: number;
}

interface PlanStagingSheetProps {
  isOpen: boolean;
  isMinimized: boolean;
  stops: PlanStop[];
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onAddStop: () => void;
  onRemoveStop: (stopId: string) => void;
  onReorderStops: (startIndex: number, endIndex: number) => void;
  onFinalizePlan: (planName?: string) => void;
  planName: string;
  onPlanNameChange: (name: string) => void;
}

const PlanStagingSheet = ({
  isOpen,
  isMinimized,
  stops,
  onClose,
  onMinimize,
  onMaximize,
  onAddStop,
  onRemoveStop,
  onReorderStops,
  onFinalizePlan,
  planName,
  onPlanNameChange
}: PlanStagingSheetProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderStops(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleFinalize = () => {
    const finalPlanName = planName.trim() || `${stops[0]?.name} Night Out`;
    onFinalizePlan(finalPlanName);
  };

  const totalCost = stops.reduce((sum, stop) => sum + stop.cost, 0);
  const totalTime = stops.reduce((sum, stop) => sum + stop.estimatedTime, 0);

  if (!isOpen) return null;

  // Minimized state - small stub at bottom
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-40 pointer-events-auto">
        <Card 
          className="bg-primary text-primary-foreground cursor-pointer shadow-lg"
          onClick={onMaximize}
        >
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span className="font-medium">
                {planName || `Plan: ${stops.length} Stop${stops.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              ${totalCost}
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  // Full state - slide up sheet
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-auto">
      <div className="bg-background border-t border-border rounded-t-lg shadow-xl animate-slide-up max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center space-x-3 flex-1">
            {isEditingName ? (
              <Input
                value={planName}
                onChange={(e) => onPlanNameChange(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                  }
                }}
                placeholder="Enter plan name..."
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2">
                <h3 
                  className="text-lg font-semibold cursor-pointer hover:text-primary"
                  onClick={() => setIsEditingName(true)}
                >
                  {planName || 'New Plan'}
                </h3>
                <Edit2 
                  size={14} 
                  className="text-muted-foreground cursor-pointer hover:text-primary"
                  onClick={() => setIsEditingName(true)}
                />
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{Math.round(totalTime / 60)}h {totalTime % 60}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign size={14} />
                <span>${totalCost}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onMinimize}>
              Minimize
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Stops List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {stops.map((stop, index) => (
            <div
              key={stop.id}
              className={`flex items-center space-x-3 p-3 bg-card rounded-lg border transition-all ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {index + 1}
              </div>
              
              <GripVertical size={16} className="text-muted-foreground cursor-grab" />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{stop.name}</p>
                <p className="text-sm text-muted-foreground truncate">{stop.address}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{stop.estimatedTime}m</span>
                <span>${stop.cost}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveStop(stop.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <Button
            variant="outline"
            onClick={onAddStop}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Add Another Stop
          </Button>
          
          {stops.length > 0 && (
            <Button
              onClick={handleFinalize}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Complete Plan & Invite Friends →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanStagingSheet;
