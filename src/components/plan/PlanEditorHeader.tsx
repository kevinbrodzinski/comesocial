
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import PlanHeader from './PlanHeader';
import MobilePlanHeader from './MobilePlanHeader';

interface PlanEditorHeaderProps {
  planName: string;
  planDate: string;
  planTime: string;
  stopsCount: number;
  onClose: () => void;
}

const PlanEditorHeader = ({ 
  planName, 
  planDate, 
  planTime, 
  stopsCount, 
  onClose 
}: PlanEditorHeaderProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobilePlanHeader
        planName={planName}
        planDate={planDate}
        planTime={planTime}
        stopsCount={stopsCount}
        onClose={onClose}
      />
    );
  }

  return (
    <PlanHeader
      planName={planName}
      planDate={planDate}
      planTime={planTime}
      stopsCount={stopsCount}
      onClose={onClose}
    />
  );
};

export default PlanEditorHeader;
