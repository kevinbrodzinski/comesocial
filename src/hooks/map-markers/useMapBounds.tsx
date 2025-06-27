
import { useState, useCallback } from 'react';

interface UseMapBoundsProps {
  map: google.maps.Map | null;
  userLocation?: { lat: number; lng: number } | null;
}

export const useMapBounds = ({ map, userLocation }: UseMapBoundsProps) => {
  const [lastBoundsUpdateTime, setLastBoundsUpdateTime] = useState(0);

  const updateMapBounds = useCallback((markers: google.maps.Marker[], immediate: boolean = false) => {
    if (!map || markers.length === 0) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastBoundsUpdateTime;
    
    if (!immediate && timeSinceLastUpdate < 500) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
      const position = marker.getPosition();
      if (position) bounds.extend(position);
    });

    if (userLocation) {
      bounds.extend(userLocation);
    }

    map.fitBounds(bounds);

    setTimeout(() => {
      const newZoom = map.getZoom() || 14;
      if (newZoom > 16) {
        map.setZoom(16);
      } else if (newZoom < 12) {
        map.setZoom(12);
      }
    }, 100);

    setLastBoundsUpdateTime(now);
  }, [map, userLocation, lastBoundsUpdateTime]);

  return { updateMapBounds };
};
