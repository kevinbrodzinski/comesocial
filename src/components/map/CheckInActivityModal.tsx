
import React, { useState } from 'react';
import { X, Users, Send, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendMapMessage } from '@/services/chat/sendMapMessage';
import { isFeatureEnabled } from '@/utils/featureFlags';

// Define Venue interface locally since @/types doesn't exist
interface Venue {
  id: string | number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface CheckInActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue?: Venue | null;
  friends: {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
  }[];
}

const CheckInActivityModal = ({ isOpen, onClose, venue, friends }: CheckInActivityModalProps) => {
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // Handle null venue case
  if (!venue) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check-in Activity</DialogTitle>
            <DialogDescription>
              No venue selected for check-in activity.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriendIds(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const isFriendSelected = (friendId: string) => selectedFriendIds.includes(friendId);

  const handleSelectAll = () => {
    if (selectedFriendIds.length === friends.length) {
      setSelectedFriendIds([]);
    } else {
      setSelectedFriendIds(friends.map(f => f.id));
    }
  };

  const handlePing = () => {
    handleSendMessage(selectedFriendIds, `👋 Hey! Just checked in at ${venue.name}. Come join me!`);
  };

  const handleChat = () => {
    handleSendMessage(selectedFriendIds, `💬 Anyone else at ${venue.name}? Let's chat!`);
  };

  const handleSendMessage = (friendIds: string[], message: string) => {
    const recipients = friends
      .filter(f => friendIds.includes(f.id))
      .map(f => ({ id: f.id, name: f.name, avatar: f.avatar }));

    if (isFeatureEnabled('map_message_center_v1')) {
      sendMapMessage({
        recipients,
        text: message,
        pinId: `venue-${venue.id}`,
        venue: {
          name: venue.name,
          address: venue.address || '',
          coordinates: venue.latitude && venue.longitude ? {
            lat: venue.latitude,
            lng: venue.longitude
          } : undefined
        }
      });
      
      console.log(`Map message sent to ${recipients.length} friends at ${venue.name}`);
    } else {
      // Fallback to existing message logic
      console.log(`Message sent to friends: ${message}`);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin size={20} className="text-primary" />
            <span>Check-in Activity at {venue.name}</span>
          </DialogTitle>
          <DialogDescription>
            Let your friends know you're here and invite them to join you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Friend Selection */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                <Users size={16} className="mr-2 inline-block" />
                Invite Friends
              </Label>
              {friends.length > 0 && (
                <Button variant="link" size="sm" onClick={handleSelectAll}>
                  {selectedFriendIds.length === friends.length ? 'Unselect All' : 'Select All'}
                </Button>
              )}
            </div>
            <ScrollArea className="h-40 rounded-md border p-2">
              {friends.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No friends available to invite
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {friends.map(friend => (
                    <div key={friend.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`friend-${friend.id}`}
                        checked={isFriendSelected(friend.id)}
                        onCheckedChange={() => handleFriendSelect(friend.id)}
                      />
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{friend.avatar || friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Label htmlFor={`friend-${friend.id}`} className="text-sm font-medium">
                          {friend.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              <Send size={16} className="mr-2 inline-block" />
              Custom Message (Optional)
            </Label>
            <Input
              id="message"
              placeholder="Write a custom message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <div className="space-x-2">
            <Button 
              type="button" 
              onClick={handlePing}
              disabled={selectedFriendIds.length === 0}
            >
              Send Ping
            </Button>
            <Button 
              type="button" 
              onClick={handleChat}
              disabled={selectedFriendIds.length === 0}
            >
              Start Chat
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInActivityModal;
