import React, { useState } from 'react';
import { Search, MapPin, Users, Star, QrCode, X, Filter, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useToast } from '@/hooks/use-toast';

interface UserDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DiscoveredUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location?: string;
  mutualFriends: number;
  interests: string[];
  isVerified: boolean;
  isNearby: boolean;
  lastSeen: string;
  connectionSource: 'nearby' | 'mutual' | 'interests' | 'contacts' | 'search';
}

const UserDiscoveryModal = ({ isOpen, onClose }: UserDiscoveryModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { sendFriendRequest } = useFriendRequests();
  const { toast } = useToast();

  // Mock discovered users data
  const discoveredUsers: DiscoveredUser[] = [
    {
      id: 'user_1',
      name: 'Emma Stone',
      username: '@emmastone',
      avatar: 'ES',
      location: 'Sky Bar • 0.2mi away',
      mutualFriends: 3,
      interests: ['Photography', 'Live Music', 'Cocktails'],
      isVerified: true,
      isNearby: true,
      lastSeen: '5m ago',
      connectionSource: 'nearby'
    },
    {
      id: 'user_2',
      name: 'Ryan Gosling',
      username: '@ryangosling',
      avatar: 'RG',
      location: 'Manhattan',
      mutualFriends: 2,
      interests: ['Jazz', 'Film', 'Rooftops'],
      isVerified: true,
      isNearby: false,
      lastSeen: '1h ago',
      connectionSource: 'mutual'
    },
    {
      id: 'user_3',
      name: 'Taylor Swift',
      username: '@taylorswift',
      avatar: 'TS',
      location: 'The Rooftop • 0.1mi away',
      mutualFriends: 5,
      interests: ['Dancing', 'Pop Music', 'Nightlife'],
      isVerified: true,
      isNearby: true,
      lastSeen: 'now',
      connectionSource: 'nearby'
    }
  ];

  const suggestions = [
    { id: 'nearby', label: 'People Near You', count: 12, icon: MapPin },
    { id: 'mutual', label: 'Mutual Friends', count: 8, icon: Users },
    { id: 'interests', label: 'Similar Interests', count: 15, icon: Star },
    { id: 'contacts', label: 'From Contacts', count: 4, icon: Users }
  ];

  const filters = ['Verified Users', 'Nearby Only', 'Mutual Friends', 'Active Now', 'Same Interests'];

  const handleSendRequest = (user: DiscoveredUser) => {
    sendFriendRequest(user.id, user.name, `Hi ${user.name}! I'd love to connect.`);
    toast({
      title: "Friend request sent! 📤",
      description: `Sent friend request to ${user.name}`,
    });
  };

  const filteredUsers = discoveredUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.interests.some(interest => 
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[95vh] overflow-hidden shadow-xl">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Discover People</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-16 text-sm md:text-sm"
              style={{ fontSize: '16px' }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-6 px-2"
              >
                <Filter size={12} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <QrCode size={12} />
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-3 p-2 bg-muted/20 rounded-lg">
              <div className="flex flex-wrap gap-1">
                {filters.map(filter => (
                  <Badge
                    key={filter}
                    variant={selectedFilters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-2 py-1"
                    onClick={() => {
                      setSelectedFilters(prev =>
                        prev.includes(filter)
                          ? prev.filter(f => f !== filter)
                          : [...prev, filter]
                      );
                    }}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="discover" className="text-xs">Discover</TabsTrigger>
              <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
              <TabsTrigger value="qr" className="text-xs">QR Share</TabsTrigger>
            </TabsList>

            {/* Discover Tab - Mobile Optimized */}
            <TabsContent value="discover" className="mt-3">
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="border-border/50">
                    <CardContent className="p-3">
                      {/* Mobile-optimized layout: vertical stacking */}
                      <div className="space-y-2">
                        {/* Top row: Avatar, name, and verified badge */}
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            {user.isVerified && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <Shield size={6} className="text-white" />
                              </div>
                            )}
                            {user.isNearby && (
                              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-card" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                              <p className="font-medium text-sm truncate">{user.name}</p>
                              <Badge 
                                variant="outline" 
                                className="text-xs px-1 py-0 h-4 capitalize"
                              >
                                {user.connectionSource}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                          </div>
                        </div>

                        {/* Second row: Location (if available) */}
                        {user.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={10} className="flex-shrink-0" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}

                        {/* Third row: Stats and interests */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{user.mutualFriends} mutual</span>
                            <span>•</span>
                            <span>{user.lastSeen}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.interests.slice(0, 2).map(interest => (
                              <Badge key={interest} variant="secondary" className="text-xs px-2 py-0 h-5">
                                {interest}
                              </Badge>
                            ))}
                            {user.interests.length > 2 && (
                              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                                +{user.interests.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Bottom row: Add button (full width for easier mobile interaction) */}
                        <Button 
                          size="sm" 
                          className="w-full h-8"
                          onClick={() => handleSendRequest(user)}
                        >
                          <UserPlus size={12} className="mr-1" />
                          Add Friend
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <Card key={suggestion.id} className="border-border/50 cursor-pointer hover:bg-muted/20">
                      <CardContent className="p-3 text-center">
                        <IconComponent size={20} className="mx-auto mb-2 text-primary" />
                        <p className="font-medium text-sm">{suggestion.label}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.count} people</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* QR Share Tab */}
            <TabsContent value="qr" className="mt-3">
              <div className="text-center space-y-3">
                <div className="w-40 h-40 bg-muted rounded-2xl mx-auto flex items-center justify-center border-2 border-dashed border-border">
                  <QrCode size={48} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Share Your QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    Let others scan to connect with you instantly
                  </p>
                </div>
                <Button className="w-full" size="sm">
                  Share QR Code
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDiscoveryModal;
