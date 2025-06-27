
import React from 'react';
import { Venue } from '../../data/venuesData';
import { Friend } from '@/data/friendsData';
import RealGoogleMap from './RealGoogleMap';
import CrowdLevelLegend from './CrowdLevelLegend';
import VenuePreview from './VenuePreview';
import EmptyMapState from './EmptyMapState';
import FriendAvatarsOverlay from './FriendAvatarsOverlay';
import { Button } from '@/components/ui/button';
import { Locate } from 'lucide-react';
import MapErrorBoundary from './MapErrorBoundary';

interface MapContentProps {
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

const MapContent = ({
  filteredVenues,
  selectedPin,
  selectedVenue,
  searchFocused,
  getVenueColor,
  onPinClick,
  onClosePreview,
  onViewDetails,
  onResetFilters,
  friendsAtVenues,
  onFriendMessage,
  onFriendJoinPlan,
  userLocation,
  locationPermission,
  onRequestLocation,
  temporarySearchPins = [],
  planningMode = false,
  planStops = [],
  activePlan = null
}: MapContentProps) => {
  return (
    <div className="w-full relative overflow-hidden" style={{ height: 'calc(100dvh - var(--map-header-h) - 4rem)' }}>
      <MapErrorBoundary>
        <RealGoogleMap
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
      </MapErrorBoundary>

      {/* Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {!planningMode && <CrowdLevelLegend />}

        {/* Location Permission Button */}
        {locationPermission !== 'granted' && onRequestLocation && (
          <div className="absolute top-4 right-4 pointer-events-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRequestLocation}
              className="bg-card border border-border shadow-lg"
            >
              <Locate size={16} className="mr-2" />
              Enable Location
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredVenues.length === 0 && !planningMode && (
          <div className="pointer-events-auto">
            <EmptyMapState onResetFilters={onResetFilters} />
          </div>
        )}

        {/* Friend Avatars Overlay - Hidden in planning mode */}
        {!planningMode && (
          <div className="pointer-events-auto">
            <FriendAvatarsOverlay
              friendsAtVenues={friendsAtVenues}
              venues={filteredVenues}
              onMessage={(friends, venueName) => {
                // Find the venue by name
                let venue = filteredVenues.find(v => v.name === venueName);
                if (!venue && filteredVenues.length > 0) {
                  venue = filteredVenues[0];
                }
                if (venue && typeof window !== 'undefined') {
                  // Custom event to trigger opening the interaction sheet
                  const event = new CustomEvent('openVenueInteractionSheet', { detail: { venue } });
                  window.dispatchEvent(event);
                }
              }}
              onJoinPlan={onFriendJoinPlan}
            />
          </div>
        )}

        {/* Selected Venue Mini Preview - Only in normal mode */}
        {selectedVenue && !planningMode && (
          <div className="pointer-events-auto">
            <VenuePreview
              venue={selectedVenue}
              onClose={onClosePreview}
              onViewDetails={onViewDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContent;
