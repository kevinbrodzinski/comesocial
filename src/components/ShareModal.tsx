
import React, { useState } from 'react';
import { X, MessageCircle, Copy, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FriendSelectorModal from '@/components/messages/FriendSelectorModal';
import { useToast } from '@/hooks/use-toast';
import NotificationService from '@/services/NotificationService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const ShareModal = ({ isOpen, onClose, post }: ShareModalProps) => {
  const [isFriendSelectorOpen, setIsFriendSelectorOpen] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !post) return null;

  const handleShareOption = (option: string) => {
    if (option === 'friend') {
      setIsFriendSelectorOpen(true);
      return;
    }
    
    console.log('Sharing via:', option, 'Post:', post.venue);
    onClose();
  };

  const handleFriendSelected = (friend: any) => {
    // Get the NotificationService instance (which has access to MessageService)
    const notificationService = NotificationService.getInstance();
    
    // Format the venue information for sharing
    const venueInfo = {
      name: post.venue || 'Unknown Venue',
      address: post.address || '',
      coordinates: post.coordinates
    };
    
    // Create a formatted message for the shared venue
    const shareMessage = `🍻 Hey! I found this spot and thought you'd be interested: ${venueInfo.name}`;
    
    // Send the venue as a message to the selected friend
    notificationService.sendMessage(
      friend.id,
      friend.name,
      shareMessage,
      'message',
      venueInfo
    );
    
    toast({
      title: "Venue shared! 📤",
      description: `Sent "${venueInfo.name}" to ${friend.name}`,
    });
    
    // Close both modals
    setIsFriendSelectorOpen(false);
    onClose();
  };

  const handleCloseFriendSelector = () => {
    setIsFriendSelectorOpen(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in-0"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[50vh] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Share {post.venue}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={() => handleShareOption('friend')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-colors"
          >
            <MessageCircle size={20} />
            <span>Send to Friend</span>
          </button>

          <button
            onClick={() => handleShareOption('copy')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-colors"
          >
            <Copy size={20} />
            <span>Copy Link</span>
          </button>

          <button
            onClick={() => handleShareOption('instagram')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-colors"
          >
            <Instagram size={20} />
            <span>Share to IG Story</span>
          </button>
        </div>
      </div>

      {/* Friend Selector Modal */}
      <FriendSelectorModal
        isOpen={isFriendSelectorOpen}
        onClose={handleCloseFriendSelector}
        onSelectFriend={handleFriendSelected}
      />
    </>
  );
};

export default ShareModal;
