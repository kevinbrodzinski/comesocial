
import { venueApi } from '../venueApi';
import { NovaConfig, NovaContext, NovaResponse } from './types';
import { buildEnhancedSearchParams, applyEnhancedIntentFiltering } from './venueFilterUtils';
import { generateSmartExplanation, classifyIntent, generateContextualResponse, getFallbackResponse } from './responseGenerator';
import { Intent } from './novaIntent';

export class NovaApiService {
  private config: NovaConfig;

  constructor(config: NovaConfig) {
    this.config = {
      model: 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.7,
      ...config
    };
  }

  async processMessage(message: string, context: NovaContext = {}): Promise<NovaResponse> {
    try {
      const intent = classifyIntent(message) as Intent;
      
      switch (intent) {
        case 'venue_search':
          return await this.handleVenueSearch(message, context);

        case 'general_chat':
          return {
            message: generateContextualResponse(message, context),
            intent,
          };

        case 'unknown':                       // ⚠️ compile-time guard
        default:
          return getFallbackResponse();
      }
    } catch (error) {
      console.error('Nova API Error:', error);
      return getFallbackResponse();
    }
  }

  private async handleVenueSearch(message: string, context: NovaContext): Promise<NovaResponse> {
    if (!context.location) {
      return {
        message: "I'd love to help you find great spots! Could you enable location sharing so I can show you venues nearby?",
        intent: 'location_query',
      };
    }

    try {
      // Enhanced search with memory-aware parameters
      const searchParams = buildEnhancedSearchParams(message, context);
      
      // Apply memory-based enhancements to search parameters
      if (context.userMemory) {
        // Enhance categories based on user's venue type preferences
        if (context.userMemory.venueTypes.length > 0) {
          searchParams.categories = [
            ...(searchParams.categories || []),
            ...context.userMemory.venueTypes
          ];
        }

        // Adjust search radius based on user's area preferences
        if (context.userMemory.frequentAreas.length > 0) {
          // If user has frequent areas, they might prefer a wider search
          searchParams.radius = Math.max(searchParams.radius, 8000);
        }
      }

      const realVenues = await venueApi.searchVenues(searchParams);
      
      // Convert to Nova venue format
      const novaVenues = realVenues.map(venue => venueApi.convertToNovaVenue(venue));
      
      // Apply enhanced filtering with memory context
      const filteredVenues = applyEnhancedIntentFiltering(novaVenues, message, context.userMemory);
      
      // Generate memory-aware explanation
      const explanation = this.generateMemoryAwareExplanation(message, filteredVenues, context.userMemory);
      
      return {
        message: filteredVenues.length > 0 
          ? "Here are some great spots that match what you're looking for:"
          : "I couldn't find venues matching exactly what you described, but here are some popular nearby options:",
        venues: filteredVenues.slice(0, 3),
        intent: 'venue_search',
        explanation,
      };
    } catch (error) {
      console.error('Venue search error:', error);
      return getFallbackResponse();
    }
  }

  private generateMemoryAwareExplanation(message: string, venues: any[], userMemory?: any): string {
    let explanation = generateSmartExplanation(message, venues);
    
    if (userMemory && venues.length > 0) {
      // Add personalized context based on user memory
      if (userMemory.atmospherePreference.length > 0) {
        const preferredAtmosphere = userMemory.atmospherePreference[0];
        explanation += ` I selected these based on your preference for ${preferredAtmosphere} atmospheres.`;
      }
      
      if (userMemory.venueTypes.length > 0) {
        const preferredType = userMemory.venueTypes[0];
        explanation += ` These align with your usual interest in ${preferredType}.`;
      }
    }
    
    return explanation;
  }

  async callRealAI(message: string, context: NovaContext): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are Nova, an AI nightlife concierge. Help users find great venues and nightlife experiences. Be friendly, knowledgeable, and concise.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, I had trouble processing that request.';
  }
}
