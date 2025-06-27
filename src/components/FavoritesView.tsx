
import React, { useState } from 'react';
import { Heart, MapPin, Users, Clock, Bell, BellOff, Settings, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import VenueBrowserModal from './VenueBrowserModal';
import FavoritesSettingsModal from './FavoritesSettingsModal';
import VenueDetailModal from './VenueDetailModal';
import { useVenuesData } from '../hooks/useVenuesData';

const FavoritesView = () => {
  const { 
    favoriteVenues, 
    notifications, 
    toggleNotification, 
    getCrowdColor, 
    getCrowdLabel 
  } = useVenuesData();
  
  const [checkingIn, setCheckingIn] = useState<{ [key: number]: boolean }>({});
  const [venueBrowserOpen, setVenueBrowserOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<typeof favoriteVenues[0] | null>(null);
  const [venueDetailOpen, setVenueDetailOpen] = useState(false);

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleAddFavorite = () => {
    setVenueBrowserOpen(true);
  };

  const handleVenueClick = (venue: typeof favoriteVenues[0]) => {
    setSelectedVenue(venue);
    setVenueDetailOpen(true);
  };

  const handleGetDirections = (venue: typeof favoriteVenues[0]) => {
    const query = encodeURIComponent(venue.name);
    const url = `https://maps.apple.com/?q=${query}`;
    window.open(url, '_blank');
  };

  const handleCheckIn = async (venue: typeof favoriteVenues[0]) => {
    setCheckingIn(prev => ({ ...prev, [venue.id]: true }));
    
    setTimeout(() => {
      setCheckingIn(prev => ({ ...prev, [venue.id]: false }));
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Your Favorites</h1>
            <p className="text-sm text-muted-foreground">Your go-to spots with real-time updates</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFavorite}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <Plus size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {favoriteVenues.map((venue) => (
          <Card 
            key={venue.id} 
            className="border-border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleVenueClick(venue)}
          >
            <div className="relative">
              <img 
                src={venue.image} 
                alt={venue.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-2 left-3 right-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{venue.name}</h3>
                    <p className="text-white/80 text-sm">{venue.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-white text-sm">
                      <Users size={14} className="mr-1" />
                      <span>{venue.crowdLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-4" onClick={(e) => e.stopPropagation()}>
              {/* Status Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-1" />
                    <span>{venue.distance}</span>
                  </div>
                  <div className={`text-sm font-medium ${getCrowdColor(venue.crowdLevel)}`}>
                    {getCrowdLabel(venue.crowdLevel)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Notify when busy</span>
                  <Switch 
                    checked={notifications[venue.id]}
                    onCheckedChange={() => toggleNotification(venue.id)}
                  />
                </div>
              </div>

              {/* Vibe and Features */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {venue.vibe}
                </Badge>
                {venue.features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Best Times */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Best times to visit:</p>
                <div className="flex flex-wrap gap-1">
                  {venue.bestTimes.map((time, index) => (
                    <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>Avg wait: {venue.averageWait}</span>
                </div>
                <span>Last visit: {venue.lastVisited}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleGetDirections(venue)}
                >
                  <ExternalLink size={14} className="mr-2" />
                  Get Directions
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-primary hover:bg-primary/80"
                  onClick={() => handleCheckIn(venue)}
                  disabled={checkingIn[venue.id]}
                >
                  {checkingIn[venue.id] ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    'Check In'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <VenueBrowserModal 
        open={venueBrowserOpen} 
        onOpenChange={setVenueBrowserOpen} 
      />
      <FavoritesSettingsModal 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
      <VenueDetailModal 
        open={venueDetailOpen} 
        onOpenChange={setVenueDetailOpen}
        venue={selectedVenue}
      />
    </div>
  );
};

export default FavoritesView;
