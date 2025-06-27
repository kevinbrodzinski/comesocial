
import { z } from 'zod';

// Base context schema
export const EventContextSchema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  timeOfDay: z.string(),
  dayOfWeek: z.string(),
  weather: z.string().optional(),
  friendsNearby: z.number().optional()
});

// Event type enum
export const EventTypeSchema = z.enum([
  'venue_interaction',
  'friend_response', 
  'suggestion_feedback',
  'timing_preference',
  'location_pattern',
  'chat_interaction',
  'notification_action',
  'trend_follow',
  'prediction_outcome',
  'notification_generated',
  'notification_shown'
]);

// Source enum
export const EventSourceSchema = z.enum(['user_action', 'system_generated', 'ai_prediction']);

// Base user event schema
export const UserEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.date(),
  type: EventTypeSchema,
  context: EventContextSchema,
  data: z.record(z.any()),
  source: EventSourceSchema
});

// Specific event data schemas
export const VenueInteractionDataSchema = z.object({
  venueId: z.number(),
  action: z.enum(['view', 'like', 'save', 'visit', 'check_in', 'search', 'share']),
  venueType: z.string().optional(),
  source: z.string().optional()
});

export const FriendResponseDataSchema = z.object({
  friendId: z.string(),
  responseType: z.enum(['join', 'maybe', 'decline', 'invite', 'message', 'explore']),
  context: z.string().optional()
});

export const SuggestionFeedbackDataSchema = z.object({
  suggestionId: z.string(),
  feedback: z.enum(['positive', 'negative', 'ignored']),
  reason: z.string().optional(),
  action: z.enum(['accepted', 'dismissed', 'viewed']).optional()
});

export const TimingPreferenceDataSchema = z.object({
  preferredTime: z.string(),
  venueType: z.string(),
  outcome: z.enum(['successful', 'too_crowded', 'too_empty', 'perfect', 'ai_suggested'])
});

export const LocationPatternDataSchema = z.object({
  fromLocation: z.any(),
  toLocation: z.any(),
  travelTime: z.number(),
  route: z.string().default('direct')
});

export const ChatInteractionDataSchema = z.object({
  pattern: z.string().optional(),
  strength: z.number().optional(),
  action: z.string().optional(),
  query: z.string().optional(),
  intent: z.string().optional()
});

export const NotificationActionDataSchema = z.object({
  type: z.string(),
  priority: z.string().optional(),
  trigger: z.string().optional(),
  action: z.enum(['generated', 'shown', 'dismissed', 'accepted'])
});

export const PredictionOutcomeDataSchema = z.object({
  predictionId: z.string(),
  type: z.string(),
  predictedConfidence: z.number(),
  actualOutcome: z.boolean(),
  accuracy: z.number()
});

// Event validation function
export function validateEventData(type: string, data: any): boolean {
  try {
    switch (type) {
      case 'venue_interaction':
        VenueInteractionDataSchema.parse(data);
        break;
      case 'friend_response':
        FriendResponseDataSchema.parse(data);
        break;
      case 'suggestion_feedback':
        SuggestionFeedbackDataSchema.parse(data);
        break;
      case 'timing_preference':
        TimingPreferenceDataSchema.parse(data);
        break;
      case 'location_pattern':
        LocationPatternDataSchema.parse(data);
        break;
      case 'chat_interaction':
        ChatInteractionDataSchema.parse(data);
        break;
      case 'notification_action':
        NotificationActionDataSchema.parse(data);
        break;
      case 'prediction_outcome':
        PredictionOutcomeDataSchema.parse(data);
        break;
      default:
        // Allow unknown event types with basic validation
        z.record(z.any()).parse(data);
    }
    return true;
  } catch (error) {
    console.warn(`Event data validation failed for type ${type}:`, error);
    return false;
  }
}
