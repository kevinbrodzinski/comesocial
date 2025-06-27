
import { OpenAIService, openAIService } from './OpenAIService';
import { ConversationManager } from './ConversationManager';
import { IntentClassifier, intentClassifier } from './IntentClassifier';
import { domainHandlers } from '../domains';
import { NovaContext } from '../nova/types';

export interface EnhancedNovaResponse {
  message: string;
  venues?: any[];
  intent: string;
  domain: string;
  suggestions?: string[];
  requiresFollowUp?: boolean;
  explanation?: string;
}

export class EnhancedNovaService {
  private conversationManager: ConversationManager;
  private sessionId: string;

  constructor() {
    this.conversationManager = new ConversationManager(openAIService, intentClassifier);
    this.sessionId = this.generateSessionId();
  }

  async processMessage(message: string, context: NovaContext = {}): Promise<EnhancedNovaResponse> {
    try {
      // Set OpenAI API key from environment if available
      if (!openAIService.isConfigured()) {
        // In a real app, this would come from environment variables
        // For now, we'll handle this in the Supabase Edge Function
        console.warn('OpenAI service not configured with API key');
      }

      // Build enhanced context
      const enhancedContext = {
        location: context.location,
        timeContext: new Date().toLocaleString(),
        userMemory: context.userMemory,
        conversationHistory: context.conversationHistory?.map(msg => msg.content) || []
      };

      // Process with conversation manager
      const response = await this.conversationManager.processMessage(
        this.sessionId,
        message,
        enhancedContext
      );

      // If it's a venue search, get actual venues
      let venues: any[] = [];
      let explanation = '';

      if (response.intent.intent === 'search' && response.intent.domain !== 'general') {
        const domainHandler = domainHandlers[response.intent.domain as keyof typeof domainHandlers];
        
        if (domainHandler) {
          try {
            if (response.intent.domain === 'nightlife') {
              venues = await (domainHandler as any).findVenues(message, context.location, {
                atmosphere: response.intent.entities.atmosphere,
                venueType: response.intent.entities.venueType,
                priceRange: response.intent.entities.priceRange
              });
            } else if (response.intent.domain === 'dining') {
              venues = await (domainHandler as any).findRestaurants(message, context.location, {
                cuisine: response.intent.entities.cuisine,
                priceRange: response.intent.entities.priceRange,
                dietary: response.intent.entities.dietary,
                ambiance: response.intent.entities.atmosphere
              });
            }

            if (venues.length > 0) {
              explanation = this.generateVenueExplanation(response.intent, venues, message);
            }
          } catch (error) {
            console.error('Domain handler error:', error);
          }
        }
      }

      return {
        message: response.message,
        venues: venues.slice(0, 3), // Limit to top 3
        intent: response.intent.intent,
        domain: response.intent.domain,
        suggestions: response.suggestions,
        requiresFollowUp: response.requiresFollowUp,
        explanation
      };

    } catch (error) {
      console.error('Enhanced Nova Service Error:', error);
      
      return {
        message: "I'm having trouble processing that request right now. Could you try rephrasing it?",
        intent: 'error',
        domain: 'general',
        requiresFollowUp: true
      };
    }
  }

  private generateVenueExplanation(intent: any, venues: any[], query: string): string {
    const domain = intent.domain;
    const entities = intent.entities;
    
    let explanation = `I found ${venues.length} great ${domain} option${venues.length > 1 ? 's' : ''} for you`;
    
    if (entities.atmosphere) {
      explanation += ` with a ${entities.atmosphere} atmosphere`;
    }
    
    if (entities.priceRange) {
      explanation += ` in the ${entities.priceRange} price range`;
    }
    
    if (entities.cuisine && domain === 'dining') {
      explanation += ` serving ${entities.cuisine} cuisine`;
    }
    
    if (entities.venueType && domain === 'nightlife') {
      explanation += ` focusing on ${entities.venueType} venues`;
    }
    
    explanation += '.';
    
    return explanation;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Method to inject API key (for use in Edge Functions)
  setApiKey(apiKey: string): void {
    openAIService.setApiKey(apiKey);
  }

  // Cleanup method
  cleanup(): void {
    this.conversationManager.cleanupOldSessions();
  }
}

export const enhancedNovaService = new EnhancedNovaService();
