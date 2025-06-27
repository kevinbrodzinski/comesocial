
import React, { useState } from 'react';
import { Search, QrCode, UserPlus, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: 'Jessica Kim',
      username: '@jessicak',
      avatar: 'JK',
      mutualFriends: 3,
      isOnline: true
    },
    {
      id: 2,
      name: 'David Chen',
      username: '@davidc',
      avatar: 'DC',
      mutualFriends: 1,
      isOnline: false
    }
  ]);

  const filteredResults = searchResults.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  if (showQRScanner) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl ring-1 ring-border">
          <div className="p-6 text-center">
            <div className="w-64 h-64 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center border border-border">
              <Camera size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">QR Scanner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Point your camera at a friend's QR code to connect
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowQRScanner(false)}>
                Cancel
              </Button>
              <Button className="flex-1">
                Enable Camera
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-in-right shadow-xl ring-1 ring-border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add Friends</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by username, phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-border bg-background"
            />
          </div>

          {/* QR Scanner Button */}
          <Button 
            variant="outline" 
            className="w-full mb-6 border-border" 
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode size={16} className="mr-2" />
            Scan QR Code
          </Button>

          {/* Search Results */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {searchQuery && filteredResults.length > 0 ? (
              filteredResults.map((user) => (
                <Card key={user.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.mutualFriends} mutual friends
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserPlus size={14} className="mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : searchQuery ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try searching by username or phone number
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Search for friends</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a username or phone number to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
