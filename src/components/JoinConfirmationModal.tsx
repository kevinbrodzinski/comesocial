
import React from 'react';
import { Users, MapPin, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface JoinConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const JoinConfirmationModal = ({ isOpen, onClose, post }: JoinConfirmationModalProps) => {
  const { toast } = useToast();

  if (!post) return null;

  const handleJoin = () => {
    toast({
      title: "Joined the plan! 🎉",
      description: `You're now part of the plan at ${post.venue}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Join this plan?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Venue Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{post.venue}</h3>
            <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
              <MapPin size={14} className="mr-1" />
              {post.distance} away
            </div>
          </div>

          {/* Plan Details */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm">
                <Users size={14} className="mr-2 text-muted-foreground" />
                <span>{post.likes || 5} people going</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock size={14} className="mr-2 text-muted-foreground" />
                <span>{post.timePosted}</span>
              </div>
            </div>
            
            {/* Organizer */}
            <div className="flex items-center space-x-2 mt-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.friendAvatar} alt={post.friend} />
                <AvatarFallback className="text-xs">{post.friend.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">Organized by {post.friend}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleJoin} className="flex-1">
              Join Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinConfirmationModal;
