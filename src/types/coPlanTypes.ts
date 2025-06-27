
import { Friend } from '@/data/friendsData';

export interface PlannerDraft {
  id: string;
  title: string;
  description: string;
  planType?: string;
  date: string;
  time: string;
  participants: Friend[];
  all_can_edit: boolean;
  host_id: number;
  co_planners?: number[]; // Added co_planners property
  status: 'draft' | 'active' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface CoPlanInvitation {
  id: string;
  draft_id: string;
  participant_id: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: Date;
}

export interface CoPlanUpdate {
  field: string;
  value: any;
  user_id: number;
  timestamp: Date;
}
