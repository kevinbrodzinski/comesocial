
import { useState, useCallback } from 'react';
import { useLocationPermission } from './useLocationPermission';
import { useNovaMemory } from './useNovaMemory';
import { supabase } from '@/integrations/supabase/client';

interface NovaMessage {
  id: number;
  type: 'user' | 'ai' | 'followup';
  content: string;
  timestamp: Date;
  venues?: any[];
  explanation?: string;
  quickReplies?: string[];
  domain?: string;
}

interface UseEnhancedNovaAIReturn {
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const useEnhancedNovaAI = (
  messages: NovaMessage[],
  setMessages: (messages: NovaMessage[] | ((prev: NovaMessage[]) => NovaMessage[])) => void,
  setIsTyping: (typing: boolean) => void
): UseEnhancedNovaAIReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userLocation, locationPermission } = useLocationPermission();
  const { preferences } = useNovaMemory();

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isProcessing) return;

    setError(null);
    setIsProcessing(true);
    setIsTyping(true);

    // Add user message
    const userMessage: NovaMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Call enhanced Nova service via Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('enhanced-nova-chat', {
        body: {
          message: messageText,
          context: {
            location: userLocation,
            locationPermission,
            userMemory: {
              venueTypes: preferences.venueTypes,
              atmospherePreference: preferences.atmospherePreference,
              timePatterns: preferences.timePatterns,
              frequentAreas: preferences.frequentAreas,
            },
            conversationHistory: messages.slice(-6).map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      // Process the response
      const response = data;
      
      // Determine if this should be a follow-up or regular AI message
      const aiMessage: NovaMessage = {
        id: Date.now() + 1,
        type: response.requiresFollowUp ? 'followup' : 'ai',
        content: response.message,
        timestamp: new Date(),
        venues: response.venues,
        explanation: response.explanation,
        domain: response.domain,
        quickReplies: response.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Enhanced Nova AI Error:', err);
      setError('I encountered an issue processing your request. Please try again.');
      
      // Add error message
      const errorMessage: NovaMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, I had trouble processing that request. Please try again or ask me something else!',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  }, [messages, setMessages, setIsTyping, userLocation, locationPermission, preferences, isProcessing]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    sendMessage,
    error,
    clearError,
  };
};
