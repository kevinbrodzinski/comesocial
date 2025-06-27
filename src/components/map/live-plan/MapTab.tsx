
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Users, Route, MapPinPlus } from 'lucide-react';
import { Plan } from '@/data/plansData';
import { PlanFriendTracking } from '@/types/planFriendTracking';
import { friendsData } from '@/data/friendsData';

interface MapTabProps {
  plan: Plan;
  currentStopIndex: number;
  friendTracking: PlanFriendTracking | null;
  onNavigateToVenue: (stopId: number) => void;
}

const MapTab = ({
  plan,
  currentStopIndex,
  friendTracking,
  onNavigateToVenue
}: MapTabProps) => {
  const [showRoute, setShowRoute] = useState(true);
  const [showFriends, setShowFriends] = useState(true);
  const [suggestStop, setSuggestStop] = useState(false);

  const currentStop = plan.stops[currentStopIndex];
  const nextStop = currentStopIndex + 1 < plan.stops.length ? plan.stops[currentStopIndex + 1] : null;

  // Mock friend locations for display
  const friendLocations = friendsData.slice(0, 3).map((friend, index) => ({
    ...friend,
    lat: 40.7128 + (Math.random() - 0.5) * 0.01,
    lng: -74.0060 + (Math.random() - 0.5) * 0.01,
    status: index === 0 ? 'at-venue' : index === 1 ? 'en-route' : 'nearby'
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Map Area - Placeholder */}
      <div className="flex-1 bg-slate-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
              <Navigation size={24} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">Will show friend locations & route</p>
          </div>
        </div>

        {/* Floating Control Buttons */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col space-y-2">
          {/* Show Route Button */}
          <Button
            variant={showRoute ? "default" : "outline"}
            size="icon"
            onClick={() => setShowRoute(!showRoute)}
            className={`h-12 w-12 rounded-full ${
              showRoute 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'bg-background/80 border-border hover:bg-background/90'
            }`}
          >
            <Route size={20} />
          </Button>

          {/* Show Friends Button */}
          <Button
            variant={showFriends ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFriends(!showFriends)}
            className={`h-12 w-12 rounded-full ${
              showFriends 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'bg-background/80 border-border hover:bg-background/90'
            }`}
          >
            <Users size={20} />
          </Button>

          {/* Suggest Stop Button */}
          <Button
            variant={suggestStop ? "default" : "outline"}
            size="icon"
            onClick={() => setSuggestStop(!suggestStop)}
            className={`h-12 w-12 rounded-full ${
              suggestStop 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'bg-background/80 border-border hover:bg-background/90'
            }`}
          >
            <MapPinPlus size={20} />
          </Button>
        </div>

        {/* Current Location Indicator */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-blue-500 text-white">
            📍 You're here: {currentStop.name}
          </Badge>
        </div>

        {/* Next Stop Indicator */}
        {nextStop && (
          <div className="absolute top-16 left-4">
            <Badge variant="outline" className="bg-white">
              Next: {nextStop.name}
            </Badge>
          </div>
        )}

        {/* Friend Locations */}
        {showFriends && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white rounded-lg p-3 shadow-lg">
              <h4 className="font-medium mb-2 text-sm">Friends Nearby</h4>
              <div className="space-y-2">
                {friendLocations.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        {friend.name.charAt(0)}
                      </div>
                      <span>{friend.name}</span>
                    </div>
                    <Badge 
                      variant={friend.status === 'at-venue' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {friend.status === 'at-venue' ? 'Here' : 
                       friend.status === 'en-route' ? 'En Route' : 'Nearby'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <div className="flex-shrink-0 p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Button 
            onClick={() => onNavigateToVenue(currentStop.id)}
            className="flex-1"
          >
            <Navigation size={14} className="mr-2" />
            Get Directions
          </Button>
          {nextStop && (
            <Button 
              variant="outline"
              onClick={() => onNavigateToVenue(nextStop.id)}
              className="flex-1"
            >
              Next Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapTab;
