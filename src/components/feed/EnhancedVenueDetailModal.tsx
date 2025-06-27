import React, { useState } from 'react';
import { X, MapPin, Users, Clock, Star, Share, MessageCircle, Plus, Eye, Calendar, Car, Wifi, Music, Camera, TrendingUp, Bell, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface EnhancedVenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: any;
  onJoin: () => void;
  onWatch: () => void;
  onMessage: () => void;
  onShare: () => void;
}

const EnhancedVenueDetailModal = ({
  isOpen,
  onClose,
  venue,
  onJoin,
  onWatch,
  onMessage,
  onShare
}: EnhancedVenueDetailModalProps) => {
  const [isWatching, setIsWatching] = useState(false);
  const { toast } = useToast();

  if (!venue) return null;

  const getCrowdColor = (level: number) => {
    if (level > 80) return 'text-red-400 bg-red-50';
    if (level > 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getCrowdLabel = (level: number) => {
    if (level > 80) return 'Packed';
    if (level > 60) return 'Buzzing';
    return 'Chill';
  };

  const handleWatch = () => {
    setIsWatching(!isWatching);
    onWatch();
    toast({
      title: isWatching ? "Removed from Watchlist" : "Added to Watchlist",
      description: isWatching 
        ? "You'll no longer receive updates" 
        : "We'll notify you about updates",
    });
  };

  const handleRideshare = () => {
    toast({
      title: "Opening Uber",
      description: `Getting a ride to ${venue.venue}`,
    });
  };

  const handleViewPhotos = () => {
    toast({
      title: "Opening Photo Gallery",
      description: `Viewing photos from ${venue.venue}`,
    });
  };

  const handleUploadPhoto = () => {
    toast({
      title: "Upload Photo",
      description: "Camera opening to capture a new photo",
    });
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Live Music': Music,
    'Photos OK': Camera,
    'Craft Cocktails': Star,
    'Intimate Setting': Users,
    'Reservation Required': Calendar
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="relative flex-shrink-0">
          <img 
            src={venue.image} 
            alt={venue.venue}
            className="w-full h-48 object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-2">{venue.venue}</h1>
            <div className="flex items-center space-x-2">
              <Badge className="bg-black/50 text-white border-white/20">
                {venue.type}
              </Badge>
              <Badge className="bg-black/50 text-white border-white/20">
                {venue.vibe}
              </Badge>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
              {/* 1. Venue Overview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-sm">{venue.location?.address}</span>
                    <span className="text-sm text-muted-foreground">• {venue.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{venue.venueInfo?.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`${getCrowdColor(venue.crowdLevel)} border`}>
                    <Users size={12} className="mr-1" />
                    {venue.crowdLevel}% - {getCrowdLabel(venue.crowdLevel)}
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {venue.weather?.icon} {venue.weather?.temperature} • {venue.weather?.condition}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-blue-600">
                    <TrendingUp size={14} className="mr-1" />
                    {venue.socialSignals?.friendsConsidering} friends considering
                  </div>
                  <div className="flex items-center text-green-600">
                    <Eye size={14} className="mr-1" />
                    {venue.socialSignals?.watchersCount} watching
                  </div>
                </div>
              </div>

              {/* 2. Event-Specific Info */}
              {venue.eventDetails && (
                <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">{venue.eventDetails.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {venue.eventDetails.startTime} - {venue.eventDetails.endTime}
                    </div>
                    <div>Host: {venue.eventDetails.host}</div>
                  </div>
                  {venue.eventDetails.promotions && (
                    <div className="space-y-1">
                      {venue.eventDetails.promotions.map((promo: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {promo}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. People & Social Signals */}
              <div className="space-y-3">
                <h3 className="font-semibold">Your Friends</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[...Array(venue.socialSignals?.friendsHere || 0)].map((_, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{venue.socialSignals?.friendsHere} friends here now</span>
                    <div className="text-muted-foreground">
                      {venue.socialSignals?.newWatchersLastHour} new watchers in the last hour
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Photos & Videos */}
              <div className="space-y-3">
                <h3 className="font-semibold">Photos & Media</h3>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-20 flex-col"
                    onClick={handleViewPhotos}
                  >
                    <ImageIcon size={24} className="mb-1" />
                    <span className="text-xs">View Photos</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-20 flex-col"
                    onClick={handleUploadPhoto}
                  >
                    <Plus size={24} className="mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </Button>
                </div>
              </div>

              {/* 5. Features & Amenities */}
              {venue.venueInfo?.features && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Features & Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {venue.venueInfo.features.map((feature: string, index: number) => {
                      const IconComponent = amenityIcons[feature as keyof typeof amenityIcons];
                      return (
                        <div key={index} className="flex items-center text-sm p-2 bg-secondary/30 rounded">
                          {IconComponent && <IconComponent size={14} className="mr-2" />}
                          <span>{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Safety & Logistics */}
              <div className="space-y-3">
                <h3 className="font-semibold">Venue Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age Requirement:</span>
                    <span>{venue.venueInfo?.ageRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dress Code:</span>
                    <span>{venue.venueInfo?.dressCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Level:</span>
                    <span>{venue.venueInfo?.priceLevel}</span>
                  </div>
                </div>
              </div>

              {/* 7. Smart Additions */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Bell size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-900">Smart Alert</span>
                </div>
                <p className="text-sm text-blue-800">
                  Notify me when 3+ friends arrive or crowd hits 90%
                </p>
              </div>

              {/* Add padding at bottom for sticky action bar */}
              <div className="h-32" />
            </div>
          </ScrollArea>
        </div>

        {/* Sticky Action Bar - Fixed */}
        <div className="border-t bg-background p-4 space-y-3 flex-shrink-0">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleRideshare}
            >
              <Car size={14} className="mr-2" />
              Uber
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 ${isWatching ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={handleWatch}
            >
              <Eye size={14} className="mr-2" />
              {isWatching ? 'Watching' : 'Watch'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onMessage}
            >
              <MessageCircle size={14} className="mr-2" />
              Message
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onShare}
            >
              <Share size={14} className="mr-2" />
              Share
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={onJoin}
            >
              <Plus size={14} className="mr-2" />
              Join Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVenueDetailModal;
