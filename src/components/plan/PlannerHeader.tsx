
import React from 'react';
import { NovaPlanAction } from '@/hooks/useNovaPlanActions';
import { withFeatureFlag } from '@/utils/featureFlags';

interface PlannerHeaderProps {
  pendingPlanAction: NovaPlanAction | null;
}

const PlannerHeader = ({ pendingPlanAction }: PlannerHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Plans</h1>
          <p className={`text-muted-foreground mt-1 ${withFeatureFlag('fab-plan-pass-01', 'mb-3')}`}>
            Create and manage your nightlife adventures
          </p>
        </div>
      </div>

      {/* Nova Action Indicator */}
      {pendingPlanAction && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            Nova found a great spot: <strong>{pendingPlanAction.venue.name}</strong>. Ready to add it to a plan?
          </p>
        </div>
      )}
    </div>
  );
};

export default PlannerHeader;
