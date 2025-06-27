
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Users, X } from 'lucide-react';
import { Friend } from '@/data/friendsData';
import { useLocationSharingSettings } from '@/hooks/useLocationSharingSettings';

interface LocationSharingInviteProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  selectedFriend?: Friend;
}

const LocationSharingInvite = ({ isOpen, onClose, friends, selectedFriend }: LocationSharingInviteProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(selectedFriend?.id || null);
  const [duration, setDuration] = useState<string>('2');
  const [eventName, setEventName] = useState('');
  const [message, setMessage] = useState('');
  
  const { createTemporaryShare } = useLocationSharingSettings();

  if (!isOpen) return null;

  const handleSendInvite = () => {
    if (!selectedFriendId) return;
    
    const hours = parseInt(duration);
    createTemporaryShare(selectedFriendId, hours, eventName || undefined);
    
    // Here you would typically send the invitation to the friend
    console.log('Sending location sharing invite:', {
      friendId: selectedFriendId,
      duration: hours,
      eventName,
      message
    });
    
    onClose();
  };

  const durationOptions = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '8', label: '8 hours' },
    { value: '24', label: '24 hours' }
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl border-t border-border max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-background border-b border-border rounded-t-2xl">
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3 mb-2"></div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              <h2 className="font-semibold text-lg">Share Location</h2>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Friend Selection */}
          <div className="space-y-2">
            <Label>Share with</Label>
            <Select 
              value={selectedFriendId?.toString() || ''} 
              onValueChange={(value) => setSelectedFriendId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a friend" />
              </SelectTrigger>
              <SelectContent>
                {friends.map((friend) => (
                  <SelectItem key={friend.id} value={friend.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {friend.avatar}
                      </div>
                      {friend.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name (Optional)</Label>
            <Input
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Birthday Party, Concert Night"
            />
          </div>

          {/* Message (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
            />
          </div>

          {/* Preview Card */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Temporary location sharing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For {duration} hour{parseInt(duration) > 1 ? 's' : ''}
                    {eventName && ` • ${eventName}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvite}
              disabled={!selectedFriendId}
              className="flex-1"
            >
              Send Invite
            </Button>
          </div>

          <div className="h-6"></div>
        </div>
      </div>
    </>
  );
};

export default LocationSharingInvite;
