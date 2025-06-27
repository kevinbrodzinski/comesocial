import { create } from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'ping' | 'message' | 'plan';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface MessageThread {
  id: string;
  type: 'ping' | 'message' | 'plan';
  threadType: 'direct' | 'group' | 'map-group';
  context: 'direct' | 'plan' | 'map';
  friend: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  venue?: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  timestamp: Date;
  unread: boolean;
  status: 'sent' | 'delivered' | 'read';
  messages: Message[];
  isPinned?: boolean;
  isMuted?: boolean;
  isActiveAtVenue?: boolean;
  participants?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  meta?: {
    pinId?: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface MessagesStore {
  threads: MessageThread[];
  upsertThread: (thread: Partial<MessageThread> & { id: string }) => void;
  markRead: (threadId: string) => void;
  totalUnread: () => number;
  getThreadById: (threadId: string) => MessageThread | undefined;
  addMessageToThread: (threadId: string, message: Message) => void;
  togglePin: (threadId: string) => void;
  toggleMute: (threadId: string) => void;
  updateThreadSettings: (threadId: string, settings: { isPinned?: boolean; isMuted?: boolean }) => void;
}

// Helper function to ensure valid timestamp
const ensureValidTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) {
    return isNaN(timestamp.getTime()) ? new Date() : timestamp;
  }
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  return new Date();
};

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  threads: [],
  
  upsertThread: (threadData) => {
    set((state) => {
      const existingIndex = state.threads.findIndex(t => t.id === threadData.id);
      const newThread: MessageThread = {
        type: 'message',
        threadType: 'direct',
        context: 'direct',
        friend: { id: '', name: '' },
        lastMessage: '',
        unread: false,
        status: 'delivered',
        messages: [],
        ...threadData,
        timestamp: ensureValidTimestamp(threadData.timestamp || new Date())
      };
      
      if (existingIndex >= 0) {
        const updatedThreads = [...state.threads];
        updatedThreads[existingIndex] = { 
          ...updatedThreads[existingIndex], 
          ...newThread,
          timestamp: ensureValidTimestamp(newThread.timestamp)
        };
        return { threads: updatedThreads };
      } else {
        return { threads: [...state.threads, newThread] };
      }
    });
  },
  
  markRead: (threadId) => {
    set((state) => ({
      threads: state.threads.map(thread =>
        thread.id === threadId
          ? { ...thread, unread: false, status: 'read' as const }
          : thread
      )
    }));
  },
  
  totalUnread: () => {
    const state = get();
    return state.threads.filter(thread => thread.unread).length;
  },
  
  getThreadById: (threadId) => {
    const state = get();
    return state.threads.find(thread => thread.id === threadId);
  },
  
  addMessageToThread: (threadId, message) => {
    set((state) => ({
      threads: state.threads.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, message],
              lastMessage: message.content,
              timestamp: ensureValidTimestamp(message.timestamp)
            }
          : thread
      )
    }));
  },
  
  togglePin: (threadId) => {
    set((state) => ({
      threads: state.threads.map(thread =>
        thread.id === threadId
          ? { ...thread, isPinned: !thread.isPinned }
          : thread
      )
    }));
  },
  
  toggleMute: (threadId) => {
    set((state) => ({
      threads: state.threads.map(thread =>
        thread.id === threadId
          ? { ...thread, isMuted: !thread.isMuted }
          : thread
      )
    }));
  },
  
  updateThreadSettings: (threadId, settings) => {
    set((state) => ({
      threads: state.threads.map(thread =>
        thread.id === threadId
          ? { ...thread, ...settings }
          : thread
      )
    }));
  }
}));
