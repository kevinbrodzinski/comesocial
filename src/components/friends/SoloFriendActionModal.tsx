
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Plus, Clock } from 'lucide-react';

interface SoloFriendActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: any;
  onMessage: () => void;
  onInviteToPlan: () => void;
  onPing: () => void;
}

const SoloFriendActionModal = ({ 
  isOpen, 
  onClose, 
  friend, 
  onMessage, 
  onInviteToPlan, 
  onPing 
}: SoloFriendActionModalProps) => {
  const isOffline = friend?.currentAction === 'offline';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-xl ring-1 ring-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {friend?.avatar}
              </AvatarFallback>
            </Avatar>
            <span>{friend?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Friend Status */}
          <div className="text-center p-4 bg-secondary/20 rounded-lg border border-border">
            {isOffline ? (
              <div className="space-y-2">
                <Clock size={20} className="mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Last seen {friend?.timeAgo}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">{friend?.activity}</p>
                <p className="text-sm text-muted-foreground">
                  {friend?.location} • {friend?.timeAgo}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={onMessage}
            >
              <MessageCircle size={16} className="mr-2" />
              Send message
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-border"
              onClick={onInviteToPlan}
            >
              <Plus size={16} className="mr-2" />
              Add to a plan
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-border"
              onClick={onPing}
            >
              {isOffline ? "Send a ping to check in?" : "Ping them"}
            </Button>
          </div>

          {isOffline && (
            <p className="text-xs text-muted-foreground text-center">
              {friend?.name} is offline — they'll get your message when they're back
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SoloFriendActionModal;
