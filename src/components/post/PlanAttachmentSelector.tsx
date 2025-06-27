
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Plan {
  id: number;
  title: string;
  date: string;
  stops: number;
}

interface PlanAttachmentSelectorProps {
  selectedPlan: Plan | null;
  onPlanSelect: (plan: Plan | null) => void;
  availablePlans: Plan[];
  onCreatePlan: () => void;
}

const PlanAttachmentSelector = ({ 
  selectedPlan, 
  onPlanSelect, 
  availablePlans,
  onCreatePlan 
}: PlanAttachmentSelectorProps) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Attach Plan (Optional)</Label>
      
      {selectedPlan ? (
        <div className="border border-border rounded-md p-3 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-primary" />
              <div>
                <p className="text-sm font-medium">{selectedPlan.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPlan.date} • {selectedPlan.stops} stops
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onPlanSelect(null)}
              className="text-xs"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {availablePlans.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground mb-2">Recent Plans:</p>
              {availablePlans.slice(0, 3).map((plan) => (
                <Button
                  key={plan.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPlanSelect(plan)}
                  className="w-full justify-start h-auto p-2"
                >
                  <Calendar size={14} className="mr-2" />
                  <div className="text-left">
                    <p className="text-xs font-medium">{plan.title}</p>
                    <p className="text-xs text-muted-foreground">{plan.date}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCreatePlan}
            className="w-full justify-center"
          >
            <Plus size={14} className="mr-1" />
            Create New Plan
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlanAttachmentSelector;
