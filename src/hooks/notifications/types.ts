
import { NotificationAlert } from '../useNotificationSystem';

export interface ScheduledNotification {
  id: string;
  triggerTime: Date;
  notification: Omit<NotificationAlert, 'id' | 'timestamp'>;
  recurring?: boolean;
  interval?: number; // in milliseconds
}

export interface NotificationPreferences {
  enabled: boolean;
  preEventMinutes: number;
  friendAlerts: boolean;
  crowdThreshold: boolean;
  dndStart: string; // "23:00"
  dndEnd: string; // "09:00"
  locationAlerts: boolean;
}

// Type-safe venue filter tags based on the screenshots
export type VenueTag = 
  | 'music' | 'dancing' | 'high_energy' | 'unique' | 'pop_up' | 'speakeasy'
  | 'new' | 'hidden' | 'romantic' | 'restaurants' | 'activity' | 'live music'
  | 'lounge' | 'quiet' | 'rooftop' | 'scenic' | 'gastropub' | 'casual'
  | 'upscale' | 'fine dining' | 'dj' | 'dance' | 'happy hour' | 'deals'
  | 'free entry' | 'events' | 'immersive' | 'themed' | 'trending';

// Re-export from notification system for convenience
export type { NotificationAlert } from '../useNotificationSystem';
