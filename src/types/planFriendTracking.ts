
import { Friend } from '@/data/friendsData';

export interface FriendStatus {
  friendId: number;
  status: 'checked-in' | 'on-the-way' | 'no-response' | 'left-early';
  eta?: string;
  lastUpdate: string;
  stopId?: number;
}

export interface StopAttendance {
  stopId: number;
  friendsPresent: Friend[];
  friendsEnRoute: Friend[];
  friendsNoResponse: Friend[];
  friendsLeftEarly: Friend[];
}

export interface PlanFriendTracking {
  planId: number;
  friendStatuses: FriendStatus[];
  stopAttendance: StopAttendance[];
  lastUpdated: string;
}
