
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Users, Clock, Star } from 'lucide-react';

interface VenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: string;
  friendsAtVenue: any[];
  onJoin: () => void;
  onPing: () => void;
}

const VenueDetailModal = ({ 
  isOpen, 
  onClose, 
  venue, 
  friendsAtVenue, 
  onJoin, 
  onPing 
}: VenueDetailModalProps) => {
  const crowdLevel = Math.floor(Math.random() * 5) + 1;
  const vibe = ['Chill', 'Energetic', 'Trendy'][Math.floor(Math.random() * 3)];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin size={20} className="text-primary" />
            <span>{venue}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Venue Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm">Crowd Level</span>
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded ${
                      i < crowdLevel ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star size={16} className="text-muted-foreground" />
                <span className="text-sm">Vibe</span>
              </div>
              <Badge variant="outline">{vibe}</Badge>
            </div>
          </div>

          {/* Friends at Venue */}
          <div className="space-y-3">
            <h4 className="font-semibold">Your friends here ({friendsAtVenue.length})</h4>
            <div className="space-y-2">
              {friendsAtVenue.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/20">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {friend.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.activity}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {friend.timeAgo}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={onJoin}
            >
              <Users size={16} className="mr-2" />
              Join Venue Plan
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onPing}
            >
              Ping Friends
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueDetailModal;
