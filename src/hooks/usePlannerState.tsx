import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNovaPlanActions, NovaPlanAction } from './useNovaPlanActions';
import { usePlansData } from './usePlansData';
import { useToast } from './use-toast';
import { usePlansStore } from '@/stores/usePlansStore';
import { Plan } from '@/data/plansData';
import { Friend } from '@/data/friendsData';
import { getFeatureFlag } from '@/utils/featureFlags';
import CoPlanService from '@/services/CoPlanService';

export const usePlannerState = () => {
  const navigate = useNavigate();
  const store = usePlansStore();
  
  // Keep existing data hooks for now - will be migrated in next phase
  const { 
    plans, 
    friendsPlans, 
    pastPlans, 
    userRSVPs, 
    addPlan, 
    updatePlan, 
    updatePastPlan,
    deletePlan, 
    handleRSVP, 
    generateShareLink,
    recreatePlan,
    connectWithAttendee,
    convertDraftToPlan,
    getUserDrafts,
    deleteDraft,
    convertDraftToLivePlan
  } = usePlansData();
  
  const { pendingPlanAction, clearPendingAction, formatVenueForPlan } = useNovaPlanActions();
  const { toast } = useToast();

  // Check for auto-tab switching (from notifications) - but default to 'active'
  useEffect(() => {
    const autoTab = localStorage.getItem('plannerAutoTab');
    if (autoTab) {
      store.setActiveTab(autoTab);
      localStorage.removeItem('plannerAutoTab');
    }
  }, []);

  // Listen for Nova plan actions
  useEffect(() => {
    const handleNovaPlanAction = (event: CustomEvent<NovaPlanAction>) => {
      const action = event.detail;
      
      if (action.type === 'create_new') {
        const venueForPlan = formatVenueForPlan(action.venue);
        
        store.setNovaPrefillData({
          name: `Night out at ${action.venue.name}`,
          stops: [venueForPlan],
          notes: `Nova suggestion: ${action.venue.vibe} vibes at ${action.venue.name}`,
          estimatedCost: venueForPlan.cost,
          estimatedDuration: venueForPlan.estimatedTime,
          isQuickPlan: true
        });
        
        store.setShowCreateModal(true);
        clearPendingAction();
        
        toast({
          title: "Plan started!",
          description: `Creating a new plan with ${action.venue.name}`,
        });
      }
    };

    window.addEventListener('nova-plan-action', handleNovaPlanAction as EventListener);
    
    return () => {
      window.removeEventListener('nova-plan-action', handleNovaPlanAction as EventListener);
    };
  }, [formatVenueForPlan, clearPendingAction, toast]);

  const handleCreatePlan = (planData: any) => {
    if (store.editingPlan) {
      updatePlan(store.editingPlan.id, planData);
    } else {
      addPlan(planData);
    }
    store.setNovaPrefillData(null);
  };

  const handleEditPlan = (plan: Plan) => {
    store.setEditingPlan(plan);
    store.setSelectedPlan(plan);
    store.setShowPlanEditor(true);
  };

  const handleDeletePlan = (planId: number, planName: string) => {
    deletePlan(planId);
    toast({
      title: "Plan Deleted",
      description: `"${planName}" has been removed from your plans`,
    });
  };

  const handleCloseModal = () => {
    store.setShowCreateModal(false);
    store.setEditingPlan(null);
    store.setNovaPrefillData(null);
  };

  const handleClosePlanEditor = () => {
    store.setShowPlanEditor(false);
    store.setEditingPlan(null);
    store.setSelectedPlan(null);
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    updatePlan(updatedPlan.id, updatedPlan);
    store.setSelectedPlan(updatedPlan);
  };

  const handleRecreatePlan = (plan: Plan) => {
    const newPlan = recreatePlan(plan);
    store.setActiveTab('active');
    toast({
      title: "Plan Recreated!",
      description: `"${newPlan.name}" has been added to your active plans`,
    });
  };

  const handleCoPlan = () => {
    if (getFeatureFlag('co_plan_pass_01')) {
      store.setShowFriendPicker(true);
    } else {
      console.log('Co-planning feature coming soon!');
    }
  };

  const handleFriendPickerNext = (selectedFriends: Friend[]) => {
    navigate('/planner/invite-setup/new', {
      state: { 
        selectedFriends,
        previousTab: store.activeTab 
      }
    });
  };

  const handleGoLive = (draftId: string) => {
    const livePlan = convertDraftToLivePlan(draftId);
    if (livePlan) {
      store.setActiveTab('active');
      navigate('/?initialTab=planner', { replace: true });
    }
  };

  return {
    // State from store
    showCreateModal: store.showCreateModal,
    setShowCreateModal: store.setShowCreateModal,
    editingPlan: store.editingPlan,
    selectedPlan: store.selectedPlan,
    showPlanEditor: store.showPlanEditor,
    novaPrefillData: store.novaPrefillData,
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    showFriendPicker: store.showFriendPicker,
    setShowFriendPicker: store.setShowFriendPicker,
    
    // Data from hooks (to be migrated)
    plans,
    friendsPlans,
    pastPlans,
    userRSVPs,
    pendingPlanAction,
    
    // Handlers
    handleCreatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleCloseModal,
    handleViewPlan: store.setSelectedPlan,
    handleClosePlanView: () => store.setSelectedPlan(null),
    handleClosePlanEditor,
    handleUpdatePlan,
    handleRecreatePlan,
    handleRSVP,
    generateShareLink,
    connectWithAttendee,
    updatePastPlan,
    handleCoPlan,
    handleFriendPickerNext,
    
    // Draft handlers
    getUserDrafts,
    deleteDraft,
    convertDraftToPlan,
    handleGoLive
  };
};
