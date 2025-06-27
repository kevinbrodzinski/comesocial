import React from 'react';
import PlanStagingSheet from './PlanStagingSheet';
import VenueDetailCard from './VenueDetailCard';
import PlanBottomSheet from './PlanBottomSheet';
import VenueInteractionSheet from './VenueInteractionSheet';
import CreatePlanModal from '../CreatePlanModal';
import MapViewModals from './MapViewModals';
import { MapViewState } from './MapViewState';
import { useMapViewProviders } from './MapViewProviders';
import { usePlanState } from '@/hooks/usePlanState';

interface MapViewModalsContainerProps {
  state: MapViewState;
  providers: ReturnType<typeof useMapViewProviders>;
  handlers: any;
  planHandlers: any;
  venueInteractionHandlers: any;
  handleCreatePlan: (planData: any) => void;
}

const MapViewModalsContainer = ({
  state,
  providers,
  handlers,
  planHandlers,
  venueInteractionHandlers,
  handleCreatePlan
}: MapViewModalsContainerProps) => {
  const { getCurrentPlan, planState } = usePlanState();
  const activePlan = getCurrentPlan();

  const selectedVenueFromPin = providers.mapInteractions.selectedPin ? 
    providers.venues.find(v => v.id === providers.mapInteractions.selectedPin) : null;

  return (
    <>
      {/* Live Planning Components */}
      {providers.livePlanning.selectedVenue && (
        <VenueDetailCard
          venue={providers.livePlanning.selectedVenue}
          onAddToPlan={() => providers.livePlanning.addVenueToPlan(providers.livePlanning.selectedVenue)}
          onClose={providers.livePlanning.closeVenueDetail}
        />
      )}

      <PlanStagingSheet
        isOpen={providers.livePlanning.stagingSheetOpen}
        isMinimized={providers.livePlanning.stagingSheetMinimized}
        stops={providers.livePlanning.planStops}
        onClose={providers.livePlanning.closeStagingSheet}
        onMinimize={providers.livePlanning.minimizeStagingSheet}
        onMaximize={providers.livePlanning.maximizeStagingSheet}
        onAddStop={handlers.handleAddAnotherStop}
        onRemoveStop={providers.livePlanning.removeStopFromPlan}
        onReorderStops={providers.livePlanning.reorderPlanStops}
        onFinalizePlan={handlers.handleFinalizePlan}
        planName={providers.livePlanning.planName}
        onPlanNameChange={providers.livePlanning.setPlanName}
      />

      {/* Plan Bottom Sheet */}
      <PlanBottomSheet
        isOpen={state.planBottomSheetOpen}
        onClose={() => state.setPlanBottomSheetOpen(false)}
        plan={activePlan}
        progressState={planState.planProgressState}
        currentStopIndex={planState.currentStopIndex}
        onPingGroup={() => planHandlers.handlePingGroup(activePlan)}
        onLeaveVenue={planHandlers.handleLeaveVenue}
        onCheckIn={planHandlers.handlePlanCheckIn}
        onMessageFriends={planHandlers.handleMessageFriends}
        onNavigateToVenue={planHandlers.handleNavigateToVenue}
        onMoveToNext={planHandlers.handleMoveToNext}
      />

      {/* Venue Interaction Sheet */}
      <VenueInteractionSheet
        isOpen={state.venueInteractionOpen}
        onClose={() => state.setVenueInteractionOpen(false)}
        venue={state.selectedVenueForInteraction}
        friendsAtVenue={providers.friendsAtVenues[state.selectedVenueForInteraction?.id || 0] || []}
        onPingFriends={venueInteractionHandlers.handlePingFriends}
        onMessageFriends={venueInteractionHandlers.handlePingFriends}
        onJoinFriends={venueInteractionHandlers.handleJoinFriends}
        onCheckIn={venueInteractionHandlers.handleVenueCheckIn}
        onAddToPlan={venueInteractionHandlers.handleAddVenueToPlan}
      />

      {/* Plan Creation Modal */}
      <CreatePlanModal
        isOpen={providers.createPlanModalOpen}
        onClose={() => {
          providers.setCreatePlanModalOpen(false);
          providers.setPlanCreationData(null);
        }}
        onCreatePlan={handleCreatePlan}
        editingPlan={providers.planCreationData}
      />

      {/* Other Modals */}
      <MapViewModals
        favoritesModalOpen={providers.mapInteractions.favoritesModalOpen}
        setFavoritesModalOpen={providers.mapInteractions.setFavoritesModalOpen}
        venueDetailModalOpen={providers.mapInteractions.venueDetailModalOpen}
        setVenueDetailModalOpen={providers.mapInteractions.setVenueDetailModalOpen}
        checkInModalOpen={providers.checkInModalOpen}
        setCheckInModalOpen={providers.setCheckInModalOpen}
        selectedVenueFromPin={selectedVenueFromPin}
        activities={providers.checkInActivity.activities}
        markAllAsRead={providers.checkInActivity.markAllAsRead}
        onVenueSelect={handlers.onViewDetails}
        onSetSelectedPin={providers.mapInteractions.setSelectedPin}
      />
    </>
  );
};

export default MapViewModalsContainer;
