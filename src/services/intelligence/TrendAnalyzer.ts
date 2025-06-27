
import { eventTracker } from './EventTracker';
import { contextManager } from './ContextManager';

interface TrendData {
  id: string;
  type: 'venue_popularity' | 'crowd_flow' | 'social_momentum' | 'timing_patterns' | 'friend_activity';
  trend: 'rising' | 'falling' | 'stable' | 'peak' | 'emerging';
  strength: number; // 0-1
  velocity: number; // Rate of change
  confidence: number; // 0-1
  timeframe: 'short' | 'medium' | 'long'; // minutes, hours, days
  data: Record<string, any>;
  timestamp: Date;
}

interface VenueTrend {
  venueId: number;
  venueName: string;
  crowdTrend: 'rising' | 'falling' | 'peak' | 'stable';
  popularityScore: number;
  momentum: number;
  predictedPeakTime?: string;
  socialBuzz: number;
}

interface SocialTrend {
  groupSize: number;
  activityLevel: 'low' | 'medium' | 'high' | 'peak';
  planFormationRate: number;
  responseVelocity: number; // How quickly friends respond
  hotspots: string[]; // Popular areas
}

export class TrendAnalyzer {
  private trends: Map<string, TrendData> = new Map();
  private venueTrends: Map<number, VenueTrend> = new Map();
  private socialTrends: SocialTrend | null = null;
  private readonly trendHistory: TrendData[] = [];
  private readonly maxTrendHistory = 1000;

  // Analyze current trends across all data
  analyzeTrends(): {
    venueTrends: VenueTrend[];
    socialTrends: SocialTrend;
    emergingTrends: TrendData[];
    predictions: any[];
  } {
    console.log('📊 Analyzing trends...');
    
    const venueAnalysis = this.analyzeVenueTrends();
    const socialAnalysis = this.analyzeSocialTrends();
    const timingAnalysis = this.analyzeTimingTrends();
    const emergingAnalysis = this.identifyEmergingTrends();
    
    // Generate predictions based on trends
    const predictions = this.generateTrendPredictions();
    
    return {
      venueTrends: Array.from(this.venueTrends.values()),
      socialTrends: this.socialTrends || this.getDefaultSocialTrends(),
      emergingTrends: emergingAnalysis,
      predictions
    };
  }

  // Analyze venue popularity and crowd trends
  private analyzeVenueTrends(): void {
    const venueEvents = eventTracker.getEventsByType('venue_interaction', 200);
    const recentEvents = eventTracker.getEventsInTimeWindow(6); // Last 6 hours
    
    // Group by venue
    const venueActivity = new Map<number, any[]>();
    venueEvents.forEach(event => {
      const venueId = event.data.venueId;
      if (!venueActivity.has(venueId)) {
        venueActivity.set(venueId, []);
      }
      venueActivity.get(venueId)!.push(event);
    });
    
    // Analyze each venue
    venueActivity.forEach((events, venueId) => {
      const venueName = this.getVenueName(venueId);
      const trend = this.calculateVenueTrend(events, recentEvents);
      
      this.venueTrends.set(venueId, {
        venueId,
        venueName,
        crowdTrend: trend.crowdTrend,
        popularityScore: trend.popularityScore,
        momentum: trend.momentum,
        predictedPeakTime: trend.predictedPeakTime,
        socialBuzz: trend.socialBuzz
      });
    });
  }

  // Calculate specific venue trend
  private calculateVenueTrend(allEvents: any[], recentEvents: any[]): {
    crowdTrend: 'rising' | 'falling' | 'peak' | 'stable';
    popularityScore: number;
    momentum: number;
    predictedPeakTime?: string;
    socialBuzz: number;
  } {
    const venueId = allEvents[0]?.data.venueId;
    const venueRecentEvents = recentEvents.filter(e => e.data.venueId === venueId);
    
    // Calculate popularity score based on interaction frequency
    const totalInteractions = allEvents.length;
    const recentInteractions = venueRecentEvents.length;
    const popularityScore = Math.min(totalInteractions / 20, 1.0); // Max at 20 interactions
    
    // Calculate momentum (recent activity vs historical average)
    const averageActivityPer6Hours = totalInteractions / Math.max(this.getTimeSpanIn6HourChunks(allEvents), 1);
    const momentum = recentInteractions / Math.max(averageActivityPer6Hours, 0.1);
    
    // Determine trend direction
    let crowdTrend: 'rising' | 'falling' | 'peak' | 'stable';
    if (momentum > 1.5) {
      crowdTrend = 'rising';
    } else if (momentum > 2.5) {
      crowdTrend = 'peak';
    } else if (momentum < 0.5) {
      crowdTrend = 'falling';
    } else {
      crowdTrend = 'stable';
    }
    
    // Calculate social buzz based on different interaction types
    const likes = venueRecentEvents.filter(e => e.data.action === 'like').length;
    const saves = venueRecentEvents.filter(e => e.data.action === 'save').length;
    const visits = venueRecentEvents.filter(e => e.data.action === 'visit').length;
    const socialBuzz = (likes * 0.5 + saves * 1 + visits * 2) / Math.max(recentInteractions, 1);
    
    // Predict peak time based on historical patterns
    const predictedPeakTime = this.predictPeakTime(allEvents);
    
    return {
      crowdTrend,
      popularityScore,
      momentum,
      predictedPeakTime,
      socialBuzz
    };
  }

