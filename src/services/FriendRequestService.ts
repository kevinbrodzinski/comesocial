
interface FriendRequest {
  id: string;
  type: 'incoming' | 'outgoing';
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  mutualFriends: string[];
  message?: string;
  requestedAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
}

interface FriendRequestState {
  requests: FriendRequest[];
  unreadCount: number;
}

class FriendRequestService {
  private static instance: FriendRequestService;
  private state: FriendRequestState = {
    requests: [],
    unreadCount: 0
  };
  private listeners: Set<(state: FriendRequestState) => void> = new Set();

  static getInstance(): FriendRequestService {
    if (!FriendRequestService.instance) {
      FriendRequestService.instance = new FriendRequestService();
      FriendRequestService.instance.initializeMockData();
    }
    return FriendRequestService.instance;
  }

  private initializeMockData() {
    // Add some mock friend requests for demo
    this.state.requests = [
      {
        id: '1',
        type: 'incoming',
        friendId: 'user_1',
        friendName: 'Emma Stone',
        friendAvatar: 'ES',
        mutualFriends: ['Alex Martinez', 'Sarah Johnson'],
        message: 'Hey! We met at the conference last week. Would love to connect!',
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending'
      },
      {
        id: '2',
        type: 'incoming',
        friendId: 'user_2',
        friendName: 'Ryan Gosling',
        friendAvatar: 'RG',
        mutualFriends: ['Maya Patel'],
        requestedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: 'pending'
      }
    ];
    this.state.unreadCount = this.state.requests.filter(r => r.status === 'pending' && r.type === 'incoming').length;
  }

  subscribe(listener: (state: FriendRequestState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  getState(): FriendRequestState {
    return { ...this.state };
  }

  getUnreadCount(): number {
    return this.state.unreadCount;
  }

  getPendingRequests(): FriendRequest[] {
    return this.state.requests.filter(r => r.status === 'pending');
  }

  getIncomingRequests(): FriendRequest[] {
    return this.state.requests.filter(r => r.type === 'incoming' && r.status === 'pending');
  }

  getOutgoingRequests(): FriendRequest[] {
    return this.state.requests.filter(r => r.type === 'outgoing' && r.status === 'pending');
  }

  sendFriendRequest(friendId: string, friendName: string, message?: string): string {
    const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newRequest: FriendRequest = {
      id: requestId,
      type: 'outgoing',
      friendId,
      friendName,
      mutualFriends: [],
      message,
      requestedAt: new Date(),
      status: 'pending'
    };

    this.state.requests.push(newRequest);
    this.notify();
    return requestId;
  }

  receiveNewRequest(friendId: string, friendName: string, friendAvatar?: string, mutualFriends: string[] = [], message?: string): string {
    const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newRequest: FriendRequest = {
      id: requestId,
      type: 'incoming',
      friendId,
      friendName,
      friendAvatar,
      mutualFriends,
      message,
      requestedAt: new Date(),
      status: 'pending'
    };

    this.state.requests.push(newRequest);
    this.state.unreadCount++;
    this.notify();
    return requestId;
  }

  respondToRequest(requestId: string, response: 'accepted' | 'declined'): FriendRequest | null {
    const request = this.state.requests.find(r => r.id === requestId);
    if (!request) return null;

    const wasIncomingPending = request.type === 'incoming' && request.status === 'pending';
    request.status = response;
    
    if (wasIncomingPending) {
      this.state.unreadCount = Math.max(0, this.state.unreadCount - 1);
    }
    
    this.notify();
    return request;
  }

  cancelRequest(requestId: string): FriendRequest | null {
    const request = this.state.requests.find(r => r.id === requestId);
    if (!request) return null;

    request.status = 'cancelled';
    this.notify();
    return request;
  }

  markAsRead() {
    this.state.unreadCount = 0;
    this.notify();
  }

  // Simulate receiving new friend requests for demo
  simulateNewRequest() {
    const mockRequests = [
      {
        friendId: 'user_3',
        friendName: 'Jennifer Lawrence',
        friendAvatar: 'JL',
        mutualFriends: ['Chris Evans', 'Emma Stone'],
        message: 'Hi! Loved your recent post about the new restaurant downtown!'
      },
      {
        friendId: 'user_4',
        friendName: 'Michael B. Jordan',
        friendAvatar: 'MJ',
        mutualFriends: ['Ryan Gosling'],
        message: 'Hey! We should grab coffee sometime.'
      }
    ];

    const randomRequest = mockRequests[Math.floor(Math.random() * mockRequests.length)];
    this.receiveNewRequest(
      randomRequest.friendId,
      randomRequest.friendName,
      randomRequest.friendAvatar,
      randomRequest.mutualFriends,
      randomRequest.message
    );
  }
}

export default FriendRequestService;
export type { FriendRequest, FriendRequestState };
