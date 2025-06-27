import { MessageService } from './MessageService';
import { LegacyNotificationService } from './LegacyNotificationService';
import { MessageThread, Message, Notification } from '../types/messaging';

class NotificationService {
  private static instance: NotificationService;
  private messageService: MessageService;
  private legacyNotificationService: LegacyNotificationService;

  constructor() {
    this.messageService = new MessageService();
    this.legacyNotificationService = new LegacyNotificationService();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Legacy notification methods - delegate to LegacyNotificationService
  subscribe(listener: (notifications: Notification[]) => void) {
    return this.legacyNotificationService.subscribe(listener);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    return this.legacyNotificationService.addNotification(notification);
  }

  removeNotification(id: string) {
    this.legacyNotificationService.removeNotification(id);
  }

  clearAll() {
    this.legacyNotificationService.clearAll();
  }

  getNotifications(): Notification[] {
    return this.legacyNotificationService.getNotifications();
  }

  addFriendRequestNotification(friendName: string, type: 'received' | 'accepted' | 'declined') {
    return this.legacyNotificationService.addFriendRequestNotification(friendName, type);
  }

  sendPlanInvitation(planId: number, planName: string, recipientIds: number[]) {
    return this.legacyNotificationService.sendPlanInvitation(planId, planName, recipientIds);
  }

  // Message methods - delegate to MessageService
  subscribeToMessages(listener: (threads: MessageThread[]) => void) {
    return this.messageService.subscribeToMessages(listener);
  }

  sendMessage(
    recipientId: string, 
    recipientName: string, 
    content: string, 
    type: 'ping' | 'message' | 'plan' = 'message',
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } },
    planId?: number
  ): string {
    return this.messageService.sendMessage(recipientId, recipientName, content, type, venue, planId);
  }

  receiveMessage(
    senderId: string,
    senderName: string,
    content: string,
    type: 'ping' | 'message' | 'plan' = 'message',
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } },
    planId?: number
  ): string {
    return this.messageService.receiveMessage(senderId, senderName, content, type, venue, planId);
  }

  getMessageThreads(): MessageThread[] {
    return this.messageService.getMessageThreads();
  }

  markThreadAsRead(threadId: string) {
    this.messageService.markThreadAsRead(threadId);
  }

  toggleThreadPin(threadId: string) {
    this.messageService.toggleThreadPin(threadId);
  }

  getUnreadMessageCount(): number {
    return this.messageService.getUnreadMessageCount();
  }

  markAllAsRead() {
    this.messageService.markAllAsRead();
  }

  // NEW: Public method for upserting threads
  upsertThread(t: Partial<MessageThread> & { id: string }) {
    this.messageService.upsertThread(t);
  }

  simulateIncomingPings() {
    this.messageService.simulateIncomingPings();
  }

  // Plan-specific messaging methods
  createPlanThread(
    planId: number,
    planName: string,
    participants: { id: string; name: string; avatar?: string }[],
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } },
    planStatus: 'upcoming' | 'active' | 'completed' = 'upcoming',
    planTime?: string,
    initialMessage?: string
  ): string {
    return this.messageService.createPlanThread(
      planId,
      planName,
      participants,
      venue,
      planStatus,
      planTime,
      initialMessage
    );
  }

  sendPlanMessage(
    planId: number,
    senderId: string,
    senderName: string,
    content: string,
    planAction: 'created' | 'joined' | 'updated' | 'comment' = 'comment'
  ): string {
    return this.messageService.sendPlanMessage(planId, senderId, senderName, content, planAction);
  }

  updatePlanStatus(planId: number, status: 'upcoming' | 'active' | 'completed') {
    this.messageService.updatePlanStatus(planId, status);
  }

  // Enhanced ping methods
  sendFriendPing(
    friendId: string, 
    friendName: string, 
    message: string,
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } }
  ) {
    // Send the ping as a persistent message
    const messageId = this.sendMessage(friendId, friendName, message, 'ping', venue);

    // Also create a temporary notification for immediate feedback
    this.addNotification({
      type: 'friend-ping',
      title: 'Ping Sent!',
      message: `Sent a ping to ${friendName}${venue ? ` at ${venue.name}` : ''}`,
      friendId,
      venue,
      autoExpire: 5
    });

    return messageId;
  }

  receiveFriendPing(
    friendId: string,
    friendName: string,
    message: string,
    venue?: { name: string; address: string; coordinates?: { lat: number; lng: number } }
  ) {
    return this.receiveMessage(friendId, friendName, message, 'ping', venue);
  }
}

export default NotificationService;
export type { MessageThread, Message, Notification };
