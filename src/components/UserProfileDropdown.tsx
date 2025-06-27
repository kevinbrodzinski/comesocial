
import React from 'react';
import { LogOut, User, Heart, List, Settings, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';

interface UserProfileDropdownProps {
  onFavoritesClick: () => void;
  onProfileClick: () => void;
  onWatchlistClick: () => void;
  onSettingsClick: () => void;
  onMessagesClick: () => void;
  unreadCount: number;
  hasUnread: boolean;
}

const UserProfileDropdown = ({
  onFavoritesClick,
  onProfileClick,
  onWatchlistClick,
  onSettingsClick,
  onMessagesClick,
  unreadCount,
  hasUnread
}: UserProfileDropdownProps) => {
  const { signOut, user } = useAuth();
  const { profileData } = useProfileData();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <NotificationBadge count={unreadCount} show={hasUnread}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </NotificationBadge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{profileData.name}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onFavoritesClick}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onWatchlistClick}>
            <List className="mr-2 h-4 w-4" />
            <span>Watchlist</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onMessagesClick}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Messages</span>
            {hasUnread && (
              <span className="ml-auto flex items-center justify-center min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileDropdown;
