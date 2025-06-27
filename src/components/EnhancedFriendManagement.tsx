import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Settings, MessageSquare, UserCheck, UserX, Eye, EyeOff, MoreHorizontal, Trash2, Archive, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface EnhancedFriendManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUserDiscovery: () => void;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: 'active' | 'inactive';
  addedDate: string;
  lastInteraction: string;
  mutualFriends: number;
  sharedVenues: number;
  category: 'close' | 'regular' | 'acquaintance';
}

const EnhancedFriendManagement = ({ isOpen, onClose, onOpenUserDiscovery }: EnhancedFriendManagementProps) => {
  const [selectedTab, setSelectedTab] = useState('friends');
  const [unfriendDialog, setUnfriendDialog] = useState<{ isOpen: boolean; friend: Friend | null }>({
    isOpen: false,
    friend: null
  });
  const [blockDialog, setBlockDialog] = useState<{ isOpen: boolean; friend: Friend | null }>({
    isOpen: false,
    friend: null
  });
  const { toast } = useToast();

  const friends: Friend[] = [
    {
      id: 1,
      name: 'Alex Martinez',
      avatar: 'AM',
      status: 'active',
      addedDate: '6 months ago',
      lastInteraction: '2 hours ago',
      mutualFriends: 8,
      sharedVenues: 12,
      category: 'close'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: 'SC',
      status: 'active',
      addedDate: '3 months ago',
      lastInteraction: '1 day ago',
      mutualFriends: 5,
      sharedVenues: 8,
      category: 'close'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: 'MJ',
      status: 'inactive',
      addedDate: '2 weeks ago',
      lastInteraction: '1 week ago',
      mutualFriends: 2,
      sharedVenues: 3,
      category: 'regular'
    }
  ];

  const incomingRequests = [
    {
      id: 101,
      name: 'Emma Stone',
      username: '@emmastone',
      avatar: 'ES',
      mutualFriends: 3,
      mutualFriendsList: ['Alex Martinez', 'Sarah Chen', 'Mike Johnson'],
      mutualEvents: 2,
      mutualEventsList: ['Downtown Night Out', 'Chill Rooftop Evening'],
      sentAgo: '5m ago',
    },
    {
      id: 102,
      name: 'Ryan Gosling',
      username: '@ryangosling',
      avatar: 'RG',
      mutualFriends: 2,
      mutualFriendsList: ['Sarah Chen', 'Mike Johnson'],
      mutualEvents: 1,
      mutualEventsList: ['Weekend Club Night'],
      sentAgo: '1h ago',
    },
    {
      id: 103,
      name: 'Taylor Swift',
      username: '@taylorswift',
      avatar: 'TS',
      mutualFriends: 5,
      mutualFriendsList: ['Alex Martinez', 'Sarah Chen', 'Mike Johnson', 'Emma Stone', 'Ryan Gosling'],
      mutualEvents: 3,
      mutualEventsList: ['Downtown Night Out', 'Chill Rooftop Evening', 'Weekend Club Night'],
      sentAgo: 'now',
    },
  ];

  const [mutualModal, setMutualModal] = useState<{ open: boolean; type: 'friends' | 'events'; user: any | null }>({ open: false, type: 'friends', user: null });

  const handleUnfriend = (friend: Friend) => {
    setUnfriendDialog({ isOpen: true, friend });
  };

  const confirmUnfriend = () => {
    if (unfriendDialog.friend) {
      toast({
        title: "Friend removed",
        description: `${unfriendDialog.friend.name} has been removed from your friends list`,
      });
      setUnfriendDialog({ isOpen: false, friend: null });
    }
  };

  const handleBlock = (friend: Friend) => {
    setBlockDialog({ isOpen: true, friend });
  };

  const confirmBlock = () => {
    if (blockDialog.friend) {
      toast({
        title: "User blocked",
        description: `${blockDialog.friend.name} has been blocked`,
      });
      setBlockDialog({ isOpen: false, friend: null });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'close': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'regular': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'acquaintance': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Users size={20} className="mr-2" />
              Friend Management
            </SheetTitle>
            <SheetDescription>
              Manage your connections and friend network
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {/* Enhanced Add Friend Button */}
            <Button 
              onClick={() => {
                onClose();
                onOpenUserDiscovery();
              }}
              className="w-full bg-primary hover:bg-primary/80 mb-6"
            >
              <UserPlus size={16} className="mr-2" />
              Discover New People
            </Button>

            {/* Enhanced Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="friends" className="text-xs">
                  Friends
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                    {friends.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="requests" className="text-xs">
                  Requests
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    3
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="blocked" className="text-xs">
                  Blocked
                </TabsTrigger>
              </TabsList>

              {/* Friends Management Tab */}
              <TabsContent value="friends" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Your Friends</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {friends.filter(f => f.category === 'close').length} Close
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {friends.filter(f => f.status === 'active').length} Active
                      </Badge>
                    </div>
                  </div>
                  
                  {friends.map((friend) => (
                    <Card key={friend.id} className="border-border">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {friend.avatar}
                              </AvatarFallback>
                            </Avatar>
                            {friend.status === 'active' && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{friend.name}</p>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getCategoryColor(friend.category)}`}
                              >
                                {friend.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Friends since {friend.addedDate} • {friend.mutualFriends} mutual • {friend.sharedVenues} venues
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last interaction: {friend.lastInteraction}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare size={14} className="mr-2" />
                                Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye size={14} className="mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Archive size={14} className="mr-2" />
                                Change Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleUnfriend(friend)}
                                className="text-orange-600"
                              >
                                <UserMinus size={14} className="mr-2" />
                                Unfriend
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleBlock(friend)}
                                className="text-red-600"
                              >
                                <EyeOff size={14} className="mr-2" />
                                Block
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Friend Requests Tab - Enhanced */}
              <TabsContent value="requests" className="space-y-4 mt-4">
                {incomingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No incoming friend requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incomingRequests.map((req) => (
                      <Card key={req.id} className="border-border">
                        <CardContent className="p-3 flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">{req.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">{req.name}</span>
                              <span className="text-xs text-muted-foreground">{req.username}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <button
                                className="underline hover:text-primary"
                                onClick={() => setMutualModal({ open: true, type: 'friends', user: req })}
                              >
                                {req.mutualFriends} mutual
                              </button>
                              <button
                                className="flex items-center gap-1 underline hover:text-primary"
                                onClick={() => setMutualModal({ open: true, type: 'events', user: req })}
                              >
                                <Calendar size={12} className="inline-block" />
                                {req.mutualEvents} events
                              </button>
                              <span className="text-muted-foreground">{req.sentAgo}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 h-8" onClick={() => {/* Accept logic */}}>
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="px-3 py-1 h-8" onClick={() => {/* Decline logic */}}>
                              Decline
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {/* Mutual Friends/Events Modal */}
                {mutualModal.open && mutualModal.user && (
                  <AlertDialog open={mutualModal.open} onOpenChange={(open) => setMutualModal({ ...mutualModal, open })}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {mutualModal.type === 'friends' ? 'Mutual Friends' : 'Mutual Events'} with {mutualModal.user.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {(mutualModal.type === 'friends'
                              ? mutualModal.user.mutualFriendsList
                              : mutualModal.user.mutualEventsList
                            ).map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TabsContent>

              {/* Blocked Users Tab */}
              <TabsContent value="blocked" className="space-y-4 mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <EyeOff size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No blocked users</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Unfriend Confirmation Dialog */}
      <AlertDialog open={unfriendDialog.isOpen} onOpenChange={(open) => !open && setUnfriendDialog({ isOpen: false, friend: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserMinus size={20} className="text-orange-500" />
              Remove Friend?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{unfriendDialog.friend?.name}</strong> from your friends list? 
              You can always send them a friend request again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnfriend} className="bg-orange-500 hover:bg-orange-600">
              Remove Friend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={blockDialog.isOpen} onOpenChange={(open) => !open && setBlockDialog({ isOpen: false, friend: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              Block User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block <strong>{blockDialog.friend?.name}</strong>? They won't be able to:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Send you messages or friend requests</li>
                <li>See your profile or activity</li>
                <li>Find you in search results</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlock} className="bg-red-500 hover:bg-red-600">
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EnhancedFriendManagement;
