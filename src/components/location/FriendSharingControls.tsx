
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Check } from 'lucide-react';
import { Friend } from '@/data/friendsData';
import { useLocationSharingSettings } from '@/hooks/useLocationSharingSettings';

interface FriendSharingControlsProps {
  friends: Friend[];
  selectedFriends: number[];
  onSelectedFriendsChange: (friendIds: number[]) => void;
  mode: 'select' | 'overrides';
}

const FriendSharingControls = ({ 
  friends, 
  selectedFriends, 
  onSelectedFriendsChange, 
  mode 
}: FriendSharingControlsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getFriendSharingSetting, updateFriendOverride } = useLocationSharingSettings();

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFriendToggle = (friendId: number) => {
    if (mode === 'select') {
      const newSelected = selectedFriends.includes(friendId)
        ? selectedFriends.filter(id => id !== friendId)
        : [...selectedFriends, friendId];
      onSelectedFriendsChange(newSelected);
    }
  };

  const handleOverrideChange = (friendId: number, setting: 'on' | 'off' | 'plan-only') => {
    updateFriendOverride(friendId, setting);
  };

  if (mode === 'select') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users size={16} className="text-primary" />
            Select Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedFriends.length} of {friends.length} friends selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectedFriendsChange([])}
              disabled={selectedFriends.length === 0}
            >
              Clear all
            </Button>
          </div>

          {/* Friends list */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredFriends.map((friend) => {
              const isSelected = selectedFriends.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-card border-border hover:bg-accent'
                  }`}
                  onClick={() => handleFriendToggle(friend.id)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {friend.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.isNearby ? 'Nearby' : 'Away'}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <Check size={16} className="text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users size={16} className="text-primary" />
          Friend Overrides
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize location sharing for specific friends
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Friends list with overrides */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredFriends.map((friend) => {
            const currentSetting = getFriendSharingSetting(friend.id);
            return (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {friend.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium text-sm">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.isNearby ? 'Nearby' : 'Away'}
                    </p>
                  </div>
                </div>

                <Select
                  value={currentSetting}
                  onValueChange={(value: 'on' | 'off' | 'plan-only') => 
                    handleOverrideChange(friend.id, value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">On</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="plan-only">Plan Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendSharingControls;
