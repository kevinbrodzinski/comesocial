
import { useState } from 'react';
import { useFeedData } from '../../hooks/useFeedData';
import { useLiveActivityData } from '../../hooks/useLiveActivityData';
import { useSocialIntelligence } from '../../hooks/useSocialIntelligence';
import { useNotificationSystem } from '../../hooks/useNotificationSystem';
import { useFeedSearch } from '../../hooks/useFeedSearch';

export const useFeedState = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVenueDetailOpen, setIsVenueDetailOpen] = useState(false);
  const [isBlastsFilterOpen, setIsBlastsFilterOpen] = useState(false);

  // Blast filter state
  const [blastsFilters, setBlastsFilters] = useState({
    activityTypes: [] as string[],
    timeFrames: [] as string[],
    groupSizes: [] as string[],
    locationPreferences: [] as string[]
  });

  const feedData = useFeedData();
  const liveActivityData = useLiveActivityData();
  const socialIntelligence = useSocialIntelligence();
  const notificationSystem = useNotificationSystem();

  // Search and filtering functionality
  const searchState = useFeedSearch(feedData.feedPosts);

  // Enhanced blast data with RSVP tracking
  const [blasts, setBlasts] = useState([
    {
      id: 1,
      friend: 'Sarah',
      friendAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      message: "Who's down for rooftop drinks at Sky Lounge around 9pm?",
      timePosted: '5 min ago',
      location: 'Sky Lounge',
      responses: ['Alex', 'Mike'],
      type: 'going-out' as const,
      timeSlot: 'Tonight at 9pm',
      inviteType: 'friends-only' as const,
      rsvpList: ['Alex', 'Mike'],
      maybeList: [],
      activityType: 'drinks',
      timeFrame: 'tonight',
      groupSize: 'small',
      locationPreference: 'rooftop'
    },
    {
      id: 2,
      friend: 'Jake',
      friendAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      message: "Rally at Underground Club in 30 mins - who's in?",
      timePosted: '2 min ago',
      location: 'Underground Club',
      responses: ['Emma', 'Chris', 'Taylor'],
      type: 'rally' as const,
      timeSlot: 'In 30 mins',
      inviteType: 'open' as const,
      rsvpList: ['Emma', 'Chris', 'Taylor'],
      maybeList: [],
      activityType: 'clubbing',
      timeFrame: 'right-now',
      groupSize: 'medium',
      locationPreference: 'downtown'
    }
  ]);

  // Filter blasts based on active filters
  const getFilteredBlasts = () => {
    const { activityTypes, timeFrames, groupSizes, locationPreferences } = blastsFilters;
    
    if (activityTypes.length === 0 && timeFrames.length === 0 && 
        groupSizes.length === 0 && locationPreferences.length === 0) {
      return blasts;
    }

    return blasts.filter(blast => {
      const matchesActivity = activityTypes.length === 0 || activityTypes.includes(blast.activityType);
      const matchesTime = timeFrames.length === 0 || timeFrames.includes(blast.timeFrame);
      const matchesGroupSize = groupSizes.length === 0 || groupSizes.includes(blast.groupSize);
      const matchesLocation = locationPreferences.length === 0 || locationPreferences.includes(blast.locationPreference);
      
      return matchesActivity && matchesTime && matchesGroupSize && matchesLocation;
    });
  };

  const handleBlastsFilterToggle = (category: string, value: string) => {
    setBlastsFilters(prev => {
      const currentFilters = prev[category as keyof typeof prev] || [];
      const isActive = currentFilters.includes(value);
      
      return {
        ...prev,
        [category]: isActive 
          ? currentFilters.filter(f => f !== value)
          : [...currentFilters, value]
      };
    });
  };

  const clearBlastsFilters = () => {
    setBlastsFilters({
      activityTypes: [],
      timeFrames: [],
      groupSizes: [],
      locationPreferences: []
    });
  };

  const getActiveBlastsFilterCount = () => {
    return Object.values(blastsFilters).reduce((total, filters) => total + filters.length, 0);
  };

  return {
    // Modal states
    isCreatePostOpen,
    setIsCreatePostOpen,
    isFilterOpen,
    setIsFilterOpen,
    selectedPost,
    setSelectedPost,
    isCommentModalOpen,
    setIsCommentModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    isVenueDetailOpen,
    setIsVenueDetailOpen,
    isBlastsFilterOpen,
    setIsBlastsFilterOpen,
    
    // Data states
    blasts,
    setBlasts,
    filteredBlasts: getFilteredBlasts(),
    
    // Blast filter states
    blastsFilters,
    handleBlastsFilterToggle,
    clearBlastsFilters,
    getActiveBlastsFilterCount,
    
    // Hooks
    feedData,
    liveActivityData,
    socialIntelligence,
    notificationSystem,
    
    // Search and filtering
    searchState
  };
};
