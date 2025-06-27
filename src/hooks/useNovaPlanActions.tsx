
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NovaVenue {
  name: string;
  type: string;
  distance: string;
  vibe: string;
  features: string[];
  crowdLevel: number;
}

export interface NovaPlanAction {
  type: 'create_new' | 'add_to_existing';
  venue: NovaVenue;
  timestamp: Date;
}

export const useNovaPlanActions = () => {
  const [pendingPlanAction, setPendingPlanAction] = useState<NovaPlanAction | null>(null);
  const { toast } = useToast();

  const triggerAddToPlan = useCallback((venue: NovaVenue, actionType: 'create_new' | 'add_to_existing' = 'create_new') => {
    const planAction: NovaPlanAction = {
      type: actionType,
      venue,
      timestamp: new Date()
    };

    setPendingPlanAction(planAction);
    
    toast({
      title: "Adding to plan...",
      description: `"${venue.name}" is being added to your plan`,
    });

    // Emit custom event for other components to listen
    window.dispatchEvent(new CustomEvent('nova-plan-action', { 
      detail: planAction 
    }));
  }, [toast]);

  const clearPendingAction = useCallback(() => {
    setPendingPlanAction(null);
  }, []);

  const formatVenueForPlan = useCallback((venue: NovaVenue) => {
    return {
      id: Date.now(),
      name: venue.name,
      type: venue.type,
      estimatedTime: 90, // Default 90 minutes
      cost: venue.crowdLevel > 70 ? 35 : 25 // Higher cost for busier venues
    };
  }, []);

  return {
    pendingPlanAction,
    triggerAddToPlan,
    clearPendingAction,
    formatVenueForPlan
  };
};
