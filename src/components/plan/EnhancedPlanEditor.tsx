
import React from 'react';
import PlanEditorContainer from './PlanEditorContainer';

interface EnhancedPlanEditorProps {
  plan: any;
  onClose: () => void;
  onUpdatePlan: (updatedPlan: any) => void;
}

const EnhancedPlanEditor = ({ plan, onClose, onUpdatePlan }: EnhancedPlanEditorProps) => {
  return (
    <PlanEditorContainer
      plan={plan}
      onClose={onClose}
      onUpdatePlan={onUpdatePlan}
    />
  );
};

export default EnhancedPlanEditor;
