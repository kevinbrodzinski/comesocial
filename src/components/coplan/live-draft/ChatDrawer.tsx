
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Plus, Lock, Clock, MapPin, Vote, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ChatService, { type ChatMessage } from '@/services/ChatService';
import ChatParticipants from './ChatParticipants';
import ChatPlanUpdate from './ChatPlanUpdate';
import QuickActionPill from './QuickActionPill';
import { getFeatureFlag } from '@/utils/featureFlags';
import { hasIntroBeenShown, markIntroAsShown, getIntroMessage } from '@/services/chatIntro';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  draftTitle: string;
  isLocked?: boolean;
  hasStops?: boolean;
  onAddStop?: () => void;
  onToggleLock?: () => void;
}

const ChatDrawer = ({ 
  isOpen, 
  onClose, 
  draftTitle, 
  isLocked = false, 
  hasStops = false,
  onAddStop = () => {},
  onToggleLock = () => {}
}: ChatDrawerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatService = ChatService.getInstance();
  const draftId = window.location.pathname.split('/').pop() || '';
  const isPolishEnabled = getFeatureFlag('co_plan_live_draft');

  // Load messages and add intro if needed
  useEffect(() => {
    if (isOpen) {
      const existingMessages = chatService.getMessages(draftId);
      
      // Add intro message if not shown before
      if (isPolishEnabled && !hasIntroBeenShown(draftId) && existingMessages.length === 0) {
        const introMessage = chatService.createSystemMessage(draftId, getIntroMessage());
        setMessages([introMessage]);
        markIntroAsShown(draftId);
      } else {
        setMessages(existingMessages);
      }
    }
  }, [isOpen, draftId, isPolishEnabled]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    if (inputValue && !isTyping) {
      setIsTyping(true);
      chatService.setUserTyping(draftId, 'current-user', true);
    } else if (!inputValue && isTyping) {
      setIsTyping(false);
      chatService.setUserTyping(draftId, 'current-user', false);
    }
  }, [inputValue, isTyping, draftId]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    const newMessage = chatService.sendMessage(draftId, inputValue.trim());
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(false);
    chatService.setUserTyping(draftId, 'current-user', false);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = chatService.createSystemMessage(
        draftId, 
        "Thanks for your message! I'm here to help with your plan."
      );
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action: string, actionFn?: () => void) => {
    if (actionFn) {
      actionFn();
    }
    
    setIsLoading(true);
    const actionMessage = chatService.sendActionMessage(draftId, action);
    setMessages(prev => [...prev, actionMessage]);

    // Simulate action response
    setTimeout(() => {
      let responseText = '';
      switch (action) {
        case 'Add Stop':
          responseText = "What type of venue would you like to add? I can help you find restaurants, bars, or activities.";
          break;
        case 'Lock Plan':
          responseText = "Plan locked! Ready to launch when everyone's ready.";
          break;
        case 'Set Time':
          responseText = "What time should we start? I can help calculate travel times between stops.";
          break;
        case 'Location':
          responseText = "Share your current location to help coordinate meetups.";
          break;
        case 'Vote':
          responseText = "What would you like to vote on? I can create polls for venue choices or timing.";
          break;
        case 'Share':
          responseText = "I'll help you share this plan with others or export it.";
          break;
        default:
          responseText = "I'm here to help with your plan!";
      }
      
      const aiResponse = chatService.createSystemMessage(draftId, responseText);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const participants = chatService.getParticipants(draftId);
  const onlineCount = participants.filter(p => p.isOnline).length;

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.type === 'plan_update') {
      return <ChatPlanUpdate key={message.id} message={message} />;
    }

    const isSystemIntro = message.type === 'system' && message.content === getIntroMessage();

    return (
      <div
        key={message.id}
        className={`flex ${message.type === 'user' || message.type === 'action' ? 'justify-end' : 'justify-start'}`}
      >
        <div className="flex items-start space-x-2 max-w-[80%]">
          {(message.type === 'system' || (message.type === 'user' && message.senderId !== 'current-user')) && (
            <Avatar className="h-6 w-6 mt-1">
              <AvatarFallback className="text-xs">{message.senderAvatar || 'AI'}</AvatarFallback>
            </Avatar>
          )}
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'user' || message.type === 'action'
                ? 'bg-primary text-primary-foreground'
                : isSystemIntro 
                ? 'bg-muted/50 border-muted-foreground/20 border'
                : 'bg-muted'
            }`}
          >
            <p className={isSystemIntro ? 'italic text-muted-foreground' : ''}>{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isPolishEnabled) {
    // Fallback to original layout
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[70vh] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span className="truncate">Plan Chat • {draftTitle}</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={16} />
              </Button>
            </SheetTitle>
          </SheetHeader>

          {/* Participants */}
          <ChatParticipants participants={participants} />

          {/* Legacy Quick Actions Grid - keep existing code */}
          <div className="grid grid-cols-3 gap-2 p-4 border-b">
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('Add Stop', onAddStop)}>
              <Plus size={14} className="mr-1" />
              Add Stop
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('Lock Plan', onToggleLock)}>
              <Lock size={14} className="mr-1" />
              {isLocked ? 'Unlock' : 'Lock'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('Set Time')}>
              <Clock size={14} className="mr-1" />
              Time
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('Location')}>
              <MapPin size={14} className="mr-1" />
              Location
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('Vote')}>
              <Vote size={14} className="mr-1" />
              Vote
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('Share')}>
              <Share2 size={14} className="mr-1" />
              Share
            </Button>
          </div>

          {/* Chat Messages - keep existing code */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Plan chat is ready! Start collaborating with your team.
                </div>
              ) : (
                messages.map(renderMessage)
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input - keep existing code */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[70vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="truncate">Plan Chat • {draftTitle}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={16} />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* Participants Row */}
        <div className="flex items-center space-x-3 px-4 py-2 border-b">
          <div className="flex items-center space-x-1">
            {participants.slice(0, 4).map((participant) => (
              <Avatar key={participant.id} className="h-6 w-6">
                <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 4 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs">+{participants.length - 4}</span>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {onlineCount} / {participants.length} online
          </Badge>
        </div>

        {/* Quick Action Pills - Horizontal Scrollable Row */}
        <div className="px-4 py-3 border-b">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 pb-2">
              <QuickActionPill onClick={() => handleQuickAction('Add Stop', onAddStop)} disabled={isLoading}>
                <Plus size={14} className="mr-1" />
                Add
              </QuickActionPill>
              
              <QuickActionPill 
                onClick={() => handleQuickAction(isLocked ? 'Unlock Plan' : 'Lock Plan', onToggleLock)}
                disabled={isLoading || !hasStops}
                variant="host"
              >
                <Lock size={14} className="mr-1" />
                {isLocked ? 'Unlock' : 'Lock'}
              </QuickActionPill>
              
              <QuickActionPill onClick={() => handleQuickAction('Set Time')} disabled={isLoading}>
                <Clock size={14} className="mr-1" />
                Set Time
              </QuickActionPill>
              
              <QuickActionPill onClick={() => handleQuickAction('Location')} disabled={isLoading}>
                <MapPin size={14} className="mr-1" />
                Location
              </QuickActionPill>
              
              <QuickActionPill onClick={() => handleQuickAction('Vote')} disabled={isLoading}>
                <Vote size={14} className="mr-1" />
                Vote
              </QuickActionPill>
              
              <QuickActionPill 
                onClick={() => handleQuickAction('Share')} 
                disabled={isLoading}
                variant="host"
              >
                <Share2 size={14} className="mr-1" />
                Share
              </QuickActionPill>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Plan chat is ready! Start collaborating with your team.
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatDrawer;
