
import { openAIService } from './OpenAIService';

export interface ConversationContext {
  userId: string;
  sessionId: string;
  conversationHistory: Message[];
  userPreferences: UserPreferences;
  currentLocation?: GeolocationCoordinates;
  timeContext: TimeContext;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserPreferences {
  venueTypes: string[];
  atmospherePreference: string[];
  priceRange: string;
  dietaryRestrictions: string[];
  musicPreferences: string[];
  socialLevel: 'intimate' | 'moderate' | 'busy';
}

export interface TimeContext {
  currentTime: Date;
  dayOfWeek: string;
  isWeekend: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'late-night';
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  intensity: number;
}

export interface IntentAnalysis {
  primaryIntent: string;
  confidence: number;
  entities: Record<string, any>;
  contextualFactors: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface NLPResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  followUpQuestions: string[];
  contextUpdates: Record<string, any>;
}

export class AdvancedNLP {
  private conversationContexts = new Map<string, ConversationContext>();
  private maxHistoryLength = 20;

  async analyzeIntent(message: string, context: ConversationContext): Promise<IntentAnalysis> {
    try {
      const prompt = this.buildIntentAnalysisPrompt(message, context);
      
      const response = await openAIService.chatCompletion([
        { role: 'system', content: prompt },
        { role: 'user', content: message }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        maxTokens: 500
      });

      const analysis = JSON.parse(response.content);
      
      return {
        primaryIntent: analysis.primaryIntent || 'general_query',
        confidence: analysis.confidence || 0.5,
        entities: analysis.entities || {},
        contextualFactors: analysis.contextualFactors || [],
        urgency: analysis.urgency || 'medium'
      };

    } catch (error) {
      console.error('Intent analysis error:', error);
      return {
        primaryIntent: 'general_query',
        confidence: 0.3,
        entities: {},
        contextualFactors: [],
        urgency: 'medium'
      };
    }
  }

  async analyzeSentiment(message: string): Promise<SentimentAnalysis> {
    try {
      const response = await openAIService.chatCompletion([
        {
          role: 'system',
          content: `Analyze the sentiment and emotional tone of messages. Respond in JSON with:
          sentiment (positive/negative/neutral), confidence (0-1), emotions array, intensity (0-1).`
        },
        { role: 'user', content: `Analyze sentiment: "${message}"` }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.2,
        maxTokens: 300
      });

      const analysis = JSON.parse(response.content);
      
      return {
        sentiment: analysis.sentiment || 'neutral',
        confidence: analysis.confidence || 0.5,
        emotions: analysis.emotions || [],
        intensity: analysis.intensity || 0.5
      };

    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.3,
        emotions: [],
        intensity: 0.5
      };
    }
  }

  async generateContextualResponse(
    message: string, 
    context: ConversationContext, 
    intentAnalysis: IntentAnalysis,
    sentimentAnalysis: SentimentAnalysis
  ): Promise<NLPResponse> {
    try {
      const prompt = this.buildResponsePrompt(context, intentAnalysis, sentimentAnalysis);
      
      const response = await openAIService.chatCompletion([
        { role: 'system', content: prompt },
        ...this.buildConversationHistory(context),
        { role: 'user', content: message }
      ], {
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 800
      });

      // Extract structured response
      const responseData = this.parseNLPResponse(response.content);
      
      // Update conversation context
      this.updateConversationContext(context, message, responseData);
      
      return responseData;

    } catch (error) {
      console.error('Contextual response error:', error);
      return {
        response: "I understand what you're looking for. Let me help you find the perfect spot!",
        confidence: 0.5,
        suggestions: ["Tell me more about what you're in the mood for"],
        followUpQuestions: ["What kind of atmosphere are you looking for?"],
        contextUpdates: {}
      };
    }
  }

  private buildIntentAnalysisPrompt(message: string, context: ConversationContext): string {
    return `You are an advanced intent classifier for a nightlife app. Analyze user messages to understand their true intent.

Available intents: venue_search, social_planning, navigation, recommendation_request, status_update, general_query, help_request

Consider:
- User preferences: ${JSON.stringify(context.userPreferences)}
- Time context: ${context.timeContext.timeOfDay} on ${context.timeContext.dayOfWeek}
- Recent conversation: ${context.conversationHistory.slice(-3).map(m => m.content).join(' | ')}

Respond in JSON with: primaryIntent, confidence, entities, contextualFactors, urgency`;
  }

