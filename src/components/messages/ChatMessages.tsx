
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Message } from '@/messages/useMessagesStore';

interface ChatMessagesProps {
  messages: Message[];
  friend: any;
  isGroupChat: boolean;
  isTyping: boolean;
}

const ChatMessages = ({ messages, friend, isGroupChat, isTyping }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Start a conversation with {friend.name.split(' ')[0]}
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.senderId === 'current-user' 
                ? 'bg-primary text-primary-foreground' 
                : isGroupChat 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                  : 'bg-secondary text-secondary-foreground'
            }`}>
              {isGroupChat && msg.senderId !== 'current-user' && (
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                  {msg.senderId === 'group' ? 'Group' : msg.senderId}
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.senderId === 'current-user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))
      )}
      
      {isTyping && (
        <div className="flex justify-start">
          <Card className="px-4 py-2 bg-secondary">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </Card>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
