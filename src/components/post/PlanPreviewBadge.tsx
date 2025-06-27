
import React from 'react';
import { Calendar } from 'lucide-react';

interface PlanPreviewBadgeProps {
  planId: number | null;
}

const PlanPreviewBadge = ({ planId }: PlanPreviewBadgeProps) => {
  if (!planId) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <div className="flex items-center text-sm text-orange-700">
        <Calendar size={14} className="mr-2" />
        <span className="font-medium">Sharing from your saved plan</span>
      </div>
    </div>
  );
};

export default PlanPreviewBadge;
