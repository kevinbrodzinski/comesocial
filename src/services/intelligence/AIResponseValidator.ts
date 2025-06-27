
import { z } from 'zod';
import { errorHandler } from './ErrorHandler';

// AI Response schemas
export const PredictionResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['venue_recommendation', 'timing_suggestion', 'friend_activity', 'social_opportunity']),
  confidence: z.number().min(0).max(1),
  prediction: z.string(),
  reasoning: z.string(),
  actionable: z.boolean(),
  expiresAt: z.date(),
  metadata: z.record(z.any())
});

export const NotificationResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['friend_proximity', 'optimal_timing', 'venue_suggestion', 'social_opportunity', 'weather_alternative']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  title: z.string(),
  message: z.string(),
  actionLabel: z.string().optional(),
  contextData: z.record(z.any()),
  expiresAt: z.date(),
  shown: z.boolean()
});

export const LLMResponseSchema = z.object({
  message: z.string(),
  venues: z.array(z.any()).optional(),
  intent: z.enum(['venue_search', 'general_chat', 'location_query', 'recommendation']),
  followUp: z.string().optional(),
  explanation: z.string().optional()
});

export class AIResponseValidator {
  // Validate prediction responses
  validatePrediction(response: any, source: string = 'unknown'): any | null {
    try {
      return PredictionResponseSchema.parse(response);
    } catch (error) {
      errorHandler.handleError(
        'ai_call',
        'Invalid prediction response format',
        {
          component: 'AIResponseValidator',
          operation: 'validatePrediction',
          data: { source, response },
          timestamp: new Date()
        },
        true
      );
      return null;
    }
  }

  // Validate notification responses
  validateNotification(response: any, source: string = 'unknown'): any | null {
    try {
      return NotificationResponseSchema.parse(response);
    } catch (error) {
      errorHandler.handleError(
        'ai_call',
        'Invalid notification response format',
        {
          component: 'AIResponseValidator',
          operation: 'validateNotification',
          data: { source, response },
          timestamp: new Date()
        },
        true
      );
      return null;
    }
  }

  // Validate LLM chat responses
  validateLLMResponse(response: any, source: string = 'unknown'): any | null {
    try {
      return LLMResponseSchema.parse(response);
    } catch (error) {
      errorHandler.handleError(
        'ai_call',
        'Invalid LLM response format',
        {
          component: 'AIResponseValidator',
          operation: 'validateLLMResponse',
          data: { source, response },
          timestamp: new Date()
        },
        true
      );
      
      // Return fallback response for LLM errors
      return {
        message: "I encountered an issue processing your request. Please try again.",
        intent: 'general_chat' as const,
        explanation: 'AI response validation failed'
      };
    }
  }

  // Validate and sanitize AI function call responses
  validateFunctionCall(functionName: string, response: any): any | null {
    try {
      // Basic validation for function calls
      if (!response || typeof response !== 'object') {
        throw new Error('Function call response must be an object');
      }

      // Log successful validation
      console.log(`✅ Function call validated: ${functionName}`);
      return response;
    } catch (error) {
      errorHandler.handleError(
        'ai_call',
        `Invalid function call response for ${functionName}`,
        {
          component: 'AIResponseValidator',
          operation: 'validateFunctionCall',
          data: { functionName, response },
          timestamp: new Date()
        },
        true
      );
      return null;
    }
  }

  // Validate structured AI outputs (JSON, etc.)
  validateStructuredOutput<T>(
    schema: z.ZodSchema<T>,
    response: any,
    context: string
  ): T | null {
    try {
      return schema.parse(response);
    } catch (error) {
      errorHandler.handleError(
        'ai_call',
        `Structured output validation failed: ${context}`,
        {
          component: 'AIResponseValidator',
          operation: 'validateStructuredOutput',
          data: { context, response },
          timestamp: new Date()
        },
        true
      );
      return null;
    }
  }
}

export const aiResponseValidator = new AIResponseValidator();
