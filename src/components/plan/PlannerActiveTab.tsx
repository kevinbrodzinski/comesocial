
import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { Plan } from '@/data/plansData';
import { PlannerDraft } from '@/types/coPlanTypes';
import PlanCardPreview from './PlanCardPreview';
import DraftPlanCard from './DraftPlanCard';

interface PlannerActiveTabProps {
  plans: Plan[];
  friendsPlans: Plan[];
  drafts: PlannerDraft[];
  userRSVPs: Record<number, 'going' | 'maybe' | 'cantGo'>;
  onViewPlan: (plan: Plan) => void;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (planId: number, planName: string) => void;
  onCreatePlan: () => void;
  onSharePlan: (planId: number) => void;
  onRSVP: (planId: number, response: 'going' | 'maybe' | 'cantGo') => void;
  onEditDraft: (draft: PlannerDraft) => void;
  onViewDraft: (draft: PlannerDraft) => void;
  onDeleteDraft: (draftId: string, draftTitle: string) => void;
}

const PlannerActiveTab = ({
  plans,
  friendsPlans,
  drafts,
  userRSVPs,
  onViewPlan,
  onEditPlan,
  onDeletePlan,
  onCreatePlan,
  onSharePlan,
  onRSVP,
  onEditDraft,
  onViewDraft,
  onDeleteDraft
}: PlannerActiveTabProps) => {
  const location = useLocation();
  const [highlightedDraftId, setHighlightedDraftId] = useState<string | null>(null);

  // Check for highlight state from navigation
  useEffect(() => {
    const highlightId = location.state?.highlight;
    if (highlightId) {
      setHighlightedDraftId(highlightId);
      
      // Clear highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedDraftId(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="space-y-8">
      {/* Draft Plans Section */}
      {drafts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Draft Plans ({drafts.length})</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <DraftPlanCard
                key={draft.id}
                draft={draft}
                onEdit={onEditDraft}
                onView={onViewDraft}
                onDelete={onDeleteDraft}
                isHighlighted={highlightedDraftId === draft.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Your Plans Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Plans ({plans.length})</h2>
        {plans.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCardPreview
                key={plan.id}
                plan={plan}
                onView={() => onViewPlan(plan)}
                onEdit={() => onEditPlan(plan)}
                onShare={() => onSharePlan(plan.id)}
                onDelete={() => onDeletePlan(plan.id, plan.name)}
                isOwner={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
            <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No plans yet</h3>
            <p className="text-muted-foreground mb-4">Start planning your next night out!</p>
            <Button onClick={onCreatePlan}>
              <Plus size={16} className="mr-2" />
              Create Your First Plan
            </Button>
          </div>
        )}
      </div>

      {/* Friends' Plans Section */}
      {friendsPlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Friends' Plans ({friendsPlans.length})</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {friendsPlans.map((plan) => (
              <PlanCardPreview
                key={plan.id}
                plan={plan}
                onView={() => onViewPlan(plan)}
                isOwner={false}
                userRSVP={userRSVPs[plan.id]}
                onRSVP={(response) => onRSVP(plan.id, response)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerActiveTab;
