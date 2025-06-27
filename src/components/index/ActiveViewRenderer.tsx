
import React from 'react';
import NovaChat from '../NovaChat';
import MapView from '../MapView';
import FeedView from '../FeedView';
import PlannerView from '../PlannerView';
import FriendsView from '../FriendsView';
import FavoritesView from '../FavoritesView';
import EnhancedUserProfile from '../../pages/EnhancedUserProfile';
import WatchlistView from '../../pages/WatchlistView';
import MessagesView from '../../pages/MessagesView';
import SettingsPanel from '../SettingsPanel';

interface ActiveViewRendererProps {
  activeTab: string;
  showProfile: boolean;
  showWatchlist: boolean;
  showSettings: boolean;
  showMessages: boolean;
  initialVibe: string;
  onProfileBack: () => void;
  onWatchlistBack: () => void;
  onSettingsBack: () => void;
  onMessagesBack: () => void;
}

const ActiveViewRenderer = ({
  activeTab,
  showProfile,
  showWatchlist,
  showSettings,
  showMessages,
  initialVibe,
  onProfileBack,
  onWatchlistBack,
  onSettingsBack,
  onMessagesBack
}: ActiveViewRendererProps) => {
  if (showProfile) {
    return <EnhancedUserProfile onBack={onProfileBack} />;
  }

  if (showWatchlist) {
    return <WatchlistView onBack={onWatchlistBack} />;
  }

  if (showSettings) {
    return <SettingsPanel onBack={onSettingsBack} />;
  }

  if (showMessages) {
    return <MessagesView onBack={onMessagesBack} />;
  }

  switch (activeTab) {
    case 'home':
      return <NovaChat initialMessage={initialVibe} />;
    case 'map':
      return <MapView />;
    case 'feed':
      return <FeedView />;
    case 'planner':
      return <PlannerView />;
    case 'friends':
      return <FriendsView />;
    case 'favorites':
      return <FavoritesView />;
    default:
      return <NovaChat initialMessage={initialVibe} />;
  }
};

export default ActiveViewRenderer;
