
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Import the enhanced Nova service logic
class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    userMessage: string,
    systemPrompt: string,
    conversationHistory: any[] = []
  ): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}

// Intent classification logic
function classifyIntent(message: string) {
  const lowerMessage = message.toLowerCase();
  
  const domainKeywords = {
    nightlife: ['bar', 'club', 'nightclub', 'lounge', 'drinks', 'cocktails', 'dancing', 'nightlife'],
    dining: ['restaurant', 'food', 'eat', 'dinner', 'lunch', 'breakfast', 'cafe', 'pizza'],
    travel: ['visit', 'tourist', 'attraction', 'sightseeing', 'museum', 'tour'],
    events: ['concert', 'show', 'festival', 'event', 'performance', 'theater'],
    shopping: ['shop', 'buy', 'store', 'mall', 'boutique', 'market']
  };

  let domain = 'general';
  let maxScore = 0;

  for (const [domainName, keywords] of Object.entries(domainKeywords)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (lowerMessage.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > maxScore) {
      maxScore = score;
      domain = domainName;
    }
  }

  const intent = lowerMessage.includes('find') || lowerMessage.includes('show') 
    ? 'search' : 'general';

  return { domain, intent, confidence: maxScore > 0 ? 0.8 : 0.5 };
}

// System prompts
function getSystemPrompt(domain: string, context: any): string {
  const basePersonality = `You are Nova, an AI assistant specialized in ${domain}. You're knowledgeable, friendly, and provide personalized recommendations. Keep responses concise but helpful.`;
  
  const locationContext = context.location 
    ? `User's location: ${context.location.lat}, ${context.location.lng}. Prioritize nearby options.`
    : 'Location not available - ask for location if needed for recommendations.';

  let domainSpecific = '';
  
  switch (domain) {
    case 'nightlife':
      domainSpecific = `
Specialization: Bars, clubs, lounges, live music venues, and nighttime entertainment.
Focus on: Atmosphere, crowd level, music type, drink specialties, and timing recommendations.`;
      break;
    case 'dining':
      domainSpecific = `
Specialization: Restaurants, cafes, and culinary experiences.
Focus on: Cuisine type, price range, ambiance, dietary restrictions, and reservation requirements.`;
      break;
    case 'travel':
      domainSpecific = `
Specialization: Tourist attractions, local experiences, and travel planning.
Focus on: Must-see spots, hidden gems, transportation options, and cultural experiences.`;
      break;
    default:
      domainSpecific = `
Specialization: General assistance and recommendations.
Focus on: Understanding user needs and providing helpful guidance.`;
  }

  return `${basePersonality}

${locationContext}

${domainSpecific}

Guidelines:
- Provide specific, actionable recommendations
- Consider user preferences and context
- If you need more information, ask clarifying questions
- Format venue suggestions with name, type, and brief description
- Always be helpful and conversational`;
}

function generateSuggestions(domain: string): string[] {
  const suggestions: Record<string, string[]> = {
    nightlife: [
      "Show me rooftop bars nearby",
      "Find live music venues",
      "Looking for a chill lounge"
    ],
    dining: [
      "Find Italian restaurants nearby",
      "Show me brunch spots",
      "Looking for a romantic dinner"
    ],
    travel: [
      "Show me tourist attractions",
      "Find museums nearby",
      "What's worth visiting here?"
    ],
    general: [
      "What's popular nearby?",
      "Show me something interesting",
      "Help me find something to do"
    ]
  };

  return suggestions[domain] || suggestions.general;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openAI = new OpenAIService(openAIApiKey);
    
    // Classify intent
    const classified = classifyIntent(message);
    
    // Generate system prompt based on domain
    const systemPrompt = getSystemPrompt(classified.domain, context);
    
    // Generate AI response
    const aiResponse = await openAI.generateResponse(
      message,
      systemPrompt,
      context.conversationHistory || []
    );

    // Generate suggestions
    const suggestions = generateSuggestions(classified.domain);

    // Determine if follow-up is needed
    const requiresFollowUp = aiResponse.includes('?') || classified.confidence < 0.7;

    const response = {
      message: aiResponse,
      intent: classified.intent,
      domain: classified.domain,
      suggestions: suggestions.slice(0, 3),
      requiresFollowUp,
      venues: [], // TODO: Integrate with venue search
      explanation: classified.domain !== 'general' 
        ? `I'm focusing on ${classified.domain} recommendations based on your request.`
        : undefined
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced Nova Chat Error:', error);
    
    return new Response(JSON.stringify({
      message: "I'm having trouble processing that request right now. Could you try rephrasing it?",
      intent: 'error',
      domain: 'general',
      requiresFollowUp: true,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
