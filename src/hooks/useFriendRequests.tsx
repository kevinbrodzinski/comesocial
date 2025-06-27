
import { useState, useEffect } from 'react';
import FriendRequestService, { FriendRequest, FriendRequestState } from '../services/FriendRequestService';
import { useToast } from './use-toast';

export const useFriendRequests = () => {
  const [state, setState] = useState<FriendRequestState>({
    requests: [],
    unreadCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const service = FriendRequestService.getInstance();
    
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
      setIsLoading(false);
    });

    // Get initial state
    setState(service.getState());
    setIsLoading(false);

    return () => {
      unsubscribe();
    };
  }, []);

  const acceptRequest = (requestId: string) => {
    const service = FriendRequestService.getInstance();
    const request = service.respondToRequest(requestId, 'accepted');
    
    if (request) {
      toast({
        title: "Friend request accepted! 🎉",
        description: `You and ${request.friendName} are now friends`,
      });
    }
  };

  const declineRequest = (requestId: string) => {
    const service = FriendRequestService.getInstance();
    const request = service.respondToRequest(requestId, 'declined');
    
    if (request) {
      toast({
        title: "Request declined",
        description: `Declined friend request from ${request.friendName}`,
      });
    }
  };

  const cancelRequest = (requestId: string) => {
    const service = FriendRequestService.getInstance();
    const request = service.cancelRequest(requestId);
    
    if (request) {
      toast({
        title: "Request cancelled",
        description: `Cancelled friend request to ${request.friendName}`,
      });
    }
  };

  const markAsRead = () => {
    FriendRequestService.getInstance().markAsRead();
  };

  const sendFriendRequest = (friendId: string, friendName: string, message?: string) => {
    const service = FriendRequestService.getInstance();
    service.sendFriendRequest(friendId, friendName, message);
    
    toast({
      title: "Friend request sent! 📤",
      description: `Sent friend request to ${friendName}`,
    });
  };

  return {
    requests: state.requests,
    unreadCount: state.unreadCount,
    isLoading,
    pendingRequests: state.requests.filter(r => r.status === 'pending'),
    incomingRequests: state.requests.filter(r => r.type === 'incoming' && r.status === 'pending'),
    outgoingRequests: state.requests.filter(r => r.type === 'outgoing' && r.status === 'pending'),
    acceptRequest,
    declineRequest,
    cancelRequest,
    markAsRead,
    sendFriendRequest
  };
};
