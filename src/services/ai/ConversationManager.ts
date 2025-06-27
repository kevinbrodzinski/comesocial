
import { OpenAIMessage, OpenAIService } from './OpenAIService';
import { ClassifiedIntent, IntentClassifier } from './IntentClassifier';
import { PromptTemplates, PromptContext } from './PromptTemplates';

export interface ConversationSession {
  id: string;
  userId?: string;
  messages: OpenAIMessage[];
  context: PromptContext;
  startTime: Date;
  lastActivity: Date;
}

export interface ConversationResponse {
  message: string;
  intent: ClassifiedIntent;
  suggestions?: string[];
  venues?: any[];
  requiresFollowUp?: boolean;
}

export class ConversationManager {
  private openAI: OpenAIService;
  private intentClassifier: IntentClassifier;
  private sessions: Map<string, ConversationSession> = new Map();

  constructor(openAI: OpenAIService, intentClassifier: IntentClassifier) {
    this.openAI = openAI;
    this.intentClassifier = intentClassifier;
  }

  async processMessage(
    sessionId: string,
    userMessage: string,
    context: Partial<PromptContext> = {}
  ): Promise<ConversationResponse> {
    // Get or create session
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = this.createSession(sessionId, context);
    }

    // Classify intent
    const intent = this.intentClassifier.classify(userMessage);
    
    // Update session context
    session.context = { ...session.context, ...context, domain: intent.domain };
    session.lastActivity = new Date();

    // Add user message to session
    session.messages.push({ role: 'user', content: userMessage });

    try {
      // Generate system prompt based on domain and intent
      const systemPrompt = this.getSystemPromptForDomain(intent.domain, session.context);
      
      // Generate AI response
      const aiResponse = await this.openAI.generateResponse(
        userMessage,
        systemPrompt,
        session.messages.slice(-6) // Keep recent context
      );

      // Add AI response to session
      session.messages.push({ role: 'assistant', content: aiResponse });

      // Generate suggestions based on intent
      const suggestions = this.generateSuggestions(intent, userMessage);

      return {
        message: aiResponse,
        intent,
        suggestions,
        requiresFollowUp: this.shouldFollowUp(intent, aiResponse)
      };

    } catch (error) {
      console.error('Conversation processing error:', error);
      
      // Fallback response
      return {
        message: "I'm having trouble processing that request right now. Could you try rephrasing it?",
        intent,
        requiresFollowUp: true
      };
    }
  }

  private createSession(sessionId: string, context: Partial<PromptContext>): ConversationSession {
    const session: ConversationSession = {
      id: sessionId,
      messages: [],
      context: {
        domain: 'general',
        intent: 'search',
        ...context
      },
      startTime: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  private getSystemPromptForDomain(domain: string, context: PromptContext): string {
    switch (domain) {
      case 'nightlife':
        return PromptTemplates.getNightlifePrompt(context);
      case 'dining':
        return PromptTemplates.getDiningPrompt(context);
      case 'travel':
        return PromptTemplates.getTravelPrompt(context);
      case 'events':
        return PromptTemplates.getEventsPrompt(context);
      case 'shopping':
        return PromptTemplates.getShoppingPrompt(context);
      default:
        return PromptTemplates.getSystemPrompt('general assistance', context);
    }
  }

  private generateSuggestions(intent: ClassifiedIntent, userMessage: string): string[] {
    const suggestions: string[] = [];

    switch (intent.domain) {
      case 'nightlife':
        suggestions.push(
          "Show me rooftop bars nearby",
          "Find live music venues",
          "Looking for a chill lounge"
        );
        break;
      case 'dining':
        suggestions.push(
          "Find Italian restaurants nearby",
          "Show me brunch spots",
          "Looking for a romantic dinner"
        );
        break;
      case 'travel':
        suggestions.push(
          "Show me tourist attractions",
          "Find museums nearby",
          "What's worth visiting here?"
        );
        break;
      case 'events':
        suggestions.push(
          "Find concerts this weekend",
          "Show me comedy shows",
          "What events are happening tonight?"
        );
        break;
      case 'shopping':
        suggestions.push(
          "Find boutique stores",
          "Show me local markets",
          "Looking for unique gifts"
        );
        break;
      default:
        suggestions.push(
          "What's popular nearby?",
          "Show me something interesting",
          "Help me find something to do"
        );
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  private shouldFollowUp(intent: ClassifiedIntent, response: string): boolean {
    // Check if response asks a question
    if (response.includes('?')) return true;
    
    // Check if confidence is low
    if (intent.confidence < 0.7) return true;
    
    // Check if response mentions needing more info
    const needsInfoPhrases = [
      'more information',
      'could you specify',
      'what type',
      'where specifically',
      'when would you like'
    ];
    
    return needsInfoPhrases.some(phrase => 
      response.toLowerCase().includes(phrase)
    );
  }

  getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  // Clean up old sessions (call periodically)
  cleanupOldSessions(maxAgeHours: number = 24): void {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - maxAgeHours);

    for (const [sessionId, session] of this.sessions) {
      if (session.lastActivity < cutoff) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
