
import { create } from 'zustand';
import { Plan } from '@/data/plansData';
import { PlannerDraft } from '@/types/coPlanTypes';

interface PlansState {
  // Core data
  plans: Plan[];
  friendsPlans: Plan[];
  pastPlans: Plan[];
  userRSVPs: Record<number, 'going' | 'maybe' | 'cantGo'>;
  
  // UI state
  showCreateModal: boolean;
  editingPlan: Plan | null;
  selectedPlan: Plan | null;
  showPlanEditor: boolean;
  novaPrefillData: any;
  activeTab: string;
  showFriendPicker: boolean;
  
  // Draft management
  drafts: PlannerDraft[];
}

interface PlansActions {
  // Data actions
  setPlans: (plans: Plan[]) => void;
  setFriendsPlans: (plans: Plan[]) => void;
  setPastPlans: (plans: Plan[]) => void;
  addPlan: (plan: Omit<Plan, 'id' | 'shareLink' | 'rsvpResponses'>) => Plan;
  updatePlan: (planId: number, updates: Partial<Plan>) => void;
  deletePlan: (planId: number) => void;
  
  // RSVP actions
  setUserRSVPs: (rsvps: Record<number, 'going' | 'maybe' | 'cantGo'>) => void;
  handleRSVP: (planId: number, response: 'going' | 'maybe' | 'cantGo') => void;
  
  // UI actions
  setShowCreateModal: (show: boolean) => void;
  setEditingPlan: (plan: Plan | null) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setShowPlanEditor: (show: boolean) => void;
  setNovaPrefillData: (data: any) => void;
  setActiveTab: (tab: string) => void;
  setShowFriendPicker: (show: boolean) => void;
  
  // Draft actions
  setDrafts: (drafts: PlannerDraft[]) => void;
  addDraft: (draft: PlannerDraft) => void;
  updateDraft: (draftId: string, updates: Partial<PlannerDraft>) => void;
  deleteDraft: (draftId: string) => void;
  
  // Utility actions
  generateShareLink: (planId: number) => string;
  recreatePlan: (originalPlan: Plan) => Plan;
  closeAllModals: () => void;
}

export const usePlansStore = create<PlansState & PlansActions>((set, get) => ({
  // State
  plans: [],
  friendsPlans: [],
  pastPlans: [],
  userRSVPs: {},
  showCreateModal: false,
  editingPlan: null,
  selectedPlan: null,
  showPlanEditor: false,
  novaPrefillData: null,
  activeTab: 'active',
  showFriendPicker: false,
  drafts: [],

  // Actions
  setPlans: (plans) => set({ plans }),
  setFriendsPlans: (friendsPlans) => set({ friendsPlans }),
  setPastPlans: (pastPlans) => set({ pastPlans }),
  setUserRSVPs: (userRSVPs) => set({ userRSVPs }),
  setShowCreateModal: (showCreateModal) => set({ showCreateModal }),
  setEditingPlan: (editingPlan) => set({ editingPlan }),
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
  setShowPlanEditor: (showPlanEditor) => set({ showPlanEditor }),
  setNovaPrefillData: (novaPrefillData) => set({ novaPrefillData }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setShowFriendPicker: (showFriendPicker) => set({ showFriendPicker }),
  setDrafts: (drafts) => set({ drafts }),

  addPlan: (newPlan) => {
    const plan: Plan = {
      ...newPlan,
      id: Date.now(),
      shareLink: `https://app.nightlife.com/plan/${newPlan.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 6)}`,
      rsvpResponses: { going: 1, maybe: 0, cantGo: 0 }
    };
    set(state => ({ plans: [plan, ...state.plans] }));
    return plan;
  },

  updatePlan: (planId, updates) => {
    set(state => ({
      plans: state.plans.map(plan => 
        plan.id === planId ? { ...plan, ...updates } : plan
      )
    }));
  },

  deletePlan: (planId) => {
    set(state => ({
      plans: state.plans.filter(plan => plan.id !== planId)
    }));
  },

  handleRSVP: (planId, response) => {
    const { userRSVPs } = get();
    const previousResponse = userRSVPs[planId];
    
    set(state => ({
      userRSVPs: { ...state.userRSVPs, [planId]: response },
      plans: state.plans.map(plan => {
        if (plan.id !== planId || !plan.rsvpResponses) return plan;
        
        const newResponses = { ...plan.rsvpResponses };
        
        // Remove from previous response
        if (previousResponse) {
          newResponses[previousResponse] = Math.max(0, newResponses[previousResponse] - 1);
        }
        
        // Add to new response
        newResponses[response] += 1;
        
        return { ...plan, rsvpResponses: newResponses };
      })
    }));
  },

  addDraft: (draft) => {
    set(state => ({ drafts: [...state.drafts, draft] }));
  },

  updateDraft: (draftId, updates) => {
    set(state => ({
      drafts: state.drafts.map(draft =>
        draft.id === draftId ? { ...draft, ...updates } : draft
      )
    }));
  },

  deleteDraft: (draftId) => {
    set(state => ({
      drafts: state.drafts.filter(draft => draft.id !== draftId)
    }));
  },

  generateShareLink: (planId) => {
    const { plans, friendsPlans } = get();
    const plan = [...plans, ...friendsPlans].find(p => p.id === planId);
    if (!plan) return '';
    
    if (plan.shareLink) {
      return plan.shareLink;
    }
    
    const newShareLink = `https://app.nightlife.com/plan/${plan.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Update the plan with the new share link
    if (plans.find(p => p.id === planId)) {
      get().updatePlan(planId, { shareLink: newShareLink });
    } else {
      set(state => ({
        friendsPlans: state.friendsPlans.map(plan => 
          plan.id === planId ? { ...plan, shareLink: newShareLink } : plan
        )
      }));
    }
    
    return newShareLink;
  },

  recreatePlan: (originalPlan) => {
    const newPlanData: Omit<Plan, 'id' | 'shareLink' | 'rsvpResponses'> = {
      name: `${originalPlan.name} (Recreated)`,
      date: 'Tonight',
      time: originalPlan.time,
      stops: originalPlan.stops,
      attendees: 1,
      status: 'planned',
      description: `Recreated from: ${originalPlan.description}`,
      estimatedCost: originalPlan.estimatedCost,
      duration: originalPlan.duration,
      notes: `Recreated from ${originalPlan.completedDate}`
    };
    
    return get().addPlan(newPlanData);
  },

  closeAllModals: () => set({
    showCreateModal: false,
    editingPlan: null,
    selectedPlan: null,
    showPlanEditor: false,
    showFriendPicker: false
  })
}));
