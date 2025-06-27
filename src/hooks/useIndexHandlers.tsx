
import { useCallback } from 'react';

interface HandlerDependencies {
  setShowProfile: (show: boolean) => void;
  setShowWatchlist: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowMessages: (show: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  markAsRead: () => void;
}

export const useIndexHandlers = ({
  setShowProfile,
  setShowWatchlist,
  setShowSettings,
  setShowMessages,
  setUserMenuOpen,
  setActiveTab,
  markAsRead
}: HandlerDependencies) => {
  const handleFavoritesOpen = useCallback(() => {
    setActiveTab('favorites');
    setUserMenuOpen(false);
  }, [setActiveTab, setUserMenuOpen]);

  const handleProfileOpen = useCallback(() => {
    setShowProfile(true);
    setUserMenuOpen(false);
  }, [setShowProfile, setUserMenuOpen]);

  const handleWatchlistOpen = useCallback(() => {
    setShowWatchlist(true);
    setUserMenuOpen(false);
  }, [setShowWatchlist, setUserMenuOpen]);

  const handleSettingsOpen = useCallback(() => {
    setShowSettings(true);
    setUserMenuOpen(false);
  }, [setShowSettings, setUserMenuOpen]);

  const handleUserMenuOpen = useCallback(() => {
    markAsRead(); // Mark notifications as read when user opens menu
    setUserMenuOpen(true);
  }, [markAsRead, setUserMenuOpen]);

  const handleMessagesOpen = useCallback(() => {
    setShowMessages(true);
    setUserMenuOpen(false);
    markAsRead(); // Mark notifications as read when opening messages
  }, [setShowMessages, setUserMenuOpen, markAsRead]);

  return {
    handleFavoritesOpen,
    handleProfileOpen,
    handleWatchlistOpen,
    handleSettingsOpen,
    handleUserMenuOpen,
    handleMessagesOpen
  };
};
