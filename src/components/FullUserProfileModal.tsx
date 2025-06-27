import React, { useState } from 'react';
import { X, MapPin, Clock, Star, Calendar, Users, MessageCircle, UserPlus, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import MessageModal from './MessageModal';
import MutualFriendsModal from './MutualFriendsModal';

interface FullUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    avatar?: string;
    mutualFriends: number;
    lastSeen: string;
    id?: string;
    status?: 'active' | 'inactive';
    location?: string;
  } | null;
}

const FullUserProfileModal = ({ isOpen, onClose, user }: FullUserProfileModalProps) => {
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'friends' | 'sent'>('none');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [mutualFriendsModalOpen, setMutualFriendsModalOpen] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !user) return null;

  // Mock data - in real app, this would come from API
  const recentActivity = [
    { venue: 'Sky Bar', time: '2 hours ago', type: 'check-in' },
    { venue: 'Pulse Nightclub', time: '1 day ago', type: 'check-in' },
    { venue: 'The Rooftop', time: '3 days ago', type: 'favorite' }
  ];

  const favoriteVenues = [
    { name: 'Sky Bar', visits: 8, rating: 4.5 },
    { name: 'Pulse Nightclub', visits: 12, rating: 4.8 },
    { name: 'The Green Room', visits: 5, rating: 4.2 }
  ];

  // Mock mutual friends data
  const mutualFriendsData = [
    { id: '1', name: 'Sarah Chen', avatar: 'SC', status: 'active' as const, location: 'Downtown Bar', mutualConnections: 8 },
    { id: '2', name: 'Mike Johnson', avatar: 'MJ', status: 'inactive' as const, mutualConnections: 5 },
    { id: '3', name: 'Emma Wilson', avatar: 'EW', status: 'active' as const, location: 'Rooftop Lounge', mutualConnections: 12 },
    { id: '4', name: 'Alex Rodriguez', avatar: 'AR', status: 'active' as const, mutualConnections: 3 },
    { id: '5', name: 'Lisa Park', avatar: 'LP', status: 'inactive' as const, mutualConnections: 7 },
    { id: '6', name: 'David Kim', avatar: 'DK', status: 'active' as const, location: 'Jazz Club', mutualConnections: 9 }
  ];

  const handleAddFriend = () => {
    if (friendshipStatus === 'none') {
      setFriendshipStatus('sent');
      toast({
        title: "Friend request sent!",
        description: `Your friend request was sent to ${user.username}`,
      });
    } else if (friendshipStatus === 'pending') {
      setFriendshipStatus('friends');
      toast({
        title: "Friend request accepted!",
        description: `You and ${user.username} are now friends`,
      });
    }
  };

  const handleMessage = () => {
    setMessageModalOpen(true);
  };

  const handleMutualFriendsClick = () => {
    setMutualFriendsModalOpen(true);
  };

  const handleMutualFriendClick = (friend: any) => {
    setMutualFriendsModalOpen(false);
    // In real app, this would open the clicked friend's profile
    toast({
      title: "Opening profile",
      description: `Viewing ${friend.name}'s profile`,
    });
  };

  const getFriendButtonContent = () => {
    switch (friendshipStatus) {
      case 'sent':
        return { icon: <Clock size={16} />, text: 'Request Sent', disabled: true };
      case 'pending':
        return { icon: <UserCheck size={16} />, text: 'Accept Request', disabled: false };
      case 'friends':
        return { icon: <UserCheck size={16} />, text: 'Friends', disabled: true };
      default:
        return { icon: <UserPlus size={16} />, text: 'Add Friend', disabled: false };
    }
  };

  const friendButtonContent = getFriendButtonContent();

  // Convert user data to friend format for MessageModal
  const friendData = {
    id: user.id || Math.random().toString(),
    name: user.username,
    avatar: user.avatar || user.username.charAt(0).toUpperCase(),
    status: user.status || 'active',
    location: user.location,
    activity: user.lastSeen
  };

  return (
    <>
      <Dialog open={isOpen && !messageModalOpen && !mutualFriendsModalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
          {/* Header with Cover */}
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-purple-500/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="p-6 -mt-16">
            {/* Profile Info */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-lg">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">@{user.username}</h2>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Clock size={12} className="mr-1" />
                Active {user.lastSeen}
              </p>
              <Badge 
                variant="secondary" 
                className="mt-2 cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={handleMutualFriendsClick}
              >
                <Users size={12} className="mr-1" />
                {user.mutualFriends} mutual friends
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button className="flex-1" onClick={handleMessage}>
                <MessageCircle size={16} className="mr-2" />
                Message
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleAddFriend}
                disabled={friendButtonContent.disabled}
              >
                {friendButtonContent.icon}
                <span className="ml-2">{friendButtonContent.text}</span>
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center">
                <Calendar size={16} className="mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{activity.venue}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {activity.type} • {activity.time}
                      </p>
                    </div>
                    <MapPin size={14} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Venues */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center">
                <Star size={16} className="mr-2" />
                Favorite Venues
              </h3>
              <div className="space-y-2">
                {favoriteVenues.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{venue.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users size={10} className="mr-1" />
                        {venue.visits} visits
                        <Star size={10} className="ml-2 mr-1 fill-yellow-400 text-yellow-400" />
                        {venue.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <Button className="w-full" size="lg">
              Invite {user.username.split(' ')[0]} to Hang Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        friend={friendData}
      />

      {/* Mutual Friends Modal */}
      <MutualFriendsModal
        isOpen={mutualFriendsModalOpen}
        onClose={() => setMutualFriendsModalOpen(false)}
        userName={user.username}
        mutualFriends={mutualFriendsData}
        onFriendClick={handleMutualFriendClick}
      />
    </>
  );
};

export default FullUserProfileModal;
