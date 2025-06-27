
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mic, Camera, Brain } from 'lucide-react';
import ChatMessage from '../chat/ChatMessage';
import ChatInput from '../chat/ChatInput';
import TypingIndicator from '../chat/TypingIndicator';
import VoiceInterface from './VoiceInterface';
import ImageAnalysis from './ImageAnalysis';
import { useEnhancedNovaAI } from '../../hooks/useEnhancedNovaAI';
import { VoiceCommand, VoiceResponse } from '../../services/ai/VoiceProcessor';
import { VisionAnalysisResult, DocumentAnalysisResult } from '../../services/ai/VisionProcessor';
import { advancedNLP } from '../../services/ai/AdvancedNLP';
import type { Message } from '../chat/types';

interface MultiModalNovaChatProps {
  initialMessage?: string;
}

const MultiModalNovaChat = ({ initialMessage }: MultiModalNovaChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage: sendAIMessage, isProcessing, error, clearError } = useEnhancedNovaAI(
    messages,
    setMessages,
    setIsTyping
  );

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

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isProcessing) return;

    setInputValue('');
    await sendAIMessage(textToSend);
  };

  const handleVoiceCommand = async (command: VoiceCommand) => {
    console.log('Voice command received:', command);
    
    // Add voice command as a user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: `🎤 ${command.command}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Process based on intent
    if (command.intent === 'navigation') {
      // Handle navigation commands
      if (command.parameters.destination === 'map') {
        window.location.href = '/#map';
      } else if (command.parameters.destination === 'friends') {
        window.location.href = '/#friends';
      }
    } else if (command.intent === 'search') {
      // Process as search query
      await sendAIMessage(command.command);
    } else {
      // Process as general query
      await sendAIMessage(command.command);
    }
  };

  const handleVoiceResponse = (response: VoiceResponse) => {
    console.log('Voice response:', response);
    
    if (response.action) {
      // Handle response actions
      switch (response.action.type) {
        case 'navigate':
          window.location.href = `/#${response.action.payload.route}`;
          break;
        case 'search':
          sendAIMessage(response.action.payload.query);
          break;
        default:
          console.log('Unhandled voice action:', response.action);
      }
    }
  };

  const handleVenueFound = async (venueInfo: VisionAnalysisResult) => {
    console.log('Venue identified:', venueInfo);
    
    // Add analysis result as a message
    const analysisMessage: Message = {
      id: Date.now(),
      type: 'ai',
      content: `📷 I can see this is ${venueInfo.venueName || 'a venue'}! ${venueInfo.description}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, analysisMessage]);

    // Generate contextual response based on the venue
    let contextualQuery = `I'm looking at ${venueInfo.venueName || 'a venue'}`;
    
    if (venueInfo.venueType) {
      contextualQuery += ` which is a ${venueInfo.venueType}`;
    }
    
    if (venueInfo.atmosphere) {
      contextualQuery += ` with a ${venueInfo.atmosphere} atmosphere`;
    }
    
    contextualQuery += '. Can you tell me more about places like this or suggest similar venues?';

    await sendAIMessage(contextualQuery);
  };

  const handleDocumentAnalyzed = async (documentInfo: DocumentAnalysisResult) => {
    console.log('Document analyzed:', documentInfo);
    
    // Add document analysis as a message
    const analysisMessage: Message = {
      id: Date.now(),
      type: 'ai',
      content: `📄 I analyzed this ${documentInfo.type}! ${documentInfo.extractedInfo.venueName ? `It's from ${documentInfo.extractedInfo.venueName}.` : ''} Here's what I found:`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, analysisMessage]);

    // Generate query based on extracted information
    let query = `I'm looking at a ${documentInfo.type}`;
    
    if (documentInfo.extractedInfo.venueName) {
      query += ` from ${documentInfo.extractedInfo.venueName}`;
    }
    
    if (documentInfo.extractedInfo.events?.length) {
      query += ` with events: ${documentInfo.extractedInfo.events.join(', ')}`;
    }
    
    query += '. Can you help me understand more about this place or find similar options?';

    await sendAIMessage(query);
  };

  const handleSimilarVenuesRequested = async (queries: string[]) => {
    console.log('Similar venues requested:', queries);
    
    // Use the first query for search
    if (queries.length > 0) {
      await sendAIMessage(`Find venues similar to: ${queries[0]}`);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Multi-Modal Nova AI</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Chat, speak, or share images with Nova's advanced AI
          </p>
        </div>

        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span>Voice</span>
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Vision</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Welcome to Multi-Modal Nova</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      I can understand text, voice commands, and images. Try asking me about venues, 
                      uploading photos of places, or speaking your questions!
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
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

              {/* Chat Input */}
              <div className="p-4 border-t">
                <ChatInput 
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSendMessage={() => handleSendMessage()}
                  disabled={isProcessing}
                />
              </div>
            </TabsContent>

            <TabsContent value="voice" className="flex-1 p-4">
              <div className="max-w-md mx-auto">
                <VoiceInterface
                  onVoiceCommand={handleVoiceCommand}
                  onVoiceResponse={handleVoiceResponse}
                  disabled={isProcessing}
                />
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Try saying:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Show me bars nearby"</li>
                    <li>• "Take me to the map"</li>
                    <li>• "Find restaurants with live music"</li>
                    <li>• "What's good for a date night?"</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vision" className="flex-1 p-4">
              <ImageAnalysis
                onVenueFound={handleVenueFound}
                onDocumentAnalyzed={handleDocumentAnalyzed}
                onSimilarVenuesRequested={handleSimilarVenuesRequested}
              />
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">What I can analyze:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Venue photos:</strong> Restaurant exteriors, bar interiors</li>
                  <li>• <strong>Menus & flyers:</strong> Extract text and pricing</li>
                  <li>• <strong>Event posters:</strong> Find event details</li>
                  <li>• <strong>Similar places:</strong> Visual similarity search</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiModalNovaChat;
