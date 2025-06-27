
import { useMemo } from 'react';
import type { Friend } from '@/data/friendsData';
import { isVibeExpired } from '@/types/vibeTypes';

export const useFriendFiltering = (
  friends: Friend[], 
  activeTab: string, 
  searchQuery: string, 
  activeFilters: string[],
  activeVibeFilters: string[] = []
) => {
  const sortedFriends = useMemo(() => {
    if (!friends || !Array.isArray(friends)) {
      return [];
    }

    const processedSearchQuery = searchQuery.toLowerCase().trim();
    
    return friends.filter(friend => {
      // First apply tab filtering
      let tabMatch = true;
      switch (activeTab) {
        case 'activity':
          tabMatch = friend.status === 'active';
          break;
        case 'nearby':
          tabMatch = friend.isNearby;
          break;
        case 'on-plan':
          tabMatch = friend.isOnPlan;
          break;
        case 'all':
        default:
          tabMatch = true;
      }

      if (!tabMatch) return false;

      // Apply search query with fuzzy matching and shortcuts
      if (processedSearchQuery) {
        // Handle search shortcuts
        if (processedSearchQuery.startsWith('@')) {
          const shortcut = processedSearchQuery.slice(1);
          switch (shortcut) {
            case 'active':
              return friend.status === 'active';
            case 'nearby':
              return friend.isNearby;
            case 'plans':
            case 'on-plan':
              return friend.isOnPlan;
            case 'going-out':
              return friend.currentVibe && !isVibeExpired(friend.currentVibe) && friend.currentVibe.vibe.id === 'going-out';
            case 'hype':
              return friend.currentVibe && !isVibeExpired(friend.currentVibe) && friend.currentVibe.vibe.id === 'hype-night';
            case 'open':
              return friend.currentVibe && !isVibeExpired(friend.currentVibe) && friend.currentVibe.vibe.id === 'open-to-plans';
            case 'chill':
              return friend.currentVibe && !isVibeExpired(friend.currentVibe) && friend.currentVibe.vibe.id === 'chill-mode';
            default:
              // Continue with normal search if shortcut not recognized
              break;
          }
        }
        
        const searchFields = [
          friend.name,
          friend.location || '',
          friend.activity,
          friend.plan || '',
          // Include vibe in search
          friend.currentVibe && !isVibeExpired(friend.currentVibe) ? friend.currentVibe.vibe.label : '',
          friend.currentVibe && !isVibeExpired(friend.currentVibe) && friend.currentVibe.customText ? friend.currentVibe.customText : ''
        ].map(field => field.toLowerCase());
        
        const fuzzyMatch = (text: string, query: string): boolean => {
          // Direct match
          if (text.includes(query)) return true;
          
          // Allow for typos (simple Levenshtein-like matching)
          const words = text.split(' ');
          return words.some(word => {
            if (word.length < 3) return word.includes(query);
            
            // Allow 1 character difference for words 3+ chars
            let differences = 0;
            const minLength = Math.min(word.length, query.length);
            for (let i = 0; i < minLength; i++) {
              if (word[i] !== query[i]) differences++;
              if (differences > 1) return false;
            }
            return differences <= 1;
          });
        };
        
        if (!searchFields.some(field => fuzzyMatch(field, processedSearchQuery))) {
          return false;
        }
      }

      // Apply active filters
      if (activeFilters.length > 0) {
        for (const filter of activeFilters) {
          switch (filter) {
            case 'active':
              if (friend.status !== 'active') return false;
              break;
            case 'nearby':
              if (!friend.isNearby) return false;
              break;
            case 'on-plan':
              if (!friend.isOnPlan) return false;
              break;
            case 'recent':
              if (!['Now', '5 min ago', '15 min ago'].some(time => friend.lastSeen.includes(time))) {
                return false;
              }
              break;
          }
        }
      }

      // Apply vibe filters
      if (activeVibeFilters.length > 0) {
        // If friend has no vibe or expired vibe, filter out
        if (!friend.currentVibe || isVibeExpired(friend.currentVibe)) {
          return false;
        }
        
        // Check if friend's vibe matches any of the selected vibe filters
        if (!activeVibeFilters.includes(friend.currentVibe.vibe.id)) {
          return false;
        }
      }

      return true;
    });
  }, [friends, activeTab, searchQuery, activeFilters, activeVibeFilters]);

  // Filter out friends that are part of groups at venues (for individual friends list)
  const individualFriends = useMemo(() => {
    if (!sortedFriends) return [];
    
    // For activity tab, filter out friends who are grouped at venues
    if (activeTab === 'activity') {
      const venueGroups = new Map();
      
      // Group friends by venue
      sortedFriends.forEach(friend => {
        if (friend.location && friend.currentAction !== 'offline') {
          if (!venueGroups.has(friend.location)) {
            venueGroups.set(friend.location, []);
          }
          venueGroups.get(friend.location).push(friend);
        }
      });
      
      // Return only friends who are alone or at venues with just one person
      return sortedFriends.filter(friend => {
        if (!friend.location || friend.currentAction === 'offline') {
          return true;
        }
        const groupAtVenue = venueGroups.get(friend.location);
        return groupAtVenue && groupAtVenue.length === 1;
      });
    }
    
    return sortedFriends;
  }, [sortedFriends, activeTab]);

  return { sortedFriends, individualFriends };
};
