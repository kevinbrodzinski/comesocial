import { useCallback } from 'react';
import { useNovaMemory } from './useNovaMemory';
import { NOVA_CONFIG } from '../config/novaConfig';
import { EnhancedFollowUpManager } from '../services/nova/enhancedFollowUpManager';

interface NovaMessage {
  id: number;
  type: 'user' | 'ai' | 'followup';
  content: string;
  timestamp: Date;
  venues?: any[];
  explanation?: string;
  quickReplies?: string[];
  followUpContext?: any;
}

export const useNovaQuickReply = (
  setMessages: (messages: NovaMessage[] | ((prev: NovaMessage[]) => NovaMessage[])) => void,
  setIsTyping: (typing: boolean) => void,
  processVenueSearch: (messageText: string, additionalTags?: string[]) => Promise<any>
) => {
  const { preferences } = useNovaMemory();

  const handleQuickReply = useCallback(async (reply: string, context?: any) => {
    // Add user message for the quick reply
    const userMessage: NovaMessage = {
      id: Date.now(),
      type: 'user',
      content: reply,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      let followUpResult;

      if (context?.followUpContext) {
        // Process follow-up reply using enhanced manager
        followUpResult = EnhancedFollowUpManager.processFollowUpReply(reply, context.followUpContext);
      } else {
        // Treat as new message using enhanced manager
        followUpResult = EnhancedFollowUpManager.analyzeMessage(reply, {
          venueTypes: preferences.venueTypes,
          atmospherePreference: preferences.atmospherePreference,
          timePatterns: preferences.timePatterns,
          frequentAreas: preferences.frequentAreas,
        });
      }

      // Simulate realistic typing delay
      const delay = NOVA_CONFIG.minTypingDelay + 
        Math.random() * (NOVA_CONFIG.maxTypingDelay - NOVA_CONFIG.minTypingDelay);
      await new Promise(resolve => setTimeout(resolve, delay));

      if (followUpResult.type === 'proceed') {
        // Proceed with venue search using the enhanced tags
        const response = await processVenueSearch(
          reply, 
          followUpResult.venueFilterTags
        );

        // Create AI message with the follow-up response
        const aiMessage: NovaMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: followUpResult.message || response.message,
          timestamp: new Date(),
          venues: response.venues,
          explanation: response.explanation,
        };

        setMessages(prev => [...prev, aiMessage]);
        console.log('Enhanced quick reply processed with venues:', response.venues);
      } else if (followUpResult.type === 'clarification' || followUpResult.type === 'fallback') {
        // Show another follow-up question or fallback
        const followUpMessage: NovaMessage = {
          id: Date.now() + 1,
          type: 'followup',
          content: followUpResult.message || '',
          timestamp: new Date(),
          quickReplies: followUpResult.quickReplies,
          followUpContext: followUpResult.followUpContext,
        };

        setMessages(prev => [...prev, followUpMessage]);
        console.log('Enhanced follow-up continues:', followUpResult.message);
      }

    } catch (err) {
      console.error('Enhanced Nova Quick Reply Error:', err);
      
      // Add error message to chat
      const errorMessage: NovaMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, I had trouble processing that. Please try again!',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw err; // Re-throw for error handling in main hook
    } finally {
      setIsTyping(false);
    }
  }, [preferences, setMessages, setIsTyping, processVenueSearch]);

  return {
    handleQuickReply,
  };
};
