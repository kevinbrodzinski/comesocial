
import React, { useState } from 'react';
import { X, Search, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { friendsData } from '@/data/friendsData';

interface FriendSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFriend: (friend: any) => void;
}

const FriendSelectorModal = ({ isOpen, onClose, onSelectFriend }: FriendSelectorModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredFriends = friendsData.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center md:items-center">
      <div className="bg-background rounded-t-2xl md:rounded-2xl w-full max-w-md mx-4 h-[80vh] md:h-auto md:max-h-[80vh] flex flex-col animate-slide-in-right md:animate-scale-in">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <MessageCircle size={20} className="text-primary" />
            <h2 className="font-semibold">New Message</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No friends found</p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  onSelectFriend(friend);
                  onClose();
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.avatar}</AvatarFallback>
                      </Avatar>
                      {friend.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{friend.name}</span>
                        {friend.status === 'active' && friend.location && (
                          <Badge variant="outline" className="text-xs ml-2">
                            {friend.location}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {friend.status === 'active' ? friend.activity : friend.lastSeen}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendSelectorModal;
