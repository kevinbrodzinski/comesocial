
import React from 'react';
import { Button } from '../ui/button';
import { Route, Users, MapPin } from 'lucide-react';
import { isFeatureEnabled } from '../../utils/featureFlags';

interface MapFloatingControlsProps {
  showRoute?: boolean;
  showFriends?: boolean;
  showSuggestStop?: boolean;
  onToggleRoute?: () => void;
  onToggleFriends?: () => void;
  onToggleSuggestStop?: () => void;
}

const MapFloatingControls = ({
  showRoute = false,
  showFriends = true,
  showSuggestStop = false,
  onToggleRoute,
  onToggleFriends,
  onToggleSuggestStop
}: MapFloatingControlsProps) => {
  const useResponsiveMap = isFeatureEnabled('responsive_map_v2');

  if (!useResponsiveMap) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col space-y-3 pointer-events-auto">
      <Button
        variant={showRoute ? "default" : "outline"}
        size="sm"
        onClick={onToggleRoute}
        className="bg-card/90 border border-border shadow-lg backdrop-blur-sm hover:bg-accent text-foreground"
      >
        <Route size={16} className="mr-2" />
        Route
      </Button>
      
      <Button
        variant={showFriends ? "default" : "outline"}
        size="sm"
        onClick={onToggleFriends}
        className="bg-card/90 border border-border shadow-lg backdrop-blur-sm hover:bg-accent text-foreground"
      >
        <Users size={16} className="mr-2" />
        Friends
      </Button>
      
      <Button
        variant={showSuggestStop ? "default" : "outline"}
        size="sm"
        onClick={onToggleSuggestStop}
        className="bg-card/90 border border-border shadow-lg backdrop-blur-sm hover:bg-accent text-foreground"
      >
        <MapPin size={16} className="mr-2" />
        Suggest
      </Button>
    </div>
  );
};

export default MapFloatingControls;
