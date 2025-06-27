import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar } from 'lucide-react';
interface SmartCTABannerProps {
  activeTab: string;
  nearbyCount: number;
  activeCount: number;
  onInviteNearby: () => void;
  onCreatePlan: () => void;
}
const SmartCTABanner = ({
  activeTab,
  nearbyCount,
  activeCount,
  onInviteNearby,
  onCreatePlan
}: SmartCTABannerProps) => {
  if (activeTab === 'nearby' && nearbyCount > 0) {
    return <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {nearbyCount} friends nearby
            </h3>
            <p className="text-xs text-muted-foreground">
              Perfect time to make spontaneous plans
            </p>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md" onClick={onInviteNearby}>
            <Users size={14} className="mr-1" />
            Rally Up
          </Button>
        </div>
      </div>;
  }
  if (activeTab === 'activity' && activeCount > 2) {
    return;
  }
  return null;
};
export default SmartCTABanner;