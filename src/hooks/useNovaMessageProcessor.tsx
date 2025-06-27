import { useState, useCallback } from 'react';
import { novaApi } from '../services/novaApi';
import { useLocationPermission } from './useLocationPermission';
import { useNovaMemory } from './useNovaMemory';
import { NOVA_CONFIG } from '../config/novaConfig';
import { detectMultipleIntents } from '../services/nova/venueFilterUtils';
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

export const useNovaMessageProcessor = (
  messages: NovaMessage[],
  setMessages: (messages: NovaMessage[] | ((prev: NovaMessage[]) => NovaMessage[])) => void,
  setIsTyping: (typing: boolean) => void
) => {
  const { userLocation, locationPermission } = useLocationPermission();
  const { preferences, recordSearch, recordVenueInteraction } = useNovaMemory();

  const processVenueSearch = async (
    messageText: string, 
    additionalTags: string[] = []
  ) => {
    // Build enhanced context with memory data
    const context = {
      location: userLocation,
      conversationHistory: messages.slice(-NOVA_CONFIG.maxConversationHistory),
      time: new Date().toLocaleTimeString(),
      locationPermission,
      preferences: [], // Legacy field
      userMemory: {
        venueTypes: preferences.venueTypes,
        atmospherePreference: preferences.atmospherePreference,
        timePatterns: preferences.timePatterns,
        frequentAreas: preferences.frequentAreas,
      },
    };

    console.log('Nova processing venue search with enhanced follow-up:', messageText);
    console.log('Additional filter tags:', additionalTags);

    // Process with Nova API (now with memory-enhanced context and follow-up tags)
    const response = await novaApi.processMessage(messageText, context);

    // Record venue interactions if venues were returned
    if (response.venues && response.venues.length > 0) {
      const venueTypes = response.venues.map(v => v.type || 'unknown');
      venueTypes.forEach(type => {
        recordVenueInteraction(type, `search: ${messageText}`);
      });
    }

    return response;
  };

  const processMessage = useCallback(async (messageText: string) => {
    // Record the search in memory
    const intents = detectMultipleIntents(messageText);
    recordSearch(messageText, intents);

    // Add user message
    const userMessage: NovaMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Use enhanced follow-up manager
      const followUpResult = EnhancedFollowUpManager.analyzeMessage(
        messageText, 
        {
          venueTypes: preferences.venueTypes,
          atmospherePreference: preferences.atmospherePreference,
          timePatterns: preferences.timePatterns,
          frequentAreas: preferences.frequentAreas,
        }
      );

      // Simulate realistic typing delay
      const delay = NOVA_CONFIG.minTypingDelay + 
        Math.random() * (NOVA_CONFIG.maxTypingDelay - NOVA_CONFIG.minTypingDelay);
      await new Promise(resolve => setTimeout(resolve, delay));

      if (followUpResult.type === 'clarification') {
        // Show follow-up question
        const followUpMessage: NovaMessage = {
          id: Date.now() + 1,
          type: 'followup',
          content: followUpResult.message || '',
          timestamp: new Date(),
          quickReplies: followUpResult.quickReplies,
          followUpContext: followUpResult.followUpContext,
        };

        setMessages(prev => [...prev, followUpMessage]);
        console.log('Enhanced follow-up question:', followUpResult.message);
      } else if (followUpResult.type === 'fallback') {
        // Show fallback with suggestions
        const fallbackMessage: NovaMessage = {
          id: Date.now() + 1,
          type: 'followup',
          content: followUpResult.message || '',
          timestamp: new Date(),
          quickReplies: followUpResult.quickReplies,
          followUpContext: followUpResult.followUpContext,
        };

        setMessages(prev => [...prev, fallbackMessage]);
        console.log('Enhanced fallback suggestion:', followUpResult.message);
      } else {
        // Proceed with venue search
        const response = await processVenueSearch(
          messageText, 
          followUpResult.venueFilterTags
        );

        // Create AI message with enhanced data
        const aiMessage: NovaMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.message,
          timestamp: new Date(),
          venues: response.venues,
          explanation: response.explanation,
        };

        setMessages(prev => [...prev, aiMessage]);

        // Log successful venue search for debugging
        if (response.venues && response.venues.length > 0) {
          console.log('Enhanced venue search results:', response.venues);
          console.log('Enhanced explanation:', response.explanation);
        }
      }

    } catch (err) {
      console.error('Enhanced Nova AI Error:', err);
      
      // Add error message to chat
      const errorMessage: NovaMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, I had trouble processing that request. Please try again or ask me something else!',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw err; // Re-throw for error handling in main hook
    } finally {
      setIsTyping(false);
    }
  }, [messages, setMessages, setIsTyping, userLocation, locationPermission, preferences, recordSearch, recordVenueInteraction]);

  return {
    processMessage,
    processVenueSearch,
  };
};
