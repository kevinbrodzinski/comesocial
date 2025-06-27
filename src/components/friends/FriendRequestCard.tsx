
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FriendRequest } from '../../services/FriendRequestService';
import FriendRequestActions from '../FriendRequestActions';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: () => void;
  onDecline: () => void;
  onCancel?: () => void;
  onProfileClick?: (request: FriendRequest) => void;
}

const FriendRequestCard = ({ request, onAccept, onDecline, onCancel, onProfileClick }: FriendRequestCardProps) => {
  const { friendName, friendAvatar, mutualFriends, type } = request;
  
  const isIncoming = type === 'incoming';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger profile click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onProfileClick?.(request);
  };

  const handleWithdraw = () => {
    onCancel?.();
  };

  return (
    <Card 
      className="border-l-2 border-l-primary cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          {/* Left side - Avatar and name/mutuals */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {friendAvatar || friendName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-xs truncate">{friendName}</div>
              {mutualFriends && mutualFriends.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {mutualFriends.length} mutual
                </div>
              )}
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex-shrink-0 ml-2">
            {isIncoming ? (
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept();
                  }}
                  className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded flex items-center"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecline();
                  }}
                  className="h-6 px-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded flex items-center"
                >
                  Decline
                </button>
              </div>
            ) : (
              <FriendRequestActions
                requestId={request.id}
                friendName={friendName}
                requestType="outgoing"
                onWithdraw={handleWithdraw}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendRequestCard;
