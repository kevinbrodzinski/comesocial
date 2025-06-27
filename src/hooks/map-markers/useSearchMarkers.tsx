
import { useState, useEffect, useMemo } from 'react';
import { generateStableCoordinates } from '../../utils/coordinateUtils';

interface UseSearchMarkersProps {
  map: google.maps.Map | null;
  temporarySearchPins: any[];
  updateMapBounds: (markers: google.maps.Marker[], immediate?: boolean) => void;
}

export const useSearchMarkers = ({ map, temporarySearchPins, updateMapBounds }: UseSearchMarkersProps) => {
  const [temporaryMarkers, setTemporaryMarkers] = useState<google.maps.Marker[]>([]);

  const stableSearchCoordinates = useMemo(() => {
    return temporarySearchPins.map((pin) => {
      if (pin.placeData?.geometry?.location) {
        return {
          ...pin,
          lat: pin.placeData.geometry.location.lat,
          lng: pin.placeData.geometry.location.lng
        };
      }
      
      if (pin.fallbackData?.coordinates) {
        return {
          ...pin,
          lat: pin.fallbackData.coordinates.lat,
          lng: pin.fallbackData.coordinates.lng
        };
      }

      const coords = generateStableCoordinates(pin.id || '', pin.name || '', 0);
      return {
        ...pin,
        lat: coords.lat,
        lng: coords.lng
      };
    });
  }, [temporarySearchPins]);

  useEffect(() => {
    if (!map) return;

    temporaryMarkers.forEach(marker => marker.setMap(null));

    if (stableSearchCoordinates.length === 0) {
      setTemporaryMarkers([]);
      return;
    }

    const newTempMarkers = stableSearchCoordinates.map((pin) => {
      const marker = new google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map,
        title: pin.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        zIndex: 999,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        console.log('Clicked search pin:', pin.name);
      });

      return marker;
    });

    setTemporaryMarkers(newTempMarkers);

    if (newTempMarkers.length > 0) {
      updateMapBounds(newTempMarkers);
    }
  }, [map, stableSearchCoordinates, updateMapBounds]);

  return temporaryMarkers;
};
