
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Friend } from '@/data/friendsData';
import { FriendStatus } from '@/types/planFriendTracking';

interface FriendStatusListProps {
  friendsPresent: Friend[];
  friendsEnRoute: Friend[];
  friendsNoResponse: Friend[];
  friendsLeftEarly: Friend[];
  friendStatuses: FriendStatus[];
}

const FriendStatusList = ({
  friendsPresent,
  friendsEnRoute,
  friendsNoResponse,
  friendsLeftEarly,
  friendStatuses
}: FriendStatusListProps) => {
  const getStatusInfo = (friend: Friend) => {
    const status = friendStatuses.find(fs => fs.friendId === friend.id);
    if (!status) return null;

    const timeAgo = Math.floor((Date.now() - new Date(status.lastUpdate).getTime()) / 60000);
    const timeText = timeAgo < 1 ? 'Just now' : `${timeAgo}m ago`;

    return { status, timeText };
  };

  const renderFriendGroup = (friends: Friend[], statusType: string, color: string) => {
    if (friends.length === 0) return null;

    return (
      <div className="space-y-2">
        {friends.map(friend => {
          const statusInfo = getStatusInfo(friend);
          if (!statusInfo) return null;

          const { status, timeText } = statusInfo;

          return (
            <div key={friend.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2 flex-1">
                  <p className="font-medium text-sm">{friend.name}</p>
                  <Badge variant="outline" className={`text-xs ${color}`}>
                    {statusType}
                  </Badge>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground ml-auto">
                    {status.eta && (
                      <span className="font-medium text-primary">ETA {status.eta}</span>
                    )}
                    <span>{timeText}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const totalFriends = friendsPresent.length + friendsEnRoute.length + friendsNoResponse.length + friendsLeftEarly.length;

  if (totalFriends === 0) {
    return (
      <div className="text-center py-3 text-sm text-muted-foreground">
        No friends tracked for this stop
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {renderFriendGroup(friendsPresent, 'Checked in', 'bg-green-100 text-green-800 border-green-300')}
      {renderFriendGroup(friendsEnRoute, 'On the way', 'bg-blue-100 text-blue-800 border-blue-300')}
      {renderFriendGroup(friendsNoResponse, 'No response', 'bg-gray-100 text-gray-800 border-gray-300')}
      {renderFriendGroup(friendsLeftEarly, 'Left early', 'bg-red-100 text-red-800 border-red-300')}
    </div>
  );
};

export default FriendStatusList;
