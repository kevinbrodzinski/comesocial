
export interface Venue {
  name: string;
  type: string;
  distance: string;
  vibe: string;
  features: string[];
  crowdLevel: number;
}

export interface Message {
  id: number;
  type: 'ai' | 'user' | 'followup';
  content: string;
  timestamp: Date;
  venues?: Venue[];
  quickReplies?: string[];
  followUpContext?: any;
  image?: string; // Added image support
}
