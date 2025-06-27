
import React from 'react';
import SplashScreen from '../components/SplashScreen';
import UserProfileDropdown from '../components/UserProfileDropdown';
import ActiveViewRenderer from '../components/index/ActiveViewRenderer';
import BottomNavigation from '../components/index/BottomNavigation';
import { useAppStore } from '../stores/useAppStore';
import { useIndexNavigation } from '../hooks/useIndexNavigation';
import { useIndexHandlers } from '../hooks/useIndexHandlers';
import { useNotificationBadge } from '../hooks/useNotificationBadge';

const Index = () => {
  const {
    activeTab,
    setActiveTab,
    showProfile,
    setShowProfile,
    showWatchlist,
    setShowWatchlist,
    showSettings,
    setShowSettings,
    showMessages,
    setShowMessages,
    showSplash,
    setShowSplash,
    initialVibe,
    setInitialVibe,
    checkShouldShowSplash,
    markSplashShown
  } = useAppStore();

  const { unreadCount, hasUnread, markAsRead, invitationCount } = useNotificationBadge();

  const { handlePlannerOpen } = useIndexNavigation({
    setActiveTab,
    setShowSplash,
    setShowMessages,
    invitationCount
  });

  const {
    handleFavoritesOpen,
    handleProfileOpen,
    handleWatchlistOpen,
    handleSettingsOpen,
    handleMessagesOpen
  } = useIndexHandlers({
    setShowProfile,
    setShowWatchlist,
    setShowSettings,
    setShowMessages,
    setUserMenuOpen: () => {}, // No longer needed since dropdown handles its own state
    setActiveTab,
    markAsRead
  });

  const handleSplashComplete = (targetTab: string, initialMessage?: string) => {
    setActiveTab(targetTab);
    if (initialMessage) {
      setInitialVibe(initialMessage);
    }
    setShowSplash(false);
    markSplashShown();
  };

  const handleMessagesBack = () => {
    console.log('Index: handleMessagesBack called, setting showMessages to false');
    setShowMessages(false);
    console.log('Index: showMessages state should now be false');
  };

  // Check if splash should be shown
  const shouldShowSplash = checkShouldShowSplash();

  // Show navigation unless we're in a modal/overlay view
  const shouldShowNavigation = !showProfile && !showWatchlist && !showSettings && !showMessages;

  if (shouldShowSplash && showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  console.log('Index: Current state:', { 
    activeTab, 
    showMessages, 
    shouldShowNavigation,
    showProfile,
    showWatchlist,
    showSettings
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* User Profile Dropdown - Fixed Top Right */}
      {shouldShowNavigation && (
        <UserProfileDropdown
          onFavoritesClick={handleFavoritesOpen}
          onProfileClick={handleProfileOpen}
          onWatchlistClick={handleWatchlistOpen}
          onSettingsClick={handleSettingsOpen}
          onMessagesClick={handleMessagesOpen}
          unreadCount={unreadCount}
          hasUnread={hasUnread}
        />
      )}

      {/* Main Content - Takes remaining height, leave space for bottom nav when visible */}
      <div className={`flex-1 min-h-0 ${shouldShowNavigation ? 'pb-16' : ''}`}>
        <ActiveViewRenderer
          activeTab={activeTab}
          showProfile={showProfile}
          showWatchlist={showWatchlist}
          showSettings={showSettings}
          showMessages={showMessages}
          initialVibe={initialVibe}
          onProfileBack={() => setShowProfile(false)}
          onWatchlistBack={() => setShowWatchlist(false)}
          onSettingsBack={() => setShowSettings(false)}
          onMessagesBack={handleMessagesBack}
        />
      </div>

      {/* Bottom Navigation - Fixed height at bottom */}
      {shouldShowNavigation && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation
            activeTab={activeTab}
            invitationCount={invitationCount}
            onTabChange={setActiveTab}
            onPlannerOpen={handlePlannerOpen}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
