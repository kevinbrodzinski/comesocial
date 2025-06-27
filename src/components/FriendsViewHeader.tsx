
import React, { useState } from 'react';
import FriendsActionsMenu from './FriendsActionsMenu';
import FriendsFiltersModal from './FriendsFiltersModal';
import FriendsTabBar from './FriendsTabBar';
import FriendsSimpleSearch from './FriendsSimpleSearch';
import { getFeatureFlag } from '@/utils/featureFlags';

interface FriendsViewHeaderProps {
  onFriendManagement: () => void;
  onAddFriend: () => void;
  searchExpanded: boolean;
  onSearchToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  activeVibeFilters: string[];
  onVibeFilterToggle: (vibeId: string) => void;
  tabs: Array<{ id: string; label: string; count: number }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  searchHistory: string[];
  onLocationSharingOpen: () => void;
}

const FriendsViewHeader = ({
  onFriendManagement,
  onAddFriend,
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
  activeVibeFilters,
  onVibeFilterToggle,
  tabs,
  activeTab,
  onTabChange,
  searchHistory,
  onLocationSharingOpen
}: FriendsViewHeaderProps) => {
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  const handleCreateGroupPlan = () => {
    // Trigger plan creation
    const event = new CustomEvent('startPlanCreation');
    window.dispatchEvent(event);
  };

  return (
    <div className={`p-4 border-b border-border bg-card ${
      useUnifiedScrolling ? '' : 'fixed top-0 left-0 right-0 z-10'
    }`}>
      {/* Row 1: Title Only */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-foreground">Friends</h1>
      </div>
      
      {/* Row 2: Search + Filter + Actions */}
      <div className="mb-3">
        <FriendsSimpleSearch
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          activeFilters={activeFilters}
          onOpenFilters={() => setFiltersModalOpen(true)}
          actionsMenu={
            <FriendsActionsMenu
              onFriendManagement={onFriendManagement}
              onAddFriend={onAddFriend}
              onCreateGroupPlan={handleCreateGroupPlan}
            />
          }
        />
      </div>
      
      {/* Row 3: Tab Bar */}
      <div>
        <FriendsTabBar 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>

      {/* Filters Modal */}
      <FriendsFiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeFilters={activeFilters}
        onFilterToggle={onFilterToggle}
        activeVibeFilters={activeVibeFilters}
        onVibeFilterToggle={onVibeFilterToggle}
        searchHistory={searchHistory}
      />
    </div>
  );
};

export default FriendsViewHeader;
