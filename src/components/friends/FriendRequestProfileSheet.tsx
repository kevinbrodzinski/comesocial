import React, { useState } from 'react';
import { X, MessageCircle, Users, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { FriendRequest } from '../../services/FriendRequestService';
import { getInteractionHistory } from '../../utils/friendRequestUtils';
import FullUserProfileModal from '../FullUserProfileModal';

interface FriendRequestProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  request: FriendRequest | null;
  onAccept: () => void;
  onDecline: () => void;
  onMessage?: () => void;
}

const FriendRequestProfileSheet = ({ 
  isOpen, 
  onClose, 
  request,
  onAccept,
  onDecline,
  onMessage
}: FriendRequestProfileSheetProps) => {
  const [fullProfileModalOpen, setFullProfileModalOpen] = useState(false);

  if (!isOpen || !request) return null;

  const { friendName, friendAvatar, mutualFriends, message } = request;
  const interactionHistory = getInteractionHistory(request);

  // Convert friend request to user format for FullUserProfileModal
  const userProfileData = {
    username: friendName,
    avatar: friendAvatar || friendName.slice(0, 2).toUpperCase(),
    mutualFriends: mutualFriends.length,
    lastSeen: 'Unknown'
  };

  const handleViewFullProfile = () => {
    setFullProfileModalOpen(true);
  };

  const handleMessageFirst = () => {
    onMessage?.();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
        <div className="bg-background rounded-t-3xl w-full max-w-md h-[85vh] flex flex-col overflow-hidden animate-slide-in-right">
          {/* Header with Profile Info */}
          <div className="p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {friendAvatar || friendName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{friendName}</h2>
                  <p className="text-sm text-muted-foreground">Wants to connect</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewFullProfile}
                    className="h-7 px-2 text-xs text-primary hover:bg-primary/10 mt-1"
                  >
                    <User size={12} className="mr-1" />
                    View Full Profile
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 space-y-6 pb-6">
            {/* Friend Request Message */}
            {message && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-3">
                  <p className="text-sm italic">"{message}"</p>
                </CardContent>
              </Card>
            )}

            {/* Mutual Friends Section - PRIORITY */}
            {mutualFriends.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Users size={16} className="text-primary" />
                  <h3 className="font-semibold">Mutual Friends</h3>
                  <Badge variant="secondary" className="text-xs">
                    {mutualFriends.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {mutualFriends.slice(0, 4).map((friend, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {friend.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{friend}</span>
                    </div>
                  ))}
                  {mutualFriends.length > 4 && (
                    <p className="text-xs text-muted-foreground pl-10">
                      and {mutualFriends.length - 4} more mutual friends
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Past Interactions History */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Calendar size={16} className="text-muted-foreground" />
                <h3 className="font-semibold">Connection History</h3>
              </div>
              <div className="space-y-2">
                {interactionHistory.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock size={12} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-2">
              {mutualFriends.length > 0 && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {mutualFriends.length} mutual friends
                </Badge>
              )}
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                New connection
              </Badge>
              {message && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  Personal message
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons - Sticky Bottom */}
          <div className="p-6 pt-0 flex-shrink-0 bg-background">
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button 
                  onClick={onAccept}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Accept Request
                </Button>
                <Button 
                  onClick={onDecline}
                  variant="outline"
                  className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  Decline
                </Button>
              </div>

              {/* Secondary Actions */}
              <Button 
                variant="ghost" 
                className="w-full text-primary hover:bg-primary/10"
                onClick={handleMessageFirst}
              >
                <MessageCircle size={16} className="mr-2" />
                Message First
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full User Profile Modal */}
      <FullUserProfileModal
        isOpen={fullProfileModalOpen}
        onClose={() => setFullProfileModalOpen(false)}
        user={userProfileData}
      />
    </>
  );
};

export default FriendRequestProfileSheet;
