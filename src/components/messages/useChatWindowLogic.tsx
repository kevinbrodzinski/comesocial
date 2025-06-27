
import { useState, useEffect } from 'react';
import { useMessagesStore, Message } from '@/messages/useMessagesStore';
import NotificationService from '@/services/NotificationService';

export const useChatWindowLogic = (isOpen: boolean, friend: any, threadId?: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isLocationShared, setIsLocationShared] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasActivePlans, setHasActivePlans] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const notificationService = NotificationService.getInstance();
  const { getThreadById, addMessageToThread, markRead, upsertThread } = useMessagesStore();
  
  const thread = threadId ? getThreadById(threadId) : null;
  const messages = thread?.messages || [];
  
  const isGroupChat = threadId && (threadId.startsWith('map-group') || threadId.startsWith('group_') || threadId.startsWith('plan_'));
  const participantCount = thread?.participants?.length || 0;

  // Initialize thread if it doesn't exist but we have friend data
  useEffect(() => {
    if (isOpen && friend && threadId && !thread) {
      upsertThread({
        id: threadId,
        type: 'message',
        threadType: isGroupChat ? 'group' : 'direct',
        context: 'direct',
        friend: {
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar
        },
        lastMessage: '',
        timestamp: new Date(),
        unread: false,
        status: 'delivered',
        messages: [],
        participants: isGroupChat ? thread?.participants : undefined
      });
    }
  }, [isOpen, friend, threadId, thread, isGroupChat, upsertThread]);

  // Load existing messages from NotificationService when opening
  useEffect(() => {
    if (isOpen && threadId && !thread?.messages?.length) {
      const existingThreads = notificationService.getMessageThreads();
      const existingThread = existingThreads.find(t => t.id === threadId);
      
      if (existingThread && existingThread.messages?.length > 0) {
        const convertedMessages: Message[] = existingThread.messages.map(msg => ({
          id: msg.id,
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          content: msg.content,
          type: msg.type,
          timestamp: msg.timestamp,
          status: msg.status
        }));
        
        upsertThread({
          id: threadId,
          messages: convertedMessages,
          lastMessage: existingThread.lastMessage,
          timestamp: existingThread.timestamp
        });
      }
    }
  }, [isOpen, threadId, thread?.messages?.length, notificationService, upsertThread]);

  useEffect(() => {
    if (isOpen && friend && threadId) {
      markRead(threadId);
      notificationService.markThreadAsRead(threadId);
    }
  }, [isOpen, friend, threadId, markRead, notificationService]);

  const getChatType = (): 'direct' | 'group' | 'plan-group' => {
    if (!threadId) return 'direct';
    
    if (threadId.startsWith('plan_') || thread?.context === 'plan') {
      return 'plan-group';
    }
    
    if (isGroupChat) {
      return 'group';
    }
    
    return 'direct';
  };

  const handleSendMessage = (messageContent: string) => {
    if (!messageContent.trim() || !threadId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      recipientId: friend.id.toString(),
      content: messageContent,
      type: 'message',
      timestamp: new Date(),
      status: 'sent'
    };

    addMessageToThread(threadId, newMessage);
    
    notificationService.sendMessage(
      friend.id.toString(),
      friend.name,
      messageContent
    );

    // Simulate friend typing and response
    setTimeout(() => setIsTyping(true), 500);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Hey! Thanks for reaching out 😊",
        "Absolutely! Sounds like a plan",
        "The vibes here are amazing tonight!",
        "For sure, let's make it happen",
        "Just saw your message - yes!"
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: friend.id.toString(),
        recipientId: 'current-user',
        content: responses[Math.floor(Math.random() * responses.length)],
        type: 'message',
        timestamp: new Date(),
        status: 'delivered'
      };
      
      addMessageToThread(threadId, response);
      
      notificationService.receiveMessage(
        friend.id.toString(),
        friend.name,
        response.content
      );
    }, 2000);
  };

  return {
    thread,
    messages,
    isGroupChat,
    participantCount,
    isTyping,
    isLocationShared,
    isMuted,
    hasActivePlans,
    isSearchModalOpen,
    setIsSearchModalOpen,
    setIsMuted,
    getChatType,
    handleSendMessage
  };
};
