import React, { useState } from 'react';
import { Search, Check, Users, Send } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Friend, friendsData } from '@/data/friendsData';
import { cn } from '@/lib/utils';
import { getFeatureFlag } from '@/utils/featureFlags';

interface FriendPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: (selectedFriends: Friend[]) => void;
}

const FriendPickerSheet = ({ open, onOpenChange, onNext }: FriendPickerSheetProps) => {
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'nearby' | 'recent'>('all');
  const isPolishEnabled = getFeatureFlag('co_plan_live_draft');

  const filteredFriends = friendsData.filter(friend => {
    if (friend.status !== 'active') return false;
    
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'nearby') {
      return matchesSearch && friend.isNearby;
    } else if (activeFilter === 'recent') {
      // Mock recent logic - could be based on recent interactions
      return matchesSearch && friend.id <= 5;
    }
    
    return matchesSearch;
  });

  const toggleFriend = (friend: Friend) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.id === friend.id);
      if (isSelected) {
        return prev.filter(f => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleNext = () => {
    if (selectedFriends.length > 0) {
      onNext(selectedFriends);
      onOpenChange(false);
      setSelectedFriends([]);
      setSearchQuery('');
      setActiveFilter('all');
    }
  };

  if (!isPolishEnabled) {
    // Fallback to original layout with improved scrolling
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center space-x-2">
              <Users size={20} />
              <span>Choose Friends to Co-plan With</span>
            </SheetTitle>
            <SheetDescription>
              Select friends who can help plan and edit this event together
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col space-y-4 mt-6 min-h-0">
            {/* Search - Sticky */}
            <div className="relative flex-shrink-0">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Friends Count - Sticky */}
            {selectedFriends.length > 0 && (
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3 flex-shrink-0">
                <span className="text-sm font-medium">
                  {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex -space-x-2">
                  {selectedFriends.slice(0, 3).map((friend) => (
                    <Avatar key={friend.id} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{friend.avatar}</AvatarFallback>
                    </Avatar>
                  ))}
                  {selectedFriends.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs">+{selectedFriends.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Friends List - Fully Scrollable */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-4 pb-4">
                  {filteredFriends.map((friend) => {
                    const isSelected = selectedFriends.some(f => f.id === friend.id);
                    return (
                      <div
                        key={friend.id}
                        onClick={() => toggleFriend(friend)}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          isSelected 
                            ? "bg-primary/10 border-primary" 
                            : "bg-card border-border hover:bg-muted/50"
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{friend.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{friend.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{friend.activity}</p>
                        </div>
                        {friend.isNearby && (
                          <Badge variant="secondary" className="text-xs">
                            Nearby
                          </Badge>
                        )}
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check size={14} className="text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Next Button - Sticky */}
            <Button
              onClick={handleNext}
              disabled={selectedFriends.length === 0}
              className="w-full flex-shrink-0"
              size="lg"
            >
              <span>Next</span>
              <Send size={16} className="ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center space-x-2">
            <Users size={20} />
            <span>Choose Friends to Co-plan With</span>
          </SheetTitle>
          <SheetDescription>
            Select friends who can help plan and edit this event together
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col space-y-4 mt-6 min-h-0">
          {/* Search with inline CTA */}
          <div className="relative flex items-center space-x-2 flex-shrink-0">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={selectedFriends.length === 0}
              size="icon"
              className="flex-shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>

          {/* Filter Pills - Sticky */}
          <div className="flex space-x-2 flex-shrink-0">
            <Button
              variant={activeFilter === 'nearby' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('nearby')}
              className="rounded-full"
            >
              Nearby
            </Button>
            <Button
              variant={activeFilter === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('recent')}
              className="rounded-full"
            >
              Recent
            </Button>
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="rounded-full"
            >
              All
            </Button>
          </div>

          {/* Selected Friends Count */}
          {selectedFriends.length > 0 && (
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3 flex-shrink-0">
              <span className="text-sm font-medium">
                {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex -space-x-2">
                {selectedFriends.slice(0, 3).map((friend) => (
                  <Avatar key={friend.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{friend.avatar}</AvatarFallback>
                  </Avatar>
                ))}
                {selectedFriends.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs">+{selectedFriends.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Friends List - Fully Scrollable */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-4 pb-4">
                {filteredFriends.map((friend) => {
                  const isSelected = selectedFriends.some(f => f.id === friend.id);
                  return (
                    <div
                      key={friend.id}
                      onClick={() => toggleFriend(friend)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        isSelected 
                          ? "bg-primary/10 border-primary" 
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{friend.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{friend.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{friend.activity}</p>
                      </div>
                      {friend.isNearby && (
                        <Badge variant="secondary" className="text-xs">
                          Nearby
                        </Badge>
                      )}
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check size={14} className="text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FriendPickerSheet;
