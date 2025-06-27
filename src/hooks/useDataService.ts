import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataService from '@/services/data/DataService';
import type { Friend } from '@/data/friendsData';
import type { Plan } from '@/data/plansData';
import type { Venue } from '@/data/venuesData';

const dataService = DataService.getInstance();

// Query keys
export const queryKeys = {
  friends: ['friends'] as const,
  plans: ['plans'] as const,
  venues: ['venues'] as const,
  feedPosts: ['feedPosts'] as const,
  userProfile: ['userProfile'] as const,
};

// Friends hooks
export const useFriends = () => {
  return useQuery({
    queryKey: queryKeys.friends,
    queryFn: () => dataService.getFriends(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFriendsSubscription = (callback: (friends: Friend[]) => void) => {
  const queryClient = useQueryClient();
  
  return dataService.subscribeToFriends((friends) => {
    queryClient.setQueryData(queryKeys.friends, friends);
    callback(friends);
  });
};

// Plans hooks
export const usePlans = () => {
  return useQuery({
    queryKey: queryKeys.plans,
    queryFn: () => dataService.getPlans(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePlansSubscription = (callback: (plans: Plan[]) => void) => {
  const queryClient = useQueryClient();
  
  return dataService.subscribeToPlans((plans) => {
    queryClient.setQueryData(queryKeys.plans, plans);
    callback(plans);
  });
};

// Venues hooks
export const useVenues = () => {
  return useQuery({
    queryKey: queryKeys.venues,
    queryFn: () => dataService.getVenues(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Feed posts hooks
export const useFeedPosts = () => {
  return useQuery({
    queryKey: queryKeys.feedPosts,
    queryFn: () => dataService.getFeedPosts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useUpdateFriendActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Friend>) => {
      // In real implementation, this would update Supabase
      // For now, just invalidate the cache
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends });
    },
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: Partial<Plan>) => {
      // In real implementation, this would create in Supabase
      // For now, just invalidate the cache
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Plan> }) => {
      // In real implementation, this would update in Supabase
      // For now, just invalidate the cache
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
    },
  });
};

// Configuration hook
export const useDataServiceConfig = () => {
  const config = dataService.getConfig();
  
  const updateConfig = (newConfig: Partial<typeof config>) => {
    dataService.setConfig(newConfig);
    // Force refetch all queries when switching data sources
    window.location.reload();
  };
  
  return {
    config,
    updateConfig,
  };
};

// Utility hook for switching between mock and real data
export const useDataSourceToggle = () => {
  const { config, updateConfig } = useDataServiceConfig();
  
  const toggleDataSource = () => {
    updateConfig({
      useMockData: !config.useMockData,
      enableRealTime: !config.useMockData, // Enable real-time when using real data
    });
  };
  
  return {
    isUsingMockData: config.useMockData,
    toggleDataSource,
  };
}; 