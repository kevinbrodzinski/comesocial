
import React, { useState } from 'react';
import EnhancedMessageInput from './EnhancedMessageInput';
import { SmartReference } from '@/types/smartLinking';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  contextType?: 'general' | 'group-chat' | 'plan-thread' | 'direct-message';
  contextId?: string | number;
  participantIds?: number[];
}

const MessageInput = ({ 
  message, 
  onMessageChange, 
  onSendMessage,
  contextType = 'general',
  contextId,
  participantIds = []
}: MessageInputProps) => {
  const [smartReferences, setSmartReferences] = useState<SmartReference[]>([]);

  const handleMessageChange = (newMessage: string, newSmartRefs?: SmartReference[]) => {
    onMessageChange(newMessage);
    if (newSmartRefs) {
      setSmartReferences(newSmartRefs);
    }
  };

  const handleSendMessage = () => {
    // Here you would normally save the smart references to the message metadata
    console.log('Sending message with smart references:', smartReferences);
    onSendMessage();
    setSmartReferences([]);
  };

  return (
    <div className="p-4 border-t border-border">
      <EnhancedMessageInput
        message={message}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
        placeholder="Type a message..."
        contextType={contextType}
        contextId={contextId}
        participantIds={participantIds}
      />
    </div>
  );
};

export default MessageInput;
