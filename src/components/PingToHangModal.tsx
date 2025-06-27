
import React, { useState } from 'react';
import { X, Send, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import NotificationService from '@/services/NotificationService';

interface PingToHangModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: any | null;
  onPingSent?: (selectedMessage: string) => void;
}

const PingToHangModal = ({ isOpen, onClose, friend, onPingSent }: PingToHangModalProps) => {
  const [selectedMessage, setSelectedMessage] = useState('');
  const { toast } = useToast();

  if (!isOpen || !friend) return null;

  const quickMessages = [
    "Hey! Want to hang out? 🎉",
    "What's the vibe like? 👀",
    "Mind if I join you? 😊",
    "Free to chat? ☕",
    "Let's catch up! 💬",
    "Are you free right now? ⏰"
  ];

  const handleQuickMessage = (message: string) => {
    setSelectedMessage(message);
  };

  const handleSendPing = () => {
    if (!selectedMessage.trim()) return;

    const notificationService = NotificationService.getInstance();
    
    // Send the ping with venue info if available
    const venue = friend.location ? {
      name: friend.location,
      address: friend.location,
    } : undefined;

    // Create message thread through NotificationService
    notificationService.sendMessage(
      friend.id, 
      friend.name,
      selectedMessage,
      'ping',
      venue
    );

    // Also send traditional ping notification
    notificationService.sendFriendPing(
      friend.id, 
      friend.name,
      selectedMessage,
      venue
    );

    toast({
      title: "Ping sent! 👋",
      description: `Your message was sent to ${friend.name}`,
    });

    onPingSent?.(selectedMessage);
    onClose();
    setSelectedMessage('');
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 animate-in fade-in-0 scale-in-95 sm:max-w-sm sm:left-1/2 sm:-translate-x-1/2">
        <div className="bg-background rounded-lg border border-border shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Ping {friend.name}</h3>
                  <p className="text-xs text-muted-foreground">Send a quick message</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Friend Context */}
            {friend.location && (
              <div className="bg-secondary/30 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">
                  {friend.name} is at <span className="font-medium text-foreground">{friend.location}</span>
                </p>
              </div>
            )}

            {/* Quick Messages */}
            <div>
              <p className="text-sm font-medium mb-3">Quick messages:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(message)}
                    className={`text-left p-3 rounded-lg border transition-all text-sm ${
                      selectedMessage === message
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30 hover:bg-accent/50'
                    }`}
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Message Preview */}
            {selectedMessage && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-primary font-medium">Your message:</p>
                <p className="text-sm mt-1">{selectedMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSendPing}
                disabled={!selectedMessage.trim()}
                className="flex-1"
              >
                <Send size={16} className="mr-2" />
                Send Ping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PingToHangModal;
