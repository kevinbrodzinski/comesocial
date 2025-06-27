import { PlannerDraft } from '@/types/coPlanTypes';
import { Friend } from '@/data/friendsData';

// Mock participants for the plans
export const mockParticipants: Friend[] = [
  {
    id: 1,
    name: 'Alex Chen',
    avatar: 'AC',
    status: 'active',
    location: 'Downtown',
    lastSeen: 'Currently online',
    activity: 'Available for planning',
    plan: null,
    planDetails: null,
    isNearby: true,
    isOnPlan: false,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    frequentPlanMate: true,
    currentAction: 'checked-in',
    distanceFromUser: 0.2,
    timeAgo: 'now',
    currentVibe: null
  },
  {
    id: 2,
    name: 'Jordan Smith',
    avatar: 'JS',
    status: 'inactive',
    location: null,
    lastSeen: '2 hours ago',
    activity: 'Last seen at home',
    plan: null,
    planDetails: null,
    isNearby: false,
    isOnPlan: false,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    frequentPlanMate: false,
    currentAction: 'offline',
    distanceFromUser: 5.0,
    timeAgo: '2h ago',
    currentVibe: null
  },
  {
    id: 3,
    name: 'Taylor Brown',
    avatar: 'TB',
    status: 'active',
    location: 'Coffee Shop',
    lastSeen: '1 hour ago',
    activity: 'Getting coffee',
    plan: null,
    planDetails: null,
    isNearby: true,
    isOnPlan: false,
    coordinates: { lat: 40.7505, lng: -73.9934 },
    frequentPlanMate: true,
    currentAction: 'checked-in',
    distanceFromUser: 0.8,
    timeAgo: '1h ago',
    currentVibe: null
  },
  {
    id: 4,
    name: 'Casey Wilson',
    avatar: 'CW',
    status: 'active',
    location: 'Gym',
    lastSeen: '30 minutes ago',
    activity: 'Working out',
    plan: null,
    planDetails: null,
    isNearby: true,
    isOnPlan: false,
    coordinates: { lat: 40.7282, lng: -74.0776 },
    frequentPlanMate: true,
    currentAction: 'checked-in',
    distanceFromUser: 1.2,
    timeAgo: '30m ago',
    currentVibe: null
  }
];

// Sample plans for testing different roles
export const samplePlans: PlannerDraft[] = [
  {
    id: 'sample_plan_1_host',
    title: 'Plan 1: You are the HOST',
    description: 'This plan demonstrates HOST permissions - you can edit everything',
    planType: 'night_out',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    participants: [mockParticipants[0], mockParticipants[1], mockParticipants[2]],
    all_can_edit: false,
    host_id: 1, // Current user is host
    co_planners: [], // No co-planners
    status: 'draft',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updated_at: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 'sample_plan_2_coplanner',
    title: 'Plan 2: You are a CO-PLANNER',
    description: 'This plan demonstrates CO-PLANNER permissions - you can edit but not lock',
    planType: 'dinner',
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    participants: [mockParticipants[0], mockParticipants[2], mockParticipants[3]],
    all_can_edit: false,
    host_id: 3, // Taylor Brown is host
    co_planners: [1], // Current user is co-planner
    status: 'draft',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updated_at: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  },
  {
    id: 'sample_plan_3_guest',
    title: 'Plan 3: You are a GUEST',
    description: 'This plan demonstrates GUEST permissions - read-only with suggestions',
    planType: 'drinks',
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    participants: [mockParticipants[0], mockParticipants[1], mockParticipants[3]],
    all_can_edit: false,
    host_id: 4, // Casey Wilson is host
    co_planners: [], // No co-planners, current user is just a participant
    status: 'draft',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updated_at: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  }
];

// Test user configurations
export const testUsers = {
  1: { name: 'Alex Chen', role: 'Primary Test User' },
  2: { name: 'Jordan Smith', role: 'Guest on all plans' },
  3: { name: 'Taylor Brown', role: 'Host of Plan 2' },
  4: { name: 'Casey Wilson', role: 'Host of Plan 3' }
};

// Helper to get role summary for current user
export const getRoleSummary = (userId: number) => {
  const roles = samplePlans.map(plan => {
    if (plan.host_id === userId) return 'HOST';
    if (plan.co_planners?.includes(userId)) return 'CO-PLANNER';
    return 'GUEST';
  });

  return {
    user: testUsers[userId as keyof typeof testUsers],
    roles: [
      { plan: 'Plan 1', role: roles[0] },
      { plan: 'Plan 2', role: roles[1] },
      { plan: 'Plan 3', role: roles[2] }
    ]
  };
};
