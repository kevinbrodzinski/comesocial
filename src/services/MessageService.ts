import { MessageThread, Message } from '../types/messaging';

export class MessageService {
  private threads: Map<string, MessageThread> = new Map();
  private listeners: Set<(threads: MessageThread[]) => void> = new Set();

  constructor() {
    this.initializeEnhancedMockData();
  }

  private initializeEnhancedMockData() {
    const now = new Date();
    
    // Enhanced Plan Threads
    const planThreads = [
      {
        id: 'plan_1',
        type: 'plan' as const,
        threadType: 'group' as const,
        context: 'plan' as const,
        friend: { id: 'group_1', name: 'Friday Night Crawl', avatar: '🎉' },
        lastMessage: 'Meet at Sky Lounge at 9 PM!',
        venue: { name: 'Sky Lounge', address: '123 Downtown St' },
        timestamp: new Date(now.getTime() - 30 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: [],
        planId: 1,
        planName: 'Friday Night Crawl',
        participants: [
          { id: '1', name: 'Alex', avatar: 'A' },
          { id: '2', name: 'Sarah', avatar: 'S' },
          { id: '3', name: 'Mike', avatar: 'M' }
        ],
        planStatus: 'active' as const,
        planTime: '9:00 PM'
      },
      {
        id: 'plan_2',
        type: 'plan' as const,
        threadType: 'group' as const,
        context: 'plan' as const,
        friend: { id: 'group_2', name: 'Rooftop Vibes', avatar: '🌃' },
        lastMessage: 'Should we extend this to midnight?',
        venue: { name: 'Skybar', address: '456 High St' },
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: [],
        planId: 2,
        planName: 'Rooftop Vibes',
        participants: [
          { id: '4', name: 'Emma', avatar: 'E' },
          { id: '5', name: 'James', avatar: 'J' }
        ],
        planStatus: 'upcoming' as const,
        planTime: '8:00 PM'
      },
      {
        id: 'plan_3',
        type: 'plan' as const,
        threadType: 'group' as const,
        context: 'plan' as const,
        friend: { id: 'group_3', name: 'Cocktail Tasting', avatar: '🍸' },
        lastMessage: 'The mixologist here is amazing!',
        venue: { name: 'The Alchemist', address: '789 Craft Ave' },
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: [],
        planId: 3,
        planName: 'Cocktail Tasting',
        participants: [
          { id: '6', name: 'Lisa', avatar: 'L' },
          { id: '7', name: 'Tom', avatar: 'T' },
          { id: '8', name: 'Nina', avatar: 'N' }
        ],
        planStatus: 'active' as const,
        planTime: '7:30 PM'
      }
    ];

    // Enhanced Direct Message Threads
    const messageThreads = [
      {
        id: 'msg_1',
        type: 'message' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_1', name: 'Sarah Chen', avatar: 'SC' },
        lastMessage: 'Just checked in at Blue Note! Come join 🎶',
        venue: { name: 'Blue Note Jazz Club', address: '131 W 3rd St' },
        timestamp: new Date(now.getTime() - 15 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: [],
        isActiveAtVenue: true
      },
      {
        id: 'msg_2',
        type: 'message' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_2', name: 'Marcus Rodriguez', avatar: 'MR' },
        lastMessage: 'Thanks for the rec! This place is perfect',
        timestamp: new Date(now.getTime() - 45 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: []
      },
      {
        id: 'msg_3',
        type: 'message' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_3', name: 'Zoe Kim', avatar: 'ZK' },
        lastMessage: 'Are you free tomorrow night?',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: []
      },
      {
        id: 'msg_4',
        type: 'message' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_4', name: 'David Park', avatar: 'DP' },
        lastMessage: 'The sushi here is incredible! 🍣',
        venue: { name: 'Nobu Downtown', address: '195 Broadway' },
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: [],
        isActiveAtVenue: true
      },
      {
        id: 'msg_5',
        type: 'message' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_5', name: 'Ashley Thompson', avatar: 'AT' },
        lastMessage: 'Let\'s plan something for the weekend!',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: []
      }
    ];

    // Enhanced Group Threads
    const groupThreads = [
      {
        id: 'group_1',
        type: 'message' as const,
        threadType: 'group' as const,
        context: 'direct' as const,
        friend: { id: 'venue_group_1', name: 'The Rooftop Squad', avatar: '🏙️' },
        lastMessage: 'Who\'s still here? Let\'s order another round!',
        venue: { name: 'Top of the Rock Bar', address: '30 Rockefeller Plaza' },
        timestamp: new Date(now.getTime() - 20 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: [],
        participants: [
          { id: '1', name: 'Alex', avatar: 'A' },
          { id: '2', name: 'Sarah', avatar: 'S' },
          { id: '3', name: 'Mike', avatar: 'M' },
          { id: '4', name: 'Emma', avatar: 'E' }
        ]
      },
      {
        id: 'group_2',
        type: 'message' as const,
        threadType: 'map-group' as const,
        context: 'map' as const,
        friend: { id: 'venue_group_2', name: 'Speakeasy Explorers', avatar: '🕵️' },
        lastMessage: 'Found the secret entrance! 🤫',
        venue: { name: 'PDT (Please Don\'t Tell)', address: '113 St Marks Pl' },
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: [],
        participants: [
          { id: '6', name: 'Lisa', avatar: 'L' },
          { id: '7', name: 'Tom', avatar: 'T' }
        ]
      },
      {
        id: 'group_3',
        type: 'message' as const,
        threadType: 'group' as const,
        context: 'direct' as const,
        friend: { id: 'venue_group_3', name: 'Wine Wednesday Crew', avatar: '🍷' },
        lastMessage: 'The sommelier just recommended an amazing Pinot!',
        venue: { name: 'Eleven Madison Park', address: '11 Madison Ave' },
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: [],
        participants: [
          { id: '8', name: 'Nina', avatar: 'N' },
          { id: '9', name: 'Chris', avatar: 'C' },
          { id: '10', name: 'Rachel', avatar: 'R' }
        ]
      }
    ];

    // Enhanced Ping Threads
    const pingThreads = [
      {
        id: 'ping_1',
        type: 'ping' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_6', name: 'Jordan Williams', avatar: 'JW' },
        lastMessage: '📍 I\'m at Central Park! Beautiful day for a walk',
        venue: { name: 'Central Park', address: 'Central Park, NY' },
        timestamp: new Date(now.getTime() - 10 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: []
      },
      {
        id: 'ping_2',
        type: 'ping' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_7', name: 'Maya Patel', avatar: 'MP' },
        lastMessage: '📍 Coffee run at Blue Bottle! Want anything?',
        venue: { name: 'Blue Bottle Coffee', address: '450 W 15th St' },
        timestamp: new Date(now.getTime() - 25 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: []
      },
      {
        id: 'ping_3',
        type: 'ping' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_8', name: 'Tyler Brooks', avatar: 'TB' },
        lastMessage: '📍 Grabbing dinner at Joe\'s Pizza. Classic NY slice!',
        venue: { name: 'Joe\'s Pizza', address: '7 Carmine St' },
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        unread: true,
        status: 'delivered' as const,
        messages: []
      },
      {
        id: 'ping_4',
        type: 'ping' as const,
        threadType: 'direct' as const,
        context: 'direct' as const,
        friend: { id: 'user_9', name: 'Samantha Lee', avatar: 'SL' },
        lastMessage: '📍 Shopping at SoHo! Found the cutest boutique 🛍️',
        venue: { name: 'SoHo District', address: 'SoHo, Manhattan, NY' },
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        unread: false,
        status: 'read' as const,
        messages: []
      }
    ];

    // Store all threads
    [...planThreads, ...messageThreads, ...groupThreads, ...pingThreads].forEach(thread => {
      this.threads.set(thread.id, thread);
    });

    this.notifyListeners();
  }

  subscribeToMessages(listener: (threads: MessageThread[]) => void) {
    this.listeners.add(listener);
    listener(this.getMessageThreads());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const threads = this.getMessageThreads();
    this.listeners.forEach(listener => listener(threads));
  }

  getMessageThreads(): MessageThread[] {
    return Array.from(this.threads.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Search functionality
  searchThreads(query: string): MessageThread[] {
    if (!query.trim()) return this.getMessageThreads();
    
    const searchTerm = query.toLowerCase();
    return this.getMessageThreads().filter(thread => {
      // Search by friend/plan name
      if (thread.friend.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search by venue name
      if (thread.venue?.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search by last message content
      if (thread.lastMessage.toLowerCase().includes(searchTerm)) return true;
      
      // Search by participants for group chats
      if (thread.participants?.some(p => p.name.toLowerCase().includes(searchTerm))) return true;
      
      return false;
    });
  }

  sendMessage(
    recipientId: string, 
    recipientName: string, 
    content: string, 
    type: 'ping' | 'message' | 'plan' = 'message',
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } },
    planId?: number
  ): string {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const threadId = `thread_${recipientId}`;
    
    const existingThread = this.threads.get(threadId);
    if (existingThread) {
      existingThread.lastMessage = content;
      existingThread.timestamp = new Date();
      existingThread.unread = false;
      if (venue) existingThread.venue = venue;
    } else {
      const newThread: MessageThread = {
        id: threadId,
        type: type,
        threadType: 'direct',
        context: 'direct',
        friend: { id: recipientId, name: recipientName },
        lastMessage: content,
        venue,
        timestamp: new Date(),
        unread: false,
        status: 'sent',
        messages: [],
        planId
      };
      this.threads.set(threadId, newThread);
    }
    
    this.notifyListeners();
    return messageId;
  }

  receiveMessage(
    senderId: string,
    senderName: string,
    content: string,
    type: 'ping' | 'message' | 'plan' = 'message',
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } },
    planId?: number
  ): string {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const threadId = `thread_${senderId}`;
    
    const existingThread = this.threads.get(threadId);
    if (existingThread) {
      existingThread.lastMessage = content;
      existingThread.timestamp = new Date();
      existingThread.unread = true;
      if (venue) existingThread.venue = venue;
    } else {
      const newThread: MessageThread = {
        id: threadId,
        type: type,
        threadType: 'direct',
        context: 'direct',
        friend: { id: senderId, name: senderName },
        lastMessage: content,
        venue,
        timestamp: new Date(),
        unread: true,
        status: 'delivered',
        messages: [],
        planId
      };
      this.threads.set(threadId, newThread);
    }
    
    this.notifyListeners();
    return messageId;
  }

  markThreadAsRead(threadId: string) {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.unread = false;
      this.notifyListeners();
    }
  }

  toggleThreadPin(threadId: string) {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.isPinned = !thread.isPinned;
      this.notifyListeners();
    }
  }

  getUnreadMessageCount(): number {
    return Array.from(this.threads.values()).filter(thread => thread.unread).length;
  }

  markAllAsRead() {
    this.threads.forEach(thread => {
      thread.unread = false;
    });
    this.notifyListeners();
  }

  upsertThread(t: Partial<MessageThread> & { id: string }) {
    const existing = this.threads.get(t.id);
    if (existing) {
      Object.assign(existing, t);
    } else {
      this.threads.set(t.id, t as MessageThread);
    }
    this.notifyListeners();
  }

  simulateIncomingPings() {
    // Keep existing simulation logic
  }

  createPlanThread(
    planId: number,
    planName: string,
    participants: { id: string; name: string; avatar?: string }[],
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } },
    planStatus: 'upcoming' | 'active' | 'completed' = 'upcoming',
    planTime?: string,
    initialMessage?: string
  ): string {
    const threadId = `plan_${planId}`;
    const thread: MessageThread = {
      id: threadId,
      type: 'plan',
      threadType: 'group',
      context: 'plan',
      friend: { id: `plan_group_${planId}`, name: planName },
      lastMessage: initialMessage || `Plan "${planName}" has been created!`,
      venue,
      timestamp: new Date(),
      unread: true,
      status: 'delivered',
      messages: [],
      planId,
      planName,
      participants,
      planStatus,
      planTime
    };
    
    this.threads.set(threadId, thread);
    this.notifyListeners();
    return threadId;
  }

  sendPlanMessage(
    planId: number,
    senderId: string,
    senderName: string,
    content: string,
    planAction: 'created' | 'joined' | 'updated' | 'comment' = 'comment'
  ): string {
    const threadId = `plan_${planId}`;
    const thread = this.threads.get(threadId);
    
    if (thread) {
      thread.lastMessage = content;
      thread.timestamp = new Date();
      thread.unread = true;
      this.notifyListeners();
    }
    
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updatePlanStatus(planId: number, status: 'upcoming' | 'active' | 'completed') {
    const threadId = `plan_${planId}`;
    const thread = this.threads.get(threadId);
    
    if (thread) {
      thread.planStatus = status;
      this.notifyListeners();
    }
  }
}
