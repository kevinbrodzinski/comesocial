
import React from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    avatar?: string;
    mutualFriends: number;
    lastSeen: string;
  } | null;
}

const UserProfileModal = ({ isOpen, onClose, user }: UserProfileModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in-0"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl max-h-[70vh] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Profile</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-bold">@{user.username}</h4>
              <p className="text-sm text-muted-foreground flex items-center">
                <Clock size={12} className="mr-1" />
                Active {user.lastSeen}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <Badge variant="secondary" className="text-xs">
              {user.mutualFriends} mutual friends
            </Badge>
          </div>

          <div className="space-y-2">
            <Button className="w-full">
              Message
            </Button>
            <Button variant="outline" className="w-full">
              View Full Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileModal;
