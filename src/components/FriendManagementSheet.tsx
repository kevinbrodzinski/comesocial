
import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Settings, Clock, MessageSquare, UserCheck, UserX, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface FriendManagementSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: () => void;
}

const FriendManagementSheet = ({ isOpen, onClose, onAddFriend }: FriendManagementSheetProps) => {
  const [selectedTab, setSelectedTab] = useState('requests');
  const { toast } = useToast();

  // Mock data for friend requests and suggestions
  const pendingRequests = [
    {
      id: 1,
      name: 'Taylor Swift',
      avatar: 'TS',
      mutualFriends: 3,
      timeAgo: '2 hours ago',
      type: 'incoming'
    },
    {
      id: 2,
      name: 'Chris Evans',
      avatar: 'CE',
      mutualFriends: 1,
      timeAgo: '1 day ago',
      type: 'incoming'
    },
    {
      id: 7,
      name: 'David Kim',
      avatar: 'DK',
      mutualFriends: 2,
      timeAgo: '3 hours ago',
      type: 'outgoing'
    }
  ];

  const friendSuggestions = [
    {
      id: 3,
      name: 'Maya Patel',
      avatar: 'MP',
      mutualFriends: 5,
      reason: 'Works at TechCorp',
      category: 'workplace'
    },
    {
      id: 4,
      name: 'Jake Wilson',
      avatar: 'JW',
      mutualFriends: 2,
      reason: 'Mutual friend: Alex Martinez',
      category: 'mutual'
    },
    {
      id: 8,
      name: 'Lisa Chen',
      avatar: 'LC',
      mutualFriends: 4,
      reason: 'Went to same university',
      category: 'education'
    }
  ];

  const recentlyAdded = [
    {
      id: 5,
      name: 'Sophie Turner',
      avatar: 'ST',
      addedDate: '3 days ago',
      status: 'active'
    },
    {
      id: 6,
      name: 'Ryan Garcia',
      avatar: 'RG',
      addedDate: '1 week ago',
      status: 'inactive'
    }
  ];

  const blockedFriends = [
    {
      id: 9,
      name: 'Anonymous User',
      avatar: 'AU',
      blockedDate: '2 weeks ago',
      reason: 'Spam messages'
    }
  ];

  const handleAcceptRequest = (requestId: number, name: string) => {
    toast({
      title: "Friend request accepted! 🎉",
      description: `You and ${name} are now friends`,
    });
  };

  const handleDeclineRequest = (requestId: number, name: string) => {
    toast({
      title: "Request declined",
      description: `Declined friend request from ${name}`,
    });
  };

  const handleCancelOutgoing = (requestId: number, name: string) => {
    toast({
      title: "Request cancelled",
      description: `Cancelled friend request to ${name}`,
    });
  };

  const handleSendFriendRequest = (suggestionId: number, name: string) => {
    toast({
      title: "Friend request sent! 📤",
      description: `Sent friend request to ${name}`,
    });
  };

  const handleUnblockFriend = (friendId: number, name: string) => {
    toast({
      title: "Friend unblocked",
      description: `${name} has been unblocked`,
    });
  };

  const handleRemoveFriend = (friendId: number, name: string) => {
    toast({
      title: "Friend removed",
      description: `Removed ${name} from your friends list`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Users size={20} className="mr-2" />
            Manage Friends
          </SheetTitle>
          <SheetDescription>
            Manage friend requests, suggestions, and connections
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Add Friend Button */}
          <Button 
            onClick={onAddFriend} 
            className="w-full bg-primary hover:bg-primary/80 mb-6"
          >
            <UserPlus size={16} className="mr-2" />
            Add New Friend
          </Button>

          {/* Tabs for different management sections */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="requests" className="text-xs">
                Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="text-xs">
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">
                Recent
              </TabsTrigger>
              <TabsTrigger value="blocked" className="text-xs">
                Blocked
              </TabsTrigger>
            </TabsList>

            {/* Friend Requests Tab */}
            <TabsContent value="requests" className="space-y-4 mt-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Incoming Requests</h3>
                {pendingRequests.filter(r => r.type === 'incoming').map((request) => (
                  <Card key={request.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {request.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{request.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.mutualFriends} mutual friends • {request.timeAgo}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs h-7"
                          onClick={() => handleAcceptRequest(request.id, request.name)}
                        >
                          <UserCheck size={12} className="mr-1" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs h-7"
                          onClick={() => handleDeclineRequest(request.id, request.name)}
                        >
                          <UserX size={12} className="mr-1" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <h3 className="font-semibold text-foreground mt-6">Outgoing Requests</h3>
                {pendingRequests.filter(r => r.type === 'outgoing').map((request) => (
                  <Card key={request.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                            {request.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{request.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Sent {request.timeAgo}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 px-2"
                          onClick={() => handleCancelOutgoing(request.id, request.name)}
                        >
                          <UserX size={12} className="mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Friend Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">People You May Know</h3>
                  <Badge variant="outline">{friendSuggestions.length}</Badge>
                </div>
                {friendSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                            {suggestion.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {suggestion.reason}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {suggestion.mutualFriends} mutual friends
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 px-2"
                          onClick={() => handleSendFriendRequest(suggestion.id, suggestion.name)}
                        >
                          <UserPlus size={12} className="mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Recently Added Tab */}
            <TabsContent value="recent" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Recently Added</h3>
                  <Badge variant="outline">{recentlyAdded.length}</Badge>
                </div>
                {recentlyAdded.map((friend) => (
                  <Card key={friend.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm truncate">{friend.name}</p>
                            <Badge 
                              variant={friend.status === 'active' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {friend.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Added {friend.addedDate}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                            <MessageSquare size={12} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 px-2 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveFriend(friend.id, friend.name)}
                          >
                            <UserMinus size={12} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Blocked Friends Tab */}
            <TabsContent value="blocked" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Blocked Users</h3>
                  <Badge variant="outline">{blockedFriends.length}</Badge>
                </div>
                {blockedFriends.map((friend) => (
                  <Card key={friend.id} className="border-border bg-muted/20">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Blocked {friend.blockedDate} • {friend.reason}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 px-2"
                          onClick={() => handleUnblockFriend(friend.id, friend.name)}
                        >
                          <Eye size={12} className="mr-1" />
                          Unblock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {blockedFriends.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <EyeOff size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No blocked users</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FriendManagementSheet;
