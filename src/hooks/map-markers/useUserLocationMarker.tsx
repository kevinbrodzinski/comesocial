
import { useState, useEffect } from 'react';

interface UseUserLocationMarkerProps {
  map: google.maps.Map | null;
  userLocation?: { lat: number; lng: number } | null;
}

export const useUserLocationMarker = ({ map, userLocation }: UseUserLocationMarkerProps) => {
  const [userLocationMarker, setUserLocationMarker] = useState<google.maps.Marker | null>(null);
  const [accuracyCircle, setAccuracyCircle] = useState<google.maps.Circle | null>(null);
  const [hasInitiallyCenter, setHasInitiallyCenter] = useState(false);

  useEffect(() => {
    if (!map || !userLocation) {
      // Clean up existing markers if no location
      if (userLocationMarker) {
        userLocationMarker.setMap(null);
        setUserLocationMarker(null);
      }
      if (accuracyCircle) {
        accuracyCircle.setMap(null);
        setAccuracyCircle(null);
      }
      return;
    }

    console.log('🗺️ Adding user location marker:', userLocation);

    // Remove existing markers
    if (userLocationMarker) {
      userLocationMarker.setMap(null);
    }
    if (accuracyCircle) {
      accuracyCircle.setMap(null);
    }

    // Create accuracy circle first
    const circle = new google.maps.Circle({
      center: userLocation,
      radius: 100, // 100 meter accuracy radius
      map,
      fillColor: '#4285f4',
      fillOpacity: 0.1,
      strokeColor: '#4285f4',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      zIndex: 999
    });

    // Create user location marker with improved visibility
    const marker = new google.maps.Marker({
      position: userLocation,
      map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: '#4285f4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 4
      },
      zIndex: 1000
    });

    // Center map on user location (only on first time we get location)
    if (!hasInitiallyCenter) {
      map.setCenter(userLocation);
      map.setZoom(15);
      setHasInitiallyCenter(true);
      console.log('🗺️ Centered map on user location');
    } else {
      // Just update position for subsequent updates
      console.log('🗺️ Updated user location marker position');
    }

    setUserLocationMarker(marker);
    setAccuracyCircle(circle);
  }, [map, userLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (userLocationMarker) {
        userLocationMarker.setMap(null);
      }
      if (accuracyCircle) {
        accuracyCircle.setMap(null);
      }
    };
  }, []);

  return { userLocationMarker, accuracyCircle };
};
