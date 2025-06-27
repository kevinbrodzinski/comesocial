
import { useState, useCallback, useEffect } from 'react';
import { LocalMemoryStore } from '../services/nova/localMemoryStore';
import { MemoryUtils, UserPreferences } from '../services/nova/memoryUtils';

interface NovaMemoryHook {
  preferences: UserPreferences;
  recordSearch: (query: string, intents: string[]) => void;
  recordVenueInteraction: (venueType: string, context: string) => void;
  generatePersonalizedPrompts: () => string[];
  clearMemory: () => void;
  hasMemoryData: boolean;
}

export const useNovaMemory = (): NovaMemoryHook => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    MemoryUtils.inferPreferencesFromHistory()
  );
  const [hasMemoryData, setHasMemoryData] = useState(false);

  // Check if we have meaningful memory data
  useEffect(() => {
    const memory = LocalMemoryStore.getMemory();
    const hasData = 
      memory.behaviorPatterns.searchHistory.length > 0 ||
      memory.behaviorPatterns.venueInteractions.length > 0 ||
      memory.venuePreferences.types.length > 0;
    
    setHasMemoryData(hasData);
  }, []);

  const recordSearch = useCallback((query: string, intents: string[]) => {
    MemoryUtils.recordSearch(query, intents);
    
    // Update preferences based on new data
    const updatedPreferences = MemoryUtils.inferPreferencesFromHistory();
    setPreferences(updatedPreferences);
    setHasMemoryData(true);
  }, []);

  const recordVenueInteraction = useCallback((venueType: string, context: string) => {
    MemoryUtils.recordVenueInteraction(venueType, context);
    
    // Update preferences based on new data
    const updatedPreferences = MemoryUtils.inferPreferencesFromHistory();
    setPreferences(updatedPreferences);
    setHasMemoryData(true);
  }, []);

  const generatePersonalizedPrompts = useCallback(() => {
    return MemoryUtils.generatePersonalizedPrompts(preferences);
  }, [preferences]);

  const clearMemory = useCallback(() => {
    LocalMemoryStore.clearMemory();
    setPreferences(MemoryUtils.inferPreferencesFromHistory());
    setHasMemoryData(false);
  }, []);

  return {
    preferences,
    recordSearch,
    recordVenueInteraction,
    generatePersonalizedPrompts,
    clearMemory,
    hasMemoryData,
  };
};
