
import React from 'react';
import InvitationsTabContent from '../invitations/InvitationsTabContent';
import { PlanInvitation } from '@/services/InvitationService';

interface InvitationsViewProps {
  onViewPlan: (invitation: PlanInvitation) => void;
}

const InvitationsView = ({ onViewPlan }: InvitationsViewProps) => {
  return (
    <InvitationsTabContent onViewPlan={onViewPlan} />
  );
};

export default InvitationsView;