  // Analyze social interaction trends
  private analyzeSocialTrends(): void {
    const friendEvents = eventTracker.getEventsByType('friend_response', 100);
    const recentFriendEvents = eventTracker.getEventsInTimeWindow(3); // Last 3 hours
    
    // Calculate group activity metrics
    const groupSizes = friendEvents.map(e => e.context.friendsNearby || 1);
    const avgGroupSize = groupSizes.reduce((a, b) => a + b, 0) / groupSizes.length || 1;
    
    // Calculate activity level based on recent events
    let activityLevel: 'low' | 'medium' | 'high' | 'peak';
    const recentActivity = recentFriendEvents.length;
    if (recentActivity >= 10) activityLevel = 'peak';
    else if (recentActivity >= 5) activityLevel = 'high';
    else if (recentActivity >= 2) activityLevel = 'medium';
    else activityLevel = 'low';
    
    // Calculate plan formation rate (how often friend interactions lead to plans)
    const planningEvents = friendEvents.filter(e => 
      e.data.responseType === 'join' || e.data.responseType === 'invite'
    ).length;
    const planFormationRate = planningEvents / Math.max(friendEvents.length, 1);
    
    // Calculate response velocity (how quickly friends respond)
    const responseVelocity = this.calculateResponseVelocity(friendEvents);
    
    // Identify social hotspots
    const hotspots = this.identifyHotspots(friendEvents);
    
    this.socialTrends = {
      groupSize: Math.round(avgGroupSize),
      activityLevel,
      planFormationRate,
      responseVelocity,
      hotspots
    };
  }

  // Analyze timing patterns to identify optimal periods
  private analyzeTimingTrends(): TrendData[] {
    const timingEvents = eventTracker.getEventsByType('timing_preference', 50);
    const trends: TrendData[] = [];
    
    // Group by time periods
    const timeSlots = new Map<string, any[]>();
    timingEvents.forEach(event => {
      const timeSlot = this.getTimeSlot(event.timestamp);
      if (!timeSlots.has(timeSlot)) {
        timeSlots.set(timeSlot, []);
      }
      timeSlots.get(timeSlot)!.push(event);
    });
    
    // Analyze each time slot
    timeSlots.forEach((events, timeSlot) => {
      const successfulEvents = events.filter(e => 
        e.data.outcome === 'perfect' || e.data.outcome === 'successful'
      ).length;
      
      const strength = successfulEvents / events.length;
      
      if (strength > 0.6) { // Only track strong timing patterns
        trends.push({
          id: `timing_${timeSlot}`,
          type: 'timing_patterns',
          trend: strength > 0.8 ? 'peak' : 'rising',
          strength,
          velocity: this.calculateTimingVelocity(events),
          confidence: Math.min(events.length / 10, 1.0),
          timeframe: 'medium',
          data: { timeSlot, successRate: strength, totalEvents: events.length },
          timestamp: new Date()
        });
      }
    });
    
    return trends;
  }

  // Identify emerging trends that might be important
  private identifyEmergingTrends(): TrendData[] {
    const allEvents = eventTracker.getEventsInTimeWindow(24); // Last 24 hours
    const emergingTrends: TrendData[] = [];
    
    // Look for unusual patterns in recent data
    const eventTypes = new Map<string, number>();
    allEvents.forEach(event => {
      const key = `${event.type}_${event.context.timeOfDay}`;
      eventTypes.set(key, (eventTypes.get(key) || 0) + 1);
    });
    
    // Find patterns that are unusually frequent
    eventTypes.forEach((count, pattern) => {
      const historicalAverage = this.getHistoricalAverage(pattern);
      const deviation = count / Math.max(historicalAverage, 1);
      
      if (deviation > 2.0 && count >= 3) { // At least 2x more than usual, minimum 3 events
        emergingTrends.push({
          id: `emerging_${pattern}`,
          type: 'social_momentum',
          trend: 'emerging',
          strength: Math.min(deviation / 3, 1.0),
          velocity: count / 24, // Events per hour
          confidence: Math.min(count / 10, 0.8),
          timeframe: 'short',
          data: { pattern, count, deviation, historicalAverage },
          timestamp: new Date()
        });
      }
    });
    
    return emergingTrends;
  }

