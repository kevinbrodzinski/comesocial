
import { errorHandler } from '../intelligence/ErrorHandler';
import { eventTracker } from '../intelligence/EventTracker';
import { aiResponseValidator } from '../intelligence/AIResponseValidator';

export interface StreamEvent {
  id: string;
  type: 'venue_update' | 'friend_activity' | 'event_discovery' | 'social_intelligence' | 'prediction_update';
  timestamp: Date;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  expires?: Date;
}

export interface EventSubscription {
  id: string;
  eventTypes: string[];
  filter?: (event: StreamEvent) => boolean;
  callback: (event: StreamEvent) => void;
  priority: number;
}

export class EventStreamManager {
  private eventQueue: StreamEvent[] = [];
  private subscribers: Map<string, EventSubscription> = new Map();
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private readonly maxQueueSize = 1000;
  private readonly processingDelay = 100; // ms

  constructor() {
    this.startProcessing();
  }

  // Subscribe to event stream
  subscribe(
    eventTypes: string[],
    callback: (event: StreamEvent) => void,
    filter?: (event: StreamEvent) => boolean,
    priority: number = 1
  ): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      eventTypes,
      filter,
      callback,
      priority
    };
    
    this.subscribers.set(subscriptionId, subscription);
    
    console.log(`📡 New subscription: ${subscriptionId} for events: ${eventTypes.join(', ')}`);
    
    return subscriptionId;
  }

  // Unsubscribe from event stream
  unsubscribe(subscriptionId: string): boolean {
    const removed = this.subscribers.delete(subscriptionId);
    if (removed) {
      console.log(`🚫 Unsubscribed: ${subscriptionId}`);
    }
    return removed;
  }

  // Emit event to stream
  emit(event: Omit<StreamEvent, 'id' | 'timestamp'>): void {
    try {
      const streamEvent: StreamEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      };

      // Validate event data if it's an AI response
      if (event.type === 'prediction_update' && event.data) {
        const validated = aiResponseValidator.validateStructuredOutput(
          event.data.schema || {},
          event.data,
          'EventStreamManager'
        );
        if (!validated) {
          console.warn('⚠️ Invalid event data, skipping emission');
          return;
        }
      }

      // Add to queue
      this.addToQueue(streamEvent);
      
      // Track the event
      eventTracker.trackEvent('notification_generated', {
        eventId: streamEvent.id,
        type: streamEvent.type,
        priority: streamEvent.priority,
        category: streamEvent.category
      }, 'system_generated');

      console.log(`🎯 Event emitted: ${streamEvent.type} (${streamEvent.priority})`);
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to emit event to stream',
        {
          component: 'EventStreamManager',
          operation: 'emit',
          data: { event, error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Add event to queue with priority handling
  private addToQueue(event: StreamEvent): void {
    // Remove expired events
    this.cleanupExpiredEvents();
    
    // Check queue size
    if (this.eventQueue.length >= this.maxQueueSize) {
      // Remove oldest low-priority events
      this.eventQueue = this.eventQueue
        .filter(e => e.priority !== 'low')
        .slice(-this.maxQueueSize + 1);
    }
    
    // Insert with priority order
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const eventPriority = priorityOrder[event.priority];
    
    let insertIndex = this.eventQueue.length;
    for (let i = 0; i < this.eventQueue.length; i++) {
      if (priorityOrder[this.eventQueue[i].priority] < eventPriority) {
        insertIndex = i;
        break;
      }
    }
    
    this.eventQueue.splice(insertIndex, 0, event);
  }

  // Start processing event queue
  private startProcessing(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, this.processingDelay);
    
    console.log('🔄 Event stream processing started');
  }

  // Stop processing event queue
  stopProcessing(): void {
    if (!this.isProcessing) return;
    
    this.isProcessing = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    console.log('⏹️ Event stream processing stopped');
  }

  // Process event queue
  private processQueue(): void {
    if (this.eventQueue.length === 0) return;
    
    const event = this.eventQueue.shift();
    if (!event) return;
    
    try {
      // Check if event is expired
      if (event.expires && event.expires < new Date()) {
        console.log(`⏰ Event expired: ${event.id}`);
        return;
      }
      
      // Find matching subscribers
      const matchingSubscribers = this.getMatchingSubscribers(event);
      
      if (matchingSubscribers.length === 0) {
        console.log(`📭 No subscribers for event: ${event.type}`);
        return;
      }
      
      // Notify subscribers
      matchingSubscribers.forEach(subscription => {
        try {
          subscription.callback(event);
          
          // Track successful delivery
          eventTracker.trackEvent('notification_shown', {
            eventId: event.id,
            subscriptionId: subscription.id,
            type: event.type,
            delivered: true
          }, 'system_generated');
          
        } catch (error) {
          errorHandler.handleError(
            'notification',
            `Failed to deliver event to subscriber: ${subscription.id}`,
            {
              component: 'EventStreamManager',
              operation: 'processQueue',
              data: { eventId: event.id, subscriptionId: subscription.id, error },
              timestamp: new Date()
            },
            true
          );
        }
      });
      
      console.log(`📬 Event processed: ${event.id} -> ${matchingSubscribers.length} subscribers`);
      
    } catch (error) {
      errorHandler.handleError(
        'data_processing',
        'Failed to process event from queue',
        {
          component: 'EventStreamManager',
          operation: 'processQueue',
          data: { eventId: event?.id, error },
          timestamp: new Date()
        },
        true
      );
    }
  }

  // Get subscribers matching event
  private getMatchingSubscribers(event: StreamEvent): EventSubscription[] {
    const matching: EventSubscription[] = [];
    
    for (const subscription of this.subscribers.values()) {
      // Check event type match
      const typeMatch = subscription.eventTypes.includes('*') || 
                       subscription.eventTypes.includes(event.type);
      
      if (!typeMatch) continue;
      
      // Apply filter if provided
      if (subscription.filter && !subscription.filter(event)) {
        continue;
      }
      
      matching.push(subscription);
    }
    
    // Sort by priority
    return matching.sort((a, b) => b.priority - a.priority);
  }

  // Clean up expired events
  private cleanupExpiredEvents(): void {
    const now = new Date();
    this.eventQueue = this.eventQueue.filter(event => {
      return !event.expires || event.expires > now;
    });
  }

  // Emit venue update event
  emitVenueUpdate(venueId: number, data: any, priority: StreamEvent['priority'] = 'medium'): void {
    this.emit({
      type: 'venue_update',
      data: { venueId, ...data },
      priority,
      category: 'venue_intelligence'
    });
  }

  // Emit friend activity event
  emitFriendActivity(friendId: string, activity: any, priority: StreamEvent['priority'] = 'high'): void {
    this.emit({
      type: 'friend_activity',
      data: { friendId, ...activity },
      priority,
      category: 'social_intelligence'
    });
  }

  // Emit event discovery
  emitEventDiscovery(eventData: any, priority: StreamEvent['priority'] = 'medium'): void {
    this.emit({
      type: 'event_discovery',
      data: eventData,
      priority,
      category: 'event_discovery',
      expires: new Date(Date.now() + 60 * 60 * 1000) // Expire in 1 hour
    });
  }

  // Emit social intelligence update
  emitSocialIntelligence(data: any, priority: StreamEvent['priority'] = 'medium'): void {
    this.emit({
      type: 'social_intelligence',
      data,
      priority,
      category: 'social_analysis'
    });
  }

  // Emit prediction update
  emitPredictionUpdate(prediction: any, priority: StreamEvent['priority'] = 'low'): void {
    this.emit({
      type: 'prediction_update',
      data: prediction,
      priority,
      category: 'ai_predictions'
    });
  }

  // Get queue statistics
  getQueueStats() {
    const stats = {
      queueLength: this.eventQueue.length,
      subscriberCount: this.subscribers.size,
      eventsByPriority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      eventsByType: {} as Record<string, number>,
      isProcessing: this.isProcessing
    };
    
    this.eventQueue.forEach(event => {
      stats.eventsByPriority[event.priority]++;
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
    });
    
    return stats;
  }

  // Clear all events and subscriptions
  clear(): void {
    this.eventQueue = [];
    this.subscribers.clear();
    console.log('🗑️ Event stream cleared');
  }
}

export const eventStreamManager = new EventStreamManager();
