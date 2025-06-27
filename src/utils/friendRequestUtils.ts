
import { FriendRequest } from '../services/FriendRequestService';
import { Friend } from '../data/friendsData';

export const transformFriendRequestToFriend = (request: FriendRequest): Friend => {
  // Create a mock friend object from the friend request data
  return {
    id: parseInt(request.friendId.replace('user_', '')) || Math.random() * 1000,
    name: request.friendName,
    avatar: request.friendAvatar || request.friendName.slice(0, 2).toUpperCase(),
    status: 'inactive' as const,
    location: null,
    lastSeen: 'Unknown',
    activity: 'Not currently active',
    plan: null,
    planDetails: null,
    isNearby: false,
    isOnPlan: false,
    coordinates: { lat: 40.7128, lng: -74.0060 }, // Default NYC coordinates
    frequentPlanMate: false,
    currentAction: 'offline' as const,
    distanceFromUser: 0,
    timeAgo: 'Unknown',
    currentVibe: null
  };
};

export const getInteractionHistory = (request: FriendRequest): string[] => {
  // Enhanced interaction history for decision-making
  const interactions: string[] = [];

  // Mutual friends context
  if (request.mutualFriends.length > 0) {
    if (request.mutualFriends.length === 1) {
      interactions.push(`Connected through ${request.mutualFriends[0]}`);
    } else {
      interactions.push(`${request.mutualFriends.length} mutual friends including ${request.mutualFriends[0]}`);
    }
  } else {
    interactions.push('No mutual friends yet');
  }

  // Mock interaction data - in real app this would come from backend
  const hasMetBefore = Math.random() > 0.7;
  const hasMessaged = Math.random() > 0.8;
  const hasAttendedSameEvents = Math.random() > 0.6;

  if (hasMetBefore) {
    interactions.push('Met in person before');
  } else {
    interactions.push('Haven\'t met in person');
  }

  if (hasMessaged) {
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    interactions.push(`Last messaged ${daysAgo} days ago`);
  } else {
    interactions.push('No previous messages');
  }

  if (hasAttendedSameEvents) {
    const eventCount = Math.floor(Math.random() * 3) + 1;
    interactions.push(`Attended ${eventCount} same event${eventCount > 1 ? 's' : ''}`);
  } else {
    interactions.push('No shared events yet');
  }

  // Source context
  const sources = ['contacts', 'nearby users', 'event attendees', 'mutual friend suggestion'];
  const source = sources[Math.floor(Math.random() * sources.length)];
  interactions.push(`Found via ${source}`);

  return interactions;
};

export const getTrustScore = (request: FriendRequest): number => {
  // Calculate a trust score based on available data
  let score = 0;
  
  // Mutual friends boost trust significantly
  score += Math.min(request.mutualFriends.length * 20, 60);
  
  // Personal message shows genuine interest
  if (request.message && request.message.length > 10) {
    score += 20;
  }
  
  // Base score for being a valid request
  score += 10;
  
  return Math.min(score, 100);
};
