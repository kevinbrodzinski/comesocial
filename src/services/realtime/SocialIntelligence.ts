import { errorHandler } from '../intelligence/ErrorHandler';
import { eventTracker } from '../intelligence/EventTracker';
import { eventStreamManager } from './EventStreamManager';

export interface FriendActivity {
  friendId: string;
  friendName: string;
  activityType: 'check_in' | 'plan_created' | 'venue_visit' | 'status_update' | 'location_share';
  venueId?: number;
  venueName?: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  metadata: Record<string, any>;
  relevanceScore: number;
}

export interface ProximityAlert {
  friendId: string;
  friendName: string;
  distance: number; // in meters
  venue?: {
    id: number;
    name: string;
  };
  alertType: 'friend_nearby' | 'friend_at_venue' | 'friend_heading_to_venue';
  timestamp: Date;
  isUrgent: boolean;
}

export interface SocialTrend {
  trendId: string;
  type: 'venue_popularity' | 'group_movement' | 'event_buzz' | 'friend_pattern';
  venueId?: number;
  description: string;
  participants: string[]; // friend IDs
  strength: number; // 0-1
  momentum: 'rising' | 'stable' | 'declining';
  timestamp: Date;
  predictedDuration: number; // minutes
}

export interface GroupMovement {
  groupId: string;
  participants: string[];
  fromVenue?: number;
  toVenue?: number;
  movementType: 'planned' | 'spontaneous' | 'following_trend';
  estimatedArrival?: Date;
  groupSize: number;
  confidence: number;
}

