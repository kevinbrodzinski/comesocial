
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Clock, Users } from 'lucide-react';

interface FriendGroupJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupFriends: any[];
  venue: string;
  onJoin: () => void;
  onPing: () => void;
}

const FriendGroupJoinModal = ({ 
  isOpen, 
  onClose, 
  groupFriends, 
  venue, 
  onJoin, 
  onPing 
}: FriendGroupJoinModalProps) => {
  const friendNames = groupFriends.map(f => f.name.split(' ')[0]).join(', ');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-xl ring-1 ring-border">
        <DialogHeader>
          <DialogTitle className="text-center">Join the {venue} crew?</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Friend Avatars */}
          <div className="flex justify-center">
            <div className="flex -space-x-2">
              {groupFriends.slice(0, 4).map((friend) => (
                <Avatar key={friend.id} className="w-12 h-12 border-2 border-card">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {friend.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
              {groupFriends.length > 4 && (
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-sm font-semibold">+{groupFriends.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          {/* Venue Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <MapPin size={16} className="text-primary" />
              <span className="font-semibold">{venue}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {friendNames} {groupFriends.length === 1 ? 'is' : 'are'} here right now
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={onJoin}
            >
              <Users size={16} className="mr-2" />
              I'm in! Let them know I'm coming
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-border"
              onClick={onPing}
            >
              Just ping them for now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            They'll get a notification that you're on your way
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendGroupJoinModal;
