
import CoPlanService from './CoPlanService';
import { Friend } from '@/data/friendsData';

export interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'action' | 'plan_update' | 'user_join' | 'user_leave';
  content: string;
  timestamp: Date;
  draftId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  updateType?: 'stop_added' | 'stop_removed' | 'stop_edited' | 'title_changed' | 'description_changed' | 'plan_locked' | 'plan_unlocked';
  stopId?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: Date;
}

export class ChatService {
  private static instance: ChatService;
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  getParticipants(draftId: string): ChatParticipant[] {
    const coPlanService = CoPlanService.getInstance();
    const draft = coPlanService.getDraft(draftId);
    
    if (!draft) return [];

    // Convert draft participants to chat participants
    return draft.participants.map(participant => ({
      id: participant.id.toString(),
      name: participant.name,
      avatar: participant.avatar,
      isOnline: Math.random() > 0.3, // Mock online status
      isTyping: false,
      lastSeen: new Date()
    }));
  }

  sendMessage(draftId: string, content: string, senderId: string = 'current-user', senderName: string = 'You', senderAvatar: string = 'YU'): ChatMessage {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content,
      timestamp: new Date(),
      draftId,
      senderId,
      senderName,
      senderAvatar
    };

    const existing = this.getMessages(draftId);
    existing.push(message);
    localStorage.setItem(`chat_messages_${draftId}`, JSON.stringify(existing));

    return message;
  }

  sendPlanUpdate(draftId: string, updateType: ChatMessage['updateType'], content: string, userId: string = 'current-user', userName: string = 'You', userAvatar: string = 'YU', stopId?: string): ChatMessage {
    const message: ChatMessage = {
      id: `update_${Date.now()}`,
      type: 'plan_update',
      content,
      timestamp: new Date(),
      draftId,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      updateType,
      stopId
    };

    const existing = this.getMessages(draftId);
    existing.push(message);
    localStorage.setItem(`chat_messages_${draftId}`, JSON.stringify(existing));

    return message;
  }

  sendActionMessage(draftId: string, action: string): ChatMessage {
    const message: ChatMessage = {
      id: `action_${Date.now()}`,
      type: 'action',
      content: `Action: ${action}`,
      timestamp: new Date(),
      draftId,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: 'YU'
    };

    const existing = this.getMessages(draftId);
    existing.push(message);
    localStorage.setItem(`chat_messages_${draftId}`, JSON.stringify(existing));

    return message;
  }

  createSystemMessage(draftId: string, content: string): ChatMessage {
    const message: ChatMessage = {
      id: `system_${Date.now()}`,
      type: 'system',
      content,
      timestamp: new Date(),
      draftId
    };

    const existing = this.getMessages(draftId);
    existing.push(message);
    localStorage.setItem(`chat_messages_${draftId}`, JSON.stringify(existing));

    return message;
  }

  setUserTyping(draftId: string, userId: string, isTyping: boolean) {
    // Clear existing timeout
    const timeoutKey = `${draftId}_${userId}`;
    const existingTimeout = this.typingTimeouts.get(timeoutKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    if (isTyping) {
      // Set typing timeout to clear after 3 seconds
      const timeout = setTimeout(() => {
        this.setUserTyping(draftId, userId, false);
      }, 3000);
      this.typingTimeouts.set(timeoutKey, timeout);
    }

    // Update participants typing status in localStorage
    const participants = this.getParticipants(draftId);
    const updated = participants.map(p => 
      p.id === userId ? { ...p, isTyping } : p
    );
    localStorage.setItem(`chat_participants_${draftId}`, JSON.stringify(updated));
  }

  getMessages(draftId: string): ChatMessage[] {
    const stored = localStorage.getItem(`chat_messages_${draftId}`);
    return stored ? JSON.parse(stored) : [];
  }

  markIntroRead(draftId: string): void {
    localStorage.setItem(`intro_read_${draftId}`, 'true');
  }

  hasUnreadIntro(draftId: string): boolean {
    return !localStorage.getItem(`intro_read_${draftId}`);
  }
}

export default ChatService;
