
import { useState, useEffect } from 'react';
import PlanStateService from '@/services/PlanStateService';
import { usePlansData } from './usePlansData';

export const usePlanState = () => {
  const [planState, setPlanState] = useState(PlanStateService.getInstance().getState());
  const { plans } = usePlansData();

  useEffect(() => {
    const service = PlanStateService.getInstance();
    const unsubscribe = service.subscribe(setPlanState);
    
    // Update with current plans
    service.updateActivePlans(plans);
    
    return unsubscribe;
  }, [plans]);

  const hasActivePlan = () => planState.currentPlan !== null;
  const getCurrentPlan = () => planState.currentPlan;
  const isCreatingPlan = () => planState.planCreationInProgress;

  const startPlanWithFriend = (friend: any) => {
    const service = PlanStateService.getInstance();
    service.startPlanCreation();
    
    // Trigger plan creation flow with friend pre-selected
    const event = new CustomEvent('startPlanCreation', {
      detail: { preSelectedFriends: [friend] }
    });
    window.dispatchEvent(event);
  };

  const inviteFriendToPlan = (friend: any, plan?: any) => {
    const targetPlan = plan || getCurrentPlan();
    if (targetPlan) {
      const service = PlanStateService.getInstance();
      service.addInvitation({
        planId: targetPlan.id,
        friendId: friend.id,
        timestamp: new Date()
      });
      
      // Trigger invitation flow
      const event = new CustomEvent('sendPlanInvitation', {
        detail: { friend, plan: targetPlan }
      });
      window.dispatchEvent(event);
    }
  };

  return {
    planState,
    hasActivePlan,
    getCurrentPlan,
    isCreatingPlan,
    startPlanWithFriend,
    inviteFriendToPlan
  };
};
