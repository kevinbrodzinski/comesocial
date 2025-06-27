
import React, { useState, useEffect } from 'react';
import { getAPIKey } from '../../config/novaConfig';
import { Venue } from '../../data/venuesData';
import { Friend } from '../../data/friendsData';
import { useGoogleMapsLoader } from '../../hooks/useGoogleMapsLoader';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { MapSetupRequired, MapErrorState, MapInitErrorState, MapLoadingState } from './MapLoadingStates';
import MapContainer from './MapContainer';
import MapErrorBanner from './MapErrorBanner';
import StaticErrorState from './StaticErrorState';
import { isFeatureEnabled } from '@/utils/featureFlags';

interface RealGoogleMapProps {
  filteredVenues: Venue[];
  selectedPin: number | null;
  onPinClick: (venueId: number) => void;
  friendsAtVenues: { [venueId: number]: Friend[] };
  getVenueColor: (crowdLevel: number) => string;
  userLocation?: { lat: number; lng: number } | null;
  temporarySearchPins?: any[];
  planningMode?: boolean;
  planStops?: any[];
  activePlan?: any | null;
}

const RealGoogleMap = ({ 
  filteredVenues, 
  selectedPin, 
  onPinClick, 
  friendsAtVenues,
  getVenueColor,
  userLocation,
  temporarySearchPins = [],
  planningMode = false,
  planStops = [],
  activePlan = null
}: RealGoogleMapProps) => {
  const apiKey = getAPIKey('google');
  const { isLoaded, isLoading, error, retry } = useGoogleMapsLoader(apiKey);
  const { mapRef, map, mapInitError, mapReady } = useMapInitialization({ 
    isLoaded, 
    userLocation 
  });

  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorType, setErrorType] = useState<'missing_key' | 'invalid_key' | 'referrer_blocked' | 'timeout' | 'unknown'>('unknown');

  // Debug logging for responsive map layout
  useEffect(() => {
    if (isFeatureEnabled('responsive_map_v2') && mapRef.current) {
      const container = mapRef.current;
      console.log('🗺️ Map container dimensions:', {
        width: container.offsetWidth,
        height: container.offsetHeight,
        parentHeight: container.parentElement?.offsetHeight,
        parentWidth: container.parentElement?.offsetWidth,
        computedHeight: window.getComputedStyle(container).height,
        computedWidth: window.getComputedStyle(container).width
      });
    }
  }, [mapRef.current, map]);

  // Listen for custom map events if feature flag is enabled
  useEffect(() => {
    if (!isFeatureEnabled('map_loader_fix_v1')) return;

    const handleMapError = (event: CustomEvent) => {
      console.log('🗺️ Map error event received:', event.detail);
      setErrorType(event.detail?.reason || 'unknown');
      setShowErrorBanner(true);
    };

    const handleMapLoaded = () => {
      console.log('🗺️ Map loaded event received');
      setShowErrorBanner(false);
    };

    window.addEventListener('maps:error', handleMapError as EventListener);
    window.addEventListener('maps:loaded', handleMapLoaded);

    return () => {
      window.removeEventListener('maps:error', handleMapError as EventListener);
      window.removeEventListener('maps:loaded', handleMapLoaded);
    };
  }, []);

  if (import.meta.env.DEV && isFeatureEnabled('map_loader_fix_v1')) {
    console.log('🗺️ RealGoogleMap render state:', {
      apiKey: apiKey ? 'present' : 'missing',
      isLoaded,
      isLoading,
      error,
      mapInitError,
      map: !!map,
      mapReady,
      userLocation,
      showErrorBanner,
      errorType
    });
  }

  // Handle API key missing - show setup instructions
  if (!apiKey) {
    return <MapSetupRequired filteredVenues={filteredVenues} userLocation={userLocation} />;
  }

  // Handle loading error with enhanced banner
  if (error && isFeatureEnabled('map_loader_fix_v1')) {
    return (
      <div className="flex-1 relative min-h-[400px] h-full">
        <MapErrorBanner
          errorType={errorType}
          errorMessage={error}
          onRetry={retry}
        />
        <StaticErrorState
          onRetry={retry}
          errorMessage={error}
        />
      </div>
    );
  }

  // Handle loading error (fallback)
  if (error) {
    return <MapErrorState error={error} onRetry={retry} />;
  }

  // Handle map initialization error
  if (mapInitError) {
    return <MapInitErrorState mapInitError={mapInitError} />;
  }

  // Handle loading state
  if (isLoading || !isLoaded) {
    return <MapLoadingState isLoading={isLoading} />;
  }

  return (
    <div className="flex-1 relative min-h-[400px] h-full w-full">
      {/* Enhanced error banner overlay */}
      {showErrorBanner && isFeatureEnabled('map_loader_fix_v1') && (
        <MapErrorBanner
          errorType={errorType}
          errorMessage={error || 'Unknown map error'}
          onRetry={() => {
            setShowErrorBanner(false);
            retry();
          }}
        />
      )}
      
      <MapContainer
        mapRef={mapRef}
        map={map}
        mapReady={mapReady}
        filteredVenues={filteredVenues}
        selectedPin={selectedPin}
        onPinClick={onPinClick}
        friendsAtVenues={friendsAtVenues}
        getVenueColor={getVenueColor}
        userLocation={userLocation}
        temporarySearchPins={temporarySearchPins}
        planningMode={planningMode}
        planStops={planStops}
        activePlan={activePlan}
      />
    </div>
  );
};

export default RealGoogleMap;
