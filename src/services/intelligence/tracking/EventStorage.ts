
interface StoredEventData {
  events: any[];
  patterns: [string, any][];
}

export class EventStorage {
  private readonly storageKey = 'nova_user_events';
  private readonly maxStoredEvents = 1000;

  saveEvents(events: any[], patterns: Map<string, any>): void {
    try {
      const eventData: StoredEventData = {
        events: events.slice(-this.maxStoredEvents),
        patterns: Array.from(patterns.entries())
      };
      localStorage.setItem(this.storageKey, JSON.stringify(eventData));
    } catch (error) {
      console.warn('Failed to save events:', error);
    }
  }

  loadEvents(): { events: any[]; patterns: Map<string, any> } {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const eventData: StoredEventData = JSON.parse(stored);
        return {
          events: eventData.events || [],
          patterns: new Map(eventData.patterns || [])
        };
      }
    } catch (error) {
      console.warn('Failed to load events:', error);
    }
    
    return { events: [], patterns: new Map() };
  }

  cleanup(events: any[], cutoffDate: Date): any[] {
    return events.filter(event => new Date(event.timestamp) > cutoffDate);
  }
}

export const eventStorage = new EventStorage();
