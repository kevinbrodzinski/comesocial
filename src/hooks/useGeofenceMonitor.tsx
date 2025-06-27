
import { useState, useEffect } from 'react';
import { useLocationPermission } from './useLocationPermission';
import { Venue } from '@/data/venuesData';

interface GeofenceEvent {
  venueId: number;
  venue: string;
  eventType: 'enter' | 'exit';
  timestamp: Date;
}

interface GeofenceZone {
  venueId: number;
  venue: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

export const useGeofenceMonitor = (venues: Venue[]) => {
  const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEvent[]>([]);
  const [currentVenue, setCurrentVenue] = useState<number | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { userLocation, locationPermission, requestLocation } = useLocationPermission();

  // Convert venue data to geofence zones (mock coordinates for demo)
  const geofenceZones: GeofenceZone[] = venues.map(venue => ({
    venueId: venue.id,
    venue: venue.name,
    latitude: 40.7128 + (venue.id * 0.01), // Mock coordinates around NYC
    longitude: -74.0060 + (venue.id * 0.01),
    radius: 100 // 100 meter radius
  }));

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkGeofences = () => {
    if (!userLocation || !isMonitoring) return;

    const { lat, lng } = userLocation;
    let nearestVenue: number | null = null;

    // Check which venue the user is closest to within radius
    for (const zone of geofenceZones) {
      const distance = calculateDistance(lat, lng, zone.latitude, zone.longitude);
      
      if (distance <= zone.radius) {
        nearestVenue = zone.venueId;
        break;
      }
    }

    // Handle venue entry/exit
    if (nearestVenue !== currentVenue) {
      const now = new Date();

      // Exit previous venue
      if (currentVenue !== null) {
        const previousVenue = geofenceZones.find(z => z.venueId === currentVenue);
        if (previousVenue) {
          const exitEvent: GeofenceEvent = {
            venueId: currentVenue,
            venue: previousVenue.venue,
            eventType: 'exit',
            timestamp: now
          };
          setGeofenceEvents(prev => [...prev, exitEvent]);
        }
      }

      // Enter new venue
      if (nearestVenue !== null) {
        const newVenue = geofenceZones.find(z => z.venueId === nearestVenue);
        if (newVenue) {
          const enterEvent: GeofenceEvent = {
            venueId: nearestVenue,
            venue: newVenue.venue,
            eventType: 'enter',
            timestamp: now
          };
          setGeofenceEvents(prev => [...prev, enterEvent]);
        }
      }

      setCurrentVenue(nearestVenue);
    }
  };

  const startMonitoring = () => {
    if (locationPermission !== 'granted') {
      requestLocation();
      return false;
    }
    
    setIsMonitoring(true);
    return true;
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setCurrentVenue(null);
  };

  // Monitor location changes
  useEffect(() => {
    if (!isMonitoring || locationPermission !== 'granted') return;

    const interval = setInterval(checkGeofences, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userLocation, isMonitoring, currentVenue, locationPermission]);

  // Auto-start monitoring when permission granted
  useEffect(() => {
    if (locationPermission === 'granted' && !isMonitoring) {
      setIsMonitoring(true);
    }
  }, [locationPermission]);

  return {
    isMonitoring,
    currentVenue,
    geofenceEvents,
    startMonitoring,
    stopMonitoring,
    canMonitor: locationPermission === 'granted'
  };
};
