
import NotificationService from '../NotificationService';
import { useMessagesStore } from '@/messages/useMessagesStore';

interface SendMapMessageParams {
  recipients: Array<{ id: string; name: string; avatar?: string }>;
  text: string;
  pinId?: string;
  venue?: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
}

export const sendMapMessage = ({ recipients, text, pinId, venue }: SendMapMessageParams): string => {
  const notificationService = NotificationService.getInstance();
  
  // For group messages on map, create a single thread for all recipients
  if (recipients.length > 1) {
    const threadId = pinId ? `map-${pinId}` : `map-group-${Date.now()}`;
    
    // Create or update the thread in the store
    useMessagesStore.getState().upsertThread({
      id: threadId,
      type: 'message',
      threadType: 'map-group',
      context: 'map',
      friend: {
        id: 'group',
        name: venue?.name || 'Map Group Chat',
        avatar: '📍'
      },
      lastMessage: text,
      venue,
      timestamp: new Date(),
      unread: false, // Sender's thread is not unread for them
      status: 'delivered',
      messages: [],
      meta: {
        pinId,
        coordinates: venue?.coordinates
      },
      participants: recipients
    });

    // Add the message to the thread
    const messageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    useMessagesStore.getState().addMessageToThread(threadId, {
      id: messageId,
      senderId: 'current-user',
      recipientId: 'group',
      content: text,
      type: 'message',
      timestamp: new Date(),
      status: 'delivered'
    });

    return messageId;
  }

  // For single recipient, use existing direct message logic but with map context
  const recipient = recipients[0];
  const threadId = pinId ? `map-direct-${pinId}-${recipient.id}` : `map-direct-${recipient.id}`;
  
  useMessagesStore.getState().upsertThread({
    id: threadId,
    type: 'message',
    threadType: 'direct',
    context: 'map',
    friend: recipient,
    lastMessage: text,
    venue,
    timestamp: new Date(),
    unread: false,
    status: 'delivered',
    messages: [],
    meta: {
      pinId,
      coordinates: venue?.coordinates
    }
  });

  const messageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  useMessagesStore.getState().addMessageToThread(threadId, {
    id: messageId,
    senderId: 'current-user',
    recipientId: recipient.id,
    content: text,
    type: 'message',
    timestamp: new Date(),
    status: 'delivered'
  });

  return messageId;
};
