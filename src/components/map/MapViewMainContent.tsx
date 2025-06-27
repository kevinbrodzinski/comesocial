import React from 'react';
import MapHeader from './MapHeader';
import MapViewport from './MapViewport';
import FloatingPlanBar from './FloatingPlanBar';
import LivePlanSheet from './LivePlanSheet';
import { MapViewState } from './MapViewState';
import { useMapViewProviders } from './MapViewProviders';
import { isFeatureEnabled } from '../../utils/featureFlags';

interface MapViewMainContentProps {
  state: MapViewState;
  providers: ReturnType<typeof useMapViewProviders>;
  handlers: any;
  planHandlers: any;
  handleEnhancedPinClick: (venueId: number) => void;
  handleOpenPlanSheet: () => void;
}

const MapViewMainContent = ({
  state,
  providers,
  handlers,
  planHandlers,
  handleEnhancedPinClick,
  handleOpenPlanSheet
}: MapViewMainContentProps) => {
  const activePlan = providers.planState.getCurrentPlan();
  const useResponsiveMap = isFeatureEnabled('responsive_map_v2');

  const selectedVenueFromPin = providers.mapInteractions.selectedPin ? 
    providers.venues.find(v => v.id === providers.mapInteractions.selectedPin) : null;

  // Listen for custom event to open the venue interaction sheet
  React.useEffect(() => {
    function handleOpenVenueInteractionSheet(e: CustomEvent) {
      const venue = e.detail.venue;
      state.setSelectedVenueForInteraction(venue);
      state.setVenueInteractionOpen(true);
    }
    window.addEventListener('openVenueInteractionSheet', handleOpenVenueInteractionSheet as EventListener);
    return () => {
      window.removeEventListener('openVenueInteractionSheet', handleOpenVenueInteractionSheet as EventListener);
    };
  }, [state]);

  if (useResponsiveMap) {
    return (
      <div className="flex flex-col h-full">
        {/* Header - Fixed at top */}
        <div className="flex-none">
          <MapHeader
            searchQuery={providers.mapSearch.searchQuery}
            setSearchQuery={handlers.handleSearchQueryChange}
            searchFocused={providers.mapSearch.searchFocused}
            onSearchFocus={providers.mapSearch.handleSearchFocus}
            onSearchBlur={providers.mapSearch.handleSearchBlur}
            onSearchResultSelect={handlers.onSearchResultSelect}
            onSearchQuickAction={handlers.handleSearchQuickAction}
            selectedFilters={providers.mapFilters.selectedFilters}
            onToggleFilter={providers.mapFilters.toggleFilter}
            crowdFilter={providers.mapFilters.crowdFilter}
            setCrowdFilter={providers.mapFilters.setCrowdFilter}
            vibeFilters={providers.mapFilters.vibeFilters}
            onToggleVibeFilter={providers.mapFilters.toggleVibeFilter}
            openNowOnly={providers.mapFilters.openNowOnly}
            setOpenNowOnly={providers.mapFilters.setOpenNowOnly}
            distanceFilter={providers.mapFilters.distanceFilter}
            setDistanceFilter={providers.mapFilters.setDistanceFilter}
            onResetFilters={providers.mapFilters.resetFilters}
            onFavoritesClick={providers.mapInteractions.handleFavoritesClick}
            onNotificationClick={handlers.handleNotificationClick}
            onMessagesClick={() => {
              window.location.href = '/messages';
            }}
            hasUnreadNotifications={providers.checkInActivity.hasUnread}
            filteredVenuesCount={providers.mapFilters.filteredVenues.length}
            totalVenuesCount={providers.venues.length}
            planningMode={providers.livePlanning.planningMode}
            onShowTemporaryPins={handlers.handleShowTemporaryPins}
            searchInputRef={providers.searchInputRef}
          />
        </div>

        {/* Map Viewport - Takes remaining height between header and footer */}
        <div className="flex-1 min-h-0">
          <MapViewport
            filteredVenues={providers.mapFilters.filteredVenues}
            selectedPin={providers.mapInteractions.selectedPin}
            selectedVenue={selectedVenueFromPin}
            searchFocused={providers.mapSearch.searchFocused}
            getVenueColor={providers.getVenueColor}
            onPinClick={handleEnhancedPinClick}
            onClosePreview={() => providers.mapInteractions.setSelectedPin(null)}
            onViewDetails={handlers.onViewDetails}
            onResetFilters={providers.mapFilters.resetFilters}
            friendsAtVenues={providers.friendsAtVenues}
            onFriendMessage={handlers.handleFriendMessage}
            onFriendJoinPlan={handlers.handleFriendJoinPlan}
            userLocation={providers.userLocation}
            locationPermission={providers.locationPermission}
            onRequestLocation={providers.requestLocation}
            temporarySearchPins={providers.temporarySearchPins}
            planningMode={providers.livePlanning.planningMode}
            planStops={providers.livePlanning.planStops}
            activePlan={activePlan}
          />
        </div>

        {/* FloatingPlanBar - Renders with its own fixed positioning, no wrapper needed */}
        {activePlan && (
          <FloatingPlanBar
            plan={activePlan}
            progressState={providers.planState.planState.planProgressState}
            currentStopIndex={providers.planState.planState.currentStopIndex}
            onOpenPlanSheet={handleOpenPlanSheet}
            onCheckIn={planHandlers.handleCheckIn}
            onStartNight={planHandlers.handleStartNight}
            onMoveToNext={planHandlers.handleMoveToNext}
            onShowOptions={() => {}}
          />
        )}

        {/* Live Plan Sheet - Overlays above everything when active */}
        {activePlan && (
          <LivePlanSheet
            isOpen={state.planSheetOpen}
            onClose={() => state.setPlanSheetOpen(false)}
            plan={activePlan}
            progressState={providers.planState.planState.planProgressState}
            currentStopIndex={providers.planState.planState.currentStopIndex}
            onPingGroup={planHandlers.handlePingGroup}
            onLeaveVenue={planHandlers.handleLeaveVenue}
            onCheckIn={planHandlers.handleCheckIn}
            onMessageFriends={planHandlers.handleMessageFriends}
            onNavigateToVenue={planHandlers.handleNavigateToVenue}
            onMoveToNext={planHandlers.handleMoveToNext}
          />
        )}
      </div>
    );
  }

  // Fallback to original layout
  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed at top */}
      <div className="flex-none">
        <MapHeader
          searchQuery={providers.mapSearch.searchQuery}
          setSearchQuery={handlers.handleSearchQueryChange}
          searchFocused={providers.mapSearch.searchFocused}
          onSearchFocus={providers.mapSearch.handleSearchFocus}
          onSearchBlur={providers.mapSearch.handleSearchBlur}
          onSearchResultSelect={handlers.onSearchResultSelect}
          onSearchQuickAction={handlers.handleSearchQuickAction}
          selectedFilters={providers.mapFilters.selectedFilters}
          onToggleFilter={providers.mapFilters.toggleFilter}
          crowdFilter={providers.mapFilters.crowdFilter}
          setCrowdFilter={providers.mapFilters.setCrowdFilter}
          vibeFilters={providers.mapFilters.vibeFilters}
          onToggleVibeFilter={providers.mapFilters.toggleVibeFilter}
          openNowOnly={providers.mapFilters.openNowOnly}
          setOpenNowOnly={providers.mapFilters.setOpenNowOnly}
          distanceFilter={providers.mapFilters.distanceFilter}
          setDistanceFilter={providers.mapFilters.setDistanceFilter}
          onResetFilters={providers.mapFilters.resetFilters}
          onFavoritesClick={providers.mapInteractions.handleFavoritesClick}
          onNotificationClick={handlers.handleNotificationClick}
          onMessagesClick={() => {
            window.location.href = '/messages';
          }}
          hasUnreadNotifications={providers.checkInActivity.hasUnread}
          filteredVenuesCount={providers.mapFilters.filteredVenues.length}
          totalVenuesCount={providers.venues.length}
          planningMode={providers.livePlanning.planningMode}
          onShowTemporaryPins={handlers.handleShowTemporaryPins}
          searchInputRef={providers.searchInputRef}
        />
      </div>

      {/* Map Area - Takes remaining height */}
      <div className="flex-1 min-h-0">
        <MapViewport
          filteredVenues={providers.mapFilters.filteredVenues}
          selectedPin={providers.mapInteractions.selectedPin}
          selectedVenue={selectedVenueFromPin}
          searchFocused={providers.mapSearch.searchFocused}
          getVenueColor={providers.getVenueColor}
          onPinClick={handleEnhancedPinClick}
          onClosePreview={() => providers.mapInteractions.setSelectedPin(null)}
          onViewDetails={handlers.onViewDetails}
          onResetFilters={providers.mapFilters.resetFilters}
          friendsAtVenues={providers.friendsAtVenues}
          onFriendMessage={handlers.handleFriendMessage}
          onFriendJoinPlan={handlers.handleFriendJoinPlan}
          userLocation={providers.userLocation}
          locationPermission={providers.locationPermission}
          onRequestLocation={providers.requestLocation}
          temporarySearchPins={providers.temporarySearchPins}
          planningMode={providers.livePlanning.planningMode}
          planStops={providers.livePlanning.planStops}
          activePlan={activePlan}
        />
      </div>

      {/* FloatingPlanBar and LivePlanSheet - No wrapper conflicts */}
      {activePlan && (
        <>
          <FloatingPlanBar
            plan={activePlan}
            progressState={providers.planState.planState.planProgressState}
            currentStopIndex={providers.planState.planState.currentStopIndex}
            onOpenPlanSheet={handleOpenPlanSheet}
            onCheckIn={planHandlers.handleCheckIn}
            onStartNight={planHandlers.handleStartNight}
            onMoveToNext={planHandlers.handleMoveToNext}
            onShowOptions={() => {}}
          />

          <LivePlanSheet
            isOpen={state.planSheetOpen}
            onClose={() => state.setPlanSheetOpen(false)}
            plan={activePlan}
            progressState={providers.planState.planState.planProgressState}
            currentStopIndex={providers.planState.planState.currentStopIndex}
            onPingGroup={planHandlers.handlePingGroup}
            onLeaveVenue={planHandlers.handleLeaveVenue}
            onCheckIn={planHandlers.handleCheckIn}
            onMessageFriends={planHandlers.handleMessageFriends}
            onNavigateToVenue={planHandlers.handleNavigateToVenue}
            onMoveToNext={planHandlers.handleMoveToNext}
          />
        </>
      )}
    </div>
  );
};

export default MapViewMainContent;
