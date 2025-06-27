
import { Plan } from '@/data/plansData';

export type PlanProgressState = 'not_started' | 'en_route' | 'checked_in' | 'moving_to_next' | 'completed';

interface PlanState {
  activePlans: Plan[];
  currentPlan: Plan | null;
  planProgressState: PlanProgressState;
  currentStopIndex: number;
  invitations: any[];
  planCreationInProgress: boolean;
  lastCheckInTime?: Date;
  friendsEnRoute: string[];
  nightStartTime?: Date;
}

class PlanStateService {
  private static instance: PlanStateService;
  private state: PlanState = {
    activePlans: [],
    currentPlan: null,
    planProgressState: 'not_started',
    currentStopIndex: 0,
    invitations: [],
    planCreationInProgress: false,
    friendsEnRoute: []
  };
  private listeners: Set<(state: PlanState) => void> = new Set();

  static getInstance(): PlanStateService {
    if (!PlanStateService.instance) {
      PlanStateService.instance = new PlanStateService();
    }
    return PlanStateService.instance;
  }

  subscribe(listener: (state: PlanState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(updates: Partial<PlanState>) {
    const prevState = { ...this.state };
    Object.assign(this.state, updates);
    
    console.log('🔄 PlanStateService state updated:', {
      from: prevState.planProgressState,
      to: this.state.planProgressState,
      stopIndex: this.state.currentStopIndex
    });
    
    // Use requestAnimationFrame to ensure UI updates happen on next frame
    requestAnimationFrame(() => {
      this.notify();
    });
  }

  private notify() {
    console.log('🔄 PlanStateService notifying listeners:', this.listeners.size, 'listeners');
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  updateActivePlans(plans: Plan[]) {
    const updates: Partial<PlanState> = {
      activePlans: plans,
      currentPlan: plans.find(p => p.status === 'active') || null
    };
    
    // Initialize plan state if we have an active plan
    if (updates.currentPlan && this.state.planProgressState === 'not_started') {
      updates.planProgressState = 'not_started';
      updates.currentStopIndex = 0;
    }
    
    this.updateState(updates);
  }

  startNight() {
    console.log('🚀 Starting night at:', new Date().toISOString());
    
    if (this.state.currentPlan) {
      this.updateState({
        planProgressState: 'en_route',
        nightStartTime: new Date()
      });
      
      console.log('✅ Plan state updated to en_route');
      this.broadcastPresence('en_route');
    }
  }

  checkInToVenue(stopIndex?: number) {
    console.log('✅ Checking in at:', new Date().toISOString());
    
    const targetIndex = stopIndex ?? this.state.currentStopIndex;
    this.updateState({
      planProgressState: 'checked_in',
      currentStopIndex: targetIndex,
      lastCheckInTime: new Date()
    });
    
    this.broadcastPresence('checked_in');
  }

  moveToNextStop() {
    console.log('➡️ Moving to next stop at:', new Date().toISOString());
    console.log('Current state before move:', {
      currentIndex: this.state.currentStopIndex,
      totalStops: this.state.currentPlan?.stops.length,
      progressState: this.state.planProgressState
    });
    
    if (this.state.currentPlan && this.state.currentStopIndex < this.state.currentPlan.stops.length - 1) {
      const newIndex = this.state.currentStopIndex + 1;
      console.log('Moving to stop index:', newIndex);
      
      this.updateState({
        currentStopIndex: newIndex,
        planProgressState: 'en_route'
      });
      
      console.log('✅ Moved to next stop, new state:', {
        currentIndex: newIndex,
        progressState: 'en_route'
      });
      
      this.broadcastPresence('moving_to_next');
    } else {
      console.log('🏁 Completing plan - reached final stop');
      this.completePlan();
    }
  }

  completePlan() {
    console.log('🏁 Completing plan');
    this.updateState({
      planProgressState: 'completed'
    });
    this.broadcastPresence('completed');
  }

  private broadcastPresence(action: string) {
    setTimeout(() => {
      this.emitPlanStateEvent(action);
    }, 0);
  }

  private emitPlanStateEvent(action: string) {
    const event = new CustomEvent('planStateChange', {
      detail: {
        action,
        plan: this.state.currentPlan,
        stopIndex: this.state.currentStopIndex,
        state: this.state.planProgressState
      }
    });
    window.dispatchEvent(event);
  }

  addFriendEnRoute(friendId: string) {
    if (!this.state.friendsEnRoute.includes(friendId)) {
      this.updateState({
        friendsEnRoute: [...this.state.friendsEnRoute, friendId]
      });
    }
  }

  startPlanCreation() {
    this.updateState({
      planCreationInProgress: true
    });
  }

  endPlanCreation() {
    this.updateState({
      planCreationInProgress: false
    });
  }

  addInvitation(invitation: any) {
    this.updateState({
      invitations: [...this.state.invitations, invitation]
    });
  }

  getState(): PlanState {
    return { ...this.state };
  }

  hasActivePlan(): boolean {
    return this.state.currentPlan !== null;
  }

  getCurrentPlan(): Plan | null {
    return this.state.currentPlan;
  }

  getPlanProgressState(): PlanProgressState {
    return this.state.planProgressState;
  }

  getCurrentStop() {
    if (!this.state.currentPlan) return null;
    return this.state.currentPlan.stops[this.state.currentStopIndex];
  }

  getNextStop() {
    if (!this.state.currentPlan) return null;
    const nextIndex = this.state.currentStopIndex + 1;
    return nextIndex < this.state.currentPlan.stops.length 
      ? this.state.currentPlan.stops[nextIndex] 
      : null;
  }
}

export default PlanStateService;
