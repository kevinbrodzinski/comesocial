
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useInvitations } from '@/hooks/useInvitations';
import { usePlanFiltering } from '@/hooks/usePlanFiltering';
import { PlannerDraft } from '@/types/coPlanTypes';
import EnhancedPlanView from './EnhancedPlanView';
import EnhancedPlanEditor from './plan/EnhancedPlanEditor';
import PastPlansSection from './plan/PastPlansSection';
import PlannerHeader from './plan/PlannerHeader';
import PlannerModals from './plan/PlannerModals';
import PlannerFloatingActionButton from './plan/PlannerFloatingActionButton';
import FabPlanDropdown from './plan/FabPlanDropdown';
import FriendPickerSheet from './coplan/FriendPickerSheet';
import PlannerNavigationManager from './planner/PlannerNavigationManager';
import ActivePlansView from './planner/ActivePlansView';
import InvitationsView from './planner/InvitationsView';
import PlannerSearchBar from './planner/PlannerSearchBar';
import PlannerFiltersModal from './planner/PlannerFiltersModal';
import SearchResultsSummary from './planner/SearchResultsSummary';
import { Plan } from '@/data/plansData';
import { PlanInvitation } from '@/services/InvitationService';
import { withFeatureFlag, getFeatureFlag } from '@/utils/featureFlags';

