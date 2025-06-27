
import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  location: string | null;
}

interface PingModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: Friend | null;
}

const PingModal = ({ isOpen, onClose, friend }: PingModalProps) => {
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { toast } = useToast();

  const quickPings = [
    { emoji: '🎉', text: 'Come join us!', message: 'Hey! You should come join us!' },
    { emoji: '🍻', text: 'Drinks on me!', message: 'Drinks are on me if you come by!' },
    { emoji: '💜', text: 'Missing you here!', message: 'Missing you here! Come hang out!' },
    { emoji: '⭐', text: 'Epic night!', message: 'This is turning into an epic night - don\'t miss it!' },
    { emoji: '⚡', text: 'Quick meetup?', message: 'Want to do a quick meetup?' },
    { emoji: '🎵', text: 'Great music!', message: 'The music here is incredible right now!' }
  ];

  const handleQuickPing = (ping: typeof quickPings[0]) => {
    // In a real app, this would send the ping to the friend
    console.log(`Sending ping to ${friend?.name}: ${ping.message}`);
    
    toast({
      title: "Ping sent!",
      description: `"${ping.text}" sent to ${friend?.name}`,
    });
    
    onClose();
  };

  const handleCustomPing = () => {
    if (!customMessage.trim()) return;
    
    console.log(`Sending custom ping to ${friend?.name}: ${customMessage}`);
    
    toast({
      title: "Ping sent!",
      description: `Custom message sent to ${friend?.name}`,
    });
    
    setCustomMessage('');
    setShowCustomInput(false);
    onClose();
  };

  if (!friend) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {friend.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Ping {friend.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {friend.location || 'Active now'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground p-2">
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>

        {/* Quick Ping Options */}
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick pings</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickPings.map((ping, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 flex flex-col items-center justify-center space-y-1 text-center hover:bg-accent"
                onClick={() => handleQuickPing(ping)}
              >
                <span className="text-lg">{ping.emoji}</span>
                <span className="text-xs">{ping.text}</span>
              </Button>
            ))}
          </div>

          {/* Custom Message Option */}
          {!showCustomInput ? (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowCustomInput(true)}
            >
              ✏️ Custom message
            </Button>
          ) : (
            <div className="mt-4 space-y-2">
              <Input
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your custom ping..."
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomPing()}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button onClick={handleCustomPing} disabled={!customMessage.trim()} className="flex-1">
                  <Send size={14} className="mr-2" />
                  Send Ping
                </Button>
                <Button variant="outline" onClick={() => setShowCustomInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PingModal;
