import { useState, useEffect, useRef } from 'react';

export const useLocationPermission = () => {
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied' | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const hasRequestedRef = useRef(false);

  // Auto-request location on component mount (only once)
  useEffect(() => {
    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      requestLocation();
    }
  }, []);

  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setIsWatching(false);
        console.log('🌍 Location watch cleaned up on unmount');
      }
    };
  }, []);

  const requestLocation = async () => {
    console.log('🌍 Requesting location permission...');
    setLocationPermission('pending');
    setLocationError(null);

    if (!navigator.geolocation) {
      console.error('🌍 Geolocation not supported');
      setLocationError('Geolocation is not supported by this browser');
      setLocationPermission('denied');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('🌍 Location permission granted');
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationPermission('granted');
          setLocationError(null);
          
          // Start watching position for continuous updates
          startWatchingLocation();
        },
        (error) => {
          console.error('🌍 Location permission denied or error:', error);
          setLocationPermission('denied');
          setIsWatching(false);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('Location access denied by user');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location information unavailable');
              break;
            case error.TIMEOUT:
              setLocationError('Location request timed out');
              break;
            default:
              setLocationError('An unknown error occurred while retrieving location');
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (error) {
      console.error('🌍 Error requesting location:', error);
      setLocationError('Failed to request location');
      setLocationPermission('denied');
    }
  };

  const startWatchingLocation = () => {
    // Prevent multiple watch instances
    if (isWatching || !navigator.geolocation || watchIdRef.current !== null) {
      console.log('🌍 Location watch already active or not available');
      return;
    }
    
    console.log('🌍 Starting location watch...');
    setIsWatching(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('🌍 Location updated:', newLocation);
        setUserLocation(newLocation);
      },
      (error) => {
        console.warn('🌍 Location watch error (keeping last known location):', error.message);
        // Don't flood console with repeated errors, just log once and keep using last location
      },
      {
        enableHighAccuracy: false, // Less battery intensive for watching
        timeout: 30000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  const stopWatchingLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
      console.log('🌍 Location watch stopped');
    }
  };

  return {
    locationPermission,
    userLocation,
    locationError,
    requestLocation,
    isWatching,
    stopWatchingLocation
  };
};
