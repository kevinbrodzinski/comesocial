
import React, { useState, useRef, useEffect } from 'react';
import { Message } from './chat/types';
import ChatHeader from './chat/ChatHeader';
import WelcomeMessage from './chat/WelcomeMessage';
import ChatMessage from './chat/ChatMessage';
import FollowUpMessage from './chat/FollowUpMessage';
import TypingIndicator from './chat/TypingIndicator';
import ChatInput from './chat/ChatInput';
import PageWithScrollingHeader from './layout/PageWithScrollingHeader';
import { useEnhancedNovaAI } from '../hooks/useEnhancedNovaAI';
import { useLocationPermission } from '../hooks/useLocationPermission';
import { getFeatureFlag } from '../utils/featureFlags';

interface NovaChatProps {
  initialMessage?: string;
}

const NovaChat = ({ initialMessage }: NovaChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(!initialMessage);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { userLocation, locationPermission, requestLocation } = useLocationPermission();
  const [gpsActive, setGpsActive] = useState(!!userLocation);
  const useUnifiedScrolling = getFeatureFlag('scrolling_header_unify_v1');

  // Use the enhanced Nova AI hook
  const { sendMessage: sendAIMessage, isProcessing, error, clearError } = useEnhancedNovaAI(
    messages,
    setMessages,
    setIsTyping
  );

  const promptChips = [
    "Show me what's nearby",
    "Looking for chill vibes", 
    "Perfect date night spot",
    "Where's the live music?",
    "Find hidden gems"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (!userLocation && locationPermission !== 'denied') {
      requestLocation();
    }
  }, [userLocation, locationPermission, requestLocation]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if ((!textToSend.trim() && !selectedImage) || isProcessing) return;

    setShowWelcome(false);
    setInputValue('');
    setSelectedImage(null);
    
    await sendAIMessage(textToSend || 'I shared an image with you');
  };

  const handleChipClick = (chipText: string) => {
    handleSendMessage(chipText);
  };

  const handleQuickReplyClick = async (reply: string) => {
    await sendAIMessage(reply);
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const toggleGPS = () => {
    if (!gpsActive && !userLocation) {
      requestLocation();
    }
    setGpsActive(!gpsActive);
  };

  const header = (
    <ChatHeader gpsActive={gpsActive && !!userLocation} onToggleGPS={toggleGPS} />
  );

  const chatContent = (
    <div className="px-6 space-y-4">
      {showWelcome && (
        <WelcomeMessage 
          promptChips={promptChips}
          onChipClick={handleChipClick}
        />
      )}

      {messages.map((message) => (
        message.type === 'followup' ? (
          <FollowUpMessage
            key={message.id}
            message={message.content}
            quickReplies={message.quickReplies}
            onReplyClick={handleQuickReplyClick}
          />
        ) : (
          <ChatMessage key={message.id} message={message} />
        )
      ))}
      
      {isTyping && <TypingIndicator />}
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  if (useUnifiedScrolling) {
    return (
      <PageWithScrollingHeader header={header}>
        <div style={{ paddingBottom: '144px' }}>
          {chatContent}
        </div>
        
        <ChatInput 
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={() => handleSendMessage()}
          onImageSelect={handleImageSelect}
          disabled={isProcessing}
        />
      </PageWithScrollingHeader>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none h-16 bg-card border-b border-border">
        {header}
      </div>

      <div 
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: '144px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {chatContent}
      </div>

      <ChatInput 
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={() => handleSendMessage()}
        onImageSelect={handleImageSelect}
        disabled={isProcessing}
      />
    </div>
  );
};

export default NovaChat;
