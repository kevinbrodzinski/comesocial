
import React from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'friend';
  timestamp: string;
}

interface MessageConversationProps {
  messages: Message[];
}

const MessageConversation = ({ messages }: MessageConversationProps) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      // Try to parse the timestamp and format it safely
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.warn('Invalid timestamp:', timestamp);
      return '';
    }
  };

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
            msg.sender === 'me' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}>
            <p className="text-sm">{msg.text}</p>
            {msg.timestamp && (
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {formatTimestamp(msg.timestamp)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageConversation;
