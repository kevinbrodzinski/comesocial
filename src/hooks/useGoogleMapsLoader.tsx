
import { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { isFeatureEnabled } from '@/utils/featureFlags';

// Global loader instance to prevent multiple initializations
let globalLoader: Loader | null = null;
let isLoaderInitialized = false;
let loadingPromise: Promise<void> | null = null;
let loadingTimeout: NodeJS.Timeout | null = null;

// Custom events for diagnostics
const emitMapEvent = (type: 'loaded' | 'error', detail?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`maps:${type}`, { detail }));
  }
};

export const useGoogleMapsLoader = (apiKey: string | null) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      if (import.meta.env.DEV) {
        console.warn('🗺️ No Google Maps API key provided');
      }
      setError('No Google Maps API key configured');
      setIsLoading(false);
      setIsLoaded(false);
      emitMapEvent('error', { reason: 'missing_key' });
      return;
    }

    // Check if already loaded
    if (window.google?.maps && isLoaded) {
      if (import.meta.env.DEV && isFeatureEnabled('map_loader_fix_v1')) {
        console.log('🗺️ Google Maps already loaded and ready');
      }
      return;
    }

    if (import.meta.env.DEV && isFeatureEnabled('map_loader_fix_v1')) {
      console.info('🗺️ [Maps] loader start – key =', apiKey.substring(0, 10) + '...');
    }

    setIsLoading(true);
    setError(null);

    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    // Set up timeout detection (8 seconds - increased for better reliability)
    loadingTimeout = setTimeout(() => {
      if (!window.google?.maps) {
        console.error('🗺️ Google Maps loading timeout - script failed to load');
        setError('Map loading timeout - please check your connection and API key');
        setIsLoading(false);
        setIsLoaded(false);
        emitMapEvent('error', { reason: 'timeout' });
      }
    }, 8000);

    // Initialize global loader with only valid libraries (removed 'marker' as it doesn't exist)
    if (!globalLoader && !isLoaderInitialized) {
      if (import.meta.env.DEV) {
        console.log('🗺️ Creating new Google Maps loader with valid libraries...');
      }
      globalLoader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places', 'visualization'] // Removed 'marker' - modern markers are part of core API
      });
      isLoaderInitialized = true;
    }

    // Create or use existing loading promise
    if (!loadingPromise || !window.google?.maps) {
      loadingPromise = globalLoader!.load()
        .then(() => {
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
          }

          // Verify Google Maps is actually available
          if (!window.google || !window.google.maps) {
            throw new Error('Google Maps API loaded but google.maps is undefined');
          }

          // Check if modern marker API is available (it should be in newer versions)
          if (window.google.maps.marker?.AdvancedMarkerElement) {
            if (import.meta.env.DEV) {
              console.log('🗺️ Google Maps loaded with modern marker API support!');
            }
          } else {
            if (import.meta.env.DEV) {
              console.log('🗺️ Google Maps loaded with legacy marker API');
            }
          }

          setIsLoaded(true);
          setError(null);
          emitMapEvent('loaded');
        })
        .catch((error) => {
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
          }

          console.error('🗺️ Google Maps loading failed:', error);
          
          let errorMessage = `Failed to load Google Maps: ${error.message}`;
          let errorReason = 'unknown';

          // Detect specific error types
          if (error.message.includes('InvalidKey') || error.message.includes('ApiNotActivated')) {
            errorReason = 'invalid_key';
            errorMessage = 'Invalid Google Maps API key or API not activated';
          } else if (error.message.includes('RefererNotAllowed')) {
            errorReason = 'referrer_blocked';
            errorMessage = 'Google Maps API key blocked - check referrer restrictions';
          } else if (error.message.includes('timeout') || error.message.includes('network')) {
            errorReason = 'timeout';
            errorMessage = 'Network timeout loading Google Maps - check your connection';
          }

          setError(errorMessage);
          setIsLoaded(false);
          emitMapEvent('error', { reason: errorReason, originalError: error });
          
          // Reset loading promise so we can retry
          loadingPromise = null;
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Use existing promise
      loadingPromise
        .then(() => {
          if (import.meta.env.DEV) {
            console.log('🗺️ Using existing Google Maps instance');
          }
          setIsLoaded(true);
          setError(null);
          emitMapEvent('loaded');
        })
        .catch((error) => {
          console.error('🗺️ Existing Google Maps instance failed:', error);
          setError(`Failed to load Google Maps: ${error.message}`);
          setIsLoaded(false);
          emitMapEvent('error', { reason: 'existing_failed', originalError: error });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    // Cleanup function
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
    };
  }, [apiKey]);

  const retry = () => {
    if (import.meta.env.DEV) {
      console.log('🗺️ Retrying Google Maps load...');
    }
    
    // Clear timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      loadingTimeout = null;
    }
    
    // Reset all state completely
    loadingPromise = null;
    globalLoader = null;
    isLoaderInitialized = false;
    setError(null);
    setIsLoaded(false);
    setIsLoading(false);
    
    // Force re-run the effect
    setTimeout(() => {
      setIsLoading(true);
    }, 100);
  };

  return { isLoaded, isLoading, error, retry };
};
