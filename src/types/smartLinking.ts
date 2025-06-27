
export interface VenueReference {
  id: number;
  name: string;
  position: number;
  length: number;
  type: 'venue';
  metadata?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    isFavorite?: boolean;
  };
}

export interface FriendReference {
  id: number;
  name: string;
  position: number;
  length: number;
  type: 'friend';
  avatar?: string;
  metadata?: {
    isOnline?: boolean;
    mutualFriends?: number;
    lastSeen?: string;
  };
}

export interface PlanReference {
  id: number;
  name: string;
  position: number;
  length: number;
  type: 'plan';
  status?: 'active' | 'planned' | 'completed';
  metadata?: {
    participantCount?: number;
    startTime?: string;
    isJoined?: boolean;
    canJoin?: boolean;
  };
}

export type SmartReference = VenueReference | FriendReference | PlanReference;

export interface SmartSuggestion {
  id: number;
  name: string;
  type: 'venue' | 'friend' | 'plan';
  subtitle?: string;
  metadata?: any;
}

export interface MessageMetadata {
  venueReferences?: VenueReference[];
  friendReferences?: FriendReference[];
  planReferences?: PlanReference[];
}

export interface SmartSuggestionGroups {
  venues: SmartSuggestion[];
  friends: SmartSuggestion[];
  plans: SmartSuggestion[];
}

export interface SmartTagAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export interface SmartTagActionHandlers {
  onVenueAction?: (action: string, venue: VenueReference) => void;
  onFriendAction?: (action: string, friend: FriendReference) => void;
  onPlanAction?: (action: string, plan: PlanReference) => void;
}
