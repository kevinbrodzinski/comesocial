
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface NavigationHandlers {
  setActiveTab: (tab: string) => void;
  setShowSplash: (show: boolean) => void;
  setShowMessages: (show: boolean) => void;
  invitationCount: number;
}

export const useIndexNavigation = ({
  setActiveTab,
  setShowSplash,
  setShowMessages,
  invitationCount
}: NavigationHandlers) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle initialTab parameter and skip splash if coming from internal navigation
  useEffect(() => {
    const initialTab = searchParams.get('initialTab');
    if (initialTab) {
      // Skip splash screen for internal navigation
      setShowSplash(false);
      setActiveTab(initialTab);
      // Clean up the URL parameter
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, setShowSplash, setActiveTab]);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle navigation events
  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      if (event.detail.tab === 'messages') {
        setShowMessages(true);
        setActiveTab('friends'); // Keep friends tab active in nav
      } else {
        setActiveTab(event.detail.tab);
        setShowMessages(false);
      }
    };

    const handlePlanCreation = (event: CustomEvent) => {
      setActiveTab('planner');
      // Additional plan creation logic can be added here
    };

    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    window.addEventListener('startPlanCreation', handlePlanCreation as EventListener);

    return () => {
      window.removeEventListener('switchTab', handleTabSwitch as EventListener);
      window.removeEventListener('startPlanCreation', handlePlanCreation as EventListener);
    };
  }, [setActiveTab, setShowMessages]);

  const handlePlannerOpen = () => {
    setActiveTab('planner');
    // Removed auto-switch to invitations tab - planner should always start on 'active' tab
  };

  return {
    handlePlannerOpen
  };
};
