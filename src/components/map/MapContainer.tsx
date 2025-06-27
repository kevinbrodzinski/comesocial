
import React from 'react';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { MapRenderingOverlay } from './MapLoadingStates';
import { Venue } from '../../data/venuesData';
import { Friend } from '../../data/friendsData';
import { isFeatureEnabled } from '../../utils/featureFlags';

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  map: google.maps.Map | null;
  mapReady: boolean;
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

const MapContainer = ({
  mapRef,
  map,
  mapReady,
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
}: MapContainerProps) => {
  const useResponsiveMap = isFeatureEnabled('responsive_map_v2');

  console.log('🗺️ MapContainer render state:', {
    map: !!map,
    mapReady,
    userLocation,
    useResponsiveMap,
    mapRefDimensions: mapRef.current ? { 
      width: mapRef.current.offsetWidth, 
      height: mapRef.current.offsetHeight 
    } : null
  });

  // Use the markers hook to manage all map markers and overlays
  const { filteredFriendsAtVenues } = useMapMarkers({
    map,
    filteredVenues,
    selectedPin,
    getVenueColor,
    onPinClick,
    userLocation,
    temporarySearchPins,
    planningMode,
    planStops,
    activePlan,
    friendsAtVenues
  });

  if (useResponsiveMap) {
    return (
      <div className="w-full h-full flex flex-col">
        <div 
          ref={mapRef} 
          className="flex-1 w-full" 
          data-map-container="true"
        />
        <MapRenderingOverlay 
          map={map} 
          mapReady={mapReady} 
          userLocation={userLocation} 
        />
      </div>
    );
  }

  // Fallback to original layout
  return (
    <div className="flex-1 relative w-full min-h-[400px]">
      <div 
        ref={mapRef} 
        className="w-full h-full absolute inset-0" 
        data-map-container="true"
      />
      <MapRenderingOverlay 
        map={map} 
        mapReady={mapReady} 
        userLocation={userLocation} 
      />
    </div>
  );
};

export default MapContainer;
