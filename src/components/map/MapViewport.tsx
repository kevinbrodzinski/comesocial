
import React from 'react';
import MapContent from './MapContent';
import MapFloatingControls from './MapFloatingControls';
import { isFeatureEnabled } from '../../utils/featureFlags';
import { Venue } from '../../data/venuesData';
import { Friend } from '../../data/friendsData';

interface MapViewportProps {
  filteredVenues: Venue[];
  selectedPin: number | null;
  selectedVenue: Venue | null;
  searchFocused: boolean;
  getVenueColor: (crowdLevel: number) => string;
  onPinClick: (venueId: number) => void;
  onClosePreview: () => void;
  onViewDetails: () => void;
  onResetFilters: () => void;
  friendsAtVenues: { [venueId: number]: Friend[] };
  onFriendMessage: (friends: Friend[], venue?: string) => void;
  onFriendJoinPlan: (friend: Friend) => void;
  userLocation?: { lat: number; lng: number } | null;
  locationPermission?: 'denied' | 'granted' | 'pending' | null;
  onRequestLocation?: () => void;
  temporarySearchPins?: any[];
  planningMode?: boolean;
  planStops?: any[];
  activePlan?: any | null;
}

const MapViewport = (props: MapViewportProps) => {
  const useResponsiveMap = isFeatureEnabled('responsive_map_v2');

  if (useResponsiveMap) {
    return (
      <div className="flex-1 relative">
        <MapContent {...props} />
        <MapFloatingControls />
      </div>
    );
  }

  // Fallback to original layout
  return (
    <div className="flex-1 min-h-0">
      <MapContent {...props} />
    </div>
  );
};

export default MapViewport;
