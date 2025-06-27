
import React, { useState } from 'react';
import EnhancedMessageInput from './EnhancedMessageInput';
import { SmartReference } from '@/types/smartLinking';

interface ChatMessageInputProps {
  onSendMessage: (message: string, smartReferences?: SmartReference[]) => void;
  contextType?: 'general' | 'group-chat' | 'plan-thread' | 'direct-message';
  contextId?: string | number;
  participantIds?: number[];
}

const ChatMessageInput = ({ 
  onSendMessage, 
  contextType = 'general',
  contextId,
  participantIds = []
}: ChatMessageInputProps) => {
  const [message, setMessage] = useState('');
  const [smartReferences, setSmartReferences] = useState<SmartReference[]>([]);

  const handleMessageChange = (newMessage: string, newSmartRefs?: SmartReference[]) => {
    setMessage(newMessage);
    if (newSmartRefs) {
      setSmartReferences(newSmartRefs);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message, smartReferences);
    setMessage('');
    setSmartReferences([]);
  };

  return (
    <div className="p-4 border-t border-border flex-shrink-0">
      <EnhancedMessageInput
        message={message}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
        placeholder="Type a message..."
        className="hover:scale-105 transition-transform"
        contextType={contextType}
        contextId={contextId}
        participantIds={participantIds}
      />
    </div>
  );
};

export default ChatMessageInput;
