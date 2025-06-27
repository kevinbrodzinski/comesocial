
import React from 'react';
import CreatePlanModal from '../CreatePlanModal';
import { Plan } from '@/data/plansData';

interface PlannerModalsProps {
  showCreateModal: boolean;
  editingPlan: Plan | null;
  novaPrefillData: any;
  onCloseModal: () => void;
  onCreatePlan: (planData: any) => void;
}

const PlannerModals = ({
  showCreateModal,
  editingPlan,
  novaPrefillData,
  onCloseModal,
  onCreatePlan
}: PlannerModalsProps) => {
  return (
    <CreatePlanModal
      isOpen={showCreateModal}
      onClose={onCloseModal}
      onCreatePlan={onCreatePlan}
      editingPlan={editingPlan || novaPrefillData}
    />
  );
};

export default PlannerModals;
