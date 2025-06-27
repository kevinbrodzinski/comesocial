import { PlannerDraft, CoPlanInvitation } from '@/types/coPlanTypes';
import { Friend } from '@/data/friendsData';
import { Plan } from '@/data/plansData';
import { samplePlans } from '@/data/sampleData';

class CoPlanService {
  private static instance: CoPlanService;
  private drafts: Map<string, PlannerDraft> = new Map();

  static getInstance(): CoPlanService {
    if (!CoPlanService.instance) {
      CoPlanService.instance = new CoPlanService();
    }
    return CoPlanService.instance;
  }

  // Load sample data for testing roles
  loadSampleData(): void {
    samplePlans.forEach(plan => {
      this.drafts.set(plan.id, plan);
      localStorage.setItem(`coplan_draft_${plan.id}`, JSON.stringify(plan));
    });
  }

  // Clear all sample data
  clearSampleData(): void {
    samplePlans.forEach(plan => {
      this.drafts.delete(plan.id);
      localStorage.removeItem(`coplan_draft_${plan.id}`);
    });
  }

  // Check if sample data is loaded
  isSampleDataLoaded(): boolean {
    return samplePlans.every(plan => 
      localStorage.getItem(`coplan_draft_${plan.id}`) !== null
    );
  }

  createDraft(participants: Friend[]): PlannerDraft {
    const id = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const draft: PlannerDraft = {
      id,
      title: '',
      description: '',
      planType: undefined,
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      participants,
      all_can_edit: true,
      host_id: 1, // Mock current user ID
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date()
    };

    this.drafts.set(id, draft);
    localStorage.setItem(`coplan_draft_${id}`, JSON.stringify(draft));
    
    return draft;
  }

  getDraft(id: string): PlannerDraft | null {
    const stored = localStorage.getItem(`coplan_draft_${id}`);
    if (stored) {
      const draft = JSON.parse(stored);
      draft.created_at = new Date(draft.created_at);
      draft.updated_at = new Date(draft.updated_at);
      this.drafts.set(id, draft);
      return draft;
    }
    return this.drafts.get(id) || null;
  }

  getAllUserDrafts(userId: number = 1): PlannerDraft[] {
    const drafts: PlannerDraft[] = [];
    
    // Scan localStorage for all draft entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('coplan_draft_')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const draft = JSON.parse(stored);
            // Convert date strings back to Date objects
            draft.created_at = new Date(draft.created_at);
            draft.updated_at = new Date(draft.updated_at);
            
            // Only return drafts where user is host or participant
            if (draft.host_id === userId || draft.participants.some((p: Friend) => p.id === userId)) {
              drafts.push(draft);
            }
          }
        } catch (error) {
          console.error('Error parsing draft:', error);
        }
      }
    }
    
    // Sort by most recently updated
    return drafts.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  updateDraft(id: string, updates: Partial<PlannerDraft>): PlannerDraft | null {
    const draft = this.getDraft(id);
    if (!draft) return null;

    const updated = { ...draft, ...updates, updated_at: new Date() };
    this.drafts.set(id, updated);
    localStorage.setItem(`coplan_draft_${id}`, JSON.stringify(updated));
    
    return updated;
  }

  deleteDraft(id: string): boolean {
    this.drafts.delete(id);
    localStorage.removeItem(`coplan_draft_${id}`);
    return true;
  }

  convertToInvitations(draftId: string): CoPlanInvitation[] {
    const draft = this.getDraft(draftId);
    if (!draft) return [];

    return draft.participants.map(participant => ({
      id: `inv_${draftId}_${participant.id}`,
      draft_id: draftId,
      participant_id: participant.id,
      status: 'pending' as const,
      created_at: new Date()
    }));
  }

  goLive(draftId: string): Plan | null {
    const draft = this.getDraft(draftId);
    if (!draft) return null;

    // Convert draft to live plan format
    const livePlan: Plan = {
      id: Date.now(),
      name: draft.title || 'Untitled Plan',
      date: draft.date === new Date().toISOString().split('T')[0] ? 'Tonight' : draft.date,
      time: draft.time,
      stops: [], // Drafts use different stop format, so start empty for now
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

    // Delete the draft after conversion
    this.deleteDraft(draftId);

    return livePlan;
  }
}

export default CoPlanService;
