export interface MessageThread {
  id: string;
  type: 'ping' | 'message' | 'plan';
  threadType: 'direct' | 'group' | 'map-group';
  context: 'direct' | 'plan' | 'map'; // New field for map message center
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
  isActiveAtVenue?: boolean;
  // Plan-specific fields
  planId?: number;
  planName?: string;
  participants?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  planStatus?: 'upcoming' | 'active' | 'completed';
  planTime?: string;
  // User's RSVP status for this plan
  userRsvp?: 'going' | 'maybe' | 'cant_go';
  // Map-specific metadata
  meta?: {
    pinId?: string;
    coordinates?: { lat: number; lng: number };
  };
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'ping' | 'message' | 'plan';
  venue?: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  // Plan-specific fields
  planId?: number;
  planAction?: 'created' | 'joined' | 'updated' | 'comment';
}

export interface Notification {
  id: string;
  type: 'friend-ping' | 'plan-invite' | 'check-in' | 'plan-update' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  friendId?: string;
  planId?: number;
  venueId?: number;
  venue?: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  autoExpire?: number; // seconds - only for non-persistent notifications
  read?: boolean;
}
