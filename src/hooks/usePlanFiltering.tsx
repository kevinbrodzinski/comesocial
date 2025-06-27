import { useMemo } from 'react';
import { Plan } from '@/data/plansData';
import { PlannerDraft } from '@/types/coPlanTypes';

export const usePlanFiltering = (
  plans: Plan[],
  friendsPlans: Plan[],
  drafts: PlannerDraft[],
  searchQuery: string,
  activeFilters: string[]
) => {
  const filteredResults = useMemo(() => {
    const processedSearchQuery = searchQuery.toLowerCase().trim();
    
    // Filter plans
    const filteredPlans = plans.filter(plan => {
      // Apply search query with shortcuts
      if (processedSearchQuery) {
        // Handle search shortcuts
        if (processedSearchQuery.startsWith('@')) {
          const shortcut = processedSearchQuery.slice(1);
          switch (shortcut) {
            case 'tonight': {
              return plan.date === 'Tonight' || plan.date === new Date().toISOString().split('T')[0];
            }
            case 'weekend': {
              const today = new Date();
              const dayOfWeek = today.getDay();
              return dayOfWeek === 6 || dayOfWeek === 0; // Saturday or Sunday
            }
            case 'mine':
              return true; // All plans in this array are user's plans
            case 'friends':
              return false; // These are not friends' plans
            case 'drafts':
              return false; // These are not drafts
            case 'active':
              return plan.status === 'active';
            default:
              break;
          }
        }
        
        // Regular search across multiple fields
        const searchFields = [
          plan.name,
          plan.description || '',
          ...plan.stops.map(stop => stop.name),
        ].map(field => field.toLowerCase());
        
        const fuzzyMatch = (text: string, query: string): boolean => {
          if (text.includes(query)) return true;
          
          // Simple fuzzy matching for typos
          const words = text.split(' ');
          return words.some(word => {
            if (word.length < 3) return word.includes(query);
            
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
            case 'my-plans':
              break; // All plans in this array are user's plans
            case 'friends-plans':
              return false; // These are not friends' plans
            case 'tonight': {
              if (plan.date !== 'Tonight' && plan.date !== new Date().toISOString().split('T')[0]) return false;
              break;
            }
            case 'this-weekend': {
              const today = new Date();
              const dayOfWeek = today.getDay();
              if (dayOfWeek !== 6 && dayOfWeek !== 0) return false;
              break;
            }
            case 'drafts':
              return false; // These are not drafts
            case 'active-status':
              if (plan.status !== 'active') return false;
              break;
            case 'planned':
              if (plan.status !== 'planned') return false;
              break;
            case 'in-progress':
              if (plan.status !== 'active') return false; // active means in progress
              break;
            case 'completed':
              if (plan.status !== 'completed') return false;
              break;
            case 'nightlife':
            case 'dining':
            case 'activities':
            case 'custom':
              // These would need additional metadata on plans to filter properly
              // For now, we'll skip these filters
              break;
          }
        }
      }

      return true;
    });

    // Filter friends' plans
    const filteredFriendsPlans = friendsPlans.filter(plan => {
      // Apply search query with shortcuts
      if (processedSearchQuery) {
        // Handle search shortcuts
        if (processedSearchQuery.startsWith('@')) {
          const shortcut = processedSearchQuery.slice(1);
          switch (shortcut) {
            case 'tonight': {
              return plan.date === 'Tonight' || plan.date === new Date().toISOString().split('T')[0];
            }
            case 'weekend': {
              const today = new Date();
              const dayOfWeek = today.getDay();
              return dayOfWeek === 6 || dayOfWeek === 0; // Saturday or Sunday
            }
            case 'mine':
              return false; // These are not user's plans
            case 'friends':
              return true; // All plans in this array are friends' plans
            case 'drafts':
              return false; // These are not drafts
            case 'active':
              return plan.status === 'active';
            default:
              break;
          }
        }
        
        // Regular search across multiple fields
        const searchFields = [
          plan.name,
          plan.description || '',
          ...plan.stops.map(stop => stop.name),
          plan.organizer || ''
        ].map(field => field.toLowerCase());
        
        const fuzzyMatch = (text: string, query: string): boolean => {
          if (text.includes(query)) return true;
          
          // Simple fuzzy matching for typos
          const words = text.split(' ');
          return words.some(word => {
            if (word.length < 3) return word.includes(query);
            
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
            case 'my-plans':
              return false; // These are not user's plans
            case 'friends-plans':
              break; // All plans in this array are friends' plans
            case 'tonight': {
              if (plan.date !== 'Tonight' && plan.date !== new Date().toISOString().split('T')[0]) return false;
              break;
            }
            case 'this-weekend': {
              const today = new Date();
              const dayOfWeek = today.getDay();
              if (dayOfWeek !== 6 && dayOfWeek !== 0) return false;
              break;
            }
            case 'drafts':
              return false; // These are not drafts
            case 'active-status':
              if (plan.status !== 'active') return false;
              break;
            case 'planned':
              if (plan.status !== 'planned') return false;
              break;
            case 'in-progress':
              if (plan.status !== 'active') return false; // active means in progress
              break;
            case 'completed':
              if (plan.status !== 'completed') return false;
              break;
            case 'nightlife':
            case 'dining':
            case 'activities':
            case 'custom':
              // These would need additional metadata on plans to filter properly
              // For now, we'll skip these filters
              break;
          }
        }
      }

      return true;
    });

    // Filter drafts
    const filteredDrafts = drafts.filter(draft => {
      // Apply search query with shortcuts
      if (processedSearchQuery) {
        // Handle search shortcuts
        if (processedSearchQuery.startsWith('@')) {
          const shortcut = processedSearchQuery.slice(1);
          switch (shortcut) {
            case 'tonight': {
              return draft.date === 'Tonight' || draft.date === new Date().toISOString().split('T')[0];
            }
            case 'weekend': {
              const today = new Date();
              const dayOfWeek = today.getDay();
              return dayOfWeek === 6 || dayOfWeek === 0; // Saturday or Sunday
            }
            case 'mine':
              return true; // All drafts are user's drafts
            case 'friends':
              return false; // These are not friends' plans
            case 'drafts':
              return true; // All items in this array are drafts
            case 'active':
              return draft.status === 'active';
            default:
              break;
          }
        }
        
        // Regular search across multiple fields
        const searchFields = [
          draft.title || 'Untitled Draft',
          draft.description || '',
          // Search in participants if available
          ...draft.participants.map(p => p.name || '')
        ].map(field => field.toLowerCase());
        
        const fuzzyMatch = (text: string, query: string): boolean => {
          if (text.includes(query)) return true;
          
          // Simple fuzzy matching for typos
          const words = text.split(' ');
          return words.some(word => {
            if (word.length < 3) return word.includes(query);
            
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
            case 'my-plans':
              break; // All drafts are user's drafts
            case 'friends-plans':
              return false; // These are not friends' plans
            case 'tonight': {
              if (draft.date !== 'Tonight' && draft.date !== new Date().toISOString().split('T')[0]) return false;
              break;
            }
            case 'this-weekend': {
              const today = new Date();
              const dayOfWeek = today.getDay();
              if (dayOfWeek !== 6 && dayOfWeek !== 0) return false;
              break;
            }
            case 'drafts':
              break; // All items in this array are drafts
            case 'active-status':
              if (draft.status !== 'active') return false;
              break;
            case 'planned':
              if (draft.status !== 'active') return false; // drafts don't have 'planned' status
              break;
            case 'in-progress':
              if (draft.status !== 'active') return false;
              break;
            case 'completed':
              if (draft.status !== 'completed') return false;
              break;
            case 'nightlife':
            case 'dining':
            case 'activities':
            case 'custom':
              // These would need additional metadata on drafts to filter properly
              // For now, we'll skip these filters
              break;
          }
        }
      }

      return true;
    });

    return {
      filteredPlans,
      filteredFriendsPlans,
      filteredDrafts,
      totalResults: filteredPlans.length + filteredFriendsPlans.length + filteredDrafts.length
    };
  }, [plans, friendsPlans, drafts, searchQuery, activeFilters]);

  return filteredResults;
};
