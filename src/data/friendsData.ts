
import { UserVibe, getVibeById, createVibeExpiry } from '@/types/vibeTypes';

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: 'active' | 'inactive';
  location: string | null;
  lastSeen: string;
  activity: string;
  plan: string | null;
  planDetails: PlanDetails | null;
  isNearby: boolean;
  isOnPlan: boolean;
  coordinates: { lat: number; lng: number };
  frequentPlanMate: boolean;
  // New fields for activity feed
  currentAction: 'checked-in' | 'on-the-way' | 'pre-gaming' | 'just-left' | 'offline';
  distanceFromUser: number; // in miles
  timeAgo: string; // e.g., "10m ago", "now"
  // New vibe field
  currentVibe?: UserVibe | null;
}

export interface PlanDetails {
  name: string;
  stops: string[];
  participants: number;
  nextStop: string;
  eta: string;
}

export interface FriendTab {
  id: string;
  label: string;
  count: number;
}

// Helper function to create a demo vibe
const createDemoVibe = (vibeId: string, customText?: string): UserVibe | null => {
  const vibe = getVibeById(vibeId);
  if (!vibe) return null;
  
  return {
    vibe,
    customText,
    setAt: new Date().toISOString(),
    expiresAt: createVibeExpiry()
  };
};

export const friendsData: Friend[] = [
  {
    id: 1,
    name: 'Alex Martinez',
    avatar: 'AM',
    status: 'active',
    location: 'The Rooftop',
    lastSeen: 'Now',
    activity: 'Getting cocktails with 3 friends',
    plan: 'Friday Night Crawl',
    planDetails: {
      name: 'Friday Night Crawl',
      stops: ['The Rooftop', 'Underground', 'Pulse Nightclub'],
      participants: 8,
      nextStop: 'Underground',
      eta: '9:30 PM'
    },
    isNearby: true,
    isOnPlan: true,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    frequentPlanMate: true,
    currentAction: 'checked-in',
    distanceFromUser: 0.2,
    timeAgo: 'now',
    currentVibe: createDemoVibe('hype-night', 'LFG!')
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: 'SC',
    status: 'active',
    location: 'The Rooftop',
    lastSeen: '5 min ago',
    activity: 'Dancing with Alex',
    plan: null,
    planDetails: null,
    isNearby: true,
    isOnPlan: false,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    frequentPlanMate: true,
    currentAction: 'checked-in',
    distanceFromUser: 0.2,
    timeAgo: '5m ago',
    currentVibe: createDemoVibe('going-out')
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'MJ',
    status: 'active',
    location: 'Sky Bar',
    lastSeen: '15 min ago',
    activity: 'Pre-gaming before the show',
    plan: 'Weekend Warriors',
    planDetails: {
      name: 'Weekend Warriors',
      stops: ['Sky Bar', 'Pulse Nightclub', 'Underground'],
      participants: 6,
      nextStop: 'Underground',
      eta: '11:00 PM'
    },
    isNearby: true,
    isOnPlan: true,
    coordinates: { lat: 40.7505, lng: -73.9934 },
    frequentPlanMate: true,
    currentAction: 'pre-gaming',
    distanceFromUser: 0.4,
    timeAgo: '15m ago',
    currentVibe: createDemoVibe('open-to-plans')
  },
  {
    id: 4,
    name: 'Emma Wilson',
    avatar: 'EW',
    status: 'active',
    location: 'Sky Bar',
    lastSeen: '10 min ago',
    activity: 'Pre-drinks with Mike',
    plan: 'Friday Night Crawl',
    planDetails: {
      name: 'Friday Night Crawl',
      stops: ['The Rooftop', 'Underground', 'Pulse Nightclub'],
      participants: 8,
      nextStop: 'Underground',
      eta: '9:30 PM'
    },
    isNearby: true,
    isOnPlan: true,
    coordinates: { lat: 40.7282, lng: -74.0776 },
    frequentPlanMate: true,
    currentAction: 'pre-gaming',
    distanceFromUser: 0.4,
    timeAgo: '10m ago',
    currentVibe: createDemoVibe('chill-mode', 'Pre-game vibes')
  },
  {
    id: 5,
    name: 'Jordan Lee',
    avatar: 'JL',
    status: 'active',
    location: 'Pulse Nightclub',
    lastSeen: '20 min ago',
    activity: 'On the way to meet friends',
    plan: null,
    planDetails: null,
    isNearby: true,
    isOnPlan: false,
    coordinates: { lat: 40.6892, lng: -74.0445 },
    frequentPlanMate: false,
    currentAction: 'on-the-way',
    distanceFromUser: 0.6,
    timeAgo: '20m ago',
    currentVibe: createDemoVibe('just-checking')
  },
  {
    id: 6,
    name: 'Taylor Swift',
    avatar: 'TS',
    status: 'active',
    location: 'Pulse Nightclub',
    lastSeen: '25 min ago',
    activity: 'Dancing the night away',
    plan: null,
    planDetails: null,
    isNearby: true,
    isOnPlan: false,
    coordinates: { lat: 40.6892, lng: -74.0445 },
    frequentPlanMate: false,
    currentAction: 'on-the-way',
    distanceFromUser: 0.6,
    timeAgo: '25m ago',
    currentVibe: createDemoVibe('staying-in', 'Netflix tonight')
  },
  {
    id: 7,
    name: 'Chris Park',
    avatar: 'CP',
    status: 'inactive',
    location: null,
    lastSeen: '2 hours ago',
    activity: 'Last seen at Underground',
    plan: null,
    planDetails: null,
    isNearby: false,
    isOnPlan: false,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    frequentPlanMate: true,
    currentAction: 'offline',
    distanceFromUser: 2.5,
    timeAgo: '2h ago',
    currentVibe: null
  }
];

export const generateFriendTabs = (friends: Friend[]): FriendTab[] => [
  { id: 'activity', label: 'Activity', count: friends.filter(f => f.status === 'active').length },
  { id: 'nearby', label: 'Nearby', count: friends.filter(f => f.isNearby).length },
  { id: 'all', label: 'All', count: friends.length }
];
