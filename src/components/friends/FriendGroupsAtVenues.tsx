
import React from 'react';
import { MessageSquare, MapPin, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface FriendGroupsAtVenuesProps {
  friends: any[];
  onOpenMessage: (friends: any[]) => void;
  onFriendProfileOpen: (friend: any) => void;
  onPingToJoin: (friends: any[]) => void;
  onVenueClick: (venue: string) => void;
  onAttendeeListClick: (friends: any[]) => void;
  onGroupChat: (friends: any[]) => void;
  onGroupAction: (friends: any[]) => void;
  variant: 'activity' | 'nearby';
}

const FriendGroupsAtVenues = ({ 
  friends, 
  onOpenMessage, 
  onFriendProfileOpen, 
  onPingToJoin,
  onVenueClick,
  onAttendeeListClick,
  onGroupChat,
  onGroupAction,
  variant 
}: FriendGroupsAtVenuesProps) => {
  // Group friends by venue/location
  const groupedFriends = friends.reduce((groups: { [key: string]: any[] }, friend) => {
    const location = friend.location || 'Unknown Location';
    if (!groups[location]) {
      groups[location] = [];
    }
    groups[location].push(friend);
    return groups;
  }, {});

  // Filter to only show groups with 2+ friends
  const validGroups = Object.entries(groupedFriends).filter(([_, groupFriends]) => (groupFriends as any[]).length >= 2);

  if (validGroups.length === 0) {
    return null;
  }

  const getGroupStatusText = (groupFriends: any[]) => {
    const statusCounts = groupFriends.reduce((counts: { [key: string]: number }, friend) => {
      counts[friend.currentAction] = (counts[friend.currentAction] || 0) + 1;
      return counts;
    }, {});

    const dominantStatus = Object.entries(statusCounts).reduce((a, b) => 
      statusCounts[a[0]] > statusCounts[b[0]] ? a : b
    )[0];

    const getStatusText = (status: string, count: number) => {
      const statusMap: { [key: string]: string } = {
        'checked-in': 'Checked In',
        'pre-gaming': 'Pre-Gaming',
        'on-the-way': 'On The Way'
      };
      return `${count} Friends ${statusMap[status] || status}`;
    };

    return getStatusText(dominantStatus, statusCounts[dominantStatus]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground px-1">
        Friend Groups ({validGroups.length})
      </h3>
      
      <div className="space-y-3">
        {validGroups.map(([venue, groupFriends]) => {
          const typedGroupFriends = groupFriends as any[];
          
          return (
            <Card key={venue} className="border border-border relative">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin size={16} className="text-primary flex-shrink-0" />
                      <button 
                        className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate"
                        onClick={() => onVenueClick(venue)}
                      >
                        {venue}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge variant="purple" className="text-xs text-white">
                      {getGroupStatusText(typedGroupFriends)}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => onGroupAction(typedGroupFriends)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Friend Avatars - Now with sticky positioning */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 sticky left-0 z-10">
                      {typedGroupFriends.slice(0, 4).map((friend, index) => (
                        <button
                          key={friend.id}
                          onClick={() => onFriendProfileOpen(friend)}
                          className="relative hover:z-20 transition-transform hover:scale-110 sticky"
                          style={{ zIndex: typedGroupFriends.length - index + 10 }}
                        >
                          <Avatar className="w-8 h-8 ring-2 ring-background shadow-sm">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                              {friend.avatar}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                      ))}
                      
                      {typedGroupFriends.length > 4 && (
                        <button
                          onClick={() => onAttendeeListClick(typedGroupFriends)}
                          className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium hover:bg-muted/80 transition-colors sticky shadow-sm"
                          style={{ zIndex: 15 }}
                        >
                          +{typedGroupFriends.length - 4}
                        </button>
                      )}
                    </div>
                    
                    <div className="ml-3 text-xs text-muted-foreground">
                      <span className="font-medium">{typedGroupFriends.length}</span> friends
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => onGroupChat(typedGroupFriends)}
                      title="Group chat"
                    >
                      <MessageSquare size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => onPingToJoin(typedGroupFriends)}
                      title="Ask to join"
                    >
                      <Users size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FriendGroupsAtVenues;
