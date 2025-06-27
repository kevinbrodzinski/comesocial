
import { useState, useEffect } from 'react';
import { Venue } from '../../data/venuesData';

interface UseVenueMarkersProps {
  map: google.maps.Map | null;
  filteredVenues: Venue[];
  selectedPin: number | null;
  getVenueColor: (crowdLevel: number) => string;
  onPinClick: (venueId: number) => void;
  planningMode: boolean;
  temporarySearchPinsLength: number;
}

// Helper function to create marker icon for legacy markers
const createMarkerIcon = (color: string, isSelected: boolean) => {
  const fillColor = color.includes('red') ? '#ef4444' :
                   color.includes('yellow') ? '#eab308' :
                   color.includes('green') ? '#22c55e' : '#3b82f6';
  
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: isSelected ? 12 : 8,
    fillColor,
    fillOpacity: 0.8,
    strokeColor: '#ffffff',
    strokeWeight: 2
  };
};

// Helper function to create modern marker element if available
const createModernMarker = (position: google.maps.LatLngLiteral, title: string, color: string, isSelected: boolean) => {
  // Check if modern marker API is available
  if (window.google?.maps?.marker?.AdvancedMarkerElement) {
    try {
      // Create a custom marker element
      const markerElement = document.createElement('div');
      markerElement.style.width = isSelected ? '24px' : '16px';
      markerElement.style.height = isSelected ? '24px' : '16px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '2px solid white';
      markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      markerElement.style.cursor = 'pointer';
      
      const fillColor = color.includes('red') ? '#ef4444' :
                       color.includes('yellow') ? '#eab308' :
                       color.includes('green') ? '#22c55e' : '#3b82f6';
      markerElement.style.backgroundColor = fillColor;
      
      return new google.maps.marker.AdvancedMarkerElement({
        position,
        title,
        content: markerElement
      });
    } catch (error) {
      console.warn('🗺️ Failed to create modern marker, falling back to legacy:', error);
      return null;
    }
  }
  return null;
};

export const useVenueMarkers = ({
  map,
  filteredVenues,
  selectedPin,
  getVenueColor,
  onPinClick,
  planningMode,
  temporarySearchPinsLength
}: UseVenueMarkersProps) => {
  const [markers, setMarkers] = useState<(google.maps.Marker | google.maps.marker.AdvancedMarkerElement)[]>([]);

  useEffect(() => {
    if (!map || (planningMode && temporarySearchPinsLength > 0)) return;

    // Clean up existing markers
    markers.forEach(marker => {
      if (marker instanceof google.maps.Marker) {
        marker.setMap(null);
      } else if (marker.map) {
        marker.map = null;
      }
    });

    const newMarkers = filteredVenues.map(venue => {
      const lat = 40.7128 + (venue.y - 50) * 0.01;
      const lng = -74.0060 + (venue.x - 50) * 0.01;
      const position = { lat, lng };
      const isSelected = selectedPin === venue.id;
      const color = getVenueColor(venue.crowdLevel);

      // Try to use modern marker first, fallback to legacy marker
      const modernMarker = createModernMarker(position, venue.name, color, isSelected);
      
      if (modernMarker) {
        modernMarker.map = map;
        modernMarker.addListener('click', () => {
          onPinClick(venue.id);
        });
        
        if (import.meta.env.DEV) {
          console.log('🗺️ Created modern marker for:', venue.name);
        }
        
        return modernMarker;
      } else {
        // Fallback to legacy marker
        if (import.meta.env.DEV) {
          console.log('🗺️ Using legacy marker for:', venue.name);
        }
        
        const marker = new google.maps.Marker({
          position,
          map,
          title: venue.name,
          icon: createMarkerIcon(color, isSelected),
          zIndex: planningMode ? 500 : 800
        });

        marker.addListener('click', () => {
          onPinClick(venue.id);
        });

        return marker;
      }
    });

    setMarkers(newMarkers);
  }, [map, filteredVenues, selectedPin, getVenueColor, onPinClick, planningMode, temporarySearchPinsLength]);

  // Update marker selection state
  useEffect(() => {
    markers.forEach((marker, index) => {
      const venue = filteredVenues[index];
      if (venue) {
        const isSelected = selectedPin === venue.id;
        const color = getVenueColor(venue.crowdLevel);
        
        if (marker instanceof google.maps.Marker) {
          // Legacy marker update
          const icon = marker.getIcon() as google.maps.Symbol;
          if (icon) {
            marker.setIcon({
              ...icon,
              scale: isSelected ? 12 : 8
            });
          }
        } else if (marker.content instanceof HTMLElement) {
          // Modern marker update
          marker.content.style.width = isSelected ? '24px' : '16px';
          marker.content.style.height = isSelected ? '24px' : '16px';
        }
      }
    });
  }, [selectedPin, markers, filteredVenues, getVenueColor]);

  return markers;
};
