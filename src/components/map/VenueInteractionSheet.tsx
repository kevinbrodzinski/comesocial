
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Users, MapPin, UserPlus, Navigation } from 'lucide-react';
import { Venue } from '@/data/venuesData';
import { Friend } from '@/data/friendsData';

interface VenueInteractionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue | null;
  friendsAtVenue: Friend[];
  onPingFriends: (friends: Friend[]) => void;
  onMessageFriends: (friends: Friend[]) => void;
  onJoinFriends: (friends: Friend[]) => void;
  onCheckIn: (venue: Venue) => void;
  onAddToPlan: (venue: Venue) => void;
}

const VenueInteractionSheet = ({
  isOpen,
  onClose,
  venue,
  friendsAtVenue,
  onPingFriends,
  onMessageFriends,
  onJoinFriends,
  onCheckIn,
  onAddToPlan
}: VenueInteractionSheetProps) => {
  if (!venue) return null;

  const hasFriends = friendsAtVenue.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{venue.name}</h2>
              <p className="text-sm text-muted-foreground">{venue.description}</p>
            </div>
            <Badge variant="secondary" className="ml-2">
              {venue.crowdLevel}% full
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Friends at Venue */}
          {hasFriends && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Users size={16} className="mr-2" />
                Friends Here ({friendsAtVenue.length})
              </h3>
              
              <div className="space-y-2 mb-4">
                {friendsAtVenue.slice(0, 3).map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">{friend.currentAction}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {friend.timeAgo}
                    </Badge>
                  </div>
                ))}
                
                {friendsAtVenue.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{friendsAtVenue.length - 3} more friends here
                  </p>
                )}
              </div>

              {/* Friend Actions */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button 
                  onClick={() => onPingFriends(friendsAtVenue)}
                  className="flex-1"
                >
                  <MessageCircle size={14} className="mr-2" />
                  Ping Them
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onJoinFriends(friendsAtVenue)}
                  className="flex-1"
                >
                  <UserPlus size={14} className="mr-2" />
                  Join Them
                </Button>
              </div>
            </div>
          )}

          {/* Venue Details */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{venue.crowdLevel}%</p>
                <p className="text-xs text-muted-foreground">Crowd Level</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">{venue.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">{venue.priceLevel}</p>
                <p className="text-xs text-muted-foreground">Price Level</p>
              </div>
            </div>
          </div>

          {/* General Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => onCheckIn(venue)}
              className="w-full"
            >
              <MapPin size={16} className="mr-2" />
              Check In Here
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => onAddToPlan(venue)}
              >
                <UserPlus size={14} className="mr-2" />
                Add to Plan
              </Button>
              <Button 
                variant="outline"
                onClick={() => {/* Handle navigation */}}
              >
                <Navigation size={14} className="mr-2" />
                Navigate
              </Button>
            </div>

            {hasFriends && (
              <Button 
                variant="outline"
                onClick={() => onMessageFriends(friendsAtVenue)}
                className="w-full"
              >
                <MessageCircle size={16} className="mr-2" />
                Message Group
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VenueInteractionSheet;
