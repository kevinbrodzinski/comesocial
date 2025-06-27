import { useState } from 'react';
import { Plan, initialPlans, initialFriendsPlans, initialPastPlans } from '../data/plansData';
import { PlannerDraft } from '@/types/coPlanTypes';
import { useToast } from '@/hooks/use-toast';
import CoPlanService from '@/services/CoPlanService';

export const usePlansData = () => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [friendsPlans, setFriendsPlans] = useState<Plan[]>(initialFriendsPlans);
  const [pastPlans, setPastPlans] = useState<Plan[]>(initialPastPlans);
  const [userRSVPs, setUserRSVPs] = useState<Record<number, 'going' | 'maybe' | 'cantGo'>>({});
  const { toast } = useToast();
  const coPlanService = CoPlanService.getInstance();

  const addPlan = (newPlan: Omit<Plan, 'id' | 'shareLink' | 'rsvpResponses'>) => {
    const plan: Plan = {
      ...newPlan,
      id: Date.now(),
      shareLink: `https://app.nightlife.com/plan/${newPlan.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 6)}`,
      rsvpResponses: { going: 1, maybe: 0, cantGo: 0 }
    };
    setPlans(prev => [plan, ...prev]);
    return plan;
  };

  const updatePlan = (planId: number, updates: Partial<Plan>) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, ...updates } : plan
    ));
  };

  const updatePastPlan = (planId: number, updates: Partial<Plan>) => {
    setPastPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, ...updates } : plan
    ));
    
    toast({
      title: "Plan Updated",
      description: "Your review and photos have been saved",
    });
  };

  const deletePlan = (planId: number) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const convertDraftToPlan = (draft: PlannerDraft): Plan => {
    // Convert draft to plan format
    const newPlan: Plan = {
      id: Date.now(),
      name: draft.title || 'Untitled Plan',
      date: draft.date === new Date().toISOString().split('T')[0] ? 'Tonight' : draft.date,
      time: draft.time,
      stops: [], // Drafts handle stops differently, so start empty
      attendees: draft.participants.length,
      status: 'active',
      description: draft.description || 'Co-planned with friends',
      estimatedCost: '$50-100', // Default estimate
      duration: '3-4 hours', // Default duration
      notes: `Launched from co-planning draft on ${new Date().toLocaleDateString()}`,
      shareLink: `https://app.nightlife.com/plan/${(draft.title || 'plan').toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 6)}`,
      rsvpResponses: { 
        going: draft.participants.length, 
        maybe: 0, 
        cantGo: 0 
      }
    };

    // Add to plans
    setPlans(prev => [newPlan, ...prev]);

    // Delete the draft
    coPlanService.deleteDraft(draft.id);

    toast({
      title: "Plan Launched! 🎉",
      description: `"${newPlan.name}" is now live in your active plans`,
      duration: 3000
    });

    return newPlan;
  };

  const convertDraftToLivePlan = (draftId: string): Plan | null => {
    const livePlan = coPlanService.goLive(draftId);
    if (!livePlan) return null;

    // Add to active plans
    setPlans(prev => [livePlan, ...prev]);

    toast({
      title: "Plan is Live! 🎉",
      description: `"${livePlan.name}" is now active and ready to share`,
      duration: 3000
    });

    return livePlan;
  };

  const getUserDrafts = () => {
    return coPlanService.getAllUserDrafts(1); // Mock current user ID
  };

  const deleteDraft = (draftId: string) => {
    coPlanService.deleteDraft(draftId);
    toast({
      title: "Draft Deleted",
      description: "Draft has been removed",
      duration: 2000
    });
  };

  const handleRSVP = (planId: number, response: 'going' | 'maybe' | 'cantGo') => {
    const previousResponse = userRSVPs[planId];
    setUserRSVPs(prev => ({ ...prev, [planId]: response }));

    // Update RSVP counts
    const updateRSVPCounts = (plans: Plan[]) => 
      plans.map(plan => {
        if (plan.id !== planId || !plan.rsvpResponses) return plan;
        
        const newResponses = { ...plan.rsvpResponses };
        
        // Remove from previous response
        if (previousResponse) {
          newResponses[previousResponse] = Math.max(0, newResponses[previousResponse] - 1);
        }
        
        // Add to new response
        newResponses[response] += 1;
        
        return { ...plan, rsvpResponses: newResponses };
      });

    setPlans(updateRSVPCounts);
    setFriendsPlans(updateRSVPCounts);

    const responseLabels = {
      going: 'Going',
      maybe: 'Maybe',
      cantGo: "Can't Go"
    };

    toast({
      title: "RSVP Updated",
      description: `You responded "${responseLabels[response]}" to the plan`,
    });
  };

  const generateShareLink = (planId: number) => {
    const plan = [...plans, ...friendsPlans].find(p => p.id === planId);
    if (!plan) return '';
    
    if (plan.shareLink) {
      navigator.clipboard.writeText(plan.shareLink);
      toast({
        title: "Link Copied!",
        description: "Plan link copied to clipboard",
      });
      return plan.shareLink;
    }
    
    const newShareLink = `https://app.nightlife.com/plan/${plan.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Update the plan with the new share link
    if (plans.find(p => p.id === planId)) {
      updatePlan(planId, { shareLink: newShareLink });
    } else {
      setFriendsPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, shareLink: newShareLink } : plan
      ));
    }
    
    navigator.clipboard.writeText(newShareLink);
    toast({
      title: "Link Generated & Copied!",
      description: "Share this link with your friends",
    });
    
    return newShareLink;
  };

  const recreatePlan = (originalPlan: Plan) => {
    const newPlan: Omit<Plan, 'id' | 'shareLink' | 'rsvpResponses'> = {
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
    
    return addPlan(newPlan);
  };

  const connectWithAttendee = (attendeeName: string) => {
    toast({
      title: "Connection Request Sent",
      description: `Friend request sent to ${attendeeName}`,
    });
  };

  return {
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
    convertDraftToLivePlan,
    getUserDrafts,
    deleteDraft
  };
};
