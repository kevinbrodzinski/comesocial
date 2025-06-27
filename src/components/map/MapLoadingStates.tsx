
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RotateCcw, Map } from 'lucide-react';

interface MapSetupRequiredProps {
  filteredVenues: any[];
  userLocation?: { lat: number; lng: number } | null;
}

export const MapSetupRequired = ({ filteredVenues, userLocation }: MapSetupRequiredProps) => (
  <div className="flex-1 flex items-center justify-center bg-slate-100 text-slate-800 p-4">
    <div className="text-center max-w-md">
      <Map className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      <p className="text-lg font-medium mb-2">Google Maps Setup Required</p>
      <p className="text-sm text-gray-600 mb-4">
        To display the interactive map, please configure your Google Maps API key in Settings.
      </p>
      <div className="bg-white rounded-lg p-8 shadow-inner border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Map className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Interactive map would appear here</p>
          <p className="text-xs text-gray-400 mt-1">
            Venues: {filteredVenues.length} • User Location: {userLocation ? 'Available' : 'Pending'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface MapErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const MapErrorState = ({ error, onRetry }: MapErrorStateProps) => (
  <div className="flex-1 flex items-center justify-center bg-slate-100 text-slate-800 p-4">
    <div className="text-center max-w-md">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-lg font-medium mb-2">Failed to load map</p>
      <p className="text-sm text-gray-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Retry
      </Button>
    </div>
  </div>
);

interface MapInitErrorStateProps {
  mapInitError: string;
}

export const MapInitErrorState = ({ mapInitError }: MapInitErrorStateProps) => (
  <div className="flex-1 flex items-center justify-center bg-slate-100 text-slate-800 p-4">
    <div className="text-center max-w-md">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-lg font-medium mb-2">Map initialization failed</p>
      <p className="text-sm text-gray-600 mb-4">{mapInitError}</p>
      <Button onClick={() => window.location.reload()} variant="outline" className="flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Reload page
      </Button>
    </div>
  </div>
);

interface MapLoadingStateProps {
  isLoading: boolean;
}

export const MapLoadingState = ({ isLoading }: MapLoadingStateProps) => (
  <div className="flex-1 flex flex-col bg-slate-100">
    <div className="flex-1 p-4">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
        <p className="text-xs text-gray-400 mt-1">
          {isLoading ? 'Initializing Google Maps...' : 'Waiting for map API...'}
        </p>
      </div>
    </div>
  </div>
);

interface MapRenderingOverlayProps {
  map: google.maps.Map | null;
  mapReady: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

export const MapRenderingOverlay = ({ map, mapReady, userLocation }: MapRenderingOverlayProps) => {
  if (!map) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Rendering map...</p>
          {userLocation && (
            <p className="text-xs text-gray-500 mt-1">Location detected</p>
          )}
        </div>
      </div>
    );
  }

  if (!mapReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
        <div className="text-center">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
          <p className="text-xs text-gray-600">Loading map tiles...</p>
        </div>
      </div>
    );
  }

  return null;
};
