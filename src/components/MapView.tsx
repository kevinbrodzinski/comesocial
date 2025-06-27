
import React from 'react';
import PlanMapView from './map/PlanMapView';
import MapViewMainContent from './map/MapViewMainContent';
import MapViewModalsContainer from './map/MapViewModalsContainer';
import { useMapViewProviders } from './map/MapViewProviders';
import { useMapViewState } from './map/MapViewState';
import { useMapViewEffects } from './map/MapViewEffects';
import { useLocationPermission } from '../hooks/useLocationPermission';

const MapView = () => {
  const { userLocation, locationPermission, requestLocation } = useLocationPermission();
  const providers = useMapViewProviders();
  const state = useMapViewState();
  const {
    handlers,
    planHandlers,
    venueInteractionHandlers,
    handleEnhancedPinClick,
    handleOpenPlanSheet,
    handleCreatePlan
  } = useMapViewEffects({ state, providers });

  // Merge location data with providers
  const enhancedProviders = {
    ...providers,
    userLocation,
    locationPermission,
    requestLocation
  };

  // If a plan is selected for map view, show the plan map
  if (providers.selectedPlanForMap) {
    return (
      <PlanMapView
        plan={providers.selectedPlanForMap}
        onBack={() => providers.setSelectedPlanForMap(null)}
        userLocation={userLocation}
      />
    );
  }

  return (
    <>
      <MapViewMainContent
        state={state}
        providers={enhancedProviders}
        handlers={handlers}
        planHandlers={planHandlers}
        handleEnhancedPinClick={handleEnhancedPinClick}
        handleOpenPlanSheet={handleOpenPlanSheet}
      />

      <MapViewModalsContainer
        state={state}
        providers={enhancedProviders}
        handlers={handlers}
        planHandlers={planHandlers}
        venueInteractionHandlers={venueInteractionHandlers}
        handleCreatePlan={handleCreatePlan}
      />
    </>
  );
};

export default MapView;
