
import React, { useState } from 'react';
import { X, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MutualFriend {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'inactive';
  location?: string;
  mutualConnections: number;
}

interface MutualFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  mutualFriends: MutualFriend[];
  onFriendClick: (friend: MutualFriend) => void;
}

const MutualFriendsModal = ({ 
  isOpen, 
  onClose, 
  userName, 
  mutualFriends, 
  onFriendClick 
}: MutualFriendsModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = mutualFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0">
        {/* Header - Fixed */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <ArrowLeft size={16} />
              </Button>
              <h2 className="text-lg font-semibold">Mutual Friends</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Friends you have in common with {userName}
          </p>

          {/* Search - Fixed */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search mutual friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Scrollable Friends List */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-3">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <Card 
                  key={friend.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onFriendClick(friend)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback>{friend.avatar}</AvatarFallback>
                        </Avatar>
                        {friend.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{friend.name}</p>
                        {friend.location && (
                          <p className="text-xs text-muted-foreground">At {friend.location}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {friend.mutualConnections} mutual connections
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No mutual friends found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MutualFriendsModal;
