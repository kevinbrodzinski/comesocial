
export interface DraftStop {
  id: string;
  venue: string;
  time: string;
  duration: number;
  notes: string;
  order: number;
}

export interface DraftPresence {
  user_id: number;
  name: string;
  avatar: string;
  is_active: boolean;
  editing_field?: string;
  editing_stop_id?: string;
  last_seen: Date;
}

export interface DraftVote {
  id: string;
  type: 'move_stop' | 'add_stop' | 'remove_stop';
  proposed_by: number;
  stop_id: string;
  new_position?: number;
  votes: number[];
  total_participants: number;
  description: string;
}

export interface DraftState {
  id: string;
  is_locked: boolean;
  locked_by?: number;
  locked_at?: Date;
  stops: DraftStop[];
  votes: DraftVote[];
  presence: DraftPresence[];
  chat_open: boolean;
}