export class SocialIntelligence {
  private friendActivities: Map<string, FriendActivity[]> = new Map();
  private proximityAlerts: ProximityAlert[] = [];
  private socialTrends: Map<string, SocialTrend> = new Map();
  private groupMovements: Map<string, GroupMovement> = new Map();
  private updateInterval: number = 15000; // 15 seconds
  private isActive: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSampleData();
    this.setupEventListeners();
  }

  // Start social intelligence tracking
  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🧠 Starting Social Intelligence');
    
    // Start periodic updates
    this.intervalId = setInterval(() => {
      this.updateSocialIntelligence();
    }, this.updateInterval);
  }

  // Stop social intelligence tracking
  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('🛑 Stopped Social Intelligence');
  }

  // Track friend activity
  trackFriendActivity(activity: Omit<FriendActivity, 'timestamp' | 'relevanceScore'>): void {
    try {
      const enhancedActivity: FriendActivity = {
        ...activity,
        timestamp: new Date(),
        relevanceScore: this.calculateRelevanceScore(activity)
      };

      // Add to friend's activity history
      const activities = this.friendActivities.get(activity.friendId) || [];
      activities.unshift(enhancedActivity);
      
      // Keep only recent activities (last 24 hours)
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentActivities = activities.filter(a => a.timestamp > cutoff).slice(0, 50);
      this.friendActivities.set(activity.friendId, recentActivities);

      // Emit friend activity event
      eventStreamManager.emitFriendActivity(activity.friendId, enhancedActivity, 'high');

      // Track the activity
      eventTracker.trackFriendResponse(
        activity.friendId,
        activity.activityType,
        {
          venueId: activity.venueId,
          venueName: activity.venueName,
          relevanceScore: enhancedActivity.relevanceScore
        }
      );

      // Check for proximity alerts
      this.checkProximityAlerts(enhancedActivity);

      // Update social trends
      this.updateSocialTrends(enhancedActivity);

      console.log(`👥 Friend activity tracked: ${activity.friendName} - ${activity.activityType}`);
      
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to track friend activity',
        {
          component: 'SocialIntelligence',
          operation: 'trackFriendActivity',
          data: { activity, error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Get friend activities
  getFriendActivities(friendId?: string, limit: number = 20): FriendActivity[] {
    if (friendId) {
      return this.friendActivities.get(friendId)?.slice(0, limit) || [];
    }

    // Get all activities sorted by timestamp
    const allActivities: FriendActivity[] = [];
    this.friendActivities.forEach(activities => {
      allActivities.push(...activities);
    });

    return allActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get proximity alerts
  getProximityAlerts(activeOnly: boolean = true): ProximityAlert[] {
    if (!activeOnly) return this.proximityAlerts;

    // Return alerts from last 30 minutes
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    return this.proximityAlerts.filter(alert => alert.timestamp > cutoff);
  }

  // Get social trends
  getSocialTrends(type?: SocialTrend['type']): SocialTrend[] {
    const trends = Array.from(this.socialTrends.values());
    
    if (type) {
      return trends.filter(trend => trend.type === type);
    }
    
    return trends.sort((a, b) => b.strength - a.strength);
  }

  // Get group movements
  getGroupMovements(): GroupMovement[] {
    return Array.from(this.groupMovements.values())
      .sort((a, b) => b.confidence - a.confidence);
  }

  // Get friends at venue
  getFriendsAtVenue(venueId: number): FriendActivity[] {
    const activities: FriendActivity[] = [];
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000); // Last 2 hours

    this.friendActivities.forEach(friendActivities => {
      const recentActivity = friendActivities.find(activity => 
        activity.venueId === venueId && 
        activity.timestamp > cutoff &&
        (activity.activityType === 'check_in' || activity.activityType === 'venue_visit')
      );
      
      if (recentActivity) {
        activities.push(recentActivity);
      }
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Calculate activity relevance score
  private calculateRelevanceScore(activity: Omit<FriendActivity, 'timestamp' | 'relevanceScore'>): number {
    let score = 0.5; // Base score

    // Activity type weights
    const typeWeights = {
      'check_in': 0.8,
      'venue_visit': 0.7,
      'plan_created': 0.6,
      'location_share': 0.9,
      'status_update': 0.3
    };
    
    score += typeWeights[activity.activityType] || 0.5;

    // Venue relevance (if user has visited this venue)
    if (activity.venueId) {
      const userVenueHistory = eventTracker.getEventsByType('venue_interaction', 50);
      const hasVisited = userVenueHistory.some(event => event.data.venueId === activity.venueId);
      if (hasVisited) score += 0.3;
    }

    // Recency bonus
    const recencyBonus = 0.2; // Always recent since we're just tracking it
    score += recencyBonus;

    // Location proximity bonus (simulated)
    if (activity.location) {
      score += 0.2; // Bonus for location data
    }

    return Math.min(1.0, score);
  }

  // Check for proximity alerts
  private checkProximityAlerts(activity: FriendActivity): void {
    if (!activity.location) return;

    // Simulate proximity detection (in production, this would use actual user location)
    const userLocation = { lat: 40.7128, lng: -74.0060 }; // Sample NYC location
    const distance = this.calculateDistance(
      userLocation.lat, userLocation.lng,
      activity.location.lat, activity.location.lng
    );

    if (distance < 500) { // Within 500 meters
      const alert: ProximityAlert = {
        friendId: activity.friendId,
        friendName: activity.friendName,
        distance,
        venue: activity.venueId ? {
          id: activity.venueId,
          name: activity.venueName || 'Unknown Venue'
        } : undefined,
        alertType: activity.venueId ? 'friend_at_venue' : 'friend_nearby',
        timestamp: new Date(),
        isUrgent: distance < 100 // Very close
      };

      this.proximityAlerts.unshift(alert);
      
      // Keep only recent alerts
      this.proximityAlerts = this.proximityAlerts.slice(0, 20);

      // Emit proximity alert
      eventStreamManager.emitSocialIntelligence(
        { type: 'proximity_alert', alert },
        alert.isUrgent ? 'urgent' : 'high'
      );

      console.log(`📍 Proximity alert: ${activity.friendName} is ${Math.round(distance)}m away`);
    }
  }

  // Update social trends
  private updateSocialTrends(activity: FriendActivity): void {
    if (!activity.venueId) return;

    const trendId = `venue_${activity.venueId}_popularity`;
    const existingTrend = this.socialTrends.get(trendId);

    if (existingTrend) {
      // Update existing trend
      if (!existingTrend.participants.includes(activity.friendId)) {
        existingTrend.participants.push(activity.friendId);
        existingTrend.strength = Math.min(1.0, existingTrend.strength + 0.1);
        existingTrend.momentum = 'rising';
        existingTrend.timestamp = new Date();
      }
    } else {
      // Create new trend
      const trend: SocialTrend = {
        trendId,
        type: 'venue_popularity',
        venueId: activity.venueId,
        description: `${activity.venueName || 'Venue'} is getting popular`,
        participants: [activity.friendId],
        strength: 0.3,
        momentum: 'rising',
        timestamp: new Date(),
        predictedDuration: 120 // 2 hours
      };

      this.socialTrends.set(trendId, trend);
    }
  }

  // Update social intelligence
  private updateSocialIntelligence(): void {
    try {
      this.analyzeGroupMovements();
      this.updateTrendMomentum();
      this.cleanupOldData();
      
      console.log('🧠 Social intelligence updated');
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to update social intelligence',
        {
          component: 'SocialIntelligence',
          operation: 'updateSocialIntelligence',
          data: { error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Analyze group movements
  private analyzeGroupMovements(): void {
    const recentActivities = this.getFriendActivities(undefined, 100);
    const venueGroups: Map<number, FriendActivity[]> = new Map();

    // Group activities by venue and time
    recentActivities.forEach(activity => {
      if (activity.venueId) {
        const activities = venueGroups.get(activity.venueId) || [];
        activities.push(activity);
        venueGroups.set(activity.venueId, activities);
      }
    });

    // Detect group movements
    venueGroups.forEach((activities, venueId) => {
      if (activities.length >= 2) {
        const groupId = `group_${venueId}_${Date.now()}`;
        const movement: GroupMovement = {
          groupId,
          participants: activities.map(a => a.friendId),
          toVenue: venueId,
          movementType: 'spontaneous',
          groupSize: activities.length,
          confidence: Math.min(0.9, activities.length * 0.2),
          estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        };

        this.groupMovements.set(groupId, movement);

        // Emit group movement event
        eventStreamManager.emitSocialIntelligence(
          { type: 'group_movement', movement },
          'medium'
        );
      }
    });
  }

  // Update trend momentum
  private updateTrendMomentum(): void {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

    this.socialTrends.forEach(trend => {
      const timeSinceUpdate = Date.now() - trend.timestamp.getTime();
      
      if (timeSinceUpdate > 30 * 60 * 1000) { // 30 minutes without update
        if (trend.momentum === 'rising') {
          trend.momentum = 'stable';
        } else if (trend.momentum === 'stable') {
          trend.momentum = 'declining';
          trend.strength = Math.max(0.1, trend.strength - 0.1);
        }
      }
    });
  }

  // Clean up old data
  private cleanupOldData(): void {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

    // Clean old proximity alerts
    this.proximityAlerts = this.proximityAlerts.filter(alert => alert.timestamp > cutoff);

    // Clean old trends
    for (const [trendId, trend] of this.socialTrends.entries()) {
      if (trend.timestamp < cutoff || trend.strength < 0.1) {
        this.socialTrends.delete(trendId);
      }
    }

    // Clean old group movements
    for (const [groupId, movement] of this.groupMovements.entries()) {
      if (movement.estimatedArrival && movement.estimatedArrival < new Date()) {
        this.groupMovements.delete(groupId);
      }
    }
  }

  // Calculate distance between two coordinates
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen for venue interactions
    eventStreamManager.subscribe(
      ['venue_update'],
      (event) => {
        if (event.data.venueId && event.data.friendActivity) {
          this.trackFriendActivity(event.data.friendActivity);
        }
      }
    );
  }

  // Initialize sample data
  private initializeSampleData(): void {
    // Add some sample friend activities
    const sampleActivities: Omit<FriendActivity, 'timestamp' | 'relevanceScore'>[] = [
      {
        friendId: 'friend_1',
        friendName: 'Alex Martinez',
        activityType: 'check_in',
        venueId: 1,
        venueName: 'Sky Lounge',
        location: { lat: 40.7589, lng: -73.9851 },
        metadata: { mood: 'excited', groupSize: 3 }
      },
      {
        friendId: 'friend_2',
        friendName: 'Sarah Chen',
        activityType: 'venue_visit',
        venueId: 2,
        venueName: 'Underground Club',
        location: { lat: 40.7505, lng: -73.9934 },
        metadata: { rating: 4.5, duration: 120 }
      }
    ];

    sampleActivities.forEach(activity => {
      this.trackFriendActivity(activity);
    });
  }

  // Get social intelligence statistics
  getStatistics() {
    return {
      totalFriends: this.friendActivities.size,
      totalActivities: Array.from(this.friendActivities.values()).reduce((sum, activities) => sum + activities.length, 0),
      activeProximityAlerts: this.getProximityAlerts(true).length,
      activeTrends: this.socialTrends.size,
      groupMovements: this.groupMovements.size,
      lastUpdate: new Date()
    };
  }
}

export const socialIntelligence = new SocialIntelligence();
