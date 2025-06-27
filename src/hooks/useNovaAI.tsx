
import { useState, useCallback } from 'react';
import { useNovaMessageProcessor } from './useNovaMessageProcessor';
import { useNovaQuickReply } from './useNovaQuickReply';

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

interface UseNovaAIReturn {
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<void>;
  handleQuickReply: (reply: string, context?: any) => Promise<void>;
  error: string | null;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
}

export const useNovaAI = (
  messages: NovaMessage[],
  setMessages: (messages: NovaMessage[] | ((prev: NovaMessage[]) => NovaMessage[])) => void,
  setIsTyping: (typing: boolean) => void
): UseNovaAIReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const { processMessage, processVenueSearch } = useNovaMessageProcessor(
    messages,
    setMessages,
    setIsTyping
  );

  const { handleQuickReply: processQuickReply } = useNovaQuickReply(
    setMessages,
    setIsTyping,
    processVenueSearch
  );

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isProcessing) return;

    setLastUserMessage(messageText);
    setError(null);
    setIsProcessing(true);

    try {
      await processMessage(messageText);
    } catch (err) {
      console.error('Nova AI Error:', err);
      setError('I encountered an issue processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, processMessage]);

  const handleQuickReply = useCallback(async (reply: string, context?: any) => {
    if (isProcessing) return;

    setError(null);
    setIsProcessing(true);

    try {
      await processQuickReply(reply, context);
    } catch (err) {
      console.error('Nova Quick Reply Error:', err);
      setError('I encountered an issue processing your reply. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, processQuickReply]);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage) {
      // Remove the last AI message if it was an error
      setMessages(prev => {
        const filtered = [...prev];
        if (filtered[filtered.length - 1]?.type === 'ai') {
          filtered.pop();
        }
        return filtered;
      });
      
      await sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage, setMessages]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    sendMessage,
    handleQuickReply,
    error,
    clearError,
    retryLastMessage,
  };
};
