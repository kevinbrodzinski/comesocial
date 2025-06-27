
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import PlanOverviewCards from './PlanOverviewCards';
import MobilePlanOverviewCards from './MobilePlanOverviewCards';

interface PlanEditorOverviewProps {
  stopsCount: number;
  totalTime: number;
  totalCost: number;
  attendees: number;
  planStops?: any[];
}

const PlanEditorOverview = ({ 
  stopsCount, 
  totalTime, 
  totalCost, 
  attendees, 
  planStops 
}: PlanEditorOverviewProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobilePlanOverviewCards
        stopsCount={stopsCount}
        totalTime={totalTime}
        totalCost={totalCost}
        attendees={attendees}
        planStops={planStops}
      />
    );
  }

  return (
    <PlanOverviewCards
      stopsCount={stopsCount}
      totalTime={totalTime}
      totalCost={totalCost}
      attendees={attendees}
    />
  );
};

export default PlanEditorOverview;
