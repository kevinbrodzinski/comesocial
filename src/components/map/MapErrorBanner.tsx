
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, RotateCcw } from 'lucide-react';

interface MapErrorBannerProps {
  errorType: 'missing_key' | 'invalid_key' | 'referrer_blocked' | 'timeout' | 'unknown';
  errorMessage: string;
  onRetry: () => void;
}

const MapErrorBanner = ({ errorType, errorMessage, onRetry }: MapErrorBannerProps) => {
  const getErrorDetails = () => {
    switch (errorType) {
      case 'missing_key':
        return {
          title: 'Google Maps API Key Required',
          description: 'To display the map, please configure your Google Maps API key in the project settings.',
          actionUrl: 'https://console.cloud.google.com/google/maps-apis/credentials',
          actionText: 'Get API Key'
        };
      case 'invalid_key':
        return {
          title: 'Invalid API Key',
          description: 'The Google Maps API key is invalid or the Maps JavaScript API is not activated.',
          actionUrl: 'https://console.cloud.google.com/google/maps-apis/api/maps-backend.googleapis.com',
          actionText: 'Activate API'
        };
      case 'referrer_blocked':
        return {
          title: 'API Key Blocked',
          description: 'The API key is blocked due to referrer restrictions. Add your domain to the allowed referrers.',
          actionUrl: 'https://console.cloud.google.com/google/maps-apis/credentials',
          actionText: 'Update Restrictions'
        };
      case 'timeout':
        return {
          title: 'Map Loading Timeout',
          description: 'The Google Maps script failed to load. Check your internet connection and try again.',
          actionUrl: null,
          actionText: null
        };
      default:
        return {
          title: 'Map Loading Error',
          description: errorMessage,
          actionUrl: null,
          actionText: null
        };
    }
  };

  const { title, description, actionUrl, actionText } = getErrorDetails();

  return (
    <div className="absolute top-4 left-4 right-4 z-50">
      <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-3">
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm opacity-90">{description}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRetry} className="flex items-center gap-2">
              <RotateCcw className="w-3 h-3" />
              Retry
            </Button>
            {actionUrl && actionText && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(actionUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                {actionText}
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MapErrorBanner;
