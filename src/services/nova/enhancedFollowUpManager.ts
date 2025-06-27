
import { enhancedFollowUpTrees, FollowUpNode, FollowUpBranch } from './enhancedFollowUpTrees';
import { detectMultipleIntents } from './venueFilterUtils';
import { normalizeKey, findBestMatch } from './keyNormalization';
import { VenueTag } from '../../hooks/notifications/types';

export interface EnhancedFollowUpResult {
  type: 'clarification' | 'proceed' | 'fallback' | 'none';
  message?: string;
  quickReplies?: string[];
  venueFilterTags?: VenueTag[];
  followUpContext?: {
    currentNode: FollowUpNode;
    userIntent: string;
  };
}

export class EnhancedFollowUpManager {
  /**
   * Analyze message and determine if follow-up is needed
   */
  static analyzeMessage(message: string, userMemory?: any): EnhancedFollowUpResult {
    const lowerMessage = message.toLowerCase();
    
    // Check if message matches any follow-up tree intents
    const matchedIntent = this.findMatchingIntent(lowerMessage);
    
    if (matchedIntent) {
      const node = enhancedFollowUpTrees[matchedIntent];
      
      // Personalize the question based on user memory
      const personalizedQuestion = this.personalizeQuestion(
        node.clarifyingQuestions[0], 
        userMemory
      );
      
      // Extract labels for quick replies
      const quickReplies = node.branches.map(branch => branch.label);
      
      return {
        type: 'clarification',
        message: personalizedQuestion,
        quickReplies,
        followUpContext: {
          currentNode: node,
          userIntent: matchedIntent
        }
      };
    }
    
    // Check if message is too vague
    if (this.isVagueRequest(lowerMessage)) {
      return {
        type: 'clarification',
        message: "I'd love to help! What kind of vibe are you going for tonight?",
        quickReplies: ["Fun night", "Chill vibes", "Date night", "Surprise me"]
      };
    }
    
    return { type: 'none' };
  }

  /**
   * Process user reply to follow-up question with enhanced matching
   */
  static processFollowUpReply(
    userReply: string, 
    followUpContext: { currentNode: FollowUpNode; userIntent: string }
  ): EnhancedFollowUpResult {
    const { currentNode } = followUpContext;
    
    // Get all branch keys for matching
    const branchKeys = currentNode.branches.map(b => b.key);
    const branchLabels = currentNode.branches.map(b => b.label);
    
    // Try to find best match using enhanced key normalization
    const matchedKey = findBestMatch(userReply, [...branchKeys, ...branchLabels]);
    
    if (matchedKey) {
      // Find the branch by key or label
      const matchedBranch = currentNode.branches.find(b => 
        b.key === matchedKey || b.label === matchedKey ||
        normalizeKey(b.key) === normalizeKey(matchedKey) ||
        normalizeKey(b.label) === normalizeKey(matchedKey)
      );
      
      if (matchedBranch) {
        // Check if there's a next step
        if (matchedBranch.nextStep) {
          const nextQuickReplies = matchedBranch.nextStep.branches.map(b => b.label);
          
          return {
            type: 'clarification',
            message: matchedBranch.nextStep.clarifyingQuestions[0],
            quickReplies: nextQuickReplies,
            followUpContext: {
              currentNode: matchedBranch.nextStep,
              userIntent: matchedBranch.nextStep.userIntent
            }
          };
        }
        
        return {
          type: 'proceed',
          message: matchedBranch.aiResponse,
          venueFilterTags: matchedBranch.venueFilterTags || [],
        };
      }
    }
    
    // Fallback with suggestions
    return {
      type: 'fallback',
      message: "I'm not sure I caught that. Could you try one of these options?",
      quickReplies: currentNode.branches.map(b => b.label)
    };
  }

  /**
   * Find matching intent with improved keyword detection
   */
  private static findMatchingIntent(message: string): string | null {
    const intentKeys = Object.keys(enhancedFollowUpTrees);
    
    // First try exact phrase match
    for (const intent of intentKeys) {
      if (message.includes(intent.toLowerCase())) {
        return intent;
      }
    }
    
    // Then try keyword matching
    for (const intent of intentKeys) {
      const keywords = this.getIntentKeywords(intent);
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }
    
    return null;
  }

  /**
   * Enhanced keyword mapping
   */
  private static getIntentKeywords(intent: string): string[] {
    const keywordMap: Record<string, string[]> = {
      "fun night": ["fun", "party", "exciting", "wild", "energy"],
      "date night": ["date", "romantic", "couple", "intimate", "together"],
      "chill vibes": ["chill", "relax", "calm", "mellow", "low-key", "laid back"],
      "surprise me": ["surprise", "random", "anything", "whatever", "explore"]
    };
    
    return keywordMap[intent] || [];
  }

  /**
   * Check for vague requests
   */
  private static isVagueRequest(message: string): boolean {
    const vaguePatterns = [
      /^(hi|hey|hello)$/,
      /^(what's up|sup)$/,
      /^(help|help me)$/,
      /^(i don't know|dunno)$/,
      /^(anything|whatever)$/,
      /^(go out|night out)$/
    ];
    
    return vaguePatterns.some(pattern => pattern.test(message.trim()));
  }

  /**
   * Personalize questions based on user memory
   */
  private static personalizeQuestion(question: string, userMemory?: any): string {
    if (!userMemory) return question;
    
    if (userMemory.venueTypes?.length > 0) {
      const preferredType = userMemory.venueTypes[0];
      return `${question} (I noticed you usually enjoy ${preferredType} places)`;
    }
    
    if (userMemory.atmospherePreference?.length > 0) {
      const preferredAtmosphere = userMemory.atmospherePreference[0];
      return `${question} Based on your ${preferredAtmosphere} style, I have some great ideas.`;
    }
    
    return question;
  }
}