const PlannerView = () => {
  const navigate = useNavigate();
  
  const {
    showCreateModal,
    setShowCreateModal,
    selectedPlan,
    showPlanEditor,
    novaPrefillData,
    editingPlan,
    activeTab,
    setActiveTab,
    showFriendPicker,
    setShowFriendPicker,
    plans,
    friendsPlans,
    pastPlans,
    userRSVPs,
    pendingPlanAction,
    handleCreatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleCloseModal,
    handleViewPlan,
    handleClosePlanView,
    handleClosePlanEditor,
    handleUpdatePlan,
    handleRecreatePlan,
    handleRSVP,
    generateShareLink,
    connectWithAttendee,
    updatePastPlan,
    handleCoPlan,
    handleFriendPickerNext,
    getUserDrafts,
    deleteDraft,
    convertDraftToPlan,
    handleGoLive
  } = usePlannerState();

  const { pendingInvitations } = useInvitations();
  const [selectedInvitation, setSelectedInvitation] = useState<PlanInvitation | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const drafts = getUserDrafts();

  // Apply filtering
  const { filteredPlans, filteredFriendsPlans, filteredDrafts, totalResults } = usePlanFiltering(
    plans,
    friendsPlans,
    drafts,
    searchQuery,
    activeFilters
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev].slice(0, 10));
    }
  };

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Show enhanced plan editor
  if (showPlanEditor && selectedPlan) {
    return (
      <EnhancedPlanEditor
        plan={selectedPlan}
        onClose={handleClosePlanEditor}
        onUpdatePlan={handleUpdatePlan}
      />
    );
  }

  // Show plan view (for both regular plans and invitation plans)
  if (selectedPlan && !showPlanEditor) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => {
              handleClosePlanView();
              setSelectedInvitation(null);
            }}
            className="mb-4"
          >
            ← Back to Plans
          </Button>
        </div>
        <EnhancedPlanView
          plan={selectedPlan as Plan}
          onUpdatePlan={handleUpdatePlan}
        />
      </div>
    );
  }

  const handleEditDraft = (draft: PlannerDraft) => {
    navigate(`/planner/draft/${draft.id}`, {
      state: { previousTab: activeTab }
    });
  };

  const handleViewDraft = (draft: PlannerDraft) => {
    navigate(`/planner/draft/${draft.id}`, {
      state: { previousTab: activeTab }
    });
  };

  const handleDeleteDraft = (draftId: string, draftTitle: string) => {
    deleteDraft(draftId);
  };

  const handleViewInvitationPlan = (invitation: PlanInvitation) => {
    setSelectedInvitation(invitation);
    handleViewPlan(invitation.plan);
  };

  const handleFabCreatePlan = () => {
    setShowCreateModal(true);
  };

  const activePlansCount = filteredPlans.length + filteredFriendsPlans.length;
  const pastPlansCount = pastPlans.length;
  const invitationsCount = pendingInvitations.length;

  return (
    <PlannerNavigationManager activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <PlannerHeader pendingPlanAction={pendingPlanAction} />

        {/* Search Bar */}
        <div className="mb-4">
          <PlannerSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            activeFilters={activeFilters}
            onOpenFilters={() => setFiltersModalOpen(true)}
          />
        </div>

        {/* Tabs for Active, Invitations, and Past Plans */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 p-1 mb-4 ${withFeatureFlag('fab-plan-pass-01', 'h-auto')}`}>
            <TabsTrigger 
              value="active" 
              className={withFeatureFlag('fab-plan-pass-01', 'py-1.5 px-4 text-sm') || 'flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 px-1 sm:px-3 text-xs sm:text-sm min-h-[3rem] sm:min-h-[2.5rem]'}
            >
              <span className="font-medium">Active</span>
              {getFeatureFlag('fab-plan-pass-01') ? (
                (activePlansCount + filteredDrafts.length) > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {activePlansCount + filteredDrafts.length}
                  </Badge>
                )
              ) : (
                <span className="text-xs opacity-75">({activePlansCount + filteredDrafts.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="invitations" 
              className={withFeatureFlag('fab-plan-pass-01', 'py-1.5 px-4 text-sm relative') || 'flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 px-1 sm:px-3 text-xs sm:text-sm min-h-[3rem] sm:min-h-[2.5rem] relative'}
            >
              <span className="font-medium">Invitations</span>
              {invitationsCount > 0 && (
                <Badge className="bg-primary text-primary-foreground text-xs min-w-5 h-5 flex items-center justify-center ml-1">
                  {invitationsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className={withFeatureFlag('fab-plan-pass-01', 'py-1.5 px-4 text-sm') || 'flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 px-1 sm:px-3 text-xs sm:text-sm min-h-[3rem] sm:min-h-[2.5rem]'}
            >
              <span className="font-medium">Past</span>
              {getFeatureFlag('fab-plan-pass-01') ? (
                pastPlansCount > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {pastPlansCount}
                  </Badge>
                )
              ) : (
                <span className="text-xs opacity-75">({pastPlansCount})</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {/* Search Results Summary */}
            <SearchResultsSummary
              searchQuery={searchQuery}
              activeFilters={activeFilters}
              totalResults={totalResults}
              plansCount={filteredPlans.length}
              friendsPlansCount={filteredFriendsPlans.length}
              draftsCount={filteredDrafts.length}
            />

            <ActivePlansView
              plans={filteredPlans}
              friendsPlans={filteredFriendsPlans}
              drafts={filteredDrafts}
              userRSVPs={userRSVPs}
              onViewPlan={handleViewPlan}
              onEditPlan={handleEditPlan}
              onDeletePlan={handleDeletePlan}
              onCreatePlan={() => setShowCreateModal(true)}
              onSharePlan={generateShareLink}
              onRSVP={handleRSVP}
              onEditDraft={handleEditDraft}
              onViewDraft={handleViewDraft}
              onDeleteDraft={handleDeleteDraft}
            />
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationsView onViewPlan={handleViewInvitationPlan} />
          </TabsContent>

          <TabsContent value="past">
            <PastPlansSection
              pastPlans={pastPlans}
              onRecreatePlan={handleRecreatePlan}
              onConnectWithAttendee={connectWithAttendee}
              onUpdatePlan={updatePastPlan}
            />
          </TabsContent>
        </Tabs>

        {/* Floating Action Button with Dropdown */}
        {getFeatureFlag('fab-plan-pass-01') ? (
          <FabPlanDropdown 
            onCreatePlan={handleFabCreatePlan}
            onCoPlan={handleCoPlan}
          >
            <PlannerFloatingActionButton />
          </FabPlanDropdown>
        ) : null}

        {/* Friend Picker Sheet for Co-planning */}
        {getFeatureFlag('co_plan_pass_01') && (
          <FriendPickerSheet
            open={showFriendPicker}
            onOpenChange={setShowFriendPicker}
            onNext={handleFriendPickerNext}
          />
        )}

        <PlannerModals
          showCreateModal={showCreateModal}
          editingPlan={editingPlan}
          novaPrefillData={novaPrefillData}
          onCloseModal={handleCloseModal}
          onCreatePlan={handleCreatePlan}
        />

        {/* Filters Modal */}
        <PlannerFiltersModal
          isOpen={filtersModalOpen}
          onClose={() => setFiltersModalOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          searchHistory={searchHistory}
        />
      </div>
    </PlannerNavigationManager>
  );
};

export default PlannerView;
