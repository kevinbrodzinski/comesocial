
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Navigation state
  activeTab: string;
  initialVibe: string;
  
  // Modal states
  showProfile: boolean;
  showWatchlist: boolean;
  showSettings: boolean;
  showMessages: boolean;
  showSplash: boolean;
  userMenuOpen: boolean;
  
  // Splash screen state
  lastSplashDate: string | null;
}

interface AppActions {
  // Navigation actions
  setActiveTab: (tab: string) => void;
  setInitialVibe: (vibe: string) => void;
  
  // Modal actions
  setShowProfile: (show: boolean) => void;
  setShowWatchlist: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowMessages: (show: boolean) => void;
  setShowSplash: (show: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
  
  // Utility actions
  checkShouldShowSplash: () => boolean;
  markSplashShown: () => void;
  closeAllModals: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // State
      activeTab: 'home',
      initialVibe: '',
      showProfile: false,
      showWatchlist: false,
      showSettings: false,
      showMessages: false,
      showSplash: false,
      userMenuOpen: false,
      lastSplashDate: null,

      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setInitialVibe: (vibe) => set({ initialVibe: vibe }),
      setShowProfile: (show) => set({ showProfile: show }),
      setShowWatchlist: (show) => set({ showWatchlist: show }),
      setShowSettings: (show) => set({ showSettings: show }),
      setShowMessages: (show) => set({ showMessages: show }),
      setShowSplash: (show) => set({ showSplash: show }),
      setUserMenuOpen: (open) => set({ userMenuOpen: open }),

      checkShouldShowSplash: () => {
        const today = new Date().toDateString();
        const { lastSplashDate } = get();
        return lastSplashDate !== today;
      },

      markSplashShown: () => {
        const today = new Date().toDateString();
        set({ lastSplashDate: today });
      },

      closeAllModals: () => set({
        showProfile: false,
        showWatchlist: false,
        showSettings: false,
        showMessages: false,
        userMenuOpen: false
      })
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        activeTab: state.activeTab,
        lastSplashDate: state.lastSplashDate
      })
    }
  )
);