  private buildResponsePrompt(
    context: ConversationContext, 
    intentAnalysis: IntentAnalysis,
    sentimentAnalysis: SentimentAnalysis
  ): string {
    return `You are Nova, an intelligent nightlife assistant with advanced emotional intelligence and contextual awareness.

User Context:
- Preferences: ${JSON.stringify(context.userPreferences)}
- Current mood: ${sentimentAnalysis.sentiment} (${sentimentAnalysis.emotions.join(', ')})
- Intent: ${intentAnalysis.primaryIntent} (confidence: ${intentAnalysis.confidence})
- Time: ${context.timeContext.timeOfDay} on ${context.timeContext.dayOfWeek}
- Location: ${context.currentLocation ? 'Available' : 'Not shared'}

Guidelines:
- Match your tone to the user's emotional state
- Build on previous conversation context
- Provide personalized recommendations
- Be proactive when confidence is high
- Ask clarifying questions when unsure
- Keep responses conversational but informative

Respond naturally, then provide structured data in JSON format at the end with:
{ "confidence": 0-1, "suggestions": [], "followUpQuestions": [], "contextUpdates": {} }`;
  }

  private buildConversationHistory(context: ConversationContext) {
    return context.conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
  }

  private parseNLPResponse(content: string): NLPResponse {
    try {
      // Try to extract JSON from the end of the response
      const jsonMatch = content.match(/\{[^}]*"confidence"[^}]*\}$/);
      
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        const responseText = content.replace(jsonMatch[0], '').trim();
        
        return {
          response: responseText,
          confidence: jsonData.confidence || 0.7,
          suggestions: jsonData.suggestions || [],
          followUpQuestions: jsonData.followUpQuestions || [],
          contextUpdates: jsonData.contextUpdates || {}
        };
      }
    } catch (error) {
      console.warn('Failed to parse structured response:', error);
    }

    // Fallback to simple response
    return {
      response: content,
      confidence: 0.6,
      suggestions: [],
      followUpQuestions: [],
      contextUpdates: {}
    };
  }

  private updateConversationContext(
    context: ConversationContext, 
    userMessage: string, 
    response: NLPResponse
  ): void {
    // Add messages to history
    context.conversationHistory.push(
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      }
    );

    // Trim history if too long
    if (context.conversationHistory.length > this.maxHistoryLength) {
      context.conversationHistory = context.conversationHistory.slice(-this.maxHistoryLength);
    }

    // Apply context updates
    Object.assign(context, response.contextUpdates);

    // Update stored context
    this.conversationContexts.set(context.sessionId, context);
  }

  getOrCreateContext(sessionId: string, userId: string): ConversationContext {
    let context = this.conversationContexts.get(sessionId);
    
    if (!context) {
      context = {
        userId,
        sessionId,
        conversationHistory: [],
        userPreferences: {
          venueTypes: [],
          atmospherePreference: [],
          priceRange: 'moderate',
          dietaryRestrictions: [],
          musicPreferences: [],
          socialLevel: 'moderate'
        },
        timeContext: this.getCurrentTimeContext()
      };
      
      this.conversationContexts.set(sessionId, context);
    }

    return context;
  }

  private getCurrentTimeContext(): TimeContext {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    let timeOfDay: TimeContext['timeOfDay'];
    if (hour < 6) timeOfDay = 'late-night';
    else if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    return {
      currentTime: now,
      dayOfWeek,
      isWeekend: dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday',
      timeOfDay
    };
  }

  updateUserPreferences(sessionId: string, preferences: Partial<UserPreferences>): void {
    const context = this.conversationContexts.get(sessionId);
    if (context) {
      Object.assign(context.userPreferences, preferences);
    }
  }

  clearContext(sessionId: string): void {
    this.conversationContexts.delete(sessionId);
  }
}

export const advancedNLP = new AdvancedNLP();
