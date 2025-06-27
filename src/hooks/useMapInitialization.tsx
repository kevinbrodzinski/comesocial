
import { useState, useEffect, useRef } from 'react';
import { mapStyles } from '../components/map/mapStyles';
import { isFeatureEnabled } from '@/utils/featureFlags';

interface UseMapInitializationProps {
  isLoaded: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

export const useMapInitialization = ({ isLoaded, userLocation }: UseMapInitializationProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapInitError, setMapInitError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Auto-resize handler for responsive map
  useEffect(() => {
    if (!map || !isFeatureEnabled('responsive_map_v2')) return;

    const handleResize = () => {
      // Debounce the resize to avoid excessive calls
      setTimeout(() => {
        if (map) {
          google.maps.event.trigger(map, 'resize');
          if (import.meta.env.DEV) {
            console.log('🗺️ Map resized for viewport change');
          }
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    // Also trigger resize on orientation change for mobile
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [map]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || mapInitError) {
      if (import.meta.env.DEV && isFeatureEnabled('map_loader_fix_v1')) {
        console.log('🗺️ Skipping map initialization:', {
          isLoaded,
          hasMapRef: !!mapRef.current,
          hasMap: !!map,
          hasMapInitError: !!mapInitError
        });
      }
      return;
    }

    if (import.meta.env.DEV) {
      console.log('🗺️ Initializing Google Maps instance...');
    }

    try {
      // Ensure map container has full dimensions
      const container = mapRef.current;
      
      // Container height validation and forced sizing
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.warn('🗺️ Map container has zero dimensions, applying forced sizing', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          computed: window.getComputedStyle(container).height
        });
        
        // Force container to have proper dimensions
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px';
        container.style.position = 'relative';
        container.style.display = 'block';
        
        // Ensure parent has proper height as well
        if (container.parentElement) {
          const parent = container.parentElement;
          if (parent.offsetHeight === 0) {
            parent.style.height = '100%';
            parent.style.minHeight = '400px';
            parent.style.display = 'flex';
            parent.style.flexDirection = 'column';
          }
        }
        
        // Wait for styles to apply
        setTimeout(() => {
          if (container.offsetHeight === 0) {
            console.error('🗺️ Container still has zero height after forced sizing');
            setMapInitError('Map container sizing issue - check parent element has proper height');
            return;
          }
        }, 100);
      }

      // Use user location if available, otherwise default to NYC
      const initialCenter = userLocation || { lat: 40.7128, lng: -74.0060 };
      const initialZoom = userLocation ? 15 : 14;
      
      const mapInstance = new google.maps.Map(container, {
        center: initialCenter,
        zoom: initialZoom,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180,
          },
        },
        // Enable modern marker capabilities
        mapId: 'nova-map-instance'
      });

      // Add debugging logs for map events
      google.maps.event.addListenerOnce(mapInstance, 'tilesloaded', () => {
        if (import.meta.env.DEV) {
          console.log('🗺️ Map tiles loaded successfully!');
        }
        setMapReady(true);
      });

      google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
        if (import.meta.env.DEV) {
          console.log('🗺️ Map is idle and ready for interaction');
        }
      });

      // Force a resize after initialization to ensure proper rendering
      setTimeout(() => {
        google.maps.event.trigger(mapInstance, 'resize');
        if (import.meta.env.DEV) {
          console.log('🗺️ Triggered map resize for optimal display');
        }
      }, 100);

      if (import.meta.env.DEV) {
        console.log('🗺️ Google Maps instance created successfully!');
      }
      setMap(mapInstance);
    } catch (error) {
      console.error('🗺️ Failed to initialize map:', error);
      setMapInitError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isLoaded, userLocation, map, mapInitError]);

  return {
    mapRef,
    map,
    mapInitError,
    mapReady
  };
};
