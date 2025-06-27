
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import MessageHeader from './messages/MessageHeader';
import MessageContextBar from './messages/MessageContextBar';
import MessageConversation from './messages/MessageConversation';
import MessageInput from './messages/MessageInput';
import ConversationStarters from './messages/ConversationStarters';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  friend: any | null;
  initialMessage?: string;
}

const MessageModal = ({ isOpen, onClose, friend, initialMessage }: MessageModalProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: 'me' | 'friend'; timestamp: string }>>([]);
  const { toast } = useToast();

  // Add initial ping message when component opens
  useEffect(() => {
    if (isOpen && initialMessage) {
      const pingMessage = {
        id: Date.now(),
        text: initialMessage,
        sender: 'me' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([pingMessage]);
    } else if (isOpen && !initialMessage) {
      setMessages([]);
    }
  }, [isOpen, initialMessage]);

  if (!isOpen || !friend) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate friend response
    setTimeout(() => {
      const responses = [
        "Hey! Yeah it's pretty cool here 😎",
        "Absolutely! Come through 🎉",
        "The energy is amazing tonight!",
        "For sure, we're just getting started"
      ];
      
      const response = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'friend' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, response]);
    }, 1500);

    toast({
      title: "Message sent!",
      description: `Your message was delivered to ${friend.name}`,
    });
  };

  const handleQuickReply = (starterText: string) => {
    setMessage(starterText);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <MessageHeader friend={friend} onClose={onClose} />

        {/* Context Bar */}
        <MessageContextBar friend={friend} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
          {messages.length === 0 ? (
            <ConversationStarters friend={friend} onQuickReply={handleQuickReply} />
          ) : (
            <MessageConversation messages={messages} />
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessageModal;
