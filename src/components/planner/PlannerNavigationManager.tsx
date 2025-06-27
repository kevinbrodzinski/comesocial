
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFeatureFlag } from '@/utils/featureFlags';

interface PlannerNavigationManagerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const PlannerNavigationManager = ({ 
  activeTab, 
  setActiveTab, 
  children 
}: PlannerNavigationManagerProps) => {
  const location = useLocation();

  // Handle initial tab from navigation state
  useEffect(() => {
    const navState = location.state as { plannerInitialTab?: string } | null;
    if (navState?.plannerInitialTab && getFeatureFlag('draft_ios_nav_fix_v1')) {
      setActiveTab(navState.plannerInitialTab);
      // Clear the state to prevent re-triggering
      window.history.replaceState(null, '', location.pathname);
    }
  }, [location.state, setActiveTab]);

  return <>{children}</>;
};

export default PlannerNavigationManager;
