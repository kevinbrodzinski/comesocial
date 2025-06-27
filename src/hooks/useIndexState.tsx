
import { useAppStore } from '@/stores/useAppStore';

export const useIndexState = () => {
  const store = useAppStore();
  
  return {
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    userMenuOpen: store.userMenuOpen,
    setUserMenuOpen: store.setUserMenuOpen,
    showProfile: store.showProfile,
    setShowProfile: store.setShowProfile,
    showWatchlist: store.showWatchlist,
    setShowWatchlist: store.setShowWatchlist,
    showSettings: store.showSettings,
    setShowSettings: store.setShowSettings,
    showMessages: store.showMessages,
    setShowMessages: store.setShowMessages,
    showSplash: store.checkShouldShowSplash(),
    setShowSplash: store.setShowSplash,
    initialVibe: store.initialVibe,
    setInitialVibe: store.setInitialVibe,
    markSplashShown: store.markSplashShown
  };
};
