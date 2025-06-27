
import { errorHandler } from '../intelligence/ErrorHandler';
import { eventTracker } from '../intelligence/EventTracker';

export interface LiveVenueData {
  venueId: number;
  timestamp: Date;
  crowdLevel: number;
  waitTime: number;
  capacity: {
    current: number;
    maximum: number;
    percentage: number;
  };
  pricing: {
    coverCharge: number;
    dynamicPricing: boolean;
    priceLevel: 'low' | 'medium' | 'high' | 'surge';
  };
  atmosphere: {
    energyLevel: number;
    musicVolume: number;
    vibe: string;
  };
  availability: {
    hasSpace: boolean;
    reservationsAvailable: boolean;
    estimatedEntry: string;
  };
}

export interface LiveEventData {
  eventId: string;
  venueId: number;
  eventType: 'live_music' | 'dj_set' | 'special_event' | 'happy_hour' | 'theme_night';
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  attendance: number;
  popularity: number;
  description: string;
}

export class LiveDataAggregator {
  private venueDataCache: Map<number, LiveVenueData> = new Map();
  private eventDataCache: Map<string, LiveEventData> = new Map();
  private updateInterval: number = 30000; // 30 seconds
  private isActive: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeCache();
  }

  // Start real-time data aggregation
  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🔄 Starting Live Data Aggregator');
    
    // Initial data fetch
    this.updateAllData();
    
    // Set up periodic updates
    this.intervalId = setInterval(() => {
      this.updateAllData();
    }, this.updateInterval);
  }

  // Stop real-time data aggregation
  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('⏹️ Stopped Live Data Aggregator');
  }

  // Get live venue data
  getVenueData(venueId: number): LiveVenueData | null {
    const data = this.venueDataCache.get(venueId);
    
    if (data && this.isDataFresh(data.timestamp)) {
      return data;
    }
    
    // Trigger refresh if data is stale
    this.refreshVenueData(venueId);
    return data || null;
  }

  // Get all live venue data
  getAllVenueData(): LiveVenueData[] {
    const freshData: LiveVenueData[] = [];
    const now = new Date();
    
    for (const [venueId, data] of this.venueDataCache.entries()) {
      if (this.isDataFresh(data.timestamp)) {
        freshData.push(data);
      } else {
        // Refresh stale data
        this.refreshVenueData(venueId);
      }
    }
    
    return freshData;
  }

  // Get live events for venue
  getVenueEvents(venueId: number): LiveEventData[] {
    return Array.from(this.eventDataCache.values())
      .filter(event => event.venueId === venueId && event.isActive);
  }

  // Get all active events
  getActiveEvents(): LiveEventData[] {
    return Array.from(this.eventDataCache.values())
      .filter(event => event.isActive);
  }

  // Update all data sources
  private async updateAllData(): Promise<void> {
    try {
      await Promise.all([
        this.updateVenueData(),
        this.updateEventData(),
        this.updateCrowdLevels()
      ]);
      
      console.log('📊 Live data updated successfully');
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to update live data',
        {
          component: 'LiveDataAggregator',
          operation: 'updateAllData',
          data: { error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Update venue data from multiple sources
  private async updateVenueData(): Promise<void> {
    // Simulate real-time venue data (in production, this would call actual APIs)
    const venues = [1, 2, 3, 4, 5, 6, 7]; // Sample venue IDs
    
    for (const venueId of venues) {
      const liveData: LiveVenueData = {
        venueId,
        timestamp: new Date(),
        crowdLevel: this.generateCrowdLevel(),
        waitTime: this.generateWaitTime(),
        capacity: this.generateCapacityData(),
        pricing: this.generatePricingData(),
        atmosphere: this.generateAtmosphereData(),
        availability: this.generateAvailabilityData()
      };
      
      // Check for significant changes
      const previousData = this.venueDataCache.get(venueId);
      if (this.hasSignificantChange(previousData, liveData)) {
        // Track the change event
        eventTracker.trackEvent('venue_interaction', {
          venueId,
          action: 'data_update',
          crowdLevel: liveData.crowdLevel,
          waitTime: liveData.waitTime,
          capacity: liveData.capacity.percentage,
          source: 'live_data'
        }, 'system_generated');
      }
      
      this.venueDataCache.set(venueId, liveData);
    }
  }

  // Update live event data
  private async updateEventData(): Promise<void> {
    // Simulate live event data
    const currentHour = new Date().getHours();
    const events: LiveEventData[] = [];
    
    // Generate events based on time of day
    if (currentHour >= 17) { // Evening events
      events.push({
        eventId: `event_${Date.now()}_1`,
        venueId: 1,
        eventType: 'happy_hour',
        startTime: new Date(Date.now() - 60 * 60 * 1000),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        isActive: true,
        attendance: Math.floor(Math.random() * 50) + 20,
        popularity: Math.random() * 0.4 + 0.6,
        description: 'Happy Hour - Half price cocktails'
      });
    }
    
    if (currentHour >= 21) { // Night events
      events.push({
        eventId: `event_${Date.now()}_2`,
        venueId: 3,
        eventType: 'dj_set',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        isActive: true,
        attendance: Math.floor(Math.random() * 100) + 50,
        popularity: Math.random() * 0.3 + 0.7,
        description: 'Live DJ Set - Electronic Music'
      });
    }
    
    // Update cache
    events.forEach(event => {
      this.eventDataCache.set(event.eventId, event);
    });
    
    // Clean up expired events
    this.cleanupExpiredEvents();
  }

  // Update crowd levels based on patterns
  private async updateCrowdLevels(): Promise<void> {
    const patterns = eventTracker.getBehaviorPatterns();
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const day = currentTime.getDay();
    
    // Apply crowd level modifiers based on time patterns
    for (const [venueId, data] of this.venueDataCache.entries()) {
      let modifier = 1.0;
      
      // Weekend modifier
      if (day === 5 || day === 6) { // Friday or Saturday
        modifier *= 1.3;
      }
      
      // Time of day modifier
      if (hour >= 19 && hour <= 23) { // Prime time
        modifier *= 1.4;
      } else if (hour >= 15 && hour <= 18) { // Happy hour
        modifier *= 1.2;
      }
      
      // Apply modifier to crowd level
      const adjustedCrowdLevel = Math.min(100, data.crowdLevel * modifier);
      data.crowdLevel = Math.round(adjustedCrowdLevel);
      data.capacity.current = Math.round(data.capacity.maximum * (adjustedCrowdLevel / 100));
      data.capacity.percentage = Math.round(adjustedCrowdLevel);
    }
  }

  // Generate realistic crowd level
  private generateCrowdLevel(): number {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    let baseCrowd = 30;
    
    // Time-based modifiers
    if (hour >= 19 && hour <= 23) baseCrowd = 70;
    else if (hour >= 15 && hour <= 18) baseCrowd = 50;
    else if (hour >= 12 && hour <= 14) baseCrowd = 40;
    
    // Weekend modifier
    if (day === 5 || day === 6) baseCrowd += 20;
    
    // Add randomness
    const variation = Math.random() * 30 - 15;
    return Math.max(10, Math.min(100, baseCrowd + variation));
  }

  // Generate wait time based on crowd level
  private generateWaitTime(): number {
    const crowdLevel = this.generateCrowdLevel();
    if (crowdLevel < 40) return 0;
    if (crowdLevel < 60) return Math.floor(Math.random() * 10) + 5;
    if (crowdLevel < 80) return Math.floor(Math.random() * 20) + 10;
    return Math.floor(Math.random() * 30) + 20;
  }

  // Generate capacity data
  private generateCapacityData() {
    const maximum = Math.floor(Math.random() * 200) + 100;
    const percentage = this.generateCrowdLevel();
    const current = Math.round(maximum * (percentage / 100));
    
    return { current, maximum, percentage };
  }

  // Generate pricing data
  private generatePricingData() {
    const hour = new Date().getHours();
    const crowdLevel = this.generateCrowdLevel();
    
    let coverCharge = 0;
    let priceLevel: 'low' | 'medium' | 'high' | 'surge' = 'medium';
    
    if (hour >= 21) {
      coverCharge = Math.floor(Math.random() * 20) + 10;
      if (crowdLevel > 80) priceLevel = 'surge';
      else if (crowdLevel > 60) priceLevel = 'high';
    } else if (hour >= 17) {
      priceLevel = 'low'; // Happy hour
    }
    
    return {
      coverCharge,
      dynamicPricing: crowdLevel > 70,
      priceLevel
    };
  }

  // Generate atmosphere data
  private generateAtmosphereData() {
    const crowdLevel = this.generateCrowdLevel();
    const hour = new Date().getHours();
    
    const energyLevel = Math.min(10, Math.max(1, Math.round(crowdLevel / 10)));
    const musicVolume = hour >= 20 ? Math.floor(Math.random() * 3) + 7 : Math.floor(Math.random() * 5) + 3;
    
    const vibes = ['chill', 'energetic', 'intimate', 'party', 'sophisticated'];
    const vibe = vibes[Math.floor(Math.random() * vibes.length)];
    
    return { energyLevel, musicVolume, vibe };
  }

  // Generate availability data
  private generateAvailabilityData() {
    const crowdLevel = this.generateCrowdLevel();
    const waitTime = this.generateWaitTime();
    
    return {
      hasSpace: crowdLevel < 90,
      reservationsAvailable: crowdLevel < 70,
      estimatedEntry: waitTime > 0 ? `${waitTime} min` : 'Immediate'
    };
  }

  // Check if data timestamp is fresh
  private isDataFresh(timestamp: Date): boolean {
    const now = new Date();
    const ageInMs = now.getTime() - timestamp.getTime();
    return ageInMs < this.updateInterval * 2; // Data is fresh if less than 2 update intervals old
  }

  // Check for significant changes in venue data
  private hasSignificantChange(previous: LiveVenueData | undefined, current: LiveVenueData): boolean {
    if (!previous) return true;
    
    const crowdChange = Math.abs(current.crowdLevel - previous.crowdLevel);
    const waitTimeChange = Math.abs(current.waitTime - previous.waitTime);
    const priceChange = current.pricing.priceLevel !== previous.pricing.priceLevel;
    
    return crowdChange > 15 || waitTimeChange > 10 || priceChange;
  }

  // Refresh specific venue data
  private async refreshVenueData(venueId: number): Promise<void> {
    try {
      // In production, this would call actual APIs for the specific venue
      const liveData: LiveVenueData = {
        venueId,
        timestamp: new Date(),
        crowdLevel: this.generateCrowdLevel(),
        waitTime: this.generateWaitTime(),
        capacity: this.generateCapacityData(),
        pricing: this.generatePricingData(),
        atmosphere: this.generateAtmosphereData(),
        availability: this.generateAvailabilityData()
      };
      
      this.venueDataCache.set(venueId, liveData);
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        `Failed to refresh venue data for venue ${venueId}`,
        {
          component: 'LiveDataAggregator',
          operation: 'refreshVenueData',
          data: { venueId, error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Clean up expired events
  private cleanupExpiredEvents(): void {
    const now = new Date();
    for (const [eventId, event] of this.eventDataCache.entries()) {
      if (event.endTime < now) {
        this.eventDataCache.delete(eventId);
      }
    }
  }

  // Initialize cache with sample data
  private initializeCache(): void {
    // Pre-populate with some initial data
    const venues = [1, 2, 3, 4, 5, 6, 7];
    venues.forEach(venueId => {
      const initialData: LiveVenueData = {
        venueId,
        timestamp: new Date(),
        crowdLevel: this.generateCrowdLevel(),
        waitTime: this.generateWaitTime(),
        capacity: this.generateCapacityData(),
        pricing: this.generatePricingData(),
        atmosphere: this.generateAtmosphereData(),
        availability: this.generateAvailabilityData()
      };
      
      this.venueDataCache.set(venueId, initialData);
    });
  }

  // Get aggregated statistics
  getStatistics() {
    const venueData = Array.from(this.venueDataCache.values());
    const eventData = Array.from(this.eventDataCache.values());

    return {
      totalVenues: venueData.length,
      averageCrowdLevel: venueData.reduce((sum, v) => sum + v.crowdLevel, 0) / venueData.length,
      totalActiveEvents: eventData.filter(e => e.isActive).length,
      lastUpdate: Math.max(...venueData.map(v => v.timestamp.getTime())),
      dataFreshness: venueData.filter(v => this.isDataFresh(v.timestamp)).length / venueData.length
    };
  }
}

export const liveDataAggregator = new LiveDataAggregator();
