
import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Friend {
  id: number;
  name: string;
  avatar: string;
}

interface FriendTaggerProps {
  selectedFriends: Friend[];
  onFriendsChange: (friends: Friend[]) => void;
  availableFriends: Friend[];
}

const FriendTagger = ({ selectedFriends, onFriendsChange, availableFriends }: FriendTaggerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFriends = availableFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedFriends.some(selected => selected.id === friend.id)
  );

  const handleAddFriend = (friend: Friend) => {
    onFriendsChange([...selectedFriends, friend]);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleRemoveFriend = (friendId: number) => {
    onFriendsChange(selectedFriends.filter(friend => friend.id !== friendId));
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Label className="text-sm font-medium mb-2 block">Who's Involved?</Label>
      
      {/* Selected Friends */}
      {selectedFriends.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedFriends.map((friend) => (
            <Badge
              key={friend.id}
              variant="secondary"
              className="flex items-center space-x-1 px-2 py-1"
            >
              <img src={friend.avatar} alt={friend.name} className="w-4 h-4 rounded-full" />
              <span className="text-xs">@{friend.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFriend(friend.id)}
                className="h-4 w-4 p-0 hover:bg-destructive/20"
              >
                <X size={10} />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative" ref={inputRef}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="@tag friends..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            className="pl-8"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredFriends.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
            {filteredFriends.slice(0, 5).map((friend) => (
              <Button
                key={friend.id}
                type="button"
                variant="ghost"
                onClick={() => handleAddFriend(friend)}
                className="w-full justify-start px-3 py-2 h-auto"
              >
                <img src={friend.avatar} alt={friend.name} className="w-6 h-6 rounded-full mr-2" />
                <span className="text-sm">{friend.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendTagger;
