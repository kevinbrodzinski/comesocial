
import { Home, Map, Users, MessageCircle, User } from 'lucide-react';

export const navigationTabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'map', icon: Map, label: 'Map' },
  { id: 'feed', icon: Users, label: 'Feed' },
  { id: 'planner', icon: MessageCircle, label: 'Planner' },
  { id: 'friends', icon: User, label: 'Friends' },
];

// Export individual tab definitions for type safety
export const validTabs = ['home', 'map', 'feed', 'planner', 'friends'] as const;
export type ValidTab = typeof validTabs[number];
