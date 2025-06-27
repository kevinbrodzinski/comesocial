
import { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import InvitationService from '../services/InvitationService';
import FriendRequestService from '../services/FriendRequestService';
import type { MessageThread } from '../services/NotificationService';

interface NotificationBadgeState {
  unreadCount: number;
  hasUnread: boolean;
  invitationCount: number;
  messageCount: number;
  friendRequestCount: number;
}

export const useNotificationBadge = () => {
  const [badgeState, setBadgeState] = useState<NotificationBadgeState>({
    unreadCount: 0,
    hasUnread: false,
    invitationCount: 0,
    messageCount: 0,
    friendRequestCount: 0
  });

  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    const invitationService = InvitationService.getInstance();
    const friendRequestService = FriendRequestService.getInstance();

    // Subscribe to message updates
    const unsubscribeMessages = notificationService.subscribeToMessages((threads: MessageThread[]) => {
      const messageCount = threads.filter(thread => thread.unread).length;
      setBadgeState(prev => ({
        ...prev,
        messageCount,
        unreadCount: messageCount + prev.invitationCount + prev.friendRequestCount,
        hasUnread: (messageCount + prev.invitationCount + prev.friendRequestCount) > 0
      }));
    });

    // Subscribe to invitation updates
    const unsubscribeInvitations = invitationService.subscribe((state) => {
      const invitationCount = state.unreadCount;
      setBadgeState(prev => ({
        ...prev,
        invitationCount,
        unreadCount: prev.messageCount + invitationCount + prev.friendRequestCount,
        hasUnread: (prev.messageCount + invitationCount + prev.friendRequestCount) > 0
      }));
    });

    // Subscribe to friend request updates
    const unsubscribeFriendRequests = friendRequestService.subscribe((state) => {
      const friendRequestCount = state.unreadCount;
      setBadgeState(prev => ({
        ...prev,
        friendRequestCount,
        unreadCount: prev.messageCount + prev.invitationCount + friendRequestCount,
        hasUnread: (prev.messageCount + prev.invitationCount + friendRequestCount) > 0
      }));
    });

    // Get initial states
    const initialMessageCount = notificationService.getUnreadMessageCount();
    const initialInvitationCount = invitationService.getUnreadCount();
    const initialFriendRequestCount = friendRequestService.getUnreadCount();
    
    setBadgeState({
      messageCount: initialMessageCount,
      invitationCount: initialInvitationCount,
      friendRequestCount: initialFriendRequestCount,
      unreadCount: initialMessageCount + initialInvitationCount + initialFriendRequestCount,
      hasUnread: (initialMessageCount + initialInvitationCount + initialFriendRequestCount) > 0
    });

    // Simulate incoming notifications for demo purposes
    setTimeout(() => {
      notificationService.simulateIncomingPings();
    }, 3000);

    setTimeout(() => {
      invitationService.simulateNewInvitation();
    }, 8000);

    setTimeout(() => {
      friendRequestService.simulateNewRequest();
    }, 12000);

    // Return cleanup function
    return () => {
      unsubscribeMessages();
      unsubscribeInvitations();
      unsubscribeFriendRequests();
    };
  }, []);

  const markAsRead = () => {
    setBadgeState(prev => ({ 
      ...prev, 
      unreadCount: 0, 
      hasUnread: false,
      messageCount: 0,
      invitationCount: 0,
      friendRequestCount: 0
    }));
    
    // Mark services as read
    NotificationService.getInstance().markAllAsRead();
    InvitationService.getInstance().markAsRead();
    FriendRequestService.getInstance().markAsRead();
  };

  const incrementUnread = () => {
    setBadgeState(prev => ({
      ...prev,
      unreadCount: prev.unreadCount + 1,
      hasUnread: true
    }));
  };

  return {
    ...badgeState,
    markAsRead,
    incrementUnread
  };
};
