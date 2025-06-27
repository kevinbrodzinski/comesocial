import { supabase } from '@/integrations/supabase/client';
import { friendsData } from '@/data/friendsData';
import { initialPlans, initialFriendsPlans } from '@/data/plansData';
import { venues } from '@/data/venuesData';
import { feedPosts } from '@/data/feedData';
import type { Friend } from '@/data/friendsData';
import type { Plan } from '@/data/plansData';
import type { Venue } from '@/data/venuesData';

export interface DataServiceConfig {
  useMockData: boolean;
  enableRealTime: boolean;
}

class DataService {
  private static instance: DataService;
  private config: DataServiceConfig = {
    useMockData: true, // Start with mock data
    enableRealTime: false
  };

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  setConfig(config: Partial<DataServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): DataServiceConfig {
    return this.config;
  }

  // Friends Data
  async getFriends(): Promise<Friend[]> {
    if (this.config.useMockData) {
      return Promise.resolve(friendsData);
    }

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:profiles!friendships_friend_id_fkey(
            id,
            full_name,
            username,
            avatar_url
          ),
          activity:friend_activity(*)
        `)
        .eq('status', 'accepted');

      if (error) throw error;

      return data?.map(friendship => ({
        id: parseInt(friendship.friend.id),
        name: friendship.friend.full_name || 'Unknown',
        avatar: friendship.friend.avatar_url || friendship.friend.full_name?.slice(0, 2).toUpperCase() || 'U',
        status: friendship.activity?.current_action === 'offline' ? 'inactive' : 'active',
        location: friendship.activity?.location || null,
        lastSeen: friendship.activity?.time_ago || 'Unknown',
        activity: friendship.activity?.activity || 'Not currently active',
        plan: friendship.activity?.current_plan_name || null,
        planDetails: null, // Would need to join with plans table
        isNearby: friendship.activity?.is_nearby || false,
        isOnPlan: friendship.activity?.is_on_plan || false,
        coordinates: friendship.activity?.coordinates ? {
          lat: friendship.activity.coordinates[0],
          lng: friendship.activity.coordinates[1]
        } : { lat: 40.7128, lng: -74.0060 },
        frequentPlanMate: friendship.activity?.frequent_plan_mate || false,
        currentAction: friendship.activity?.current_action || 'offline',
        distanceFromUser: friendship.activity?.distance_from_user || 0,
        timeAgo: friendship.activity?.time_ago || 'Unknown',
        currentVibe: null // Would need to join with user_vibes table
      })) || [];
    } catch (error) {
      console.error('Error fetching friends:', error);
      return friendsData; // Fallback to mock data
    }
  }

  // Plans Data
  async getPlans(): Promise<Plan[]> {
    if (this.config.useMockData) {
      return Promise.resolve([...initialPlans, ...initialFriendsPlans]);
    }

    try {
      const { data, error } = await supabase
        .from('plans')
        .select(`
          *,
          stops:plan_stops(
            *,
            venue:venues(*)
          ),
          participants:plan_participants(
            *,
            user:profiles(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        date: plan.plan_date,
        time: plan.plan_time,
        stops: plan.stops?.map(stop => ({
          id: stop.id,
          name: stop.venue?.name || stop.venue_name,
          type: stop.venue?.venue_type || 'venue',
          estimatedTime: stop.estimated_time_minutes || 60,
          cost: stop.cost || 0
        })) || [],
        attendees: plan.attendees_count || 0,
        status: plan.status,
        description: plan.description,
        estimatedCost: plan.estimated_cost,
        duration: plan.duration,
        notes: plan.notes,
        organizer: plan.creator_id, // Would need to join with profiles
        hostId: parseInt(plan.creator_id),
        overviewMessage: plan.overview_message,
        shareLink: plan.share_link,
        rsvpResponses: {
          going: plan.rsvp_going || 0,
          maybe: plan.rsvp_maybe || 0,
          cantGo: plan.rsvp_cant_go || 0
        }
      })) || [];
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [...initialPlans, ...initialFriendsPlans]; // Fallback to mock data
    }
  }

  // Venues Data
  async getVenues(): Promise<Venue[]> {
    if (this.config.useMockData) {
      return Promise.resolve(venues);
    }

    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');

      if (error) throw error;

      return data?.map(venue => ({
        id: venue.id,
        name: venue.name,
        type: venue.venue_type,
        image: venue.image,
        distance: venue.distance,
        crowdLevel: venue.crowd_level || 0,
        vibe: venue.vibe,
        rating: venue.rating,
        description: venue.description,
        averageWait: venue.average_wait,
        bestTimes: venue.best_times || [],
        features: venue.features || [],
        lastVisited: venue.last_visited,
        address: venue.address,
        phone: venue.phone,
        hours: venue.hours,
        priceLevel: venue.price_level,
        x: venue.map_x || 0,
        y: venue.map_y || 0
      })) || [];
    } catch (error) {
      console.error('Error fetching venues:', error);
      return venues; // Fallback to mock data
    }
  }

  // Feed Data
  async getFeedPosts() {
    if (this.config.useMockData) {
      return Promise.resolve(feedPosts);
    }

    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          venue:venues(*),
          user:profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return data?.map(post => ({
        id: post.id,
        venue: post.venue?.name || 'Unknown Venue',
        type: post.venue?.venue_type || 'Venue',
        vibe: post.venue?.vibe || 'Unknown',
        image: post.venue?.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
        crowdLevel: post.venue?.crowd_level || 0,
        distance: '0.8 mi', // Would need to calculate
        timePosted: this.formatTimeAgo(post.created_at),
        likes: 0, // Would need to join with interactions
        comments: 0, // Would need to join with interactions
        friend: post.user?.username || 'unknown',
        friendAvatar: post.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        caption: post.content || ''
      })) || [];
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      return feedPosts; // Fallback to mock data
    }
  }

  // Real-time subscriptions
  subscribeToFriends(callback: (friends: Friend[]) => void) {
    if (!this.config.enableRealTime || this.config.useMockData) {
      return () => {}; // No-op unsubscribe
    }

    const subscription = supabase
      .channel('friend_activity')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'friend_activity' },
        async () => {
          const friends = await this.getFriends();
          callback(friends);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  subscribeToPlans(callback: (plans: Plan[]) => void) {
    if (!this.config.enableRealTime || this.config.useMockData) {
      return () => {}; // No-op unsubscribe
    }

    const subscription = supabase
      .channel('plans')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'plans' },
        async () => {
          const plans = await this.getPlans();
          callback(plans);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // Utility methods
  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}

export default DataService; 