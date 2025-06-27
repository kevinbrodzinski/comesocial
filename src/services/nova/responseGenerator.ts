
import { NovaResponse, NovaContext } from './types';
import { detectMultipleIntents } from './venueFilterUtils';

export const generateSmartExplanation = (message: string, venues: any[]): string => {
  const detectedIntents = detectMultipleIntents(message.toLowerCase());
  
  if (venues.length === 0) return 'No venues found matching your criteria.';
  
  const explanations: string[] = [];
  
  if (detectedIntents.includes('chill')) {
    explanations.push("I picked quieter spots with lower crowd levels for a relaxed vibe.");
  }
  
  if (detectedIntents.includes('party')) {
    explanations.push("These venues are known for high energy, music, and great crowds.");
  }
  
  if (detectedIntents.includes('unique')) {
    explanations.push("I focused on hidden gems and unique venues that offer something special.");
  }
  
  if (detectedIntents.includes('date')) {
    explanations.push("These are intimate, romantic spots perfect for a date night.");
  }
  
  if (detectedIntents.includes('food')) {
    explanations.push("All selected venues have excellent food options.");
  }
  
  if (detectedIntents.includes('music')) {
    explanations.push("These spots feature live music or great DJ sets.");
  }
  
  if (detectedIntents.includes('cheap')) {
    explanations.push("I prioritized affordable options with good value.");
  }
  
  if (detectedIntents.includes('upscale')) {
    explanations.push("These are premium venues with upscale ambiance and craft cocktails.");
  }
  
  // Fallback explanation
  if (explanations.length === 0) {
    explanations.push("These venues are highly-rated and match your location preferences.");
  }
  
  return explanations.join(' ');
};

export const classifyIntent = (message: string): NovaResponse['intent'] => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('show') || lowerMessage.includes('find') || 
      lowerMessage.includes('looking') || lowerMessage.includes('where')) {
    return 'venue_search';
  }
  
  if (lowerMessage.includes('location') || lowerMessage.includes('near')) {
    return 'location_query';
  }
  
  return 'general_chat';
};

export const generateContextualResponse = (message: string, context: NovaContext): string => {
  const responses = [
    "I'd be happy to help you find the perfect spot! What kind of vibe are you looking for tonight?",
    "Let me think about what would work best for you. Are you looking for something specific?",
    "I can definitely help with that! Tell me more about what you have in mind.",
    "Great question! I'm here to help you discover amazing nightlife options.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getFallbackResponse = (): NovaResponse => {
  return {
    message: "I'm having trouble connecting right now, but I can still help you explore some great venues!",
    venues: [
      {
        name: 'Pulsar',
        type: 'Nightclub',
        distance: '0.5 mi',
        vibe: 'Vibey',
        features: ['DJ', 'Dancing', 'Late Night'],
        crowdLevel: 85,
      }
    ],
    intent: 'venue_search',
  };
};
