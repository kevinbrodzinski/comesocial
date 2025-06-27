
import { useFriendFiltering } from './map-markers/useFriendFiltering';
import { useVenueMarkers } from './map-markers/useVenueMarkers';
import { useSearchMarkers } from './map-markers/useSearchMarkers';
import { useCoordinateGeneration } from './map-markers/useCoordinateGeneration';
import { useMapBounds } from './map-markers/useMapBounds';
import { useUserLocationMarker } from './map-markers/useUserLocationMarker';
import { useRoutePolyline } from './map-markers/useRoutePolyline';
import { Venue } from '../data/venuesData';

interface UseMapMarkersProps {
  map: google.maps.Map | null;
  filteredVenues: Venue[];
  selectedPin: number | null;
  getVenueColor: (crowdLevel: number) => string;
  onPinClick: (venueId: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  temporarySearchPins?: any[];
  planningMode?: boolean;
  planStops?: any[];
  activePlan?: any | null;
  friendsAtVenues?: { [venueId: number]: any[] };
}

export const useMapMarkers = ({
  map,
  filteredVenues,
  selectedPin,
  getVenueColor,
  onPinClick,
  userLocation,
  temporarySearchPins = [],
  planningMode = false,
  planStops = [],
  activePlan = null,
  friendsAtVenues = {}
}: UseMapMarkersProps) => {
  const filteredFriendsAtVenues = useFriendFiltering({ friendsAtVenues, activePlan });
  const stablePlanStops = useCoordinateGeneration(planStops);
  const { updateMapBounds } = useMapBounds({ map, userLocation });

  const markers = useVenueMarkers({
    map,
    filteredVenues,
    selectedPin,
    getVenueColor,
    onPinClick,
    planningMode,
    temporarySearchPinsLength: temporarySearchPins.length
  });

  const temporaryMarkers = useSearchMarkers({
    map,
    temporarySearchPins,
    updateMapBounds
  });

  const userLocationMarker = useUserLocationMarker({ map, userLocation });
  const routePolyline = useRoutePolyline({ map, planningMode, stablePlanStops });

  return {
    markers,
    temporaryMarkers,
    userLocationMarker,
    routePolyline,
    filteredFriendsAtVenues
  };
};
