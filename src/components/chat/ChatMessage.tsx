
import React from 'react';
import { Message } from './types';
import VenueCard from './VenueCard';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] p-4 rounded-2xl ${
          message.type === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border'
        }`}
      >
        {message.image && (
          <div className="mb-3">
            <img
              src={message.image}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        {message.venues && (
          <div className="mt-4">
            {message.venues.map((venue, index) => (
              <VenueCard key={index} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
