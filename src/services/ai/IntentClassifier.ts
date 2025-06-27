
export interface ClassifiedIntent {
  domain: 'nightlife' | 'dining' | 'travel' | 'events' | 'shopping' | 'general';
  intent: string;
  entities: Record<string, any>;
  confidence: number;
}

export class IntentClassifier {
  private domainKeywords = {
    nightlife: [
      'bar', 'club', 'nightclub', 'lounge', 'pub', 'drinks', 'cocktails', 'dancing',
      'live music', 'dj', 'party', 'nightlife', 'after hours', 'rooftop', 'speakeasy'
    ],
    dining: [
      'restaurant', 'food', 'eat', 'dinner', 'lunch', 'breakfast', 'cafe', 'pizza',
      'sushi', 'italian', 'mexican', 'chinese', 'cuisine', 'hungry', 'meal'
    ],
    travel: [
      'visit', 'tourist', 'attraction', 'sightseeing', 'museum', 'landmark',
      'tour', 'explore', 'adventure', 'vacation', 'trip', 'travel'
    ],
    events: [
      'concert', 'show', 'festival', 'event', 'performance', 'theater',
      'comedy', 'sports', 'game', 'exhibition', 'workshop', 'class'
    ],
    shopping: [
      'shop', 'buy', 'store', 'mall', 'boutique', 'market', 'purchase',
      'retail', 'clothes', 'fashion', 'accessories', 'gifts'
    ]
  };

  private intentPatterns = {
    search: ['find', 'looking for', 'show me', 'where', 'recommend', 'suggest'],
    navigate: ['how to get to', 'directions', 'route to', 'way to'],
    information: ['what is', 'tell me about', 'info about', 'details'],
    compare: ['vs', 'versus', 'compare', 'difference', 'better'],
    plan: ['plan', 'schedule', 'organize', 'arrange', 'book']
  };

  classify(message: string): ClassifiedIntent {
    const lowerMessage = message.toLowerCase();
    
    // Classify domain
    const domain = this.classifyDomain(lowerMessage);
    
    // Classify intent
    const intent = this.classifyIntent(lowerMessage);
    
    // Extract entities
    const entities = this.extractEntities(lowerMessage, domain);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(lowerMessage, domain, intent);

    return {
      domain,
      intent,
      entities,
      confidence
    };
  }

  private classifyDomain(message: string): ClassifiedIntent['domain'] {
    let maxScore = 0;
    let bestDomain: ClassifiedIntent['domain'] = 'general';

    for (const [domain, keywords] of Object.entries(this.domainKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (message.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestDomain = domain as ClassifiedIntent['domain'];
      }
    }

    return bestDomain;
  }

  private classifyIntent(message: string): string {
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return intent;
      }
    }
    
    // Default intents based on question words
    if (message.includes('where') || message.includes('find')) return 'search';
    if (message.includes('what') || message.includes('tell me')) return 'information';
    if (message.includes('how')) return 'navigate';
    
    return 'search'; // Default
  }

  private extractEntities(message: string, domain: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract time entities
    const timePatterns = [
      /tonight|today|tomorrow|this evening|this weekend/gi,
      /(\d{1,2}:\d{2}|\d{1,2}\s?(am|pm))/gi,
      /(morning|afternoon|evening|night)/gi
    ];

    timePatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) {
        entities.time = matches[0];
      }
    });

    // Extract location entities
    const locationPattern = /near|around|in|at\s+([a-zA-Z\s]+)/gi;
    const locationMatch = message.match(locationPattern);
    if (locationMatch) {
      entities.location = locationMatch[0];
    }

    // Extract mood/atmosphere entities
    const moodPatterns = [
      'chill', 'relaxed', 'quiet', 'intimate', 'romantic', 'cozy',
      'lively', 'energetic', 'vibrant', 'loud', 'party', 'upbeat',
      'trendy', 'hip', 'cool', 'classy', 'upscale', 'casual'
    ];

    moodPatterns.forEach(mood => {
      if (message.includes(mood)) {
        entities.atmosphere = mood;
      }
    });

    // Extract price entities
    const pricePatterns = ['cheap', 'affordable', 'budget', 'expensive', 'upscale', 'fancy'];
    pricePatterns.forEach(price => {
      if (message.includes(price)) {
        entities.priceRange = price;
      }
    });

    return entities;
  }

  private calculateConfidence(message: string, domain: string, intent: string): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on domain keyword matches
    const domainKeywords = this.domainKeywords[domain as keyof typeof this.domainKeywords] || [];
    const domainMatches = domainKeywords.filter(keyword => message.includes(keyword)).length;
    confidence += (domainMatches * 0.1);

    // Increase confidence based on intent pattern matches
    const intentPatterns = this.intentPatterns[intent as keyof typeof this.intentPatterns] || [];
    const intentMatches = intentPatterns.filter(pattern => message.includes(pattern)).length;
    confidence += (intentMatches * 0.15);

    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }
}

export const intentClassifier = new IntentClassifier();