  // Generate predictions based on trend analysis
  private generateTrendPredictions(): any[] {
    const predictions: any[] = [];
    
    // Venue predictions based on trends
    this.venueTrends.forEach(venueTrend => {
      if (venueTrend.crowdTrend === 'rising' && venueTrend.momentum > 1.5) {
        predictions.push({
          type: 'venue_peak_prediction',
          venue: venueTrend.venueName,
          prediction: `${venueTrend.venueName} is building momentum - likely to peak soon`,
          confidence: Math.min(venueTrend.momentum / 2, 0.9),
          timeframe: '30-60 minutes',
          actionable: true
        });
      }
    });
    
    // Social activity predictions
    if (this.socialTrends && this.socialTrends.activityLevel === 'high') {
      predictions.push({
        type: 'social_peak_prediction',
        prediction: 'High social activity detected - great time for group plans',
        confidence: 0.7,
        timeframe: 'next 1-2 hours',
        actionable: true,
        data: this.socialTrends
      });
    }
    
    return predictions;
  }

  // Get real-time crowd flow for a venue
  getCrowdFlowPrediction(venueId: number): {
    current: number;
    predicted: number;
    peakTime: string;
    confidence: number;
  } {
    const venueTrend = this.venueTrends.get(venueId);
    
    if (!venueTrend) {
      return {
        current: 50, // Default
        predicted: 60,
        peakTime: '9:00 PM',
        confidence: 0.3
      };
    }
    
    const current = venueTrend.popularityScore * 100;
    let predicted = current;
    
    // Adjust prediction based on trend
    switch (venueTrend.crowdTrend) {
      case 'rising':
        predicted = Math.min(current + (venueTrend.momentum * 20), 100);
        break;
      case 'falling':
        predicted = Math.max(current - 20, 10);
        break;
      case 'peak':
        predicted = current; // Already at peak
        break;
    }
    
    return {
      current: Math.round(current),
      predicted: Math.round(predicted),
      peakTime: venueTrend.predictedPeakTime || 'Unknown',
      confidence: venueTrend.momentum > 1 ? 0.8 : 0.5
    };
  }

  // Get trending venues right now
  getTrendingVenues(limit: number = 5): VenueTrend[] {
    return Array.from(this.venueTrends.values())
      .filter(trend => trend.crowdTrend === 'rising' || trend.crowdTrend === 'peak')
      .sort((a, b) => b.momentum - a.momentum)
      .slice(0, limit);
  }

  // Helper methods
  private getVenueName(venueId: number): string {
    // Mock venue names - would come from venue data
    const names = ['Sky Lounge', 'Underground Club', 'Rooftop Bar', 'The Local Pub', 'Jazz Corner'];
    return names[venueId % names.length] || `Venue ${venueId}`;
  }

  private getTimeSpanIn6HourChunks(events: any[]): number {
    if (events.length === 0) return 1;
    
    const oldest = new Date(Math.min(...events.map(e => e.timestamp.getTime())));
    const newest = new Date(Math.max(...events.map(e => e.timestamp.getTime())));
    const diffHours = (newest.getTime() - oldest.getTime()) / (1000 * 60 * 60);
    
    return Math.max(Math.ceil(diffHours / 6), 1);
  }

  private predictPeakTime(events: any[]): string | undefined {
    // Analyze historical timing patterns
    const hourCounts = new Map<number, number>();
    events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    
    if (hourCounts.size === 0) return undefined;
    
    const peakHour = Array.from(hourCounts.entries())
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return `${peakHour}:00`;
  }

  private calculateResponseVelocity(friendEvents: any[]): number {
    // Mock calculation - would analyze actual response times
    const recentEvents = friendEvents.slice(-10);
    return recentEvents.length > 5 ? 0.8 : 0.4; // High/low velocity
  }

  private identifyHotspots(friendEvents: any[]): string[] {
    // Mock hotspot detection - would use real location data
    return ['Downtown', 'Waterfront', 'Arts District'];
  }

  private getTimeSlot(timestamp: Date): string {
    const hour = timestamp.getHours();
    if (hour < 6) return 'late_night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private calculateTimingVelocity(events: any[]): number {
    // Calculate how quickly timing preferences are changing
    if (events.length < 2) return 0;
    
    const timeSpan = events[events.length - 1].timestamp.getTime() - events[0].timestamp.getTime();
    const hoursSpan = timeSpan / (1000 * 60 * 60);
    
    return events.length / Math.max(hoursSpan, 1);
  }

  private getHistoricalAverage(pattern: string): number {
    // Look through trend history for this pattern
    const historicalData = this.trendHistory
      .filter(trend => trend.data.pattern === pattern)
      .map(trend => trend.data.count || 0);
    
    if (historicalData.length === 0) return 1;
    
    return historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
  }

  private getDefaultSocialTrends(): SocialTrend {
    return {
      groupSize: 2,
      activityLevel: 'medium',
      planFormationRate: 0.3,
      responseVelocity: 0.5,
      hotspots: ['Downtown']
    };
  }
}

export const trendAnalyzer = new TrendAnalyzer();
