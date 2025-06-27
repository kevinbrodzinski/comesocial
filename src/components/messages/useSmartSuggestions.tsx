
import { useState, useCallback } from 'react';
import { SmartSuggestion, SmartSuggestionGroups } from '@/types/smartLinking';
import { useVenueSuggestions } from './useVenueSuggestions';
import { useFriendsData } from '@/hooks/useFriendsData';
import { usePlansData } from '@/hooks/usePlansData';

interface UseSmartSuggestionsProps {
  contextType?: 'general' | 'group-chat' | 'plan-thread' | 'direct-message';
  contextId?: string | number;
  participantIds?: number[];
}

export const useSmartSuggestions = ({
  contextType = 'general',
  contextId,
  participantIds = []
}: UseSmartSuggestionsProps = {}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestionGroups>({
    venues: [],
    friends: [],
    plans: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const { getSuggestions: getVenueSuggestions } = useVenueSuggestions();
  const { friends } = useFriendsData();
  const { plans } = usePlansData();

  const getContextualFriends = useCallback((query: string): SmartSuggestion[] => {
    let filteredFriends = friends;

    // Apply context-based filtering
    switch (contextType) {
      case 'group-chat':
      case 'plan-thread':
        if (participantIds.length > 0) {
          filteredFriends = friends.filter(friend => participantIds.includes(friend.id));
        }
        break;
      case 'direct-message':
        // For DMs, could show mutual friends or recent contacts
        filteredFriends = friends.filter(friend => friend.frequentPlanMate);
        break;
      case 'general':
      default:
        // Show all friends
        break;
    }

    return filteredFriends
      .filter(friend => 
        friend.name.toLowerCase().includes(query.toLowerCase()) ||
        friend.activity.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map(friend => ({
        id: friend.id,
        name: friend.name,
        type: 'friend' as const,
        subtitle: friend.status === 'active' ? friend.location || friend.activity : 'Offline',
        metadata: {
          avatar: friend.avatar,
          status: friend.status,
          location: friend.location
        }
      }));
  }, [friends, contextType, participantIds]);

  const getActivePlans = useCallback((query: string): SmartSuggestion[] => {
    return plans
      .filter(plan => 
        (plan.status === 'active' || plan.status === 'planned') &&
        plan.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map(plan => ({
        id: plan.id,
        name: plan.name,
        type: 'plan' as const,
        subtitle: `${plan.date} • ${plan.attendees} people`,
        metadata: {
          status: plan.status,
          date: plan.date,
          attendees: plan.attendees
        }
      }));
  }, [plans]);

  const searchSmartSuggestions = useCallback(async (query: string, category?: 'venues' | 'friends' | 'plans') => {
    if (!query || query.length < 1) {
      setSuggestions({ venues: [], friends: [], plans: [] });
      return;
    }

    setIsLoading(true);
    try {
      const results: SmartSuggestionGroups = {
        venues: [],
        friends: [],
        plans: []
      };

      // Get venue suggestions
      if (!category || category === 'venues') {
        await getVenueSuggestions(query);
        // We'll need to transform venue suggestions to SmartSuggestion format
        // For now, we'll use mock data that matches the existing venue structure
        results.venues = []; // Will be populated by venue search
      }

      // Get friend suggestions
      if (!category || category === 'friends') {
        results.friends = getContextualFriends(query);
      }

      // Get plan suggestions
      if (!category || category === 'plans') {
        results.plans = getActivePlans(query);
      }

      setSuggestions(results);
    } catch (error) {
      console.error('Smart suggestions error:', error);
      setSuggestions({ venues: [], friends: [], plans: [] });
    } finally {
      setIsLoading(false);
    }
  }, [getVenueSuggestions, getContextualFriends, getActivePlans]);

  const clearSuggestions = useCallback(() => {
    setSuggestions({ venues: [], friends: [], plans: [] });
  }, []);

  return {
    suggestions,
    isLoading,
    searchSmartSuggestions,
    clearSuggestions
  };
};
