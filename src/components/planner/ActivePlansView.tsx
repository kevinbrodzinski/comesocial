
import React from 'react';
import PlannerActiveTab from '../plan/PlannerActiveTab';
import { Plan } from '@/data/plansData';
import { PlannerDraft } from '@/types/coPlanTypes';

interface ActivePlansViewProps {
  plans: Plan[];
  friendsPlans: Plan[];
  drafts: PlannerDraft[];
  userRSVPs: Record<number, 'going' | 'maybe' | 'cantGo'>;
  onViewPlan: (plan: Plan) => void;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (planId: number, planName: string) => void;
  onCreatePlan: () => void;
  onSharePlan: (planId: number) => string;
  onRSVP: (planId: number, response: 'going' | 'maybe' | 'cantGo') => void;
  onEditDraft: (draft: PlannerDraft) => void;
  onViewDraft: (draft: PlannerDraft) => void;
  onDeleteDraft: (draftId: string, draftTitle: string) => void;
}

const ActivePlansView = ({
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
}: ActivePlansViewProps) => {
  return (
    <PlannerActiveTab
      plans={plans}
      friendsPlans={friendsPlans}
      drafts={drafts}
      userRSVPs={userRSVPs}
      onViewPlan={onViewPlan}
      onEditPlan={onEditPlan}
      onDeletePlan={onDeletePlan}
      onCreatePlan={onCreatePlan}
      onSharePlan={onSharePlan}
      onRSVP={onRSVP}
      onEditDraft={onEditDraft}
      onViewDraft={onViewDraft}
      onDeleteDraft={onDeleteDraft}
    />
  );
};

export default ActivePlansView;
